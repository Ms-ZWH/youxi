<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup>
// App 根组件，仅负责路由视图渲染与页面过渡
</script>

<style>
/* 引入全局样式 */
</style>
