<template>
  <div
    class="game-card"
    :class="{ 'is-hovered': hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('click', game)"
  >
    <!-- 封面图 -->
    <div class="game-cover">
      <img v-if="game.cover" :src="game.cover" :alt="game.name" />
      <div v-else class="cover-placeholder">
        <span>{{ game.icon || '🎮' }}</span>
      </div>
      <!-- 标签 -->
      <div v-if="game.isNew" class="game-badge new">NEW</div>
      <div v-else-if="game.isHot" class="game-badge hot">HOT</div>
    </div>

    <!-- 信息 -->
    <div class="game-info">
      <h4 class="game-name">{{ game.name }}</h4>
      <p class="game-summary">{{ game.summary }}</p>
      <div class="game-tags">
        <span v-for="tag in game.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <!-- 开始按钮 -->
    <div class="game-action">
      <button class="btn-start">开始游戏</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  game: {
    type: Object,
    required: true
  }
})
defineEmits(['click'])

const hovered = ref(false)
</script>

<style lang="scss" scoped>
/* ===== 游戏卡片（对应 .game-card） ===== */
.game-card {
  background: rgba(15, 10, 7, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 160, 110, 0.45);
  border-radius: 36px;
  padding: 24px 22px 22px;
  box-shadow: 0 20px 30px -20px black, inset 0 0 30px rgba(160, 110, 50, 0.15);
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;

  &.is-hovered {
    border-color: rgba(230, 190, 120, 0.7);
    box-shadow: 0 20px 30px -18px #b98c4a;
    transform: none;
  }
}

/* 封面区域隐藏（参考原稿无封面） */
.game-cover {
  display: none;
}

/* ===== 信息区（无内边距） ===== */
.game-info {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 游戏标题（对应 .game-title） */
.game-name {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 700;
  color: #fbdeb9;
  line-height: 1.2;
  text-shadow: 1px 1px 6px #221105;
  letter-spacing: 0.5px;
  margin-bottom: 0;
}

/* badge 被父元素 game-cover 隐藏，此处补充独立样式以备用 */
.game-badge {
  display: inline-block;
  background: #9e6a3e;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 50px;
  color: #f7e7cc;
  border: 0.5px solid #dbb582;
  font-weight: 400;
  letter-spacing: 0.8px;
}

/* 描述文字（对应 .game-description） */
.game-summary {
  font-size: 14px;
  font-weight: 350;
  color: #d2bc9f;
  line-height: 1.6;
  margin: 8px 0 0;
  border-bottom: 1px dashed rgba(190, 150, 90, 0.4);
  padding-bottom: 14px;
  /* 取消行数截断 */
  display: block;
  -webkit-line-clamp: unset;
  -webkit-box-orient: unset;
  overflow: visible;
}

/* 标签组（对应 .game-tags） */
.game-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 0;
}

/* 单个标签（对应 .tag） */
.tag {
  font-size: 12px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.45);
  padding: 6px 14px;
  border-radius: 40px;
  border: 1px solid #a88754;
  color: #eedfc9;
  backdrop-filter: blur(2px);
  letter-spacing: 0.5px;
}

/* ===== 按钮区域（无内边距） ===== */
.game-action {
  padding: 0;
}

/* 开始游戏按钮（对应 .game-start-btn） */
.btn-start {
  background: linear-gradient(145deg, #dbb77a 0%, #be9357 80%);
  border: none;
  border-radius: 60px;
  padding: 14px 16px;
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  color: #1e130b;
  text-align: center;
  letter-spacing: 2px;
  box-shadow: 0 8px 18px -8px #0f0803, 0 0 0 1px #fceaca inset, 0 0 0 2px #6e4f28 inset;
  width: 100%;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    opacity: 0.9;
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4px 8px -4px black;
  }
}
</style>
