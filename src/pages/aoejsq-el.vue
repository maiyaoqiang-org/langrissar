<template>
  <view class="aoejsq" style="padding:24px;">
    <el-button class="mb_16" type="primary" @click="resetFormData">重置数据</el-button>

    <el-form label-width="160px" class="base-el-form" label-position="left" :inline="true"
             :model="formData">
      <view class="mb_16" flex="box:mean" style="flex-wrap: wrap;">
        <el-card style="min-width: 400px;" class="mr_16 mb_16">
          <el-form-item label="英雄伤害类型">
            <el-radio-group v-model="formData.yxsh_lx">
              <el-radio v-for="(item,index) in AttackType" :key="index" :value="item.value">{{
                  item.text
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.yxsh_lx === AttackType.physics.value" label="攻方英雄攻击">
            <mz-input prop="gf_yxgj" :form-data="formData"/>
          </el-form-item>
          <el-form-item v-if="formData.yxsh_lx === AttackType.magic.value" label="攻方英雄智力">
            <mz-input prop="gf_yxzl" :form-data="formData"/>
          </el-form-item>
          <view flex>
            <el-form-item>
              <el-checkbox v-model="formData.yx_yxdb_kzpd"
                           @change="(val)=>(!val)&&(formData.gf_yxdsb_gzkzxs=formData.sf_sbdyx_sfkzxs=0)"
                           label="英雄与兵 有克制关系"/>
            </el-form-item>
            <el-form-item v-if="formData.yx_yxdb_kzpd" label-width="200px" label="英雄对士兵攻智克制系数加成">
              <mz-percent-input prop="gf_yxdsb_gzkzxs" :form-data="formData"></mz-percent-input>
            </el-form-item>
          </view>
          <view flex>
            <el-form-item>
              <el-checkbox v-model="formData.yx_yxdyx_kzpd"
                           @change="(val)=>(!val)&&(formData.gf_yxdyx_gzkzxs=formData.sf_yxdyx_sfkzxs=0)"
                           label="英雄与英雄 有克制关系"/>
            </el-form-item>
            <el-form-item v-if="formData.yx_yxdyx_kzpd" label-width="200px" label="英雄对英雄攻智克制系数加成">
              <mz-percent-input prop="gf_yxdyx_gzkzxs" :form-data="formData"></mz-percent-input>
            </el-form-item>
          </view>
          <el-form-item label="无视双防系数">
            <mz-percent-input prop="gf_yx_wsfy" :form-data="formData" />
          </el-form-item>
          <el-form-item label="攻方英雄技能倍率">
            <mz-input prop="gf_yxjnbl" :form-data="formData" />
          </el-form-item>
          <el-form-item label="攻方英雄通用增伤">
            <mz-percent-input prop="gf_yx_tyzs" :form-data="formData"/>
          </el-form-item>
          <el-form-item label="攻方英雄技能增伤">
            <mz-percent-input prop="gf_yx_jnzs" :form-data="formData" />
          </el-form-item>
          <el-form-item label="攻方英雄远程增伤">
            <mz-percent-input prop="gf_yx_yczs" :form-data="formData" />
          </el-form-item>
          <el-form-item label="攻方英雄其他增伤">
            <mz-percent-input prop="gf_yx_qtzs" :form-data="formData" />
          </el-form-item>
          <el-form-item label="攻方英雄暴伤加成">
            <mz-percent-input prop="gf_yx_bs" :form-data="formData" />
          </el-form-item>
        </el-card>
        <el-card style="min-width: 400px;" class="mr_16 mb_16">
          <el-tabs model-value="守方英雄">
            <el-tab-pane label="守方英雄" name="守方英雄">
              <view>
                <el-form-item label="守方英雄防御">
                  <mz-input prop="sf_yxfy" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方英雄魔防">
                  <mz-input prop="sf_yxmf" :form-data="formData"/>
                </el-form-item>
                <el-form-item
                    label-width="280px"
                    v-if="formData.yx_yxdyx_kzpd"
                    label="英雄与 攻方英雄 交战时双防克制系数加成">
                  <mz-percent-input prop="sf_yxdyx_sfkzxs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方英雄通用减伤">
                  <mz-percent-input prop="sf_yx_tyjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方英雄技能减伤">
                  <mz-percent-input prop="sf_yx_jnjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方英雄远程减伤">
                  <mz-percent-input prop="sf_yx_ycjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方英雄其他减伤">
                  <mz-percent-input prop="sf_yx_qtjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方英雄减暴伤">
                  <mz-percent-input prop="sf_yx_jbs" :form-data="formData"/>
                </el-form-item>
              </view>
            </el-tab-pane>
            <el-tab-pane label="守方士兵" name="守方士兵">
              <view>
                <el-form-item label="守方士兵防御">
                  <mz-input prop="sf_sbfy" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方士兵魔防">
                  <mz-input prop="sf_sbmf" :form-data="formData"/>
                </el-form-item>
                <el-form-item
                    label-width="280px"
                    v-if="formData.yx_yxdb_kzpd"
                    label="士兵与 攻方英雄 交战时双防克制系数加成">
                  <mz-percent-input prop="sf_sbdyx_sfkzxs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方士兵通用减伤">
                  <mz-percent-input prop="sf_sb_tyjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方士兵技能减伤">
                  <mz-percent-input prop="sf_sb_jnjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方士兵远程减伤">
                  <mz-percent-input prop="sf_sb_ycjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方士兵其他减伤">
                  <mz-percent-input prop="sf_sb_qtjs" :form-data="formData"/>
                </el-form-item>
                <el-form-item label="守方士兵减暴伤">
                  <mz-percent-input prop="sf_sb_jbs" :form-data="formData"/>
                </el-form-item>
              </view>
            </el-tab-pane>
          </el-tabs>
          <view>
            <el-form-item style="width:300px;" label="守方地形">
              <el-select v-model="formData.sf_dxxz">
                <el-option v-for="item in TerrainTypeShowList" :key="item.value" :label="item.text"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </view>
        </el-card>
      </view>

      <el-dialog width="80vw" v-model="sqDialog">
        <el-table :data="sq_table">
          <el-table-column v-for="item in sq_table_columns"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.label"/>
        </el-table>
      </el-dialog>
      <el-dialog width="80vw" v-model="zykzDialog">
        <el-table :data="zykz_table">
          <el-table-column v-for="item in zykz_table_columns"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.label"
                           :fixed="item.fixed"
                           width="120"/>
        </el-table>
      </el-dialog>
      <el-dialog width="80vw" v-model="sbkjAoeDialog">
        <el-table :data="sbkj_aoe_table">
          <el-table-column v-for="item in sbkj_aoe_table_columns"
                           class="table-fixed1"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.label"/>
        </el-table>
      </el-dialog>

      <view class="mb_16">
        <el-button @click="sqDialog=true" type="primary">
          （点击打开查看）神契晨曦之祝特效参考
        </el-button>
        <el-button @click="zykzDialog=true" type="primary">
          （点击打开查看）职业克制系数参考
        </el-button>
        <el-button @click="sbkjAoeDialog=true" type="primary">
          （点击打开查看）与AOE有关的士兵科技参考
        </el-button>
      </view>

      <el-card class="mb_16">
        <view class="average-box">
          <view>
            英雄打英雄伤害为：
            <text class="success value">{{ round(calculateVariables.yxdyx_aoe_sh, 2) }}</text>
          </view>
          <view>
            英雄打兵伤害为：
            <text class="primary value">{{ round(calculateVariables.yxdb_aoe_sh, 2) }}</text>
          </view>

        </view>
        <view class="average-box">
          <view>
            英雄打英雄暴击伤害为：
            <text class="warning value">{{ round(calculateVariables.yxdyx_aoebj_sh, 2) }}</text>
          </view>
          <view>
            英雄打兵暴击伤害为：
            <text class="warning value">{{ round(calculateVariables.yxdb_aoebj_sh, 2) }}</text>
          </view>
        </view>
      </el-card>

      <view class="mb_16" style="font-size: 24px;color:#dd524d;">
        以下即将进行AOE战斗模拟
      </view>

      <el-card class="mb_16">
        <el-form-item label="守方护盾值">
          <mz-input prop="hudun_value" :form-data="formData"/>
        </el-form-item>
        <el-form-item label="战后固伤值">
          <mz-input prop="zh_gs" :form-data="formData"/>
        </el-form-item>

        <view class="average-box">
          <el-checkbox v-model="formData.yxdyx_sfbj" label="英雄打英雄 是否暴击"></el-checkbox>
          <el-checkbox v-model="formData.yxdb_sfbj" label="英雄打兵 是否暴击"></el-checkbox>
        </view>

      </el-card>

      <el-card class="mb_16">
        <view class="average-box">
          <view>
            实际AOE伤害为：
          </view>
        </view>
        <view class="average-box">
          <view>
            英雄打英雄伤害为：
            <text class="value" :class="[formData.yxdyx_sfbj ? 'warning' : 'success']">
              {{ calculateVariables.yxdyx_aoesj_sh }}
            </text>
          </view>
          <view>
            英雄打兵伤害为：
            <text class="value" :class="[formData.yxdb_sfbj ? 'warning' : 'primary']">
              {{ calculateVariables.yxdb_aoesj_sh }}
            </text>
          </view>
        </view>
        <view class="average-box">
          <view>
            头上冒出的总伤害为（英雄+兵）：
            <text class="error value">{{ calculateVariables.aoe_zsh }}</text>
          </view>
        </view>
        <el-button class="mt_16" type="primary" @click="saveCurrentData">点击保存此段伤害</el-button>
      </el-card>

      <el-card
          v-for="({ data }, index) in saveList"
          :key="index"
          class="mb_16"
      >
        <template #header>
          <view style="display: flex; align-items: center;">
            <view>第{{ index + 1 }}段伤害</view>
            <el-button type="danger" size="small" style="margin-left: auto;" @click="deleteSaveData(index)">
              删除
            </el-button>
          </view>
        </template>
        <view>
          <view>
            英雄打英雄：
            <text class="value success">{{ data.yxdyx_zz }}</text>
            <template v-if="data.hudun_yxdyx_cs_value > 0">
              护盾抵消：
              <text class="value warning">{{ data.hudun_yxdyx_cs_value }}</text>
            </template>
          </view>
          <view>
            英雄打兵：
            <text class="value primary">{{ data.yxdb_zz }}</text>
            <template v-if="data.hudun_yxdb_cs_value > 0">
              护盾抵消：
              <text class="value warning">{{ data.hudun_yxdb_cs_value }}</text>
            </template>
          </view>
          <view>
            总伤害：
            <text class="value error">{{ data.zsh_zz }}</text>
            <template v-if="data.hudun_cs_value > 0">
              护盾抵消：
              <text class="value warning">{{ data.hudun_cs_value }}</text>
            </template>
          </view>
        </view>
      </el-card>

      <el-card v-if="inputVariables.zhgs_pd" class="mb_16">
        <template #header>
          战后固伤伤害
        </template>
        <view class="average-box">
          <view>
            英雄打英雄战后固伤：
            <text class="success value">{{ zhgs.zh_gs_yxdyx }}</text>
          </view>
          <view>
            英雄打英雄战后固伤(护盾抵消)：
            <text class="warning value">{{ zhgs.zh_gs_yxdyx_hudun_cs }}</text>
          </view>
        </view>
        <view class="average-box">
          <view>
            英雄打兵战后固伤：
            <text class="primary value">{{ zhgs.zh_gs_yxdb }}</text>
          </view>
          <view>
            英雄打兵战后固伤(护盾抵消)：
            <text class="warning value">{{ zhgs.zh_gs_yxdb_hudun_cs }}</text>
          </view>
        </view>
      </el-card>

      <el-card class="mb_16">
        <template #header>
          总伤害
        </template>
        <view>
          <view>
            英雄打英雄：
            <text class="value success">{{ round((Number(calcTotal.yxdyx_zz) + Number(zhgs.zh_gs_yxdyx)), 2) }}</text>
          </view>
          <view>
            英雄打兵：
            <text class="value primary">{{ round((Number(calcTotal.yxdb_zz) + Number(zhgs.zh_gs_yxdb)), 2) }}</text>
          </view>
          <base-divider></base-divider>
          <view v-if="Number(zhgs.zh_gs_zsh)">
            战后固伤：
            <text class="value">{{ round(zhgs.zh_gs_zsh, 2) }}</text>
          </view>
          <view v-for="({ data }, index) in saveList" :key="index">
            第{{ index + 1 }}段总伤害：
            <text class="error value">{{ data.zsh_zz }}</text>
          </view>
          <base-divider></base-divider>
          <view>
            打（英雄+兵）总伤害（不含护盾）：
            <text class="error value">{{ round((calcTotal.zsh_zz + Number(zhgs.zh_gs_zsh)), 2) }}</text>
          </view>
          <base-divider></base-divider>
          <view>
            护盾承伤：
            <text class="warning value">{{ calcTotal.hudun_cs_value }}</text>
          </view>
          <view v-if="inputVariables.hudun_pd">
            护盾剩余值：{{ hudun_pd_total }}
          </view>
        </view>
      </el-card>



    </el-form>

    <pre style="user-select: text;">
      使用说明：此计算器搬运了墨源的梦战伤害计算器，一切版权均属于墨源。搬运来源：https://moyuanmzaoejsq.streamlit.app/

      （1）里面每个输入框都是可以直接用英文符号直接用公式计算的，如1588/1.2*(1+0.2+0.3)*1.4非常方便数值调整。

      （2）增减伤、克制系数、无视克制都是默认百分比形式，如增伤应输入“20+5+8”，如克制系数如果是魔力震荡打圣职应输入“50”

      （3）克制修正输入的开关在攻方处，如果需要输入守方的双防克制系数加成，需要在攻方区域打开克制关系。如守方有冰女王的彻骨寒意，可在守方双防克制修正填-20

      （4）物理和魔法伤害需要手动选择，物理伤害默认用攻击-防御，魔法伤害默认用智力-魔防，如像雾香这类物理转魔法，应将雾香的攻击填到智力处，不然不能正常生效。

      （5) 攻方暴击伤害已默认1.3，如果有额外暴伤只需要填入额外爆伤，如锋刺填10

      （6) 考虑了英雄对英雄、英雄对士兵的分别计算，便于验证打本体是否暴击

      （7）加了伤害保存功能，用户可保存每一段的AOE伤害进行合计，但在保存前，需要判断好暴击还是不暴击

      （8）增加了“储存清零”和“只清上一段伤害功能

      （9）增加了“战后固伤”的计算，战后固伤可以使用公式

      （10）增加了护盾机制，使用护盾功能前（无论是关闭还是开启），请清空所有保存的段数，再重新保存，否则计算会出错。

      （11）护盾默认要同步计算英雄对士兵的伤害，如果未填写守方士兵的数值，护盾计算会出错。

      （12）如果敌方未携带士兵又有护盾，无需使用护盾功能，将护盾看成是敌方英雄的血量即可。

      如有疑问加梦战计算器使用交流群 928411216
    </pre>

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
import MzPercentInput from "@/components/element-comp/mz-percent-input.vue";
import MzInput from "@/components/element-comp/mz-input.vue";
import {ElMessageBox} from "element-plus";



