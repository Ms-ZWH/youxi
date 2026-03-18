<template>
  <div class="intro-page">
    <!-- 暗纹底 -->
    <div class="bg-texture" />

    <!-- 装饰金点 -->
    <div class="ornament-dot" />
    <div class="ornament-dot dot-2" />

    <div class="scroll-wrap">
      <div class="palace-card">

        <!-- ① 顶部导航 -->
        <div class="nav-top">
          <button class="back-btn" @click="router.push({ name: 'Category', params: { id: 'hougong' } })">
            ← 返回大厅
          </button>
          <span class="chapter-badge">序章 · 游园惊梦</span>
        </div>

        <!-- ② 开场引语 -->
        <div class="opening-quote">
          <div class="quote-line" />
          <p class="quote-text">
            乾隆三年，你死了一百七十三次<br />
            <span class="quote-sub">——每次都被弹幕嘲笑。</span>
          </p>
          <div class="quote-line" />
        </div>

        <!-- ③ 故事背景 -->
        <section class="section">
          <div class="section-label">
            <span class="label-icon">⚘</span>
            <span>故事背景</span>
            <span class="label-icon">⚘</span>
          </div>

          <div class="lore-card">
            <p class="lore-text">
              你原是一名无业宅女，某天在手机上开了款新出的宫斗 RPG。
              游戏难度地狱级，主角死亡率 96.3%，论坛清一色骂声。
            </p>
            <p class="lore-text">
              然后你睡了一觉——醒来，已是
              <em class="highlight">乾隆三年，紫禁城，储秀宫东配殿</em>。
              你穿进了游戏里，附身于那个存活率最低的底层角色：
              秀女<strong>叶芷宁</strong>。
            </p>
            <p class="lore-text">
              比穿越本身更荒诞的是——脑海里多了一个
              <em class="highlight">「直播系统」</em>。
              来自现代的百万观众正通过屏幕围观你的每一步。
              弹幕、打赏、道具……他们能帮你，也能害你。
            </p>
            <p class="lore-text lore-last">
              这一次，你必须用一个底层秀女的身份，
              在勾心斗角的深宫里活下去，活出名堂——
              而数据会永远记录你死过多少次。
            </p>
          </div>
        </section>

        <!-- ④ 人物图鉴 -->
        <section class="section">
          <div class="section-label">
            <span class="label-icon">⚘</span>
            <span>人物图鉴</span>
            <span class="label-icon">⚘</span>
          </div>

          <div class="char-grid">

            <div class="char-card char-self">
              <div class="char-role">主角 · 你</div>
              <div class="char-name">叶 芷 宁</div>
              <div class="char-tag-row">
                <span class="char-tag">穿越者</span>
                <span class="char-tag">直播主播</span>
              </div>
              <p class="char-desc">
                外表怯懦、实则清醒。
                上辈子的网络知识与这辈子的宫廷规则
                在你脑中激烈碰撞。
                死亡不是结局——重生才是。
              </p>
              <div class="char-stat">
                <span class="stat-item">智谋 <em>??</em></span>
                <span class="stat-item">魅力 <em>??</em></span>
                <span class="stat-item">运气 <em>??</em></span>
              </div>
            </div>

            <div class="char-card">
              <div class="char-role">贴身宫女</div>
              <div class="char-name">春 桃</div>
              <div class="char-tag-row">
                <span class="char-tag">忠心</span>
                <span class="char-tag">胆小</span>
              </div>
              <p class="char-desc">
                宫里消息最灵通的小宫女，
                知道的秘密多，胆子却小。
                她是你在宫中最初的眼线，
                也是最脆弱的软肋。
              </p>
              <div class="char-stat">
                <span class="stat-item">忠诚 <em>★★★★☆</em></span>
              </div>
            </div>

            <div class="char-card char-rival">
              <div class="char-role">劲敌 · 警惕</div>
              <div class="char-name">周 玉 儿</div>
              <div class="char-tag-row">
                <span class="char-tag">心机</span>
                <span class="char-tag">美貌</span>
              </div>
              <p class="char-desc">
                出身书香门第的储秀宫美人，
                笑面迎人、刀藏袖里。
                她是你第一个真正的对手——
                也可能是未来最难对付的盟友。
              </p>
              <div class="char-stat">
                <span class="stat-item">危险度 <em>★★★★☆</em></span>
              </div>
            </div>

            <div class="char-card char-emperor">
              <div class="char-role">至高权威</div>
              <div class="char-name">皇 帝</div>
              <div class="char-tag-row">
                <span class="char-tag">喜怒无常</span>
                <span class="char-tag">赏罚分明</span>
              </div>
              <p class="char-desc">
                他在上，所有人在下。
                一个眼神能让你飞黄腾达，
                一道旨意能让你魂飞魄散。
                讨好他——或许能活。
                触怒他——必然速死。
              </p>
              <div class="char-stat">
                <span class="stat-item">危险度 <em>★★★★★</em></span>
              </div>
            </div>

          </div>
        </section>

        <!-- ⑤ 直播间须知 -->
        <section class="section warning-section">
          <div class="warning-header">
            <span class="warning-icon">⚠</span>
            <span>直播间须知</span>
          </div>
          <div class="warning-grid">
            <div class="warn-item">
              <span class="warn-icon">💀</span>
              <div>
                <div class="warn-title">高死亡率</div>
                <div class="warn-desc">首周存活率 3.7%</div>
              </div>
            </div>
            <div class="warn-item">
              <span class="warn-icon">♾</span>
              <div>
                <div class="warn-title">无限重生</div>
                <div class="warn-desc">死了重来，记忆保留</div>
              </div>
            </div>
            <div class="warn-item">
              <span class="warn-icon">📡</span>
              <div>
                <div class="warn-title">弹幕助力</div>
                <div class="warn-desc">观众投票影响剧情</div>
              </div>
            </div>
            <div class="warn-item">
              <span class="warn-icon">🪙</span>
              <div>
                <div class="warn-title">打赏解锁</div>
                <div class="warn-desc">金币兑换关键道具</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ⑥ 存档 / 新游戏 -->
        <div class="cta-wrap">
          <p class="cta-hint">直播间已就绪，观众正在等待……</p>

          <!-- 存档槽（有存档时显示） -->
          <div v-if="hasSaves" class="save-slots">
            <div class="section-label" style="margin-bottom: 10px;">
              <span class="label-icon">⚘</span>
              <span>继续存档</span>
              <span class="label-icon">⚘</span>
            </div>
            <div
              v-for="(slot, i) in store.saveSlots"
              :key="i"
              class="slot-item"
              :class="{ 'has-save': !!slot }"
              @click="loadSlot(i, slot)"
            >
              <span class="slot-index">存档 {{ i + 1 }}</span>
              <div v-if="slot" class="slot-info">
                <span class="slot-main">{{ slot.rank }} · 第{{ slot.chapter }}章</span>
                <span class="slot-meta">积分 {{ slot.points }} · {{ formatDate(slot.updatedAt) }}</span>
              </div>
              <span v-else class="slot-empty">— 空存档槽 —</span>
            </div>
          </div>

          <button class="cta-btn" @click="startNew">
            <span class="cta-icon">📡</span>
            {{ hasSaves ? '开始新游戏' : '开启直播 · 入宫' }}
          </button>
          <p class="cta-warn">⚠ 一旦入宫，命运由你掌握</p>
        </div>

        <!-- ⑦ 底部铭文 -->
        <div class="signature">
          <span>⚘ 坤宁选侍 · 凤印 ⚘</span>
        </div>

      </div><!-- /palace-card -->
    </div><!-- /scroll-wrap -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/themeStore'
