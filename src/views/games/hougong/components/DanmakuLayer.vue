<template>
  <div class="danmaku-layer" aria-hidden="true">
    <div
      v-for="item in activeItems"
      :key="item.id"
      class="danmaku-item"
      :style="item.style"
    >
      <span class="danmaku-user">{{ item.user }}：</span>{{ item.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const activeItems = ref([])
let idCounter = 0

function fire(danmaku) {
  const items = Array.isArray(danmaku) ? danmaku : [danmaku]
  items.forEach((d, i) => {
    setTimeout(() => {
      const id = ++idCounter
      const top = 8 + Math.random() * 70  // 8%–78%
      const duration = 9 + Math.random() * 5
      const fontSize = 13 + Math.floor(Math.random() * 3)

      activeItems.value.push({
        id,
        user: d.user,
        text: d.text,
        style: {
          top: top + '%',
          animationDuration: duration + 's',
          fontSize: fontSize + 'px',
          opacity: 0.75 + Math.random() * 0.2,
        },
      })

      setTimeout(() => {
        activeItems.value = activeItems.value.filter(x => x.id !== id)
      }, (duration + 0.5) * 1000)
    }, i * 1200)
  })
}

defineExpose({ fire })
onUnmounted(() => { activeItems.value = [] })
</script>

<style lang="scss" scoped>
.danmaku-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 200;
}

.danmaku-item {
  position: absolute;
  right: -100%;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.82);
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  animation: danmaku-move linear forwards;
  font-family: var(--font-body);
}

.danmaku-user {
  color: #f5d76e;
  font-weight: 500;
}

@keyframes danmaku-move {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100vw - 200px)); }
}
</style>