const gsTabCurrent = ref(0)
const gsTab = ref(['攻方', '守方'])
const gfTabCurrent = ref(0)

const sqDialog = ref(false)
const zykzDialog = ref(false)
const sbkjAoeDialog = ref(false)
const gfTab = computed(() => {
  if (gsTabCurrent.value == 0) {
    return ['英雄']
  } else {
    return ['士兵', '英雄']
  }
})
watch(() => gsTabCurrent.value, (val) => {
  if (val == 0) {
    gfTabCurrent.value = 0
  }
})
const defaultFormData = {
  yxsh_lx: AttackType.physics.value,
  gf_yxgj: "0",
  gf_yxzl: "0",
  gf_yxdsb_gzkzxs: "0",
  gf_yxdyx_gzkzxs: "0",
  gf_yx_wsfy: "0",
  gf_yxjnbl: "1",
  gf_yx_tyzs: "0",
  gf_yx_jnzs: "0",
  gf_yx_yczs: "0",
  gf_yx_qtzs: "0",
  gf_yx_bs: "0",
  sf_yxfy: "0",
  sf_yxmf: "0",
  sf_yxdyx_sfkzxs: "0",
  sf_yx_tyjs: "0",
  sf_yx_jnjs: "0",
  sf_yx_ycjs: "0",
  sf_yx_qtjs: "0",
  sf_yx_jbs: "0",
  sf_sbfy: "0",
  sf_sbmf: "0",
  sf_sbdyx_sfkzxs: "0",
  sf_sb_tyjs: "0",
  sf_sb_jnjs: "0",
  sf_sb_ycjs: "0",
  sf_sb_qtjs: "0",
  sf_sb_jbs: "0",
  hudun_value: "0",
  zh_gs: "0",
  yxdyx_sfbj: false,
  yxdb_sfbj: false,
  sf_dxxz: TerrainType.none.value
}
const formData = useRefCache("langrissar-calculator-aoejsq-el-formData", JSON.parse(JSON.stringify(defaultFormData)))
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
  const currentFormData = Object.keys(formData.value).reduce((res, key) => {
    if (notFilterList.includes(key)) {
      res[key] = formData.value[key]
    } else {
      res[key] = calculateFormula(formData.value[key]) || 0
    }
    return res
  }, {})
  const sf_dxxz = Object.values(TerrainType).find(i => i.value === currentFormData?.sf_dxxz)?.rate / 100 || 0
  const hudun_value = round(currentFormData.hudun_value || 0)
  const hudun_pd = Boolean(hudun_value > 0)
  const zhgs_pd = Boolean(currentFormData.zh_gs > 0)
  return {
    ...currentFormData,
    sf_dxxz,
    hudun_value,
    hudun_pd,
    zhgs_pd
  }
})

