<template>
  <div class="floating-panel-container">
    <!-- 原始内容插槽，用于正常渲染 -->
    <div ref="contentRef" class="floating-panel-content">
      <slot></slot>
    </div>
    
    <!-- 浮动面板，当内容不在视口内时显示 -->
    <transition name="slide-in-right">
      <div 
        v-show="showFloatingPanel"
        ref="floatingRef"
        class="floating-panel"
        :style="floatingPanelStyle"
        @click="scrollToContent"
      >
        <div class="floating-panel-mini">
          <slot name="mini-content">
            <!-- 默认显示缩小版的内容 -->
            <div class="mini-content-wrapper">
              <!-- 使用相同的插槽内容，但通过CSS进行缩放 -->
              <div class="scaled-content" :style="miniContentStyle">
                <slot></slot>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';

// 创建全局状态，用于跟踪所有显示的浮动面板
// 使用 window 对象来存储全局状态，确保所有组件实例共享同一个状态
if (!window.floatingPanelsGlobalState) {
  window.floatingPanelsGlobalState = {
    panels: [],
    updateCallbacks: [], // 存储所有面板的更新回调函数
    
    registerPanel(panelId, panelHeight, panelSort = 0) {
      // 如果面板已存在，先移除
      this.unregisterPanel(panelId);
      
      // 添加新面板到数组
      this.panels.push({
        id: panelId,
        height: panelHeight,
        sort: panelSort
      });
      
      // 按 sort 值降序排序，sort 值越大越靠近底部
      this.panels.sort((a, b) => b.sort - a.sort);
      
      // 添加调试打印信息
      console.log(`[FloatingPanel] 注册面板: ${panelId}, 高度: ${panelHeight}, 排序: ${panelSort}`);
      console.log(`[FloatingPanel] 当前所有面板:`, this.panels.map(p => ({ id: p.id, height: p.height, sort: p.sort })));
      
      // 通知所有面板更新位置
      this.notifyAllPanels();
    },
    
    unregisterPanel(panelId) {
      console.log(`[FloatingPanel] 注销面板: ${panelId}`);
      this.panels = this.panels.filter(panel => panel.id !== panelId);
      console.log(`[FloatingPanel] 注销后剩余面板:`, this.panels.map(p => ({ id: p.id, height: p.height, sort: p.sort })));
      
      // 通知所有面板更新位置
      this.notifyAllPanels();
    },
    
    getPanelPosition(panelId) {
      const position = this.panels.findIndex(panel => panel.id === panelId);
      console.log(`[FloatingPanel] 面板 ${panelId} 的位置: ${position}`);
      return position;
    },
    
    // 获取面板总数
    getPanelCount() {
      return this.panels.length;
    },
    
    // 计算面板的底部位置
    calculatePanelBottom(panelIndex, panelHeight, spacing) {
      let bottomPosition = 20; // 基础底部距离
      
      // 如果面板索引无效，返回默认位置
      if (panelIndex < 0 || panelIndex >= this.panels.length) {
        console.log(`[FloatingPanel] 无效的面板索引: ${panelIndex}, 使用默认位置`);
        return bottomPosition;
      }
      
      // 计算当前面板下方所有面板的总高度
      for (let i = 0; i < panelIndex; i++) {
        bottomPosition += this.panels[i].height + spacing;
      }
      
      console.log(`[FloatingPanel] 计算面板底部位置 - 索引: ${panelIndex}, 高度: ${panelHeight}, 间距: ${spacing}, 底部位置: ${bottomPosition}`);
      return bottomPosition;
    },
    
    // 注册面板更新回调
    registerUpdateCallback(callback) {
      if (!this.updateCallbacks.includes(callback)) {
        this.updateCallbacks.push(callback);
      }
    },
    
    // 注销面板更新回调
    unregisterUpdateCallback(callback) {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    },
    
    // 通知所有面板更新位置
    notifyAllPanels() {
      console.log(`[FloatingPanel] 通知所有面板更新位置`);
      this.updateCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error(`[FloatingPanel] 调用更新回调时出错:`, error);
        }
      });
    }
  };
}

const props = defineProps({
  // 滚动容器元素，默认为 window
  scrollContainer: {
    type: [String, Object],
    default: 'window'
  },
  // 浮动面板宽度
  floatingWidth: {
    type: String,
    default: '300px'
  },
  // 浮动面板高度
  floatingHeight: {
    type: String,
    default: '200px'
  },
  // 缩放比例
  scale: {
    type: Number,
    default: 0.4
  },
  // 防抖延迟时间（毫秒）
  debounceTime: {
    type: Number,
    default: 100
  },
  // 面板间距（像素）
  panelSpacing: {
    type: Number,
    default: 10
  },
  // 监听触发器，当这个值变化时会强制重新计算浮动面板位置
  watchTrigger: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  },
  // 浮动面板排序，数值越大越靠近底部
  floatSort: {
    type: Number,
    default: 0
  }
});

