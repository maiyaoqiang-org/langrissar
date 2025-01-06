<template>
  <view class="aoejsq" style="padding:10rpx 10rpx 180rpx;">
    <button @click="resetFormData">重置数据</button>
    <uni-forms
        class="my-form"
        :label-width="160"
        label-align="right"
        validateTrigger="blur"
        ref="formRef" :modelValue="formData">
      <uni-segmented-control
          styleType="text"
          :current="gsTabCurrent"
          :values="gsTab"
          @clickItem="({currentIndex})=>gsTabCurrent=currentIndex"></uni-segmented-control>
      <uni-segmented-control
          styleType="text"
          :current="gfTabCurrent"
          :values="gfTab"
          @clickItem="({currentIndex})=>gfTabCurrent=currentIndex"></uni-segmented-control>

      <view v-if="gsTabCurrent===0">
        <view v-show="gfTabCurrent === 0">
          <uni-forms-item label="英雄伤害类型">
            <uni-data-checkbox v-model="formData.yxsh_lx" :localdata="Object.values(AttackType)"/>
          </uni-forms-item>
          <uni-forms-item v-if="formData.yxsh_lx === AttackType.physics.value" label="攻方英雄攻击">
            <uni-easyinput type="text" v-model="formData.gf_yxgj"/>
          </uni-forms-item>
          <uni-forms-item v-if="formData.yxsh_lx === AttackType.magic.value" label="攻方英雄智力">
            <uni-easyinput type="text" v-model="formData.gf_yxzl"/>
          </uni-forms-item>
          <uni-forms-item label="英雄对士兵攻智克制系数加成%">
            <percent-input type="text" v-model="formData.gf_yxdsb_gzkzxs"/>
          </uni-forms-item>
          <uni-forms-item label="英雄对英雄攻智克制系数加成%">
            <percent-input type="text" v-model="formData.gf_yxdyx_gzkzxs"/>
          </uni-forms-item>
          <uni-forms-item label="无视双防系数%">
            <percent-input type="text" v-model="formData.gf_yx_wsfy"/>
          </uni-forms-item>
          <uni-forms-item label="攻方英雄技能倍率">
            <uni-easyinput type="text" v-model="formData.gf_yxjnbl"/>
          </uni-forms-item>
          <uni-forms-item label="攻方英雄通用增伤%">
            <percent-input type="text" v-model="formData.gf_yx_tyzs"/>
          </uni-forms-item>
          <uni-forms-item label="攻方英雄技能增伤%">
            <percent-input v-model="formData.gf_yx_jnzs"/>
          </uni-forms-item>
          <uni-forms-item label="攻方英雄远程增伤%">
            <percent-input type="text" v-model="formData.gf_yx_yczs"/>
          </uni-forms-item>
          <uni-forms-item label="攻方英雄其他增伤%">
            <percent-input type="text" v-model="formData.gf_yx_qtzs"/>
          </uni-forms-item>
          <uni-forms-item label="攻方英雄暴伤加成%">
            <percent-input type="text" v-model="formData.gf_yx_bs"/>
          </uni-forms-item>
        </view>
      </view>
      <view v-if="gsTabCurrent===1">
        <view v-show="gfTabCurrent === 0">
          <uni-forms-item label="守方士兵防御">
            <uni-easyinput type="text" v-model="formData.sf_sbfy"/>
          </uni-forms-item>
          <uni-forms-item label="守方士兵魔防">
            <uni-easyinput type="text" v-model="formData.sf_sbmf"/>
          </uni-forms-item>
          <uni-forms-item label="士兵与 攻方英雄 交战时双防克制系数加成%">
            <percent-input type="text" v-model="formData.sf_sbdyx_sfkzxs"/>
          </uni-forms-item>
          <uni-forms-item label="守方士兵通用减伤%">
            <percent-input type="text" v-model="formData.sf_sb_tyjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方士兵技能减伤%">
            <percent-input type="text" v-model="formData.sf_sb_jnjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方士兵远程减伤%">
            <percent-input type="text" v-model="formData.sf_sb_ycjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方士兵其他减伤%">
            <percent-input type="text" v-model="formData.sf_sb_qtjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方士兵减暴伤%">
            <percent-input type="text" v-model="formData.sf_sb_jbs"/>
          </uni-forms-item>
        </view>
        <view v-show="gfTabCurrent === 1">
          <uni-forms-item label="守方英雄防御">
            <uni-easyinput type="text" v-model="formData.sf_yxfy"/>
          </uni-forms-item>
          <uni-forms-item label="守方英雄魔防">
            <uni-easyinput type="text" v-model="formData.sf_yxmf"/>
          </uni-forms-item>
          <uni-forms-item label="英雄与 攻方英雄 交战时双防克制系数加成%">
            <percent-input type="text" v-model="formData.sf_yxdyx_sfkzxs"/>
          </uni-forms-item>
          <uni-forms-item label="守方英雄通用减伤%">
            <percent-input type="text" v-model="formData.sf_yx_tyjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方英雄技能减伤%">
            <percent-input type="text" v-model="formData.sf_yx_jnjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方英雄远程减伤%">
            <percent-input type="text" v-model="formData.sf_yx_ycjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方英雄其他减伤%">
            <percent-input type="text" v-model="formData.sf_yx_qtjs"/>
          </uni-forms-item>
          <uni-forms-item label="守方英雄减暴伤%">
            <percent-input type="text" v-model="formData.sf_yx_jbs"/>
          </uni-forms-item>
        </view>
        <uni-forms-item label="守方地形">
          <uni-data-select
              v-model="formData.sf_dxxz"
              :localdata="TerrainTypeShowList"
          ></uni-data-select>
        </uni-forms-item>
      </view>

      <base-divider></base-divider>

      <uni-popup
          type="bottom"
          ref="sqPopup">
        <view style="max-height: 80vh;width:100%;overflow: auto;">
          <base-table
              :data="sq_table"
              :columns="sq_table_columns"></base-table>
        </view>
      </uni-popup>
      <uni-popup
          type="bottom"
          ref="zykzPopup">
        <view style="max-height: 80vh;width:100%;overflow: auto;">
          <base-table
              class="table-fixed1"
              :data="zykz_table"
              :columns="zykz_table_columns"></base-table>
        </view>
      </uni-popup>
      <uni-popup
          type="bottom"
          ref="sbkjAoePopup">
        <view style="max-height: 80vh;width:100%;overflow: auto;">
          <base-table
              class="table-fixed1"
              :data="sbkj_aoe_table"
              :columns="sbkj_aoe_table_columns"></base-table>
        </view>
      </uni-popup>

      <button style="margin:12rpx;" @click="()=>sqPopup.open()">（点击打开查看）神契晨曦之祝特效参考</button>
      <button style="margin:12rpx;" @click="()=>zykzPopup.open()">（点击打开查看）职业克制系数参考</button>
      <button style="margin:12rpx;" @click="()=>sbkjAoePopup.open()">（点击打开查看）与AOE有关的士兵科技参考</button>

      <base-divider></base-divider>

      <view style="position:sticky;bottom:0;background:#fff;font-size: 24rpx;">
        <view class="average-box">
          <view>
            <view>
              英雄打英雄伤害为：
              <view class="success value">
                {{ round(calculateVariables.yxdyx_aoe_sh,2) }}
              </view>
            </view>
            <view>
              英雄打英雄暴击伤害为：
              <view class="warning value">
                {{ round(calculateVariables.yxdyx_aoebj_sh,2) }}
              </view>
            </view>
          </view>
          <view>
            <view>
              英雄打兵伤害为：
              <view class="primary value">
                {{ round(calculateVariables.yxdb_aoe_sh,2) }}
              </view>
            </view>
            <view>
              英雄打兵暴击伤害为：
              <view class="warning value">
                {{ round(calculateVariables.yxdb_aoebj_sh,2) }}
              </view>
            </view>
          </view>
        </view>



      </view>

      <base-divider></base-divider>
      <view style="font-size: 32rpx;color:#dd524d;">
        以下即将进行AOE战斗模拟
      </view>

      <uni-forms-item label="守方护盾值">
        <uni-easyinput type="text" v-model="formData.hudun_value"/>
      </uni-forms-item>
      <uni-forms-item label="战后固伤值">
        <uni-easyinput type="text" v-model="formData.zh_gs"/>
      </uni-forms-item>

      <view class="average-box">
        <base-check-box
            v-model="formData.yxdyx_sfbj" label="英雄打英雄 是否暴击"></base-check-box>
        <base-check-box
            v-model="formData.yxdb_sfbj" label="英雄打兵 是否暴击"></base-check-box>
      </view>


      <view style="background:#fff;font-size: 24rpx;">
        <view class="average-box">
          <view>
            实际AOE伤害为：
          </view>
        </view>
        <view class="average-box">
          <view>
            英雄打英雄伤害为：
            <view class="value" :class="[formData.yxdyx_sfbj?'warning':'success']">
              {{calculateVariables.yxdyx_aoesj_sh }}
            </view>
          </view>
          <view>
            英雄打兵伤害为：
            <view class="value" :class="[formData.yxdb_sfbj?'warning':'primary']">
              {{calculateVariables.yxdb_aoesj_sh }}
            </view>
          </view>
        </view>
        <view class="average-box">
          <view>
            头上冒出的总伤害为（英雄+兵）：
            <view class="error value">
              {{calculateVariables.aoe_zsh }}
            </view>
          </view>
        </view>

      </view>

      <button style="margin:12rpx;" @click="saveCurrentData">点击保存此段伤害</button>


      <uni-card
          v-for="({data},index) in saveList" :key="index">
        <template #title>
          <view style="display: flex;align-items: center;">
           <view>
             第{{index+1}}段伤害
           </view>
            <view style="margin-left: auto;" @click="deleteSaveData(index)">
              删除
            </view>
          </view>
        </template>
        <view>
            <view>
              英雄打英雄：<text class="value success">{{data.yxdyx_zz}}</text>
              <template v-if="data.hudun_yxdyx_cs_value>0">
                护盾值：<text class="value warning">{{data.hudun_yxdyx_cs_value}}</text>
              </template>
            </view>
            <view>
              英雄打兵：<text class="value primary">{{data.yxdb_zz}}</text>
              <template v-if="data.hudun_yxdb_cs_value>0">
                护盾值：<text class="value warning">{{data.hudun_yxdb_cs_value}}</text>
              </template>
            </view>
          <view>
            总伤害：<text class="value error">{{data.zsh_zz}}</text>
            <template v-if="data.hudun_cs_value>0">
              护盾值：<text class="value warning">{{data.hudun_cs_value}}</text>
            </template>
          </view>
        </view>
        <template #actions>

        </template>
      </uni-card>
      <uni-card v-if="inputVariables.zhgs_pd">
        <template #title>
          战后固伤伤害
        </template>
        <view class="average-box">
          <view>
            英雄打英雄战后固伤：<text class="success value">{{zhgs.zh_gs_yxdyx}}</text>
          </view>
          <view>
            英雄打英雄战后固伤(护盾抵消)：<text class="warning value">{{zhgs.zh_gs_yxdyx_hudun_cs}}</text>
          </view>
        </view>
        <view class="average-box">
          <view>
            英雄打兵战后固伤：<text class="primary value">{{zhgs.zh_gs_yxdb}}</text>
          </view>
          <view>
            英雄打英雄战后固伤(护盾抵消)：<text class="warning value">{{zhgs.zh_gs_yxdb_hudun_cs}}</text>
          </view>
        </view>
      </uni-card>
      <uni-card>
        <template #title>
          总伤害
        </template>
      <view>
        <view>
          英雄打英雄：<text class="value success">{{round((Number(calcTotal.yxdyx_zz) + Number(zhgs.zh_gs_yxdyx)),2)}}</text>
        </view>
        <view>
          英雄打兵：<text class="value primary">{{round((Number(calcTotal.yxdb_zz) + Number(zhgs.zh_gs_yxdb)),2)}}</text>
        </view>
        <base-divider></base-divider>
        <view v-if="Number(zhgs.zh_gs_zsh)">
          战后固伤：<text class="value">{{round(zhgs.zh_gs_zsh,2)}}</text>
        </view>
        <view v-for="({data},index) in saveList" :key="index">
          第{{index+1}}段总伤害：<text class="error value">{{data.zsh_zz}}</text>
        </view>
        <base-divider></base-divider>
        <view>
          打（英雄+兵）总伤害（不含护盾）：<text class="error value">{{round((calcTotal.zsh_zz + Number(zhgs.zh_gs_zsh)),2)}}</text>
        </view>
        <base-divider></base-divider>
        <view>
          护盾承伤：<text class="warning value">{{calcTotal.hudun_cs_value}}</text>
        </view>
        <view v-if="inputVariables.hudun_pd">
          护盾剩余值：{{hudun_pd_total}}
        </view>
      </view>

      </uni-card>

    </uni-forms>
  </view>
