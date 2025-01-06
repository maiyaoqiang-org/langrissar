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
  }
})

const showValue = computed(() => {
  return props.isPercent ? round(props.value*100, 2) : props.value
})
</script>

<template>
  <div class="show-up" :class="[showClass?showClass:value>0?'up':value<0?'down':'']">
    {{ showValue }}{{isPercent?'%':''}}
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
