<template>

  <div>
    <div class="list-box rarity mt_16" v-for="(item,index) in filterData" :key="index">
      <div
          @click="item.active=!item.active"
          v-for="(item,index) in item.data"
          :key="index"
          :class="{active:item.active}"
          class="item">
        <img :src="item.src" alt="">
      </div>
      <div
          v-if="item.canEffectTogether"
          class="item effect-together"
          @click="item.effectTogether=!item.effectTogether"
          :class="{active:item.effectTogether}">
        是否组合生效
      </div>
    </div>

    <div flex style="flex-wrap: wrap;gap:8px;" class="mt_16">
      <div v-for="(item,index) in showHeroes" :key="index">
        <img style="width:40px;height:40px;" :src="item.logo" alt="">
      </div>
    </div>
  </div>

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
</template>

<script setup>
import {reactive, computed, onMounted, ref} from 'vue';
import _ from "lodash"
import AV from "leancloud-storage";

const heroes = ref([])

const filterDataList = {
  rarityList: {
    canEffectTogether: false,
    matchKey: "rarity",
    data: [
      {
        "name": "LLR",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/5/54/skl6ykupksd7b9t6ly3v7god84nhhhr.png/61px-%E7%BA%A7%E5%88%AB_LLR.png"
      },
      {
        "name": "SP",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/8/85/ch6vij5ioy4h36l1q4enb4l257rq8em.png/43px-%E7%BA%A7%E5%88%AB_SP.png"
      },
      {
        "name": "SSR",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/5/5b/iwcbg6sa3z1agko098c500slqnb9d7b.png/61px-%E7%BA%A7%E5%88%AB_SSR.png"
      },
      {
        "name": "SR",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/2/2d/dlidgyhrr9nfup9qef1bql5d7q4gqdk.png/43px-%E7%BA%A7%E5%88%AB_SR.png"
      },
      {
        "name": "R",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/16/b560of1ijnkh5bw0o0i2gq6mvko9tk3.png/26px-%E7%BA%A7%E5%88%AB_R.png"
      },
      {
        "name": "N",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/3/35/i2d4daoj4v8bfzfhi2vsqu6lykobkjk.png/30px-%E7%BA%A7%E5%88%AB_N.png"
      }
    ],
  },
  campList: {
    canEffectTogether: true,
    matchKey: "_camps",
    data: [
      {
        "name": "主角光环",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/f/f3/r66935ujhl8wtya0z3hm54h6fsqgwfm.png/30px-%E4%B8%BB%E8%A7%92%E5%85%89%E7%8E%AF.png"
      },
      {
        "name": "战略大师",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/19/p0whojp979b9lzstk9pecxjqlzyodtw.png/30px-%E6%88%98%E7%95%A5%E5%A4%A7%E5%B8%88.png"
      },
      {
        "name": "流星直击",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/6/67/fjercnfkgk29goi8dgqyi91sm8x2iie.png/30px-%E6%B5%81%E6%98%9F%E7%9B%B4%E5%87%BB.png"
      },
      {
        "name": "公主联盟",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/1a/fokhyvsq4eww37uy7xxhz0e1e1tj5qi.png/30px-%E5%85%AC%E4%B8%BB%E8%81%94%E7%9B%9F.png"
      },
      {
        "name": "光之起源",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/d/d2/ke8mcqmhalp80nrkfooqem5syp2zl1w.png/30px-%E5%85%89%E4%B9%8B%E8%B5%B7%E6%BA%90.png"
      },
      {
        "name": "光辉军团",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/0/02/bvc8i1ts2tl4voyhh5iqrxojh9saae6.png/30px-%E5%85%89%E8%BE%89%E5%86%9B%E5%9B%A2.png"
      },
      {
        "name": "黑暗轮回",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/3/33/2e8kwh8pbn0qyzq5vpw0q99gfe5o86h.png/30px-%E9%BB%91%E6%9A%97%E8%BD%AE%E5%9B%9E.png"
      },
      {
        "name": "帝国之辉",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/a/ad/ozpfw60ez3dbbr82rg1jnic71cq3jnm.png/30px-%E5%B8%9D%E5%9B%BD%E4%B9%8B%E8%BE%89.png"
      },
      {
        "name": "传说彼端",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/f/fe/eqsrovr0us9s6bpmtu99jttrrmkwv5c.png/30px-%E4%BC%A0%E8%AF%B4%E5%BD%BC%E7%AB%AF.png"
      },
      {
        "name": "时空枢纽",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/e/e0/nfc3yk5zb8a2nolxum8h2385bf6m2m2.png/30px-%E6%97%B6%E7%A9%BA%E6%9E%A2%E7%BA%BD.png"
      },
      {
        "name": "超凡领域",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/c/c9/j77xd0niimrdq2pkeqyyh3lz3x9a1x3.png/30px-%E8%B6%85%E5%87%A1%E9%A2%86%E5%9F%9F.png"
      },
      {
        "name": "梦幻转生",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/15/7wmy39cb50ctd0qv42j72glm8f26eyj.png/30px-%E6%A2%A6%E5%B9%BB%E8%BD%AC%E7%94%9F.png"
      }
    ]
  },
}

const filterData = ref(Object.keys(filterDataList).map(i => {
  const item = filterDataList[i]
  return {
    canEffectTogether: item.canEffectTogether,
    matchKey: item.matchKey,
    data: item.data,
    name: i,
    effectTogether: false,
  }
}))

const showHeroes = computed(() => {
  let list = heroes.value

  filterData.value.forEach((item) => {
    const name = item.name
    const matchKey = filterDataList[name].matchKey
    const filterList = item.data.filter(i => i.active).map(i => i.name)
    if(filterList.length){
      list = list.filter((hero) => {
        let heroMatchValue = hero[matchKey]
        // 判断是否是数组
        if (!Array.isArray(hero[matchKey])) {
          heroMatchValue = [heroMatchValue]
        }
        // 英雄对应heroMatchValue需要包含filterList
        if (item.effectTogether) {
          return _.difference(filterList, heroMatchValue).length === 0
        }
        // 只要有交集 就过滤为true
        else {
          return _.intersection(heroMatchValue, filterList).length;
        }
      })
    }
  })

  return list

})


onMounted(() => {
  // 1. 查询所有 Hero
  const heroQuery = new AV.Query('Hero');
  heroQuery.limit(1000).find().then(res => {
    heroes.value = res.map(i => {
      const item = i.toJSON()
      return {
        ...item,
        _camps: item.camp?.split(',').map(i=>i.trim()),
      }
    })
  })
})

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
    background-image: url("@/static/images/selectDefault.png");
    background-size: 100% 100%;
    cursor: pointer;
    color: #fff;

    &:hover, &.active {
      background-image: url("@/static/images/selectActive.png");
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
</style>
