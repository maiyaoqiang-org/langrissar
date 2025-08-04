<template>
  <div class="used-cdkey-management">
    <div class="header">
      <h1>CDKEY使用记录管理</h1>
      <el-button type="primary" @click="showAddDialog = true">新增记录</el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchCdkey"
        placeholder="请输入CDKEY搜索"
        style="width: 300px; margin-right: 10px"
        @keyup.enter="fetchData"
      />
      <el-button type="primary" @click="fetchData">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="cdkey" label="CDKEY" />
      <el-table-column prop="usedAt" label="使用时间">
        <template #default="scope">
          {{ formatDate(scope.row.usedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="total, prev, pager, next"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑记录' : '新增记录'"
      width="400px"
    >
      <el-form :model="formData" label-width="80px">
        <el-form-item label="CDKEY">
          <el-input v-model="formData.cdkey" placeholder="请输入CDKEY" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>



<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getUsedCdkeys,
  createUsedCdkey,
  updateUsedCdkey,
  deleteUsedCdkey,
} from '@/api/server.js'

// 数据
const tableData = ref([])
const loading = ref(false)
const searchCdkey = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const showAddDialog = ref(false)
const isEdit = ref(false)
const formData = ref({
  id: null,
  cdkey: ''
})
const submitLoading = ref(false)

// 获取所有记录（带分页）
const fetchData = async () => {
  loading.value = true
  try {
    const response = await getUsedCdkeys(currentPage.value, pageSize.value, searchCdkey.value)
    tableData.value = response.data
    total.value = response.total
  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}


// 重置搜索
const resetSearch = () => {
  searchCdkey.value = ''
  currentPage.value = 1
  fetchData()
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  formData.value = {
    id: row.id,
    cdkey: row.cdkey
  }
  showAddDialog.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteUsedCdkey(row.id)
    ElMessage.success('删除成功')
    // 删除后重新获取数据，处理最后一页只剩一条记录的情况
    if (tableData.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formData.value.cdkey.trim()) {
    ElMessage.warning('请输入CDKEY')
    return
  }

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateUsedCdkey(formData.value.id, formData.value.cdkey)
      ElMessage.success('更新成功')
    } else {
      await createUsedCdkey(formData.value.cdkey)
      ElMessage.success('创建成功')
    }
    
    showAddDialog.value = false
    // 创建/更新后跳转到最后一页或当前页
    if (!isEdit.value) {
      // 新增时计算新数据应该在哪一页
      const newTotal = total.value + 1
      const newPage = Math.ceil(newTotal / pageSize.value)
      currentPage.value = newPage
    }
    fetchData()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 分页变化处理
const handlePageChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 每页条数变化处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 监听对话框关闭
const handleDialogClose = () => {
  formData.value = {
    id: null,
    cdkey: ''
  }
  isEdit.value = false
}

// 监听
watch(() => showAddDialog.value, (newVal) => {
  if (!newVal) {
    handleDialogClose()
  }
})

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.used-cdkey-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>