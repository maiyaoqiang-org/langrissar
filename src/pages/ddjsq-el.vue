<template>
  <div class="ddjsq" style="padding:24px;">
    <el-button class="mb_16" type="primary" @click="resetFormData">重置数据</el-button>
    <el-form label-width="160px" class="base-el-form" label-position="left" :inline="true"
             :model="formData">
      <div class="mb_16" flex="box:mean" style="flex-wrap: wrap;">
        <el-card style="min-width: 400px;" class="mr_16 mb_16">
          <el-tabs model-value="攻方士兵">
            <el-tab-pane label="攻方士兵" name="攻方士兵">
              <div>
                <el-form-item label="士兵伤害类型">
                  <el-radio-group v-model="formData.sbsh_lx">
                    <el-radio v-for="(item,index) in AttackType" :key="index" :value="item.value">{{
                        item.text
                      }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="攻方士兵攻击" prop="gf_sbgj">
                  <mz-input prop="gf_sbgj" :form-data="formData"></mz-input>
                </el-form-item>
                <div flex>
                  <el-form-item>
                    <el-checkbox v-model="formData.sb_bdb_kzpd"
                                 @change="(val)=>(!val)&&(formData.gf_sbdsb_gzkzxs=formData.sf_sbdsb_sfkzxs=0)"
                                 label="兵与兵 有克制关系"/>
                  </el-form-item>
                  <el-form-item v-if="formData.sb_bdb_kzpd" label-width="200px" label="士兵对士兵攻智克制系数加成">
                    <mz-percent-input prop="gf_sbdsb_gzkzxs" :form-data="formData"></mz-percent-input>
                  </el-form-item>
                </div>
                <div flex>
                  <el-form-item>
                    <el-checkbox v-model="formData.sb_bdyx_kzpd"
                                 @change="(val)=>(!val)&&(formData.gf_sbdyx_gzkzxs=formData.sf_yxdsb_sfkzxs=0)"
                                 label="兵与英雄 有克制关系"/>
                  </el-form-item>
                  <el-form-item v-if="formData.sb_bdyx_kzpd" label-width="200px" label="士兵对英雄攻智克制系数加成">
                    <mz-percent-input prop="gf_sbdyx_gzkzxs" :form-data="formData"></mz-percent-input>
                  </el-form-item>
                </div>
                <el-form-item label="士兵无视双防系数">
                  <mz-percent-input prop="gf_sb_wsfy" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方士兵技能倍率">
                  <mz-input prop="gf_sbjnbl" :form-data="formData"></mz-input>
                </el-form-item>
                <el-form-item label="攻方士兵通用增伤">
                  <mz-percent-input prop="gf_sb_tyzs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方士兵技能增伤">
                  <mz-percent-input prop="gf_sb_jnzs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方士兵远程增伤">
                  <mz-percent-input prop="gf_sb_yczs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方士兵其他增伤">
                  <mz-percent-input prop="gf_sb_qtzs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方士兵暴伤加成">
                  <mz-percent-input prop="gf_sb_bs" :form-data="formData"></mz-percent-input>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="攻方英雄" name="攻方英雄">
              <div>
                <el-form-item label="英雄伤害类型">
                  <el-radio-group v-model="formData.yxsh_lx">
                    <el-radio v-for="(item,index) in AttackType" :key="index" :value="item.value">{{
                        item.text
                      }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="formData.yxsh_lx === AttackType.physics.value" label="攻方英雄攻击">
                  <mz-input prop="gf_yxgj" :form-data="formData"></mz-input>
                </el-form-item>
                <el-form-item v-if="formData.yxsh_lx === AttackType.magic.value" label="攻方英雄智力">
                  <mz-input prop="gf_yxzl" :form-data="formData"></mz-input>
                </el-form-item>
                <div flex>
                  <el-form-item>
                    <el-checkbox v-model="formData.yx_yxdb_kzpd"
                                 @change="(val)=>(!val)&&(formData.gf_yxdsb_gzkzxs=formData.sf_sbdyx_sfkzxs=0)"
                                 label="英雄与兵 有克制关系"/>
                  </el-form-item>
                  <el-form-item v-if="formData.yx_yxdb_kzpd" label-width="200px" label="英雄对士兵攻智克制系数加成">
                    <mz-percent-input prop="gf_yxdsb_gzkzxs" :form-data="formData"></mz-percent-input>
                  </el-form-item>
                </div>
                <div flex>
                  <el-form-item>
                    <el-checkbox v-model="formData.yx_yxdyx_kzpd"
                                 @change="(val)=>(!val)&&(formData.gf_yxdyx_gzkzxs=formData.sf_yxdyx_sfkzxs=0)"
                                 label="英雄与英雄 有克制关系"/>
                  </el-form-item>
                  <el-form-item v-if="formData.yx_yxdyx_kzpd" label-width="200px" label="英雄对英雄攻智克制系数加成">
                    <mz-percent-input prop="gf_yxdyx_gzkzxs" :form-data="formData"></mz-percent-input>
                  </el-form-item>
                </div>
                <el-form-item label="无视双防系数">
                  <mz-percent-input prop="gf_yx_wsfy" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方英雄技能倍率">
                  <mz-input prop="gf_yxjnbl" :form-data="formData"></mz-input>
                </el-form-item>
                <el-form-item label="攻方英雄通用增伤">
                  <mz-percent-input prop="gf_yx_tyzs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方英雄技能增伤">
                  <mz-percent-input prop="gf_yx_jnzs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方英雄远程增伤">
                  <mz-percent-input prop="gf_yx_yczs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方英雄其他增伤">
                  <mz-percent-input prop="gf_yx_qtzs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="攻方英雄暴伤加成">
                  <mz-percent-input prop="gf_yx_bs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <div flex>
                  <el-form-item style="width:240px;">
                    <el-checkbox v-model="formData.gf_yx_gjdspd" label="攻方英雄攻击段数是否为20段"/>
                  </el-form-item>
                  <el-form-item v-if="!formData.gf_yx_gjdspd" label="攻方英雄攻击段数">
                    <mz-input prop="gf_yx_gjds" :form-data="formData"/>
                  </el-form-item>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card style="min-width: 400px;" class="mb_16">
          <el-tabs model-value="守方士兵">
            <el-tab-pane label="守方士兵" name="守方士兵">
              <div>
                <el-form-item label="守方士兵防御">
                  <mz-input prop="sf_sbfy" :form-data="formData"></mz-input>
                </el-form-item>
                <el-form-item label="守方士兵魔防">
                  <mz-input prop="sf_sbmf" :form-data="formData"></mz-input>
                </el-form-item>
                <el-form-item
                    label-width="280px"
                    v-if="formData.sb_bdb_kzpd"
                    label="士兵与 攻方士兵 交战时双防克制系数加成">
                  <mz-percent-input prop="sf_sbdsb_sfkzxs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item
                    label-width="280px"
                    v-if="formData.yx_yxdb_kzpd"
                    label="士兵与 攻方英雄 交战时双防克制系数加成">
                  <mz-percent-input prop="sf_sbdyx_sfkzxs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <br>
                <el-form-item label="守方士兵物理通用减伤">
                  <mz-percent-input prop="sf_sb_wl_tyjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方士兵魔法通用减伤">
                  <mz-percent-input prop="sf_sb_mf_tyjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方士兵技能减伤">
                  <mz-percent-input prop="sf_sb_jnjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方士兵远程减伤">
                  <mz-percent-input prop="sf_sb_ycjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方士兵其他减伤">
                  <mz-percent-input prop="sf_sb_qtjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方士兵减暴伤">
                  <mz-percent-input prop="sf_sb_jbs" :form-data="formData"></mz-percent-input>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="守方英雄" name="守方英雄">
              <div>
                <el-form-item label="守方英雄防御">
                  <mz-input prop="sf_yxfy" :form-data="formData"></mz-input>
                </el-form-item>
                <el-form-item label="守方英雄魔防">
                  <mz-input prop="sf_yxmf" :form-data="formData"></mz-input>
                </el-form-item>
                <el-form-item
                    label-width="280px"
                    v-if="formData.sb_bdyx_kzpd" label="英雄与 攻方士兵 交战时双防克制系数加成">
                  <mz-percent-input prop="sf_yxdsb_sfkzxs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item
                    label-width="280px"
                    v-if="formData.yx_yxdyx_kzpd" label="英雄与 攻方英雄 交战时双防克制系数加成">
                  <mz-percent-input prop="sf_yxdyx_sfkzxs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方英雄物理通用减伤">
                  <mz-percent-input prop="sf_yx_wl_tyjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方英雄魔法通用减伤">
                  <mz-percent-input prop="sf_yx_mf_tyjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方英雄技能减伤">
                  <mz-percent-input prop="sf_yx_jnjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方英雄远程减伤">
                  <mz-percent-input prop="sf_yx_ycjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方英雄其他减伤">
                  <mz-percent-input prop="sf_yx_qtjs" :form-data="formData"></mz-percent-input>
                </el-form-item>
                <el-form-item label="守方英雄减暴伤">
                  <mz-percent-input prop="sf_yx_jbs" :form-data="formData"></mz-percent-input>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div>
            <el-form-item style="width:300px;" label="守方地形">
              <el-select v-model="formData.sf_dxxz">
                <el-option v-for="item in TerrainTypeShowList" :key="item.value" :label="item.text"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </div>
        </el-card>
      </div>

      <el-dialog width="80vw" v-model="sqDialog">
        <el-table :data="sq_table">
          <el-table-column v-for="item in sq_table_columns"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.label"
                           width="180"/>
        </el-table>
      </el-dialog>

      <el-dialog width="80vw" v-model="sbkjDialog">
        <el-table :data="sbkj_table">
          <el-table-column v-for="item in sbkj_table_columns" :key="item.prop" :prop="item.prop" :label="item.label"
                           width="180"/>
        </el-table>
      </el-dialog>

      <el-dialog width="80vw" v-model="zykzDialog">
        <el-table :data="zykz_table">
          <el-table-column
              v-for="item in zykz_table_columns"
              :fixed="item.fixed"
              :key="item.prop" :prop="item.prop" :label="item.label"
              :width="item.width||180"/>
        </el-table>
      </el-dialog>

      <div class="mb_16">
        <el-button @click="sqDialog=true" type="primary">
          （点击打开查看）神契晨曦之祝特效参考
        </el-button>
        <el-button @click="sbkjDialog=true" type="primary">
          （点击打开查看）士兵科技参考
        </el-button>
        <el-button @click="zykzDialog=true" type="primary">
          （点击打开查看）职业克制系数参考
        </el-button>
      </div>

      <el-card class="mb_16">
        <div class="average-box">
          <div>
            兵打兵单段伤害为：
            <text class="primary value">{{ round(bdb_dd_sh, 2) }}</text>
          </div>
          <div>
            兵打英雄单段伤害为：
            <text class="success value">{{ round(bdyx_dd_sh, 2) }}</text>
          </div>
        </div>
        <div class="average-box">
          <div>
            兵打兵暴击单段伤害为：
            <text class="warning value">{{ round(bdb_ddbj_sh, 2) }}</text>
          </div>
          <div>
            兵打英雄暴击单段伤害为：
            <text class="warning value">{{ round(bdyx_ddbj_sh, 2) }}</text>
          </div>
        </div>

        <el-divider></el-divider>
        <div class="average-box">
          <div>
            英雄打兵单段伤害为：
            <text class="primary value">{{ round(yxdb_dd_sh, 2) }}</text>
          </div>
          <div>
            英雄打英雄单段伤害为：
            <text class="success value">{{ round(yxdyx_dd_sh, 2) }}</text>
          </div>
        </div>
        <div class="average-box">
          <div>
            英雄打兵暴击单段伤害为：
            <text class="warning value">{{ round(yxdb_ddbj_sh, 2) }}</text>
          </div>
          <div>
            英雄打英雄暴击单段伤害为：
            <text class="warning value">{{ round(yxdyx_ddbj_sh, 2) }}</text>
          </div>
        </div>
      </el-card>

      <el-card class="mb_16">
        <el-form-item>
          <el-checkbox v-model="formData.bdb_sfbj" label="兵打兵 是否暴击"/>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formData.bdyx_sfbj" label="兵打英雄 是否暴击"/>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formData.yxdb_sfbj" label="英雄打兵 是否暴击"/>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formData.yxdyx_sfbj" label="英雄打英雄 是否暴击"/>
        </el-form-item>
      </el-card>
      <el-collapse class="mb_16" model-value="1">
        <el-collapse-item
            title="（点击打开查看）战斗攻防差与增减伤关系（注：已考虑克制系数、无视防御、地形修正）"
            name="1">
          <el-table :data="chakan_gfczjs_table">
            <el-table-column
                v-for="item in chakan_gfczjs_columns"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"/>
          </el-table>
        </el-collapse-item>
      </el-collapse>


      <div class="mb_16" style="font-size: 24px;color:#dd524d;">
        以下即将进行段数分配战斗模拟
      </div>

      <el-card class="mb_16">
        <el-form-item>
          <el-checkbox v-model="formData.sdsr_pd"
                       label="关联读取以上单段伤害计算结果 (想手动输入单段伤害 就取消勾选)"/>
        </el-form-item>
        <div v-if="!formData.sdsr_pd">
          <el-form-item label-width="160px" label="士兵打士兵的单段伤害">
            <mz-input prop="soldier_to_soldier_damage" :form-data="formData"></mz-input>
          </el-form-item>
          <el-form-item label-width="160px" label="士兵打英雄的单段伤害">
            <mz-input prop="soldier_to_hero_damage" :form-data="formData"></mz-input>
          </el-form-item>
          <br>
          <el-form-item label-width="160px" label="英雄打士兵的单段伤害">
            <mz-input prop="hero_to_soldier_damage" :form-data="formData"></mz-input>
          </el-form-item>
          <el-form-item label-width="160px" label="英雄打英雄的单段伤害">
            <mz-input prop="hero_to_hero_damage" :form-data="formData"></mz-input>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div>
          <div style="display: inline-block;">
            <el-form-item>
              <el-checkbox
                  v-model="formData.attacker_full_health"
                  label="攻方士兵是否满血"/>
            </el-form-item>
            <el-form-item>
              <el-checkbox
                  v-model="formData.gf_sffmxh_pd"
                  label="「薪火」附魔"/>
            </el-form-item>
          </div>
          <br>

          <el-form-item
              label="攻方士兵当前数量">
            <mz-input :disabled="formData.attacker_full_health" prop="attacker_soldier_count"
                      :form-data="formData"></mz-input>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <el-form-item
            label-width="200px"
            label="每只守方士兵的最大血量">
          <mz-input prop="defender_soldier_max_hp_per_unit" :form-data="formData"></mz-input>
        </el-form-item>
        <div>
          <div style="display: inline-block;">
            <el-form-item>
              <el-checkbox
                  v-model="formData.defender_full_health"
                  label="守方士兵是否满血"/>
            </el-form-item>
            <el-form-item>
              <el-checkbox
                  v-model="formData.sf_sffmxh_pd"
                  label="「薪火」附魔"/>
            </el-form-item>
          </div>
          <br>
          <el-form-item label="守方士兵当前总血量">
            <mz-input :disabled="formData.defender_full_health" prop="defender_soldier_hp"
                      :form-data="formData"></mz-input>
          </el-form-item>
          <br>
          <el-form-item label="守方士兵当前数量">
            <mz-input :disabled="true" prop="defender_soldier_count"
                      :form-data="formData"></mz-input>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <el-form-item label="守方英雄当前血量">
          <mz-input prop="defender_hero_hp" :form-data="formData"></mz-input>
        </el-form-item>
        <br>
        <el-form-item label="护盾值">
          <mz-input prop="hudun_hp" :form-data="formData"></mz-input>
        </el-form-item>
        <el-divider></el-divider>
        <div>
          <el-form-item style="width:260px;">
            <el-checkbox
                @change="(val)=>!val&&(formData.attacker_soldier_dsds='0')"
                v-model="formData.sb_dsdspd"
                label="士兵是否有真正的段数丢失（有就勾选）"/>
          </el-form-item>
          <el-form-item
              v-if="formData.sb_dsdspd"
              label="士兵丢失段数"
          >
            <el-input-number
                v-model="formData.attacker_soldier_dsds"
                :min="0"
                :max="calculateVariables._attacker_soldier_max_segments"/>
          </el-form-item>
        </div>
        <!--        <div>
                  士兵出手的段数最大参考值：{{ calculateVariables.attacker_soldier_max_segments }}
                </div>-->
        <el-form-item label-width="500px" label="请选择士兵优先英雄出手的段数（根据英雄出手速度判断）"></el-form-item>
        <br>
        <el-form-item style="width:500px;">
          <el-slider
              show-input
              @change="(value)=>formData.soldier_to_soldier_priority_segments=value"
              v-model="formData.soldier_to_soldier_priority_segments"
              :min="0"
              :max="calculateVariables.attacker_soldier_max_segments||0"/>
        </el-form-item>

        <div>
          <el-form-item style="width:260px;">
            <el-checkbox
                v-model="formData.dhds_pd"
                label="默认无动画影响的段数丢失，如有请勾选填写动画丢失段数"/>
          </el-form-item>
          <div v-if="formData.dhds_pd">
            <el-form-item
                label-width="200px"
                label="士兵打士兵的动画丢失段数">
              <el-input-number v-model="formData.bdb_dhds" :min="0"/>
            </el-form-item>
            <el-form-item
                label-width="200px"
                label="士兵打英雄的动画丢失段数">
              <el-input-number v-model="formData.bdyx_dhds" :min="0"/>
            </el-form-item>
            <br>
            <el-form-item
                label-width="200px"
                label="英雄打士兵的动画丢失段数">
              <el-input-number v-model="formData.yxdb_dhds" :min="0"/>
            </el-form-item>
            <el-form-item
                label-width="200px"
                label="英雄打英雄的动画丢失段数">
              <el-input-number v-model="formData.yxdb_dhds" :min="0"/>
            </el-form-item>
          </div>
        </div>
      </el-card>


      <el-card>
        <div
            v-for="(item,index) in Object.values(calculateResult)"
            :key="index"
            class="average-box" style="flex-wrap: wrap;">
          <div style="width:50%;flex:1 1 50%;" v-for="(o,v) in item" :key="v">
            <template v-if="o.label">
              {{ o.label }}:
              <text :class="[o.valueClass,'value']">{{ o.value }}</text>
            </template>
          </div>
          <el-divider v-if="index!==(Object.values(calculateResult).length-1)" style="flex:unset;"></el-divider>
        </div>
      </el-card>

    </el-form>


    <el-divider></el-divider>
    <pre style="user-select: text;">
      使用说明：此计算器搬运了墨源的梦战伤害计算器，一切版权均属于墨源。搬运来源：https://moyuanmzddjsq.streamlit.app/

      本计算器分为单段伤害计算区和段数分配模拟区。

      一、单段伤害计算区，可以实际模拟出兵打兵、兵打人、人打兵、兵打人四个维度的单段伤害。

      （1）里面每个输入框都是可以直接用英文符号直接用公式计算的，如1588/1.2*(1+0.2+0.3)*1.4非常方便数值调整。

      （2）设置了物理、魔法通用增减伤害和克制的的区分，可以模拟混伤克制情况。

      （3）克制修正输入的开关在攻方处，如果需要输入守方的双防克制系数加成，需要在攻方区域打开克制关系。如守方有冰女王的彻骨寒意，可在守方双防克制修正填-20

      （4) 攻方暴击伤害已默认1.3，如果有额外暴伤只需要填入额外爆伤 如锋刺填10

      二、段数分配模拟区

      （1）默认关联上面的单点伤害计算的段数，也可以手动输入单段伤害。

      （2）攻方士兵需要输入数量，默认满血是10只，也可以手动输入为12只。如果想模拟雷马，可将攻方士兵数量填0，在之前的英雄出手段数填40段。

      （3）守方士兵需要输入单只兵的血量（注意是单只兵），然后输入一个士兵当前总血量，会自动计算出有多少只兵。默认满血是10只

      （4）加入了护盾机制，可以填入护盾值，如果要模拟直击本体，可将守方士兵当前血量填0即没有小兵，护盾就会自动加在英雄本体上。

      （5）最关键的是，需要根据出手速度来调整士兵先于英雄出手多少段，如伊莉娅姐姐用3C，可以设置为士兵先于英雄出手10段。计算器会自动根据伤害分分配段数，可以对比总伤害来调整段数分配更接近实际。

      （6）如果士兵有伤害丢失，可以填入士兵丢失的段数（如战损丢失）。

      （7）加入动画丢失段数的填写，在伪直击或打护盾单位（经常会有一只兵不打）时，可以利用此功能调整总伤害。

      三、其他

      （1）录入了神契特效、士兵科技、职业克制系数的查询，可以更加方便查询。

      （2）做了一个战斗攻防差与增减伤关系的统计，已考虑了克制系数、无视防御、地形修正。以便更快捷的知道多少攻防差，多少增伤能打什么样的伤害，方便积累经验。

      四、缺陷

      近战肉搏类无法完美模拟，因为目前设置的是士兵出手一部分段数，英雄出手全部段数，士兵再出手剩余段数，这样分三个阶段模拟的，但实际战斗中会有战损，或撞击判定等特殊情况。 计算器用于模拟的意义更大，便于在配置上，少走更多弯路。并且也能分析一些此前模糊的机制，如虽然姐姐和大白毛都有可能暴击一段一个兵，出手速度也相同，但由于大白毛是近战，姐姐是远程，导致士兵优先英雄出手的段数分配差异非常大。

      希望能对大家数据分析有一点帮助，如有疑问加梦战计算器使用交流群 928411216


    </pre>
  </div>
</template>

<script setup>
import {ref, watch, computed, watchEffect} from 'vue'
import {
  AttackType,
  TerrainType,
  TerrainTypeShowList,
  TrueFalseCheckBoxData,
  sq_table, sq_table_columns,
  sbkj_table, sbkj_table_columns,
  zykz_table, zykz_table_columns,
  chakan_gfczjs_columns,
} from "../common/constant";
import PercentInput from "../components/percent-input.vue";
import BaseTable from "../components/base-table.vue";
import BaseCheckBox from '../components/base-check-box.vue'
import BaseDivider from '../components/base-divider.vue'
import {evaluate} from "mathjs";
import {useRefCache} from "../common/hook";
import {calculateFormula, round} from "../common/utils";
import Big from "big.js";
import MzPercentInput from "@/components/element-comp/mz-percent-input.vue";
import MzInput from "@/components/element-comp/mz-input.vue";

const defaultFormData = {
  sbsh_lx: AttackType.physics.value,
  yxsh_lx: AttackType.physics.value,
  gf_sbjnbl: "1",
  gf_yxjnbl: "1",
  sdsr_pd: true,
  attacker_full_health: true,
  attacker_soldier_count: "10",
  defender_soldier_max_hp_per_unit: "1",
  defender_full_health: true,
  defender_soldier_count: "10",
  defender_hero_hp: "1",
  hudun_hp: "0",
  sb_dsdspd: false,
  attacker_soldier_dsds: 0,
  soldier_to_soldier_priority_segments: 20,
  dhds_pd: false,
  gf_yx_gjdspd: true,
  bdb_sfbj: false,
  bdyx_sfbj: false,
  yxdb_sfbj: false,
  yxdyx_sfbj: false,
  gf_sffmxh_pd: false,
  sf_sffmxh_pd: false,
}
const formData = useRefCache("langrissar-calculator-ddjsq-el-formData", JSON.parse(JSON.stringify(defaultFormData)))
const resetFormData = () => {
  formData.value = JSON.parse(JSON.stringify(defaultFormData))
}

const inputVariables = computed(() => {
  const sf_dxxz = Object.values(TerrainType).find(i => i.value === formData.value?.sf_dxxz)?.rate / 100 || 0
  return {
    ...formData.value,
    sf_dxxz,
  }
})


// #定义兵打兵单段伤害 bdb_dd_sh
// #定义兵打兵单段暴击伤害 bdb_ddbj_sh
// #定义兵打英雄单段伤害 bdyx_dd_sh
// #定义兵打英雄单段暴击伤害 bdyx_ddbj_sh
const bdb_dd_sh = computed(() => {
  let formula
  switch (formData.value.sbsh_lx) {
    case AttackType.magic.value:
      formula = "(gf_sbgj*(1+gf_sbdsb_gzkzxs) - sf_sbmf*(1+sf_sbdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)) * gf_sbjnbl * (1+gf_sb_tyzs-sf_sb_mf_tyjs) * (1+gf_sb_jnzs-sf_sb_jnjs) * (1+gf_sb_yczs-sf_sb_ycjs) * (1+gf_sb_qtzs-sf_sb_qtjs) * 0.5"
      break;
    case AttackType.physics.value:
    default:
      formula = "(gf_sbgj*(1+gf_sbdsb_gzkzxs) - sf_sbfy*(1+sf_sbdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)) * gf_sbjnbl * (1+gf_sb_tyzs-sf_sb_wl_tyjs) * (1+gf_sb_jnzs-sf_sb_jnjs) * (1+gf_sb_yczs-sf_sb_ycjs) * (1+gf_sb_qtzs-sf_sb_qtjs) * 0.5"
      break;
  }
  return calculateFormula(formula, inputVariables.value)
});
const bdb_ddbj_sh = computed(() => {
  let formula = "bdb_dd_sh * (1.3+gf_sb_bs-sf_sb_jbs)"
  return calculateFormula(formula, {
    ...inputVariables.value,
    bdb_dd_sh: bdb_dd_sh.value,
  })
});
const bdyx_dd_sh = computed(() => {
  let formula
  switch (formData.value.sbsh_lx) {
    case AttackType.magic.value:
      formula = "(gf_sbgj*(1+gf_sbdyx_gzkzxs) - sf_yxmf*(1+sf_yxdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)) * gf_sbjnbl * (1+gf_sb_tyzs- sf_yx_mf_tyjs) * (1+gf_sb_jnzs-sf_yx_jnjs) * (1+gf_sb_yczs-sf_yx_ycjs) * (1+gf_sb_qtzs-sf_yx_qtjs) * 0.5"
      break;
    case AttackType.physics.value:
    default:
      formula = "(gf_sbgj*(1+gf_sbdyx_gzkzxs) - sf_yxfy*(1+sf_yxdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)) * gf_sbjnbl * (1+gf_sb_tyzs- sf_yx_wl_tyjs) * (1+gf_sb_jnzs-sf_yx_jnjs) * (1+gf_sb_yczs-sf_yx_ycjs) * (1+gf_sb_qtzs-sf_yx_qtjs) * 0.5"
      break;
  }
  return calculateFormula(formula, inputVariables.value)
});
const bdyx_ddbj_sh = computed(() => {
  let formula = "bdyx_dd_sh * (1.3+gf_sb_bs-sf_yx_jbs)"
  return calculateFormula(formula, {
    ...inputVariables.value,
    bdyx_dd_sh: bdyx_dd_sh.value
  })
});

// #定义英雄打兵单段伤害 yxdb_dd_sh
// #定义英雄打兵单段暴击伤害 yxdb_ddbj_sh
// #定义英雄打英雄单段伤害 yxdyx_dd_sh
// #定义英雄打英雄单段暴击伤害 yxdyx_ddbj_sh
const yxdb_dd_sh = computed(() => {
  let formula
  switch (formData.value.yxsh_lx) {
    case AttackType.magic.value:
      formula = "(gf_yxzl*(1+gf_yxdsb_gzkzxs) - sf_sbmf*(1+sf_sbdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs-sf_sb_mf_tyjs) * (1+gf_yx_jnzs-sf_sb_jnjs) * (1+gf_yx_yczs-sf_sb_ycjs) * (1+gf_yx_qtzs-sf_sb_qtjs) * 0.5"
      break;
    case AttackType.physics.value:
    default:
      formula = "(gf_yxgj*(1+gf_yxdsb_gzkzxs) - sf_sbfy*(1+sf_sbdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs-sf_sb_wl_tyjs) * (1+gf_yx_jnzs-sf_sb_jnjs) * (1+gf_yx_yczs-sf_sb_ycjs) * (1+gf_yx_qtzs-sf_sb_qtjs) * 0.5"
      break;
  }
  return calculateFormula(formula, inputVariables.value)
});
const yxdb_ddbj_sh = computed(() => {
  let formula = "yxdb_dd_sh * (1.3+gf_yx_bs-sf_sb_jbs)"
  return calculateFormula(formula, {
    ...inputVariables.value,
    yxdb_dd_sh: yxdb_dd_sh.value,
  })
});
const yxdyx_dd_sh = computed(() => {
  let formula
  switch (formData.value.sbsh_lx) {
    case AttackType.magic.value:
      formula = "(gf_yxzl*(1+gf_yxdyx_gzkzxs) - sf_yxmf*(1+sf_yxdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs- sf_yx_mf_tyjs) * (1+gf_yx_jnzs-sf_yx_jnjs) * (1+gf_yx_yczs-sf_yx_ycjs) * (1+gf_yx_qtzs-sf_yx_qtjs) * 0.5"
      break;
    case AttackType.physics.value:
    default:
      formula = "(gf_yxgj*(1+gf_yxdyx_gzkzxs) - sf_yxfy*(1+sf_yxdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)) * gf_yxjnbl * (1+gf_yx_tyzs- sf_yx_wl_tyjs) * (1+gf_yx_jnzs-sf_yx_jnjs) * (1+gf_yx_yczs-sf_yx_ycjs) * (1+gf_yx_qtzs-sf_yx_qtjs) * 0.5"
      break;
  }
  return calculateFormula(formula, inputVariables.value)
});
const yxdyx_ddbj_sh = computed(() => {
  let formula = "yxdyx_dd_sh * (1.3+gf_yx_bs-sf_yx_jbs)"
  return calculateFormula(formula, {
    ...inputVariables.value,
    yxdyx_dd_sh: yxdyx_dd_sh.value
  })
});

const calculateVariables = computed(() => {
  const sj_bdb_sh = round(Math.max(1, formData.value?.bdb_sfbj ? bdb_ddbj_sh.value : bdb_dd_sh.value))
  const sj_bdyx_sh = round(Math.max(1, formData.value?.bdyx_sfbj ? bdyx_ddbj_sh.value : bdyx_dd_sh.value))
  const sj_yxdb_sh = round(Math.max(1, formData.value?.yxdb_sfbj ? yxdb_ddbj_sh.value : yxdb_dd_sh.value))
  const sj_yxdyx_sh = round(Math.max(1, formData.value?.yxdyx_sfbj ? yxdyx_ddbj_sh.value : yxdyx_dd_sh.value))
  // # 士兵出手的最大段数（按攻方士兵数量和每只士兵的2段攻击计算）
  const _attacker_soldier_max_segments = formData.value?.attacker_soldier_count * 2
  const attacker_soldier_max_segments = _attacker_soldier_max_segments - formData.value.attacker_soldier_dsds

  const soldier_to_soldier_damage = round(Math.max(formData.value?.soldier_to_soldier_damage, 1), 0, Big.roundUp)
  const soldier_to_hero_damage = round(Math.max(formData.value?.soldier_to_hero_damage, 1), 0, Big.roundUp)
  const hero_to_soldier_damage = round(Math.max(formData.value?.hero_to_soldier_damage, 1), 0, Big.roundUp)
  const hero_to_hero_damage = round(Math.max(formData.value?.hero_to_hero_damage, 1), 0, Big.roundUp)

  const allData = {
    ...inputVariables.value,
    bdb_dd_sh: bdb_dd_sh.value,
    bdb_ddbj_sh: bdb_ddbj_sh.value,
    bdyx_dd_sh: bdyx_dd_sh.value,
    bdyx_ddbj_sh: bdyx_ddbj_sh.value,

    yxdb_dd_sh: yxdb_dd_sh.value,
    yxdb_ddbj_sh: yxdb_ddbj_sh.value,
    yxdyx_dd_sh: yxdyx_dd_sh.value,
    yxdyx_ddbj_sh: yxdyx_ddbj_sh.value,

    sj_bdb_sh,
    sj_bdyx_sh,
    sj_yxdb_sh,
    sj_yxdyx_sh,
    _attacker_soldier_max_segments,
    attacker_soldier_max_segments,
    soldier_to_soldier_damage,
    soldier_to_hero_damage,
    hero_to_soldier_damage,
    hero_to_hero_damage
  }

  let bdb_gfc, bdb_tyzj, bdb_jnzj, bdb_yczj, bdb_qtzj, bdb_jnbl, bdb_bsbv, bdyx_gfc, bdyx_tyzj, bdyx_jnzj, bdyx_yczj,
      bdyx_qtzj, bdyx_jnbl, bdyx_bsbv
  // #定义兵打兵 攻防差bdb_gfc 通用增减%bdb_tyzj 技能增减%bdb_jnzj 远程增减%bdb_yczj 其他增减%bdb_qtzj 技能倍率bdb_jnbl 爆伤倍率 bdb_bsbv
  // #定义兵打英雄 攻防差bdyx_gfc 通用增减%bdyx_tyzj 技能增减%bdyx_jnzj 远程增减%bdyx_yczj 其他增减%bdyx_qtzj 技能倍率bdyx_jnbl 爆伤倍率 bdyx_bsbv
  if (formData.value.sbsh_lx === AttackType.physics.value) {
    bdb_gfc = calculateFormula("gf_sbgj*(1+gf_sbdsb_gzkzxs) - sf_sbfy*(1+sf_sbdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)", allData)
    bdb_tyzj = calculateFormula("(gf_sb_tyzs - sf_sb_wl_tyjs)*100", allData)
    bdb_jnzj = calculateFormula("(gf_sb_jnzs - sf_sb_jnjs)*100", allData)
    bdb_yczj = calculateFormula("(gf_sb_yczs - sf_sb_ycjs)*100", allData)
    bdb_qtzj = calculateFormula("(gf_sb_qtzs - sf_sb_qtjs)*100", allData)
    bdb_jnbl = calculateFormula("gf_sbjnbl", allData)
    bdb_bsbv = calculateFormula("1.3+gf_sb_bs-sf_sb_jbs", allData)
    bdyx_gfc = calculateFormula("gf_sbgj*(1+gf_sbdyx_gzkzxs) - sf_yxfy*(1+sf_yxdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)", allData)
    bdyx_tyzj = calculateFormula("(gf_sb_tyzs- sf_yx_wl_tyjs)*100", allData)
    bdyx_jnzj = calculateFormula("(gf_sb_jnzs-sf_yx_jnjs)*100", allData)
    bdyx_yczj = calculateFormula("(gf_sb_yczs-sf_yx_ycjs)*100", allData)
    bdyx_qtzj = calculateFormula("(gf_sb_qtzs-sf_yx_qtjs)*100", allData)
    bdyx_jnbl = calculateFormula("gf_sbjnbl", allData)
    bdyx_bsbv = calculateFormula("1.3+gf_sb_bs-sf_yx_jbs", allData)
  } else {
    bdb_gfc = calculateFormula("gf_sbgj*(1+gf_sbdsb_gzkzxs) - sf_sbfy*(1+sf_sbdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)", allData)
    bdb_tyzj = calculateFormula("(gf_sb_tyzs - sf_sb_wl_tyjs)*100", allData)
    bdb_jnzj = calculateFormula("(gf_sb_jnzs - sf_sb_jnjs)*100", allData)
    bdb_yczj = calculateFormula("(gf_sb_yczs - sf_sb_ycjs)*100", allData)
    bdb_qtzj = calculateFormula("(gf_sb_qtzs - sf_sb_qtjs)*100", allData)
    bdb_jnbl = calculateFormula("gf_sbjnbl", allData)
    bdb_bsbv = calculateFormula("1.3+gf_sb_bs-sf_sb_jbs", allData)
    bdyx_gfc = calculateFormula("gf_sbgj*(1+gf_sbdyx_gzkzxs) - sf_yxfy*(1+sf_yxdsb_sfkzxs+sf_dxxz)*(1-gf_sb_wsfy)", allData)
    bdyx_tyzj = calculateFormula("(gf_sb_tyzs- sf_yx_wl_tyjs)*100", allData)
    bdyx_jnzj = calculateFormula("(gf_sb_jnzs-sf_yx_jnjs)*100", allData)
    bdyx_yczj = calculateFormula("(gf_sb_yczs-sf_yx_ycjs)*100", allData)
    bdyx_qtzj = calculateFormula("(gf_sb_qtzs-sf_yx_qtjs)*100", allData)
  }

  // #定义英雄打兵 攻防差yxdb_gfc 通用增减%yxdb_tyzj 技能增减%yxdb_jnzj 远程增减%yxdb_yczj 其他增减%yxdb_qtzj 技能倍率yxdb_jnbl 暴伤倍率yxdb_bsbv
  // #定义英雄打英雄 攻防差yxdyx_gfc 通用增减%yxdyx_tyzj 技能增减%yxdyx_jnzj 远程增减%yxdyx_yczj 其他增减%yxdyx_qtzj 技能倍率yxdyx_jnbl 爆伤倍率yxdyx_bsbv
  let yxdb_gfc, yxdb_tyzj, yxdb_jnzj, yxdb_yczj, yxdb_qtzj, yxdb_jnbl, yxdb_bsbv, yxdyx_gfc, yxdyx_tyzj, yxdyx_jnzj,
      yxdyx_yczj, yxdyx_qtzj, yxdyx_jnbl, yxdyx_bsbv
  if (formData.value.yxsh_lx === AttackType.physics.value) {
    yxdb_gfc = calculateFormula("gf_yxgj*(1+gf_yxdsb_gzkzxs) - sf_sbfy*(1+sf_sbdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)", allData)
    yxdb_tyzj = calculateFormula("(gf_yx_tyzs-sf_sb_wl_tyjs)*100", allData)
    yxdb_jnzj = calculateFormula("(gf_yx_jnzs-sf_sb_jnjs)*100", allData)
    yxdb_yczj = calculateFormula("(gf_yx_yczs-sf_sb_ycjs)*100", allData)
    yxdb_qtzj = calculateFormula("(gf_yx_qtzs-sf_sb_qtjs)*100", allData)
    yxdb_jnbl = calculateFormula("gf_yxjnbl", allData)
    yxdb_bsbv = calculateFormula("1.3+gf_yx_bs-sf_sb_jbs", allData)
    yxdyx_gfc = calculateFormula("gf_yxgj*(1+gf_yxdyx_gzkzxs) - sf_yxfy*(1+sf_yxdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)", allData)
    yxdyx_tyzj = calculateFormula("(gf_yx_tyzs- sf_yx_wl_tyjs)*100", allData)
    yxdyx_jnzj = calculateFormula("(gf_yx_jnzs-sf_yx_jnjs)*100", allData)
    yxdyx_yczj = calculateFormula("(gf_yx_yczs-sf_yx_ycjs)*100", allData)
    yxdyx_qtzj = calculateFormula("(gf_yx_qtzs-sf_yx_qtjs)*100", allData)
    yxdyx_jnbl = calculateFormula("gf_yxjnbl", allData)
    yxdyx_bsbv = calculateFormula("1.3+gf_yx_bs-sf_yx_jbs", allData)
  } else {
    yxdb_gfc = calculateFormula("gf_yxgj*(1+gf_yxdsb_gzkzxs) - sf_sbfy*(1+sf_sbdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)", allData)
    yxdb_tyzj = calculateFormula("(gf_yx_tyzs-sf_sb_wl_tyjs)*100", allData)
    yxdb_jnzj = calculateFormula("(gf_yx_jnzs-sf_sb_jnjs)*100", allData)
    yxdb_yczj = calculateFormula("(gf_yx_yczs-sf_sb_ycjs)*100", allData)
    yxdb_qtzj = calculateFormula("(gf_yx_qtzs-sf_sb_qtjs)*100", allData)
    yxdb_jnbl = calculateFormula("gf_yxjnbl", allData)
    yxdb_bsbv = calculateFormula("1.3+gf_yx_bs-sf_sb_jbs", allData)
    yxdyx_gfc = calculateFormula("gf_yxgj*(1+gf_yxdyx_gzkzxs) - sf_yxfy*(1+sf_yxdyx_sfkzxs+sf_dxxz)*(1-gf_yx_wsfy)", allData)
    yxdyx_tyzj = calculateFormula("(gf_yx_tyzs- sf_yx_wl_tyjs)*100", allData)
    yxdyx_jnzj = calculateFormula("(gf_yx_jnzs-sf_yx_jnjs)*100", allData)
    yxdyx_yczj = calculateFormula("(gf_yx_yczs-sf_yx_ycjs)*100", allData)
    yxdyx_qtzj = calculateFormula("(gf_yx_qtzs-sf_yx_qtjs)*100", allData)
    yxdyx_jnbl = calculateFormula("gf_yxjnbl", allData)
    yxdyx_bsbv = calculateFormula("1.3+gf_yx_bs-sf_yx_jbs", allData)
  }

  return {
    ...allData,
    bdb_gfc,
    bdb_tyzj,
    bdb_jnzj,
    bdb_yczj,
    bdb_qtzj,
    bdb_jnbl,
    bdb_bsbv,
    bdyx_gfc,
    bdyx_tyzj,
    bdyx_jnzj,
    bdyx_yczj,
    bdyx_qtzj,
    bdyx_jnbl,
    bdyx_bsbv,
    yxdb_gfc,
    yxdb_tyzj,
    yxdb_jnzj,
    yxdb_yczj,
    yxdb_qtzj,
    yxdb_jnbl,
    yxdb_bsbv,
    yxdyx_gfc,
    yxdyx_tyzj,
    yxdyx_jnzj,
    yxdyx_yczj,
    yxdyx_qtzj,
    yxdyx_jnbl,
    yxdyx_bsbv
  }
})

watchEffect(() => {
  if (formData.value.gf_yx_gjdspd) {
    formData.value.gf_yx_gjds = 20
  }
})

watchEffect(() => {
  if (formData.value.sdsr_pd) {
    formData.value.soldier_to_soldier_damage = calculateVariables.value.sj_bdb_sh
    formData.value.soldier_to_hero_damage = calculateVariables.value.sj_bdyx_sh
    formData.value.hero_to_soldier_damage = calculateVariables.value.sj_yxdb_sh
    formData.value.hero_to_hero_damage = calculateVariables.value.sj_yxdyx_sh
  }
})
watchEffect(() => {
  // 是否满血
  const isHealth = formData.value?.defender_full_health
  // 每只士兵满血生命
  const defender_soldier_max_hp_per_unit = round(calculateFormula(formData.value.defender_soldier_max_hp_per_unit))
  // 满血
  if (isHealth) {
    const defender_soldier_count = formData.value.sf_sffmxh_pd?"12":"10"
    formData.value.defender_soldier_count = defender_soldier_count
    formData.value.defender_soldier_hp = defender_soldier_count * defender_soldier_max_hp_per_unit
  } else {
    const defender_soldier_hp = calculateFormula(formData.value.defender_soldier_hp + "")
    if (defender_soldier_hp && defender_soldier_max_hp_per_unit) {
      formData.value.defender_soldier_count = Math.ceil(defender_soldier_hp / defender_soldier_max_hp_per_unit)
    } else {
      formData.value.defender_soldier_count = "0"
    }
  }
})
watch(() => [calculateVariables.value?.attacker_soldier_count, calculateVariables.value.attacker_soldier_max_segments], ([count, max], [oldCount, oldMax]) => {
  if (count == "0") {
    formData.value.soldier_to_soldier_priority_segments = 0
  } else {
    if (max != oldMax) {
      formData.value.soldier_to_soldier_priority_segments = Number(max)
    }
  }
})
watch(() => formData.value.dhds_pd, (val) => {
  if (!val) {
    formData.value.bdb_dhds = 0
    formData.value.bdyx_dhds = 0
    formData.value.yxdb_dhds = 0
    formData.value.yxdyx_dhds = 0
  }
})

const calculateResult = computed(() => {

// 初始化剩余士兵段数、英雄出手段数
  let {
    attacker_soldier_max_segments = 0,
    soldier_to_soldier_priority_segments = 0,
    gf_yx_gjds = 0,
    defender_soldier_hp = 0,
    defender_hero_hp = 0,
    hudun_hp = 0,
    defender_soldier_max_hp_per_unit = 1,
    soldier_to_soldier_damage = 0,
    soldier_to_hero_damage = 0,
    hero_to_soldier_damage = 0,
    bdb_dhds = 0,
    bdyx_dhds = 0,
    yxdb_dhds = 0,
    yxdyx_dhds = 0,
    hero_to_hero_damage = 0
  } = calculateVariables.value;

  defender_hero_hp = round(defender_hero_hp) || 1
  hudun_hp = round(hudun_hp) || 1
  bdb_dhds = round(bdb_dhds) || 0
  bdyx_dhds = round(bdyx_dhds) || 0
  yxdb_dhds = round(yxdb_dhds) || 0
  yxdyx_dhds = round(yxdyx_dhds) || 0
  defender_soldier_max_hp_per_unit = Number(defender_soldier_max_hp_per_unit) || 1

  let remaining_soldier_segments = attacker_soldier_max_segments - soldier_to_soldier_priority_segments;
  let hero_segments = gf_yx_gjds;

// 初始化守方士兵和英雄的剩余血量
  let defender_soldier_remaining_hp = defender_soldier_hp;
  let defender_hero_remaining_hp = defender_hero_hp;

// 初始化剩余护盾值
  let hudun_remaining_hp = hudun_hp; // 用护盾值这个变量来记录护盾值的变化

// 初始化护盾是否已经被士兵使用的标志
  let shield_used = false;

// 初始化士兵和英雄的击杀计数
  let soldier_killed_by_soldier = 0; // 用于记录士兵杀死多少只士兵
  let soldier_killed_by_hero = 0; // 用于记录英雄杀死多少只士兵

// 定义守方士兵状态判断函数（计算首只士兵血量，剩余士兵数）
  function calculate_defender_soldier_status(defender_soldier_remaining_hp, defender_soldier_max_hp_per_unit) {
    let remaining_hp_after_full_soldiers = defender_soldier_remaining_hp % defender_soldier_max_hp_per_unit;
    let first_soldier_hp, defender_soldier_count;

    if (remaining_hp_after_full_soldiers > 0) {
      first_soldier_hp = remaining_hp_after_full_soldiers;
      defender_soldier_count = Math.floor(defender_soldier_remaining_hp / defender_soldier_max_hp_per_unit) + 1;
    } else {
      first_soldier_hp = defender_soldier_max_hp_per_unit;
      defender_soldier_count = Math.floor(defender_soldier_remaining_hp / defender_soldier_max_hp_per_unit);
    }
    first_soldier_hp || (first_soldier_hp = 0)
    defender_soldier_count || (defender_soldier_count = 0)

    return {first_soldier_hp, defender_soldier_count};
  }

// 函数阅读理解
// # defender_soldier_remaining_hp 士兵当前总血量
// # defender_soldier_max_hp_per_unit 每只士兵总血量
// # remaining_hp_after_full_soldiers 士兵当前总血量/每只士兵总血量 算出来的余数，用于判断首个士兵是不是残血，如果是残血，会赋值给首个士兵
// # first_soldier_hp 最前面那只士兵的血量，如果是残血士兵，会赋值为 remaining_hp_after_full_soldiers，如果是满血士兵，会赋值为defender_soldier_max_hp_per_unit
// # defender_soldier_count 当前士兵的数量，利用math.floor向下取整后，加1
// # 函数最后返回的是 first_soldier_hp最前面那只士兵的血量 和 defender_soldier_count当前士兵的数量
//
// # ------------------------------
// # 阶段1：士兵优先出手打士兵
// # ------------------------------
//
// # 计算第一只士兵的血量（计算是否第一只士兵是残血士兵）
//
// # 计算当前守方士兵状态
  // 利用函数得到第一阶段时第一只士兵的血量 first_soldier_hp，以及当前士兵的数量 defender_soldier_count
  let {
    first_soldier_hp,
    defender_soldier_count
  } = calculate_defender_soldier_status(defender_soldier_remaining_hp, defender_soldier_max_hp_per_unit);
  let first_soldier_hp_hudun
  if (first_soldier_hp > 0 && defender_soldier_remaining_hp > 0) { // 当士兵血量不为 0 即有士兵时
    shield_used = true; // 使用护盾
    first_soldier_hp_hudun = first_soldier_hp + hudun_remaining_hp; // 将护盾加到第 1 只士兵身上
  }
  //  # 分割线
  //   st.divider()
  //
  // # 输出第1只士兵信息（用于调试）
  console.log(`士兵承伤阶段1 - 兵打兵 - 第1只士兵血量: ${first_soldier_hp}`)
  // 处理士兵优先出手段数
  let soldier_to_soldier_segments_used = 0; // 用一个变量从 0 开始记录 1 阶段的士兵兵打兵段数

  // 处理第 1 只士兵（如果存在）
  let segments_needed_to_kill_last_soldier
  if (first_soldier_hp > 0 && defender_soldier_remaining_hp > 0) { // 当士兵血量不为 0 即有士兵时
    segments_needed_to_kill_last_soldier = Math.ceil(first_soldier_hp_hudun / soldier_to_soldier_damage); // soldier_to_soldier_damage 是兵打兵的单段伤害，这个公式是算出第 1 只士兵向上取整需要多少段能杀，segments_needed_to_kill_last_soldier 就是算多少段能杀，护盾值加在第一个士兵上
    if (soldier_to_soldier_priority_segments >= segments_needed_to_kill_last_soldier) { // soldier_to_soldier_priority_segments 是士兵优先英雄出手的段数，之前用滑动条选择的，判断如果大于等于能杀第 1 只士兵的段数
      // 判断击杀第 1 只士兵
      soldier_to_soldier_priority_segments -= segments_needed_to_kill_last_soldier; // 士兵优先出手的段数 - 击杀第 1 只士兵消耗的段数 = 剩余的段数
      defender_soldier_remaining_hp -= first_soldier_hp; // 当前士兵总血量 - 第 1 只士兵的血量 = 当前士兵剩余血量
      soldier_to_soldier_segments_used += segments_needed_to_kill_last_soldier; // 记录第一阶段使用了多少兵打兵段数
      first_soldier_hp = 0;  // 第 1 只士兵已被杀死
      soldier_killed_by_soldier += 1; // 记录士兵杀死 1 只士兵
      hudun_remaining_hp = 0; // 剩余护盾值为 0
    } else {
      // 第 1 只士兵未被打死
      defender_soldier_remaining_hp = Math.min(defender_soldier_remaining_hp, defender_soldier_remaining_hp + hudun_remaining_hp - soldier_to_soldier_priority_segments * soldier_to_soldier_damage); // 当前士兵总血量 - 士兵优先英雄出手的段数 * 兵打兵的单段伤害 = 当前士兵总血量剩余血量
      first_soldier_hp = Math.min(first_soldier_hp, first_soldier_hp_hudun - soldier_to_soldier_priority_segments * soldier_to_soldier_damage); // 第 1 只士兵血量 - 士兵优先英雄出手的段数 * 兵打兵的单段伤害 = 第 1 士兵目前剩余的血量
      soldier_to_soldier_segments_used += soldier_to_soldier_priority_segments; // 记录第一阶段使用了多少兵打兵段数
      hudun_remaining_hp = Math.max(0, hudun_remaining_hp - soldier_to_soldier_priority_segments * soldier_to_soldier_damage); // 计算剩余护盾值
      soldier_to_soldier_priority_segments = 0; // 士兵优先英雄出手的段数为 0，消耗光了
      first_soldier_hp_hudun = first_soldier_hp + hudun_remaining_hp;  // 再次将护盾加到第 1 只士兵身上并记录
    }
  }

// # 这个阶段以后，护盾使用过（即不能再给英雄使用），而且护盾值消耗了一部分，有可能为0
// 处理从第 2 只士兵开始的满血士兵的承伤
  for (let i = 0; i < defender_soldier_count - 1; i++) {  // 忽略已处理的第 1 只士兵
    if (soldier_to_soldier_priority_segments === 0 || defender_soldier_remaining_hp <= 0) { // 做 1 个判断，若士兵优先英雄出手的段数为 0 即已经用完，或者当前士兵总血量为 0 即没有士兵了，就跳出循环
      break;
    }

    let current_soldier_hp = defender_soldier_max_hp_per_unit; // 每只满血士兵血量，等于每只守方士兵最大血量 defender_soldier_max_hp_per_unit
    let segments_needed_to_kill_soldier = Math.ceil(current_soldier_hp / soldier_to_soldier_damage); // 计算击杀每只士兵需要的段数

    if (soldier_to_soldier_priority_segments >= segments_needed_to_kill_soldier) { // 如果剩余的段数大于等于击杀需要的段数
      // 杀死当前士兵
      soldier_to_soldier_priority_segments -= segments_needed_to_kill_soldier; // 计算杀死后，消耗的段数
      defender_soldier_remaining_hp -= current_soldier_hp; // 计算杀死后，当前士兵剩余的总血量
      soldier_to_soldier_segments_used += segments_needed_to_kill_soldier; // 累积记录消耗的兵打兵段数
      soldier_killed_by_soldier += 1; // 记录累计士兵杀死士兵的个数
    } else {
      // 当前士兵未被打死
      defender_soldier_remaining_hp -= soldier_to_soldier_priority_segments * soldier_to_soldier_damage; // 计算未被杀死时，当前士兵剩余的总血量
      soldier_to_soldier_segments_used += soldier_to_soldier_priority_segments; // 继续累积去记录消耗的兵打兵段数
      soldier_to_soldier_priority_segments = 0; // 记录士兵优先英雄出手的段数为 0，消耗光了
      break; // 段数用完，跳出循环
    }
  }

// ------------------------------
// 处理士兵打英雄的段数，加入鞭尸机制
// ------------------------------

// 初始化鞭尸丢失段数
  let soldier_to_hero_lost_segments_1 = 0; // 用一个变量记录鞭尸丢失的段数
  let soldier_to_hero_segments_used_1 = 0; // 士兵打英雄的实际作用段数（未丢失）第 1 阶段
  let defender_hero_remaining_hp_hudun
  if (!shield_used && defender_soldier_remaining_hp <= 0) { // 如果护盾没被使用且没有士兵
    defender_hero_remaining_hp_hudun = hudun_remaining_hp + defender_hero_remaining_hp;
  } else {
    defender_hero_remaining_hp_hudun = defender_hero_remaining_hp;
  }

  if (soldier_to_soldier_priority_segments > 0) {
    let soldier_to_hero_segments = soldier_to_soldier_priority_segments;

    // 计算守方英雄剩余血量与实际作用段数
    if (defender_hero_remaining_hp > 0 && defender_soldier_remaining_hp === 0) { // 如果守方英雄剩余血量大于 0 且没有士兵了
      let segments_needed_to_kill_hero = Math.ceil(defender_hero_remaining_hp_hudun / soldier_to_hero_damage); // 计算守方英雄的剩余血量需要多少段兵打英雄能杀掉

      if (soldier_to_hero_segments >= segments_needed_to_kill_hero) { // 如果兵打英雄的段数能杀死英雄
        // 杀死英雄，剩余的段数被鞭尸丢失
        soldier_to_hero_segments_used_1 = segments_needed_to_kill_hero; // 士兵打英雄的真实段数
        soldier_to_hero_lost_segments_1 = soldier_to_hero_segments - segments_needed_to_kill_hero; // 计算鞭尸丢失的段数
        defender_hero_remaining_hp = 0; // 守方英雄剩余血量为 0

        if (!shield_used) {
          hudun_remaining_hp = 0; // 剩余护盾值为 0
        }
      } else {
        // 英雄未被打死，全部段数都生效
        soldier_to_hero_segments_used_1 = soldier_to_hero_segments; // 士兵打英雄的真实段数
        soldier_to_hero_lost_segments_1 = 0; // 鞭尸丢失的段数为 0
        defender_hero_remaining_hp = Math.min(defender_hero_remaining_hp, defender_hero_remaining_hp_hudun - soldier_to_hero_segments * soldier_to_hero_damage); // 计算守方英雄的剩余血量

        if (!shield_used) {
          hudun_remaining_hp = Math.max(0, hudun_remaining_hp - soldier_to_hero_segments * soldier_to_hero_damage); // 计算剩余护盾值
          defender_hero_remaining_hp_hudun = hudun_remaining_hp + defender_hero_remaining_hp;
        }
      }
    } else if (defender_hero_remaining_hp <= 0 && defender_soldier_remaining_hp <= 0) { // 如果英雄已经死亡，则所有段数都被鞭尸丢失
      soldier_to_hero_lost_segments_1 = soldier_to_hero_segments; // 所有段数丢失
      soldier_to_hero_segments_used_1 = 0; // 士兵打英雄的真实段数为 0
    }
  } else {
    soldier_to_hero_segments_used_1 = 0;
  }


  // ------------------------------
// 阶段 2：英雄出手打士兵
// ------------------------------

// 重新计算守方士兵状态
  let res = calculate_defender_soldier_status(defender_soldier_remaining_hp, defender_soldier_max_hp_per_unit);
  first_soldier_hp = res.first_soldier_hp
  defender_soldier_count = res.defender_soldier_count
// 利用函数得到第二阶段时，排最前面的士兵的血量 first_soldier_hp，以及当前士兵的数量 defender_soldier_count

  if (first_soldier_hp > 0 && defender_soldier_remaining_hp > 0) { // 当排头士兵血量不为 0 且有士兵时
    if (hudun_remaining_hp > 0) { // 如果护盾值不为 0，把护盾加到排头士兵上
      first_soldier_hp_hudun = first_soldier_hp + hudun_remaining_hp;
    } else {
      first_soldier_hp_hudun = first_soldier_hp;
    }
  }

// 输出排头士兵信息（用于调试）
  console.log(`士兵承伤阶段 2 - 英雄打兵 - 排头士兵血量: ${first_soldier_hp}`);

  let hero_to_soldier_segments_used = 0; // 用一个变量从 0 开始记录第 2 阶段的英雄打兵的段数

// 处理排头士兵
  if (first_soldier_hp > 0 && defender_soldier_remaining_hp > 0) { // 当排头士兵血量不为 0 且有士兵时
    segments_needed_to_kill_last_soldier = Math.ceil(first_soldier_hp_hudun / hero_to_soldier_damage); // 计算杀死排头士兵需要多少段英雄打兵的段数
    if (hero_segments >= segments_needed_to_kill_last_soldier) { // 判断英雄段数是否能杀排头士兵
      // 杀死排头士兵
      hero_segments -= segments_needed_to_kill_last_soldier; // 计算杀死排头士兵后，英雄剩余的段数
      defender_soldier_remaining_hp -= first_soldier_hp; // 计算杀死排头士兵后，当前士兵总血量剩多少
      hero_to_soldier_segments_used += segments_needed_to_kill_last_soldier; // 累计记录英雄打兵消耗的段数
      first_soldier_hp = 0; // 将排头士兵血量定为 0
      soldier_killed_by_hero += 1; // 记录英雄杀死 1 只士兵
      hudun_remaining_hp = 0; // 剩余护盾值为 0
    } else {
      // 排头士兵未被打死
      defender_soldier_remaining_hp = Math.min(defender_soldier_remaining_hp, defender_soldier_remaining_hp + hudun_remaining_hp - hero_segments * hero_to_soldier_damage); // 当前士兵总血量剩多少
      first_soldier_hp = Math.min(first_soldier_hp, first_soldier_hp_hudun - hero_segments * hero_to_soldier_damage); // 计算排头士兵血量剩多少
      hero_to_soldier_segments_used += hero_segments; // 累计记录英雄打兵消耗的段数，没打死就全记录
      hudun_remaining_hp = Math.max(0, hudun_remaining_hp - hero_segments * hero_to_soldier_damage); // 计算剩余护盾值
      hero_segments = 0; // 英雄出手段数用完了
      first_soldier_hp_hudun = first_soldier_hp + hudun_remaining_hp; // 将护盾值继续加在排头士兵身上
    }
  }

  // 处理满血士兵
  for (let i = 0; i < defender_soldier_count - 1; i++) { // 忽略已处理的排头士兵
    if (hero_segments == 0 || defender_soldier_remaining_hp <= 0) { // 英雄出手段数用完或当前士兵总血量为0即没有士兵了，跳出循环
      break;
    }
    let current_soldier_hp = defender_soldier_max_hp_per_unit; // current_soldier_hp是每只满血士兵血量
    let segments_needed_to_kill_soldier = Math.ceil(current_soldier_hp / hero_to_soldier_damage); // 计算一只满血的士兵要消耗英雄打兵多少段

    if (hero_segments >= segments_needed_to_kill_soldier) { // 如果英雄段数足够杀死一只满血士兵
      hero_segments -= segments_needed_to_kill_soldier; // 计算杀死这只士兵后，英雄剩余的段数
      defender_soldier_remaining_hp -= current_soldier_hp; // 计算杀死这只士兵后，当前士兵总血量剩多少
      hero_to_soldier_segments_used += segments_needed_to_kill_soldier; // 累计记录英雄打兵消耗的段数
      soldier_killed_by_hero += 1; // 记录累计英雄杀死士兵的个数
    } else {
      defender_soldier_remaining_hp -= hero_segments * hero_to_soldier_damage; // 当前士兵总血量剩多少
      hero_to_soldier_segments_used += hero_segments; // 累计记录英雄打兵消耗的段数，没打死就全记录
      hero_segments = 0; // 英雄出手段数用完了
      break;
    }
  }

  // 若英雄出手段数还有剩余且守方士兵已被打光，则剩余段数打英雄
  if (!shield_used && defender_soldier_remaining_hp <= 0) { // 如果护盾没被使用且没有士兵
    if (hudun_remaining_hp > 0) {
      defender_hero_remaining_hp_hudun = hudun_remaining_hp + defender_hero_remaining_hp;
    } else {
      defender_hero_remaining_hp_hudun = defender_hero_remaining_hp;
    }
  }
  let hero_to_hero_segments // hero_to_hero_segments表示英雄打英雄的段数
  if (hero_segments > 0) {
    if (defender_hero_remaining_hp > 0 && defender_soldier_remaining_hp <= 0) { // 如果守方英雄剩余血量大于0且没有士兵了
      hero_to_hero_segments = hero_segments;
      defender_hero_remaining_hp = Math.max(0, Math.min(defender_hero_remaining_hp, defender_hero_remaining_hp_hudun - hero_to_hero_segments * hero_to_hero_damage)); // 计算英雄打英雄后，守方英雄剩余的当前血量
      hudun_remaining_hp = Math.max(0, hudun_remaining_hp - hero_to_hero_segments * hero_to_hero_damage); // 计算剩余护盾值
      defender_hero_remaining_hp_hudun = hudun_remaining_hp + defender_hero_remaining_hp;
    } else if (defender_hero_remaining_hp <= 0 && defender_soldier_remaining_hp <= 0) { // 如果守方英雄已经死了
      hero_to_hero_segments = 0; // 英雄段数丢失
    }
  } else {
    hero_to_hero_segments = 0;
  }

  // ------------------------------
// 阶段3：剩余士兵出手打士兵
// ------------------------------

// 重新计算守方士兵状态
  res = calculate_defender_soldier_status(defender_soldier_remaining_hp, defender_soldier_max_hp_per_unit);
  first_soldier_hp = res.first_soldier_hp
  defender_soldier_count = res.defender_soldier_count
// 利用函数得到第二阶段时，排最前面的士兵的血量first_soldier_hp，以及当前士兵的数量defender_soldier_count

  if (first_soldier_hp > 0 && defender_soldier_remaining_hp > 0) { // 当排头士兵血量不为0且有士兵时
    if (hudun_remaining_hp > 0) { // 如果护盾值不为0，把护盾加到排头士兵上
      first_soldier_hp_hudun = first_soldier_hp + hudun_remaining_hp;
    } else {
      first_soldier_hp_hudun = first_soldier_hp;
    }
  }

// 输出残血士兵信息（用于调试）
  console.log(`士兵承伤阶段3 - 第二次兵打兵-排头士兵血量: ${first_soldier_hp}`);

  let remaining_soldier_to_soldier_segments_used = 0; // 用一个变量从0开始记录3阶段的第二次士兵兵打兵段数

// 处理排头士兵
  if (first_soldier_hp > 0 && defender_soldier_remaining_hp > 0) { // 当排头士兵血量不为0且有士兵时
    segments_needed_to_kill_last_soldier = Math.ceil(first_soldier_hp_hudun / soldier_to_soldier_damage); // 计算杀死排头士兵需要多少段兵打兵的段数
    if (remaining_soldier_segments >= segments_needed_to_kill_last_soldier) { // remaining_soldier_segments是后于英雄出手的士兵段数，若能杀死排头士兵
      // 杀死排头士兵
      remaining_soldier_segments -= segments_needed_to_kill_last_soldier; // 计算杀死排头士兵后，剩余的兵打兵段数
      defender_soldier_remaining_hp -= first_soldier_hp; // 计算杀死排头士兵后，当前士兵总血量剩多少
      remaining_soldier_to_soldier_segments_used += segments_needed_to_kill_last_soldier; // 累计记录第二次兵打兵消耗的段数
      first_soldier_hp = 0; // 将排头士兵血量定为0
      soldier_killed_by_soldier += 1;  // 记录累计士兵杀死士兵的个数
      hudun_remaining_hp = 0;  // 剩余护盾值为0
    } else {
      // 排头士兵未被打死
      defender_soldier_remaining_hp = Math.min(defender_soldier_remaining_hp, defender_soldier_remaining_hp + hudun_remaining_hp - remaining_soldier_segments * soldier_to_soldier_damage); // 当前士兵总血量剩多少
      first_soldier_hp = Math.min(first_soldier_hp, first_soldier_hp_hudun - remaining_soldier_segments * soldier_to_soldier_damage);  // 当前排头士兵剩多少
      remaining_soldier_to_soldier_segments_used += remaining_soldier_segments; // 累计记录第二次兵打兵消耗的段数，没打死就全记录
      hudun_remaining_hp = Math.max(0, hudun_remaining_hp - remaining_soldier_segments * soldier_to_soldier_damage); // 计算剩余护盾值
      remaining_soldier_segments = 0; // 第二次士兵出手的段数消耗完了
    }
  }

// 这个阶段完成后，护盾有可能全部消耗，有可能剩余
// 处理满血士兵
  for (let i = 0; i < defender_soldier_count - 1; i++) { // 忽略已处理的排头士兵
    if (remaining_soldier_segments === 0 || defender_soldier_remaining_hp <= 0) { // 士兵二阶段段数用完或当前士兵总血量为0即没有士兵了，跳出循环
      break;
    }
    let current_soldier_hp = defender_soldier_max_hp_per_unit; // current_soldier_hp是每只满血士兵血量，等于每只守方士兵最大血量defender_soldier_max_hp_per_unit
    let segments_needed_to_kill_soldier = Math.ceil(current_soldier_hp / soldier_to_soldier_damage); // 计算一只满血的士兵要消耗兵雄打兵多少段

    if (remaining_soldier_segments >= segments_needed_to_kill_soldier) { // 如果士兵二阶段段数足够杀死一只满血士兵
      remaining_soldier_segments -= segments_needed_to_kill_soldier; // 计算杀死这只士兵后，士兵二阶段剩余的段数
      defender_soldier_remaining_hp -= current_soldier_hp; // 计算杀死这只士兵后，当前士兵总血量剩多少
      remaining_soldier_to_soldier_segments_used += segments_needed_to_kill_soldier; // 累计记录第二次兵打兵消耗的段数
      soldier_killed_by_soldier += 1; // 记录累计士兵杀死士兵的个数
    } else {
      defender_soldier_remaining_hp -= remaining_soldier_segments * soldier_to_soldier_damage; // 当前士兵总血量剩多少
      remaining_soldier_to_soldier_segments_used += remaining_soldier_segments; // 累计记录第二次兵打兵消耗的段数，没打死就全记录
      remaining_soldier_segments = 0; // 第二次士兵出手的段数消耗完了
      break;
    }
  }

  // ------------------------------
// 处理士兵打英雄的段数，加入鞭尸机制
// ------------------------------

// 初始化鞭尸丢失段数
  let soldier_to_hero_lost_segments_3 = 0; // 用一个变量记录鞭尸丢失的段数
  let soldier_to_hero_segments_used_3 = 0; // 士兵打英雄的实际作用段数（未丢失）第3阶段

  if (!shield_used && defender_soldier_remaining_hp <= 0) { // 如果护盾没被使用且没有士兵
    if (hudun_remaining_hp > 0) {
      defender_hero_remaining_hp_hudun = hudun_remaining_hp + defender_hero_remaining_hp;
    } else {
      defender_hero_remaining_hp_hudun = defender_hero_remaining_hp;
    }
  }

  if (remaining_soldier_segments > 0) {
    let remaining_soldier_to_hero_segments = remaining_soldier_segments;

    // 计算守方英雄剩余血量
    if (defender_hero_remaining_hp > 0 && defender_soldier_remaining_hp <= 0) { // 如果守方英雄剩余血量大于0且没有士兵了
      let segments_needed_to_kill_hero = Math.ceil(defender_hero_remaining_hp_hudun / soldier_to_hero_damage); // 计算守方英雄的剩余血量需要多少段兵打英雄能杀掉

      if (remaining_soldier_to_hero_segments >= segments_needed_to_kill_hero) { // 如果二阶段兵打英雄的段数能杀死英雄
        // 杀死英雄，剩余的段数被鞭尸丢失
        soldier_to_hero_segments_used_3 = segments_needed_to_kill_hero; // 定义soldier_to_hero_segments_used为士兵打英雄的真实段数
        soldier_to_hero_lost_segments_3 = remaining_soldier_to_hero_segments - segments_needed_to_kill_hero; // 计算鞭尸丢失的段数
        defender_hero_remaining_hp = 0; // 守方英雄剩余血量为0
        if (!shield_used) {
          hudun_remaining_hp = 0; // 剩余护盾值为0
        }
      } else {
        // 英雄未被打死，全部段数都生效
        soldier_to_hero_segments_used_3 = remaining_soldier_to_hero_segments; // 定义soldier_to_hero_segments_used为士兵打英雄的真实段数，英雄未死全部都算
        soldier_to_hero_lost_segments_3 = 0; // 计算鞭尸丢失的段数为0
        defender_hero_remaining_hp = Math.min(defender_hero_remaining_hp, defender_hero_remaining_hp_hudun - remaining_soldier_to_hero_segments * soldier_to_hero_damage); // 计算守方英雄的剩余血量
        if (!shield_used) {
          hudun_remaining_hp = Math.max(0, hudun_remaining_hp - remaining_soldier_to_hero_segments * soldier_to_hero_damage); // 计算剩余护盾值
        }
      }
    } else if (defender_hero_remaining_hp <= 0 && defender_soldier_remaining_hp <= 0) { // 如果英雄已经死亡，则所有段数都被鞭尸丢失
      soldier_to_hero_lost_segments_3 = remaining_soldier_to_hero_segments; // 计算鞭尸丢失的段数全丢了
      soldier_to_hero_segments_used_3 = 0; // 士兵打英雄的真实段数为0
    }
  } else {
    soldier_to_hero_segments_used_3 = 0;
  }

  let soldier_to_hero_segments_used = soldier_to_hero_segments_used_1 + soldier_to_hero_segments_used_3; // 计算士兵打英雄实际段数

// # ------------------------------
// # 计算守方英雄的剩余血量 defender_hero_remaining_hp（前面已计算，不用重复计算）
// # ------------------------------

  // ------------------------------
// 输出结果
// ------------------------------

// 将2个阶段的士兵打士兵段数合计起来
  let soldier_to_soldier_segments_used_hj = soldier_to_soldier_segments_used + remaining_soldier_to_soldier_segments_used;

  soldier_to_soldier_segments_used_hj -= bdb_dhds
  soldier_to_hero_segments_used -= bdyx_dhds
  hero_to_soldier_segments_used -= yxdb_dhds
  hero_to_hero_segments -= yxdyx_dhds

  // 定义本次单点总伤害
  let dd_zsh = (soldier_to_soldier_segments_used_hj * soldier_to_soldier_damage +
      soldier_to_hero_segments_used * soldier_to_hero_damage +
      hero_to_soldier_segments_used * hero_to_soldier_damage +
      hero_to_hero_segments * hero_to_hero_damage);

// 定义士兵打士兵与英雄打士兵的总伤害
  let dd_dsb_sh = soldier_to_soldier_segments_used_hj * soldier_to_soldier_damage +
      hero_to_soldier_segments_used * hero_to_soldier_damage;

// 定义士兵打英雄与英雄打英雄的总伤害
  let dd_dyx_sh = soldier_to_hero_segments_used * soldier_to_hero_damage +
      hero_to_hero_segments * hero_to_hero_damage;

  return {
    result1: [
      {
        label: "士兵打士兵的段数",
        value: soldier_to_soldier_segments_used_hj
      },
      {
        label: "士兵打士兵伤害",
        value: soldier_to_soldier_segments_used_hj * soldier_to_soldier_damage
      },
      {
        label: "士兵打英雄的段数",
        value: soldier_to_hero_segments_used
      },
      {
        label: "士兵打英雄伤害",
        value: soldier_to_hero_segments_used * soldier_to_hero_damage
      },
      {
        label: "英雄打士兵的段数",
        value: hero_to_soldier_segments_used
      },
      {
        label: "英雄打士兵伤害",
        value: hero_to_soldier_segments_used * hero_to_soldier_damage
      },
      {
        label: "英雄打英雄的段数",
        value: hero_to_hero_segments
      },
      {
        label: "英雄打英雄伤害",
        value: hero_to_hero_segments * hero_to_hero_damage
      },
    ],
    result2: [
      {
        label: "士兵杀死士兵数量",
        value: soldier_killed_by_soldier
      },
      {
        label: "英雄杀死士兵数量",
        value: soldier_killed_by_hero
      },
    ],
    result3: [
      {
        label: "守方剩余护盾",
        value: hudun_remaining_hp,
        valueClass: "warning",
      },
      {},
      {
        label: "守方士兵剩余血量",
        value: `${defender_soldier_remaining_hp}/${defender_soldier_hp}`,
        valueClass: "error",
      },
      {
        label: "守方英雄剩余血量",
        value: `${defender_hero_remaining_hp}/${defender_hero_hp}`,
        valueClass: "success",
      },
    ],
    result4: [
      {
        label: "本次单点总伤害",
        value: dd_zsh,
        valueClass: "primary",
      },
      {},
      {
        label: "其中：对士兵造成伤害",
        value: dd_dsb_sh
      },
      {
        label: "其中：对英雄造成伤害",
        value: dd_dyx_sh
      },

    ],
  }
})

const sqDialog = ref(false)

const sbkjDialog = ref(false)

const zykzDialog = ref(false)

const chakanGfczjsDialog = ref(false)
const chakan_gfczjs_table = computed(() => {
  const {
    bdb_gfc,
    bdyx_gfc,
    yxdb_gfc,
    yxdyx_gfc,
    bdb_tyzj,
    bdyx_tyzj,
    yxdb_tyzj,
    yxdyx_tyzj,
    bdb_jnzj,
    bdyx_jnzj,
    yxdb_jnzj,
    yxdyx_jnzj,
    bdb_yczj,
    bdyx_yczj,
    yxdb_yczj,
    yxdyx_yczj,
    bdb_qtzj,
    bdyx_qtzj,
    yxdb_qtzj,
    yxdyx_qtzj,
    bdb_jnbl,
    bdyx_jnbl,
    yxdb_jnbl,
    yxdyx_jnbl,
    bdb_dd_sh,
    bdyx_dd_sh,
    yxdb_dd_sh,
    yxdyx_dd_sh,
    bdb_bsbv,
    bdyx_bsbv,
    yxdb_bsbv,
    yxdyx_bsbv,
    bdb_ddbj_sh,
    bdyx_ddbj_sh,
    yxdb_ddbj_sh,
    yxdyx_ddbj_sh
  } = calculateVariables.value;
  return [
    {
      id: 1,
      attacker: "兵打兵",
      defenseDifference: bdb_gfc,
      commonEffect: bdb_tyzj,
      skillEffect: bdb_jnzj,
      rangedEffect: bdb_yczj,
      otherEffect: bdb_qtzj,
      skillMultiplier: bdb_jnbl,
      singleSegment: bdb_dd_sh,
      critMultiplier: bdb_bsbv,
      critSingleSegment: bdb_ddbj_sh
    },
    {
      id: 2,
      attacker: "兵打英雄",
      defenseDifference: bdyx_gfc,
      commonEffect: bdyx_tyzj,
      skillEffect: bdyx_jnzj,
      rangedEffect: bdyx_yczj,
      otherEffect: bdyx_qtzj,
      skillMultiplier: bdyx_jnbl,
      singleSegment: bdyx_dd_sh,
      critMultiplier: bdyx_bsbv,
      critSingleSegment: bdyx_ddbj_sh
    },
    {
      id: 3,
      attacker: "英雄打兵",
      defenseDifference: yxdb_gfc,
      commonEffect: yxdb_tyzj,
      skillEffect: yxdb_jnzj,
      rangedEffect: yxdb_yczj,
      otherEffect: yxdb_qtzj,
      skillMultiplier: yxdb_jnbl,
      singleSegment: yxdb_dd_sh,
      critMultiplier: yxdb_bsbv,
      critSingleSegment: yxdb_ddbj_sh
    },
    {
      id: 4,
      attacker: "英雄打英雄",
      defenseDifference: yxdyx_gfc,
      commonEffect: yxdyx_tyzj,
      skillEffect: yxdyx_jnzj,
      rangedEffect: yxdyx_yczj,
      otherEffect: yxdyx_qtzj,
      skillMultiplier: yxdyx_jnbl,
      singleSegment: yxdyx_dd_sh,
      critMultiplier: yxdyx_bsbv,
      critSingleSegment: yxdyx_ddbj_sh
    },
  ]

})


watchEffect(()=>{
  if(formData.value.attacker_full_health){
    formData.value.attacker_soldier_count = formData.value.gf_sffmxh_pd?"12":"10"
  }
})


const shuoming = ref([
  {
    title: "一、单段伤害计算区，可以实际模拟出兵打兵、兵打人、人打兵、兵打人四个维度的单段伤害。",
    desc: [
      "（1）里面每个输入框都是可以直接用英文符号直接用公式计算的，如1588/1.2*(1+0.2+0.3)*1.4非常方便数值调整。",
      "（2）设置了物理、魔法通用增减伤害和克制的的区分，可以模拟混伤克制情况。",
      "（3）克制修正输入的开关在攻方处，如果需要输入守方的双防克制系数加成，需要在攻方区域打开克制关系。如守方有冰女王的彻骨寒意，可在守方双防克制修正填-20",
      "（4) 攻方暴击伤害已默认1.3，如果有额外暴伤只需要填入额外爆伤 如锋刺填10"
    ],
  },
  {
    title: "二、段数分配模拟区",
    desc: [
      "（1）默认关联上面的单点伤害计算的段数，也可以手动输入单段伤害。",
      "（2）攻方士兵需要输入数量，默认满血是10只，也可以手动输入为12只。如果想模拟雷马，可将攻方士兵数量填0，在之前的英雄出手段数填40段。",
      "（3）守方士兵需要输入单只兵的血量（注意是单只兵），然后输入一个士兵当前总血量，会自动计算出有多少只兵。默认满血是10只",
      "（4）加入护盾机制，可以填入护盾值，如果要模拟直击本体，可将守方士兵当前血量填0即没有小兵，护盾就会自动加在英雄本体上。",
      "（5）最关键的是，需要根据出手速度来调整士兵先于英雄出手多少段，如伊莉娅姐姐用3C，可以设置为士兵先于英雄出手10段。计算器会自动根据伤害分分配段数，可以对比总伤害来调整段数分配更接近实际。",
      "（6）如果士兵有伤害丢失，可以填入士兵丢失的段数（如战损丢失）。",
      "（7）加入动画丢失段数的填写，在伪直击或打护盾单位（经常会有一只兵不打）时，可以利用此功能调整总伤害。",
    ]
  },
  {
    title: "三、其他",
    desc: [
      "（1）录入了神契特效、士兵科技、职业克制系数的查询，可以更加方便查询。",
      "（2）做了一个战斗攻防差与增减伤关系的统计，已考虑了克制系数、无视防御、地形修正。以便更快捷的知道多少攻防差，多少增伤能打什么样的伤害，方便积累经验。",
    ]
  },
  {
    title: "四、缺陷",
    desc: [
      "近战肉搏类无法完美模拟，因为目前设置的是士兵出手一部分段数，英雄出手全部段数，士兵再出手剩余段数，这样分三个阶段模拟的，但实际战斗中会有战损，或撞击判定等特殊情况。",
      "计算器用于模拟的意义更大，便于在配置上，少走更多弯路。并且也能分析一些此前模糊的机制，如虽然姐姐和大白毛都有可能暴击一段一个兵，出手速度也相同，但由于大白毛是近战，姐姐是远程，导致士兵优先英雄出手的段数分配差异非常大。",
    ]
  },
  {
    title: "",
    desc: [
      "希望能对大家数据分析有一点帮助，如有疑问加梦战计算器使用交流群 928411216",
    ]
  }
])


</script>

<style lang="scss">
.ddjsq {
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
}

</style>
