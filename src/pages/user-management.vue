<template>
  <div class="user-management">
    <el-card>
      <div class="header">
        <el-button type="primary" @click="showAddDialog = true">添加用户</el-button>
      </div>
      
      <el-table :data="userList" border style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="phone" label="手机号" width="180" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 'active' ? 'danger' : 'success'"
              @click="handleToggleStatus(scope.row)">
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog v-model="showAddDialog" title="添加用户" width="30%">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddUser">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑用户" width="30%">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUsers, updateUser } from '@/api/server'

const userStore = useUserStore()
const userList = ref([])
const showAddDialog = ref(false)
const showEditDialog = ref(false)

const addForm = ref({
  username: '',
  phone: '',
  role: 'user'
})

const editForm = ref({
  id: '',
  username: '',
  phone: '',
  role: ''
})

// 获取用户列表
const fetchUsers = async () => {
  try {
    const res = await getUsers()
    userList.value = res.data
  } catch (error) {
    console.error(error)
  }
}

// 添加用户
const handleAddUser = async () => {
  try {
    await updateUser(addForm.value)
    showAddDialog.value = false
    fetchUsers()
    addForm.value = {
      username: '',
      phone: '',
      role: 'user'
    }
  } catch (error) {
    console.error(error)
  }
}

// 编辑用户
const handleEdit = (user) => {
  editForm.value = {
    id: user.id,
    username: user.username,
    phone: user.phone,
    role: user.role
  }
  showEditDialog.value = true
}

// 更新用户
const handleUpdateUser = async () => {
  try {
    await updateUser(editForm.value)
    showEditDialog.value = false
    fetchUsers()
  } catch (error) {
    console.error(error)
  }
}

// 切换用户状态
const handleToggleStatus = async (user) => {
  try {
    await updateUser({
      id: user.id,
      status: user.status === 'active' ? 'inactive' : 'active'
    })
    fetchUsers()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}
.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>