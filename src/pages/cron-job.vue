<template>
  <div class="cron-job-page">
    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="任务管理" name="management">
        <div class="header mb_16">
          <el-button type="primary" @click="handleAdd">新增定时任务</el-button>
        </div>

        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="任务名称" width="150" />
          <el-table-column prop="taskType" label="任务类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.taskType === 'url' ? 'primary' : 'success'">
                {{ row.taskType === 'url' ? 'URL请求' : 'CURL命令' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cronExpression" label="Cron表达式" width="150">
            <template #default="{ row }">
              <el-tooltip :content="row.cronDescription" placement="top">
                <span class="cron-expression">{{ row.cronExpression }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                :model-value="row.status === 1"
                @change="handleToggleStatus(row)"
                active-text="启用"
                inactive-text="禁用"
              />
            </template>
          </el-table-column>
          <el-table-column label="执行统计" width="150">
            <template #default="{ row }">
              <span>共{{ row.runCount }}次</span>
              <el-tag type="success" size="small" class="ml_4">{{ row.successCount }}</el-tag>
              <el-tag type="danger" size="small" class="ml_4">{{ row.failCount }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastRunTime" label="上次执行" width="160" />
          <el-table-column prop="nextRunTime" label="下次执行" width="160" />
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="success" @click="handleExecute(row)">立即执行</el-button>
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="info" @click="handleViewLogs(row)">日志</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination mt_16" flex="main:right">
          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="loadData"
            @current-change="loadData"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="执行日志" name="logs">
        <div class="filter-bar mb_16">
          <el-select v-model="logQueryParams.cronJobId" placeholder="选择任务" clearable style="width: 200px" class="mr_8">
            <el-option v-for="job in allJobs" :key="job.id" :label="job.name" :value="job.id" />
          </el-select>
          <el-select v-model="logQueryParams.status" placeholder="执行状态" clearable style="width: 120px" class="mr_8">
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
          </el-select>
          <el-date-picker
            v-model="logDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px"
            class="mr_8"
          />
          <el-button type="primary" @click="loadLogs">查询</el-button>
        </div>

        <el-table :data="logData" border style="width: 100%">
          <el-table-column prop="cronJob.name" label="任务名称" width="150" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'success' ? 'success' : row.status === 'failed' ? 'danger' : 'warning'">
                {{ row.status === 'success' ? '成功' : row.status === 'failed' ? '失败' : '运行中' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="160" />
          <el-table-column prop="endTime" label="结束时间" width="160" />
          <el-table-column prop="duration" label="耗时(ms)" width="100" />
          <el-table-column prop="statusCode" label="HTTP状态" width="100" />
          <el-table-column prop="retryTimes" label="重试次数" width="100" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small" @click="handleViewLogDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination mt_16" flex="main:right">
          <el-pagination
            v-model:current-page="logQueryParams.page"
            v-model:page-size="logQueryParams.pageSize"
            :total="logTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="loadLogs"
            @current-change="loadLogs"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="使用帮助" name="help">
        <div class="help-content">
          <el-card class="mb_16">
            <template #header>
              <span class="card-title">什么是定时任务？</span>
            </template>
            <p>定时任务可以让系统在指定的时间自动执行您配置的操作，比如定期调用某个API接口、执行某个脚本等。</p>
          </el-card>

          <el-card class="mb_16">
            <template #header>
              <span class="card-title">Cron表达式说明</span>
            </template>
            <p>Cron表达式用于定义任务的执行时间，格式为：<code>秒 分 时 日 月 周</code></p>
            <el-table :data="cronExamples" border size="small">
              <el-table-column prop="expression" label="表达式" width="180" />
              <el-table-column prop="description" label="含义" />
            </el-table>
            <div class="mt_16">
              <p><strong>特殊字符说明：</strong></p>
              <ul>
                <li><code>*</code> - 所有值</li>
                <li><code>?</code> - 不指定值（用于日和周）</li>
                <li><code>-</code> - 范围，如 1-5</li>
                <li><code>,</code> - 列举，如 1,3,5</li>
                <li><code>/</code> - 增量，如 0/15 表示从0开始每15单位</li>
              </ul>
            </div>
          </el-card>

          <el-card class="mb_16">
            <template #header>
              <span class="card-title">任务类型说明</span>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="URL请求">
                直接填写目标URL地址，系统会按照配置的HTTP方法（GET/POST等）发起请求。适合调用REST API接口。
              </el-descriptions-item>
              <el-descriptions-item label="CURL命令">
                填写完整的curl命令，支持复杂的请求配置，如自定义请求头、请求体等。适合需要精细控制请求的场景。
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card>
            <template #header>
              <span class="card-title">CURL命令示例</span>
            </template>
            <el-alert type="info" :closable="false" class="mb_16">
              <p>您可以从浏览器开发者工具中复制curl命令：</p>
              <p>1. 打开开发者工具 (F12)</p>
              <p>2. 切换到 Network 标签</p>
              <p>3. 右键点击请求 → Copy → Copy as cURL</p>
            </el-alert>
            <pre class="code-block">curl -X POST "https://api.example.com/data" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{"key": "value"}'</pre>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      @close="handleDialogClose"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item label="任务描述">
          <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="请输入任务描述" />
        </el-form-item>

        <el-form-item label="Cron表达式" prop="cronExpression">
          <div class="cron-input-wrapper">
            <el-input v-model="formData.cronExpression" placeholder="例如: 0 0 9 * * *" @blur="validateCron" class="mr_8" />
            <el-button @click="showCronHelper = true">可视化配置</el-button>
          </div>
          <div v-if="cronValidation" class="cron-validation mt_8">
            <el-tag v-if="cronValidation.valid" type="success">{{ cronValidation.description }}</el-tag>
            <el-tag v-else type="danger">{{ cronValidation.error }}</el-tag>
            <div v-if="cronValidation.valid && cronValidation.nextRuns" class="next-runs mt_8">
              <span class="text-muted">接下来5次执行时间：</span>
              <ul class="next-runs-list">
                <li v-for="(time, index) in cronValidation.nextRuns" :key="index">{{ time }}</li>
              </ul>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="任务类型" prop="taskType">
          <el-radio-group v-model="formData.taskType">
            <el-radio value="url">URL请求</el-radio>
            <el-radio value="curl">CURL命令</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="formData.taskType === 'url'">
          <el-form-item label="目标URL" prop="targetUrl">
            <el-input v-model="formData.targetUrl" placeholder="请输入目标URL地址" />
          </el-form-item>
          <el-form-item label="请求方法">
            <el-select v-model="formData.httpMethod" style="width: 120px">
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="DELETE" value="DELETE" />
              <el-option label="PATCH" value="PATCH" />
            </el-select>
          </el-form-item>
          <el-form-item label="请求头">
            <el-input
              v-model="formData.headers"
              type="textarea"
              :rows="3"
              placeholder='JSON格式，例如: {"Content-Type": "application/json"}'
            />
          </el-form-item>
          <el-form-item label="请求体" v-if="['POST', 'PUT', 'PATCH'].includes(formData.httpMethod)">
            <el-input
              v-model="formData.body"
              type="textarea"
              :rows="4"
              placeholder="请求体内容"
            />
          </el-form-item>
        </template>

        <template v-if="formData.taskType === 'curl'">
          <el-form-item label="CURL命令" prop="curlCommand">
            <el-input
              v-model="formData.curlCommand"
              type="textarea"
              :rows="6"
              placeholder="请输入完整的curl命令（支持从浏览器直接复制）"
            />
          </el-form-item>
        </template>

        <el-form-item label="超时时间">
          <el-input-number v-model="formData.timeout" :min="1000" :max="300000" :step="1000" />
          <span class="ml_8 text-muted">毫秒</span>
        </el-form-item>

        <el-form-item label="失败重试">
          <el-input-number v-model="formData.retryCount" :min="0" :max="10" />
          <span class="ml_8 text-muted">次</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="Cron表达式可视化配置"
      v-model="showCronHelper"
      width="600px"
    >
      <div class="cron-helper">
        <el-form label-width="80px">
          <el-form-item label="执行频率">
            <el-select v-model="cronPreset" @change="applyCronPreset">
              <el-option label="每分钟" value="everyMinute" />
              <el-option label="每小时" value="everyHour" />
              <el-option label="每天固定时间" value="everyDay" />
              <el-option label="每周固定时间" value="everyWeek" />
              <el-option label="每月固定时间" value="everyMonth" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>

          <template v-if="cronPreset === 'everyDay'">
            <el-form-item label="执行时间">
              <el-time-picker v-model="cronTime" format="HH:mm" placeholder="选择时间" />
            </el-form-item>
          </template>

          <template v-if="cronPreset === 'everyWeek'">
            <el-form-item label="星期">
              <el-select v-model="cronDayOfWeek" placeholder="选择星期">
                <el-option label="周日" :value="0" />
                <el-option label="周一" :value="1" />
                <el-option label="周二" :value="2" />
                <el-option label="周三" :value="3" />
                <el-option label="周四" :value="4" />
                <el-option label="周五" :value="5" />
                <el-option label="周六" :value="6" />
              </el-select>
            </el-form-item>
            <el-form-item label="执行时间">
              <el-time-picker v-model="cronTime" format="HH:mm" placeholder="选择时间" />
            </el-form-item>
          </template>

          <template v-if="cronPreset === 'everyMonth'">
            <el-form-item label="日期">
              <el-select v-model="cronDayOfMonth" placeholder="选择日期">
                <el-option v-for="d in 31" :key="d" :label="`${d}号`" :value="d" />
              </el-select>
            </el-form-item>
            <el-form-item label="执行时间">
              <el-time-picker v-model="cronTime" format="HH:mm" placeholder="选择时间" />
            </el-form-item>
          </template>

          <template v-if="cronPreset === 'custom'">
            <el-form-item label="秒">
              <el-input v-model="customCron.second" placeholder="0-59 或 *" />
            </el-form-item>
            <el-form-item label="分">
              <el-input v-model="customCron.minute" placeholder="0-59 或 *" />
            </el-form-item>
            <el-form-item label="时">
              <el-input v-model="customCron.hour" placeholder="0-23 或 *" />
            </el-form-item>
            <el-form-item label="日">
              <el-input v-model="customCron.day" placeholder="1-31 或 *" />
            </el-form-item>
            <el-form-item label="月">
              <el-input v-model="customCron.month" placeholder="1-12 或 *" />
            </el-form-item>
            <el-form-item label="周">
              <el-input v-model="customCron.week" placeholder="0-6 或 ?" />
            </el-form-item>
          </template>
        </el-form>

        <div class="cron-preview mt_16">
          <el-alert type="info" :closable="false">
            <template #title>
              生成的表达式：<strong>{{ generatedCron }}</strong>
            </template>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <el-button @click="showCronHelper = false">取消</el-button>
        <el-button type="primary" @click="applyGeneratedCron">应用</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="执行日志详情"
      v-model="logDetailVisible"
      width="700px"
    >
      <el-descriptions :column="2" border v-if="currentLog">
        <el-descriptions-item label="任务名称">{{ currentLog.cronJob?.name }}</el-descriptions-item>
        <el-descriptions-item label="执行状态">
          <el-tag :type="currentLog.status === 'success' ? 'success' : 'danger'">
            {{ currentLog.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentLog.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentLog.endTime }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentLog.duration }}ms</el-descriptions-item>
        <el-descriptions-item label="HTTP状态码">{{ currentLog.statusCode }}</el-descriptions-item>
        <el-descriptions-item label="重试次数">{{ currentLog.retryTimes }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="currentLog?.response" class="mt_16">
        <div class="section-title">响应结果</div>
        <pre class="code-block">{{ currentLog.response }}</pre>
      </div>

      <div v-if="currentLog?.errorMessage" class="mt_16">
        <div class="section-title">错误信息</div>
        <el-alert type="error" :closable="false">
          {{ currentLog.errorMessage }}
        </el-alert>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  queryCronJobs,
  createCronJob,
  updateCronJob,
  deleteCronJob,
  toggleCronJobStatus,
  executeCronJob,
  queryCronJobLogs,
  validateCronExpression,
} from '@/api/server'

const activeTab = ref('management')

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  name: '',
})

const tableData = ref([])
const total = ref(0)

const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const submitLoading = ref(false)

const formData = reactive({
  id: undefined,
  name: '',
  description: '',
  cronExpression: '',
  cronDescription: '',
  taskType: 'url',
  targetUrl: '',
  httpMethod: 'GET',
  headers: '',
  body: '',
  curlCommand: '',
  timeout: 30000,
  retryCount: 0,
})

const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  cronExpression: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  targetUrl: [{ required: true, message: '请输入目标URL', trigger: 'blur' }],
  curlCommand: [{ required: true, message: '请输入CURL命令', trigger: 'blur' }],
}

const dialogTitle = computed(() => {
  return dialogType.value === 'add' ? '新增定时任务' : '编辑定时任务'
})

const cronValidation = ref(null)

const showCronHelper = ref(false)
const cronPreset = ref('everyDay')
const cronTime = ref(new Date(2024, 0, 1, 9, 0))
const cronDayOfWeek = ref(1)
const cronDayOfMonth = ref(1)
const customCron = reactive({
  second: '0',
  minute: '*',
  hour: '*',
  day: '*',
  month: '*',
  week: '?',
})

const logQueryParams = reactive({
  page: 1,
  pageSize: 10,
  cronJobId: undefined,
  status: undefined,
  startDate: undefined,
  endDate: undefined,
})

const logDateRange = ref([])
const logData = ref([])
const logTotal = ref(0)
const allJobs = ref([])

const logDetailVisible = ref(false)
const currentLog = ref(null)

const cronExamples = [
  { expression: '0 * * * * *', description: '每分钟执行' },
  { expression: '0 0 * * * *', description: '每小时执行' },
  { expression: '0 0 9 * * *', description: '每天早上9点执行' },
  { expression: '0 0 9,18 * * *', description: '每天早上9点和下午6点执行' },
  { expression: '0 0 9 * * 1-5', description: '周一到周五早上9点执行' },
  { expression: '0 0 9 * * 1', description: '每周一早上9点执行' },
  { expression: '0 0 9 1 * *', description: '每月1号早上9点执行' },
  { expression: '0 */30 * * * *', description: '每30分钟执行' },
]

const generatedCron = computed(() => {
  const hour = cronTime.value ? new Date(cronTime.value).getHours() : 0
  const minute = cronTime.value ? new Date(cronTime.value).getMinutes() : 0

  switch (cronPreset.value) {
    case 'everyMinute':
      return '0 * * * * *'
    case 'everyHour':
      return '0 0 * * * *'
    case 'everyDay':
      return `0 ${minute} ${hour} * * *`
    case 'everyWeek':
      return `0 ${minute} ${hour} * * ${cronDayOfWeek.value}`
    case 'everyMonth':
      return `0 ${minute} ${hour} ${cronDayOfMonth.value} * *`
    case 'custom':
      return `${customCron.second} ${customCron.minute} ${customCron.hour} ${customCron.day} ${customCron.month} ${customCron.week}`
    default:
      return ''
  }
})

const loadData = async () => {
  try {
    const res = await queryCronJobs(queryParams)
    tableData.value = res.items
    total.value = res.total
    allJobs.value = res.items
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const loadLogs = async () => {
  try {
    if (logDateRange.value && logDateRange.value.length === 2) {
      logQueryParams.startDate = logDateRange.value[0]
      logQueryParams.endDate = logDateRange.value[1]
    } else {
      logQueryParams.startDate = undefined
      logQueryParams.endDate = undefined
    }
    const res = await queryCronJobLogs(logQueryParams)
    logData.value = res.items
    logTotal.value = res.total
  } catch (error) {
    ElMessage.error('加载日志失败')
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(formData, {
    id: undefined,
    name: '',
    description: '',
    cronExpression: '',
    cronDescription: '',
    taskType: 'url',
    targetUrl: '',
    httpMethod: 'GET',
    headers: '',
    body: '',
    curlCommand: '',
    timeout: 30000,
    retryCount: 0,
  })
  cronValidation.value = null
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  dialogType.value = 'edit'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    description: row.description,
    cronExpression: row.cronExpression,
    cronDescription: row.cronDescription,
    taskType: row.taskType,
    targetUrl: row.targetUrl,
    httpMethod: row.httpMethod || 'GET',
    headers: row.headers,
    body: row.body,
    curlCommand: row.curlCommand,
    timeout: row.timeout || 30000,
    retryCount: row.retryCount || 0,
  })
  validateCron()
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该定时任务吗？', '提示', {
    type: 'warning',
  }).then(async () => {
    try {
      await deleteCronJob(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleToggleStatus = async (row) => {
  try {
    const res = await toggleCronJobStatus(row.id)
    ElMessage.success(res.status === 1 ? '任务已启用' : '任务已禁用')
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleExecute = async (row) => {
  try {
    ElMessage.info('任务开始执行...')
    const result = await executeCronJob(row.id)
    if (result.status === 'success') {
      ElMessage.success('任务执行成功')
    } else {
      ElMessage.error('任务执行失败: ' + result.errorMessage)
    }
    loadData()
  } catch (error) {
    ElMessage.error('执行失败')
  }
}

const handleViewLogs = (row) => {
  activeTab.value = 'logs'
  logQueryParams.cronJobId = row.id
  loadLogs()
}

const handleViewLogDetail = (row) => {
  currentLog.value = row
  logDetailVisible.value = true
}

const validateCron = async () => {
  if (!formData.cronExpression) {
    cronValidation.value = null
    return
  }
  try {
    cronValidation.value = await validateCronExpression(formData.cronExpression)
  } catch (error) {
    cronValidation.value = { valid: false, error: '验证失败' }
  }
}

const applyCronPreset = () => {
  if (cronPreset.value !== 'custom') {
    Object.assign(customCron, {
      second: '0',
      minute: '*',
      hour: '*',
      day: '*',
      month: '*',
      week: '?',
    })
  }
}

const applyGeneratedCron = () => {
  formData.cronExpression = generatedCron.value
  validateCron()
  showCronHelper.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const data = { ...formData }
        if (data.taskType === 'url') {
          data.curlCommand = undefined
        } else {
          data.targetUrl = undefined
          data.httpMethod = undefined
          data.headers = undefined
          data.body = undefined
        }

        if (dialogType.value === 'add') {
          await createCronJob(data)
        } else {
          await updateCronJob(data.id, data)
        }

        ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
        dialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '新增失败' : '更新失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  cronValidation.value = null
}

watch(activeTab, (val) => {
  if (val === 'logs') {
    loadLogs()
  }
})

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.cron-job-page {
  padding: 20px;

  .mb_16 {
    margin-bottom: 16px;
  }

  .mt_16 {
    margin-top: 16px;
  }

  .mt_8 {
    margin-top: 8px;
  }

  .ml_4 {
    margin-left: 4px;
  }

  .ml_8 {
    margin-left: 8px;
  }

  .mr_8 {
    margin-right: 8px;
  }

  .text-muted {
    color: #909399;
    font-size: 12px;
  }

  .cron-expression {
    cursor: pointer;
    color: #409eff;
  }

  .cron-input-wrapper {
    display: flex;
    width: 100%;
  }

  .cron-validation {
    .next-runs {
      font-size: 12px;
      .next-runs-list {
        margin: 4px 0 0 0;
        padding-left: 20px;
        li {
          margin: 2px 0;
        }
      }
    }
  }

  .help-content {
    max-width: 900px;

    .card-title {
      font-weight: bold;
      font-size: 16px;
    }

    p {
      line-height: 1.8;
    }

    ul {
      padding-left: 20px;
      li {
        line-height: 2;
      }
    }

    code {
      background: #f5f7fa;
      padding: 2px 6px;
      border-radius: 4px;
      color: #e6a23c;
    }
  }

  .code-block {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .section-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #303133;
  }

  .cron-helper {
    .el-form-item {
      margin-bottom: 16px;
    }
  }

}
</style>
