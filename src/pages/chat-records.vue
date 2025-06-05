<template>
  <div class="chat-records-page">
    <h2>OpenAI 聊天记录</h2>

    <!-- 过滤条件 -->
    <div class="filter-bar mb_16">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="请求内容">
          <el-input v-model="queryParams.requestContent" placeholder="请输入请求内容关键词" clearable />
        </el-form-item>
        <el-form-item label="响应内容">
          <el-input v-model="queryParams.responseContent" placeholder="请输入响应内容关键词" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="Pending" value="pending" />
            <el-option label="Success" value="success" />
            <el-option label="Failed" value="failed" />
          </el-select>
        </el-form-item>
        <!-- 新增日期选择器 -->
        <el-form-item label="选择日期">
          <el-date-picker v-model="exportDate" type="date" placeholder="选择要导出的日期" value-format="YYYY-MM-DD" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <!-- 新增导出按钮 -->
          <el-button type="success" @click="handleExport">导出 Excel</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="openaiConfig.model" label="模型" width="120" />
      <el-table-column prop="requestContent" label="请求内容" width="300">
        <template #default="{ row }">
          <el-tooltip :show-after="300" :content="row.requestContent" placement="top-start" effect="dark">
            <template #content>
              <div style="max-width: 500px; white-space: normal;">
                {{ row.requestContent }}
              </div>
            </template>
            <el-link :underline="false" class="multi-line-ellipsis" @click="copyToClipboard(row.requestContent)">
              {{ row.requestContent }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="responseContent" label="响应内容" width="400">
        <template #default="{ row }">
          <el-tooltip :show-after="300" :content="row.responseContent" placement="top-start" effect="dark">
            <template #content>
              <div style="max-width: 500px; white-space: normal;">
                {{ row.responseContent }}
              </div>
            </template>
            <el-link :underline="false" class="multi-line-ellipsis" @click="copyToClipboard(row.responseContent)">
              {{ row.responseContent }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="_tags" label="标识" width="120">
        <template #default="{ row }">
          <span v-for="(tag, index) in row._tags" :key="index">
            <el-tag :type="tag.type" size="small">{{ tag.text }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="errorMessage" label="错误信息" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <!-- 添加操作列 -->
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination mt_16" flex="main:right">
      <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize" :total="total"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { queryOpenAIChatRecords, exportOpenAIChatRecords, deleteOpenAIChatRecord } from '@/api/server' // 导入查询接口和新的导出接口
// import axios from 'axios'; // 导入 axios 用于文件下载 (不再需要直接使用 axios)

const route = useRoute() // 获取路由实例

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  openaiConfigId: route.query.openaiId ? Number(route.query.openaiId) : undefined, // 从路由获取ID
  requestContent: '',
  responseContent: '',
  status: undefined,
  // userId: undefined // 如果需要按用户过滤
})

// 新增导出日期状态
const exportDate = ref(null);

// 表格数据
const tableData = ref([])
const total = ref(0)

// 方法
const loadData = async () => {
  try {
    const res = await queryOpenAIChatRecords(queryParams)
    res.items.forEach((item) => {
      const tags = []
      if (item.responseContent && item.responseContent.includes('已帮您通知人工解答')) {
        tags.push({ type: 'danger', text: '人工解答' })
      }

      if(item.requestContent&&item.requestContent.includes('提交墨源')){
        tags.push({ type: 'primary', text: '提交墨源' })
      }

      item._tags = tags
    })
    tableData.value = res.items
    total.value = res.total
  } catch (error) {
    ElMessage.error('加载聊天记录失败')
    console.error('加载聊天记录失败:', error)
  }
}

const handleSearch = () => {
  queryParams.page = 1 // 搜索时重置到第一页
  loadData()
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val
  loadData()
}

const handleCurrentChange = (val) => {
  queryParams.page = val
  loadData()
}

// 新增导出方法
const handleExport = async () => {
  if (!exportDate.value) {
    ElMessage.warning('请选择要导出的日期');
    return;
  }

  try {
    // 调用后端导出接口
    // 假设后端导出接口是 /openai/chat-records/export
    // 您可能需要根据实际后端接口路径进行调整
    const response = await exportOpenAIChatRecords({ // 使用新的导出函数
      exportDate: exportDate.value,
      openaiConfigId: queryParams.openaiConfigId,
      requestContent: queryParams.requestContent,
      responseContent: queryParams.responseContent,
      status: queryParams.status,
      // userId: queryParams.userId, // 如果需要按用户过滤
    });

    // 处理文件下载
    const fileName = `chat_records_${exportDate.value}.xlsx`;
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(response);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);

    ElMessage.success('导出成功');

  } catch (error) {
    ElMessage.error('导出失败');
    console.error('导出聊天记录失败:', error);
  }
};


// 根据状态获取标签类型
const getStatusTagType = (status) => {
  switch (status) {
    case 'success':
      return 'success'
    case 'failed':
      return 'danger'
    case 'pending':
    default:
      return 'info'
  }
}

// 根据状态获取显示文本
const getStatusText = (status) => {
  switch (status) {
    case 'success':
      return '成功'
    case 'failed':
      return '失败'
    case 'pending':
      return '进行中'
    default:
      return status
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}
// 初始化加载数据
onMounted(() => {
  //   if (queryParams.openaiConfigId === undefined) {
  //     ElMessage.warning('未指定OpenAI配置ID，将显示所有记录。')
  //   }
  loadData()
})

// 添加删除方法
const handleDelete = async (row) => {
  try {
    await deleteOpenAIChatRecord(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped lang="scss">
.chat-records-page {
  padding: 20px;

  .mb_16 {
    margin-bottom: 16px;
  }

  .mt_16 {
    margin-top: 16px;
  }

  .filter-bar {
    .el-form-item {
      margin-bottom: 0; // 调整过滤条件表单项的间距
    }
  }

  .multi-line-ellipsis {
    display: -webkit-box;
    $line-clamp: 5;
    -webkit-line-clamp: $line-clamp;
    line-clamp: $line-clamp;
    /* 控制最多显示 2 行 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    $line-height: 1.5em;
    line-height: $line-height;
    max-height: $line-height * $line-clamp;
    /* 2 行 * 1.5em */
  }
}
</style>