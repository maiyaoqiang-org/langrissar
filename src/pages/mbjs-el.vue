<template>
  <div class="mbjs-el" style="padding:24px;">
    <el-button class="mb_16" type="primary" @click="resetFormData">重置数据</el-button>
    <el-affix>
      <div class="mb_16" flex="main:right">
        <el-button @click="saveHeroCache">缓存英雄数据</el-button>
        <el-button type="primary" class="ml_8" @click="loadHeroCache">使用缓存</el-button>
      </div>
    </el-affix>

    <el-form style="min-width: 600px;" label-width="120px" class="base-el-form" label-position="right" :inline="true"
      :model="formData">
      <el-card class="mb_16">
        <template #header>
          英雄白字区
        </template>
        <div flex>
          <div flex class="mr_16">
            <div flex-box="0">
              <el-form-item label="选择英雄名">
                <el-select v-model="formData.selected_hero_row" filterable>
                  <el-option v-for="(item, index) in heroList" :value="item.英雄名" :key="index"
                    :label="item.英雄名"></el-option>
                </el-select>
              </el-form-item>
              <br>
              <el-form-item label="选择职业">
                <el-select v-model="formData.selected_job" filterable>
                  <el-option v-for="(item, index) in currentSelectedHero?.list" :value="item.职业名" :key="index"
                    :label="item.职业名"></el-option>
                </el-select>
              </el-form-item>

              <template v-if="currentSelectedJob">
                <div flex>
                  <div flex="dir:top cross:center">
                    <img style="width:120px;height:120px;display:block;" :src="currentSelectedJob?.['英雄头像']" alt="">
                    <div>
                      {{ currentSelectedJob?.['英雄名'] }}
                    </div>
                  </div>

                  <div class="ml_16" flex="dir:top cross:center">
                    <img style="width:40px;height:40px;display:block;" :src="currentSelectedJob?.['occupationPic']"
                      alt="">
                    <div>
                      {{ currentSelectedJob?.['occupation'] }}
                    </div>
                  </div>

                </div>

              </template>

            </div>

          </div>
          <div>
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
      </el-card>

      <el-card class="mb_16">
        <template #header>
          <div flex="cross:center">
            <div>
              神契设置区
            </div>
            <div style="margin-left: auto;">
              <el-button @click="export_sq_cxzz">导出神契设置</el-button>
              <el-button type="primary" @click="import_sq_cxzz">导入神契设置</el-button>
            </div>
          </div>

        </template>
        <div>
          <el-form-item label="筛选神契">
            <el-select style="min-width:300px;" v-model="sq_filter_data" filterable multiple clearable>
              <el-option v-for="(item, index) in Object.keys(sq_slsb_dict)" :value="item" :key="index" :label="item">
                <div flex="cross:center">
                  <img class="mr_16" style="width:30px;height:30px;" :src="sq_slsb_dict[item].image" alt="">
                  <div>
                    {{ item }}
                  </div>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

        </div>
        <el-table border size="small" :row-class-name="tableRowClassName" :data="sq_slsb_show_table">
          <el-table-column v-for="(item, index) in sq_slsb_table_columns" :fixed="item.fixed" :key="index"
            :width="item.width" :label="item.label" :prop="item.prop">
            <template #default="scope">
              <template v-if="scope.row?.名称 === '神契晨曦之祝加成' && item.prop !== '名称'">
                <div style="color:#999;">
                  最大值{{ item.max }}
                </div>
                <mz-number-input style="width:120px;" :max="item.max" v-model="sq_cxzz[item.prop]"
                  :is-percent="item.isPercent" :min="0"></mz-number-input>
              </template>
              <template v-else>
                <div v-if="item.prop === '名称'" flex="cross:center">
                  <img v-if="sq_slsb_dict[scope.row[item.prop]]?.image" style="width:30px;height:30px;" class="mr_8"
                    :src="sq_slsb_dict[scope.row[item.prop]]?.image" alt="">
                  <div>
                    {{ scope.row[item.prop] }}
                  </div>

                </div>
                <span v-else-if="item.isPercent">{{ new Big(scope.row[item.prop]).times(100).toString() }}%</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>


            </template>

          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="mb_16">
        <template #header>
          英雄绿字区
        </template>

        <el-tabs model-value="装备" style="min-height: 300px;">
          <el-tab-pane class="item-w-340" label="装备" name="装备">
            <div flex>
              <div>
                <template v-for="(formKey, key) in wqFormKey" :key="key">
                  <el-form-item :label="'请选择' + key">
                    <el-select v-model="formData[formKey]" filterable>
                      <el-option v-for="(zbItem, zbIndex) in zbObj[key]" :key="zbIndex" :label="zbItem.装备名称"
                        :value="zbItem.装备名称"></el-option>
                    </el-select>
                    <div>
                      <img style="width:100px;height:auto;" class="mt_8" :src="wqSelectedObj[key]?.picAddr" alt="">
                      <div style="color:#31333f99;">
                        {{ wqSelectedObj[key]?.equipName }}
                      </div>
                      <div>
                        基础加成：<span style="color:green;">{{ wqSelectedObj[key]?.basicBonus }}</span>
                      </div>
                      <div>
                        满级特效：<span class="orange">{{ wqSelectedObj[key]?.specialEffects }}</span>
                      </div>
                    </div>
                  </el-form-item>
                  <br>
                </template>

              </div>

              <div class="green-list" style="max-width:400px;">
                <div class="item" v-for="key in mianbanList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ zb_jc[key] }}
                  </div>
                </div>
              </div>
            </div>


          </el-tab-pane>
          <el-tab-pane class="item-w-200" label="附魔" name="附魔">
            <div>
              <el-form-item label="第一个共鸣2件套">
                <el-select class="mb_8" v-model="formData.gm_fm_1" filterable>
                  <el-option v-for="(item, index) in fmOptions" :key="index" :label="item.label" :value="item.value">
                    <div flex="cross:center">
                      <img v-if="item.image" class="mr_16" style="width:30px;height:30px;" :src="item.image" alt="">
                      <div>
                        {{ item.label }}
                      </div>
                    </div>
                  </el-option>
                </el-select>
                <div flex="cross:center main:center" style="width:100%;min-height:50px;">
                  <template v-if="gmFm1Selected?.image">
                    <img v-for="i in 2" :key="i" style="width:50px;height:50px;margin:0 auto;"
                      :src="gmFm1Selected?.image" alt="">
                  </template>
                </div>
              </el-form-item>
              <el-form-item label="第二个共鸣2件套">
                <el-select class="mb_8" v-model="formData.gm_fm_2" filterable>
                  <el-option v-for="(item, index) in fmOptions" :key="index" :label="item.label" :value="item.value">
                    <div flex="cross:center">
                      <img v-if="item.image" class="mr_16" style="width:30px;height:30px;" :src="item.image" alt="">
                      <div>
                        {{ item.label }}
                      </div>
                    </div>
                  </el-option>
                </el-select>
                <div flex="cross:center main:center" style="width:100%;min-height:50px;">
                  <template v-if="gmFm2Selected?.image">
                    <img v-for="i in 2" :key="i" style="width:50px;height:50px;margin:0 auto;"
                      :src="gmFm2Selected?.image" alt="">
                  </template>
                </div>
              </el-form-item>
            </div>
            <base-divider></base-divider>

            <el-table :data="fmShowData">
              <el-table-column v-for="(item, index) in fmInputTableColumns" :key="index" :width="item.width"
                :fixed="item.fixed" :label="item.label" :prop="item.prop">
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


          </el-tab-pane>
          <el-tab-pane label="职业精通" name="职业精通">
            <div flex="cross:top">
              <el-form-item style="display: unset;" label-position="top" label="职业精通是否满值">
                <el-radio-group v-model="formData.zyjt_input_can_edit">
                  <el-radio :value="false" label="默认满" />
                  <br>
                  <el-radio :value="true" label="自定义" />
                </el-radio-group>
              </el-form-item>
              <div>
                <el-form-item v-for="(item, index) in mianbanList" :key="index" :label="item + '-职业精通'">
                  <mz-input :disabled="!formData.zyjt_input_can_edit" :prop="item" :formData="formData.zyjt"></mz-input>
                </el-form-item>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="铸纹" name="铸纹">
            <div flex="cross:top">
              <el-form-item class="item-w-200" style="display: unset;" :label-width="200" label-position="top"
                label="选择铸纹类型（默认满级）">
                <el-radio-group v-model="formData.zw_input_can_edit">
                  <el-radio :value="false" label="默认关联选择的英雄" />
                  <br>
                  <el-radio :value="true" label="自定义铸纹" />
                </el-radio-group>
              </el-form-item>
              <div>
                <el-form-item v-for="(item, index) in mianbanList" :key="index" :label="item + '-职业精通'">
                  <mz-input :disabled="!formData.zw_input_can_edit" :prop="item" :formData="formData.zw"></mz-input>
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="神契" name="神契">
            <div flex>
              <div style="width:400px;">
                <div class="error mb_16" style="font-size: 20px;">
                  请提前在「神契设置区」设置好神契
                </div>
                <el-form-item style="width:100%;" label="请选择神契">
                  <el-select v-model="formData.selected_sq" filterable clearable>
                    <el-option value="未携带" label="未携带"></el-option>
                    <el-option v-for="(item, index) in Object.keys(sq_slsb_dict)" :value="item" :key="index"
                      :label="item">
                      <div flex="cross:center">
                        <img v-if="sq_slsb_dict[item].image" class="mr_16" style="width:30px;height:30px;"
                          :src="sq_slsb_dict[item].image" alt="">
                        <div>
                          {{ item }}
                        </div>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" ">
                  <img v-if="sq_slsb_dict[formData.selected_sq]?.image" style="display: block;width:100px;height:100px;"
                    :src="sq_slsb_dict[formData.selected_sq]?.image" alt="">
                </el-form-item>
              </div>
              <div class="green-list" style="max-width:400px;">
                <div class="item" v-for="key in sqGudingList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ sq_zjc[key] }}
                  </div>
                </div>
                <div class="item" v-for="key in sqPercentList" :key="key">
                  <div class="label" style="width:100px;">
                    {{ key }}
                  </div>
                  <div class="value">
                    +{{ round(sq_zjc[key] * 100, 3) }}%
                  </div>
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
                  +{{ item }}
                </div>
              </div>
            </div>

          </el-tab-pane>
        </el-tabs>

      </el-card>

      <el-card class="mb_16">
        <template #header>英雄绿字加成统计表</template>
        <el-table class="mb_16" :data="lzTotalTableData">
          <el-table-column v-for="(item, index) in lzTotalTableColumns" :prop="item.prop" :label="item.label"
            :key="index">
            <template v-slot="scope" v-if="item.prop === 'fm_bfb*bz'">
              {{ round(Number(scope.row[item.prop]), 1) || '-' }}
            </template>
          </el-table-column>
        </el-table>
        <div flex>
          <img v-if="currentSelectedJob" style="width:120px;height:120px;margin:16px;display:block;"
            :src="currentSelectedJob?.['英雄头像']" alt="">
          <div class="green-list" style="max-width:400px;">
            <div class="item" style="width:300px;" v-for="key in mianbanList" :key="key">
              <div class="label" style="width:100px;">
                {{ key }}
              </div>
              <div class="value" flex style="gap:8px;">
                <div style="color:#333;">
                  {{ formData.bz[key] }}
                </div>
                <div>+</div>
                <div>
                  {{ lz[key] }}
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-card>

      <el-card class="mb_16">
        <template #header>
          英雄战场面板模拟
        </template>

        <div flex style="gap:16px;">
          <el-card>
            <template #header>
              英雄的白+绿面板
            </template>
            <div style="width: 500px;">
              <el-checkbox class="mb_16" v-model="formData.sdsr_pd"
                label="默认关联读取以上英雄模拟结果 (想手动输入 进行下面模拟 就取消勾选)"></el-checkbox>
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
            <div style="width:500px;">
              <el-checkbox class="mb_16" v-model="formData.jjjt_sfm" label="竞技精通是否满值 (想手动输入 就取消勾选)"></el-checkbox>
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

      <el-card class="mb_16">
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
          <el-tab-pane v-for="item in zc_jc_Tablecolumn.filter(i => i.label !== '总加成')" :key="item.label"
            :name="item.label" :label="item.label">
            <div flex="main:left">
              <div style="flex: 1;">
                <div class="mb_16" style="font-weight: bold;">{{ item.label }}</div>

                <div flex>
                  <!-- 添加装备特效展示区域 -->
                  <template v-if="item.label === '装备特效'">
                    <div style="margin-right:32px;">
                      <div v-for="(wq, key) in wqSelectedObj" :key="key" class="mb_16">
                        <div flex="cross:center" class="mb_8">
                          <img v-if="wq?.picAddr" :src="wq.picAddr"
                            style="width: 40px;height:auto; margin-right: 8px;" />
                          <div style="font-weight: bold;">{{ key }}：{{ wq?.装备名称 }}</div>
                        </div>
                        <div>特效：<span class="orange">{{ wq?.specialEffects }}</span></div>
                      </div>
                    </div>
                  </template>
                  <div>
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
              <div style="width: 200px; margin-left: 24px; border-left: 1px solid #eee; padding-left: 24px;">
                <div class="mb_16" style="font-weight: bold;">总加成</div>
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

      <el-card class="mb_16">
        <el-collapse>
          <el-collapse-item title="是否存在 攻转防 防转攻" name="1">
            <div flex style="gap:8px;">
              <div style="width:400px;">
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

              <div style="width:400px;">
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

      <el-card class="mb_16">
        <template #header>
          英雄的战场面板
        </template>
        <div flex>
          <div>

          </div>
          <div class="green-list total" flex>
            <div>
              <div class="item" v-for="key in ['生命']" :key="key">
                <div class="label">
                  {{ key }}：
                </div>
                <div class="value" flex style="gap:8px;">
                  <show-up :value="yx_zdmb_zz[key]"
                    :show-class="(zd_zjc[key] > 0 || yx_sx_zhl[key] != 0) ? 'up' : zd_zjc[key] < 0 ? 'down' : ''"></show-up>
                </div>
              </div>
              <img v-if="currentSelectedJob" class="mr_16" style="width:120px;height:120px;display:block;"
                :src="currentSelectedJob?.['英雄头像']" alt="">
            </div>
            <div>
              <div flex>
                <div class="item" v-for="key in ['攻击', '智力']" :key="key">
                  <div class="label">
                    {{ key }}：
                  </div>
                  <div class="value" flex style="gap:8px;">
                    <show-up :value="yx_zdmb_zz[key]"
                      :show-class="(zd_zjc[key] > 0 || yx_sx_zhl[key] != 0) ? 'up' : zd_zjc[key] < 0 ? 'down' : ''"></show-up>
                  </div>
                </div>
              </div>
              <div flex>
                <div class="item" v-for="key in ['防御', '魔防']" :key="key">
                  <div class="label">
                    {{ key }}：
                  </div>
                  <div class="value" flex style="gap:8px;">
                    <show-up :value="yx_zdmb_zz[key]"
                      :show-class="(zd_zjc[key] > 0 || yx_sx_zhl[key] != 0) ? 'up' : zd_zjc[key] < 0 ? 'down' : ''"></show-up>
                  </div>
                </div>
              </div>
              <div flex>
                <div class="item" v-for="key in ['技巧']" :key="key">
                  <div class="label">
                    {{ key }}：
                  </div>
                  <div class="value" flex style="gap:8px;">
                    <show-up :value="yx_zdmb_zz[key]"
                      :show-class="(zd_zjc[key] > 0 || yx_sx_zhl[key] != 0) ? 'up' : zd_zjc[key] < 0 ? 'down' : ''"></show-up>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-divider />
        <div style="margin:0 24px;">
          <h3>英雄大心效果</h3>
          <div class="mt_8">
            心之羁绊4：<span class="orange">{{ currentSelectedJob?.['心之羁绊4'] }}</span>
          </div>
          <div class="mt_8">
            心之羁绊7：<span class="orange">{{ currentSelectedJob?.['心之羁绊7'] }}</span>
          </div>
        </div>
      </el-card>

      <el-card class="mb_16">
        <template #header>
          士兵初始值区
        </template>
        <div>
          <el-cascader filterable v-model="formData.selected_sb_names" :options="df3CascaderOptions"
            placeholder="请选择士兵">
            <template #default="{ node, data }">
              <div style="display: flex;">
                <span>{{ data.label }}</span>
                <img v-if="node.isLeaf" style="width:auto;height:30px;margin-left: 8px;" :src="data?.图片地址" alt="" />
              </div>
            </template>
          </el-cascader>
          <div style="display: flex;">
            <div class="mt_16" style="width:150px;display: flex;align-items: center;flex-direction: column;">
              <img style="width:100%;height:auto;" :src="sb_selected_row?.['图片地址']" alt="">
              <div style="color:#999;">
                {{ sb_selected_row?.["士兵名"] }}
              </div>
            </div>

            <div class="ml_24">
              <h3>
                生命：{{ formData?.sb_cs?.["生命"] }}
              </h3>
              <h3>
                攻击：{{ formData?.sb_cs?.["攻击"] }}
              </h3>
              <h3>
                防御：{{ formData?.sb_cs?.["防御"] }}
              </h3>
              <h3>
                魔防：{{ formData?.sb_cs?.["魔防"] }}
              </h3>
            </div>
          </div>

          <div class="mt_24">
            <div>
              士兵等级：<span class="orange">{{ sb_selected_row?.["等级"]  }}</span>
            </div>
            <div>
              满级士兵技能：<span class="orange">{{ sb_selected_row?.["满级技能"]  }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="mb_16">
        <template #header>
          士兵神契加成区

        </template>
        <div>
          <div class="error mb_16">
            请提前在「神契设置区」设置好神契
          </div>
          <el-form-item label="">
            <el-checkbox v-model="formData.sbsq_sdsr_pd" label="默认关联读取此前神契设置区的加成 (想手动输入神契加成 就取消勾选)"></el-checkbox>
          </el-form-item>
          <div style="width:1000px;">
            <el-form-item label-width="180px" v-for="(item,index) in ['士兵生命','士兵攻击','士兵防御','士兵魔防']" :key="index" :label="item + (!formData.sbsq_sdsr_pd?'最大值24%':'')"> 
              <mz-percent-input :disabled="formData.sbsq_sdsr_pd" :prop="item" :form-data="formData.sb_sq_jc"></mz-percent-input>
            </el-form-item>
          </div>

        </div>
      </el-card>

      <el-card class="mb_16">
        <template #header>
          英雄兵修区
        </template>
        <div>
          <el-form-item label="">
            <el-checkbox v-model="formData.yxbx_sdsr_pd" label="默认关联读取以上英雄模拟结果 (想手动输入 就取消勾选)"></el-checkbox>
          </el-form-item>
          <div v-if="formData.yxbx_sdsr_pd&&formData.selected_hero_row!=='自定义英雄'" style="width:1000px;display: flex;">
            <div style="width:90px;margin-top: 24px;">
              <img style="width:100%;height:auto;display:block;" :src="currentSelectedJob?.['英雄头像']" alt="">
              <div style="color:#999;text-align: center;">
                {{ currentSelectedJob?.['英雄名'] }}
              </div>
            </div>
            <div style="margin-left: 60px;">
              <h3 v-for="(item,index) in ['兵修生命','兵修攻击','兵修防御','兵修魔防']" :key="index"> 
                {{ item }}：<strong class="green">{{ round(formData.yx_bx_jc?.[item]*100) }}%</strong>
              </h3>
            </div>
          </div>
          <div v-else style="width:1000px;">
            <el-form-item label-width="180px" v-for="(item,index) in ['兵修生命','兵修攻击','兵修防御','兵修魔防']" :key="index" :label="item"> 
              <mz-percent-input :prop="item" :form-data="formData.yx_bx_jc"></mz-percent-input>
            </el-form-item>
          </div>


        </div>
      </el-card>

    </el-form>

    <pre style="user-select: text;">
  使用说明：此计算器搬运了墨源的梦战伤害计算器，一切版权均属于墨源。搬运来源：https://moyuanmz-mbjsq.streamlit.app/
</pre>

    <!-- 添加回到顶部按钮 -->
    <el-backtop :right="40" :bottom="40" />

    <!-- 添加缓存名称输入弹窗 -->
    <el-dialog v-model="saveDialogVisible" title="保存英雄数据" width="30%">
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
    <el-dialog v-model="loadDialogVisible" title="选择英雄数据" width="30%">
      <el-table :data="cacheList" style="width: 100%">
        <el-table-column property="name" label="缓存名称">
          <template #default="scope">
            <div flex="cross:center">
              <img v-if="scope.row.data?.selected_hero_row" style="width:30px;height:30px;margin-right:8px;"
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
import Big from 'big.js'
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
import zbData from '../static/data/梦战装备满级基础属性分类.csv?raw'
import MzNumberInput from "@/components/element-comp/mz-number-input.vue";
import AV from 'leancloud-storage'
import zdyLogo from '@/static/image/自定义英雄头像.png'
import zdyZY from '@/static/image/自定义职业图标.png'
import sbFileData from '../static/data/梦战士兵数据.csv?raw'
import sbKjFileData from '../static/data/梦战士兵科技数据.csv?raw'


const prefix = "langrissar-calculator-mbjs-el-"
const heroList = ref([])
const zbObj = ref({})
const df3 = ref([])
const df4 = ref({})


const getHeroData = () => {
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
  const query = new AV.Query("HeroBasicAttr");
  query
    .limit(1000)
    .find()
    .then((res) => {
      const heroes = res.map((item) => {
        // 判断英雄名是否叫【自定义英雄】
        if (item.attributes.heroName === '自定义英雄') {
          item.attributes.logo = zdyLogo
          item.attributes.occupationPic = zdyZY
        }

        const mapAttributes = Object.entries(item.attributes).reduce((acc, [key, value]) => {
          if (heroKeyMap[key]) {
            acc[heroKeyMap[key]] = value
          }
          return acc
        }, {})
        return {
          ...mapAttributes,
          ...item.attributes,
        }
      })

      heroList.value = Object.entries(_.groupBy(heroes, '英雄名')).map(([key, list]) => {
        return {
          "英雄名": key,
          list: list,
        }
      })
      console.log(heroList.value)

    })
    .catch((err) => {
      console.log('查询失败', err)
    })
}

import wq_none from '@/static/image/武器未佩戴.png'
import yf_none from '@/static/image/衣服未佩戴.png'
import ts_none from '@/static/image/头饰未佩戴.png'
import sp_none from '@/static/image/饰品未佩戴.png'


const getEquipData = () => {

  const schema = EquipDetail_schema.schema
  const EquipDetailMap = Object.keys(schema).reduce((cur, key) => {
    cur[key] = schema[key].comment
    return cur
  }, {})
  const query = new AV.Query("EquipDetail");
  query
    .limit(1000)
    .find()
    .then((res) => {
      const map = EquipDetailMap
      const mapItem = {
        "武器无": wq_none,
        "衣服无": yf_none,
        "头饰无": ts_none,
        "饰品无": sp_none,
      }
      const list = res.map((item) => {
        if (mapItem[item.attributes.equipName]) {
          item.attributes.picAddr = mapItem[item.attributes.equipName]
        }
        const mapAttributes = Object.entries(item.attributes).reduce((acc, [key, value]) => {
          if (map[key]) {
            acc[map[key]] = value
          }
          return acc
        }, {})

        return {
          ...mapAttributes,
          ...item.attributes,
        }
      })

      zbObj.value = _.groupBy(list, '类别')
      console.log(zbObj.value)
    })
    .catch((err) => {
      console.log('查询失败', err)
    })
}

function transformDataToCascaderFormat(data) {
  const result = {};

  data.forEach(item => {
    const { 兵种, 士兵名 } = item;

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

  return Object.values(result);
}

const getSbData = () => {
  df3.value = parseCSVToObjects(sbFileData)
}
const df3CascaderOptions = computed(() => {
  return transformDataToCascaderFormat(df3.value);
});
const getSbKjData = () => {
  df4.value = parseCSVToObjects(sbKjFileData);
}

onMounted(() => {
  getHeroData()
  getEquipData()
  getSbData()
  getSbKjData()
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
  selected_sq: "",
  sdsr_pd: true,
  bjl: _.cloneDeep(mianbanDefault),
  jjjt_sfm: true,
  jjjt: _.cloneDeep(defaultJJJT),
  jjc_pd: true,
  bdxl_pd: "满血",
  zb_tx: _.cloneDeep(mianbanDefault),
  zc_qt_jc: _.cloneDeep(mianbanDefault),
  cj_pd: false,
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
  yx_bx_jc: { "兵修生命": 0, "兵修攻击": 0, "兵修防御": 0, "兵修魔防": 0 }, // 初始英雄兵修加成 字典
  sb_bz: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0 },  // 初始士兵白字 字典
  sb_cjtx: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0 },  // 初始化士兵超绝特效加成 字典
  sb_kj_jc: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0, "生命克制修正": 0, "攻击克制修正": 0, "智力克制修正": 0, "防御克制修正": 0, "魔防克制修正": 0 },  // 初始化士兵科技加成 字典
  sb_bztx_qtjc: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0, "生命克制修正": 0, "攻击克制修正": 0, "智力克制修正": 0, "防御克制修正": 0, "魔防克制修正": 0 },  // 初始化士兵兵种特效及其他加成 字典
  sb_zd_zjc: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0, "生命克制修正": 0, "攻击克制修正": 0, "智力克制修正": 0, "防御克制修正": 0, "魔防克制修正": 0 },  // 初始化士兵战斗总加成 字典
  sb_zdmb: { "生命": 0, "攻击": 0, "防御": 0, "魔防": 0 },  // 初始化士兵战斗面板 字典
  sb_zdmb_klkz: { "生命": 0, "物理攻击": 0, "魔法攻击": 0, "防御": 0, "魔防": 0 },  // 初始化士兵战斗面板（考虑克制加成） 字典
  selected_sb_names: [],
  sbsq_sdsr_pd: true,
  yxbx_sdsr_pd: true,
};
const formData = useRefCache(`${prefix}formData`, JSON.parse(JSON.stringify(defaultFormData)))
const resetFormData = () => {
  formData.value = JSON.parse(JSON.stringify(defaultFormData))
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
    sq_zjc: sq_zjc.value
  }
})

