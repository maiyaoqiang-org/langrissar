<template>
    <div class="invitation-code-container">
        <div class="header">
            <h2>邀请码管理</h2>
            <el-button type="primary" @click="handleAdd">新增邀请码</el-button>
        </div>

        <div class="filter-form">
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                <el-form-item style="width:200px;" label="状态">
                    <el-select v-model="filterForm.isUsed" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="可用" :value="false"></el-option>
                        <el-option label="已使用" :value="true"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期范围">
                    <el-date-picker v-model="filterForm.dateRange" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFilter">筛选</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="invitationCodes" border style="width: 100%" v-loading="loading">
            <el-table-column prop="code" label="邀请码" width="180" >
                <template #default="{ row }">
                    <div>
                        <el-link type="primary" @click="handleCopy(row.code)">{{ row.code }}</el-link>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="isUsed" label="状态" width="120">
                <template #default="{ row }">
                    <el-tag :type="!row.isUsed ? 'success' : 'info'">
                        {{ !row.isUsed ? '可用' : '已使用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column prop="usedAt" label="使用时间" width="180" />
            <el-table-column label="使用者" width="180">
                <template #default="{ row }">
                    <div v-if="row.usedBy">
                        用户名：{{ row.usedBy?.username || '' }}
                        <br>
                        手机：{{ row.usedBy?.phone || '' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建者" width="180">
                <template #default="{ row }">
                    <div v-if="row.createdBy">
                        用户名：{{ row.createdBy?.username || '' }}
                        <br>
                        手机：{{ row.createdBy?.phone || '' }}
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <!-- 新增对话框 -->
        <el-dialog v-model="dialogVisible" title="新增邀请码" width="500px">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="生成数量" prop="count">
                    <el-input-number v-model="form.count" :min="1" :max="100" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { createInvitationCodes, queryInvitationCodes } from '@/api/server'

const invitationCodes = ref([])
const dialogVisible = ref(false)
const loading = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
    count: 1
})

const rules = {
    count: [
        { required: true, message: '请输入生成数量', trigger: 'blur' },
        { type: 'number', min: 1, max: 100, message: '数量范围在1-100之间', trigger: 'blur' }
    ]
}

const filterForm = reactive({
    isUsed: '',
    dateRange: []
});

// 获取邀请码列表
const fetchInvitationCodes = async () => {
    try {
        loading.value = true
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            isUsed: filterForm.isUsed,
            startDate: filterForm.dateRange?.[0],
            endDate: filterForm.dateRange?.[1]
        }
        const result = await queryInvitationCodes(params)
        invitationCodes.value = result.items
        total.value = result.total
    } finally {
        loading.value = false
    }
}

// 新增按钮点击
const handleAdd = () => {
    form.count = 1
    dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
    try {
        await formRef.value.validate()
        submitLoading.value = true
        await createInvitationCodes(form.count)
        ElMessage.success('创建成功')
        dialogVisible.value = false
        fetchInvitationCodes()
    } finally {
        submitLoading.value = false
    }
}

// 处理分页大小变化
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    fetchInvitationCodes()
}

// 处理页码变化
const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchInvitationCodes()
}

// 处理筛选
const handleFilter = () => {
    fetchInvitationCodes();
};

// 初始化获取数据
fetchInvitationCodes()

// 复制邀请码
const handleCopy = async (code) => {
    try {
        await navigator.clipboard.writeText(code)
        ElMessage.success('复制成功')
    } catch (error) {
        ElMessage.error('复制失败')
    }
}
</script>

<style scoped>
.invitation-code-container {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header h2 {
    margin: 0;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>
