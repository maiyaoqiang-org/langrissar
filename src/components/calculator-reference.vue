<template>
  <el-dialog
    :model-value="modelValue"
    :title="reference.title"
    class="ddjsq-reference-dialog"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #header="{ titleId }">
      <h2 :id="titleId" class="reference-title">{{ reference.title }}</h2>
      <p class="reference-caption">{{ reference.caption }}</p>
    </template>

    <el-table
      :data="reference.rows"
      :row-key="row => reference.rows.indexOf(row)"
      :span-method="kind === 'counter' ? undefined : groupSpan"
      :class="{ 'reference-grid--catalog': kind !== 'counter' }"
      class="reference-grid"
      max-height="calc(100dvh - 280px)"
      stripe
      scrollbar-always-on
    >
      <el-table-column
        v-for="(column, index) in reference.columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.prop === reference.effectKey ? 300 : 80"
        :align="column.align"
        :fixed="index === 0 ? 'left' : false"
      >
        <template #default="{ row }">
          <span v-if="index === 0" class="reference-name">{{ row[column.prop] }}</span>
          <span
            v-else-if="kind === 'counter' && row[column.prop]"
            class="reference-coefficient"
            :class="row[column.prop].startsWith('+') ? 'is-positive' : 'is-negative'"
          >{{ row[column.prop] }}</span>
          <span v-else>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="kind !== 'counter'" class="reference-mobile-catalog">
      <section v-for="group in groups" :key="group.name" class="reference-group">
        <h3>{{ group.name }}</h3>
        <dl v-if="reference.techKey" class="reference-entries">
          <div v-for="row in group.rows" :key="row.id" class="reference-entry">
            <dt>{{ row[reference.techKey] }}</dt>
            <dd>{{ row[reference.effectKey] }}</dd>
          </div>
        </dl>
        <ul v-else class="reference-effects">
          <li v-for="row in group.rows" :key="row.id">{{ row.effect }}</li>
        </ul>
      </section>
    </div>

    <template #footer>
      <el-button type="primary" plain @click="$emit('update:modelValue', false)">返回计算器</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed} from 'vue'
import {
  sq_table, sq_table_columns,
  sbkj_table, sbkj_table_columns,
  sbkj_aoe_table, sbkj_aoe_table_columns,
  zykz_table, zykz_table_columns,
} from '@/common/constant'

const props = defineProps({
  modelValue: Boolean,
  kind: {type: String, required: true, validator: value => ['covenant', 'soldier', 'aoe-soldier', 'counter'].includes(value)},
})
defineEmits(['update:modelValue'])

const references = {
  covenant: {
    title: '神契晨曦之祝特效参考',
    caption: '按神契查看对应特效。',
    rows: sq_table,
    columns: sq_table_columns,
    groupKey: 'name',
    effectKey: 'effect',
  },
  soldier: {
    title: '士兵科技参考',
    caption: '按士兵种类查看科技名称与效果。',
    rows: sbkj_table,
    columns: sbkj_table_columns,
    groupKey: 'type',
    techKey: 'tech',
    effectKey: 'effect',
  },
  'aoe-soldier': {
    title: '与AOE有关的士兵科技参考',
    caption: '按士兵种类查看与AOE有关的科技名称与效果。',
    rows: sbkj_aoe_table,
    columns: sbkj_aoe_table_columns,
    groupKey: 'soldierType',
    techKey: 'techName',
    effectKey: 'techEffect',
  },
  counter: {
    title: '职业克制系数参考',
    caption: '左侧为进攻职业，上方为防守职业；左右滑动查看完整表格。',
    rows: zykz_table,
    columns: zykz_table_columns,
  },
}
const reference = computed(() => references[props.kind])

// Group only consecutive source rows. Blank god names continue the preceding god.
// Source data, row order, coefficients and wording remain unchanged.
const groups = computed(() => {
  if (props.kind === 'counter') return []
  return reference.value.rows.reduce((result, row, index) => {
    const previous = result[result.length - 1]
    const name = row[reference.value.groupKey] || previous?.name
    if (previous && previous.name === name) {
      previous.rows.push(row)
    } else {
      result.push({name, start: index, rows: [row]})
    }
    return result
  }, [])
})

const groupSpan = ({rowIndex, columnIndex}) => {
  if (columnIndex !== 0) return [1, 1]
  const group = groups.value.find(item => item.start === rowIndex)
  return group ? [group.rows.length, 1] : [0, 0]
}
</script>

