<template>
  <div class="zlvip-management">
    <el-card>
      <div class="header">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="名称" style="width:280px;">
            <el-input v-model="filterForm.name" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleAdd">添加zlvip账号</el-button>
      </div>

      <el-table :data="zlvipList" border style="width: 100%">
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column prop="updatedAt" label="更新时间" />
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style=" margin-top: 20px;display: flex;justify-content: flex-end;">
        <el-pagination v-model:current-page="filterForm.page" v-model:page-size="filterForm.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next"
          @size-change="fetchZlVips" @current-change="fetchZlVips" />
      </div>
    </el-card>

    <el-dialog v-model="showDialog" width="800px">
      <template #header>
        <span>{{ dialogType === 'add' ? '添加zlvip账号' : '编辑zlvip账号' }}</span>
      </template>
      <el-form :model="formData" ref="formRef" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="用户信息">
          <JsonInput v-model="formData.userInfo" height="400px"></JsonInput>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createZlVip, updateZlVip, deleteZlVip, queryZlVips } from '@/api/server'
import { ElMessageBox, ElMessage } from 'element-plus'
import _ from 'lodash'
import JsonInput from '@/components/JsonInput.vue'

const zlvipList = ref([])
const total = ref(0)
const filterForm = ref({
  name: '',
  page: 1,
  pageSize: 10
})

const fetchZlVips = async () => {
  const res = await queryZlVips(filterForm.value)
  zlvipList.value = res.items
  total.value = res.total
}

const showDialog = ref(false)
const dialogType = ref('add')
const formData = ref({
  id: null,
  name: '',
  userInfo: "{}"
})

onMounted(() => {
  fetchZlVips()
})

const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {
    id: null,
    name: '',
    userInfo: "{}"
  }
  showDialog.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.value = _.cloneDeep(row)
  showDialog.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该VIP账号吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteZlVip(row.id)
    ElMessage.success('删除成功')
    fetchZlVips()
  } catch (error) {
    console.log('取消删除')
  }
}

const handleSubmit = async () => {
  try {
    if (dialogType.value === 'add') {
      await createZlVip(formData.value)
      ElMessage.success('添加成功')
    } else {
      await updateZlVip(formData.value.id, formData.value)
      ElMessage.success('更新成功')
    }
    showDialog.value = false
    fetchZlVips()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const handleFilter = () => {
  filterForm.value.page = 1
  fetchZlVips()
}

const resetFilter = () => {
  filterForm.value = {
    name: '',
    page: 1,
    pageSize: 10
  }
  fetchZlVips()
}
</script>