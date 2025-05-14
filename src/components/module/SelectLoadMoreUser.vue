<template>
  <select-load-more
    ref="userSelect"
    v-model="selectedUsers"
    :remote="true"
    :getDataFun="getUsersFilter"
    :placeholder="placeholder"
    :multiple="multiple"
    :style="{ width }"
    uniqKey="id"
    @change="handleChange"
  >
    <template v-slot:default="slotProps">
      <el-option
        v-for="item in slotProps.options"
        :key="item.id"
        :label="item.username"
        :value="item.id"
      >
      </el-option>
    </template>
  </select-load-more>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getUsers } from '@/api/server'
import SelectLoadMore from '../SelectLoadMore.vue'

const props = defineProps({
  modelValue: {
    type: [Array, String, Number],
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择用户'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const userSelect = ref(null)
const selectedUsers = ref(props.modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  selectedUsers.value = newVal
})

// 监听内部值变化
watch(selectedUsers, (newVal) => {
  emit('update:modelValue', newVal)
})

// 获取用户数据的过滤方法
const getUsersFilter = async (data) => {
  const { page, page_size, filterValue } = data
  const res = await getUsers({
    page,
    pageSize: page_size,
    username: filterValue // 使用 filterValue 作为用户名搜索条件
  })
  return {
    total: res.total,
    data: res.items
  }
}

const handleChange = (value) => {
  emit('change', value)
}

// 设置初始选项的方法
const setInitOptions = (options) => {
  userSelect.value?.setInitOptions(options)
}

// 暴露方法给父组件
defineExpose({
  setInitOptions
})
</script>