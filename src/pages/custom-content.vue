<template>
  <div class="custom-content-page">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="内容管理" name="management">
        <!-- 搜索栏 -->
        <div class="filter-bar mb_16">
      <el-input v-model="queryParams.key" placeholder="标识键" clearable style="width: 160px" class="mr_8" />
      <el-input v-model="queryParams.title" placeholder="标题" clearable style="width: 160px" class="mr_8" />
      <el-select v-model="queryParams.contentType" placeholder="内容类型" clearable style="width: 130px" class="mr_8">
        <el-option label="text" value="text" />
        <el-option label="json" value="json" />
        <el-option label="key-value" value="key-value" />
      </el-select>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button v-has-role="'admin'" type="primary" @click="handleAdd">新增</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="key" label="标识键" width="180">
        <template #default="{ row }">
          <span>{{ row.key || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="contentType" label="内容类型" width="110">
        <template #default="{ row }">
          <el-tag :type="contentTypeTagMap[row.contentType] || 'info'" size="small">
            {{ row.contentType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
      <el-table-column prop="isActive" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-has-role="'admin'"
            :model-value="row.isActive"
            @change="handleToggle(row)"
            active-text="启用"
            inactive-text="停用"
          />
          <el-tag v-if="false" :type="row.isActive ? 'success' : 'info'" size="small">
            {{ row.isActive ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="160" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.description || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="160" />
      <el-table-column prop="updatedAt" label="更新时间" width="160" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">查看</el-button>
          <el-button v-has-role="'admin'" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button v-has-role="'admin'" size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="700px"
      @close="handleDialogClose"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标识键" prop="key">
          <el-input v-model="formData.key" placeholder="唯一标识键，如 app-config（可选）" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容类型" prop="contentType">
          <el-select v-model="formData.contentType" placeholder="请选择内容类型">
            <el-option label="text" value="text" />
            <el-option label="json" value="json" />
            <el-option label="key-value" value="key-value" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="8"
            placeholder="请输入内容，支持JSON字符串、普通文本等"
          />
        </el-form-item>
        <el-form-item label="描述说明" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="描述说明（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      title="查看内容详情"
      v-model="viewDialogVisible"
      width="700px"
      destroy-on-close
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ viewData.id }}</el-descriptions-item>
        <el-descriptions-item label="标识键">{{ viewData.key || '-' }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ viewData.title }}</el-descriptions-item>
        <el-descriptions-item label="内容类型">{{ viewData.contentType }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="viewData.isActive ? 'success' : 'info'" size="small">
            {{ viewData.isActive ? '启用' : '停用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ viewData.description || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewData.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ viewData.updatedAt }}</el-descriptions-item>
      </el-descriptions>
      <div class="mt_16">
        <div class="mb_8" style="font-weight: bold;">内容：</div>
        <el-input
          :model-value="viewData.content"
          type="textarea"
          :rows="10"
          readonly
        />
      </div>
      <template #footer>
        <el-button type="primary" @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="外部使用说明" name="guide">
        <div class="guide-content">
          <el-card class="mb_16">
            <template #header>
              <span class="card-title">接口说明</span>
            </template>
            <p>自定义内容模块提供了两个<strong>无需鉴权</strong>的公开接口，外部系统可以直接通过 HTTP GET 请求获取内容，无需携带 Token。</p>
          </el-card>

          <el-card class="mb_16">
            <template #header>
              <span class="card-title">根据ID查询内容</span>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="请求方式">GET</el-descriptions-item>
              <el-descriptions-item label="请求地址">
                <code class="api-url">https://maiyaoqiang.fun/api/custom-content/public/id/{id}</code>
              </el-descriptions-item>
              <el-descriptions-item label="路径参数">
                <el-table :data="[{ param: 'id', type: 'string (UUID)', required: '是', desc: '自定义内容的UUID' }]" border size="small">
                  <el-table-column prop="param" label="参数名" width="100" />
                  <el-table-column prop="type" label="类型" width="120" />
                  <el-table-column prop="required" label="必填" width="80" />
                  <el-table-column prop="desc" label="说明" />
                </el-table>
              </el-descriptions-item>
              <el-descriptions-item label="请求示例">
                <pre class="code-block">GET https://maiyaoqiang.fun/api/custom-content/public/id/a1b2c3d4-e5f6-7890-abcd-ef1234567890</pre>
              </el-descriptions-item>
              <el-descriptions-item label="响应示例">
                <pre class="code-block">{
  "code": 0,
  "message": "success",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "key": "app-config",
    "title": "应用配置",
    "content": "{\"theme\": \"dark\", \"lang\": \"zh\"}",
    "contentType": "json",
    "description": "应用全局配置",
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-01-01 00:00:00"
  }
}</pre>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card class="mb_16">
            <template #header>
              <span class="card-title">根据标识键查询内容</span>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="请求方式">GET</el-descriptions-item>
              <el-descriptions-item label="请求地址">
                <code class="api-url">https://maiyaoqiang.fun/api/custom-content/public/key/{key}</code>
              </el-descriptions-item>
              <el-descriptions-item label="路径参数">
                <el-table :data="[{ param: 'key', type: 'string', required: '是', desc: '自定义内容的唯一标识键' }]" border size="small">
                  <el-table-column prop="param" label="参数名" width="100" />
                  <el-table-column prop="type" label="类型" width="80" />
                  <el-table-column prop="required" label="必填" width="80" />
                  <el-table-column prop="desc" label="说明" />
                </el-table>
              </el-descriptions-item>
              <el-descriptions-item label="请求示例">
                <pre class="code-block">GET https://maiyaoqiang.fun/api/custom-content/public/key/app-config</pre>
              </el-descriptions-item>
              <el-descriptions-item label="响应示例">
                <pre class="code-block">{
  "code": 0,
  "message": "success",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "key": "app-config",
    "title": "应用配置",
    "content": "{\"theme\": \"dark\", \"lang\": \"zh\"}",
    "contentType": "json",
    "description": "应用全局配置",
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-01-01 00:00:00"
  }
}</pre>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card class="mb_16">
            <template #header>
              <span class="card-title">调用示例</span>
            </template>
            <div class="mb_8"><strong>curl：</strong></div>
            <pre class="code-block"># 根据ID查询
curl https://maiyaoqiang.fun/api/custom-content/public/id/a1b2c3d4-e5f6-7890-abcd-ef1234567890

# 根据key查询
curl https://maiyaoqiang.fun/api/custom-content/public/key/app-config</pre>
            <div class="mt_16 mb_8"><strong>JavaScript (fetch)：</strong></div>
            <pre class="code-block">// 根据ID查询
const res = await fetch('https://maiyaoqiang.fun/api/custom-content/public/id/a1b2c3d4-e5f6-7890-abcd-ef1234567890');
const data = await res.json();

// 根据key查询
const res = await fetch('https://maiyaoqiang.fun/api/custom-content/public/key/app-config');
const data = await res.json();</pre>
          </el-card>

          <el-card>
            <template #header>
              <span class="card-title">注意事项</span>
            </template>
            <ul>
              <li>公开接口<strong>无需鉴权</strong>，不需要携带 Token，任何人都可以访问。</li>
              <li>如果查询的 ID 或 key 不存在，接口会返回错误信息。</li>
              <li>请妥善管理内容，不要在自定义内容中存储敏感信息（如密钥、密码等）。</li>
            </ul>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryCustomContent, createCustomContent, updateCustomContent, deleteCustomContent, toggleCustomContent } from '@/api/server'

const activeTab = ref('management')

const contentTypeTagMap = {
  text: '',
  json: 'success',
  'key-value': 'warning'
}

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  key: '',
  title: '',
  contentType: ''
})

const tableData = ref([])
const total = ref(0)

const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const formData = reactive({
  id: undefined,
  key: '',
  title: '',
  content: '',
  contentType: 'text',
  description: ''
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  contentType: [{ required: true, message: '请选择内容类型', trigger: 'change' }]
}

const dialogTitle = computed(() => {
  return dialogType.value === 'add' ? '新增自定义内容' : '编辑自定义内容'
})

const viewDialogVisible = ref(false)
const viewData = ref({})

/** 加载列表数据 */
const loadData = async () => {
  try {
    const res = await queryCustomContent(queryParams)
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

/** 搜索 */
const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

/** 重置搜索 */
const handleReset = () => {
  queryParams.key = ''
  queryParams.title = ''
  queryParams.contentType = ''
  queryParams.page = 1
  loadData()
}

/** 新增 */
const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(formData, {
    id: undefined,
    key: '',
    title: '',
    content: '',
    contentType: 'text',
    description: ''
  })
  dialogVisible.value = true
}

/** 编辑 */
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(formData, {
    id: row.id,
    key: row.key,
    title: row.title,
    content: row.content,
    contentType: row.contentType,
    description: row.description
  })
  dialogVisible.value = true
}

/** 查看详情 */
const handleView = (row) => {
  viewData.value = row
  viewDialogVisible.value = true
}

/** 切换启用/停用状态 */
const handleToggle = async (row) => {
  try {
    await toggleCustomContent(row.id)
    ElMessage.success(row.isActive ? '已停用' : '已启用')
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

/** 删除 */
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条自定义内容吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCustomContent(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

/** 提交表单 */
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createCustomContent(formData)
        } else {
          await updateCustomContent(formData.id, formData)
        }
        ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
        dialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '新增失败' : '更新失败')
      }
    }
  })
}

/** 弹窗关闭重置表单 */
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

loadData()
</script>

<style scoped>
.custom-content-page {
  padding: 16px;
}

.guide-content {
  max-width: 900px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.api-url {
  background: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
  color: #409eff;
  font-size: 13px;
}

.code-block {
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.guide-content ul {
  padding-left: 20px;
  line-height: 2;
}

.guide-content code {
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}
</style>
