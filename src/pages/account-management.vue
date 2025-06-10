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
            <el-input v-model="filterForm.userid" placeholder="请输入用户ID" clearable />
          </el-form-item>
          <el-form-item label="角色ID" style="width:280px;">
            <el-input v-model="filterForm.roleid" placeholder="请输入角色ID" clearable />
          </el-form-item>
          <el-form-item label="服务器" style="width:280px;">
            <el-input v-model="filterForm.serverid" placeholder="请输入服务器ID" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleAdd">添加账号</el-button>
      </div>

      <el-table :data="accountList" border style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="userid" label="用户ID" width="180" />
        <el-table-column prop="roleid" label="角色ID" />
        <el-table-column prop="serverid" label="服务器ID" width="200" />
        <el-table-column prop="appKey" label="游戏key" width="200" />

        <el-table-column prop="zlVipId" label="关联紫龙会员账号" width="200">
          <template #default="scope">
            {{ scope.row.zlVip?.name }}
          </template>
        </el-table-column>
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

    <!-- 合并后的账号对话框 -->
    <el-dialog v-model="showAccountDialog" width="800px">
      <template #header>
        <div flex="cross:center main:justify">
          <span>{{ dialogType === 'add' ? '添加账号' : '编辑账号' }}</span>
          <el-button type="primary" @click="handleImport">一键导入账号信息(仅梦战)</el-button>
        </div>
      </template>
      <el-form :model="formData" ref="formRef" label-width="140px">
        <el-form-item label="关联紫龙账号">
          <el-select v-model="formData.zlVipId" placeholder="请选择关联紫龙账号" clearable>
            <el-option v-for="item in zlVipOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="紫龙游戏">
          <div flex="cross:center" style="width:100%;">
            <el-select flex-box="1" v-model="formData.appKey" placeholder="请选择紫龙游戏" clearable>
              <el-option v-for="item in HomeGameList" :key="item.appKey" :label="item.name" :value="item.appKey" />
            </el-select>
            <el-select flex-box="0" style="width:300px;margin-left: 8px;;" @change="handleSelectRole" value-key="roleId" placeholder="选择角色一键填充">
              <el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName"
                :value="item">
                <template #default>
                  <div flex="cross:center main:justify">
                    <div>
                      {{ item.roleName }}
                    </div>
                    <div style="color:#999;">
                      {{ item.serverName }}
                    </div>
                  </div>
                </template>
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="角色ID">
          <el-input v-model="formData.roleid" />
        </el-form-item>
        <el-form-item label="服务器ID">
          <el-input v-model="formData.serverid" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="formData.userid" placeholder="仅梦战需要，可通过顶部按钮导入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAccountDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAccountSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import PrefixInput from '@/components/PrefixInput.vue'
import { useUserStore } from '@/stores/user'
import { HomeGameList } from '@/common/constant'
import { getAccounts, updateAccount, createAccount, deleteAccount } from '@/api/server'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import _ from 'lodash'
import {
  autoCdkeyReward,
  clearCdkeyCache,
  getCdkeyReward,
  getMonthlyReward,
  getPredayReward,
  getWeeklyReward,
  autoVIPWeeklyReward,
  autoVIPMonthlyReward,
  autoVIPSignReward,
  getRoleInfo,
  queryZlVips,
  getVipHomeGameList,
  queryRoleList
} from "../api/server";
import { getServerData } from "@/api/mz";
import JsonInput from '@/components/JsonInput.vue'

onMounted(() => {
  getServerData().then((res) => {
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
const accountList = ref([])
const total = ref(0)
const filterForm = ref({
  username: '',
  userid: '',
  roleid: '',
  serverid: '',
  account: '',
  page: 1,
  pageSize: 10
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
const formRef = ref(null)

// 添加账号
const handleAddAccount = async () => {
  const userData = formData.value
  await createAccount(userData)
  ElMessage.success('添加成功');
  fetchAccounts()
}


// 更新账号
const handleUpdateAccount = async () => {
  await updateAccount(formData.value)
  ElMessage.success('更新成功');
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
const zlVipOptions = ref([])

const fetchZlVips = async () => {
  const res = await queryZlVips({ page: 1, pageSize: 1000 })
  zlVipOptions.value = res.items
}

onMounted(() => {
  fetchAccounts()
  fetchZlVips()
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
const showAccountDialog = ref(false)
const dialogTitle = ref('')
const dialogType = ref('add')
const defaultForm = {
  username: '',
  userid: '',
  roleid: '',
  serverid: '',
  account: '',
  password: '',
  appKey: '',
  zlVipId: null, // 修改为关联ID
}
const formData = ref(_.cloneDeep(defaultForm))

const roleList = ref([])
watch(() => [formData.value.zlVipId, formData.value.appKey], async ([zlVipId, appKey]) => {
  if (zlVipId && appKey) {
    const res = await queryRoleList({ id: zlVipId, appKey })
    roleList.value = res
  }else{
    roleList.value = []
  }
})

const handleSelectRole = (role) => {
  formData.value.roleid = role.roleId;
  formData.value.serverid = role.serverId;
  formData.value.username = role.roleName;
}

const handleAdd = () => {
  dialogTitle.value = '添加账号'
  dialogType.value = 'add'
  formData.value = _.cloneDeep(defaultForm)
  showAccountDialog.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑账号'
  dialogType.value = 'edit'
  formData.value = {
    ..._.cloneDeep(defaultForm),
    id: row.id,
    username: row.username,
    userid: row.userid,
    roleid: row.roleid,
    serverid: row.serverid,
    zlVipId: row.zlVip?.id,
    appKey: row.appKey,
  }
  showAccountDialog.value = true
}

const handleAccountSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  if (dialogType.value === 'add') {
    await handleAddAccount()
  } else {
    await handleUpdateAccount()
  }
  showAccountDialog.value = false
}

const handleImport = () => {
  ElMessageBox.prompt('请输入要导入的角色id', '一键导入账号信息', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入角色id'
  })
    .then(async ({ value: roleid }) => {
      if (roleid) {
        try {
          const res = await getRoleInfo({
            roleid: roleid,
          })
          if (res && res.length > 0) {
            const roleInfo = res[0]
            Object.assign(formData.value, {
              username: roleInfo.role_name,
              userid: roleInfo.uid,
              roleid: roleInfo.role_id,
              serverid: roleInfo.server_id,
            })
          }

        } catch (error) {
          ElMessage.error('导入失败: ' + error.message);
        }
      }
    })
    .catch(() => {
      console.log("取消")
    })
};



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