</template>

<script setup>
import {ref, watch, computed, watchEffect} from 'vue'
import {
  AttackType,
  TerrainType,
  TerrainTypeShowList,
  TrueFalseCheckBoxData,
  sq_table, sq_table_columns,
  zykz_table, zykz_table_columns,
  sbkj_aoe_table, sbkj_aoe_table_columns,
} from "../common/constant";
import PercentInput from "../components/percent-input.vue";
import BaseTable from "../components/base-table.vue";
import BaseCheckBox from '../components/base-check-box.vue'
import BaseDivider from '../components/base-divider.vue'
import {evaluate} from "mathjs";
import {useRefCache} from "../common/hook";
import {calculateFormula, round} from "../common/utils";


const gsTabCurrent = ref(0)
const gsTab = ref(['攻方', '守方'])
const gfTabCurrent = ref(0)
const gfTab = computed(()=>{
  if(gsTabCurrent.value == 0){
    return ['英雄']
  }else{
    return ['士兵', '英雄']
  }
})
watch(()=>gsTabCurrent.value,(val)=>{
  if(val == 0){
    gfTabCurrent.value = 0
  }
})
const defaultFormData = {
  yxsh_lx: AttackType.physics.value,
  gf_yxgj:"0",
  gf_yxzl:"0",
  gf_yxdsb_gzkzxs:"0",
  gf_yxdyx_gzkzxs:"0",
  gf_yx_wsfy:"0",
  gf_yxjnbl:"1",
  gf_yx_tyzs:"0",
  gf_yx_jnzs:"0",
  gf_yx_yczs:"0",
  gf_yx_qtzs:"0",
  gf_yx_bs:"0",
  sf_yxfy:"0",
  sf_yxmf:"0",
  sf_yxdyx_sfkzxs:"0",
  sf_yx_tyjs:"0",
  sf_yx_jnjs:"0",
  sf_yx_ycjs:"0",
  sf_yx_qtjs:"0",
  sf_yx_jbs:"0",
  sf_sbfy:"0",
  sf_sbmf:"0",
  sf_sbdyx_sfkzxs:"0",
  sf_sb_tyjs:"0",
  sf_sb_jnjs:"0",
  sf_sb_ycjs:"0",
  sf_sb_qtjs:"0",
  sf_sb_jbs:"0",
  hudun_value:"0",
  zh_gs:"0",
  yxdyx_sfbj:false,
  yxdb_sfbj:false,
  sf_dxxz: TerrainType.none.value
}
const formData = useRefCache("langrissar-calculator-aoejsq-formData", JSON.parse(JSON.stringify(defaultFormData)))
const resetFormData = () => {
  formData.value = JSON.parse(JSON.stringify(defaultFormData))
  saveList.value = []
}


