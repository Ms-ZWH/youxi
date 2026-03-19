<template>
  <div class="home page-bg">
    <!-- 顶部 Banner -->
    <header class="home-header">
      <div class="header-bg" />
      <div class="container">
        <div class="logo">
          <span class="logo-icon">✦</span>
          <h1 class="logo-text">游戏乐园</h1>
          <span class="logo-icon">✦</span>
        </div>
        <p class="subtitle">选择你的世界，开启专属故事</p>
        <!-- 流动粒子装饰 -->
        <div class="particles">
          <span v-for="i in 12" :key="i" class="particle" :style="particleStyle(i)" />
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container home-main">

      <!-- Tab 切换 -->
      <div class="tab-bar">
        <div class="tab-item" :class="{ active: activeTab === 'free' }" @click="activeTab = 'free'">
          🎮 免费体验
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'vip' }" @click="activeTab = 'vip'">
          👑 全站畅玩
        </div>
      </div>

      <!-- 免费体验 -->
      <div v-if="activeTab === 'free'" class="tab-content">
        <div class="free-game-card" @click="router.push({ name: 'HougongIntro' })">
          <div class="free-game-icon">📺</div>
          <div class="free-game-info">
            <div class="free-game-name">穿越后宫我直播宫斗</div>
            <div class="free-game-desc">穿越进高难度宫斗游戏，开启直播间，从底层秀女一步步逆袭</div>
            <div class="free-game-tags">
              <span class="tag free-tag">免费</span>
              <span class="tag">穿越</span>
              <span class="tag">宫斗</span>
              <span class="tag">养成</span>
            </div>
          </div>
          <i class="fas fa-chevron-right free-game-arrow"></i>
        </div>
      </div>

      <!-- 全站畅玩 -->
      <div v-if="activeTab === 'vip'" class="tab-content">
        <div class="categories-grid">
          <CategoryCard
            v-for="cat in CATEGORIES"
            :key="cat.id"
            :category="cat"
            @click="goToCategory"
          />
        </div>
      </div>

    </main>

    <!-- 底部 -->
    <footer class="home-footer">
      <div class="footer-nav">
        <span class="fnav-icon"><i class="fas fa-music" /></span>
        <span class="fnav-icon fnav-active"><i class="fas fa-star" /></span>
        <span class="fnav-icon"><i class="fas fa-gem" /></span>
      </div>
      <p>✿ 每一个故事，都为你而生 ✿</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CategoryCard from '@/components/CategoryCard/CategoryCard.vue'
import { CATEGORIES } from '@/config/categories.js'
import { useThemeStore } from '@/stores/themeStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const themeStore = useThemeStore()
const userStore  = useUserStore()
const activeTab  = ref('free')

onMounted(() => themeStore.clearTheme())
onUnmounted(() => {})

function goToCategory(category) {
  if (category.routeName) {
    router.push({ name: category.routeName })
  } else {
    router.push({ name: 'Category', params: { id: category.id } })
  }
}

