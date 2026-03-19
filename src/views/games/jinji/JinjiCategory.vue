<template>
  <div class="jinji-page">
    <div class="card">

      <!-- 顶部返回 -->
      <div class="nav-return" @click="router.push('/')">
        <i class="fas fa-arrow-left"></i>
        <span>返回大厅</span>
      </div>

      <!-- 禁忌符号 -->
      <div class="symbol">
        <div class="symbol-ring"></div>
        <i class="fas fa-heart"></i>
      </div>

      <!-- 主标题 -->
      <div class="title-block">
        <h1 class="title-main">禁忌之恋</h1>
        <div class="title-sub">FORBIDDEN LOVE</div>
      </div>

      <!-- 命运文案 -->
      <div class="fate-text">
        命运交错，越界的爱恋，<br>越是禁忌越是心动
      </div>

      <!-- 游戏卡片 -->
      <div class="system-card">
        <div class="system-header">
          <div class="system-icon">
            <i class="fas fa-crown"></i>
          </div>
          <div class="system-title">
            绑定富婆系统后<br>包养三个小白脸
          </div>
        </div>

        <div class="tag-list">
          <span class="tag highlight"><i class="fas fa-heart"></i>禁忌之恋</span>
          <span class="tag"><i class="fas fa-coins"></i>逆袭</span>
          <span class="tag"><i class="fas fa-venus-mars"></i>多线攻略</span>
          <span class="tag"><i class="fas fa-robot"></i>系统流</span>
          <span class="tag"><i class="fas fa-hand-holding-heart"></i>养成</span>
          <span class="tag"><i class="fas fa-ban"></i>越界</span>
        </div>

        <div class="system-desc">
          <i class="fas fa-star"></i> 操控命运，游走于三个男人之间
        </div>

        <div class="btn-start" @click="handleStart">
          <i class="fas fa-play"></i> 开始游戏
          <i class="fas fa-heart" style="font-size: 0.8rem; opacity: 0.7;"></i>
        </div>
      </div>

      <!-- 人妻模拟器 -->
      <div class="system-card">
        <div class="system-header">
          <div class="system-icon">
            <i class="fas fa-ring"></i>
          </div>
          <div class="system-title">
            人妻模拟器之现代<br>厌倦丈夫之后
          </div>
        </div>

        <div class="tag-list">
          <span class="tag highlight"><i class="fas fa-heart"></i>禁忌之恋</span>
          <span class="tag"><i class="fas fa-home"></i>现代</span>
          <span class="tag"><i class="fas fa-theater-masks"></i>情感</span>
          <span class="tag"><i class="fas fa-random"></i>多结局</span>
          <span class="tag"><i class="fas fa-gamepad"></i>模拟</span>
        </div>

        <div class="system-desc">
          <i class="fas fa-star"></i> 婚姻围城里，厌倦与渴望交织的禁忌故事
        </div>

        <div class="btn-start" @click="handleStartRenwei">
          <i class="fas fa-play"></i> 开始游戏
          <i class="fas fa-heart" style="font-size: 0.8rem; opacity: 0.7;"></i>
        </div>
      </div>

      <!-- 即将上线 -->
      <div class="coming-soon">
        <strong>禁忌之恋</strong>后续的精彩游戏即将上线，敬请期待！
      </div>

      <!-- 底部返回 -->
      <div class="bottom-return">
        <div class="btn-return" @click="router.push('/')">
          <i class="fas fa-arrow-left"></i>
          返回大厅
          <i class="fas fa-heart" style="font-size: 0.9rem; opacity: 0.6;"></i>
        </div>
      </div>

      <div class="divider-light"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router    = useRouter()
const userStore = useUserStore()

function handleStart() {
  if (!userStore.isVip) {
    router.push('/shop')
    return
  }
  router.push({ name: 'JinjiGame001' })
}

