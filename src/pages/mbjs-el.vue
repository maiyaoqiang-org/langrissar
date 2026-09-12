<template>
  <div class="mbjs-el calculator-page" style="padding:24px;">
    <el-button class="mb_16 panel-button-secondary" :icon="RefreshLeft" @click="resetFormData">重置数据</el-button>

    <div class="mb_16 panel-toolbar" flex="cross:center main:justify">
      <div>
        <el-checkbox v-model="configData.showHero" border  label="英雄" />
        <el-checkbox v-model="configData.showSoldier" border  label="士兵" />
      </div>
      <div>
        <el-button :icon="Collection" @click="saveHeroCache">缓存数据</el-button>
        <el-button type="primary" plain class="ml_8" :icon="FolderOpened" @click="loadHeroCache">使用缓存</el-button>
      </div>
    </div>

    <el-form style="min-width: 600px;" label-width="120px" class="base-el-form" label-position="right" :inline="true"
      :model="formData">
      <CalculatorSection id="panel-white" data-calculator-section="英雄白字" class="mb_16" title="英雄白字区" :icon="User"
        :summary="[formData.selected_hero_row, formData.selected_job].filter(Boolean).join(' · ')">
        <div flex class="panel-flow panel-hero-overview">
          <div flex class="mr_16">
            <div flex-box="0">
              <el-form-item label="选择英雄名">
                <CalculatorPicker v-model="formData.selected_hero_row" :options="heroPickerOptions" title="选择英雄" />
              </el-form-item>
              <br>
              <el-form-item label="选择职业">
                <CalculatorPicker v-model="formData.selected_job" :options="jobPickerOptions" title="选择职业" />
              </el-form-item>

              <template v-if="currentSelectedJob">
                <div flex>
                  <div flex="dir:top cross:center">
                    <el-image style="width:120px;height:120px;display:block;" :src="formData.selected_hero_row === '自定义英雄' ? zdyLogo : currentSelectedJob?.['英雄头像']" alt="" />
                    <div>
                      {{ currentSelectedJob?.['英雄名'] }}
                    </div>
                  </div>

                  <div class="ml_16" flex="dir:top cross:center">
                    <el-image style="width:40px;height:40px;display:block;" :src="formData.selected_job === '自定义' ? zdyZY : currentSelectedJob?.['occupationPic']"
                      alt="" />
                    <div>
                      {{ currentSelectedJob?.['occupation'] }}
                    </div>
                  </div>

                </div>

              </template>

            </div>

          </div>
          <div v-show="configData.showHero" class="panel-white-values">
            <el-form-item label=" ">
              <el-checkbox v-model="formData.bz_input_can_edit" label="是否自定义白字"></el-checkbox>
            </el-form-item>
            <br>
            <template v-for="(item, index) in mianbanList" :key="index">
              <el-form-item :label="item" style="--el-form-item__content_width:300px;display: flex;">
                <div v-if="!formData.bz_input_can_edit" style="font-size: 20px;margin-right: 8px;">
                  {{ round(formData.bz[item]) }}
                </div>
                <el-input-number :disabled="!formData.bz_input_can_edit" v-model="formData.bz[item]" :precision="2"
                  :min="0" />
              </el-form-item>
              <br>
            </template>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection id="panel-covenant" data-calculator-section="神契设置" class="mb_16" title="神契设置区" :icon="Connection"
        summary="已保留晨曦之祝加成与神契设置，展开可继续调整。">
        <template #actions>
            <div class="panel-actions" style="margin-left: auto;">
              <el-button type="primary" :icon="MagicStick" @click="set_sq_cxzz_max">一键点满</el-button>
              <el-button class="panel-button-secondary" :icon="RefreshLeft" @click="reset_sq_cxzz">重置数据</el-button>
              <el-button :icon="Download" @click="export_sq_cxzz">导出神契设置</el-button>
              <el-button :icon="Upload" @click="import_sq_cxzz">导入神契设置</el-button>
            </div>
        </template>
        <div>
          <el-form-item label="筛选神契" class="panel-covenant-filter">
            <CalculatorPicker v-model="sq_filter_data" :options="covenantPickerOptions" title="筛选神契"
              placeholder="选择神契" multiple clearable />
          </el-form-item>

        </div>
        <calculator-scroll-table label="神契属性表">
        <el-table border size="small" class="panel-edit-table" scrollbar-always-on :row-class-name="tableRowClassName" :data="sq_slsb_show_table">
          <el-table-column v-for="(item, index) in sq_slsb_table_columns" :fixed="item.fixed" :key="index"
            :width="index === 0 ? 112 : Math.max(item.width, 152)" :label="item.label" :prop="item.prop">
            <template #default="scope">
              <template v-if="scope.row?.名称 === '神契晨曦之祝加成' && item.prop !== '名称'">
                <div class="panel-input-limit">
                  最大值{{ formatCalculatorNumber(item.max) }}
                </div>
                <mz-number-input style="width:120px;" :max="item.max" v-model="sq_cxzz[item.prop]"
                  :is-percent="item.isPercent" :min="0"></mz-number-input>
              </template>
              <template v-else>
                <div v-if="item.prop === '名称'" flex="cross:center">
                  <el-image v-if="sq_slsb_dict[scope.row[item.prop]]?.image" style="width:30px;height:30px;" class="mr_8"
                    :src="sq_slsb_dict[scope.row[item.prop]]?.image" alt="" />
                  <div>
                    {{ scope.row[item.prop] }}
                  </div>

                </div>
                <span v-else-if="item.isPercent">{{ formatCalculatorPercent(scope.row[item.prop]) }}</span>
                <span v-else>{{ formatCalculatorNumber(scope.row[item.prop]) }}</span>
              </template>


            </template>

          </el-table-column>
        </el-table>
        </calculator-scroll-table>
      </CalculatorSection>

      <CalculatorSection v-show="configData.showHero" id="panel-green" data-calculator-section="装备与绿字加成" class="mb_16"
        title="英雄绿字区" :icon="MagicStick" summary="装备、附魔、精通等设置已保留，展开可查看与修改。">

        <el-tabs model-value="装备" style="min-height: 300px;">
          <el-tab-pane class="item-w-340" label="装备" name="装备">
            <div class="panel-actions panel-preset-actions" style="margin-bottom:16px;">
              <el-button type="primary" plain @click="set_attack_equip_set">一键设置攻击套装</el-button>
              <el-button type="primary" plain @click="set_int_equip_set">一键设置智力套装</el-button>
            </div>
            <div class="panel-equipment-layout">
              <div class="panel-equipment-list">
                <template v-for="(formKey, key) in wqFormKey" :key="key">
                  <el-form-item :label="'请选择' + key">
                    <CalculatorPicker v-model="formData[formKey]" :options="equipmentPickerOptions[key]"
                      :title="'选择' + key" />
                    <div class="panel-equipment-info">
                      <el-image class="panel-equipment-image" :src="wqSelectedObj[key]?.picAddr" alt="" />
                      <div class="panel-equipment-name">
                        {{ wqSelectedObj[key]?.equipName }}
                      </div>
                      <div class="panel-equipment-bonus">
                        基础加成：<span>{{ wqSelectedObj[key]?.basicBonus }}</span>
                      </div>
                      <div class="panel-equipment-effect">
                        满级特效：<span>{{ wqSelectedObj[key]?.specialEffects }}</span>
                      </div>
                    </div>
                  </el-form-item>
                  <br>
                </template>

              </div>

              <div class="green-list panel-equipment-summary">
                <div class="item" v-for="key in mianbanList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ formatCalculatorNumber(zb_jc[key]) }}
                  </div>
                </div>
              </div>
            </div>


          </el-tab-pane>
          <el-tab-pane class="item-w-200" label="附魔" name="附魔">
            <div class="panel-resonance-settings">
              <el-form-item label="第一个共鸣2件套">
                <CalculatorPicker class="mb_8" v-model="formData.gm_fm_1" :options="fmOptions" title="选择第一个共鸣2件套" />
                <div class="panel-resonance-images" flex="cross:center main:center" style="width:100%;min-height:50px;">
                  <template v-if="gmFm1Selected?.image">
                    <el-image v-for="i in 2" :key="i" style="width:50px;height:50px;margin:0 auto;"
                      :src="gmFm1Selected?.image" />
                  </template>
                </div>
              </el-form-item>
              <el-form-item label="第二个共鸣2件套">
                <CalculatorPicker class="mb_8" v-model="formData.gm_fm_2" :options="fmOptions" title="选择第二个共鸣2件套" />
                <div class="panel-resonance-images" flex="cross:center main:center" style="width:100%;min-height:50px;">
                  <template v-if="gmFm2Selected?.image">
                    <el-image v-for="i in 2" :key="i" style="width:50px;height:50px;margin:0 auto;"
                      :src="gmFm2Selected?.image" alt="" />
                  </template>
                </div>
              </el-form-item>
            </div>
            <base-divider></base-divider>

            <calculator-scroll-table label="附魔属性表">
            <el-table :data="fmShowData" class="panel-edit-table" scrollbar-always-on>
              <el-table-column v-for="(item, index) in fmInputTableColumns" :key="index" :width="index === 0 ? item.width : Math.max(item.width, 152)"
                :fixed="item.fixed" :label="item.label" :prop="item.prop">
                <template #header>
                  <div class="panel-column-heading">
                    <div>{{ item.label }}</div>
                    <div v-if="item.label !== '部位'" class="panel-column-actions">
                      <el-button size="small" type="primary" plain @click.stop="set_fm_column_max(item)">点满</el-button>
                      <el-button size="small" class="panel-button-secondary" @click.stop="reset_fm_column(item)">重置</el-button>
                    </div>
                  </div>
                </template>
                <template #default="scope">
                  <template v-if="item.label === '部位'">
                    {{ scope.row.部位 }}
                  </template>
                  <template v-else>
                    <template v-if="scope.row?.部位 === '共鸣' && item.prop.indexOf('固定值') !== -1">
                      <div style="text-align: center;margin-left: -20px;">-</div>
                    </template>
                    <mz-number-input v-else style="width:100px;"
                      :disabled="scope.row?.部位 === '共鸣' || scope.row?.部位 === '总加成'" :is-percent="item.isPercent"
                      v-model="scope.row[item.prop]" :max="item.maxList?.[scope.row?.部位] || Infinity"></mz-number-input>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            </calculator-scroll-table>


          </el-tab-pane>
          <el-tab-pane label="职业精通" name="职业精通">
            <div flex="cross:top" class="panel-settings-split">
              <el-form-item style="display: unset;" label-position="top" label="职业精通是否满值">
                <el-radio-group v-model="formData.zyjt_input_can_edit">
                  <el-radio :value="false" label="默认满" />
                  <br>
                  <el-radio :value="true" label="自定义" />
                </el-radio-group>
              </el-form-item>
              <div class="panel-field-grid">
                <el-form-item v-for="(item, index) in mianbanList" :key="index" :label="item + '-职业精通'">
                  <mz-input :disabled="!formData.zyjt_input_can_edit" :prop="item" :formData="formData.zyjt"></mz-input>
                </el-form-item>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="铸纹" name="铸纹">
            <div flex="cross:top" class="panel-settings-split">
              <el-form-item class="item-w-200" style="display: unset;" :label-width="200" label-position="top"
                label="选择铸纹类型（默认满级）">
                <el-radio-group v-model="formData.zw_input_can_edit">
                  <el-radio :value="false" label="默认关联选择的英雄" />
                  <br>
                  <el-radio :value="true" label="自定义铸纹" />
                </el-radio-group>
              </el-form-item>
              <div class="panel-field-grid">
                <el-form-item v-for="(item, index) in mianbanList" :key="index" :label="item + '-铸纹'">
                  <mz-input :disabled="!formData.zw_input_can_edit" :prop="item" :formData="formData.zw"></mz-input>
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="神契" name="神契">
            <div flex>
              <div class="panel-width-block" style="width:400px;">
                <div class="error mb_16" style="font-size: 20px;">
                  请提前在「神契设置区」设置好神契
                </div>
                <el-form-item style="width:100%;" label="请选择神契">
                  <CalculatorPicker v-model="formData.selected_sq" :options="carriedCovenantPickerOptions" title="选择神契" clearable />
                </el-form-item>
                <el-form-item label=" ">
                  <el-image v-if="sq_slsb_dict[formData.selected_sq]?.image" style="display: block;width:100px;height:100px;"
                    :src="sq_slsb_dict[formData.selected_sq]?.image" alt="" />
                </el-form-item>
              </div>
              <div class="green-list" style="max-width:400px;">
                <div class="item" v-for="key in sqGudingList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ formatCalculatorNumber(sq_zjc[key]) }}
                  </div>
                </div>
                <div class="item" v-for="key in sqPercentList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ formatCalculatorPercent(sq_zjc[key]) }}
                  </div>
                </div>
              </div>
            </div>


          </el-tab-pane>
          <el-tab-pane label="圣镜" name="圣镜">
            <div flex="cross:top" class="panel-settings-split">
              <div>
                <el-form-item style="display: unset;" label-position="top" label="圣镜是否满值">
                  <el-radio-group v-model="formData.sjjc_input_can_edit">
                    <el-radio :value="false" label="默认满" />
                    <br>
                    <el-radio :value="true" label="自定义" />
                  </el-radio-group>
                </el-form-item>
                <el-button style="display: block;" v-if="formData.sjjc_input_can_edit" type="primary" @click="setSJJCToZero">
                  设置成0
                </el-button>
              </div>
              <div>
                <div v-if="configData.showHero" class="panel-field-grid">
                  <el-form-item label-width="200px" v-for="(item, key) in sjjc_yx_max" :key="key" :label="key+'(最大值'+formatCalculatorNumber(item)+')'">
                    <mz-number-input style="width:100px;"
                                     :disabled="!formData.sjjc_input_can_edit"
                                     v-model="formData.sjjc[key]" :max="(item||item===0)?item:Infinity"></mz-number-input>
                  </el-form-item>
                </div>

                <div v-if="configData.showSoldier" class="panel-field-grid">
                  <el-form-item label-width="200px" v-for="(item, key) in sjjc_sb_max" :key="key" :label="key+'(最大值'+formatCalculatorPercent(item)+')'">
                    <mz-number-input style="width:100px;"
                                     :disabled="!formData.sjjc_input_can_edit"
                                     :is-percent="true"
                                     v-model="formData.sjjc[key]" :max="(item||item===0)?item*100:Infinity"></mz-number-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="绿字总加成" name="绿字总加成">
            <div class="green-list" style="max-width:400px;">
              <div class="item" v-for="(item, key) in lz" :key="key">
                <div class="label" style="width:100px;">
                  {{ key }}
                </div>
                <div class="value">
                  +{{ formatCalculatorNumber(item) }}
                </div>
              </div>
            </div>

          </el-tab-pane>
        </el-tabs>

      </CalculatorSection>
      <el-card v-show="configData.showSoldier&&!configData.showHero" id="panel-soldier-boost" data-calculator-section="士兵加成设置" class="mb_16">
        <template #header>
          士兵加成设置
        </template>

        <el-tabs model-value="神契" style="min-height: 300px;">
          <el-tab-pane label="神契" name="神契">
            <div flex>
              <div class="panel-width-block" style="width:400px;">
                <div class="error mb_16" style="font-size: 20px;">
                  请提前在「神契设置区」设置好神契
                </div>
                <el-form-item style="width:100%;" label="请选择神契">
                  <CalculatorPicker v-model="formData.selected_sq" :options="carriedCovenantPickerOptions" title="选择神契" clearable />
                </el-form-item>
                <el-form-item label=" ">
                  <el-image v-if="sq_slsb_dict[formData.selected_sq]?.image" style="display: block;width:100px;height:100px;"
                       :src="sq_slsb_dict[formData.selected_sq]?.image" alt="" />
                </el-form-item>
              </div>
              <div class="green-list" style="max-width:400px;">
                <div class="item" v-for="key in sqGudingList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ formatCalculatorNumber(sq_zjc[key]) }}
                  </div>
                </div>
                <div class="item" v-for="key in sqPercentList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ formatCalculatorPercent(sq_zjc[key]) }}
                  </div>
                </div>
              </div>
            </div>


          </el-tab-pane>
          <el-tab-pane label="圣镜" name="圣镜">
            <div flex="cross:top" class="panel-settings-split">
              <div>
                <el-form-item style="display: unset;" label-position="top" label="圣镜是否满值">
                  <el-radio-group v-model="formData.sjjc_input_can_edit">
                    <el-radio :value="false" label="默认满" />
                    <br>
                    <el-radio :value="true" label="自定义" />
                  </el-radio-group>
                </el-form-item>
                <el-button style="display: block;" v-if="formData.sjjc_input_can_edit" type="primary" @click="setSJJCToZero">
                  设置成0
                </el-button>
              </div>
              <div>
                <div v-if="configData.showHero" class="panel-field-grid">
                  <el-form-item v-for="(item, key) in sjjc_yx_max" :key="key" :label="key">
                    <mz-number-input style="width:100px;"
                                     :disabled="!formData.sjjc_input_can_edit"
                                     v-model="formData.sjjc[key]" :max="(item||item===0)?item:Infinity"></mz-number-input>
                  </el-form-item>
                </div>

                <div v-if="configData.showSoldier" class="panel-field-grid">
                  <el-form-item v-for="(item, key) in sjjc_sb_max" :key="key" :label="key">
                    <mz-number-input style="width:100px;"
                                     :disabled="!formData.sjjc_input_can_edit"
                                     :is-percent="true"
                                     v-model="formData.sjjc[key]" :max="(item||item===0)?item*100:Infinity"></mz-number-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-card>

      <el-card v-show="configData.showHero" class="mb_16">
        <template #header>英雄绿字加成统计表</template>
        <calculator-scroll-table label="英雄绿字加成统计表" hint="左右滑动，查看其余加成">
        <el-table class="mb_16" :data="lzTotalTableData" stripe scrollbar-always-on>
          <el-table-column v-for="(item, index) in lzTotalTableColumns" :prop="item.prop" :label="item.label"
            :key="index" :min-width="index === 0 ? 80 : 112" :fixed="index === 0 ? 'left' : false">
            <template v-slot="scope" v-if="item.prop === 'fm_bfb*bz'">
              {{ round(Number(scope.row[item.prop]), 1) || '-' }}
            </template>
          </el-table-column>
        </el-table>
        </calculator-scroll-table>
        <div flex>
          <el-image v-if="currentSelectedJob" style="width:120px;height:120px;margin:16px;display:block;"
            :src="formData.selected_hero_row === '自定义英雄' ? zdyLogo : currentSelectedJob?.['英雄头像']" alt="" />
          <div style="margin-left:32px;">
            <div class="panel-result-text" v-for="key in mianbanList" :key="key">
              {{ key }}：
              {{ formatCalculatorNumber(formData.bz[key]) }}
              <span class="green panel-result-text"> + {{ formatCalculatorNumber(lz[key]) }}</span>
            </div>
          </div>
          <!-- <div class="green-list" style="max-width:400px;">
            <div class="item" style="width:300px;margin-bottom: 0;font-weight: bold;" v-for="key in mianbanList" :key="key">
              <div class="label" style="width:100px;">
                {{ key }}
              </div>
              <div class="value" flex style="gap:8px;">
                <div style="color:#333;">
                  {{ formatCalculatorNumber(formData.bz[key]) }}
                </div>
                <div>+</div>
                <div>
                  {{ formatCalculatorNumber(lz[key]) }}
                </div>
              </div>
            </div>
          </div> -->
        </div>

      </el-card>

      <el-card v-show="configData.showHero" id="panel-battle-settings" data-calculator-section="英雄战场设置" class="mb_16">
        <template #header>
          英雄战场面板模拟
        </template>

        <div flex class="panel-card-pair" style="gap:16px;">
          <el-card>
            <template #header>
              英雄的白+绿面板
            </template>
            <div class="panel-width-block" style="width: 500px;">
              <el-checkbox class="mb_16" v-model="formData.sdsr_pd"
                label="关联以上英雄模拟结果"></el-checkbox>
              <p class="calculator-field-help">取消勾选后，可手动输入白字与绿字合计。</p>
              <br>
              <template v-for="(item, index) in mianbanList" :key="index">
                <el-form-item :label="item">
                  <mz-input :disabled="formData.sdsr_pd" :prop="item" :form-data="formData.bjl"></mz-input>
                </el-form-item>
                <br>
              </template>
            </div>
          </el-card>
          <el-card>
            <template #header>
              英雄竞技精通区
            </template>
            <div class="panel-width-block" style="width:500px;">
              <el-checkbox class="mb_16" v-model="formData.jjjt_sfm" label="竞技精通满值"></el-checkbox>
              <p class="calculator-field-help">取消勾选后，可手动输入竞技精通。</p>
              <br>
              <template v-for="(item, index) in mianbanList" :key="index">
                <el-form-item :label="item">
                  <mz-input :disabled="formData.jjjt_sfm" :prop="item" :form-data="formData.jjjt"></mz-input>
                </el-form-item>
                <br>
              </template>
            </div>
          </el-card>
        </div>

      </el-card>

      <el-card v-show="configData.showHero" id="panel-hero-bonuses" data-calculator-section="英雄战场加成" class="mb_16">
        <el-form-item label="是否竞技场">
          <el-radio-group v-model="formData.jjc_pd">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-width="200" class="item-w-300" label="是否开启超绝特效">
          <el-radio-group v-model="formData.cj_pd">
            <el-radio :value="false">未开启</el-radio>
            <el-radio :value="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-width="200" class="item-w-300" label="部队血量情况">
          <el-radio-group v-model="formData.bdxl_pd">
            <el-radio value="满血">满血</el-radio>
            <el-radio value="80%以上但未满血">80%以上但未满血</el-radio>
            <el-radio value="50%以上但80%以下">50%以上但80%以下</el-radio>
            <el-radio value="50%以下">50%以下</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-table :data="zc_jc_tableData">
          <el-table-column v-for="(item,index) in zc_jc_Tablecolumn" :key="index" :prop="item.prop" :label="item.label"
                           :fixed="item.fixed" :width="item.width">
            <template #default="scope">
              <template v-if="item.label==='装备特效'">
                <ShowUp :value="zb_tx_data[scope.row.prop]" :isPercent="true"></ShowUp>
              </template>
              <template v-else-if="item.label==='超绝特效'">
                <ShowUp :value="cjtx[scope.row.prop]" :isPercent="true"></ShowUp>
              </template>
              <template v-else-if="item.label==='附魔共鸣'">
                <mz-percent-input v-if="!formData.sdsr_pd&&scope.row.prop" :prop="scope.row?.prop"
                                  :formData="formData.fm4jc"></mz-percent-input>
                <ShowUp v-else :value="formData.fm4jc?.[scope.row.prop]" :isPercent="true"></ShowUp>
              </template>
              <template v-else-if="item.label==='铸纹特效'">
                <mz-percent-input v-if="(!formData.sdsr_pd || !formData.selected_job || formData.selected_job==='自定义') &&scope.row.prop" :prop="scope.row?.prop"
                                  :formData="formData.zwtxjc"></mz-percent-input>
                <ShowUp v-else :value="formData.zwtxjc?.[scope.row.prop]" :isPercent="true"></ShowUp>
              </template>
              <template v-else-if="item.label==='战场其他加成（手输）'">
                <mz-percent-input :prop="scope.row.prop" :formData="formData.zc_qt_jc"></mz-percent-input>
              </template>
              <template v-else-if="item.label==='总加成'">
                <ShowUp :value="scope.row.total" :isPercent="true"></ShowUp>
              </template>
              <template v-else>
                {{ scope.row.prop }}
              </template>
            </template>
          </el-table-column>
        </el-table> -->

        <el-tabs model-value="装备特效">
          <el-tab-pane v-for="item in zc_jc_Tablecolumn.filter(i => i.label.trim() && i.label !== '总加成')" :key="item.label"
            :name="item.label" :label="item.label">
            <div flex="main:left" class="panel-bonus-layout">
              <div style="flex: 1;">
                <div class="mb_16 panel-detail-heading">{{ item.label }}</div>

                <div class="panel-bonus-details">
                  <!-- 添加装备特效展示区域 -->
                  <template v-if="item.label === '装备特效'">
                    <div class="panel-effect-descriptions">
                      <div v-for="(wq, key) in wqSelectedObj" :key="key" class="mb_16">
                        <div flex="cross:center" class="mb_8">
                          <el-image v-if="wq?.picAddr" :src="wq.picAddr"
                            style="width: 40px;height:auto; margin-right: 8px;" />
                          <div class="panel-detail-heading">{{ key }}：{{ wq?.装备名称 }}</div>
                        </div>
                        <div>特效：<span class="orange">{{ wq?.specialEffects }}</span></div>
                      </div>
                    </div>
                  </template>
                  <div class="panel-bonus-values">
                    <div v-for="row in zc_jc_tableData" :key="row.prop" class="mb_16">
                      <div flex="cross:center">
                        <span style="width: 100px;">{{ row.prop }}：</span>
                        <template v-if="item.label === '装备特效'">
                          <ShowUp :value="zb_tx_data[row.prop]" :isPercent="true"></ShowUp>
                        </template>
                        <template v-else-if="item.label === '超绝特效'">
                          <ShowUp :value="cjtx[row.prop]" :isPercent="true"></ShowUp>
                        </template>
                        <template v-else-if="item.label === '附魔共鸣'">
                          <mz-percent-input v-if="!formData.sdsr_pd && row.prop" :prop="row.prop"
                            :formData="formData.fm4jc"></mz-percent-input>
                          <ShowUp v-else :value="formData.fm4jc?.[row.prop]" :isPercent="true"></ShowUp>
                        </template>
                        <template v-else-if="item.label === '铸纹特效'">
                          <mz-percent-input
                            v-if="(!formData.sdsr_pd || !formData.selected_job || formData.selected_job === '自定义') && row.prop"
                            :prop="row.prop" :formData="formData.zwtxjc"></mz-percent-input>
                          <ShowUp v-else :value="formData.zwtxjc?.[row.prop]" :isPercent="true"></ShowUp>
                        </template>
                        <template v-else-if="item.label === '战场其他加成（手输）'">
                          <mz-percent-input :prop="row.prop" :formData="formData.zc_qt_jc"></mz-percent-input>
                        </template>
                        <template v-else-if="item.label === '总加成'">
                          <ShowUp :value="row.total" :isPercent="true"></ShowUp>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- 总加成固定在右侧 -->
              <div class="panel-bonus-total" style="width: 200px; margin-left: 24px; border-left: 1px solid #eee; padding-left: 24px;">
                <div class="mb_16 panel-detail-heading">总加成</div>
                <div v-for="row in zc_jc_tableData" :key="row.prop" class="mb_16">
                  <div flex="main:justify cross:center">
                    <span style="width: 100px;">{{ row.prop }}：</span>
                    <ShowUp :value="row.total" :isPercent="true"></ShowUp>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-card>

      <el-card v-show="configData.showHero" class="mb_16">
        <el-collapse>
          <el-collapse-item title="是否存在 攻转防 防转攻" name="1">
            <div flex style="gap:8px;">
              <div class="panel-width-block" style="width:400px;">
                <el-form-item>
                  <el-checkbox v-model="formData.zh_pd_fj" label="增加到某属性"></el-checkbox>
                </el-form-item>

                <div v-if="formData.zh_pd_fj">
                  <template v-for="(item, index) in fz_list" :key="index">
                    <el-form-item>
                      <el-checkbox v-model="formData[item.zhKey]" :label="item.prop + '进行转换'"></el-checkbox>
                    </el-form-item>
                    <br>
                    <el-card class="mb_8" v-if="formData[item.zhKey]">
                      <template v-for="(mbItem, mbIndex) in mianbanList.filter(i => i !== item.prop)" :key="mbIndex">
                        <el-form-item label-width="140" :label="item.prop + '转化' + mbItem + '系数'">
                          <mz-percent-input :prop="mbItem" :formData="formData[item.zhValueKey]"></mz-percent-input>
                        </el-form-item>
                        <br>
                      </template>
                    </el-card>

                  </template>
                </div>
              </div>

              <div class="panel-width-block" style="width:400px;">
                <el-form-item>
                  <el-checkbox v-model="formData.zh_pd_dt" label="代替某属性"></el-checkbox>
                </el-form-item>

                <div v-if="formData.zh_pd_dt">
                  <template v-for="(item, index) in fz_list" :key="index">
                    <el-form-item>
                      <el-checkbox v-model="formData[item.tdKey]" :label="item.prop + '进行代替'"></el-checkbox>
                    </el-form-item>
                    <br>
                    <el-card class="mb_8" v-if="formData[item.tdKey]">
                      <template v-for="(mbItem, mbIndex) in mianbanList.filter(i => i !== item.prop)" :key="mbIndex">
                        <el-form-item label-width="140" :label="item.prop + '代替' + mbItem + '系数'">
                          <mz-percent-input :prop="mbItem" :formData="formData[item.tdValueKey]"></mz-percent-input>
                        </el-form-item>
                        <br>
                      </template>
                    </el-card>

                  </template>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card v-show="configData.showHero" id="panel-hero-result" data-calculator-section="英雄战场结果" data-calculator-result class="mb_16 panel-final-card">
        <template #header>
          <div class="panel-result-heading">
            <h2>英雄的战场面板</h2>
          </div>
        </template>
        <CalculatorInputNotice />
        <div class="panel-final-grid">
          <div class="panel-hero-identity">
            <div class="panel-final-metric" data-stat="生命">
              <span class="panel-stat-label">生命：</span>
              <show-up class="panel-stat-value" :value="yx_zdmb_zz['生命']"
                :show-class="(zd_zjc['生命'] > 0 || yx_sx_zhl['生命'] != 0) ? 'up' : zd_zjc['生命'] < 0 ? 'down' : ''"></show-up>
            </div>
            <el-image v-if="currentSelectedJob" class="panel-hero-avatar"
              :src="formData.selected_hero_row === '自定义英雄' ? zdyLogo : currentSelectedJob?.['英雄头像']" alt="" />
          </div>
          <div class="panel-final-metric" v-for="key in ['攻击', '智力', '防御', '魔防', '技巧']" :key="key" :data-stat="key">
            <span class="panel-stat-label">{{ key }}：</span>
            <show-up class="panel-stat-value" :value="yx_zdmb_zz[key]"
              :show-class="(zd_zjc[key] > 0 || yx_sx_zhl[key] != 0) ? 'up' : zd_zjc[key] < 0 ? 'down' : ''"></show-up>
          </div>
        </div>

        <el-divider />
        <div class="panel-heart-effects">
          <h3>英雄大心效果</h3>
          <div class="mt_8">
            心之羁绊4：<span class="orange">{{ currentSelectedJob?.['心之羁绊4'] }}</span>
          </div>
          <div class="mt_8">
            心之羁绊7：<span class="orange">{{ currentSelectedJob?.['心之羁绊7'] }}</span>
          </div>
        </div>
      </el-card>

      <el-card v-show="configData.showSoldier" id="panel-soldier" data-calculator-section="士兵选择" class="mb_16">
        <template #header>
          士兵初始值区
        </template>
        <div>
          <CalculatorPicker v-model="formData.selected_sb_names" :options="soldierPickerOptions" title="选择士兵"
            placeholder="请选择士兵" cascader />
          <div style="display: flex;">
            <div class="mt_16" style="width:150px;display: flex;align-items: center;flex-direction: column;">
              <el-image style="width:100%;height:auto;" :src="sb_selected_row?.['图片地址']" alt="" />
              <div class="panel-identity-caption">
                {{ sb_selected_row?.["士兵名"] }}
              </div>
            </div>

            <div class="ml_24">
              <h3>
                生命：{{ formatCalculatorNumber(formData?.sb_cs?.["生命"]) }}
              </h3>
              <h3>
                攻击：{{ formatCalculatorNumber(formData?.sb_cs?.["攻击"]) }}
              </h3>
              <h3>
                防御：{{ formatCalculatorNumber(formData?.sb_cs?.["防御"]) }}
              </h3>
              <h3>
                魔防：{{ formatCalculatorNumber(formData?.sb_cs?.["魔防"]) }}
              </h3>
            </div>
          </div>

          <div class="mt_24 panel-soldier-description">
            <div>
              士兵等级：<span class="orange">{{ sb_selected_row?.["等级"] }}</span>
            </div>
            <div>
              满级士兵技能：<span class="orange">{{ sb_selected_row?.["满级技能"] }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card v-show="configData.showSoldier" class="mb_16">
        <template #header>
          士兵神契加成区

        </template>
        <div>
          <div class="error mb_16">
            请提前在「神契设置区」设置好神契
          </div>
          <el-form-item label="">
            <el-checkbox v-model="formData.sbsq_sdsr_pd" label="关联神契设置区加成"></el-checkbox>
          </el-form-item>
          <p class="calculator-field-help">取消勾选后，可手动输入士兵神契加成。</p>
          <div class="panel-width-block panel-field-grid" style="width:1000px;">
            <el-form-item label-width="180px" v-for="(item, index) in ['士兵生命', '士兵攻击', '士兵防御', '士兵魔防']" :key="index"
              :label="item + (!formData.sbsq_sdsr_pd ? '最大值24%' : '')">
              <mz-percent-input :disabled="formData.sbsq_sdsr_pd" :prop="item"
                :form-data="formData.sb_sq_jc"></mz-percent-input>
            </el-form-item>
          </div>

        </div>
      </el-card>

      <el-card v-show="configData.showSoldier" class="mb_16">
        <template #header>
          英雄兵修区
        </template>
        <div>
          <el-form-item label="">
            <el-checkbox v-model="formData.yxbx_sdsr_pd" label="关联以上英雄兵修"></el-checkbox>
          </el-form-item>
          <p class="calculator-field-help">取消勾选后，可手动输入英雄兵修。</p>
          <br>
          <el-form-item label="">
            <el-checkbox v-model="formData.yxbx_sffmxh_pd" label="「薪火」附魔"></el-checkbox>
          </el-form-item>
          <div class="panel-width-block panel-wide-row" v-if="formData.yxbx_sdsr_pd && formData.selected_hero_row !== '自定义英雄'"
            style="width:1000px;display: flex;">
            <div style="width:90px;margin-top: 24px;">
              <el-image style="width:100%;height:auto;display:block;" :src="formData.selected_hero_row === '自定义英雄' ? zdyLogo : currentSelectedJob?.['英雄头像']" alt="" />
              <div class="panel-identity-caption" style="text-align: center;">
                {{ currentSelectedJob?.['英雄名'] }}
              </div>
            </div>
            <div style="margin-left: 60px;">
              <h3 v-for="(item, index) in ['兵修生命', '兵修攻击', '兵修防御', '兵修魔防']" :key="index">
                {{ item }}：<strong class="green">{{ round(formData.yx_bx_jc_yx?.[item] * 100) }}%</strong>
                <strong v-if="formData.yxbx_sffmxh_pd" class="green">+{{ round(0.05 * 100) }}%</strong>
              </h3>
            </div>
          </div>
          <div class="panel-width-block panel-field-grid" v-else style="width:1000px;">
            <el-form-item label-width="180px" v-for="(item, index) in ['兵修生命', '兵修攻击', '兵修防御', '兵修魔防']" :key="index"
              :label="item">
              <mz-percent-input style="width:150px;" :prop="item" :form-data="formData.yx_bx_jc_yx"></mz-percent-input>
              <strong v-if="formData.yxbx_sffmxh_pd" class="green">+{{ round(0.05 * 100) }}%</strong>
            </el-form-item>
          </div>


        </div>
      </el-card>

      <el-card v-show="configData.showSoldier" class="mb_16">
        <template #header>
          士兵白字区
        </template>
        <div class="panel-width-block panel-wide-row" style="width:1000px;display: flex;">
          <div style="width:90px;">
            <el-image style="width:100%;height:auto;display:block;" :src="formData.selected_hero_row === '自定义英雄' ? zdyLogo : currentSelectedJob?.['英雄头像']" alt="" />
            <div class="panel-identity-caption" style="text-align: center;">
              {{ currentSelectedJob?.['英雄名'] }}
            </div>
          </div>
          <div style="width:130px;">
            <el-image style="width:100%;height:auto;display:block;margin-right: 16px;" :src="sb_selected_row?.['图片地址']" alt="" />
            <div class="panel-identity-caption" style="text-align: center;">
              {{ sb_selected_row?.['士兵名'] }}
            </div>
          </div>
          <div style="margin-left: 60px;">
            <div class="panel-result-text" v-for="(item, key) in sb_bz" :key="key">
              {{ key }}：
              {{ round(item, 2) }}
              <span class="green panel-result-text"> + {{ round(sb_bz[key] * formData.yx_bx_jc?.['兵修' + key], 2)
              }}（{{ round(formData.yx_bx_jc?.["兵修" + key] * 100) }}%）</span>
            </div>
          </div>
        </div>

      </el-card>

      <el-card v-show="configData.showSoldier" id="panel-soldier-bonuses" data-calculator-section="士兵战场加成" class="mb_16">
        <div class="panel-width-block panel-wide-row" style="width:1000px;display: flex;">
          <div class="panel-width-block" style="width:400px;">
            <el-form-item label-width="140" label="是否竞技场">
              <el-radio-group v-model="formData.sbjjc_pd">
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <br>
            <el-form-item label-width="140" label="是否开启超绝特效">
              <el-radio-group v-model="formData.sbcj_pd">
                <el-radio :value="false">未开</el-radio>
                <el-radio :value="true">开</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 分割线 -->
            <el-divider />

            <h3>{{ sb_selected_row?.['兵种'] }}可用科技</h3>

            <template v-for="(item) in unit_techs" :key="item.科技名称">
              <el-checkbox v-model="formData.selected_kj[item.科技名称]" :label="item.科技名称"></el-checkbox>
              <div class="orange">
                {{ item.科技效果 }}
              </div>
              <br>
            </template>

          </div>

          <div class="ml_24 panel-width-block" style="width:400px;">
            <h3>
              战场其他加成
            </h3>
            <div>
              说明：<span class="error">所有需要人为判断的加成，需要细细盘点不要遗漏。士兵技能请人为考虑</span>
            </div>
            <el-image class="mt_8" style="width:80px;height:auto;" :src="sb_selected_row?.图片地址" alt="" />

            <div>
              满级士兵技能：<span class="orange">{{ sb_selected_row?.['满级技能'] }}</span>
            </div>

            <el-tabs model-value="面板加成" style="min-height: 300px;">
              <el-tab-pane label="面板加成" name="面板加成">
                <el-form-item v-for="(item, index) in ['生命', '攻击', '防御', '魔防']" :key="index" :label="item">
                  <mz-percent-input :prop="item" :form-data="formData.sb_bztx_qtjc"></mz-percent-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="克制加成" name="克制加成">
                <el-form-item v-for="(item, index) in ['生命克制修正', '攻击克制修正', '智力克制修正', '防御克制修正', '魔防克制修正']" :key="index"
                  :label="item">
                  <mz-percent-input :prop="item" :form-data="formData.sb_bztx_qtjc"></mz-percent-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-card>

      <el-card v-show="configData.showSoldier" class="mb_16">
        <template #header>
          士兵战场总加成
        </template>
        <div class="panel-width-block panel-result-text panel-wide-row panel-soldier-bonuses" style="width:1000px;display: flex;font-size: 25px;">
          <div class="panel-width-block" style="width:400px;">
            <div style="display: flex;" v-for="(item, index) in ['生命', '攻击', '防御', '魔防']" :key="index">
              {{ item }}：<ShowUp :value="sb_zd_zjc[item]" :isPercent="true"></ShowUp>
            </div>
          </div>
          <div class="panel-width-block" style="width:400px;">
            <div style="display: flex;" v-for="(item, index) in ['生命克制修正', '攻击克制修正', '智力克制修正', '防御克制修正', '魔防克制修正']"
              :key="index">
              {{ item }}：<ShowUp :value="sb_zd_zjc[item]" :isPercent="true"></ShowUp>
            </div>
          </div>
        </div>
      </el-card>

      <el-card v-show="configData.showSoldier" id="panel-soldier-result" data-calculator-section="士兵战场结果" data-calculator-result class="mb_16 panel-final-card">
        <template #header>
          <div class="panel-result-heading"><h2>士兵战场面板</h2></div>
        </template>
        <div class="panel-soldier-result">
        <CalculatorInputNotice />
        <div class="panel-result-identities">
            <div class="panel-result-identity panel-result-identity--soldier">
              <el-image class="panel-result-avatar" :src="sb_selected_row?.['图片地址']" alt="" />
              <div class="panel-result-identity-copy">
                <span class="panel-result-role">当前士兵</span>
                <strong class="panel-result-name">{{ sb_selected_row?.['士兵名'] || '请选择士兵' }}</strong>
              </div>
            </div>
            <div class="panel-result-identity panel-result-identity--hero">
              <span class="panel-result-role">搭配英雄</span>
              <el-image class="panel-result-avatar" :src="formData.selected_hero_row === '自定义英雄' ? zdyLogo : currentSelectedJob?.['英雄头像']" alt="" />
              <span class="panel-result-name">{{ currentSelectedJob?.['英雄名'] || formData.selected_hero_row || '未选择英雄' }}</span>
            </div>
          </div>

          <div class="panel-soldier-result-content">
            <el-tabs model-value="不考虑克制" style="min-height: 300px;">
              <el-tab-pane class="panel-formula-list" label="不考虑克制" name="不考虑克制">
                <div class="panel-formula-row"
                  v-for="(item, index) in ['生命', '攻击', '防御', '魔防']" :key="index">
                  <span class="panel-stat-label">{{ item }}：</span>
                  <ShowUp class="panel-formula-detail" :judgeValue="sb_zd_zjc[item]" :isPercent="false">
                    {{ round(sb_zdmb[item], 1) }} <span>+ {{
                      round(sb_zdmb[item] * formData.yx_bx_jc["兵修" + item], 1)
                      }}（{{ round(formData.yx_bx_jc["兵修" + item] * 100) }}%）</span>
                  </ShowUp>
                  <strong class="panel-formula-total">= {{ round(sb_zdmb[item] * (1 + Number(formData.yx_bx_jc["兵修" + item])), 1) }}</strong>
                </div>
              </el-tab-pane>
              <el-tab-pane label="考虑克制" name="考虑克制">
                <div class="panel-restraint-results">
                  <div class="panel-restraint-row">
                    <span class="panel-stat-label">生命：</span><strong class="panel-stat-value">{{ round(sb_zdmb_klkz["生命"], 1) }}</strong> <span class="panel-restraint-detail">（克制加成{{
                      round(sb_zd_zjc["生命克制修正"] * 100) }}%）</span>
                  </div>
                  <div class="panel-restraint-row">
                    <span class="panel-stat-label">物理攻击：</span><strong class="panel-stat-value">{{ round(sb_zdmb_klkz["物理攻击"], 1) }}</strong> <span class="panel-restraint-detail">（克制加成{{
                      round(sb_zd_zjc["攻击克制修正"] * 100) }}%）</span>
                  </div>
                  <div class="panel-restraint-row">
                    <span class="panel-stat-label">魔法攻击：</span><strong class="panel-stat-value">{{ round(sb_zdmb_klkz["魔法攻击"], 1) }}</strong> <span class="panel-restraint-detail">（克制加成{{
                      round(sb_zd_zjc["智力克制修正"] * 100) }}%）</span>
                  </div>
                  <div class="panel-restraint-row">
                    <span class="panel-stat-label">防御：</span><strong class="panel-stat-value">{{ round(sb_zdmb_klkz["防御"], 1) }}</strong> <span class="panel-restraint-detail">（克制加成{{
                      round(sb_zd_zjc["防御克制修正"] * 100) }}%）</span>
                  </div>
                  <div class="panel-restraint-row">
                    <span class="panel-stat-label">魔防：</span><strong class="panel-stat-value">{{ round(sb_zdmb_klkz["魔防"], 1) }}</strong><span class="panel-restraint-detail">（克制加成{{
                      round(sb_zd_zjc["魔防克制修正"] * 100) }}%）</span>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-card>



    </el-form>

    <calculator-guide id="panel-guide" data-calculator-section="使用说明">
      <div class="ddjsq-guide-notes"><p>此计算器搬运了墨源的梦战伤害计算器，一切版权均属于墨源。手机版本可在微信小程序搜“梦战伤害计算器”。</p></div>
    </calculator-guide>

    <!-- 添加回到顶部按钮 -->

    <!-- 添加缓存名称输入弹窗 -->
    <el-dialog v-model="saveDialogVisible" title="保存英雄数据" width="30%" class="calculator-cache-dialog">
      <el-form>
        <el-form-item label="缓存名称">
          <el-input v-model="cacheName" placeholder="请输入缓存名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="saveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSaveCache">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加选择缓存弹窗 -->
    <el-dialog v-model="loadDialogVisible" title="选择英雄数据" width="30%" class="calculator-cache-dialog">
      <el-table :data="cacheList" style="width: 100%">
        <el-table-column property="name" label="缓存名称">
          <template #default="scope">
            <div flex="cross:center">
              <el-image v-if="scope.row.data?.selected_hero_row" style="width:30px;height:30px;margin-right:8px;"
                :src="getHeroAvatar(scope.row.data)" />
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="useCache(scope.row)">使用</el-button>
            <el-button size="small" type="danger" @click="deleteCache(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>



  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, watchEffect } from 'vue'