function particleStyle(i) {
  const angle = (i / 12) * 360
  const radius = 30 + Math.random() * 20
  const size = 2 + Math.random() * 4
  const delay = Math.random() * 4
  return {
    '--angle': `${angle}deg`,
    '--radius': `${radius}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    left: `${50 + radius * Math.cos(angle * Math.PI / 180)}%`,
    top: `${50 + radius * Math.sin(angle * Math.PI / 180)}%`
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');

/* ---- 页面背景（对应 body） ---- */
.home {
  min-height: 100vh;
  background: linear-gradient(145deg, #fce7f0 0%, #f5d9e8 100%) !important;
  font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #4a2c3d;
  line-height: 1.5;
}

/* ---- Header ---- */
.home-header {
  position: relative;
  padding: 28px 0 0;
  overflow: hidden;

  .container {
    max-width: 440px;
    position: relative;
  }
}

.header-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 0%, rgba(255, 255, 255, 0.25) 0%, transparent 60%);
  pointer-events: none;
}

/* 粒子：前3个变成 float-dots，其余隐藏 */
.particles {
  position: static;
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  padding-left: 2px;

  .particle {
    position: static !important;
    transform: none !important;
    animation: none !important;
    left: auto !important;
    top: auto !important;
    border-radius: 50%;
    display: none;

    &:nth-child(1) {
      display: block;
      width: 8px !important;
      height: 8px !important;
      background: #f9b8d4;
      box-shadow: 0 2px 8px #fec7df;
    }
    &:nth-child(2) {
      display: block;
      width: 12px !important;
      height: 12px !important;
      background: #fcc9df;
      box-shadow: 0 2px 8px #fec7df;
    }
    &:nth-child(3) {
      display: block;
      width: 6px !important;
      height: 6px !important;
      background: #ffdaec;
    }
  }
}

/* 标题行（对应 .title-row） */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.logo-icon {
  display: none;
}

/* 标题文字（对应 .title-row h1） */
.logo-text {
  font-size: 40px;
  font-weight: 700;
  background: linear-gradient(130deg, #b45a7a, #974468);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  line-height: 1.1;

  @media (max-width: 380px) {
    font-size: 34px;
  }
}

/* 副标题（对应 .sub） */
.subtitle {
  font-size: 16px;
  font-weight: 500;
  color: #a65d81;
  background: #fff3f9;
  padding: 10px 18px;
  border-radius: 50px;
  margin: 16px 0 20px 0;
  box-shadow: 0 4px 12px #fcd0e4;
  display: inline-block;
  border: 1px solid #ffe3f1;
}

/* ---- Main ---- */
.home-main {
  max-width: 440px !important;
  padding: 0 22px 80px;
}

/* 分类标题行（对应 .section-header） */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 32px 0 20px;

  h2 {
    background: #ffecf4;
    padding: 8px 24px;
    border-radius: 40px;
    font-size: 20px;
    font-weight: 600;
    color: #633b52;
    box-shadow: 0 6px 12px -6px #cf9eb6;
    border: 1px solid #ffffff;
    white-space: nowrap;
    letter-spacing: 2px;
  }
}

/* 图标圆圈（对应 .section-header i）和右侧箭头 */
.title-line {
  flex: none;
  background: none;
  height: auto;
  max-width: none;

  /* 第一个：心形图标，白色圆圈 */
  &:first-child {
    background: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px #ffdbea;
    flex-shrink: 0;

    i {
      font-size: 20px;
      color: #e17aa3;
    }
  }

  /* 第二个：箭头 */
  &:last-child {
    display: flex;
    align-items: center;

    i {
      font-size: 16px;
      color: #633b52;
    }
  }
}

/* 两列网格（对应 .game-grid） */
.categories-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 16px;
}

/* ---- Footer（对应 .footer-ornament） ---- */
.home-footer {
  max-width: 440px;
  margin: 0 auto;
  padding: 8px 24px 36px;
  text-align: center;
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 10px;
  opacity: 0.8;
}

/* 底部图标（对应 .footer-ornament i） */
.fnav-icon {
  background: #fff3f9;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 2px 8px #fec7de;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 18px;
    color: #d58bb0;
  }

  &.fnav-active i {
    color: #c2527a;
  }
}

.home-footer p {
  font-size: 12px;
  color: #c78daf;
  letter-spacing: 1px;
}

/* ---- Animations ---- */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); opacity: 0.4; }
  50% { transform: translate(-50%, -50%) translateY(-8px); opacity: 0.8; }
}

/* ---- Tab 切换 ---- */
.tab-bar {
  display: flex;
  gap: 10px;
  margin: 28px 0 20px;
  background: #fff3f9;
  border-radius: 60px;
  padding: 5px;
  border: 1px solid #ffd6eb;
  box-shadow: 0 4px 10px -4px #f0b8d2;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 9px 0;
  border-radius: 60px;
  font-size: 15px;
  font-weight: 600;
  color: #b07090;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;

  &.active {
    background: linear-gradient(130deg, #e8879f, #c9567a);
    color: #fff;
    box-shadow: 0 6px 14px -6px #c0527a;
  }
}

/* ---- 免费游戏卡片 ---- */
.tab-content {
  padding-bottom: 8px;
}

.free-game-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 24px;
  padding: 18px 16px;
  border: 1px solid #ffd6eb;
  box-shadow: 0 10px 24px -10px rgba(180, 90, 130, 0.3);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 28px -10px rgba(180, 90, 130, 0.4);
  }
}

.free-game-icon {
  font-size: 42px;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  background: linear-gradient(140deg, #ffe9f4, #ffd6e9);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px -6px #f3b6d1;
}

.free-game-info {
  flex: 1;
  min-width: 0;
}

.free-game-name {
  font-size: 15px;
  font-weight: 700;
  color: #5e334b;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.free-game-desc {
  font-size: 12px;
  color: #a07090;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.free-game-tags {
  display: flex;
  gap: 5px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 20px;
  background: #fff0f7;
  color: #b07090;
  border: 1px solid #ffd6eb;
  font-weight: 600;

  &.free-tag {
    background: linear-gradient(130deg, #a8e6cf, #79d0b0);
    color: #1a5c46;
    border-color: #79d0b0;
  }
}

.free-game-arrow {
  color: #d0a0b8;
  font-size: 14px;
  flex-shrink: 0;
}
</style>
