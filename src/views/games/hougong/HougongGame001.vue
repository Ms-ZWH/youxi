<template>
  <div class="game-page">

    <!-- 全屏浮动弹幕 -->
    <DanmakuLayer ref="danmakuRef" />

    <!-- 打赏通知 -->
    <transition name="reward-pop">
      <div v-if="rewardNotice" class="reward-notice">
        🎁 {{ rewardNotice }}
      </div>
    </transition>

    <!-- 选项弹框 Modal -->
    <ChoicePanel
      v-if="showChoices"
      :choices="scene.choices"
      :disabled="false"
      @choose="handleChoice"
      @close="onCloseChoices"
    />

    <!-- 悬浮球：关闭弹框后显示 -->
    <transition name="ball-pop">
      <button v-if="showFloatingBall" class="floating-ball" @click="onFloatingBallClick">
        选择
      </button>
    </transition>

    <!-- 章节完成 -->
    <div v-if="store.isChapterEnd" class="chapter-end-overlay">
      <div class="chapter-end-box">
        <div class="end-icon">✦</div>
        <h2>{{ chapterTitle.split('：')[0] }}完成</h2>
        <p class="end-sub">{{ chapterTitle.split('：')[1] }}</p>
        <div class="end-summary">
          <div class="sum-item"><span>最终位分</span><span>{{ store.rank }}</span></div>
          <div class="sum-item"><span>死亡次数</span><span>{{ store.deathCount }} 次</span></div>
          <div class="sum-item"><span>累计积分</span><span>{{ store.points }}</span></div>
        </div>
        <button class="btn-save-end" @click="showSave = true">保存存档</button>
        <button
          v-if="store.currentScene?.startsWith('c01')"
          class="btn-next-chapter"
          @click="store.currentChapter = 2; store.goToScene('c02s01'); store.isChapterEnd = false"
        >进入第二章 →</button>
        <button
          v-else
          class="btn-next-chapter disabled"
          disabled
        >敬请期待第三章</button>
      </div>
    </div>

    <!-- 死亡/重生 -->
    <RebirthScreen
      :visible="store.isDead"
      :reason="store.deathReason"
      :comment="store.deathComment"
      :danmaku="deathDanmaku"
      @rebirth="onRebirth"
    />

    <!-- 商城 -->
    <ShopModal v-if="showShop" @close="showShop = false" />

    <!-- 存档 -->
    <SaveModal v-if="showSave" mode="save" @close="showSave = false" />

    <!-- 主内容卡片 -->
    <div class="throne-card" v-if="scene">
      <div class="ornament"></div>
      <div class="content">

        <!-- 顶部导航 -->
        <div class="nav-top">
          <button class="back-hall" @click="goBack">
            <span class="back-icon">一</span>
            <span>返回大厅</span>
          </button>
          <div class="nav-right">
            <span title="死亡次数">💀 ×{{ store.deathCount }}</span>
          </div>
        </div>

        <!-- 主标题 -->
        <h1 class="game-h1">穿越后宫直播宫斗</h1>

        <!-- 章节标题 -->
        <div class="chapter-heading">{{ chapterTitle }}</div>

        <!-- 故事文本 -->
        <StoryPanel
          :paragraphs="scene.text"
          :reactionText="reactionText"
          @done="onTextDone"
        />

        <!-- 卡片区：直播间 + 属性 -->
        <div class="cards-stack">
          <LivestreamPanel ref="liveRef" />
          <StatusPanel />
        </div>

        <!-- 底部按钮 -->
        <div class="action-buttons">
          <button class="primary-btn" @click="showShop = true">商城</button>
          <button class="secondary-btn" @click="showSave = true">存档</button>
        </div>

        <!-- 底印 -->
        <div class="bottom-seal">坤宁·凤印</div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHougong001Store } from '@/stores/hougong001'
import { useThemeStore } from '@/stores/themeStore'
import { CHAPTER_01 } from './data/chapter01.js'
import { CHAPTER_02 } from './data/chapter02.js'

import StoryPanel     from './components/StoryPanel.vue'
import StatusPanel    from './components/StatusPanel.vue'
import ChoicePanel    from './components/ChoicePanel.vue'
import DanmakuLayer   from './components/DanmakuLayer.vue'
import LivestreamPanel from './components/LivestreamPanel.vue'
import ShopModal      from './components/ShopModal.vue'
import RebirthScreen  from './components/RebirthScreen.vue'
import SaveModal      from './components/SaveModal.vue'

const router = useRouter()
const store = useHougong001Store()
const themeStore = useThemeStore()

// ── refs ──────────────────────────────────────────────────
const danmakuRef  = ref(null)
const liveRef     = ref(null)
const textDone    = ref(false)
const reactionText = ref('')
const isTransitioning = ref(false)
const rewardNotice = ref('')
const showShop    = ref(false)
const showSave    = ref(false)
const deathDanmaku = ref([])
const showChoices  = ref(false)
const choiceDismissed = ref(false)
let choiceTimer = null

