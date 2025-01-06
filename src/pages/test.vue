<script setup>
import {evaluate} from "mathjs";

const aaa = "123*2"
const str = `aaa + 555`.replace(/([a-z_]+)/ig,($1)=>{
  return "${"+ $1 +"}"
})
console.log(eval("\`"+str+"\`"))
</script>

<template>

</template>

<style scoped lang="scss">

</style>
