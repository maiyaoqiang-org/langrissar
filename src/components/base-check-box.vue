<!--
<base-check-box v-model="value" label="是否啥"></base-check-box>
-->
<template>
  <uni-data-checkbox
    multiple
    :value="showValue" @input="handleInput"
    :localdata="[{text: label, value: '1'}]"></uni-data-checkbox>
</template>

<script setup>
  import {computed, defineModel, defineProps} from "vue";
  const model = defineModel()
  const showValue = computed(()=>{
    if(model.value){
      return ["1"]
    }else{
      return []
    }
  })
  const props = defineProps({
    label:"label",
  })
  const handleInput = (val)=>{
    if(val.includes("1")){
      model.value = true
    }else{
      model.value = false
    }
  }

</script>

