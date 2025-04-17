<template>
    <div class="user-management">
        <el-card>
            <div class="header">
                <el-form :inline="true" :model="filterForm" class="filter-form">
                    <el-form-item label="用户名">
                        <el-input v-model="filterForm.username" placeholder="请输入用户名" clearable />
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="filterForm.phone" placeholder="请输入手机号" clearable />
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-select v-model="filterForm.role" placeholder="请选择角色" clearable>
                            <el-option label="普通用户" value="user" />
                            <el-option label="管理员" value="admin" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleFilter">搜索</el-button>
                        <el-button @click="resetFilter">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="showAddDialog = true">添加用户</el-button>
            </div>

            <el-table :data="userList" border style="width: 100%">
                <el-table-column prop="username" label="用户名" width="180" />
                <el-table-column prop="phone" label="手机号" width="180" />
                <el-table-column prop="role" label="角色" />
                <el-table-column prop="isActive" label="状态">
                    <template #default="scope">
                        {{ scope.row.isActive ? '启用' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" />
                <el-table-column prop="updatedAt" label="更新时间" />
                <el-table-column label="操作" width="300">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" :type="scope.row.status === 'active' ? 'danger' : 'success'"
                            @click="handleToggleStatus(scope.row)">
                            {{ scope.row.isActive ? '禁用' : '启用' }}
                        </el-button>
                        <el-button size="small" type="warning" @click="handleChangePassword(scope.row)">修改密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style=" margin-top: 20px;display: flex;justify-content: flex-end;">
                <el-pagination v-model:current-page="filterForm.page" v-model:page-size="filterForm.pageSize"
                    :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next"
                    @size-change="fetchUsers" @current-change="fetchUsers" />
            </div>

        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog v-model="showAddDialog" title="添加用户" width="30%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
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
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="addForm.confirmPassword" type="password" show-password />
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
                    <el-input v-model="editForm.username" />
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

        <!-- 修改密码对话框 -->
        <el-dialog v-model="showPasswordDialog" title="修改密码" width="30%">
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
                <el-form-item label="新密码" prop="password">
                    <el-input v-model="passwordForm.password" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showPasswordDialog = false">取消</el-button>
                <el-button type="primary" @click="handleUpdatePassword">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUsers, updateUser, updatePassword, createUser } from '@/api/server'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userList = ref([])
const total = ref(0)
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const filterForm = ref({
    username: '',
    phone: '',
    role: '',
    page: 1,
    pageSize: 10
})

const addForm = ref({
    username: '',
    phone: '',
    role: 'user',
    password: '',
    confirmPassword: ''
})
// 密码验证规则
const addFormRules = {
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                
                if (value !== addForm.value.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

const editForm = ref({
    id: '',
    username: '',
    phone: '',
    role: ''
})

const showPasswordDialog = ref(false)
const passwordFormRef = ref(null)
const passwordForm = ref({
    id: '',
    password: '',
    confirmPassword: ''
})

const passwordRules = {
    password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== passwordForm.value.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

// 获取用户列表
const fetchUsers = async () => {
    try {
        const res = await getUsers(filterForm.value)
        userList.value = res.items
        total.value = res.total
    } catch (error) {
        console.error(error)
    }
}

// 筛选用户
const handleFilter = () => {
    fetchUsers()
}

// 重置筛选
const resetFilter = () => {
    filterForm.value = {
        username: '',
        phone: '',
        role: ''
    }
    fetchUsers()
}

// 添加用户
const addFormRef = ref(null)

const handleAddUser = async () => {
    if (!addFormRef.value) return
    
    try {
        await addFormRef.value.validate()
        
        const { confirmPassword, ...userData } = addForm.value
        await createUser(userData)
        showAddDialog.value = false
        fetchUsers()
        addForm.value = {
            username: '',
            phone: '',
            role: 'user',
            password: '',
            confirmPassword: ''
        }
    } catch (error) {
        if (error.response?.data?.message) {
            ElMessage.error(error.response.data.message)
        } else {
            console.error(error)
            ElMessage.error('添加用户失败')
        }
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

// 打开修改密码对话框
const handleChangePassword = (user) => {
    passwordForm.value = {
        id: user.id,
        password: '',
        confirmPassword: ''
    }
    showPasswordDialog.value = true
}

// 更新密码
const handleUpdatePassword = async () => {
    if (!passwordFormRef.value) return
    
    try {
        await passwordFormRef.value.validate()
        
        const updateData = {
            id: passwordForm.value.id,
            password: passwordForm.value.password
        }
        await updatePassword(updateData)
        showPasswordDialog.value = false
        ElMessage.success('密码修改成功')
    } catch (error) {
        if (error.response?.data?.message) {
            ElMessage.error(error.response.data.message)
        } else {
            console.error(error)
            ElMessage.error('密码修改失败')
        }
    }
}

// 切换用户状态
const handleToggleStatus = async (user) => {
    try {
        await updateUser({
            id: user.id,
            isActive: !user.isActive
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