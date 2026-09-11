<template>
  <view class="aoejsq calculator-page" style="padding:24px;">
    <el-button class="mb_16 calculator-reset-button" :icon="RefreshLeft" @click="resetFormData">重置数据</el-button>

    <el-form label-width="160px" class="base-el-form" label-position="left" :inline="true"
             :model="formData">
      <view class="mb_16" flex="box:mean" style="flex-wrap: wrap;">
        <el-card id="aoe-attacker" data-calculator-section="攻方设置" style="min-width: 400px;" class="mr_16 mb_16">
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
        <el-card id="aoe-defender" data-calculator-section="守方设置" style="min-width: 400px;" class="mr_16 mb_16">
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
            <el-form-item style="width:404px;" label="守方地形">
              <el-select v-model="formData.sf_dxxz" style="width: 120px;">
                <el-option v-for="item in TerrainTypeShowList" :key="item.value" :label="item.text"
                           :value="item.value"/>
                <el-option label="自定义" value="__custom__"/>
              </el-select>
              <mz-percent-input v-if="formData.sf_dxxz === '__custom__'" prop="sf_dxxz_custom" :form-data="formData" style="width: 120px; margin-left: 4px;"/>
            </el-form-item>
          </view>
        </el-card>
      </view>

      <calculator-reference v-model="sqDialog" kind="covenant"/>
      <calculator-reference v-model="zykzDialog" kind="counter"/>
      <calculator-reference v-model="sbkjAoeDialog" kind="aoe-soldier"/>

      <view class="mb_16 ddjsq-references">
        <el-button @click="sqDialog=true" type="primary">
          神契晨曦之祝特效参考
        </el-button>
        <el-button @click="zykzDialog=true" type="primary">
          职业克制系数参考
        </el-button>
        <el-button @click="sbkjAoeDialog=true" type="primary">
          AOE 士兵科技参考
        </el-button>
      </view>

      <el-card class="mb_16">
        <CalculatorInputNotice />
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

      <view class="mb_16 ddjsq-simulation-title" style="font-size: 24px;color:#dd524d;">
        以下即将进行AOE战斗模拟
      </view>

      <el-card id="aoe-battle" data-calculator-section="护盾、固伤与暴击" class="mb_16">
        <el-form-item label="守方护盾值">
          <mz-input prop="hudun_value" :form-data="formData"/>
        </el-form-item>
        <p class="calculator-field-help">使用护盾时，请同时填写守方英雄和士兵属性。调整护盾值后，需清空已保存段数并重新保存。</p>
        <p v-if="shieldChanged" class="calculator-context-warning" role="status">护盾值与已保存记录不同，请恢复原护盾值，或清空已保存段数后继续。</p>
        <el-form-item label="战后固伤值">
          <mz-input prop="zh_gs" :form-data="formData"/>
        </el-form-item>

        <view class="average-box">
          <el-checkbox v-model="formData.yxdyx_sfbj" label="英雄打英雄 是否暴击"></el-checkbox>
          <el-checkbox v-model="formData.yxdb_sfbj" label="英雄打兵 是否暴击"></el-checkbox>
        </view>

      </el-card>

      <el-card id="aoe-current" data-calculator-section="当前段伤害" data-calculator-result class="mb_16 aoe-result-card aoe-actual-result">
        <template #header>
          <div class="aoe-result-heading">
            <span class="aoe-result-icon" aria-hidden="true"><el-icon><Aim /></el-icon></span>
            <h2>实际 AOE 伤害</h2>
          </div>
        </template>
        <CalculatorInputNotice />
        <p class="aoe-segment-status" role="status">{{ currentSegmentSaved ? `已保存为第 ${saveList.length} 段，再次保存会新增一段。` : '当前段尚未计入合计。' }}</p>
        <div class="aoe-result-breakdown">
          <div class="aoe-result-metric">
            <span class="aoe-result-label">英雄打英雄伤害为：</span>
            <text class="value" :class="[formData.yxdyx_sfbj ? 'warning' : 'success']">
              {{ formatCalculatorNumber(calculateVariables.yxdyx_aoesj_sh) }}
            </text>
          </div>
          <div class="aoe-result-metric">
            <span class="aoe-result-label">英雄打兵伤害为：</span>
            <text class="value" :class="[formData.yxdb_sfbj ? 'warning' : 'primary']">
              {{ formatCalculatorNumber(calculateVariables.yxdb_aoesj_sh) }}
            </text>
          </div>
        </div>
        <div class="aoe-result-total">
          <span class="aoe-result-label">头上冒出的总伤害为（英雄+兵）：</span>
          <text class="error value">{{ formatCalculatorNumber(calculateVariables.aoe_zsh) }}</text>
        </div>
        <p v-if="shieldChanged" class="calculator-context-warning">护盾设置已变化，清空旧段数后才能继续保存。</p>
        <el-button class="mt_16 aoe-result-save" type="primary" :icon="Collection" :disabled="hasIssues || shieldChanged || saveBusy"
          @click="saveCurrentData">{{ currentSegmentSaved ? '再次保存一段' : '保存并计入合计' }}</el-button>
      </el-card>

      <el-card
          v-for="({ data }, index) in saveList"
          :key="index"
          class="mb_16 aoe-saved-segment"
      >
          <div class="aoe-saved-heading">
            <h3>第{{ index + 1 }}段伤害</h3>
            <span class="value">{{ formatCalculatorNumber(data.zsh_zz) }}</span>
            <el-button type="danger" plain size="small" :aria-label="`删除第${index + 1}段伤害`" @click="deleteSaveData(index)">
              删除
            </el-button>
          </div>
        <el-collapse class="aoe-segment-details">
          <el-collapse-item title="查看分项" :name="index">
        <view>
          <view>
            英雄打英雄：
            <text class="value success">{{ formatCalculatorNumber(data.yxdyx_zz) }}</text>
            <template v-if="data.hudun_yxdyx_cs_value > 0">
              护盾抵消：
              <text class="value warning">{{ formatCalculatorNumber(data.hudun_yxdyx_cs_value) }}</text>
            </template>
          </view>
          <view>
            英雄打兵：
            <text class="value primary">{{ formatCalculatorNumber(data.yxdb_zz) }}</text>
            <template v-if="data.hudun_yxdb_cs_value > 0">
              护盾抵消：
              <text class="value warning">{{ formatCalculatorNumber(data.hudun_yxdb_cs_value) }}</text>
            </template>
          </view>
          <view>
            总伤害：
            <text class="value error">{{ formatCalculatorNumber(data.zsh_zz) }}</text>
            <template v-if="data.hudun_cs_value > 0">
              护盾抵消：
              <text class="value warning">{{ formatCalculatorNumber(data.hudun_cs_value) }}</text>
            </template>
          </view>
        </view>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card v-if="inputVariables.zhgs_pd" class="mb_16">
        <template #header>
          战后固伤伤害
        </template>
        <view class="average-box">
          <view>
            英雄打英雄战后固伤：
            <text class="success value">{{ formatCalculatorNumber(zhgs.zh_gs_yxdyx) }}</text>
          </view>
          <view>
            英雄打英雄战后固伤(护盾抵消)：
            <text class="warning value">{{ formatCalculatorNumber(zhgs.zh_gs_yxdyx_hudun_cs) }}</text>
          </view>
        </view>
        <view class="average-box">
          <view>
            英雄打兵战后固伤：
            <text class="primary value">{{ formatCalculatorNumber(zhgs.zh_gs_yxdb) }}</text>
          </view>
          <view>
            英雄打兵战后固伤(护盾抵消)：
            <text class="warning value">{{ formatCalculatorNumber(zhgs.zh_gs_yxdb_hudun_cs) }}</text>
          </view>
        </view>
      </el-card>

      <el-card id="aoe-total" data-calculator-section="累计总伤害" data-calculator-result class="mb_16 aoe-result-card aoe-total-result">
        <template #header>
          <div class="aoe-total-heading">
          <div class="aoe-result-heading">
            <span class="aoe-result-icon" aria-hidden="true"><el-icon><DataAnalysis /></el-icon></span>
            <h2>总伤害</h2>
          </div>
          <el-button v-if="saveList.length" class="calculator-reset-button" @click="clearSavedSegments">清空已存段数</el-button>
          </div>
        </template>
        <CalculatorInputNotice />
        <p class="aoe-segment-status">{{ saveList.length ? `已累计 ${saveList.length} 段伤害` : '尚未保存伤害段数；保存当前段后计入合计。' }}{{ Number(zhgs.zh_gs_zsh) ? '，另含战后固伤。' : '' }}</p>
        <p v-if="shieldChanged" class="calculator-context-warning" role="status">护盾设置已变化，下面包含旧段记录，请清空后重新保存。</p>
        <div class="aoe-result-breakdown">
          <div class="aoe-result-metric">
            <span class="aoe-result-label">英雄打英雄：</span>
            <text class="value success">{{ round((Number(calcTotal.yxdyx_zz) + Number(zhgs.zh_gs_yxdyx)), 2) }}</text>
          </div>
          <div class="aoe-result-metric">
            <span class="aoe-result-label">英雄打兵：</span>
            <text class="value primary">{{ round((Number(calcTotal.yxdb_zz) + Number(zhgs.zh_gs_yxdb)), 2) }}</text>
          </div>
        </div>
        <div v-if="Number(zhgs.zh_gs_zsh)" class="aoe-result-details">
          <div v-if="Number(zhgs.zh_gs_zsh)" class="aoe-result-line">
            <span class="aoe-result-label">战后固伤：</span>
            <text class="value">{{ round(zhgs.zh_gs_zsh, 2) }}</text>
          </div>
        </div>
        <div class="aoe-result-total">
          <span class="aoe-result-label">打（英雄+兵）总伤害（不含护盾）：</span>
          <text class="error value">{{ round((calcTotal.zsh_zz + Number(zhgs.zh_gs_zsh)), 2) }}</text>
        </div>
        <div class="aoe-result-shield">
          <div class="aoe-result-line">
            <span class="aoe-result-label">护盾承伤：</span>
            <text class="warning value">{{ formatCalculatorNumber(calcTotal.hudun_cs_value) }}</text>
          </div>
          <div v-if="inputVariables.hudun_pd" class="aoe-result-line">
            <span class="aoe-result-label">护盾剩余值：</span>
            <text class="value">{{ formatCalculatorNumber(hudun_pd_total) }}</text>
          </div>
        </div>
      </el-card>



    </el-form>

    <calculator-guide id="aoe-guide" data-calculator-section="使用说明">
      <div class="ddjsq-guide-notes"><p>此计算器搬运了墨源的梦战伤害计算器，一切版权均属于墨源。手机版本可在微信小程序搜“梦战伤害计算器”。</p></div>
      <div class="ddjsq-guide-content">
        <ol>
          <li>里面每个输入框都是可以直接用英文符号直接用公式计算的，如1588/1.2*(1+0.2+0.3)*1.4非常方便数值调整。</li>
          <li>增减伤、克制系数、无视克制都是默认百分比形式，如增伤应输入“20+5+8”，如克制系数如果是魔力震荡打圣职应输入“50”</li>
          <li>克制修正输入的开关在攻方处，如果需要输入守方的双防克制系数加成，需要在攻方区域打开克制关系。如守方有冰女王的彻骨寒意，可在守方双防克制修正填-20</li>
          <li>物理和魔法伤害需要手动选择，物理伤害默认用攻击-防御，魔法伤害默认用智力-魔防，如像雾香这类物理转魔法，应将雾香的攻击填到智力处，不然不能正常生效。</li>
          <li>攻方暴击伤害已默认1.3，如果有额外暴伤只需要填入额外爆伤，如锋刺填10</li>
          <li>考虑了英雄对英雄、英雄对士兵的分别计算，便于验证打本体是否暴击</li>
          <li>加了伤害保存功能，用户可保存每一段的AOE伤害进行合计，但在保存前，需要判断好暴击还是不暴击</li>
          <li>可在总伤害处清空已保存段数，也可删除单段记录。</li>
          <li>增加了“战后固伤”的计算，战后固伤可以使用公式</li>
          <li>增加了护盾机制，使用护盾功能前（无论是关闭还是开启），请清空所有保存的段数，再重新保存，否则计算会出错。</li>
          <li>护盾默认要同步计算英雄对士兵的伤害，如果未填写守方士兵的数值，护盾计算会出错。</li>
          <li>如果敌方未携带士兵又有护盾，无需使用护盾功能，将护盾看成是敌方英雄的血量即可。</li>
        </ol>
      </div>
      <div class="ddjsq-guide-notes"><p>如有疑问加梦战计算器使用交流群 928411216</p></div>
    </calculator-guide>

  </view>
