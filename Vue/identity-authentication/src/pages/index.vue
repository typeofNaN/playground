<template>
  <div id="app">
    <hello-world />
    <router-link to="/steps">steps</router-link>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld'
export default {
  components: {
    HelloWorld
  }
}
</script>
