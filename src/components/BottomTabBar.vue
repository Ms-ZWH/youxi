<template>
  <nav class="bottom-tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.to"
      class="tab-item"
      :class="{ active: currentTab === tab.to }"
      @click="router.push(tab.to)"
    >
      <i :class="tab.icon" class="tab-icon"></i>
      <span class="tab-label">{{ tab.label }}</span>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()

const tabs = [
  { to: '/',        label: '游戏', icon: 'fas fa-gamepad' },
  { to: '/shop',    label: '购买', icon: 'fas fa-shopping-bag' },
  { to: '/profile', label: '我的', icon: 'fas fa-user' },
]

const currentTab = computed(() => {
  if (route.path === '/shop')    return '/shop'
  if (route.path === '/profile') return '/profile'
  return '/'
})
</script>

<style scoped>
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid #ffd6ea;
  box-shadow: 0 -4px 20px rgba(180, 90, 122, 0.1);
  z-index: 1000;
  max-width: 440px;
  margin: 0 auto;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  color: #c9a0b8;
  transition: color 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.tab-item.active {
  color: #b45a7a;
}

.tab-icon {
  font-size: 20px;
  line-height: 1;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.tab-item.active .tab-icon {
  transform: translateY(-1px);
  transition: transform 0.15s;
}
</style>
