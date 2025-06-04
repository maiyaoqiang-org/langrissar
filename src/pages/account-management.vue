<template>
  <div class="account-management">
    <div class="mb_16">
      <el-button type="primary" @click="handleGetPredayReward">领取每日福利</el-button>
      <el-button type="primary" @click="handleGetWeeklyReward">领取每周二雪莉福利</el-button>
      <el-button type="primary" @click="handleGetMonthlyReward">领取每月8号福利</el-button>
      <el-button type="primary" @click="handleGetCdkeyReward">领取CDKey奖励</el-button>
      <el-button type="primary" @click="handleAutoCdkeyReward">自动领取CDKey奖励</el-button>
      <el-button type="primary" @click="handleAutoVIPWeeklyReward">自动领取VIP每周奖励</el-button>
      <el-button type="primary" @click="handleAutoVIPMonthlyReward">自动领取VIP每月奖励</el-button>
      <el-button type="primary" @click="handleAutoVIPSignReward">自动领取VIP签到奖励</el-button>
      <el-button type="danger" @click="handleClearCdkeyCache">清除所有CDKey缓存</el-button>
    </div>

    <el-card>
      <div class="header">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="用户名" style="width:280px;">
            <el-input v-model="filterForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="用户ID" style="width:280px;">
            <prefix-input v-model="filterForm.userid" placeholder="请输入用户ID" clearable />
          </el-form-item>
          <el-form-item label="角色ID" style="width:280px;">
            <el-input v-model="filterForm.roleid" placeholder="请输入角色ID" clearable />
          </el-form-item>
          <el-form-item label="账号" style="width:280px;">
            <el-input v-model="filterForm.account" placeholder="请输入账号" clearable />
          </el-form-item>
          <el-form-item label="服务器" style="width:280px;">
            <el-cascader
              v-model="filterForm.serverid"
              :options="serverOptions"
              :props="{
                emitPath: false
              }"
              filterable
              placeholder="请选择服务器"
              clearable
            />
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
        <el-table-column prop="serverid" label="服务器" width="200">
          <template #default="scope">
            {{ getServerName(scope.row.serverid) }}
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" />
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
    <el-dialog v-model="showAddDialog" title="添加账号" width="500px">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="用户ID">
          <prefix-input v-model="addForm.userid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="角色ID">
          <el-input v-model="addForm.roleid" />
        </el-form-item>
        <el-form-item label="服务器ID">
          <el-cascader
              v-model="addForm.serverid"
              :options="serverOptions"
              :props="{
                emitPath: false
              }"
              filterable
              placeholder="请选择服务器"
              clearable
            />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="addForm.account" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddAccount">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑账号对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑账号" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="用户ID">
          <prefix-input v-model="editForm.userid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="角色ID">
          <el-input v-model="editForm.roleid" />
        </el-form-item>
        <el-form-item label="服务器ID">
          <el-cascader
              v-model="editForm.serverid"
              :options="serverOptions"
              :props="{
                emitPath: false
              }"
              filterable
              placeholder="请选择服务器"
              clearable
            />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="editForm.account" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password" type="password" show-password />
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
import PrefixInput from '@/components/PrefixInput.vue'
import { useUserStore } from '@/stores/user'
import { getAccounts, updateAccount, createAccount, deleteAccount } from '@/api/server'
import { ElMessageBox, ElMessage,ElNotification } from 'element-plus'
import {
  autoCdkeyReward,
  clearCdkeyCache,
  getCdkeyReward,
  getMonthlyReward,
  getPredayReward,
  getWeeklyReward,
  autoVIPWeeklyReward,
  autoVIPMonthlyReward,
  autoVIPSignReward
} from "../api/server";
import {getServerData} from "@/api/mz";

onMounted(()=>{
  getServerData().then((res)=>{
    // 转换数据格式
    serverOptions.value = res.map(zone => ({
      value: zone.zone_real_id,
      label: zone.zone_name,
      children: zone.serverList.map(server => ({
        value: server.world_id,
        label: server.world_name,
        world_real_id: server.world_real_id
      }))
    }));
  })
})

// 添加服务器选项的响应式数据
const serverOptions = ref([])
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
  account: '',
  page: 1,
  pageSize: 10
})

const addForm = ref({
  username: '',
  userid: '',
  roleid: '',
  serverid: '',
  account: '',
  password: ''
})

const addFormRules = {

}

const editForm = ref({
  id: '',
  username: '',
  userid: '',
  roleid: '',
  serverid: '',
  account: '',
  password: ''
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

// 添加账号
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
    serverid: '',
    account: '',
    password: ''
  }
}

// 编辑账号
const handleEdit = (account) => {
  editForm.value = {
    id: account.id,
    username: account.username,
    userid: account.userid,
    roleid: account.roleid,
    serverid: account.serverid,
    account: account.account || '',
    // password: account.password || ''
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
const handleGetPredayReward = async () => {
  await getPredayReward();
  ElMessage.success('每日福利领取成功');
};

const handleGetWeeklyReward = async () => {
  await getWeeklyReward();
  ElMessage.success('每周二雪莉福利领取成功');
};

const handleGetMonthlyReward = async () => {
  await getMonthlyReward();
  ElMessage.success('每月8号福利领取成功');
};

const handleGetCdkeyReward = async () => {
  const { value: cdkey } = await ElMessageBox.prompt('请输入CDKey', 'CDKey奖励', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });
  if (cdkey) {
    await getCdkeyReward(cdkey);
    ElMessage.success('CDKey奖励领取成功');
  }
};

const handleAutoCdkeyReward = async () => {
  await autoCdkeyReward();
  ElMessage.success('自动CDKey奖励领取成功');
};

const handleAutoVIPWeeklyReward = async () => {
  const res = await autoVIPWeeklyReward();
  // 将 \n 替换为 <br> 标签
  const formattedRes = res.replace(/\n/g, '<br>'); 
  ElNotification({
    message: formattedRes,
    type: 'success',
    dangerouslyUseHTMLString: true // 允许使用 HTML 内容
  });
};

const handleAutoVIPMonthlyReward = async () => {
  const res = await autoVIPMonthlyReward();
  // 将 \n 替换为 <br> 标签
  const formattedRes = res.replace(/\n/g, '<br>'); 
  ElNotification({
    message: formattedRes,
    type: 'success',
    dangerouslyUseHTMLString: true // 允许使用 HTML 内容
  });
};

const handleAutoVIPSignReward = async () => {
  const res = await autoVIPSignReward();
  // 将 \n 替换为 <br> 标签
  const formattedRes = res.replace(/\n/g, '<br>'); 
  ElNotification({
    message: formattedRes,
    type: 'success',
    dangerouslyUseHTMLString: true // 允许使用 HTML 内容
  });
};

const handleClearCdkeyCache = async () => {
  try {
    await ElMessageBox.confirm('确定要清空CDKey缓存吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await clearCdkeyCache();
    ElMessage.success('CDKey缓存清除成功');
  }
  catch (e) {
    // 用户取消删除
  }
};
onMounted(() => {
  fetchAccounts()
})
// 获取服务器名称的方法
const getServerName = (serverId) => {
  if (!serverId) return '-'
  
  // 遍历服务器列表查找匹配的服务器
  for (const zone of serverOptions.value) {
    const server = zone.children.find(s => s.value === serverId)
    if (server) {
      return `${zone.label} - ${server.label}`
    }
  }
  return serverId // 如果找不到对应的服务器名称，返回原始ID
}
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