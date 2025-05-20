<template>
  <div class="openai-management-page">
    <!-- 顶部操作栏 -->
    <div class="header mb_16">
      <el-button v-has-role="'admin'" type="primary" @click="handleAdd">新增OpenAI配置</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="apiKey" label="API Key" />
      <el-table-column prop="baseURL" label="Base URL" />
      <el-table-column prop="model" label="模型" />
      <el-table-column prop="isActive" label="是否生效">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'info'">
            {{ row.isActive ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column prop="updatedAt" label="更新时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button v-has-role="['admin']" size="small" @click="handleEdit(row)">编辑</el-button>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="API Key" prop="apiKey">
          <el-input v-model="formData.apiKey" placeholder="请输入API Key" />
        </el-form-item>
        <el-form-item label="Base URL" prop="baseURL">
          <el-input v-model="formData.baseURL" placeholder="请输入Base URL" />
        </el-form-item>
        <el-form-item label="模型" prop="model">
          <el-input v-model="formData.model" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="是否生效" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 假设您有对应的 OpenAI API 服务
import { queryOpenAI, createOpenAI, updateOpenAI, deleteOpenAI } from '@/api/server'
// 移除 SelectLoadMoreUser 导入，因为不再需要关联用户字段
// import SelectLoadMoreUser from '@/components/module/SelectLoadMoreUser.vue'

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  apiKey: '',
  baseURL: '', // 添加 baseURL 查询参数
  model: '',
  isActive: undefined // 添加 isActive 查询参数
})

// 表格数据
const tableData = ref([])
const total = ref(0)

// 表单数据
const dialogVisible = ref(false)
const dialogType = ref('add') // add or edit
const formRef = ref(null)
const formData = reactive({
  id: undefined,
  apiKey: '',
  baseURL: '', // 添加 baseURL 表单字段
  model: '',
  isActive: true // 添加 isActive 表单字段，默认true
})

// 表单校验规则
const rules = {
  apiKey: [{ required: true, message: '请输入API Key', trigger: 'blur' }],
  model: [{ required: true, message: '请输入模型名称', trigger: 'blur' }]
  // baseURL 和 isActive 可以根据需要添加校验规则
}

// 计算属性
const dialogTitle = computed(() => {
  return dialogType.value === 'add' ? '新增OpenAI配置' : '编辑OpenAI配置'
})

// 方法
const loadData = async () => {
  try {
    // 替换为实际的 OpenAI 查询 API
    const res = await queryOpenAI(queryParams)
    tableData.value = res.items
    total.value = res.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(formData, {
    id: undefined,
    apiKey: '',
    baseURL: '', // 重置 baseURL
    model: '',
    isActive: true // 重置 isActive
  })
  dialogVisible.value = true
}

// 移除用户选择组件引用
// const userSelect = ref(null)

const handleEdit = async (row) => {
  dialogType.value = 'edit'
  Object.assign(formData, {
    id: row.id,
    apiKey: row.apiKey,
    baseURL: row.baseURL, // 填充 baseURL
    model: row.model,
    isActive: row.isActive // 填充 isActive
  })

  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      // 替换为实际的 OpenAI 删除 API
      await deleteOpenAI(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          // 替换为实际的 OpenAI 创建 API
          await createOpenAI(formData)
        } else {
          // 替换为实际的 OpenAI 更新 API
          await updateOpenAI(formData.id, formData)
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

const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val
  loadData()
}

const handleCurrentChange = (val) => {
  queryParams.page = val
  loadData()
}

// 初始化
loadData()

</script>

<style scoped lang="scss">
.openai-management-page {
  padding: 20px;

  .mr_8 {
    margin-right: 8px;
  }

  .mb_16 {
    margin-bottom: 16px;
  }

  .mt_16 {
    margin-top: 16px;
  }
}
</style>