import CalculatorGuide from '@/components/calculator-guide.vue'
import CalculatorScrollTable from '@/components/calculator-scroll-table.vue'
import CalculatorSection from '@/components/calculator-section.vue'
import CalculatorPicker from '@/components/calculator-picker.vue'
import CalculatorInputNotice from '@/components/calculator-input-notice.vue'
import { useCalculatorInputState } from '@/common/calculator-input-state'
useCalculatorInputState()
import { Collection, Connection, Download, FolderOpened, MagicStick, RefreshLeft, Upload, User } from '@element-plus/icons-vue'
import Big from 'big.js'
import { formatCalculatorNumber, formatCalculatorPercent } from '@/common/calculator-display.mjs'
import { useRefCache } from "../common/hook";
import {
  calculateFormula,
  exportExcelFun,
  importExcelFun,
  parseCSVToObjects,
  round,
  selectExcelFile
} from "../common/utils";
import MzPercentInput from "@/components/element-comp/mz-percent-input.vue";
import MzInput from "@/components/element-comp/mz-input.vue";
import ShowUp from '@/pages/components/show-up.vue'
import EquipDetail_schema from '@/static/data/EquipDetail_schema.json'
import Soldier_schema from '@/static/data/Soldier_schema.json'
import SoldierTechnology_schema from '@/static/data/SoldierTechnology_schema.json'
import { ElMessageBox, ElMessage } from "element-plus";
import {
  sq_slsb_table,
  sq_slsb_table_columns,
  sq_slsb_dict,
  getResourceUrl,
  fmOptions,
  defaultFmInput,
  fmInputTableColumns, mianbanList, mianbanDefault, getImageUrl
} from "@/common/constant";
import _ from 'lodash'
import BaseDivider from "@/components/base-divider.vue";
// import zbData from '../static/data/梦战装备满级基础属性分类.csv?raw'
import MzNumberInput from "@/components/element-comp/mz-number-input.vue";
import { nocodb, NOCODB_TABLES } from '@/api/nocodb'
import zdyLogo from '@/static/image/自定义英雄头像.png'
import zdyZY from '@/static/image/自定义职业图标.png'
// import sbFileData from '../static/data/梦战士兵数据.csv?raw'
// import sbKjFileData from '../static/data/梦战士兵科技数据.csv?raw'