<style>
.ddjsq-reference-dialog {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(980px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  margin: 24px auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid #dee5ee;
  border-radius: 16px;
  box-shadow: 0 20px 72px #20365726;
}

.ddjsq-reference-dialog .el-dialog__header {
  flex-shrink: 0;
  margin: 0;
  padding: 24px 64px 20px 24px;
  border-bottom: 1px solid #e4eaf2;
}

.ddjsq-reference-dialog .reference-title {
  margin: 0;
  color: #253143;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
}

.ddjsq-reference-dialog .reference-caption {
  margin: 8px 0 0;
  color: #607086;
  font-size: 14px;
  line-height: 1.7;
}

.ddjsq-reference-dialog .el-dialog__headerbtn {
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  font-size: 22px;
}

.ddjsq-reference-dialog .el-dialog__headerbtn:hover,
.ddjsq-reference-dialog .el-dialog__headerbtn:focus-visible {
  background: #eef4ff;
}

.ddjsq-reference-dialog .el-dialog__body {
  min-height: 0;
  padding: 20px 24px;
  overflow: auto;
  overscroll-behavior: contain;
}

.ddjsq-reference-dialog .el-dialog__footer {
  flex-shrink: 0;
  padding: 14px 24px;
  border-top: 1px solid #e4eaf2;
  background: #fff;
}

.ddjsq-reference-dialog .reference-grid {
  --el-table-header-bg-color: #eef3fa;
  --el-table-header-text-color: #435674;
  --el-table-border-color: #e4eaf2;
  --el-table-row-hover-bg-color: #edf4ff;
  width: 100%;
  border: 1px solid #e4eaf2;
  border-radius: 10px;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.ddjsq-reference-dialog .reference-grid .el-table__cell {
  padding: 14px 0;
}

.ddjsq-reference-dialog .reference-grid td.el-table__cell {
  vertical-align: top;
}

.ddjsq-reference-dialog .reference-grid .cell {
  padding: 0 14px;
  line-height: 1.7;
  word-break: normal;
  overflow-wrap: anywhere;
}

.ddjsq-reference-dialog .reference-grid--catalog .cell {
  font-size: 16px;
}

.ddjsq-reference-dialog .reference-grid:not(.reference-grid--catalog) .cell {
  padding-right: 8px;
  padding-left: 8px;
}

.ddjsq-reference-dialog .reference-name {
  color: #344b70;
  font-weight: 600;
}

.ddjsq-reference-dialog .reference-coefficient {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 5px;
  font-weight: 600;
  white-space: nowrap;
}

.ddjsq-reference-dialog .is-positive {
  color: #196447;
  background: #eaf6ef;
}

.ddjsq-reference-dialog .is-negative {
  color: #a13643;
  background: #fceef0;
}

.ddjsq-reference-dialog .reference-mobile-catalog {
  display: none;
}

@media (max-width: 600px) {
  .ddjsq-reference-dialog {
    width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
    max-height: calc(100dvh - 24px);
    margin: 12px auto;
    border-radius: 14px;
  }

  .ddjsq-reference-dialog .el-dialog__header {
    padding: 20px 54px 16px 18px;
  }

  .ddjsq-reference-dialog .reference-title {
    font-size: 18px;
  }

  .ddjsq-reference-dialog .el-dialog__headerbtn {
    top: 10px;
    right: 6px;
  }

  .ddjsq-reference-dialog .el-dialog__body {
    padding: 16px;
  }

  .ddjsq-reference-dialog .el-dialog__footer {
    padding: 12px 16px max(12px, env(safe-area-inset-bottom));
  }

  .ddjsq-reference-dialog .el-dialog__footer .el-button {
    width: 100%;
  }

  .ddjsq-reference-dialog .reference-grid--catalog {
    display: none;
  }

  .ddjsq-reference-dialog .reference-mobile-catalog {
    display: grid;
    gap: 16px;
  }

  .ddjsq-reference-dialog .reference-group {
    overflow: hidden;
    border: 1px solid #e0e7f0;
    border-radius: 10px;
  }

  .ddjsq-reference-dialog .reference-group h3 {
    margin: 0;
    padding: 10px 14px;
    border-bottom: 1px solid #e0e7f0;
    color: #344b70;
    background: #eef3fa;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.6;
  }

  .ddjsq-reference-dialog .reference-entries,
  .ddjsq-reference-dialog .reference-effects {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ddjsq-reference-dialog .reference-entry,
  .ddjsq-reference-dialog .reference-effects li {
    padding: 13px 14px;
    color: #435169;
    font-size: 16px;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }

  .ddjsq-reference-dialog .reference-entry + .reference-entry,
  .ddjsq-reference-dialog .reference-effects li + li {
    border-top: 1px solid #edf0f5;
  }

  .ddjsq-reference-dialog .reference-entry dt {
    margin-bottom: 4px;
    color: #253143;
    font-size: 15px;
    font-weight: 600;
  }

  .ddjsq-reference-dialog .reference-entry dd {
    margin: 0;
  }
}
</style>
