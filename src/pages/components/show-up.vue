<script setup>
import {round} from '@/common/utils'
import {computed} from 'vue'

const props = defineProps({
  value: {},
  isPercent: {
    type: Boolean,
    default: false
  },
  showClass:{
    type: String,
    default: ''
  },
  judgeValue:{
    type: Number,
    default: undefined
  }
})

const showValue = computed(() => {
  return props.isPercent ? round(props.value*100, 2)+"%" : props.value
})

const currentShowClass = computed(() => {
  if(props.showClass){
    return props.showClass
  }
  const judgeValue = props.judgeValue!== undefined?props.judgeValue : props.value
  return judgeValue>0?'up':judgeValue<0?'down':''
})

</script>

<template>
  <div class="show-up" :class="[currentShowClass]">
    <slot>
      {{ showValue }}
    </slot>
  </div>
</template>

<style scoped lang="scss">
.show-up {
  color: #606266;
  font-size: inherit;

  &.up {
    color: green;
  }
  &.down{
    color:red;
  }
}
</style>
