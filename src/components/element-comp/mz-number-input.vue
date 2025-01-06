
<template>
  <el-input-number v-bind="$attrs" :size="size" :model-value="showValue" :min="props.min" @change="inputHandler">
    <template
        v-for="[name, slotContent] in Object.entries($slots).filter(([_, slot]) => slot)"
        :key="name"
        v-slot:[name]
    >
      <slot :name="name"></slot>
    </template>

    <template v-if="props.isPercent" #suffix>
      %
    </template>
  </el-input-number>

</template>

<script setup>
import {computed,getCurrentInstance} from 'vue'
import Big from "big.js";
const model = defineModel({
  type: Number,
  default:0,
})
const props = defineProps({
  min:{
    type:Number,
    default:0
  },
  isPercent:{
    type:Boolean,
    default:false
  },
  size:{
    type:String,
    default:'small'
  }
})
const showValue = computed(() => {
  if(!props.isPercent) return Number(model.value) ||0
  return new Big(model.value||0).times(100).toNumber()
})
const vm = getCurrentInstance()
const inputHandler = (value) => {
  if(!props.isPercent) return model.value = Number(value)
  model.value = new Big(value||0).div(100).toNumber()
}

</script>


<style scoped lang="scss">

</style>