const prefix = "langrissar-calculator-mbjs-el-"
const heroList = useRefCache(`${prefix}heroList`, [])
const zbObj = useRefCache(`${prefix}zbObj`, {})
const df3 = useRefCache(`${prefix}df3`, [])
const df4 = useRefCache(`${prefix}df4`, [])
const configData = useRefCache(`${prefix}configData`, {
  showHero: true,
  showSoldier: true,
})

// 获取英雄基础属性数据（NocoDB）
const getHeroData = async () => {
  // 为了处理合并跟墨佬的命名一致
  // 英雄名,职业名,生命,攻击,智力,防御,魔防,技巧,铸纹生命,铸纹攻击,铸纹智力,铸纹防御,铸纹魔防,铸纹技巧,英雄头像
  // heroName	occupation	life	attack	intelligence	defense	magicDefense	skill	zwLife	zwAttack	zwIntelligence	zwDefense	zwMagicDefense	zwSkill	logo

  const heroKeyMap = {
    "heroName": "英雄名",
    "occupation": "职业名",
    "lifeXs": "生命",
    "attackXs": "攻击",
    "intelligenceXs": "智力",
    "defenseXs": "防御",
    "magicDefenseXs": "魔防",
    "skillXs": "技巧",
    "zwLife": "铸纹生命",
    "zwAttack": "铸纹攻击",
    "zwIntelligence": "铸纹智力",
    "zwDefense": "铸纹防御",
    "zwMagicDefense": "铸纹魔防",
    "zwSkill": "铸纹技巧",
    "logo": "英雄头像",
    "zwTxLife": "铸纹特效生命",
    "zwTxAttack": "铸纹特效攻击",
    "zwTxIntelligence": "铸纹特效智力",
    "zwTxDefense": "铸纹特效防御",
    "zwTxMagicDefense": "铸纹特效魔防",
    "zwTxSkill": "铸纹特效技巧",
    "soldierLifeAdd": "兵修生命",
    "soldierAttackAdd": "兵修攻击",
    "soldierDefenseAdd": "兵修防御",
    "soldierMagicDefenseAdd": "兵修魔防",
    "fettersLv4": "心之羁绊4",
    "fettersLv7": "心之羁绊7",
    "occupationType": "职业",
  }
  try {
    const res = await nocodb.get('HeroBasicAttr')
    const heroes = res.map((item) => {
      // 判断英雄名是否叫【自定义英雄】
      if (item.heroName === '自定义英雄') {
        item.logo = zdyLogo
        item.occupationPic = zdyZY
      }

      const mapAttributes = Object.entries(item).reduce((acc, [key, value]) => {
        if (heroKeyMap[key]) {
          acc[heroKeyMap[key]] = value
        }
        return acc
      }, {})
      return {
        ...mapAttributes,
        ...item,
      }
    })

    heroList.value = Object.entries(_.groupBy(heroes, '英雄名')).map(([key, list]) => {
      return {
        "英雄名": key,
        "英雄头像": list[0]?.英雄头像,
        list: list,
      }
    })
    console.log(heroList.value)
  } catch (err) {
    console.log('查询失败', err)
  }
}

