<template>
  <el-dialog v-model="visible" title="选择英雄" width="80%" top="5vh" @close="handleCancel">
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

        <div flex-box="1" flex="cross:top" style="flex-wrap: wrap; gap: 8px;align-items: flex-start;height:100%;overflow-y: auto;" class="ml_16">
          <div class="hero-item" v-for="(item, index) in showHeroes" :key="index" @click="selectHero(item)"
              :class="{ 'selected-hero': selectedHero === item.heroName }">
            <img style="width: 40px; height: 40px;" :src="item.logo" alt="">
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
import AV from 'leancloud-storage';

const visible = ref(false);
const selectedHero = ref(null);
const resolvePromise = ref(null);

const heroes = ref([]);

const filterDataList = {
  rarityList: {
    canEffectTogether: false,
    matchKey: "rarity",
    label:"稀有度筛选",
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
    matchKey: "camp",
    label:"阵营筛选",
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
  occupation: {
    canEffectTogether: true,
    matchKey: "occupation",
    label:"职业筛选",
    data: [
      {
        "name": "龙",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/2/2f/pz59nnz7mma6rjedxkvtcs8uskdxmag.png/30px-%E8%81%8C%E4%B8%9A_%E9%BE%99.png"
      },
      {
        "name": "步兵",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/12/sa0ks78ealuwgq8xwgtzp9e2ayz9r1y.png/30px-%E8%81%8C%E4%B8%9A_%E6%AD%A5.png"
      },
      {
        "name": "枪兵",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/b/b9/cs2cwyl3a40gvpa5cxfzcw9rhdoeo5q.png/30px-%E8%81%8C%E4%B8%9A_%E6%9E%AA.png"
      },
      {
        "name": "骑兵",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/a/a9/hss7h15zqps2jsaw3zulq9grkjijvvp.png/30px-%E8%81%8C%E4%B8%9A_%E9%AA%91.png"
      },
      {
        "name": "飞兵",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/5/5c/m164c0n2iilqzko72c8drqwxvlqs97b.png/30px-%E8%81%8C%E4%B8%9A_%E9%A3%9E.png"
      },
      {
        "name": "水兵",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/7/7b/komeh4wh66yzjkvvprgyrq766csmmou.png/30px-%E8%81%8C%E4%B8%9A_%E6%B0%B4.png"
      },
      {
        "name": "弓兵",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/4/45/gjzjhvsewy845rxglq86g2s46h59tw4.png/30px-%E8%81%8C%E4%B8%9A_%E5%BC%93.png"
      },
      {
        "name": "刺客",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/3/38/ibfio5xwtm0m9rvnbl4o3yx3d8cby5n.png/30px-%E8%81%8C%E4%B8%9A_%E5%88%BA.png"
      },
      {
        "name": "僧侣",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/2/28/ojkv3aubd959f27mq6eq907uo3ce0wh.png/30px-%E8%81%8C%E4%B8%9A_%E5%83%A7.png"
      },
      {
        "name": "法师",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/13/nh8z9ryognbw1wlxv5qjkh7gkc2hjjm.png/30px-%E8%81%8C%E4%B8%9A_%E6%B3%95.png"
      },
      {
        "name": "魔物",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/a/af/c68unr5jqcpvy6gqq46uiuh3b4s40rm.png/30px-%E8%81%8C%E4%B8%9A_%E9%AD%94.png"
      }
    ]
  },
  provenance:{
    customStyle:{width:'180px'},
    matchKey: "provenance",
    label:"出典筛选",
    data:[
      {
        "name": "梦幻模拟战手游I",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/7/73/284tuvpt79x5grthchmui5tctsz9j6k.png/90px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98%E6%89%8B%E6%B8%B8I.png"
      },
      {
        "name": "梦幻模拟战手游II",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/b/b9/q0yapp96xhbdwfa5nwyywy18ulz9446.png/91px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98%E6%89%8B%E6%B8%B8II.png"
      },
      {
        "name": "梦幻模拟战手游III",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/0/0f/g5dyni8nx6drfzopy94r58xhqao0to6.png/90px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98%E6%89%8B%E6%B8%B8III.png"
      },
      {
        "name": "梦幻模拟战手游IV",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/f/fc/5f6ot5fu36joe0rl8ebjhkzm5d5jhkx.png/26px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98%E6%89%8B%E6%B8%B8IV.png"
      },
      {
        "name": "梦幻模拟战I",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/d/d9/quxadnsh5m8iybprfzfreycya2h44lu.png/49px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98I.png"
      },
      {
        "name": "梦幻模拟战II",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/7/78/gkiaptvk7lsoqvx5cut1c1z1vqgr4u6.png/49px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98II.png"
      },
      {
        "name": "梦幻模拟战III",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/10/12xuqcz0w11penwa6fg89zbd45vqy7l.png/36px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98III.png"
      },
      {
        "name": "梦幻模拟战IV",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/d/d0/pr7qay1tyvw68bfl159j2c7ditvis8k.png/59px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98IV.png"
      },
      {
        "name": "梦幻模拟战V",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/5/58/pb8avxpfm3f4tfl0ytzr0znsmhu6qvi.png/36px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98V.png"
      },
      {
        "name": "梦幻模拟战·转生",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/a/ae/ljq030iiho4vagxk2exhfhvcekk8aef.png/84px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98%C2%B7%E8%BD%AC%E7%94%9F.png"
      },
      {
        "name": "梦幻模拟战·千年纪WS",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/2/23/kr0sphb5ulcn1sv5rj7kj53m62ooi4e.png/56px-%E5%9B%BE%E6%A0%87_%E6%A2%A6%E5%B9%BB%E6%A8%A1%E6%8B%9F%E6%88%98%C2%B7%E5%8D%83%E5%B9%B4%E7%BA%AAWS.png"
      },
      {
        "name": "空之轨迹",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/a/a0/15zunlsidcb4obpdph3lvai4dgielqx.png/68px-%E5%9B%BE%E6%A0%87_%E7%A9%BA%E4%B9%8B%E8%BD%A8%E8%BF%B9.png"
      },
      {
        "name": "樱花大战",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/11/l9m5fbvdjj8eehc608omyrtg2n6fzgp.png/66px-%E5%9B%BE%E6%A0%87_%E6%A8%B1%E8%8A%B1%E5%A4%A7%E6%88%98.png"
      },
      {
        "name": "幽☆游☆白书",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/3/34/karpnj6doq2djhnpp3mxrqihd5a8kjp.png/71px-%E5%9B%BE%E6%A0%87_%E5%B9%BD%E2%98%86%E6%B8%B8%E2%98%86%E7%99%BD%E4%B9%A6.png"
      },
      {
        "name": "罗德斯岛",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/9/93/mis4ahs0d7xria6yezjxrql56qmxvv4.png/105px-%E5%9B%BE%E6%A0%87_%E7%BD%97%E5%BE%B7%E6%96%AF%E5%B2%9B.png"
      },
      {
        "name": "闪之轨迹",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/f/f5/gcf536ejo6fml4gof249lm5f9wsrz7f.png/77px-%E5%9B%BE%E6%A0%87_%E9%97%AA%E4%B9%8B%E8%BD%A8%E8%BF%B9.png"
      },
      {
        "name": "OVERLORD",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/1/1e/6fs0t1p982k489vmoav3c5e0wym2gt9.png/92px-%E5%9B%BE%E6%A0%87_OVERLORD.png"
      },
      {
        "name": "魔神英雄传",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/7/71/cik0km1u9qa6jibz8uqd8kae9a7cl1e.png/47px-%E5%9B%BE%E6%A0%87_%E9%AD%94%E7%A5%9E%E8%8B%B1%E9%9B%84%E4%BC%A0.png"
      },
      {
        "name": "魔神坛斗士",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/5/5d/f28e6a86k1sudazkk2b0rdp0b11yx6t.png/53px-%E5%9B%BE%E6%A0%87_%E9%AD%94%E7%A5%9E%E5%9D%9B%E6%96%97%E5%A3%AB.png"
      },
      {
        "name": "战场女武神",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/6/6b/ltqr6f25tgve70qpfp6564dz5fe8oft.png/47px-%E5%9B%BE%E6%A0%87_%E6%88%98%E5%9C%BA%E5%A5%B3%E6%AD%A6%E7%A5%9E.png"
      },
      {
        "name": "银魂",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/4/4e/5m13oz4lxwnuqtgywkrxfvwx36qd524.png/25px-%E5%9B%BE%E6%A0%87_%E9%93%B6%E9%AD%82.png"
      },
      {
        "name": "黎之轨迹",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/b/b9/rxxb0iisn04r3pkx5jgvqxhc3ji163i.png/49px-%E5%9B%BE%E6%A0%87_%E9%BB%8E%E4%B9%8B%E8%BD%A8%E8%BF%B9.png"
      },
      {
        "name": "光明之响",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/a/a9/t002a5hdgn292en2hmanok23yik1mao.png/47px-%E5%9B%BE%E6%A0%87_%E5%85%89%E6%98%8E%E4%B9%8B%E5%93%8D.png"
      },
      {
        "name": "秀逗魔导士",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/f/ff/f2nx6851dy7xyxd21ykuqb6rlvn47t8.png/100px-%E5%9B%BE%E6%A0%87_%E7%A7%80%E9%80%97%E9%AD%94%E5%AF%BC%E5%A3%AB.png"
      },
      {
        "name": "强殖装甲凯普",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/d/d5/jfjnzprtqhxoa2g4pp028769ilchvn2.png/59px-%E5%9B%BE%E6%A0%87_%E5%BC%BA%E6%AE%96%E8%A3%85%E7%94%B2%E5%87%AF%E6%99%AE.png"
      },
      {
        "name": "名将战队",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/e/e8/dpcwrd6w5g3q3flus5apz8aig3t8mwz.png/94px-%E5%9B%BE%E6%A0%87_%E5%90%8D%E5%B0%86%E6%88%98%E9%98%9F.png"
      },
      {
        "name": "死或生",
        "src": "https://patchwiki.biligame.com/images/langrisser/thumb/3/38/ntsrpj7e937qvg8uxz25lwhgu6hmgaw.png/112px-%E5%9B%BE%E6%A0%87_%E6%AD%BB%E6%88%96%E7%94%9F.png"
      }
    ],
  }
}

const filterData = ref(Object.keys(filterDataList).map(i => {
  const item = filterDataList[i];
  return {
    ...item,
    canEffectTogether: item.canEffectTogether,
    matchKey: item.matchKey,
    data: item.data,
    name: i,
    effectTogether: false,
    collapsed: true,
  };
}));

const showHeroes = computed(() => {
  let list = heroes.value;

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
  selectedHero.value = hero.heroName;
}

function handleConfirm() {
  if (resolvePromise.value) {
    resolvePromise.value(selectedHero.value);
  }
  visible.value = false;
}

function handleCancel() {
  if (resolvePromise.value) {
    resolvePromise.value(null);
  }
  visible.value = false;
}

onMounted(() => {
  const heroQuery = new AV.Query('Hero');
  heroQuery.limit(1000).find().then(res => {
    heroes.value = res.map(i => i.toJSON());
  });
});

function showHeroSelector() {
  visible.value = true;
  selectedHero.value = null;
  return new Promise((resolve) => {
    resolvePromise.value = resolve;
  });
}

defineExpose({ showHeroSelector });
</script>

<style scoped lang="scss">
.hero-item {
  border: 2px solid transparent;
  &.selected-hero {
    border: 2px solid blue; /* 标识选中的英雄 */
    opacity: 1;
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
</style>