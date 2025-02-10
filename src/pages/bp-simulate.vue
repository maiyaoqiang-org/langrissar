<template>
  <h3>1P</h3>
   <HeroSelector v-model="heroPool1P" :maxSelection="15" />
   
   <h3>2P</h3>
   <HeroSelector v-model="heroPool2P" :maxSelection="15" />

   <el-button type="primary" @click="initHeroes">初始化</el-button>
  <div class="hero-simulator mt_16">
    <div class="main-layout">
      <div class="hero-section">
        <h3>1P 英雄池</h3>
        <div class="heroes">
          <div
              v-for="(hero,index) in heroes1P"
              :key="hero.heroName"
              class="hero"
              :class="{ disabled: hero.status === 'disabled', selected: hero.status === 'selected' }"
              @click="handleHeroClick(hero, '1P')"
          >
            <img :src="hero.logo" :alt="hero.heroName"/>
            <!-- <span>{{ hero.heroName }}</span> -->
          </div>
        </div>
      </div>

      <div class="action-info">
        <h2>当前操作</h2>
        <p>{{ currentPlayer }} 回合 - {{ currentAction }}</p>
        <button @click="undoStep" :disabled="state.turn === 1">撤销上一步</button>
      </div>

      <div class="hero-section">
        <h3>2P 英雄池</h3>
        <div class="heroes">
          <div
              v-for="(hero,index) in heroes2P"
              :key="hero.heroName"
              class="hero"
              :class="{ disabled: hero.status === 'disabled', selected: hero.status === 'selected' }"
              @click="handleHeroClick(hero, '2P')"
          >
            <img :src="hero.logo" :alt="hero.heroName"/>
            <!-- <span>{{ hero.heroName }}</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {reactive, computed, onMounted, ref} from 'vue';
import HeroSelector from '@/components/HeroSelector.vue';
import {useRefCache} from "@/common/hook";


const heroPool1P = useRefCache('langrissar-calculator-bp-simulate-heroPool1P', []);
const heroPool2P = useRefCache('langrissar-calculator-bp-simulate-heroPool2P', []);

const initHeroes = () => {
  // 使用 heroPool1P 初始化 heroes1P
  heroes1P.splice(0, heroes1P.length, ...heroPool1P.value.map((hero, index) => ({
    id: `1P_${index + 1}`,
    heroName: hero.heroName,
    logo: hero.logo,
    status: 'available',
  })));
  

  // 使用 heroPool2P 初始化 heroes2P
  heroes2P.splice(0, heroes2P.length, ...heroPool2P.value.map((hero, index) => ({
    id: `2P_${index + 1}`,
    heroName: hero.heroName,
    logo: hero.logo,
    status: 'available',
  })));
};

onMounted(()=>{
  initHeroes()
})

// 初始化英雄池
const heroes1P = reactive(
    Array.from({length: 15}, (_, index) => ({
      id: `1P_${index + 1}`,
      heroName: `1P英雄${index + 1}`,
      logo: `https://placekitten.com/80/80?image=${index + 1}`,
      status: 'available', // 状态: available, disabled, selected
    }))
);

const heroes2P = reactive(
    Array.from({length: 15}, (_, index) => ({
      id: `2P_${index + 16}`,
      heroName: `2P英雄${index + 1}`,
      logo: `https://placekitten.com/80/80?image=${index + 16}`,
      status: 'available',
    }))
);

const state = reactive({
  turn: 1, // 当前回合数
  actionSequence: [
    {player: '2P', action: 'ban'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'pick'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'pick'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'pick'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'pick'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'pick'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'pick'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'pick'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'ban'},
    {player: '2P', action: 'pick'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'ban'},
    {player: '1P', action: 'pick'},
    {player: '2P', action: 'pick'},
  ],
  history: [],
});

const currentStep = computed(() => state.actionSequence[state.turn - 1]);

const handleHeroClick = (hero, pool) => {
  const step = currentStep.value;

  if (!step || hero.status !== 'available') return;
  const isBan = step.action === 'ban' && pool !== step.player;
  const isPick = step.action === 'pick' && pool === step.player;
  if (!isBan && !isPick) {
    return
  }


  if (isBan) {
    hero.status = 'disabled';
  } else if (isPick) {
    hero.status = 'selected';
  }

  state.history.push({turn: state.turn, heroId: hero.id, status: hero.status});
  state.turn++;

};

const undoStep = () => {
  if (state.turn === 1) return;

  const lastAction = state.history.pop();
  if (!lastAction) return;

  const {heroId, status} = lastAction;
  const hero = [...heroes1P, ...heroes2P].find((h) => h.id === heroId);
  if (hero) hero.status = 'available';

  state.turn--;
};

const currentPlayer = computed(() => currentStep.value?.player || '');
const currentAction = computed(() => {
  const step = currentStep.value;
  if (!step) return '';
  return step.action === 'ban' ? '禁用对手英雄' : '选择自己的英雄';
});


</script>

<style scoped lang="scss">
.hero-simulator {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-layout {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.hero-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.heroes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 300px;
  justify-content: space-between;
}

.hero {
  border: 2px solid transparent;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.3s;
  width:30%;
  box-sizing: border-box;
  img{
    width:100%;
    display: block;
  }
}

.hero.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.hero.selected {
  border-color: blue;
}

.action-info {
  flex: 0 0 200px;
  text-align: center;
}

</style>
