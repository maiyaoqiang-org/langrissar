<template>
  <el-input
      v-if="!props.justShow"
      v-model="internalValue"
      :formatter="formatInput"
      :placeholder="placeholder"
      v-bind="$attrs"
  />
  <view v-else>
    {{internalValue}}
  </view>
</template>

<script setup>
import {computed, watch, watchEffect} from "vue";
import {calculateFormula} from "@/common/utils";
import Big from "big.js";

// 接收父组件的 props
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  prop: {
    type: [String,Number],
    required: true,
  },
  placeholder: {
    type: String,
    default: "0",
  },
  defaultValue:{
    type: Number,
    default: 0
  },
  justShow:{
    type: Boolean,
    default: false
  }
});

const validPattern = /[^+\-*/.\d\s()]/g;
const savePre = '_mz_input_'
// 计算内部值，双向绑定 formData[prop]
const internalValue = computed({
  get: () => props.formData[`${savePre}${props.prop}`] || "",
  set: (newValue) => {
    props.formData[props.prop] = computeShowStr(newValue);
    props.formData[`${savePre}${props.prop}`] = newValue;
  },
});
const formatInput = (value) => {
  if (!value) return "";
  return value.replace(validPattern, ""); // 过滤掉不符合正则的字符
};
const computeShowStr = (value) => {
  if(!value){
    return props.defaultValue
  }else{
    return new Big(calculateFormula(value)).toNumber()
  }
};

const revertComputeShowStr = (value) => {
  if(!value){
    return props.defaultValue
  }else{
    try {
      return new Big(value).toNumber()
    }
    catch (e) {
      return props.defaultValue
    }
  }
};

watchEffect(()=>{
  if(props.formData[props.prop]!==computeShowStr(props.formData[`${savePre}${props.prop}`])){
    internalValue.value = revertComputeShowStr(props.formData[props.prop])
  }
})

</script>
