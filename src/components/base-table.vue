<template>
  <uni-table
      ref="table"
      :loading="loading"
      :border="border"
      :stripe="stripe"
      :type="type"
      :emptyText="emptyText"
      @selection-change="selectionChange"
  >
    <uni-tr>
      <uni-th
          v-for="(column, index) in columns"
          :key="index"
          :width="column.width"
          :align="column.align || 'center'"
      >
        {{ column.label }}
      </uni-th>
    </uni-tr>
    <uni-tr v-for="(item, index) in data" :key="index">
      <uni-td v-for="(column, colIndex) in columns" :key="colIndex">
        <slot :name="column.prop" :row="item" :value="item[column.prop]" v-if="$slots[column.prop]" />
        <template v-else>{{ item[column.prop] }}</template>
      </uni-td>
    </uni-tr>
  </uni-table>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: true,
  },
  stripe: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: '', // 可选值：'selection', '', 等
  },
  emptyText: {
    type: String,
    default: '暂无更多数据',
  },
});

const emit = defineEmits(['selection-change']);

function selectionChange(selection) {
  emit('selection-change', selection);
}
</script>

<style scoped lang="scss">
/* 根据需求添加样式 */
</style>