import wq_none from '@/static/image/武器未佩戴.png'
import yf_none from '@/static/image/衣服未佩戴.png'
import ts_none from '@/static/image/头饰未佩戴.png'
import sp_none from '@/static/image/饰品未佩戴.png'


// 获取装备数据（NocoDB）
const getEquipData = async () => {

  const schema = EquipDetail_schema.schema
  const EquipDetailMap = Object.keys(schema).reduce((cur, key) => {
    cur[key] = schema[key].comment
    return cur
  }, {})
  try {
    const res = await nocodb.get('equipdetail')
    const map = EquipDetailMap
    const mapItem = {
      "武器无": wq_none,
      "衣服无": yf_none,
      "头饰无": ts_none,
      "饰品无": sp_none,
    }
    const list = res.map((item) => {
      if (mapItem[item.equipName]) {
        item.picAddr = mapItem[item.equipName]
      }
      const mapAttributes = Object.entries(item).reduce((acc, [key, value]) => {
        if (map[key]) {
          acc[map[key]] = value
        }
        return acc
      }, {})

      return {
        ...mapAttributes,
        ...item,
      }
    })

    zbObj.value = _.groupBy(list, '类别')
    console.log(zbObj.value)
  } catch (err) {
    console.log('查询失败', err)
  }
}

