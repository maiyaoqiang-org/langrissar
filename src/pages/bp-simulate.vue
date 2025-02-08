<template>
  <el-card style="margin:8px;" v-for="(pool,poolIndex) in [heroPool1P,heroPool2P]" :key="poolIndex">
    <h4>{{poolIndex+1}}P英雄池</h4>
    <el-button size="small" class="mb_8" @click="addHero(pool)">
      添加
    </el-button>
    <div flex style="gap:8px;">
      <div
          v-for="(hero,index) in pool"
          :key="index"
          @click="changeHero(pool,index)"
      >
        <img style="width:30px;height:30px;" :src="hero.logo" :alt="hero.heroName"/>
      </div>
    </div>
  </el-card>

  <div class="hero-simulator mt_16">
    <div class="main-layout">
      <div class="hero-section">
        <h3>1P 英雄池</h3>
        <div class="heroes">
          <div
              v-for="hero in heroes1P"
              :key="hero.id"
              class="hero"
              :class="{ disabled: hero.status === 'disabled', selected: hero.status === 'selected' }"
              @click="handleHeroClick(hero, '1P')"
          >
            <img :src="hero.avatar" :alt="hero.name"/>
            <span>{{ hero.name }}</span>
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
              v-for="hero in heroes2P"
              :key="hero.id"
              class="hero"
              :class="{ disabled: hero.status === 'disabled', selected: hero.status === 'selected' }"
              @click="handleHeroClick(hero, '2P')"
          >
            <img :src="hero.avatar" :alt="hero.name"/>
            <span>{{ hero.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <HeroSelector ref="heroSelectorRef" />
</template>

<script setup>
import {reactive, computed, onMounted, ref} from 'vue';
import HeroSelector from '@/components/HeroSelector.vue';
import {useRefCache} from "@/common/hook";

const heroSelectorRef = ref(null);

const heroPool1P = useRefCache('langrissar-calculator-bp-simulate-heroPool1P"',[])
const heroPool2P = useRefCache('langrissar-calculator-bp-simulate-heroPool2P"',[])

// 初始化英雄池
const heroes1P = reactive(
    Array.from({length: 15}, (_, index) => ({
      id: index + 1,
      name: `1P英雄${index + 1}`,
      avatar: `https://placekitten.com/80/80?image=${index + 1}`,
      status: 'available', // 状态: available, disabled, selected
    }))
);

const heroes2P = reactive(
    Array.from({length: 15}, (_, index) => ({
      id: index + 16,
      name: `2P英雄${index + 1}`,
      avatar: `https://placekitten.com/80/80?image=${index + 16}`,
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

async function changeHero(pool,index) {
  if (heroSelectorRef.value) {
    const hero = await heroSelectorRef.value.showHeroSelector();
    if (hero) {
      pool[index] = hero
    }
  }
}
async function addHero(pool) {
  if (heroSelectorRef.value) {
    const hero = await heroSelectorRef.value.showHeroSelector();
    if (hero) {
      pool.push(hero)
    }
  }
}


</script>

<style scoped>
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
}

.heroes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero {
  border: 1px solid #ddd;
  padding: 8px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.3s;
}

.hero.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.hero.selected {
  border-color: blue;
  border-width: 2px;
}

.action-info {
  flex: 0 0 200px;
  text-align: center;
}

</style>