const calculateVariables = computed(() => {
  const allData = {
    ...inputVariables.value,
  }

  let yxdb_aoe_formula
  let yxdb_aoebj_formula
  let yxdyx_aoe_formula
  let yxdyx_aoebj_formula
  // 物理
  if (formData.value.yxsh_lx === AttackType.physics.value) {
    yxdb_aoe_formula = `(gf_yxgj*(1+gf_yxdsb_gzkzxs) - sf_sbfy*(1+sf_sbdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs-sf_sb_tyjs) * (1+gf_yx_jnzs-sf_sb_jnjs) * (1+gf_yx_yczs-sf_sb_ycjs) * (1+gf_yx_qtzs-sf_sb_qtjs) * 10`
    yxdb_aoebj_formula = `yxdb_aoe_sh * (1.3+gf_yx_bs-sf_sb_jbs)`
    yxdyx_aoe_formula = `(gf_yxgj*(1+gf_yxdyx_gzkzxs) - sf_yxfy*(1+sf_yxdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs- sf_yx_tyjs) * (1+gf_yx_jnzs-sf_yx_jnjs) * (1+gf_yx_yczs-sf_yx_ycjs) * (1+gf_yx_qtzs-sf_yx_qtjs) * 10`
    yxdyx_aoebj_formula = `yxdyx_aoe_sh * (1.3+gf_yx_bs-sf_yx_jbs)`
  }
  // 魔法
  else {
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
  if (allData.yxdyx_sfbj) {
    yxdyx_aoesj_sh = round(yxdyx_aoebj_sh, 2)
  } else {
    yxdyx_aoesj_sh = round(yxdyx_aoe_sh, 2)
  }

  if (allData.yxdb_sfbj) {
    yxdb_aoesj_sh = round(yxdb_aoebj_sh, 2)
  } else {
    yxdb_aoesj_sh = round(yxdb_aoe_sh, 2)
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

const saveList = useRefCache("langrissar-calculator-aoejsq-el-saveList", [])
const saveCurrentData = () => {
  let zsh_zz, hudun_cs_value, yxdyx_zz, yxdb_zz, hudun_yxdyx_cs_value, hudun_yxdb_cs_value, zh_gs_yxdyx
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
        yxdyx_zz = round(zsh_zz * (yxdyx / zsh));
        yxdb_zz = round(zsh_zz * (yxdb / zsh));
        hudun_yxdyx_cs_value = round(hudun_cs_value * (yxdyx / zsh));
        hudun_yxdb_cs_value = round(hudun_cs_value * (yxdb / zsh));
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
      hudun_yxdyx_cs_value = round(hudun_cs_value * (yxdyx / zsh));
      hudun_yxdb_cs_value = round(hudun_cs_value * (yxdb / zsh));
    }
  }


  saveList.value.push({
    formData: {
      ...formData.value,
    },
    data: {
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
const deleteSaveData = (index) => {
  // 二次确认
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    saveList.value.splice(index, 1)
  }).catch(() => {

  })
}
const calcTotal = computed(() => {
  const dataList = saveList.value.map(i => i.data)
  const totalRes = {
    // 保存总伤害
    zsh_zz: 0,
    // 保存护盾承伤值（总伤害）
    hudun_cs_value: 0,
    // 保存英雄打英雄伤害
    yxdyx_zz: 0,
    // 保存英雄打兵伤害
    yxdb_zz: 0,
    // 保存护盾承伤值（英雄打英雄）
    hudun_yxdyx_cs_value: 0,
    // 保存护盾承伤值（英雄打兵）
    hudun_yxdb_cs_value: 0
  }
  dataList.forEach((item) => {
    for (let key in item) {
      totalRes[key] = totalRes[key] + Number(item[key] || 0)
    }
  })
  return totalRes
})
// 当前护盾剩余值，减去已记录承伤
const hudun_sy_value_c = computed(() => {
  return Math.max(0, inputVariables.value.hudun_value - calcTotal.value.hudun_cs_value);
})
const zhgs = computed(() => {
  const saved_hudun_cs_value = calcTotal.value.hudun_cs_value
  const {zhgs_pd, zh_gs, hudun_value} = inputVariables.value
  let zh_gs_yxdyx = 0, zh_gs_yxdb = 0, zh_gs_zsh = 0, zh_gs_yxdyx_hudun_cs = 0, zh_gs_yxdb_hudun_cs = 0,
      zh_gs_zsh_hudun_cs = 0
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
const hudun_pd_total = computed(() => {
  const {hudun_value, zhgs_pd} = inputVariables.value
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

  .uni-card {
    padding-top: 16rpx !important;
  }
}

</style>
