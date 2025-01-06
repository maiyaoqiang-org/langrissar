<template>
  <uni-easyinput type="text" :value="showValue" @input="handleInput"/>
</template>
<script setup>
import {defineModel, computed, watch, ref, onMounted} from 'vue'
import Big from 'big.js'

const model = defineModel({
  default: "0",
  type: String
})
const showValue = computed(() => {
  if(model.value){
    return model.value.replace(/\(([\w\W]*)\)\/100/,(substring,$1)=>{
      return $1
    })
  }else{
    return ""
  }
})

const handleInput = (val) => {
  if(val){
    model.value = `(${val})/100`
  }else{
    model.value = ""
  }
}

</script>

<style scoped lang="scss">

</style>