function transformDataToCascaderFormat(data) {
  const result = {};

  const spData = []
  data.forEach(item => {
    const { 兵种, 士兵名 } = item;

    if(士兵名.includes('SP')){
      spData.push(item)
      return
    }

    if (!result[兵种]) {
      result[兵种] = {
        label: 兵种,
        value: 兵种,
        children: []
      };
    }

    result[兵种].children.push({
      label: 士兵名,
      value: 士兵名,
      ...item
    });
  });

  spData.forEach(item => {
    const { 兵种, 士兵名 } = item;
    const index = result[兵种].children.findIndex(i=> i.士兵名 === 士兵名.replace('SP', ''))
    if(index !== -1){
      result[兵种].children.splice(index, 0, {
        label: 士兵名,
        value: 士兵名,
       ...item
      })
    }
  })

  return Object.values(result);
}

// 获取表数据并按 schema 映射 key（NocoDB）
const getNocoDbDataAndMapKey = async (tableKey, schema) => {
  const Map = Object.keys(schema).reduce((cur, key) => {
    cur[key] = schema[key].comment
    return cur
  }, {})

  try {
    const res = await nocodb.get(tableKey)
    const list = res.map((item) => {
      const mapAttributes = Object.entries(item).reduce((acc, [key, value]) => {
        if (Map[key]) {
          acc[Map[key]] = value
        }
        return acc
      }, {})

      return {
        ...mapAttributes,
        ...item,
      }
    })

    return {
      list,
      Map
    }
  } catch (err) {
    console.log(`查询${tableKey}数据失败`, err);
    ElMessage.error(`查询${tableKey}数据失败`)
    return {
      list: [],
      Map: {}
    }
  }
}

const getSbData = async () => {
  // df3.value = parseCSVToObjects(sbFileData)
  const { list } = await getNocoDbDataAndMapKey('Soldier', Soldier_schema.schema)

  df3.value = list
}
const df3CascaderOptions = computed(() => {
  return transformDataToCascaderFormat(df3.value);
});

// Picker presentation only. Keep API data, model values and game ordering intact.
const heroPickerOptions = computed(() => heroList.value.map(item => ({
  value: item.英雄名, label: item.英雄名, image: item.英雄头像,
})))
const jobPickerOptions = computed(() => (currentSelectedHero.value?.list || []).map(item => ({
  value: item.职业名, label: item.职业名, image: item.occupationPic,
})))
const equipmentPickerOptions = computed(() => Object.fromEntries(Object.entries(zbObj.value).map(([key, items]) => [
  key, items.map(item => ({ value: item.装备名称, label: item.装备名称, image: item.picAddr })),
])))
const covenantPickerOptions = Object.keys(sq_slsb_dict).map(value => ({ value, label: value, image: sq_slsb_dict[value].image }))
const carriedCovenantPickerOptions = [{ value: '未携带', label: '未携带' }, ...covenantPickerOptions]
const soldierPickerOptions = computed(() => df3CascaderOptions.value.map(group => ({
  ...group, children: group.children.map(item => ({ ...item, image: item.图片地址 })),
})))
const getSbKjData = async () => {
  // df4.value = parseCSVToObjects(sbKjFileData);
  const { list } = await getNocoDbDataAndMapKey('SoldierTechnology', SoldierTechnology_schema.schema)
  df4.value = list
}

const unit_techs = computed(() => {
  return df4.value?.filter((item) => {
    return item['兵种'] === sb_selected_row.value?.['兵种']
  })
})

onMounted(() => {
  getHeroData()
  getEquipData()
  getSbData()
  getSbKjData()
  getSjjcDefaultData()
})

onMounted(() => {
  /*const zbListSource = parseCSVToObjects(zbData);
  zbObj.value = _.groupBy(zbListSource, '类别')
  console.log(zbObj.value)*/

})


const defaultJJJT = {
  "生命": 500,
  "攻击": 60,
  "智力": 60,
  "防御": 50,
  "魔防": 50,
  "技巧": 80,
}

const fz_list = [
  {
    prop: "生命",
    zhKey: "yx_sm_fj",
    zhValueKey: "yx_sm_zhxs",
    tdKey: "yx_sm_dt",
    tdValueKey: "yx_sm_dtxs",
  },
  {
    prop: "攻击",
    zhKey: "yx_gj_fj",
    zhValueKey: "yx_gj_zhxs",
    tdKey: "yx_gj_dt",
    tdValueKey: "yx_gj_dtxs",
  },
  {
    prop: "智力",
    zhKey: "yx_zl_fj",
    zhValueKey: "yx_zl_zhxs",
    tdKey: "yx_zl_dt",
    tdValueKey: "yx_zl_dtxs",
  },
  {
    prop: "防御",
    zhKey: "yx_fy_fj",
    zhValueKey: "yx_fy_zhxs",
    tdKey: "yx_fy_dt",
    tdValueKey: "yx_fy_dtxs",
  },
  {
    prop: "魔防",
    zhKey: "yx_mf_fj",
    zhValueKey: "yx_mf_zhxs",
    tdKey: "yx_mf_dt",
    tdValueKey: "yx_mf_dtxs",
  },
  {
    prop: "技巧",
    zhKey: "yx_jq_fj",
    zhValueKey: "yx_jq_zhxs",
    tdKey: "yx_jq_dt",
    tdValueKey: "yx_jq_dtxs",
  }
]

