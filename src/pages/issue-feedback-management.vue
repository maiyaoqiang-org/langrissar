<template>
  <div class="issue-feedback-management">
    <el-card>
      <div class="header">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="昵称" style="width:240px;">
            <el-input v-model="filterForm.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item label="状态" style="width:240px;">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="待处理" value="pending" />
              <el-option label="已处理" value="processed" />
              <el-option label="忽略" value="ignored" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="nickname" label="昵称" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'pending'" type="warning">待处理</el-tag>
            <el-tag v-else-if="scope.row.status === 'processed'" type="success">已处理</el-tag>
            <el-tag v-else type="info">{{ scope.row.status || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template #default="scope">
            {{ (scope.row.imageUrls || []).length }}
          </template>
        </el-table-column>
        <el-table-column label="视频" width="100">
          <template #default="scope">
            {{ (scope.row.videoUrls || []).length }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button size="small" @click="openDetail(scope.row.id)">查看</el-button>
            <el-button size="small" type="primary" @click="openEdit(scope.row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style=" margin-top: 20px;display: flex;justify-content: flex-end;">
        <el-pagination
          v-model:current-page="filterForm.page"
          v-model:page-size="filterForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>

    <el-dialog v-model="showDialog" :title="dialogTitle" width="60%">
      <div v-if="current">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="ID">{{ current.id }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ current.nickname }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ current.status }}</el-descriptions-item>
          <el-descriptions-item label="问题描述">
            <div style="white-space: pre-wrap;">{{ current.question }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="管理员备注">
            <div v-if="isEditMode">
              <el-input v-model="editForm.adminRemark" type="textarea" :rows="3" maxlength="500" show-word-limit />
            </div>
            <div v-else>{{ current.adminRemark || '-' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="状态更新">
            <div v-if="isEditMode">
              <el-select v-model="editForm.status" placeholder="请选择状态" style="width: 240px;">
                <el-option label="待处理" value="pending" />
                <el-option label="已处理" value="processed" />
                <el-option label="忽略" value="ignored" />
              </el-select>
            </div>
            <div v-else>{{ current.status }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="图片">
            <div v-if="current.imageUrls?.length" style="display:flex; gap: 10px; flex-wrap: wrap;">
              <el-link
                v-for="(url, idx) in current.imageUrls"
                :key="idx"
                :href="url"
                target="_blank"
                rel="noopener noreferrer"
                type="primary"
              >
                图片{{ idx + 1 }}
              </el-link>
            </div>
            <div v-else>-</div>
          </el-descriptions-item>
          <el-descriptions-item label="视频">
            <div v-if="current.videoUrls?.length" style="display:flex; gap: 16px;  flex-wrap: wrap;">
              <el-link
                v-for="(url, idx) in current.videoUrls"
                :key="idx"
                :href="url"
                target="_blank"
                rel="noopener noreferrer"
                type="primary"
              >
                视频{{ idx + 1 }}
              </el-link>
            </div>
            <div v-else>-</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showDialog = false">关闭</el-button>
        <el-button v-if="isEditMode" type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/api/server'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const total = ref(0)

const filterForm = ref({
  nickname: '',
  status: '',
  page: 1,
  pageSize: 10
})

const showDialog = ref(false)
const isEditMode = ref(false)
const dialogTitle = ref('详情')
const current = ref(null)
const editForm = ref({
  status: 'pending',
  adminRemark: ''
})

/** 获取列表 */
const fetchList = async () => {
  const res = await api.post('/issue/admin/query', filterForm.value)
  list.value = res.items || []
  total.value = res.total || 0
}

/** 搜索 */
const handleFilter = () => {
  filterForm.value.page = 1
  fetchList()
}

/** 重置筛选 */
const resetFilter = () => {
  filterForm.value = {
    nickname: '',
    status: '',
    page: 1,
    pageSize: 10
  }
  fetchList()
}

/** 打开详情 */
const openDetail = async (id) => {
  isEditMode.value = false
  dialogTitle.value = '问题反馈详情'
  current.value = await api.get(`/issue/admin/${id}`)
  showDialog.value = true
}

/** 打开编辑 */
const openEdit = async (id) => {
  isEditMode.value = true
  dialogTitle.value = '编辑问题反馈'
  current.value = await api.get(`/issue/admin/${id}`)
  editForm.value = {
    status: current.value.status || 'pending',
    adminRemark: current.value.adminRemark || ''
  }
  showDialog.value = true
}

/** 保存编辑 */
const handleSave = async () => {
  if (!current.value?.id) return
  await api.put(`/issue/admin/${current.value.id}`, editForm.value)
  ElMessage.success('保存成功')
  showDialog.value = false
  fetchList()
}

/** 删除记录 */
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确认删除该记录吗？', '提示', { type: 'warning' })
  await api.delete(`/issue/admin/${id}`)
  ElMessage.success('删除成功')
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>