import { useHougong001Store } from '@/stores/hougong001'
import { onMounted, onUnmounted, computed } from 'vue'
import { getCategoryById } from '@/config/categories.js'

const router = useRouter()
const themeStore = useThemeStore()
const store = useHougong001Store()

onMounted(() => {
  const theme = getCategoryById('hougong')?.theme
  if (theme) themeStore.applyTheme(theme)
})
onUnmounted(() => themeStore.clearTheme())

const hasSaves = computed(() => store.saveSlots.some(s => s !== null))

function startNew() {
  store.startNewGame()
  router.push({ name: 'HougongGame001' })
}

function loadSlot(i, slot) {
  if (!slot) return
  store.loadFromSlot(i)
  router.push({ name: 'HougongGame001' })
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;900&family=Noto+Serif+SC:wght@300;500;700&display=swap');

/* ===== 页面底 ===== */
.intro-page {
  min-height: 100vh;
  background-color: #1a0f09;
  background-image:
    repeating-linear-gradient(45deg, rgba(170,130,70,0.03) 0px, rgba(170,130,70,0.03) 2px, transparent 2px, transparent 10px),
    radial-gradient(circle at 20% 30%, rgba(150,100,40,0.18) 0%, transparent 40%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #e8d3bb;
  position: relative;
  overflow-x: hidden;
}

.bg-texture {
  position: fixed;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" opacity="0.06"><path d="M30 40 Q 50 20 70 40 T 110 40" stroke="%23d4b078" fill="none" stroke-width="0.8"/><circle cx="50" cy="65" r="3" fill="%23d4b078" opacity="0.3"/><circle cx="80" cy="65" r="3" fill="%23d4b078" opacity="0.3"/><path d="M40 95 Q 60 80 80 95" stroke="%23b29060" fill="none" stroke-width="1"/></svg>');
  background-size: 110px 110px;
  pointer-events: none;
  z-index: 0;
}

.ornament-dot {
  position: fixed;
  top: 80px;
  right: calc(50% - 230px);
  width: 10px;
  height: 10px;
  background: radial-gradient(circle at 30% 30%, #ffddb0, #b08240);
  border-radius: 50%;
  box-shadow: 0 0 18px 4px rgba(220, 170, 80, 0.5);
  opacity: 0.55;
  z-index: 1;
  pointer-events: none;
}

.dot-2 {
  top: auto;
  bottom: 100px;
  right: auto;
  left: calc(50% - 225px);
  width: 7px;
  height: 7px;
  opacity: 0.35;
}

/* ===== 滚动容器 ===== */
.scroll-wrap {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  padding: 24px 16px 48px;
}

/* ===== 主卡（palace-card） ===== */
.palace-card {
  width: 100%;
  max-width: 420px;
  background: rgba(12, 8, 5, 0.75);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(200, 160, 100, 0.3);
  border-radius: 48px 48px 40px 40px;
  box-shadow: 0 30px 50px -20px black, 0 0 0 1px rgba(200,160,100,0.15) inset;
  padding: 24px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ===== 顶部导航 ===== */
.nav-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(200, 165, 110, 0.3);
  padding-bottom: 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.3);
  padding: 6px 14px;
  border-radius: 60px;
  border: 1px solid rgba(200,165,100,0.5);
  font-size: 13px;
  color: #ecd7ba;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;

  &:hover {
    background: rgba(0,0,0,0.5);
    border-color: rgba(220,185,110,0.8);
    color: #fff;
  }
}

.chapter-badge {
  font-family: 'Noto Serif SC', serif;
  font-size: 13px;
  color: #b69662;
  letter-spacing: 1px;
}

/* ===== 开场引语 ===== */
.opening-quote {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 4px 0;
}

.quote-line {
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,160,80,0.6), transparent);
}