const inputVariables = computed(() => {
  // 无需经过calculateFormula转换的数据
  const notFilterList = [
      'yxsh_lx',
      'sf_dxxz',
      'yxdyx_sfbj',
      'yxdb_sfbj'
  ]
  const currentFormData = Object.keys(formData.value).reduce((res,key)=>{
    if(notFilterList.includes(key)){
      res[key] = formData.value[key]
    }else{
      res[key] = calculateFormula(formData.value[key]) ||0
    }
    return res
  },{})
  const sf_dxxz = Object.values(TerrainType).find(i => i.value === currentFormData?.sf_dxxz)?.rate / 100 || 0
  const hudun_value = round(currentFormData.hudun_value||0)
  const hudun_pd = Boolean(hudun_value>0)
  const zhgs_pd = Boolean(currentFormData.zh_gs>0)
  return {
    ...currentFormData,
    sf_dxxz,
    hudun_value,
    hudun_pd,
    zhgs_pd
  }
})

const calculateVariables = computed(()=>{
  const allData = {
    ...inputVariables.value,
  }

  let yxdb_aoe_formula
  let yxdb_aoebj_formula
  let yxdyx_aoe_formula
  let yxdyx_aoebj_formula
  // 物理
  if(formData.value.yxsh_lx === AttackType.physics.value){
    yxdb_aoe_formula = `(gf_yxgj*(1+gf_yxdsb_gzkzxs) - sf_sbfy*(1+sf_sbdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs-sf_sb_tyjs) * (1+gf_yx_jnzs-sf_sb_jnjs) * (1+gf_yx_yczs-sf_sb_ycjs) * (1+gf_yx_qtzs-sf_sb_qtjs) * 10`
    yxdb_aoebj_formula = `yxdb_aoe_sh * (1.3+gf_yx_bs-sf_sb_jbs)`
    yxdyx_aoe_formula = `(gf_yxgj*(1+gf_yxdyx_gzkzxs) - sf_yxfy*(1+sf_yxdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs- sf_yx_tyjs) * (1+gf_yx_jnzs-sf_yx_jnjs) * (1+gf_yx_yczs-sf_yx_ycjs) * (1+gf_yx_qtzs-sf_yx_qtjs) * 10`
    yxdyx_aoebj_formula = `yxdyx_aoe_sh * (1.3+gf_yx_bs-sf_yx_jbs)`
  }
  // 魔法
  else{
    yxdb_aoe_formula = `(gf_yxzl*(1+gf_yxdsb_gzkzxs) - sf_sbmf*(1+sf_sbdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs-sf_sb_tyjs) * (1+gf_yx_jnzs-sf_sb_jnjs) * (1+gf_yx_yczs-sf_sb_ycjs) * (1+gf_yx_qtzs-sf_sb_qtjs) * 10`
    yxdb_aoebj_formula = `yxdb_aoe_sh * (1.3+gf_yx_bs-sf_sb_jbs)`
    yxdyx_aoe_formula = `(gf_yxzl*(1+gf_yxdyx_gzkzxs) - sf_yxmf*(1+sf_yxdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs- sf_yx_tyjs) * (1+gf_yx_jnzs-sf_yx_jnjs) * (1+gf_yx_yczs-sf_yx_ycjs) * (1+gf_yx_qtzs-sf_yx_qtjs) * 10`
    yxdyx_aoebj_formula = `yxdyx_aoe_sh * (1.3+gf_yx_bs-sf_yx_jbs)`
  }
  let yxdb_aoe_sh = calculateFormula(yxdb_aoe_formula, allData)
  let yxdb_aoebj_sh = calculateFormula(yxdb_aoebj_formula, {
    ...allData,
    yxdb_aoe_sh
  })
  let yxdyx_aoe_sh = calculateFormula(yxdyx_aoe_formula, allData)
  let yxdyx_aoebj_sh = calculateFormula(yxdyx_aoebj_formula, {
    ...allData,
    yxdyx_aoe_sh
  })

  let yxdyx_aoesj_sh
  let yxdb_aoesj_sh
  if(allData.yxdyx_sfbj){
    yxdyx_aoesj_sh = round(yxdyx_aoebj_sh,2)
  }else{
    yxdyx_aoesj_sh = round(yxdyx_aoe_sh,2)
  }

  if(allData.yxdb_sfbj){
    yxdb_aoesj_sh = round(yxdb_aoebj_sh,2)
  }else{
    yxdb_aoesj_sh = round(yxdb_aoe_sh,2)
  }

  const aoe_zsh = (round(yxdyx_aoesj_sh) + round(yxdb_aoesj_sh)).toFixed()

  return {
    ...allData,
    yxdb_aoe_sh,
    yxdb_aoebj_sh,
    yxdyx_aoe_sh,
    yxdyx_aoebj_sh,
    yxdb_aoesj_sh,
    yxdyx_aoesj_sh,
    aoe_zsh,
  }
})