// 悬浮球：弹框被关闭且选项仍可用时显示
const showFloatingBall = computed(() =>
  choiceDismissed.value &&
  textDone.value &&
  !reactionText.value &&
  !isTransitioning.value &&
  !!scene.value?.choices?.length &&
  !store.isDead &&
  !store.isChapterEnd
)

// 文字打完后延迟3秒弹出选项框
function scheduleChoices() {
  clearTimeout(choiceTimer)
  if (
    !textDone.value || reactionText.value || isTransitioning.value ||
    !scene.value?.choices?.length || store.isDead || store.isChapterEnd
  ) return
  choiceDismissed.value = false
  choiceTimer = setTimeout(() => {
    if (
      !textDone.value || reactionText.value || isTransitioning.value ||
      !scene.value?.choices?.length || store.isDead || store.isChapterEnd
    ) return
    showChoices.value = true
  }, 3000)
}

function onCloseChoices() {
  showChoices.value = false
  choiceDismissed.value = true
}

function onFloatingBallClick() {
  choiceDismissed.value = false
  showChoices.value = true
}

// ── 保护跳转：直接访问URL但未开始游戏时回到序章 ──────────
onMounted(() => {
  if (!store.gameStarted) {
    router.replace({ name: 'HougongIntro' })
  }
})

// ── 当前场景 ──────────────────────────────────────────────
const allScenes = { ...CHAPTER_01.scenes, ...CHAPTER_02.scenes }

const scene = computed(() => allScenes[store.currentScene] || null)

const chapterTitle = computed(() => {
  const id = store.currentScene || ''
  if (id.startsWith('c02')) return CHAPTER_02.title
  return CHAPTER_01.title
})

// ── 挂载时应用主题 ────────────────────────────────────────
themeStore.applyTheme({
  primary: '#c0392b', secondary: '#f39c12', accent: '#8b0000',
  bg: '#0f0500', cardBg: 'rgba(139,0,0,0.15)',
  gradient: 'linear-gradient(135deg, #1a0a00 0%, #2a0800 50%, #1a0a00 100%)',
  pattern: 'palace', textColor: '#f5d76e',
})

// ── 场景切换时重置选项状态 ────────────────────────────────
watch(scene, (newScene) => {
  if (!newScene) return
  textDone.value = false
  reactionText.value = ''
  showChoices.value = false
  choiceDismissed.value = false
  clearTimeout(choiceTimer)

  if (newScene.danmaku?.length) {
    setTimeout(() => {
      danmakuRef.value?.fire(newScene.danmaku)
      liveRef.value?.addDanmakuBatch(newScene.danmaku)
    }, 1200)
  }

  if (newScene.reward) {
    setTimeout(() => triggerReward(newScene.reward), 2000)
  }

  if (newScene.isDeath) {
    deathDanmaku.value = newScene.danmaku || []
    setTimeout(() => {
      store.triggerDeath(
        newScene.deathReason,
        newScene.deathComment,
        newScene.rebirthTo || 'c01s01'
      )
    }, 3000)
  }

  if (newScene.isChapterEnd) {
    setTimeout(() => { store.isChapterEnd = true }, 2500)
  }
}, { immediate: true })

// ── 文字打完 ──────────────────────────────────────────────
function onTextDone() {
  textDone.value = true
  scheduleChoices()
}

// ── 处理选择 ──────────────────────────────────────────────
function handleChoice(choice) {
  if (isTransitioning.value) return

  // 道具条件检查
  if (choice.conditionItem && !store.hasItem(choice.conditionItem)) {
    const msg = choice.failReaction || '背包中没有所需道具。'
    reactionText.value = msg
    setTimeout(() => { reactionText.value = '' }, 2000)
    return
  }

  showChoices.value = false
  choiceDismissed.value = false
  isTransitioning.value = true

  // 消耗道具
  if (choice.conditionItem) store.consumeItem(choice.conditionItem)

  let succeed = true
  if (choice.condition) {
    const { attr, min } = choice.condition
    succeed = store.attrs[attr] >= min
  }

  const nextScene = succeed ? choice.next : (choice.failNext || choice.next)
  const reaction  = succeed ? choice.reaction : (choice.failReaction || choice.reaction || '')
  const effect    = succeed ? choice.effect : null
  const reward    = succeed ? choice.reward  : null

  if (effect) store.applyEffect(effect)

  if (reaction) {
    reactionText.value = reaction
    if (reward) setTimeout(() => triggerReward(reward), 600)
    setTimeout(() => {
      reactionText.value = ''
      transitionToScene(nextScene, choice)
    }, 2200)
  } else {
    if (reward) triggerReward(reward)
    transitionToScene(nextScene, choice)
  }
}