</template>

<script setup>
import {ref, watch, computed, watchEffect, onBeforeUnmount} from 'vue'
import {
  AttackType,
  TerrainType,
  TerrainTypeShowList,
  TrueFalseCheckBoxData,
} from "../common/constant";
import PercentInput from "../components/percent-input.vue";
import BaseTable from "../components/base-table.vue";
import BaseCheckBox from '../components/base-check-box.vue'
import BaseDivider from '../components/base-divider.vue'
import {evaluate} from "mathjs";
import {useRefCache} from "../common/hook";
import {calculateFormula, round} from "../common/utils";
import { formatCalculatorNumber } from '@/common/calculator-display.mjs'
import MzPercentInput from "@/components/element-comp/mz-percent-input.vue";
import MzInput from "@/components/element-comp/mz-input.vue";
import {ElMessageBox, ElMessage} from "element-plus";
import CalculatorReference from "@/components/calculator-reference.vue";
import CalculatorGuide from "@/components/calculator-guide.vue";
import { Aim, Collection, DataAnalysis, RefreshLeft } from '@element-plus/icons-vue';
import CalculatorInputNotice from '@/components/calculator-input-notice.vue'
import { useCalculatorInputState } from '@/common/calculator-input-state'
const { hasIssues } = useCalculatorInputState()



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
  sf_dxxz: TerrainType.none.value,
  sf_dxxz_custom: 0,
}
const formData = useRefCache("langrissar-calculator-aoejsq-el-formData", JSON.parse(JSON.stringify(defaultFormData)))
const resetFormData = async () => {
  try {
    await ElMessageBox.confirm(`将重置本页攻守方参数、护盾和固伤，并清空已保存的 ${saveList.value.length} 段伤害。是否继续？`, '重置 AOE 计算器', {
      confirmButtonText: '确认重置', cancelButtonText: '保留数据', type: 'warning',
    })
    formData.value = JSON.parse(JSON.stringify(defaultFormData))
    saveList.value = []
  } catch { /* Cancel keeps inputs and saved segments. */ }
}