.quote-text {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 600;
  color: #f0d8a8;
  text-align: center;
  line-height: 1.6;
  letter-spacing: 1px;
  text-shadow: 0 2px 12px rgba(180,120,40,0.5);
}

.quote-sub {
  display: block;
  font-size: 15px;
  font-weight: 400;
  color: #a8865a;
  margin-top: 6px;
  font-style: italic;
  letter-spacing: 0.5px;
}

/* ===== 通用 section ===== */
.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  font-weight: 500;
  color: #c9a46a;
  letter-spacing: 4px;
}

.label-icon {
  font-size: 14px;
  color: #8b6a3e;
}

/* ===== 故事背景卡 ===== */
.lore-card {
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(180,140,80,0.25);
  border-radius: 20px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lore-text {
  font-size: 14px;
  line-height: 1.85;
  color: #cdb99a;
  font-weight: 300;
}

.lore-last {
  color: #b8a085;
  font-style: italic;
  border-top: 1px dashed rgba(180,140,80,0.3);
  padding-top: 12px;
  margin-top: 2px;
}

.highlight {
  color: #e8c47a;
  font-style: normal;
  font-weight: 500;
}

/* ===== 人物卡片网格 ===== */
.char-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.char-card {
  background: rgba(8, 5, 3, 0.6);
  border: 1px solid rgba(180,140,80,0.3);
  border-radius: 20px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: 0.2s;

  &:hover {
    border-color: rgba(220,180,100,0.55);
    box-shadow: 0 8px 20px -8px rgba(160,110,40,0.5);
  }
}

/* 主角卡：横跨两列，更突出 */
.char-self {
  grid-column: 1 / -1;
  border-color: rgba(210,170,90,0.45);
  background: rgba(30,18,8,0.7);
}

.char-rival {
  border-color: rgba(180,100,100,0.35);
}

.char-emperor {
  border-color: rgba(160,120,60,0.5);
}

.char-role {
  font-size: 11px;
  color: #8b6a3e;
  letter-spacing: 1.5px;
  font-family: 'Noto Serif SC', serif;
}

.char-name {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: #f0d5a0;
  letter-spacing: 4px;
  line-height: 1;
  text-shadow: 0 1px 8px rgba(180,120,40,0.4);
}

.char-self .char-name {
  font-size: 24px;
  background: linear-gradient(135deg, #fbebcf 0%, #d4b17c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.char-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.char-tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 30px;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(160,120,60,0.5);
  color: #c9a46a;
  letter-spacing: 0.5px;
}

.char-desc {
  font-size: 12px;
  color: #a89070;
  line-height: 1.7;
  font-weight: 300;
}

.char-stat {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
}

.stat-item {
  font-size: 11px;
  color: #7a6040;
  letter-spacing: 0.5px;

  em {
    font-style: normal;
    color: #c9a46a;
    margin-left: 4px;
  }
}

/* ===== 直播间须知 ===== */
.warning-section {
  background: rgba(0,0,0,0.3);
  border: 1px dashed rgba(180,140,80,0.3);
  border-radius: 20px;
  padding: 18px 16px;
}

.warning-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Noto Serif SC', serif;
  font-size: 15px;
  font-weight: 500;
  color: #c9a46a;
  letter-spacing: 3px;
  margin-bottom: 4px;
}

.warning-icon {
  color: #b89050;
}

.warning-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.warn-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.warn-icon {
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 1px;
}

.warn-title {
  font-size: 13px;
  font-weight: 600;
  color: #d4b17c;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.warn-desc {
  font-size: 11px;
  color: #7a6040;
  line-height: 1.4;
}

/* ===== 存档槽 ===== */
.save-slots {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.slot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(180, 140, 80, 0.25);
  background: rgba(0, 0, 0, 0.3);
  transition: 0.15s;

  &.has-save {
    cursor: pointer;
    &:hover {
      border-color: rgba(220, 180, 100, 0.55);
      background: rgba(160, 110, 40, 0.12);
    }
  }

  &:not(.has-save) {
    opacity: 0.4;
    cursor: default;
  }
}

.slot-index {
  font-size: 11px;
  color: #b89050;
  background: rgba(180, 140, 60, 0.15);
  padding: 3px 10px;
  border-radius: 6px;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.slot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slot-main {
  font-size: 13px;
  color: #e8c47a;
}

.slot-meta {
  font-size: 11px;
  color: #7a6040;
}

.slot-empty {
  flex: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.2);
}

/* ===== CTA 区域 ===== */
.cta-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.cta-hint {
  font-family: 'Noto Serif SC', serif;
  font-size: 13px;
  color: #8b7050;
  letter-spacing: 1px;
  text-align: center;
  font-style: italic;
}

.cta-btn {
  width: 100%;
  background: linear-gradient(145deg, #dbb77a 0%, #be9357 80%);
  border: none;
  border-radius: 60px;
  padding: 16px 20px;
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: #1e130b;
  letter-spacing: 3px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow:
    0 8px 24px -8px #0f0803,
    0 0 0 1px #fceaca inset,
    0 0 0 2px #6e4f28 inset;
  transition: 0.15s;

  &:hover {
    transform: scale(1.02);
    box-shadow:
      0 12px 30px -8px #0f0803,
      0 0 20px rgba(200,160,80,0.3),
      0 0 0 1px #fceaca inset,
      0 0 0 2px #6e4f28 inset;
  }

  &:active {
    transform: scale(0.97);
  }
}

.cta-icon {
  font-size: 18px;
}

.cta-warn {
  font-size: 11px;
  color: #5a4530;
  letter-spacing: 1px;
}

/* ===== 底部铭文 ===== */
.signature {
  display: flex;
  justify-content: flex-end;
  border-top: 1px dashed rgba(160,130,80,0.3);
  padding-top: 16px;
  margin-top: -8px;

  span {
    font-family: 'Noto Serif SC', serif;
    font-size: 12px;
    color: #6b5535;
    background: rgba(10,6,3,0.6);
    padding: 5px 18px;
    border-radius: 40px;
    border: 0.5px solid #5a4020;
    letter-spacing: 1px;
  }
}
</style>