function transitionToScene(nextId, choice) {
  if (!nextId) {
    store.isChapterEnd = true
    isTransitioning.value = false
    return
  }
  setTimeout(() => {
    const currentSceneData = allScenes[store.currentScene]
    if (currentSceneData?.effect?.rank) {
      store.rank = currentSceneData.effect.rank
    }
    store.goToScene(nextId)
    isTransitioning.value = false
  }, 300)
}

// ── 打赏通知 ──────────────────────────────────────────────
function triggerReward(reward) {
  store.points += reward.points || 0
  const giftMap = { '棒棒糖': '🍭', '小花花': '🌸', '火箭': '🚀', '超级星星': '⭐' }
  const giftIcon = giftMap[reward.gift] || '🎁'
  const msg = `【打赏】观众打赏了${giftIcon}${reward.gift}×1，获得积分+${reward.points}！`
  rewardNotice.value = msg
  liveRef.value?.addReward(msg)
  setTimeout(() => { rewardNotice.value = '' }, 3000)
}

// ── 重生回调 ──────────────────────────────────────────────
function onRebirth() {
  isTransitioning.value = false
  reactionText.value = ''
  textDone.value = false
  liveRef.value?.addMessage('系统', '时间线回溯完成，你又回来了。')
}

// ── 返回大厅 ──────────────────────────────────────────────
function goBack() {
  themeStore.clearTheme()
  router.push('/')
}
</script>