const contentRef = ref(null);
const floatingRef = ref(null);
const showFloatingPanel = ref(false);
const scrollElement = ref(null);
const debounceTimer = ref(null);
const panelId = ref(`floating-panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
const isPanelRegistered = ref(false); // 添加面板注册状态跟踪
const panelUpdateTrigger = ref(0); // 添加面板更新触发器
const externalTrigger = ref(0); // 添加外部触发器

// 面板更新回调函数
const panelUpdateCallback = () => {
  console.log(`[FloatingPanel] 面板 ${panelId.value} 收到更新通知`);
  panelUpdateTrigger.value++;
};

// 监听外部触发器变化
watch(() => props.watchTrigger, () => {
  console.log(`[FloatingPanel] 外部触发器变化，强制重新计算位置`);
  externalTrigger.value++;
  
  // 使用 nextTick 确保 DOM 更新完成后再检查
  nextTick(() => {
    // 重新检查元素是否在视口内
    const shouldShowFloating = isElementInViewport();
    
    console.log(`[FloatingPanel] 外部触发器变化后检查显示状态: ${shouldShowFloating}, 当前显示状态: ${showFloatingPanel.value}`);
    
    if (shouldShowFloating !== showFloatingPanel.value) {
      // 显示状态发生变化，需要更新
      showFloatingPanel.value = shouldShowFloating;
      if (shouldShowFloating) {
        const panelHeight = parseInt(props.floatingHeight) || 200;
        window.floatingPanelsGlobalState.registerPanel(panelId.value, panelHeight, props.floatSort);
        isPanelRegistered.value = true;
      } else {
        isPanelRegistered.value = false;
        window.floatingPanelsGlobalState.unregisterPanel(panelId.value);
      }
    } else if (showFloatingPanel.value && isPanelRegistered.value) {
      // 显示状态未变，但面板正在显示，需要强制重新注册以更新位置
      console.log(`[FloatingPanel] 强制重新注册面板以更新位置`);
      const panelHeight = parseInt(props.floatingHeight) || 200;
      window.floatingPanelsGlobalState.registerPanel(panelId.value, panelHeight, props.floatSort);
    }
  });
}, {
  deep: true // 深度监听，确保对象和数组的变化也能被检测到
});

// 监听 floatSort 变化，如果排序值变化需要重新注册面板
watch(() => props.floatSort, (newSort, oldSort) => {
  if (newSort !== oldSort && showFloatingPanel.value && isPanelRegistered.value) {
    console.log(`[FloatingPanel] 排序值从 ${oldSort} 变为 ${newSort}，重新注册面板`);
    const panelHeight = parseInt(props.floatingHeight) || 200;
    window.floatingPanelsGlobalState.registerPanel(panelId.value, panelHeight, newSort);
  }
});

// 计算浮动面板样式
const floatingPanelStyle = computed(() => {
  // 使用面板更新触发器和外部触发器来强制重新计算
  const triggerValue = panelUpdateTrigger.value;
  const externalValue = externalTrigger.value;
  
  // 只有在面板显示且已注册时才计算位置
  if (!showFloatingPanel.value || !isPanelRegistered.value) {
    console.log(`[FloatingPanel] 面板 ${panelId.value} 未显示或未注册，使用隐藏样式`);
    return {
      width: props.floatingWidth,
      height: props.floatingHeight,
      position: 'fixed',
      right: `calc(-1 * ${props.floatingWidth} - 20px)`, // 使用floatingWidth计算向右移动的距离
      bottom: '20px', // 保持底部位置，让面板向右消失
      zIndex: 1000,
      cursor: 'pointer',
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      visibility: 'hidden' // 完全隐藏面板
    };
  }
  
  const panelPosition = window.floatingPanelsGlobalState.getPanelPosition(panelId.value);
  const panelHeight = parseInt(props.floatingHeight) || 200; // 面板高度
  const spacing = props.panelSpacing; // 面板间距
  
  // 计算当前面板的底部位置
  const bottomPosition = window.floatingPanelsGlobalState.calculatePanelBottom(
    panelPosition, 
    panelHeight, 
    spacing
  );
  
  console.log(`[FloatingPanel] 面板 ${panelId.value} 样式计算 - 位置: ${panelPosition}, 高度: ${panelHeight}, 底部位置: ${bottomPosition}`);
  
  // 如果面板位置无效（未注册），使用默认位置
  const effectivePosition = panelPosition >= 0 ? panelPosition : 0;
  
  return {
    width: props.floatingWidth,
    height: props.floatingHeight,
    position: 'fixed',
    right: '20px',
    bottom: `${bottomPosition}px`,
    zIndex: 1000 + effectivePosition, // 确保先显示的面板在上层
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    visibility: 'visible' // 确保面板可见
  };
});

// 计算缩小版内容样式
const miniContentStyle = computed(() => {
  return {
    transform: `scale(${props.scale})`,
    transformOrigin: '0 0', // 左上角为变换原点
    width: `${100 / props.scale}%`,
    height: `${100 / props.scale}%`,
    overflow: 'hidden',
    pointerEvents: 'none' // 防止迷你内容上的交互事件
  };
});

// 初始化滚动元素
const initScrollElement = () => {
  if (typeof props.scrollContainer === 'string') {
    if (props.scrollContainer === 'window') {
      scrollElement.value = window;
    } else {
      scrollElement.value = document.querySelector(props.scrollContainer);
    }
  } else {
    scrollElement.value = props.scrollContainer;
  }
};

// 检查元素是否在视口内（修改为更准确的判断）
const isElementInViewport = () => {
  if (!contentRef.value) return false;
  
  const rect = contentRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  // 检查元素是否完全在视口内
  const isFullyVisible = (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
  
  // 检查元素是否部分在视口内（与视口有交集）
  const isPartiallyVisible = (
    rect.top < windowHeight &&
    rect.bottom > 0 &&
    rect.left < windowWidth &&
    rect.right > 0
  );
  
  // 如果元素完全可见或部分可见，则不显示浮动面板
  // 只有当元素完全不在视口内时才显示浮动面板
  return !(isFullyVisible || isPartiallyVisible);
};

// 处理滚动事件（添加防抖）
const handleScroll = () => {
  // 清除之前的定时器
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  
  // 设置新的定时器
  debounceTimer.value = setTimeout(() => {
    if (!contentRef.value) return;
    
    const rect = contentRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollTop = scrollElement.value === window 
      ? window.pageYOffset || document.documentElement.scrollTop
      : scrollElement.value.scrollTop;
    
    // 获取内容元素的总高度
    const contentHeight = contentRef.value.offsetHeight;
    // 获取内容元素距离文档顶部的距离
    const contentTop = scrollTop + rect.top;
    // 计算内容元素的底部位置
    const contentBottom = contentTop + contentHeight;
    
    // 判断是否应该显示浮动面板：
     const shouldShowFloating = rect.bottom > windowHeight;
    
    console.log(`[FloatingPanel] 面板 ${panelId.value} 滚动处理 - 显示状态: ${showFloatingPanel.value}, 是否应该显示: ${shouldShowFloating}, 滚动位置: ${scrollTop}, 内容底部: ${contentBottom}`);
    
    // 如果滚动已经超过元素区域，则不再显示浮动面板
    if (scrollTop > contentBottom) {
      if (showFloatingPanel.value) {
        showFloatingPanel.value = false;
        isPanelRegistered.value = false; // 更新注册状态
        window.floatingPanelsGlobalState.unregisterPanel(panelId.value);
        // 不再需要手动触发更新，因为unregisterPanel会通知所有面板
      }
    } else if (shouldShowFloating !== showFloatingPanel.value) {
      showFloatingPanel.value = shouldShowFloating;
      if (shouldShowFloating) {
        const panelHeight = parseInt(props.floatingHeight) || 200;
        window.floatingPanelsGlobalState.registerPanel(panelId.value, panelHeight, props.floatSort);
        isPanelRegistered.value = true; // 更新注册状态
        // 不再需要手动触发更新，因为registerPanel会通知所有面板
      } else {
        isPanelRegistered.value = false; // 更新注册状态
        window.floatingPanelsGlobalState.unregisterPanel(panelId.value);
        // 不再需要手动触发更新，因为unregisterPanel会通知所有面板
      }
    }
  }, props.debounceTime);
};

// 滚动到内容位置
const scrollToContent = () => {
  if (!contentRef.value || !scrollElement.value) return;
  
  const rect = contentRef.value.getBoundingClientRect();
  const scrollTop = scrollElement.value === window 
    ? window.pageYOffset || document.documentElement.scrollTop
    : scrollElement.value.scrollTop;
  
  const targetScrollTop = scrollTop + rect.top - 60; // 20px 的额外偏移
  
  if (scrollElement.value === window) {
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  } else {
    scrollElement.value.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  initScrollElement();
  
  // 注册面板更新回调
  window.floatingPanelsGlobalState.registerUpdateCallback(panelUpdateCallback);
  
  if (scrollElement.value) {
    scrollElement.value.addEventListener('scroll', handleScroll);
    // 初始检查
    nextTick(() => {
      handleScroll();
    });
  }
});

onUnmounted(() => {
  if (scrollElement.value) {
    scrollElement.value.removeEventListener('scroll', handleScroll);
  }
  // 清除防抖定时器
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  // 从全局状态中移除当前面板
  isPanelRegistered.value = false; // 更新注册状态
  window.floatingPanelsGlobalState.unregisterPanel(panelId.value);
  // 注销面板更新回调
  window.floatingPanelsGlobalState.unregisterUpdateCallback(panelUpdateCallback);
});
</script>

<style scoped lang="scss">
.floating-panel-container {
  position: relative;
  width: 100%;
}

.floating-panel-content {
  width: 100%;
}

.floating-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
  }
}

.floating-panel-mini {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.mini-content-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scaled-content {
  position: absolute;
  top: 0;
  left: 0;
  // 其他样式通过 computed 属性动态设置
}

// 从右往左进入，往右消失的动画
.slide-in-right-enter-active {
  transition: all 0.3s ease-out;
}

.slide-in-right-leave-active {
  transition: all 0.3s ease-in;
}

.slide-in-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-right-leave-to {
  transform: translateX(120%) translateY(0); // 明确往右消失，不往下
  opacity: 0;
}
</style>