const saveList = useRefCache("langrissar-calculator-aoejsq-saveList", [])
const saveCurrentData = ()=>{
  let zsh_zz,hudun_cs_value,yxdyx_zz,yxdb_zz,hudun_yxdyx_cs_value,hudun_yxdb_cs_value,zh_gs_yxdyx
  let hudun_sy_value = hudun_sy_value_c.value
  let zsh = calculateVariables.value.aoe_zsh
  let yxdyx = round(calculateVariables.value.yxdyx_aoesj_sh)
  let yxdb = round(calculateVariables.value.yxdb_aoesj_sh)
  if (zsh >= hudun_sy_value) {
    if (hudun_sy_value !== 0) {
      zsh_zz = zsh - hudun_sy_value;
      hudun_cs_value = hudun_sy_value;

      if (zsh == 0) {
        yxdyx_zz = 0;
        yxdb_zz = 0;
        hudun_yxdyx_cs_value = 0;
        hudun_yxdb_cs_value = 0;
      } else {
        yxdyx_zz = Math.round(zsh_zz * (yxdyx / zsh));
        yxdb_zz = Math.round(zsh_zz * (yxdb / zsh));
        hudun_yxdyx_cs_value = Math.round(hudun_cs_value * (yxdyx / zsh));
        hudun_yxdb_cs_value = Math.round(hudun_cs_value * (yxdb / zsh));
      }
    } else {
      zsh_zz = zsh;
      yxdyx_zz = yxdyx;
      yxdb_zz = yxdb;
      hudun_cs_value = 0;
      hudun_yxdyx_cs_value = 0;
      hudun_yxdb_cs_value = 0;
    }
  } else {
    zsh_zz = 0;
    yxdyx_zz = 0;
    yxdb_zz = 0;
    hudun_cs_value = zsh;

    if (zsh === 0) {
      hudun_yxdyx_cs_value = 0;
      hudun_yxdb_cs_value = 0;
    } else {
      hudun_yxdyx_cs_value = Math.round(hudun_cs_value * (yxdyx / zsh));
      hudun_yxdb_cs_value = Math.round(hudun_cs_value * (yxdb / zsh));
    }
  }



  saveList.value.push({
    formData:{
      ...formData.value,
    },
    data:{
      // 保存总伤害
      zsh_zz,
      // 保存护盾承伤值（总伤害）
      hudun_cs_value,
      // 保存英雄打英雄伤害
      yxdyx_zz,
      // 保存英雄打兵伤害
      yxdb_zz,
      // 保存护盾承伤值（英雄打英雄）
      hudun_yxdyx_cs_value,
      // 保存护盾承伤值（英雄打兵）
      hudun_yxdb_cs_value
    }
  })
}
const deleteSaveData = (index)=>{
  saveList.value.splice(index,1)
}
const calcTotal = computed(()=>{
  const dataList = saveList.value.map(i=>i.data)
  const totalRes = {
    // 保存总伤害
    zsh_zz:0,
    // 保存护盾承伤值（总伤害）
    hudun_cs_value:0,
    // 保存英雄打英雄伤害
    yxdyx_zz:0,
    // 保存英雄打兵伤害
    yxdb_zz:0,
    // 保存护盾承伤值（英雄打英雄）
    hudun_yxdyx_cs_value:0,
    // 保存护盾承伤值（英雄打兵）
    hudun_yxdb_cs_value:0
  }
  dataList.forEach((item)=>{
    for(let key in item){
      totalRes[key] = totalRes[key] + Number(item[key]||0)
    }
  })
  return totalRes
})
// 当前护盾剩余值，减去已记录承伤
const hudun_sy_value_c = computed(()=>{
  return Math.max(0, inputVariables.value.hudun_value - calcTotal.value.hudun_cs_value);
})
const zhgs = computed(()=>{
  const saved_hudun_cs_value = calcTotal.value.hudun_cs_value
  const {zhgs_pd,zh_gs,hudun_value} = inputVariables.value
  let zh_gs_yxdyx=0,zh_gs_yxdb=0,zh_gs_zsh=0,zh_gs_yxdyx_hudun_cs=0,zh_gs_yxdb_hudun_cs=0,zh_gs_zsh_hudun_cs = 0
  const hudun_sy_value = hudun_sy_value_c.value
  if ((hudun_value - saved_hudun_cs_value) > 0 && zhgs_pd) {
    // 如果多段AOE打完后还有护盾
    const hudun_sy_value_zh_gs = hudun_sy_value - saved_hudun_cs_value // 打战后固伤前还剩余的护盾值

    if (zh_gs * 2 <= hudun_sy_value_zh_gs) {
      zh_gs_yxdyx = 0;
      zh_gs_yxdb = 0;
      zh_gs_zsh = 0;
      zh_gs_yxdyx_hudun_cs = zh_gs;
      zh_gs_yxdb_hudun_cs = zh_gs;
      zh_gs_zsh_hudun_cs = zh_gs * 2;
    } else {
      zh_gs_yxdyx = Math.floor((zh_gs * 2 - hudun_sy_value_zh_gs) / 2);
      zh_gs_yxdb = Math.ceil((zh_gs * 2 - hudun_sy_value_zh_gs) / 2);
      zh_gs_zsh = zh_gs_yxdyx + zh_gs_yxdb;
      zh_gs_yxdyx_hudun_cs = hudun_sy_value_zh_gs / 2;
      zh_gs_yxdb_hudun_cs = hudun_sy_value_zh_gs / 2;
      zh_gs_zsh_hudun_cs = hudun_sy_value_zh_gs;
    }
  } else {
    zh_gs_yxdyx = zh_gs;
    zh_gs_yxdb = zh_gs;
    zh_gs_zsh = zh_gs * 2;
    zh_gs_zsh_hudun_cs = 0;
  }
  return {
    zh_gs_yxdyx,
    zh_gs_yxdb,
    zh_gs_zsh,
    zh_gs_yxdyx_hudun_cs,
    zh_gs_yxdb_hudun_cs,
    zh_gs_zsh_hudun_cs,
  }

})

// 最终护盾剩余值
const hudun_pd_total = computed(()=>{
  const {hudun_value,zhgs_pd} = inputVariables.value
  const saved_hudun_cs_value = calcTotal.value.hudun_cs_value
  const {zh_gs_zsh_hudun_cs} = zhgs.value
  let hudun_sy_value = 0
  if (zhgs_pd) {
    hudun_sy_value = Math.max(0, hudun_value - saved_hudun_cs_value - zh_gs_zsh_hudun_cs);
  } else {
    hudun_sy_value = Math.max(0, hudun_value - saved_hudun_cs_value);
  }
  return hudun_sy_value
})

const sqPopup = ref(null)

const zykzPopup = ref(null)

const sbkjAoePopup = ref(null)

</script>
<style lang="scss" scoped>
.aoejsq {
  .uni-forms-item {
    margin-bottom: 12rpx;
  }

  .table-fixed1 {
    .uni-table-th:first-child, .uni-table-td:first-child {
      position: sticky;
      left: 0;
      background: #fff;
    }

  }

  .sticky-result {
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 99;
    font-size: 24rpx;
  }

  .uni-card{
    padding-top:16rpx !important;
  }
}

</style>