<style lang="scss" scoped>
/* ── 全页背景 ─────────────────────────────────────────── */
.game-page {
  width: 100%;
  min-height: 100vh;
  background-color: #1a0f09;
  background-image:
    repeating-linear-gradient(45deg, rgba(170,130,70,0.03) 0px, rgba(170,130,70,0.03) 2px, transparent 2px, transparent 10px),
    radial-gradient(circle at 20% 30%, rgba(150,100,40,0.18) 0%, transparent 40%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0 40px;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow-y: auto;
}

/* ── 主卡片（紫檀屏风） ──────────────────────────────── */
.throne-card {
  width: 100%;
  max-width: 420px;
  margin: 0 16px;
  background: rgba(12, 8, 5, 0.7);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  border: 1px solid rgba(200, 160, 100, 0.3);
  border-radius: 48px 48px 36px 36px;
  box-shadow: 0 30px 40px -20px black, 0 0 0 1px rgba(200,160,100,0.2) inset;
  padding: 24px 18px 32px;
  position: relative;
  overflow: hidden;

  /* 暗纹底纹 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" opacity="0.07"><path d="M30 40 Q 50 20 70 40 T 110 40" stroke="%23d4b078" fill="none" stroke-width="0.8"/><circle cx="50" cy="65" r="3" fill="%23d4b078" opacity="0.3"/><circle cx="80" cy="65" r="3" fill="%23d4b078" opacity="0.3"/><path d="M40 95 Q 60 80 80 95" stroke="%23b29060" fill="none" stroke-width="1"/></svg>');
    background-repeat: repeat;
    background-size: 110px 110px;
    pointer-events: none;
    z-index: 0;
  }
}

/* 光点装饰 */
.ornament {
  position: absolute;
  top: 20px; right: 25px;
  width: 10px; height: 10px;
  background: radial-gradient(circle at 20% 20%, #ffddb0, #b08240);
  border-radius: 50%;
  box-shadow: 0 0 15px 3px #eac884;
  opacity: 0.5;
  z-index: 1;
  pointer-events: none;
}

/* ── 内容层 ──────────────────────────────────────────── */
.content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── 顶部导航 ─────────────────────────────────────────── */
.nav-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(200, 165, 110, 0.4);
}

.back-hall {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 14px 6px 10px;
  border-radius: 60px;
  border: 1px solid rgba(200, 165, 100, 0.5);
  backdrop-filter: blur(4px);
  font-size: 14px;
  color: #ecd7ba;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover { border-color: rgba(200, 165, 100, 0.85); }
}

.back-icon {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 20px;
  font-weight: 500;
  color: #e2c48b;
  margin-right: 2px;
}

.nav-right {
  font-size: 14px;
  color: #b69662;
}

/* ── 主标题 ───────────────────────────────────────────── */
.game-h1 {
  font-family: 'Playfair Display', 'Noto Serif SC', 'STSong', serif;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.2;
  background: linear-gradient(180deg, #fbebcf 0%, #d4b17c 70%, #b38946 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  margin: 4px 0 0;
}

/* ── 章节标题 ─────────────────────────────────────────── */
.chapter-heading {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 18px;
  font-weight: 600;
  color: #e4c99e;
  border-left: 4px solid #b68f54;
  padding-left: 12px;
  text-shadow: 0 1px 4px black;
}

/* ── 卡片堆叠 ─────────────────────────────────────────── */
.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── 底部按钮 ─────────────────────────────────────────── */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.primary-btn {
  flex: 1;
  background: linear-gradient(145deg, #dbb77a 0%, #be9357 80%);
  border: none;
  border-radius: 60px;
  padding: 16px 10px;
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 20px;
  font-weight: 700;
  color: #1e130b;
  letter-spacing: 3px;
  box-shadow: 0 8px 18px -8px #0f0803, 0 0 0 1px #fceaca inset, 0 0 0 2px #6e4f28 inset;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
}

.secondary-btn {
  flex: 1;
  background: linear-gradient(145deg, #ac8f60, #8e6d40);
  border: none;
  border-radius: 60px;
  padding: 16px 10px;
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 20px;
  font-weight: 700;
  color: #20180c;
  letter-spacing: 3px;
  box-shadow: 0 8px 18px -8px #0f0803, 0 0 0 1px #e9cfaa inset, 0 0 0 2px #5f421f inset;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  &:hover { opacity: 0.88; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
}

/* ── 底印 ─────────────────────────────────────────────── */
.bottom-seal {
  text-align: center;
  font-size: 10px;
  color: #5e4e33;
  opacity: 0.4;
  margin-top: -6px;
}

/* ── 悬浮球 ──────────────────────────────────────────── */
.floating-ball {
  position: fixed;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(145deg, #dbb77a, #9a6f30);
  border: 2px solid rgba(255, 220, 150, 0.5);
  box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 0 0 4px rgba(200,160,80,0.15);
  color: #1e130b;
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  z-index: 90;
  animation: breathe 2s ease-in-out infinite;
}

.ball-pop-enter-active { animation: ballIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.ball-pop-leave-active { animation: ballIn 0.25s ease reverse; }

@keyframes breathe {
  0%, 100% { transform: translateX(-50%) scale(1);    box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 0 0 4px rgba(200,160,80,0.15); }
  50%       { transform: translateX(-50%) scale(1.1); box-shadow: 0 8px 28px rgba(0,0,0,0.7), 0 0 0 8px rgba(200,160,80,0.2); }
}

@keyframes ballIn {
  from { opacity: 0; transform: translateX(-50%) scale(0.5); }
  to   { opacity: 1; transform: translateX(-50%) scale(1); }
}

/* ── 打赏通知（fixed） ───────────────────────────────── */
.reward-notice {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 10, 7, 0.92);
  border: 1px solid rgba(200, 160, 100, 0.5);
  color: #f5d76e;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 13px;
  z-index: 300;
  pointer-events: none;
  backdrop-filter: blur(6px);
  white-space: nowrap;
}
.reward-pop-enter-active { animation: rewardIn 0.4s ease; }
.reward-pop-leave-active { animation: rewardIn 0.3s ease reverse; }
@keyframes rewardIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.95); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

/* ── 章节完成弹框 ─────────────────────────────────────── */
.chapter-end-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.88);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 150;
  padding: 0 16px;
}
.chapter-end-box {
  width: 100%;
  max-width: 380px;
  text-align: center;
  background: linear-gradient(160deg, #100800, #1e1000);
  border: 1px solid rgba(200,160,100,0.35);
  border-radius: 28px;
  padding: 36px 28px;
}
.end-icon { font-size: 32px; color: #d4b17c; margin-bottom: 14px; animation: spinSlow 6s linear infinite; }
.chapter-end-box h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 24px;
  color: #fadcad;
  letter-spacing: 5px;
  margin-bottom: 6px;
}
.end-sub { font-size: 13px; color: rgba(255,255,255,0.35); letter-spacing: 3px; margin-bottom: 24px; }
.end-summary { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.sum-item {
  display: flex; justify-content: space-between; padding: 8px 14px;
  background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 14px;
  span:first-child { color: rgba(255,255,255,0.45); }
  span:last-child { color: #fadcad; }
}
.btn-save-end {
  width: 100%; padding: 14px 0;
  background: linear-gradient(135deg, #8b6020, #be9357);
  border: none; border-radius: 60px;
  color: #1e130b; font-size: 16px;
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 3px; cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
}
.btn-next-chapter {
  width: 100%; padding: 14px 0;
  background: linear-gradient(135deg, #6b1a1a, #c0392b);
  border: none; border-radius: 60px;
  color: #fbeaca; font-size: 16px;
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 3px; cursor: pointer;
  transition: opacity 0.2s;
  box-shadow: 0 4px 16px rgba(192,57,43,0.4);
  &:hover:not(:disabled) { opacity: 0.85; }
  &.disabled, &:disabled {
    background: rgba(80,60,40,0.5);
    color: rgba(255,255,255,0.3);
    cursor: default;
    box-shadow: none;
  }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
