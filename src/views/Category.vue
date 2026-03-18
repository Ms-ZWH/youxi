<template>
  <div class="category-page page-bg" v-if="category">
    <!-- 顶部区域 -->
    <header class="cat-header" :style="headerStyle">
      <div class="cat-header-bg" />

      <div class="container">
        <button class="back-btn" @click="router.push('/')">← 返回大厅</button>

        <div class="cat-hero">
          <div class="cat-icon">{{ category.icon }}</div>
          <div class="cat-title-wrap">
            <h1 class="cat-title">{{ category.name }}</h1>
            <p class="cat-desc">{{ category.desc }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- 游戏列表区 -->
    <main class="container cat-main">
      <!-- 有游戏时展示 -->
      <template v-if="category.games.length > 0">
        <div class="games-grid">
          <GameCard
            v-for="game in category.games"
            :key="game.id"
            :game="game"
            @click="handleGameClick"
          />
        </div>
      </template>

      <!-- 暂无游戏时 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🎮</div>
        <h3 class="empty-title">游戏开发中</h3>
        <p class="empty-desc">{{ category.name }}的精彩游戏即将上线，敬请期待！</p>
        <button class="btn-primary" @click="router.push('/')">返回大厅</button>
      </div>
    </main>
  </div>

  <!-- 分类不存在 -->
  <div v-else class="not-found page-bg">
    <div class="container" style="padding-top: 120px; text-align: center;">
      <p style="color: rgba(255,255,255,0.4); font-size: 18px;">分类不存在</p>
      <button class="btn-primary" style="margin-top: 20px;" @click="router.push('/')">返回大厅</button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GameCard from '@/components/GameCard/GameCard.vue'
import { getCategoryById } from '@/config/categories.js'
import { useThemeStore } from '@/stores/themeStore'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const category = computed(() => getCategoryById(route.params.id))

const headerStyle = computed(() => {
  if (!category.value) return {}
  const { theme } = category.value
  return {
    '--cat-primary': theme.primary,
    '--cat-secondary': theme.secondary,
    '--cat-text': theme.textColor,
    '--cat-gradient': theme.gradient
  }
})

function applyCurrentTheme() {
  if (category.value) {
    themeStore.applyTheme(category.value.theme)
  }
}

function handleGameClick(game) {
  if (game.routeName) {
    router.push({ name: game.routeName })
  } else {
    alert(`《${game.name}》即将开放，敬请期待！`)
  }
}

onMounted(applyCurrentTheme)
onUnmounted(() => themeStore.clearTheme())
watch(() => route.params.id, applyCurrentTheme)
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;900&family=Noto+Serif+SC:wght@300;500;700&display=swap');

/* ===== 页面背景（对应 body） ===== */
.category-page {
  min-height: 100vh;
  background-color: #1a0f09 !important;
  background-image:
    repeating-linear-gradient(45deg, rgba(170,130,70,0.03) 0px, rgba(170,130,70,0.03) 2px, transparent 2px, transparent 10px),
    radial-gradient(circle at 20% 30%, rgba(150,100,40,0.18) 0%, transparent 40%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #e8d3bb;
  padding: 24px 16px 40px;
}

/* ===== Header：throne-room 上半部分 ===== */
.cat-header {
  position: relative;
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 18px 20px !important;
  overflow: visible !important;
  background: rgba(12, 8, 5, 0.7) !important;
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  border: 1px solid rgba(200, 160, 100, 0.3) !important;
  border-bottom: none !important;
  border-radius: 48px 48px 0 0;
  box-shadow: 0 30px 40px -20px black, 0 0 0 1px rgba(200, 160, 100, 0.2) inset;

  .container {
    max-width: 100%;
    padding: 0;
  }
}

/* 隐藏原有背景层（改为直接设在 cat-header） */
.cat-header-bg {
  display: none;
}

/* ===== 返回按钮（对应 .back-hall） ===== */
.back-btn {
  position: relative;
  z-index: 1;
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.3) !important;
  padding: 6px 14px !important;
  border-radius: 60px !important;
  border: 1px solid rgba(200, 165, 100, 0.5) !important;
  backdrop-filter: blur(4px);
  font-size: 14px !important;
  color: #ecd7ba !important;
  margin-bottom: 20px !important;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.5) !important;
    border-color: rgba(220, 185, 110, 0.8) !important;
    color: #fff !important;
  }
}

/* ===== 英雄区域 ===== */
.cat-hero {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

/* 隐藏 emoji 图标（参考原稿无此元素） */
.cat-icon {
  display: none;
}

.cat-title-wrap {
  width: 100%;
}

/* 主标题（对应 h1）：金色渐变 */
.cat-title {
  font-family: 'Playfair Display', 'Noto Serif SC', serif !important;
  font-size: clamp(42px, 13vw, 58px) !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  background: linear-gradient(180deg, #fbebcf 0%, #d4b17c 70%, #b38946 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent !important;
  text-shadow: none !important;
  letter-spacing: 2px !important;
  margin-bottom: 0 !important;
}

/* 描述（对应 .module-desc）：左竖线 + 斜体 */
.cat-desc {
  font-family: 'Noto Serif SC', serif !important;
  font-size: 15px !important;
  font-weight: 300 !important;
  line-height: 1.7 !important;
  color: #cfbba3 !important;
  border-left: 2px solid #ba9b68;
  padding-left: 16px !important;
  margin: 14px 0 4px !important;
  max-width: 100% !important;
  font-style: italic;
  text-shadow: 0 1px 4px black;
}

/* ===== Main：throne-room 下半部分 ===== */
.cat-main {
  max-width: 420px !important;
  margin: 0 auto 40px !important;
  padding: 22px 18px 32px !important;
  background: rgba(12, 8, 5, 0.7) !important;
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  border: 1px solid rgba(200, 160, 100, 0.3) !important;
  border-top: none !important;
  border-radius: 0 0 36px 36px !important;
  box-shadow: 0 30px 40px -20px black;
}

/* ===== 游戏列表：单列纵向排列（对应 .game-grid） ===== */
.games-grid {
  display: flex !important;
  flex-direction: column !important;
  gap: 22px !important;
  grid-template-columns: unset !important;
  margin: 0 !important;
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 48px 0 24px;
}

.empty-icon {
  font-size: 52px;
  margin-bottom: 18px;
  opacity: 0.3;
}

.empty-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  color: #d4b17c;
  letter-spacing: 3px;
  margin-bottom: 12px;
}

.empty-desc {
  font-size: 13px;
  color: #8b7353;
  margin-bottom: 28px;
  line-height: 1.8;
}
</style>
