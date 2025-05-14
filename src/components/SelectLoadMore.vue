<!--
用法1.VSearch使用
colunms:[
{
    label: '合作机构',
    key: 'partner_id',
    value: [],
    multiple: true,
    placeholder: "合作机构",
    type: "selectLoadMore",
    getOptions: async (data) => {
      const {page, page_size, filterValue} = data
      const res = await promotionPartnerList({
        pageBegin: page,
        pageIndex: page,
        pageSize: page_size,
        name: filterValue,
      })
      return {
        total: res.data.total,
        data: res.data.list.map(i => {
          return {
            label: i.name,
            value: i.id,
          }
        })
      }
    }
  },
]


用法2:普通自定义用法
<v-select-load-more
  clearable
  :remote="true"
  :getDataFun="getPromotionFilter"
  v-model="dataForm.channel_id"
  >
  <template v-slot:default="slotProps">
    <el-option
      v-for="item in slotProps.options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </template>
</v-select-load-more>

methods:{
  async getPromotionFilter(data) {
      const { page, page_size, filterValue } = data
      const res = await promotionChannelList({
        pageBegin: page,
        pageIndex: page,
        pageSize: page_size,
        name: filterValue,
        // 生效中的方案
        status: '1'
      })
      return {
        total: res.data.total,
        data: res.data.list
      }
    },
}

-->

<!--
用法3：在表单中使用，并且需要回显的情况，主要跟用法2区别就是多了doInit，要主动获取表单值初始化options
如果需要指定默认数据 一般是表单回显数据时需要
uniqKey要定义(这个是用于避免重复数据导致el-select报错，对getDataFun返回的数据会进行去重)
并且要主动调用setInitOptions方法
 <v-select-load-more
    clearable
    uniqKey="id"
    ref="selectPromotion"
    placeholder="请选择推广方案"
    :remote="true"
    :getDataFun="getPromotionFilter"
    v-model="dataForm.channel_id"
  >
    <template v-slot:default="slotProps">
      <el-option
        v-for="item in slotProps.options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </template>
  </v-select-load-more>

methods:{
  doInit(){
    // 查询出来channel_id 一般编辑时后端返回的数据，然后进行回显把数据通过setInitOptions设置一下
    promotionChannelList({
      pageBegin: 1,
      pageIndex: 1,
      pageSize: 10,
      id: form.channel_id
    }).then((res) => {
      this.$refs.selectPromotion &&
        this.$refs.selectPromotion.setInitOptions(res.data.list)
    })
  }
}

-->
<template>
  <el-select
    ref="selectRef"
    :size="size"
    :model-value="modelValue"
    :filterable="true"
    :remote-method="remoteMethod"
    :placeholder="placeholder"
    :popper-class="popperClass"
    @update:model-value="(val) => emit('update:modelValue', val)"
    @visible-change="visibleChange"
    v-bind="$attrs"
  >
    <slot :options="options">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </slot>
    <div class="mt_6" style="display: flex; justify-content: center; align-items: center">
      <i v-if="hasMore" class="el-icon-loading"></i>
      <div v-else style="font-size: 12px; color: #999">已经到底啦~</div>
    </div>
  </el-select>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, useAttrs, getCurrentInstance, nextTick } from "vue";
import _ from "lodash";

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: "",
  },
  size: {
    type: String,
    default: "small"
  },
  placeholder: { type: String, default: "请选择" },
  pageSize: { type: Number, default: 10 },
  uniqKey: { type: String, default: "" },
  getDefaultOptionsData: { type: Function, default: () => () => [] },
  getDataFun: {
    type: Function,
    default: () => () => ({ data: [], total: 0 }),
  },
});

const emit = defineEmits(["update:modelValue"]);

const attrs = useAttrs();
const instance = getCurrentInstance();
const listeners = instance.vnode.props || {};

const selectRef = ref(null);
const scrollEvent = ref(null);
// 生成一个随机id
const popperClass = `cus-popper-${Math.random().toString(36).substring(2)}`;

const state = reactive({
  visible: false,
  options: [],
  currentLoadMoreVal: "",
  pageData: {
    page: 0,
    total: 0,
  },
  fixDistance: 30,
  initOptions: [],
});

const hasMore = computed(() => {
  const { page, total } = state.pageData;
  return !(page > 0 && total <= page * props.pageSize);
});

function setInitOptions(initOptions) {
  state.initOptions = initOptions || [];
  state.options = JSON.parse(JSON.stringify(state.initOptions));
}

function init() {
  initData();
  loadmore();
}

function initData() {
  state.pageData.page = 0;
  state.currentLoadMoreVal = "";
  state.options = JSON.parse(JSON.stringify(state.initOptions));
}

const loadmore = _.throttle(function () {
  if (hasMore.value) {
    state.pageData.page++;
    getData(state.currentLoadMoreVal);
  }
});

async function getData(filterValue) {
  if (props.getDataFun) {
    let { data, total } = await props.getDataFun({
      page: state.pageData.page,
      page_size: props.pageSize,
      filterValue,
    });

    if (data) {
      if (props.uniqKey) {
        const newData = _.differenceBy(data, state.initOptions, props.uniqKey);
        data = newData;
      }
      state.options = state.options.concat(data);
      state.pageData.total = total;
    }
  }
}

function visibleChange(val) {
  state.visible = val;
  if (val) {
    // init();
  }
}

function remoteMethod(val) {
  initData();
  state.currentLoadMoreVal = val;
  loadmore();
}

function bindLoadMore(isUnBind = false) {
  // 下拉菜单 DOM 是通过 popperId 控制，唯一对应当前 select
  nextTick(() => {
    const SELECTWRAP_DOM = document.querySelector(`.el-select-dropdown.${popperClass} .el-scrollbar__wrap`);
    if (!SELECTWRAP_DOM) return;
    if (!isUnBind) {
      scrollEvent.value = _.throttle(function () {
        const condition = this.scrollHeight - this.scrollTop - state.fixDistance <= this.clientHeight;
        if (condition) {
          loadmore();
        }
      }, 300);
      SELECTWRAP_DOM.addEventListener("scroll", scrollEvent.value);
    } else {
      if (scrollEvent.value) {
        SELECTWRAP_DOM.removeEventListener("scroll", scrollEvent.value);
      }
    }
  });
}

onMounted(() => {
  bindLoadMore();
});

onBeforeUnmount(() => {
  bindLoadMore(true);
});

defineExpose({
  setInitOptions,
});

const options = computed(() => state.options);
</script>
