<template>
    <div class="account-management">
        <el-card>
            <div class="header">
                <el-form :inline="true" :model="filterForm" class="filter-form">
                    <el-form-item label="用户名" style="width:240px;">
                        <el-input v-model="filterForm.username" placeholder="请输入用户名" clearable />
                    </el-form-item>
                    <el-form-item label="用户ID" style="width:240px;">
                        <el-input v-model="filterForm.userid" placeholder="请输入用户ID" clearable />
                    </el-form-item>
                    <el-form-item label="角色ID" style="width:240px;">
                        <el-input v-model="filterForm.roleid" placeholder="请输入角色ID" clearable />
                    </el-form-item>
                    <el-form-item label="服务器ID" style="width:240px;">
                        <el-input v-model="filterForm.serverid" placeholder="请输入服务器ID" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleFilter">搜索</el-button>
                        <el-button @click="resetFilter">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="showAddDialog = true">添加账号</el-button>
            </div>

            <el-table :data="accountList" border style="width: 100%">
                <el-table-column prop="username" label="用户名" width="180" />
                <el-table-column prop="userid" label="用户ID" width="180" />
                <el-table-column prop="roleid" label="角色ID" />
                <el-table-column prop="serverid" label="服务器ID" />
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
                    @size-change="fetchAccounts" @current-change="fetchAccounts" />
            </div>

        </el-card>

        <!-- 添加账号对话框 -->
        <el-dialog v-model="showAddDialog" title="添加账号" width="30%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="addForm.username" />
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="addForm.userid" />
                </el-form-item>
                <el-form-item label="角色ID">
                    <el-input v-model="addForm.roleid" />
                </el-form-item>
                <el-form-item label="服务器ID">
                    <el-input v-model="addForm.serverid" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button type="primary" @click="handleAddAccount">确定</el-button>
            </template>
        </el-dialog>

        <!-- 编辑账号对话框 -->
        <el-dialog v-model="showEditDialog" title="编辑账号" width="30%">
            <el-form :model="editForm" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" />
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="editForm.userid" />
                </el-form-item>
                <el-form-item label="角色ID">
                    <el-input v-model="editForm.roleid" />
                </el-form-item>
                <el-form-item label="服务器ID">
                    <el-input v-model="editForm.serverid" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEditDialog = false">取消</el-button>
                <el-button type="primary" @click="handleUpdateAccount">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAccounts, updateAccount, createAccount, deleteAccount } from '@/api/server'
import { ElMessageBox,ElMessage } from 'element-plus'

const userStore = useUserStore()
const accountList = ref([])
const total = ref(0)
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const filterForm = ref({
    username: '',
    userid: '',
    roleid: '',
    serverid: '',
    page: 1,
    pageSize: 10
})

const addForm = ref({
    username: '',
    userid: '',
    roleid: '',
    serverid: ''
})

const addFormRules = {
    
}

const editForm = ref({
    id: '',
    username: '',
    userid: '',
    roleid: '',
    serverid: ''
})

// 获取账号列表
const fetchAccounts = async () => {
    const res = await getAccounts(filterForm.value)
    accountList.value = res.items
    total.value = res.total
}

// 筛选账号
const handleFilter = () => {
    fetchAccounts()
}

// 重置筛选
const resetFilter = () => {
    filterForm.value = {
        username: '',
        userid: '',
        roleid: '',
        serverid: ''
    }
    fetchAccounts()
}

// 添加账号
const addFormRef = ref(null)

const handleAddAccount = async () => {
    if (!addFormRef.value) return
    await addFormRef.value.validate()

    const userData = addForm.value
    await createAccount(userData)
    showAddDialog.value = false
    ElMessage.success('添加成功');
    fetchAccounts()
    addForm.value = {
        username: '',
        userid: '',
        roleid: '',
        serverid: ''
    }
}

// 编辑账号
const handleEdit = (account) => {
    editForm.value = {
        id: account.id,
        username: account.username,
        userid: account.userid,
        roleid: account.roleid,
        serverid: account.serverid
    }
    showEditDialog.value = true
}

// 更新账号
const handleUpdateAccount = async () => {
    await updateAccount(editForm.value)
    ElMessage.success('更新成功');
    showEditDialog.value = false
    fetchAccounts()
}

// 删除账号
const handleDelete = async (account) => {
    try {
        await ElMessageBox.confirm('确定要删除该账号吗？', '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        await deleteAccount(account.id);
        fetchAccounts();
        // 删除成功弹窗
        ElMessage.success('删除成功');

    } catch (error) {
        // 用户取消删除
    }
};
onMounted(() => {
    fetchAccounts()
})
</script>

<style scoped>
.account-management {
    padding: 20px;
}

.header {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>