const sjjc_yx_hardcode_default = { "生命": 400, "攻击": 40, "智力": 40, "防御": 24, "魔防": 24, "技巧": 0}
const sjjc_sb_hardcode_default = { "士兵生命":0.08,"士兵攻击":0.08,"士兵防御":0.08,"士兵魔防":0.08 }
const getSjjcHardcodeDefault = () => {
  return {
    ...sjjc_yx_hardcode_default,
    ...sjjc_sb_hardcode_default,
  }
}
const defaultFormData = {
  // 选中的英雄
  selected_hero_row: "自定义英雄",
  // 选中的职业
  selected_job: "自定义",
  // 是否自定义白字
  bz_input_can_edit: false,
  // 基础白字
  bz: _.cloneDeep(mianbanDefault),  // 初始化白字 字典
  yx_wq: "无",
  yx_yf: "无",
  yx_ts: "无",
  yx_sp: "无",
  gm_fm_1: "",
  gm_fm_2: "",
  fm_input: defaultFmInput,
  zyjt_input_can_edit: false,
  zyjt: _.cloneDeep(mianbanDefault),
  zw_input_can_edit: false,
  zw: _.cloneDeep(mianbanDefault),
  selected_sq: "索尔",
  sdsr_pd: true,
  bjl: _.cloneDeep(mianbanDefault),
  jjjt_sfm: true,
  jjjt: _.cloneDeep(defaultJJJT),
  jjc_pd: true,
  bdxl_pd: "满血",
  zb_tx: _.cloneDeep(mianbanDefault),
  zc_qt_jc: _.cloneDeep(mianbanDefault),
  cj_pd: true,
  zh_pd_fj: false,
  zh_pd_dt: false,
  ...fz_list.reduce((acc, item) => {
    acc[item.zhKey] = false
    acc[item.zhValueKey] = {}
    acc[item.tdKey] = false
    acc[item.tdValueKey] = {}
    return acc
  }, {}),
  fm4jc: {},
  zwtxjc: {},
  sb_cs: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0 }, // 初始化士兵初始值 字典
  sb_sq_jc: { "士兵生命": 0, "士兵攻击": 0, "士兵防御": 0, "士兵魔防": 0 }, // 初始化士兵神契加成 字典
  yx_bx_jc_yx: { "兵修生命": 0, "兵修攻击": 0, "兵修防御": 0, "兵修魔防": 0},// 仅计算当前英雄加成
  // 是否附魔薪火 用于累加到yx_bx_jc
  yxbx_sffmxh_pd: false,
  yx_bx_jc: { "兵修生命": 0, "兵修攻击": 0, "兵修防御": 0, "兵修魔防": 0 }, // 初始英雄兵修加成 字典
  sb_bztx_qtjc: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0, "生命克制修正": 0, "攻击克制修正": 0, "智力克制修正": 0, "防御克制修正": 0, "魔防克制修正": 0 },  // 初始化士兵兵种特效及其他加成 字典
  selected_sb_names: [],
  sbsq_sdsr_pd: true,
  yxbx_sdsr_pd: true,
  sbjjc_pd: true,
  sbcj_pd: true,
  selected_kj: {},
  sjjc_input_can_edit: false,
  sjjc: _.cloneDeep(getSjjcHardcodeDefault())
};
const formData = useRefCache(`${prefix}formData`, JSON.parse(JSON.stringify(defaultFormData)))
const sjjc_default_cache = useRefCache(`${prefix}sjjc_default_cache`, _.cloneDeep(getSjjcHardcodeDefault()))
const sjjc_nocodb_default = ref({})
const sjjc_key_list = Object.keys(getSjjcHardcodeDefault())
const getMergedSjjcDefault = (firstValue = {}, secondValue = {}) => {
  const hardcodeValue = getSjjcHardcodeDefault()
  return sjjc_key_list.reduce((acc, key) => {
    acc[key] = firstValue?.[key] ?? secondValue?.[key] ?? hardcodeValue[key]
    return acc
  }, {})
}
const getResolvedSjjcDefault = () => {
  return getMergedSjjcDefault(sjjc_nocodb_default.value, sjjc_default_cache.value)
}
const sjjc_yx_max = computed(() => {
  return Object.keys(sjjc_yx_hardcode_default).reduce((acc, key) => {
    acc[key] = Number(getResolvedSjjcDefault()?.[key] ?? sjjc_yx_hardcode_default[key])
    return acc
  }, {})
})
const sjjc_sb_max = computed(() => {
  return Object.keys(sjjc_sb_hardcode_default).reduce((acc, key) => {
    acc[key] = Number(getResolvedSjjcDefault()?.[key] ?? sjjc_sb_hardcode_default[key])
    return acc
  }, {})
})
const applyResolvedSjjcDefault = () => {
  formData.value.sjjc = _.cloneDeep(getResolvedSjjcDefault())
}
const getSjjcDefaultData = async () => {
  if (!NOCODB_TABLES.HolyMirrorDefault?.tableId || !NOCODB_TABLES.HolyMirrorDefault?.viewId) {
    return
  }

  try {
    const res = await nocodb.get('HolyMirrorDefault')
    const currentData = res?.[0] || {}
    const hasData = sjjc_key_list.some((key) => currentData?.[key] !== undefined && currentData?.[key] !== null)
    sjjc_nocodb_default.value = hasData ? currentData : {}
    if (hasData) {
      sjjc_default_cache.value = getMergedSjjcDefault(currentData, sjjc_default_cache.value)
    }
    if (!formData.value.sjjc_input_can_edit) {
      applyResolvedSjjcDefault()
    }
  } catch (err) {
    console.log('查询HolyMirrorDefault数据失败', err)
  }
}
const resetFormData = () => {
  // 二次确认
  ElMessageBox.confirm('将重置英雄和士兵模拟参数。独立神契设置及已存缓存会保留。', '重置面板计算器', {
    confirmButtonText: '确认重置',
    cancelButtonText: '保留数据',
    type: 'warning',
  })
  .then(() => {
    formData.value = JSON.parse(JSON.stringify(defaultFormData))
    if (!formData.value.sjjc_input_can_edit) {
      applyResolvedSjjcDefault()
    }
  }).catch(() => {})
}

// 输入框二次转换数据
const inputVariables = computed(() => {

  return {
    ...formData.value,
  }
})

// 计算输入内容 生成需要计算的数据
const calculateVariables = computed(() => {


  return {
    ...inputVariables.value,
  }
})

watch(() => formData.value.selected_hero_row, () => {
  formData.value.selected_job = currentSelectedHero.value?.list[0].职业名
})
const currentSelectedHero = computed(() => {
  const name = formData.value.selected_hero_row
  return heroList.value.find(item => item.英雄名 === name)
})
const currentSelectedJob = computed(() => {
  const name = formData.value?.selected_job
  return currentSelectedHero.value?.list?.find(item => item.职业名 === name) || {}
})

const resetBz = () => {
  const fieldsToConvert = mianbanList;
  formData.value.bz = fieldsToConvert.reduce((acc, key) => {
    acc[key] = round(Number(currentSelectedJob.value?.[key]), 2) || 0;
    return acc;
  }, {});
}
watch(() => formData.value.selected_job, () => {
  formData.value.bz_input_can_edit = false
})
watchEffect(() => {
  if (!formData.value.bz_input_can_edit) {
    resetBz()
  }
})
const reset_zyjt = () => {
  formData.value.zyjt = { "生命": 750, "攻击": 80, "智力": 80, "防御": 60, "魔防": 60, "技巧": 80 }
}
watchEffect(() => {
  if (!formData.value.zyjt_input_can_edit) {
    reset_zyjt()
  }
})

const reset_sjjc = () => {
  applyResolvedSjjcDefault()
}
const setSJJCToZero = ()=>{
  formData.value.sjjc = sjjc_key_list.reduce((acc, key) => {
    acc[key] = 0
    return acc
  }, {})
}
watchEffect(() => {
  if (!formData.value.sjjc_input_can_edit) {
    reset_sjjc()
    // setSJJCToZero()
  }
})


const reset_zw = () => {
  const fieldsToConvert = mianbanList;
  formData.value.zw = fieldsToConvert.reduce((acc, key) => {
    acc[key] = Number(currentSelectedJob.value?.[`铸纹${key}`]);
    return acc;
  }, {});
}
watchEffect(() => {
  if (!formData.value.zw_input_can_edit) {
    reset_zw()
  }
})

// 神契晨曦加成
const sqPercentList = ["士兵生命", "士兵攻击", "士兵防御", "士兵魔防"]
const sqGudingList = ['生命', "攻击", "智力", "防御", "魔防", "技巧"]
const sqKeyList = [...sqGudingList, ...sqPercentList]
const getDefaultSqValue = () => {
  return sqKeyList.reduce((acc, key) => {
    acc[key] = 0
    return acc
  }, {})
}
const sq_cxzz = useRefCache(`${prefix}sq_cxzz`, getDefaultSqValue())

const sqExcelOption = sqKeyList.map((item) => {
  return {
    label: item,
    key: item,
  }
})
const reset_sq_cxzz = async () => {
  try {
    await ElMessageBox.confirm('将清空晨曦之祝各项加成。是否继续？', '重置神契加成', {
      confirmButtonText: '确认重置', cancelButtonText: '保留数据', type: 'warning',
    })
    sq_cxzz.value = getDefaultSqValue()
  } catch { /* Keep the existing values when cancelled. */ }
}
const set_sq_cxzz_max = () => {
  const maxMap = sq_slsb_table_columns.reduce((acc, col) => {
    if (col?.prop && col.prop !== "名称" && col.max !== undefined) {
      const raw = Number(col.max)
      const v = col.isPercent ? raw / 100 : raw
      acc[col.prop] = Number.isFinite(v) ? v : 0
    }
    return acc
  }, {})

  sq_cxzz.value = sqKeyList.reduce((acc, key) => {
    acc[key] = Number(maxMap[key] ?? 0)
    return acc
  }, {})
}
const export_sq_cxzz = () => {
  exportExcelFun({
    data: [sq_cxzz.value],
    exportOption: sqExcelOption,
    sheetName: "Sheet1",
    bookName: "神契晨曦之祝加成",
  });
}
const import_sq_cxzz = () => {
  selectExcelFile()
    .then((file) => {
      importExcelFun({
        file: file,
        importOption: sqExcelOption,
        sheetName: 'Sheet1',
      })
        .then((data) => {
          sq_cxzz.value = data[0]
        })
    })
    .catch(() => {
      ElMessage.error('导入失败')
    })
}
// 设置筛选的数据
const sq_filter_data = useRefCache(`${prefix}sq_filter_data`, [])
const sqAllTableData = computed(() => {
  const table = [
    {
      "名称": "神契晨曦之祝加成",
    },
  ]
  sq_slsb_table.forEach((item) => {
    table.push(item)
    // 合计数据
    table.push({
      "名称": `${item.名称}总加成`,
      "原名": item.名称,
      isTotal: true,
      ...sqKeyList.reduce((acc, key) => {
        acc[key] = new Big(sq_cxzz.value?.[key]).plus(item[key] || 0).toNumber()
        return acc
      }, {})
    })
  })
  return table
})
// 神契最终展示的表格
const sq_slsb_show_table = computed(() => {
  if (sq_filter_data.value.length) {
    const excludeList = _.difference(Object.keys(sq_slsb_dict), sq_filter_data.value)
    return sqAllTableData.value.filter((item) => {
      const isExclude = excludeList.find((name) => {
        return item.名称.indexOf(name) !== -1
      })
      return !isExclude
    })
  } else {
    return sqAllTableData.value
  }
})

// 设置行样式
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.isTotal) return "total-row";
  return "";
};

const wqFormKey = {
  武器: "yx_wq",
  衣服: "yx_yf",
  头饰: "yx_ts",
  饰品: "yx_sp",
}
const set_attack_equip_set = () => {
  formData.value.yx_sp = "审判魔符"
  formData.value.yx_ts = "提尔之怒"
  formData.value.yx_wq = "熔鳞之怒"
  formData.value.yx_yf = "浩劫角铠"
}
const set_int_equip_set = () => {
  formData.value.yx_sp = "星之耳坠"
  formData.value.yx_ts = "天女头饰"
  formData.value.yx_wq = "红色之月"
  formData.value.yx_yf = "天女羽衣"
}

const wqSelectedObj = computed(() => {
  return Object.keys(wqFormKey).reduce((res, key) => {
    const list = zbObj.value[key]
    res[key] = list?.find(item => item["装备名称"] === formData.value?.[wqFormKey[key]]) || list?.[0]
    return res
  }, {})
})

const gmFm1Selected = computed(() => {
  return fmOptions.find(i => i.value === formData.value.gm_fm_1)
})
const gmFm2Selected = computed(() => {
  return fmOptions.find(i => i.value === formData.value.gm_fm_2)
})

const fmShowData = computed(() => {
  const columns = fmInputTableColumns.filter(i => i.label !== '部位')
  const gmInfo = {}
  columns.forEach(i => {
    const key = i.prop
    if (gmFm1Selected.value?.value !== gmFm2Selected.value?.value) {
      gmInfo[key] = (gmFm1Selected.value?.gm?.[key] || 0) + (gmFm2Selected.value?.gm?.[key] || 0)
    } else {
      gmInfo[key] = gmFm1Selected.value?.gm?.[key] || 0
    }
  })

  const data = [
    ...formData.value.fm_input,
    {
      "部位": "共鸣",
      ...gmInfo,
    },
  ]

  const totalValue = {}
  columns.forEach(i => {
    const key = i.prop
    totalValue[key] = data.reduce((res, item) => {
      return new Big(res).plus(item[key] || 0).toNumber()
    }, 0)
  })
  const total = {
    "部位": "总加成",
    ...totalValue,
  }

  return [
    ...data,
    total
  ]
})
const set_fm_column_max = (column) => {
  if (!column?.prop || column.label === "部位") return

  formData.value.fm_input?.forEach((row) => {
    const max = column?.maxList?.[row?.部位] ?? column?.max
    if (max === undefined || max === Infinity) return
    const raw = Number(max)
    const v = column.isPercent ? raw / 100 : raw
    row[column.prop] = Number.isFinite(v) ? v : 0
  })
}
const reset_fm_column = async (column) => {
  if (!column?.prop || column.label === "部位") return
  try {
    await ElMessageBox.confirm(`将清空各件装备的「${column.label}」附魔数值。`, '重置此列附魔', {
      confirmButtonText: '确认重置', cancelButtonText: '保留数据', type: 'warning',
    })
  } catch { return }
  formData.value.fm_input?.forEach((row) => {
    row[column.prop] = 0
  })
}

