<template>
  <div style="padding:10rpx 10rpx 180rpx;">
    <uni-forms
        class="my-form"
        :label-width="140"
        label-align="right"
        validateTrigger="blur"
        ref="formRef" :modelValue="formData" :rules="rules">
      <uni-forms-item label="攻击类型" name="sh_lx">
        <uni-data-checkbox v-model="formData.sh_lx" :localdata="Object.values(AttackType)"/>
      </uni-forms-item>
      <uni-forms-item :label="attackerPanelLabel" name="gf_gj">
        <uni-easyinput type="text" v-model="formData.gf_gj"/>
      </uni-forms-item>
      <uni-forms-item :label="defenderPanelLabel" name="sf_fy">
        <uni-easyinput type="text" v-model="formData.sf_fy"/>
      </uni-forms-item>
      <uni-forms-item label="攻方技能倍率" name="gf_jnbl">
        <uni-easyinput type="text" v-model="formData.gf_jnbl"/>
      </uni-forms-item>
      <uni-forms-item label="通用增减伤%" name="ty_zjs">
        <uni-easyinput type="text" v-model="formData.ty_zjs"/>
      </uni-forms-item>
      <uni-forms-item label="技能增减伤%" name="jn_zjs">
        <uni-easyinput type="text" v-model="formData.jn_zjs"/>
      </uni-forms-item>
      <uni-forms-item label="远程增减伤%" name="yc_zjs">
        <uni-easyinput type="text" v-model="formData.yc_zjs"/>
      </uni-forms-item>
      <uni-forms-item label="其他增减伤%" name="qt_zjs">
        <uni-easyinput type="text" v-model="formData.qt_zjs"/>
      </uni-forms-item>
      <uni-forms-item label="攻方攻智克制系数%" name="gf_gzkzxs">
        <uni-easyinput type="text" v-model="formData.gf_gzkzxs"/>
      </uni-forms-item>
      <uni-forms-item label="攻方无视防御系数%" name="gf_wsfyxs">
        <uni-easyinput type="text" v-model="formData.gf_wsfyxs"/>
      </uni-forms-item>
      <uni-forms-item label="守方双防克制系数%" name="sf_sfkzxs">
        <uni-easyinput type="text" v-model="formData.sf_sfkzxs"/>
      </uni-forms-item>
      <uni-forms-item label="守方地形" name="sf_dxxz">
        <uni-data-select
            v-model="formData.sf_dxxz"
            :localdata="TerrainTypeShowList"
        ></uni-data-select>
      </uni-forms-item>
      <uni-forms-item label="攻击系数" name="gf_gjxs">
        <uni-data-checkbox v-model="formData.gf_gjxs" :localdata="AttackRateShowList"/>
      </uni-forms-item>
      <uni-forms-item label="攻击段数" name="gf_gjds">
        <uni-data-checkbox v-model="formData.gf_gjds" :localdata="AttackSegmentShowList"/>
      </uni-forms-item>
      <uni-forms-item label="攻方爆伤加成%" name="gf_bs">
        <uni-easyinput type="text" v-model="formData.gf_bs"/>
      </uni-forms-item>
      <uni-forms-item label="守方减爆伤加成%" name="sf_jbs">
        <uni-easyinput type="text" v-model="formData.sf_jbs"/>
      </uni-forms-item>
    </uni-forms>


    <view style="font-size: 24rpx;color:#999;">
      <view v-for="(item,index) in shuoming" :key="index">
        {{item}}
      </view>
    </view>


    <view class="fixed-bottom-box">
      <view class="average-box">
        <view>
          单段伤害：{{sh_dd}}
        </view>
        <view>
          总伤害：{{sh_zs}}
        </view>
      </view>
      <view class="average-box">
        <view>
          暴击单段伤害：{{bjsh_dd}}
        </view>
        <view>
          暴击总伤害：{{bjsh_zs}}
        </view>
      </view>
    </view>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {onReady} from "@dcloudio/uni-app";
import {AttackRate, AttackSegment, AttackType, TerrainType} from "../../common/constant";
import {useRefCache} from "../../common/hook";

