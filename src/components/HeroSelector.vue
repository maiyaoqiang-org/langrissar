<template>
  <el-button @click="visible=true">选择英雄</el-button>
  <el-dialog v-model="visible" title="选择英雄" top="5vh" @close="handleCancel" :style="{ minWidth: '800px',width:'80%' }">
    <div style="height:80vh;display: flex;flex-direction: column;">
      <div flex="cross:top" flex-box="1" style="height:calc(100% - 60px);">

        <div flex-box="0" style="width:400px;height:100%;overflow-y: auto;">
          <div v-for="(filterItem, index) in filterData" :key="index" class="filter-section">
            <div class="filter-header" @click="toggleCollapse(index)">
              <span>{{ filterItem.label }}</span>
              <span>{{ filterItem.collapsed ? '展开' : '折叠' }}</span>
            </div>
            <div v-if="!filterItem.collapsed" class="list-box rarity mt_16">
              <div
                @click="toggleItemActive(item)"
                v-for="(item, index) in filterItem.data"
                :key="index"
                :class="{active: item.active}"
                :style="filterItem.customStyle"
                class="item">
                <img :src="item.src" alt="">
              </div>
              <div
                v-if="filterItem.canEffectTogether"
                class="item effect-together"
                @click="toggleEffectTogether(filterItem)"
                :class="{active: filterItem.effectTogether}">
                是否组合生效
              </div>
            </div>
          </div>
        </div>

        <div flex-box="1" class="ml_16" style="overflow-y: auto;height:100%;">
          <div class="selected-heroes">
            <h3>已选择的英雄</h3>
            <div>
              <div @click="cancelSelect(hero,index)" class="hero-item" v-for="(hero, index) in selectedHeroes" :key="hero.heroName">
                <img style="width: 40px; height: 40px;" :src="hero.logo" alt="">
              </div>
            </div>
          </div>
          <div>
            <h3>英雄池</h3>
            <div flex="cross:top" style="flex-wrap: wrap; gap: 8px;align-items: flex-start;">
              <div class="hero-item" v-for="(item, index) in showHeroes" :key="item.heroName" @click="selectHero(item)"
                   :class="{ 'selected-hero': isSelected(item) , 'disabled': selectedHeroes.length >= maxSelection }">
                <img style="width: 40px; height: 40px;" :src="item.logo" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div flex-box="0" class="mt_16">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, defineExpose } from 'vue';
import _ from 'lodash';
import {getHeroes} from "@/api/leancloud";
import {filterDataList} from "@/common/constant";
const props = defineProps({
  modelValue: Array,
  maxSelection: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = ref(false);
const selectedHeroes = ref([...props.modelValue]);

const heroes = ref([]);

const filterData = ref(Object.keys(filterDataList).map(i => {
  const item = filterDataList[i];
  return {
    ...item,
    canEffectTogether: item.canEffectTogether,
    matchKey: item.matchKey,
    data: item.data,
    name: i,
    effectTogether: false,
    collapsed: false,
  };
}));

const showHeroes = computed(() => {
  let list = heroes.value;

  // 过滤掉已选择的英雄
  const selectedHeroNames = selectedHeroes.value.map(hero => hero.heroName);
  list = list.filter(hero => !selectedHeroNames.includes(hero.heroName));

  filterData.value.forEach((item) => {
    const name = item.name;
    const matchKey = filterDataList[name].matchKey;
    const filterList = item.data.filter(i => i.active).map(i => i.name);
    if (filterList.length) {
      list = list.filter((hero) => {
        let heroMatchValue = hero[matchKey]?.split(/[,，]/).map(i => i.trim());
        if (item.effectTogether) {
          return _.difference(filterList, heroMatchValue).length === 0;
        } else {
          return _.intersection(heroMatchValue, filterList).length;
        }
      });
    }
  });

  return list;
});

function toggleItemActive(item) {
  item.active = !item.active;
}

function toggleEffectTogether(filterItem) {
  filterItem.effectTogether = !filterItem.effectTogether;
}

function toggleCollapse(index) {
  filterData.value[index].collapsed = !filterData.value[index].collapsed;
}

function selectHero(hero) {
  const index = selectedHeroes.value.findIndex(h => h.heroName === hero.heroName);
  if (index !== -1) {
    selectedHeroes.value.splice(index, 1);
  } else if (selectedHeroes.value.length < props.maxSelection) {
    selectedHeroes.value.push(hero);
  }
}

function isSelected(hero) {
  return selectedHeroes.value.some(h => h.heroName === hero.heroName);
}

function handleConfirm() {
  emit('update:modelValue', selectedHeroes.value);
  visible.value = false;
}

function handleCancel() {
  visible.value = false;
}

function cancelSelect(hero,index){
  selectedHeroes.value.splice(index, 1);
}


onMounted(async () => {
  heroes.value = await getHeroes()
});

defineExpose({ showHeroSelector: () => { visible.value = true; } });
</script>

<style scoped lang="scss">
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.3s ease;
}

.fade-down-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}


.hero-item {
  border: 2px solid transparent;
  &.selected-hero {
    border: 2px solid blue; /* 标识选中的英雄 */
    opacity: 1;
  }
  &.disabled{
    opacity: 0.5;
  }
  img {
    display: block;
  }
}

.filter-section {
  margin-bottom: 16px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
}

.list-box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .item {
    width: 86px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-image: url("@/static/images/selectDefault.png") 40 45 / 35px 40px;
    cursor: pointer;
    color: #fff;

    &:hover, &.active {
      border-image: url("@/static/images/selectActive.png") 40 45 / 35px 40px;
      color: #333;
    }

    &.effect-together {
      width: 120px;
    }

    img {
      width: auto;
      height: 25px;
    }
  }
}

.selected-heroes {
  margin-bottom: 16px;
  h3 {
    margin-bottom: 8px;
  }
  .hero-item {
    display: inline-block;
    margin-right: 8px;
  }
}
</style>