const inputVariables = computed(() => {
  // 无需经过calculateFormula转换的数据
  const notFilterList = [
    'yxsh_lx',
    'sf_dxxz',
    'sf_dxxz_custom',
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
  const sf_dxxz = currentFormData?.sf_dxxz === '__custom__'
    ? (currentFormData?.sf_dxxz_custom ?? 0)
    : Object.values(TerrainType).find(i => i.value === currentFormData?.sf_dxxz)?.rate / 100 || 0
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
const saveBusy = ref(false)
let saveFeedbackTimer
onBeforeUnmount(() => clearTimeout(saveFeedbackTimer))
const currentSegmentSaved = computed(() => {
  const last = saveList.value.at(-1)
  return Boolean(last && JSON.stringify(last.formData) === JSON.stringify(formData.value))
})
const shieldChanged = computed(() => saveList.value.some(item =>
  Number(item.formData?.hudun_value || 0) !== Number(formData.value.hudun_value || 0)))
const clearSavedSegments = async () => {
  try {
    await ElMessageBox.confirm(`将清空 ${saveList.value.length} 段已保存伤害，保留当前攻守方与护盾设置。`, '清空已存段数', {
      confirmButtonText: '确认清空', cancelButtonText: '保留段数', type: 'warning',
    })
    saveList.value = []
    ElMessage.success('已清空保存段数，可重新保存当前段')
  } catch { /* Cancel leaves the saved segments intact. */ }
}
const saveCurrentData = () => {
  if (hasIssues.value || shieldChanged.value || saveBusy.value) return
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
  saveBusy.value = true
  clearTimeout(saveFeedbackTimer)
  saveFeedbackTimer = setTimeout(() => { saveBusy.value = false }, 650)
  ElMessage.success(`第 ${saveList.value.length} 段已计入合计`)
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
