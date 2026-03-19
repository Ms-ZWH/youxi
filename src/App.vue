<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <BottomTabBar v-if="route.meta.showTab" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import BottomTabBar from '@/components/BottomTabBar.vue'
const route = useRoute()
</script>

<style>
/* 引入全局样式 */
</style>