const sq_zjc = computed(() => {
  if (!formData.value.selected_sq || formData.value.selected_sq === '未携带') {
    return getDefaultSqValue()
  } else {
    const item = sqAllTableData.value.find((i) => {
      return i.原名 === formData.value.selected_sq
    })
    return item || getDefaultSqValue()
  }
})


const zb_jc = computed(() => {
  // 面板累加
  return mianbanList.reduce((res, mb_key) => {
    res[mb_key] = Object.keys(wqFormKey).reduce((res, wq_key) => {
      const number = wqSelectedObj.value?.[wq_key]?.[mb_key] || 0
      return new Big(res).plus(number).toNumber()
    }, 0)
    return res
  }, {})
})

const fm_data = computed(() => {
  const fmTotal = fmShowData.value.filter(i => i.部位 === "总加成")[0]
  const list = ["生命", "攻击", "智力", "防御", "魔防"]
  return list.reduce((res, key) => {
    res.fm_bfb[key] = fmTotal[`${key}百分比`] || 0
    res.fm_gdz[key] = fmTotal[`${key}固定值`] || 0
    return res
  }, {
    fm_gdz: {},
    fm_bfb: {},
  })
})

const allDataObj = computed(() => {
  return {
    zb_jc: zb_jc.value,
    bz: formData.value.bz,
    fm_bfb: fm_data.value.fm_bfb,
    fm_gdz: fm_data.value.fm_gdz,
    zyjt: formData.value.zyjt,
    zw: formData.value.zw,
    sq_zjc: sq_zjc.value,
    sjjc: formData.value.sjjc
  }
})

const lz = computed(() => {
  const { zb_jc, bz, fm_bfb, fm_gdz, zyjt, zw, sq_zjc, sjjc } = allDataObj.value
  const res = {
    生命: round(zb_jc["生命"] + bz["生命"] * fm_bfb["生命"] + fm_gdz["生命"] + zyjt["生命"] + zw["生命"] + sq_zjc["生命"] + sjjc["生命"], 1),
    攻击: round(zb_jc["攻击"] + bz["攻击"] * fm_bfb["攻击"] + fm_gdz["攻击"] + zyjt["攻击"] + zw["攻击"] + sq_zjc["攻击"] + sjjc["攻击"], 1),
    智力: round(zb_jc["智力"] + bz["智力"] * fm_bfb["智力"] + fm_gdz["智力"] + zyjt["智力"] + zw["智力"] + sq_zjc["智力"] + sjjc["智力"], 1),
    防御: round(zb_jc["防御"] + bz["防御"] * fm_bfb["防御"] + fm_gdz["防御"] + zyjt["防御"] + zw["防御"] + sq_zjc["防御"] + sjjc["防御"], 1),
    魔防: round(zb_jc["魔防"] + bz["魔防"] * fm_bfb["魔防"] + fm_gdz["魔防"] + zyjt["魔防"] + zw["魔防"] + sq_zjc["魔防"] + sjjc["魔防"], 1),
    技巧: round(zb_jc["技巧"] + zyjt["技巧"] + zw["技巧"] + sq_zjc["技巧"] + sjjc["技巧"], 1)
  }
  return res
})

// 合计 装备基础 附魔百分比 附魔百分比*白字 附魔固定值 职业精通 铸纹 神契
const lzTotalTableColumns = [
  {
    label: '',
    prop: 'mb_key',
  },
  {
    label: '合计',
    prop: 'total'
  },
  {
    label: "装备基础",
    prop: 'zb_jc'
  },
  {
    label: "附魔百分比",
    prop: 'fm_bfb'
  },
  {
    label: "附魔百分比*白字",
    prop: 'fm_bfb*bz'
  },
  {
    label: "附魔固定值",
    prop: 'fm_gdz'
  },
  {
    label: "职业精通",
    prop: 'zyjt'
  },
  {
    label: "铸纹",
    prop: 'zw'
  },
  {
    label: "神契",
    prop: 'sq_zjc'
  },
  {
    label: "圣镜",
    prop: 'sjjc'
  },
]
const lzTotalTableData = computed(() => {
  return mianbanList.reduce((res, mb_key) => {
    const keyList = ['bz', 'zb_jc', 'fm_bfb', 'fm_bfb', 'fm_gdz', 'zyjt', 'zw', 'sq_zjc', 'sjjc']
    const { zb_jc, bz, fm_bfb, fm_gdz, zyjt, zw, sq_zjc, sjjc } = keyList.reduce((res, key) => {
      res[key] = allDataObj.value[key][mb_key]
      return res
    }, {})
    const isjq = mb_key === '技巧'
    res.push({
      mb_key,
      total: lz.value[mb_key],
      zb_jc,
      fm_bfb: isjq ? '-' : new Big(fm_bfb || 0).times(100).toString() + "%",
      'fm_bfb*bz': isjq ? '-' : new Big(fm_bfb || 0).times(bz || 0).toString(),
      fm_gdz: isjq ? '-' : fm_gdz,
      zyjt,
      zw,
      sq_zjc,
      sjjc,
    })

    return res;
  }, [])
})


const reset_bjl = () => {
  formData.value.bjl = mianbanList.reduce((acc, key) => {
    acc[key] = round(formData.value.bz[key] + lz.value[key], 2)
    return acc;
  }, {});
}
watchEffect(() => {
  if (formData.value.sdsr_pd) {
    reset_bjl()
  }
})

const reset_jjjt = () => {
  formData.value.jjjt = _.cloneDeep(defaultJJJT)
}
watchEffect(() => {
  if (formData.value.jjjt_sfm) {
    reset_jjjt()
  }
})

// 装备特效 超绝特效 附魔共鸣 战场其他加成（手输） 总加成
// 战场加成
const zc_jc_Tablecolumn = [
  {
    label: " ",
    prop: "bw",
    fixed: true,
    width: 100,
  },
  {
    label: "装备特效",
    prop: "zb_tx",
    width: 140,
  },
  {
    label: "附魔共鸣",
    prop: "fm_jc",
    width: 140,
  },
  {
    label: "超绝特效",
    prop: "cj_tx",
    width: 100,
  },
  {
    label: "铸纹特效",
    prop: "zw_tx",
    width: 200,
  },
  {
    label: "战场其他加成（手输）",
    prop: "zc_qt_jc",
    width: 200,
  },
  {
    label: "总加成",
    prop: "total",
    width: 100,
  },
]

const zb_tx_data = computed(() => {
  return mianbanList.reduce((res, key) => {
    res[key] = Object.keys(wqSelectedObj.value).reduce((res, zbkey) => {
      // formData.value.bdxl_pd 血量
      let tx_cz = Number(wqSelectedObj.value[zbkey]?.[`常驻${key}`]) || 0
      let tx_mx = 0
      let tx_80x = 0
      let tx_50x = 0
      let tx_50xyx = 0
      switch (formData.value.bdxl_pd) {
        case '50%以下':
          tx_50xyx = Number(wqSelectedObj.value[zbkey]?.[`50血以下${key}`]) || 0
          break;
        case '50%以上但80%以下':
          tx_50x = Number(wqSelectedObj.value[zbkey]?.[`50血${key}`]) || 0
          break;
        case '80%以上但未满血':
          tx_80x = Number(wqSelectedObj.value[zbkey]?.[`80血${key}`]) || 0
          tx_50x = Number(wqSelectedObj.value[zbkey]?.[`50血${key}`]) || 0
          break;
        case '满血':
        default:
          tx_mx = Number(wqSelectedObj.value[zbkey]?.[`满血${key}`]) || 0
          tx_80x = Number(wqSelectedObj.value[zbkey]?.[`80血${key}`]) || 0
          tx_50x = Number(wqSelectedObj.value[zbkey]?.[`50血${key}`]) || 0
          break;
      }
      return res + tx_cz + tx_mx + tx_50x + tx_50xyx + tx_80x
    }, 0)
    return res
  }, {})
})

const zc_jc_tableData = computed(() => {
  return mianbanList.map((key) => {
    const zb_tx = zb_tx_data.value[key] || 0
    const _cjtx = Number(cjtx.value?.[key]) || 0
    const _fm4jc = Number(formData.value.fm4jc?.[key]) || 0
    const _zwtxjc = Number(formData.value.zwtxjc?.[key]) || 0
    const qtzd_jc = Number(formData.value?.zc_qt_jc?.[key]) || 0

    let total = zb_tx + _cjtx + _fm4jc + qtzd_jc + _zwtxjc
    if (key === '生命' && formData.value.jjc_pd) {
      total += 0.4
    }

    return {
      prop: key,
      total: round(total, 3)
    }
  })
})

const cjtx = computed(() => {
  if (formData.value.cj_pd) {
    return {
      攻击: 0.2,
      智力: 0.2,
      防御: 0.2,
      魔防: 0.3,
    }
  } else {
    return {
      攻击: 0,
      智力: 0,
      防御: 0,
      魔防: 0,
    }
  }
})
watchEffect(() => {
  if (formData.value.sdsr_pd) {
    let res = {}
    if (gmFm1Selected.value?.value === gmFm2Selected.value?.value) {
      switch (gmFm1Selected.value?.value) {
        case '满月':
          if (formData.value.bdxl_pd === '满血' || formData.value.bdxl_pd === '80%以上但未满血') {
            res = {
              攻击: 0.1,
              智力: 0.1,
              防御: 0.1,
              魔防: 0.1,
            }
          }
          break;
        case '怒涛':
          res = {
            攻击: 0.1,
          }
          break;
        case '大树':
          res = {
            防御: 0.05,
            魔防: 0.05,
          }
          break;
      }
    }
    formData.value.fm4jc = res

    if (currentSelectedJob.value) {
      console.log(currentSelectedJob.value)
      formData.value.zwtxjc = mianbanList.reduce((acc, key) => {
        acc[key] = Number(currentSelectedJob.value?.[`铸纹特效${key}`]);
        return acc;
      }, {});
    }
  }
})

const zd_zjc = computed(() => {
  return zc_jc_tableData.value.reduce((acc, item) => {
    acc[item.prop] = item.total
    return acc
  }, {})
})
const yx_zdmb = computed(() => {
  const jjc_pd = formData.value.jjc_pd
  const bjl = formData.value.bjl
  const jjjt = formData.value.jjjt
  const _zd_zjc = zd_zjc.value

  return mianbanList.reduce((acc, prop) => {
    let res = bjl[prop] * (1 + _zd_zjc[prop])
    if (jjc_pd) {
      res = res + jjjt[prop]
    }
    acc[prop] = round(res, 3)
    return acc
  }, {})
})

const yx_sx_zhl = computed(() => {
  const form = formData.value
  const base = yx_zdmb.value
  let res = {}
  if (form.zh_pd_fj) {
    res = mianbanList.reduce((acc, prop) => {
      acc[prop] = fz_list.filter(i => i.prop !== prop).reduce((a, item) => {
        if (form[item.zhKey]) {
          a = new Big(base[item.prop]).times(form[item.zhValueKey][prop]).plus(a).toNumber()
        }
        return a
      }, 0)
      return acc
    }, {})
  }
  return res
})

const yx_sx_dtl = computed(() => {
  const form = formData.value
  const base = yx_zdmb.value
  let res = {}
  if (form.zh_pd_dt) {
    res = mianbanList.reduce((acc, prop) => {
      acc[prop] = fz_list.filter(i => i.prop !== prop).reduce((a, item) => {
        if (form[item.tdKey]) {
          a = new Big(base[item.prop]).times(form[item.tdValueKey][prop]).plus(a).toNumber()
        }
        return a
      }, 0)
      return acc
    }, {})
  }
  return res
})