const shuoming = ref(`
使用说明：\n
1.面板和增伤都是可以代入公式计算的，如要算一个士兵的攻击面板，可以直接输入233*(1+0.2+0.3)。但注意一定要使用英文的括号和英文的* /乘除法。\n
2.增减伤、克制系数、无视克制都是默认百分比形式，如增伤应输入“20+5+8”，如克制系数如果是魔力震荡打圣职应输入“50”。\n
3.增减伤需要判断正负号，如兰迪远程减伤光环，应在远程增减伤乘区输入“-15”。\n
4.物理和魔法伤害需要手动选择，物理伤害默认用攻击-防御，魔法伤害默认用智力-魔防，如像尤弥尔这类物理转魔法，应将尤弥尔的攻击填到智力处，不然不能正常生效。\n
5.如果没有出数据，检查是不是技能倍率没填，普攻要填1。\n
6.如有站地形需要手动选择地形，或自己手动在“守方双防克制系数”填入地形加成系数。\n
7.无视防御系数默认为无视双防，物理和魔法伤害计算均生效，仍为填入百分比，如水晶锋刺，应填入20。\n
8.使用期间可能用诸多问题，建议作为测试机制，模拟经验使用。战场千遍万化靠的是经验，如实战使用翻车，不承担任何责任。\n
9.梦战计算器使用交流群 928411216
`.split('\n'))

const TerrainTypeShowList = Object.values(TerrainType).map((i)=>{
  return {
    text: `${i.text} (${i.rate}%)`,
    value: i.value
  }
})
const AttackRateShowList = Object.values(AttackRate).map((i)=>{
  return {
    text: `${i.text} (${i.rate})`,
    value: i.value
  }
})
const AttackSegmentShowList = Object.values(AttackSegment).map((i)=>{
  return {
    text: `${i.text} (${i.segment})`,
    value: i.value
  }
})


const formData = useRefCache("langrissar-calculator-index-fromData",{
  sh_lx:AttackType.physics.value,
  sf_dxxz: TerrainType.none.value,
  gf_gjxs: AttackRate.single.value,
  gf_gjds: AttackSegment.single.value,
})
const attackerPanelLabel = computed(() => {
  switch (formData.value.sh_lx) {
    case AttackType.magic.value:
      return "攻方智力"
    case AttackType.physics.value:
      return "攻方攻击"
  }
})
const defenderPanelLabel = computed(() => {
  switch (formData.value.sh_lx) {
    case AttackType.magic.value:
      return "守方魔防"
    case AttackType.physics.value:
      return "守方防御"
  }
})


const rules = ref({})

const formRef = ref(null)
onReady(() => {
  // 需要在onReady中设置规则
  formRef.value.setRules(rules.value)
})

// 单段伤害值计算
const sh_dd = computed(() => {
  let res = 0
  try {
    let {
      gf_gj=0,
      gf_gzkzxs=0,
      sf_fy=0,
      sf_sfkzxs=0,
      gf_wsfyxs=0,
      gf_jnbl=0,
      ty_zjs=0,
      jn_zjs=0,
      yc_zjs=0,
      qt_zjs=0,
      sf_dxxz=0,
      gf_gjxs=0,
    } = formData.value
    ty_zjs = ty_zjs / 100
    jn_zjs = jn_zjs / 100
    yc_zjs = yc_zjs / 100
    qt_zjs = qt_zjs / 100
    gf_gzkzxs = gf_gzkzxs / 100
    gf_wsfyxs = gf_wsfyxs / 100
    sf_sfkzxs = sf_sfkzxs / 100
    sf_dxxz = Object.values(TerrainType).find(i=>i.value===sf_dxxz).rate/100
    gf_gjxs = Object.values(AttackRate).find(i=>i.value===gf_gjxs).rate

    const resStr = `(${gf_gj}*(1+${gf_gzkzxs}) - ${sf_fy}*(1+${sf_sfkzxs}+${sf_dxxz})*(1-${gf_wsfyxs})) * ${gf_jnbl} * (1+${ty_zjs}) * (1+${jn_zjs}) * (1+${yc_zjs}) * (1+${qt_zjs}) * ${gf_gjxs}`
    // console.log(resStr)
    res = eval(resStr)
  }
  catch (e) {
    console.log(e)
  }
  return res
})
const sh_zs = computed(()=>{
  let res = 0
  try {
    const gf_gjds = Object.values(AttackSegment).find(i=>i.value===formData.value.gf_gjds).segment
    res = eval(`${sh_dd.value} * ${gf_gjds}`)
  }
  catch (e){
    console.log(e)
  }
  return res
})
const bjsh_dd = computed(()=>{
  let res = 0
  try {
    const {
      gf_bs=0,
      sf_jbs=0
    } = formData.value
    res = eval(` ${sh_dd.value} * (1.3+${gf_bs}-${sf_jbs})`)
  }
  catch (e) {
    console.log(e)
  }

  return res
})
const bjsh_zs = computed(()=>{
  let res = 0
  try {
    const gf_gjds = Object.values(AttackSegment).find(i=>i.value===formData.value.gf_gjds).segment
    res = eval(`${bjsh_dd.value} * ${gf_gjds}`)
  }
  catch (e) {
    console.log(e)
  }
  return res
})

</script>

<style lang="scss">

.fixed-bottom-box{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f5f5f5;
  text-align: center;
  box-shadow: 0 0 5px #ccc;
}



</style>
