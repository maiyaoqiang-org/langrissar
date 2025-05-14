<template>
  <div class="coze-page">
    <!-- 顶部操作栏 -->
    <div class="header mb_16">
      <el-button v-has-role="'admin'" type="primary" @click="handleAdd">新增Coze</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="botId" label="Bot ID" />
      <el-table-column prop="needAuth" label="需要认证">
        <template #default="{ row }">
          <el-tag :type="row.needAuth ? 'success' : 'info'">
            {{ row.needAuth ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="users" label="关联用户">
        <template #default="{ row }">
          <el-tag v-for="user in row.users" :key="user.id" class="mr_8">
            {{ user.username }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column prop="updatedAt" label="更新时间" />
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button v-has-role="['admin']" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button v-has-role="'admin'" size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          <el-button size="small" type="success" @click="handleLoadBot(row)">加载机器人</el-button>
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
        label-width="100px"
      >
        <el-form-item label="Bot ID" prop="botId">
          <el-input v-model="formData.botId" placeholder="请输入Bot ID" />
        </el-form-item>
        <el-form-item label="Token" prop="token">
          <el-input v-model="formData.token" placeholder="请输入Token" />
        </el-form-item>
        <el-form-item label="需要认证" prop="needAuth">
          <el-switch v-model="formData.needAuth" />
        </el-form-item>
        <el-form-item label="关联用户" prop="userIds">
          <select-load-more-user
            ref="userSelect"
            v-model="formData.userIds"
            multiple
            placeholder="请选择关联用户"
          />
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
import { ref, reactive, computed, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { loadBot } from '@/utils'
import { queryCoze, createCoze, updateCoze, deleteCoze } from '@/api/server'
import SelectLoadMoreUser from '@/components/module/SelectLoadMoreUser.vue'

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  botId: '',
  needAuth: undefined
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
  botId: '',
  token: '',
  needAuth: false,
  userIds: []
})

// 用户选项数据（需要从后端获取）
const userOptions = ref([])

// 表单校验规则
const rules = {
  botId: [{ required: true, message: '请输入Bot ID', trigger: 'blur' }],
  token: [{ required: true, message: '请输入Token', trigger: 'blur' }]
}

// 计算属性
const dialogTitle = computed(() => {
  return dialogType.value === 'add' ? '新增Coze' : '编辑Coze'
})

// 方法
const loadData = async () => {
  try {
    const res = await queryCoze(queryParams)
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
    botId: '',
    token: '',
    needAuth: false,
    userIds: []
  })
  dialogVisible.value = true
}

// 用户选择组件引用
const userSelect = ref(null)

const handleEdit = async (row) => {
  dialogType.value = 'edit'
  Object.assign(formData, {
    id: row.id,
    botId: row.botId,
    token: row.token,
    needAuth: row.needAuth,
    userIds: row.users?.map(user => user.id) || []
  })
  
  dialogVisible.value = true

  await nextTick()
  // 设置初始选项
  if (userSelect.value && row.users?.length) {
    userSelect.value.setInitOptions(row.users)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCoze(row.id)
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
          await createCoze(formData)
        } else {
          await updateCoze(formData.id, formData)
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

// 保存当前加载的机器人实例
const currentBot = ref(null)

// 加载机器人
const handleLoadBot = async (row) => {
  try {
    // 如果已经有机器人在运行，先关闭它
    if (currentBot.value) {
      currentBot.value.hideChatBot()
      currentBot.value = null
    }
    
    // 加载新的机器人
    const bot = await loadBot(row.botId, row.token)
    currentBot.value = bot
    
    ElMessage.success('机器人加载成功')
  } catch (error) {
    ElMessage.error('机器人加载失败')
    console.error('加载机器人失败:', error)
  }
}

// 页面离开前清理
onBeforeUnmount(() => {
  if (currentBot.value) {
    currentBot.value.hideChatBot()
    currentBot.value = null
  }
})
</script>

<style scoped lang="scss">
.coze-page {
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