<template>
  <div
    class="category-card"
    :class="[`pattern-${category.theme.pattern}`, { 'is-hovered': hovered }]"
    :style="cardStyle"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('click', category)"
  >
    <!-- 背景装饰层 -->
    <div class="card-bg-deco" />

    <!-- 图标圆圈（对应 .icon-bg） -->
    <div class="card-icon">
      <i :class="category.faIcon || 'fas fa-gamepad'" />
    </div>

    <!-- 文字内容 -->
    <div class="card-body">
      <h3 class="card-title">{{ category.name }}</h3>
      <p class="card-desc">{{ category.desc }}</p>
    </div>

    <!-- 游戏数量（对应 .status-tag） -->
    <div class="card-footer">
      <span class="game-count" :class="category.games.length > 0 ? 'has-games' : 'coming-soon'">
        <i :class="category.games.length > 0 ? 'fas fa-infinity' : 'fas fa-hourglass-half'" />
        {{ category.games.length > 0 ? `${category.games.length} 款游戏` : '即将上线' }}
      </span>
      <span class="card-arrow">→</span>
    </div>

    <!-- 悬浮光晕 -->
    <div class="card-glow" :style="glowStyle" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})
defineEmits(['click'])

const hovered = ref(false)

const cardStyle = computed(() => ({
  '--cat-primary': props.category.theme.primary,
  '--cat-secondary': props.category.theme.secondary,
  '--cat-bg': props.category.theme.bg,
  '--cat-text': props.category.theme.textColor,
  borderColor: hovered.value ? '#f5a0bc' : '#ffe0f0'
}))

const glowStyle = computed(() => ({
  background: 'radial-gradient(circle at 50% 50%, rgba(245, 160, 188, 0.15) 0%, transparent 70%)',
  opacity: hovered.value ? 1 : 0
}))
</script>

<style lang="scss" scoped>
/* 卡片（对应 .game-card） */
.category-card {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 32px;
  padding: 20px 14px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow:
    0 12px 24px -12px rgba(150, 80, 120, 0.3),
    0 0 0 2px #fff8fe inset,
    0 0 0 3px #ffeef5;
  transition: transform 0.2s ease, box-shadow 0.2s;
  border: 1px solid #ffe0f0;
  cursor: pointer;
  user-select: none;

  &.is-hovered {
    transform: translateY(-5px);
    box-shadow: 0 20px 28px -12px #c5789f, 0 0 0 3px #ffffff inset;
  }

  @media (max-width: 380px) {
    padding: 16px 10px;
  }
}

.card-bg-deco {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(255, 242, 250, 0.4) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.card-glow {
  position: absolute;
  inset: -20px;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 0;
}

/* 图标圆圈（对应 .icon-bg） */
.card-icon {
  position: relative;
  z-index: 1;
  width: 70px;
  height: 70px;
  background: linear-gradient(140deg, #ffe9f4, #ffdae9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 10px 16px -6px #f3b6d1, 0 0 0 4px #fff9fd;
  flex-shrink: 0;

  /* Font Awesome 图标（对应 .game-card i） */
  i {
    font-size: 34px;
    color: #b84f79;
    text-shadow: 0 2px 6px #ffc2db;
  }
}

/* 文字内容区 */
.card-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 游戏标题（对应 .game-title） */
.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #643953;
  margin-bottom: 6px;
  background: #ffeef5;
  padding: 4px 12px;
  border-radius: 30px;
  display: inline-block;
  border: 1px solid #ffdeec;
  letter-spacing: 1px;

  @media (max-width: 380px) {
    font-size: 16px;
  }
}

/* 描述文字（对应 .game-desc） */
.card-desc {
  font-size: 12px;
  font-weight: 500;
  color: #8f5e7a;
  margin: 8px 0 12px;
  line-height: 1.5;
  min-height: 3.6em;
  max-width: 180px;
  padding: 0 2px;

  @media (max-width: 380px) {
    font-size: 11px;
  }
}

/* 底部按钮区 */
.card-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 隐藏右侧箭头 */
.card-arrow {
  display: none;
}

/* 状态标签（对应 .status-tag） */
.game-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f2e0ed;
  color: #6b3f5b;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 30px;
  box-shadow: 0 2px 8px #f8cedf;
  border: 1px solid #ffe1f0;
  margin-top: 4px;

  i {
    font-size: 12px;
    color: #d86293;
    text-shadow: none;
  }

  /* 有游戏（对应 .status-tag.game-available） */
  &.has-games {
    background: #ffe2ed;
    color: #a33862;
    border-color: #feb0d0;
  }
}
</style>