const lz = computed(() => {
  const { zb_jc, bz, fm_bfb, fm_gdz, zyjt, zw, sq_zjc } = allDataObj.value
  const res = {
    生命: round(zb_jc["生命"] + bz["生命"] * fm_bfb["生命"] + fm_gdz["生命"] + zyjt["生命"] + zw["生命"] + sq_zjc["生命"], 1),
    攻击: round(zb_jc["攻击"] + bz["攻击"] * fm_bfb["攻击"] + fm_gdz["攻击"] + zyjt["攻击"] + zw["攻击"] + sq_zjc["攻击"], 1),
    智力: round(zb_jc["智力"] + bz["智力"] * fm_bfb["智力"] + fm_gdz["智力"] + zyjt["智力"] + zw["智力"] + sq_zjc["智力"], 1),
    防御: round(zb_jc["防御"] + bz["防御"] * fm_bfb["防御"] + fm_gdz["防御"] + zyjt["防御"] + zw["防御"] + sq_zjc["防御"], 1),
    魔防: round(zb_jc["魔防"] + bz["魔防"] * fm_bfb["魔防"] + fm_gdz["魔防"] + zyjt["魔防"] + zw["魔防"] + sq_zjc["魔防"], 1),
    技巧: round(zb_jc["技巧"] + zyjt["技巧"] + zw["技巧"] + sq_zjc["技巧"], 1)
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
]
const lzTotalTableData = computed(() => {
  return mianbanList.reduce((res, mb_key) => {
    const keyList = ['bz', 'zb_jc', 'fm_bfb', 'fm_bfb', 'fm_gdz', 'zyjt', 'zw', 'sq_zjc']
    const { zb_jc, bz, fm_bfb, fm_gdz, zyjt, zw, sq_zjc } = keyList.reduce((res, key) => {
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
  return df3.value.find(item => item.士兵名 === current) || df3.value[0]
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

watchEffect(() => {
  if (formData.value.yxbx_sdsr_pd && formData.value.selected_hero_row!=='自定义英雄') {
    formData.value.yx_bx_jc["兵修生命"] = currentSelectedJob.value["兵修生命"]
    formData.value.yx_bx_jc["兵修攻击"] = currentSelectedJob.value["兵修攻击"]
    formData.value.yx_bx_jc["兵修防御"] = currentSelectedJob.value["兵修防御"]
    formData.value.yx_bx_jc["兵修魔防"] = currentSelectedJob.value["兵修魔防"]
  }
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