function handleStartRenwei() {
  if (!userStore.isVip) {
    router.push('/shop')
    return
  }
  router.push({ name: 'RenweiGame001' })
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.jinji-page {
  background: #0b0101;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  padding: 20px;
  background-image:
    radial-gradient(circle at 30% 40%, rgba(100, 20, 20, 0.25) 0%, transparent 40%),
    repeating-linear-gradient(45deg, rgba(255, 200, 200, 0.02) 0px, rgba(255, 200, 200, 0.02) 2px, transparent 2px, transparent 6px);
}

/* ── 主卡片 ── */
.card {
  max-width: 440px;
  width: 100%;
  background: rgba(18, 8, 8, 0.7);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 48px;
  border: 1px solid rgba(200, 120, 120, 0.25);
  box-shadow: 0 40px 70px -20px black, 0 0 0 1px rgba(170, 90, 90, 0.2) inset, 0 0 40px rgba(100, 20, 0, 0.3);
  padding: 32px 24px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20%; left: -10%;
    width: 200px; height: 200px;
    background: radial-gradient(circle, #a53a3a20, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -10%; right: -10%;
    width: 250px; height: 250px;
    background: radial-gradient(circle, #7a2e2e20, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

/* ── 顶部返回 ── */
.nav-return {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #cfa8a8;
  border-bottom: 1px solid rgba(190, 120, 120, 0.3);
  padding-bottom: 14px;
  width: fit-content;
  cursor: pointer;
  position: relative;
  z-index: 1;

  i { font-size: 1rem; color: #c08282; }

  &:hover { color: #ffcece; i { color: #ffaaaa; } }
}

/* ── 符号 ── */
.symbol {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0 20px;
  position: relative;
  z-index: 1;
}

.symbol-ring {
  width: 100px; height: 100px;
  border: 2px solid rgba(200, 130, 130, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 30px #c06666, 0 0 0 1px #a73f3f inset;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    width: 110px; height: 110px;
    border: 1.5px solid rgba(190, 90, 90, 0.4);
    border-radius: 50%;
    border-top-color: transparent;
    border-right-color: transparent;
    transform: rotate(-25deg);
    box-shadow: 0 0 15px #ff5e5e80;
  }
  &::after {
    content: '';
    position: absolute;
    width: 70px; height: 2px;
    background: linear-gradient(90deg, transparent, #ffa0a0, #ff6060, #a12b2b, transparent);
    transform: rotate(45deg) scaleX(1.2);
    filter: blur(1px);
    opacity: 0.7;
  }
}

.symbol > i {
  position: absolute;
  font-size: 2.4rem;
  color: #ffd0d0;
  filter: drop-shadow(0 0 12px #ff5a5a);
  text-shadow: 0 2px 8px #4f0000;
  z-index: 2;
  opacity: 0.9;
}

/* ── 主标题 ── */
.title-block {
  text-align: center;
  margin: 20px 0 10px;
  position: relative;
  z-index: 1;
}

.title-main {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 4rem;
  line-height: 1;
  background: linear-gradient(165deg, #fff1f1, #fbbbbb, #ff8a8a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.title-sub {
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #bc8f8f;
  border-top: 1px solid #a1565650;
  border-bottom: 1px solid #a1565650;
  display: inline-block;
  padding: 8px 16px;
}

/* ── 命运文案 ── */
.fate-text {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.7;
  max-width: 300px;
  margin: 20px auto 25px;
  color: #f0cfcf;
  background: rgba(50, 15, 15, 0.3);
  backdrop-filter: blur(8px);
  padding: 16px 15px;
  border-radius: 50px;
  border: 1px solid rgba(200, 120, 120, 0.25);
  box-shadow: 0 12px 20px -12px #220000;
  position: relative;
  z-index: 1;
}

/* ── 游戏卡片 ── */
.system-card {
  background: rgba(20, 8, 8, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(210, 140, 140, 0.4);
  border-radius: 32px;
  padding: 20px 18px;
  margin: 30px 0 25px;
  box-shadow: 0 20px 30px -15px #1a0101, 0 0 0 1px #a75858 inset;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.system-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.system-icon {
  width: 52px; height: 52px;
  background: rgba(160, 70, 70, 0.25);
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #b46b6b;
  box-shadow: 0 0 20px #c06969;
  flex-shrink: 0;

  i { font-size: 1.6rem; color: #ffd8b0; filter: drop-shadow(0 0 6px #ffb56b); }
}

.system-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1.7rem;
  line-height: 1.2;
  background: linear-gradient(145deg, #ffe7e7, #ffb8b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

/* ── 标签 ── */
.tag-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 5px;
}

.tag {
  background: rgba(80, 25, 25, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(200, 110, 110, 0.5);
  border-radius: 40px;
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 300;
  color: #fad1d1;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  text-align: center;

  i { margin-right: 5px; font-size: 0.75rem; color: #ffa8a8; }

  &.highlight {
    background: rgba(150, 50, 50, 0.5);
    border-color: #ff9f9f;
    color: #ffefef;
    font-weight: 400;
  }
}

/* ── 描述 ── */
.system-desc {
  font-size: 0.9rem;
  color: #dbb2b2;
  font-weight: 300;
  border-left: 2px solid #a14f4f;
  padding-left: 14px;
  margin: 6px 0 8px;

  i { color: #ffacac; margin-right: 5px; }
}

/* ── 即将开放按钮 ── */
.btn-coming {
  background: rgba(100, 100, 100, 0.25);
  border: 1.5px solid rgba(200, 200, 200, 0.4);
  border-radius: 40px;
  padding: 10px 28px;
  font-size: 1rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  align-self: center;
  cursor: default;
  i { opacity: 0.6; }
}

/* ── 开始游戏按钮 ── */
.btn-start {
  background: rgba(180, 70, 70, 0.3);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(255, 150, 150, 0.7);
  border-radius: 40px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #fff0f0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 14px rgba(70, 0, 0, 0.6), 0 0 0 1px #ffb2b2 inset;
  transition: all 0.2s;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 8px;
  align-self: center;

  i { font-size: 1rem; color: #ffcbcb; }

  &:hover {
    background: rgba(200, 80, 80, 0.5);
    border-color: #ffbebe;
    box-shadow: 0 0 20px #ff7979, 0 0 0 1px #ffc1c1 inset;
    transform: scale(1.02);
  }
}

/* ── 即将上线 ── */
.coming-soon {
  text-align: center;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  padding: 16px 15px;
  margin: 12px 0 28px;
  background: rgba(25, 8, 8, 0.4);
  border-radius: 40px;
  border: 1px dashed rgba(190, 90, 90, 0.6);
  color: #eccaca;
  backdrop-filter: blur(4px);
  position: relative;
  z-index: 1;

  strong { font-weight: 500; color: #ffc3c3; }
}

/* ── 底部返回 ── */
.bottom-return {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.btn-return {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(20, 5, 5, 0.3);
  border: 1px solid rgba(210, 140, 140, 0.5);
  border-radius: 60px;
  padding: 16px 45px;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 3px;
  color: #f2c1c1;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 20px -10px #2b0101, 0 0 15px rgba(255, 120, 120, 0.2) inset;
  transition: all 0.25s;
  cursor: pointer;
  text-transform: uppercase;

  i { font-size: 1.1rem; color: #ffa3a3; }

  &:hover {
    background: rgba(50, 10, 10, 0.5);
    border-color: rgba(255, 160, 160, 0.7);
    i:first-child { transform: translateX(-3px); }
  }
}

/* ── 分隔线 ── */
.divider-light {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #b77878, transparent);
  margin: 15px auto 10px;
  position: relative;
  z-index: 1;
}

/* ── 小屏适配 ── */
@media (max-width: 380px) {
  .title-main { font-size: 3.2rem; }
  .system-title { font-size: 1.4rem; }
  .btn-return { padding: 14px 30px; }
  .btn-start { padding: 8px 20px; }
}
</style>