const yx_zdmb_zz = computed(() => {
  const base = {
    ...yx_zdmb.value,
  }
  Object.keys(yx_sx_dtl.value).forEach((key) => {
    if (yx_sx_dtl.value[key]) {
      base[key] = yx_sx_dtl.value[key]
    }
  })
  return mianbanList.reduce((acc, prop) => {
    acc[prop] = round(base[prop] + (yx_sx_zhl.value[prop] || 0), 1)
    return acc
  }, {})
})


const saveDialogVisible = ref(false)
const loadDialogVisible = ref(false)
const cacheName = ref('')
const cacheList = ref([])

// 获取英雄头像
const getHeroAvatar = (data) => {
  const hero = heroList.value.find(h => h.英雄名 === data?.selected_hero_row)
  return hero?.list?.[0]?.英雄头像
}

// 保存缓存
const saveHeroCache = () => {
  saveDialogVisible.value = true
}

const confirmSaveCache = () => {
  if (!cacheName.value) {
    ElMessage.warning('请输入缓存名称')
    return
  }

  const key = `${prefix}hero_cache`
  const cacheData = JSON.parse(localStorage.getItem(key) || '[]')
  cacheData.push({
    name: cacheName.value,
    data: formData.value,
    timestamp: Date.now()
  })
  localStorage.setItem(key, JSON.stringify(cacheData))

  ElMessage.success('保存成功')
  saveDialogVisible.value = false
  cacheName.value = ''
}

// 加载缓存
const loadHeroCache = () => {
  const key = `${prefix}hero_cache`
  cacheList.value = JSON.parse(localStorage.getItem(key) || '[]')
  loadDialogVisible.value = true
}

// 使用缓存
const useCache = (cache) => {
  formData.value = _.cloneDeep(cache.data)
  loadDialogVisible.value = false
  ElMessage.success('加载成功')
}

// 删除缓存
const deleteCache = (cache) => {
  ElMessageBox.confirm('确认删除该缓存？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const key = `${prefix}hero_cache`
    const cacheData = JSON.parse(localStorage.getItem(key) || '[]')
    const index = cacheData.findIndex(item => item.name === cache.name)
    if (index > -1) {
      cacheData.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(cacheData))
      cacheList.value = cacheData
      ElMessage.success('删除成功')
    }
  })
}


const sb_selected_row = computed(() => {
  const current = formData.value.selected_sb_names[formData.value.selected_sb_names.length - 1]
  return df3.value.find(item => item.士兵名 === current) || df3.value[0] || {}
})

watchEffect(() => {
  formData.value.sb_cs = {
    生命: sb_selected_row.value?.生命 || 0,
    攻击: sb_selected_row.value?.攻击 || 0,
    防御: sb_selected_row.value?.防御 || 0,
    魔防: sb_selected_row.value?.魔防 || 0,
  }
})

watchEffect(() => {
  if (formData.value.sbsq_sdsr_pd) {
    formData.value.sb_sq_jc["士兵生命"] = sq_zjc.value["士兵生命"]
    formData.value.sb_sq_jc["士兵攻击"] = sq_zjc.value["士兵攻击"]
    formData.value.sb_sq_jc["士兵防御"] = sq_zjc.value["士兵防御"]
    formData.value.sb_sq_jc["士兵魔防"] = sq_zjc.value["士兵魔防"]
  }
})

watchEffect(()=>{
  const yx_bx_jc = {
    "兵修生命": formData.value.yx_bx_jc_yx["兵修生命"],
    "兵修攻击": formData.value.yx_bx_jc_yx["兵修攻击"],
    "兵修防御": formData.value.yx_bx_jc_yx["兵修防御"],
    "兵修魔防": formData.value.yx_bx_jc_yx["兵修魔防"],
  }
  if(formData.value.yxbx_sffmxh_pd){
    yx_bx_jc["兵修生命"] += 0.05
    yx_bx_jc["兵修攻击"] += 0.05
    yx_bx_jc["兵修防御"] += 0.05
    yx_bx_jc["兵修魔防"] += 0.05
  }
  Object.assign(formData.value.yx_bx_jc, yx_bx_jc)
})

watch(()=>[formData.value.gm_fm_1,formData.value.gm_fm_2],()=>{
  if(
      gmFm1Selected.value?.value==='薪火'
      && gmFm1Selected.value?.value==='薪火'
  ){
    formData.value.yxbx_sffmxh_pd = true
  }
})

watchEffect(() => {
  if (formData.value.yxbx_sdsr_pd && formData.value.selected_hero_row !== '自定义英雄') {
    formData.value.yx_bx_jc_yx["兵修生命"] = currentSelectedJob.value["兵修生命"]
    formData.value.yx_bx_jc_yx["兵修攻击"] = currentSelectedJob.value["兵修攻击"]
    formData.value.yx_bx_jc_yx["兵修防御"] = currentSelectedJob.value["兵修防御"]
    formData.value.yx_bx_jc_yx["兵修魔防"] = currentSelectedJob.value["兵修魔防"]
  }
})

const sb_bz = computed(() => {
  return {
    生命: Number(formData.value.sb_cs.生命) * ((60 - 1) * 0.1 + (70 - 60) * 0.05 + 1) * (1 + 0.8 + Number(formData.value.sb_sq_jc?.["士兵生命"]) + Number(formData.value.sjjc?.["士兵生命"]) + Number(sb_selected_row.value?.["全属性百分比加成"])) + 55,
    攻击: Number(formData.value.sb_cs.攻击) * ((60 - 1) * 0.1 + (70 - 60) * 0.05 + 1) * (1 + 0.8 + Number(formData.value.sb_sq_jc?.["士兵攻击"]) + Number(formData.value.sjjc?.["士兵攻击"]) + Number(sb_selected_row.value?.["全属性百分比加成"])) + 55,
    防御: Number(formData.value.sb_cs.防御) * ((60 - 1) * 0.1 + (70 - 60) * 0.05 + 1) * (1 + 0.8 + Number(formData.value.sb_sq_jc?.["士兵防御"]) + Number(formData.value.sjjc?.["士兵防御"]) + Number(sb_selected_row.value?.["全属性百分比加成"])) + 33,
    魔防: Number(formData.value.sb_cs.魔防) * ((60 - 1) * 0.1 + (70 - 60) * 0.05 + 1) * (1 + 0.8 + Number(formData.value.sb_sq_jc?.["士兵魔防"]) + Number(formData.value.sjjc?.["士兵魔防"]) + Number(sb_selected_row.value?.["全属性百分比加成"])) + 33,
  }
})

const sb_cjtx = computed(() => {
  if (formData.value.sbcj_pd) {
    return {
      攻击: 0.2,
      防御: 0.2,
      魔防: 0.3,
    }
  } else {
    return {
      攻击: 0,
      防御: 0,
      魔防: 0,
    }
  }
})

watch(()=>unit_techs.value,()=>{
  formData.value.selected_kj = {}
})

const sb_kj_jc = computed(() => {
  const selectedKjObjList = unit_techs.value.filter(item => formData.value.selected_kj[item.科技名称])
  return selectedKjObjList.reduce((acc, item) => {
    Object.keys(acc).forEach(key => {
      acc[key] += Number(item[key])
    })
    return acc
  }, { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0, "生命克制修正": 0, "攻击克制修正": 0, "智力克制修正": 0, "防御克制修正": 0, "魔防克制修正": 0 })
})

const sb_zd_zjc = computed(() => {
  const sb_zd_zjc = { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0, "生命克制修正": 0, "攻击克制修正": 0, "智力克制修正": 0, "防御克制修正": 0, "魔防克制修正": 0 }
  if (formData.value.sbjjc_pd) {
    sb_zd_zjc["生命"] = round(Number(formData.value.sb_bztx_qtjc["生命"]) + 0.4, 3)
  } else {
    sb_zd_zjc["生命"] = Number(formData.value.sb_bztx_qtjc["生命"])
  }

  sb_zd_zjc["攻击"] = sb_cjtx.value["攻击"] + sb_kj_jc.value["攻击"] + Number(formData.value.sb_bztx_qtjc["攻击"])
  sb_zd_zjc["防御"] = sb_cjtx.value["防御"] + sb_kj_jc.value["防御"] + Number(formData.value.sb_bztx_qtjc["防御"])
  sb_zd_zjc["魔防"] = sb_cjtx.value["魔防"] + sb_kj_jc.value["魔防"] + Number(formData.value.sb_bztx_qtjc["魔防"])
  sb_zd_zjc["生命克制修正"] = Number(formData.value.sb_bztx_qtjc["生命克制修正"])
  sb_zd_zjc["攻击克制修正"] = sb_kj_jc.value["攻击克制修正"] + Number(formData.value.sb_bztx_qtjc["攻击克制修正"])
  sb_zd_zjc["智力克制修正"] = sb_kj_jc.value["智力克制修正"] + Number(formData.value.sb_bztx_qtjc["智力克制修正"])
  sb_zd_zjc["防御克制修正"] = sb_kj_jc.value["防御克制修正"] + Number(formData.value.sb_bztx_qtjc["防御克制修正"])
  sb_zd_zjc["魔防克制修正"] = sb_kj_jc.value["魔防克制修正"] + Number(formData.value.sb_bztx_qtjc["魔防克制修正"])

  return sb_zd_zjc
})

const sb_zdmb = computed(() => {
  const sb_zdmb = { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0 }
  Object.keys(sb_zdmb).forEach((key) => {
    sb_zdmb[key] = sb_bz.value[key] * (1 + sb_zd_zjc.value[key])
  })
  return sb_zdmb
})

const sb_zdmb_klkz = computed(() => {
  const sb_zdmb_klkz = { "生命": 0, "物理攻击": 0, "魔法攻击": 0, "防御": 0, "魔防": 0 }
  sb_zdmb_klkz["生命"] = sb_zdmb.value["生命"] * (1 + Number(formData.value.yx_bx_jc["兵修生命"])) * (1 + sb_zd_zjc.value["生命克制修正"])
  sb_zdmb_klkz["物理攻击"] = sb_zdmb.value["攻击"] * (1 + Number(formData.value.yx_bx_jc["兵修攻击"])) * (1 + sb_zd_zjc.value["攻击克制修正"])
  sb_zdmb_klkz["魔法攻击"] = sb_zdmb.value["攻击"] * (1 + Number(formData.value.yx_bx_jc["兵修攻击"])) * (1 + sb_zd_zjc.value["智力克制修正"])
  sb_zdmb_klkz["防御"] = sb_zdmb.value["防御"] * (1 + Number(formData.value.yx_bx_jc["兵修防御"])) * (1 + sb_zd_zjc.value["防御克制修正"])
  sb_zdmb_klkz["魔防"] = sb_zdmb.value["魔防"] * (1 + Number(formData.value.yx_bx_jc["兵修魔防"])) * (1 + sb_zd_zjc.value["魔防克制修正"])

  return sb_zdmb_klkz
})

</script>
<style lang="scss">
.orange {
  color: #e99700fc;
}

.green {
  color: green;
}

.mbjs-el {
  .el-card{
    overflow-x: auto;
  }
  .el-card__body{
    >div{
      overflow-x: auto;
    }
  }

  .el-table .el-table__row.total-row {
    background-color: rgb(254, 240.3, 240.3);
  }

  .green-list {
    margin: 0 24px;

    &.total {
      .label {
        text-align: left;
      }

      .item {
        margin-right: 24px;
      }
    }

    .item {
      width: 200px;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .label {
      font-size: 24px;
      color: #666;
      text-align: right;
    }

    .value {
      margin-left: 16px;
      font-size: 22px;
      color: green;
    }

    .green {
      color: green;
    }

    .red {
      color: red;
    }

    .normal {
      color: #333;
    }
  }


}
</style>
