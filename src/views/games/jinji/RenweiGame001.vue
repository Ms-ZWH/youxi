<template>
  <div class="rw-page">

    <!-- ══ 开场界面 ══ -->
    <div v-if="!store.gameStarted" class="intro-screen">
      <div class="intro-card">
        <div class="intro-header">
          <div class="intro-emblem"><i class="fas fa-ring"></i></div>
          <h1 class="intro-title">人妻模拟器</h1>
          <div class="intro-subtitle">现代厌倦丈夫以后</div>
        </div>
        <div class="intro-desc">
          <p>外人眼中的模范婚姻，背地里早已暗潮汹涌。</p>
          <p>结婚五年，温柔体贴的丈夫，却是索然无味的围城。</p>
          <p>直到那些男人，一一闯入你的世界……</p>
        </div>
        <div class="gold-tip">
          <i class="fas fa-coins"></i>
          <span>每次对话消耗 <strong>1金条</strong>，当前余额：<strong>{{ userStore.goldBars }}</strong></span>
        </div>
        <div class="save-section">
          <div class="save-label"><i class="fas fa-save"></i> 读取存档</div>
          <div class="intro-slots">
            <div v-for="(slot, i) in store.saveSlots" :key="i"
              class="intro-slot" :class="{ empty: !slot }"
              @click="slot && loadSlot(i)">
              <template v-if="slot">
                <div class="slot-day">第{{ slot.day }}天·{{ slot.period === 'work' ? '上班' : '下班' }}</div>
                <div class="slot-time">{{ formatDate(slot.updatedAt) }}</div>
              </template>
              <template v-else>
                <div class="slot-empty-txt"><i class="fas fa-plus"></i> 空档</div>
              </template>
            </div>
          </div>
        </div>
        <div v-if="!canStart" class="gold-warn">
          <i class="fas fa-exclamation-triangle"></i> 金条不足
          <span class="btn-toshop" @click="router.push('/shop')">去购买</span>
        </div>
        <button class="btn-newgame" :disabled="isStarting" @click="handleNewGame">
          <i class="fas fa-play"></i>{{ isStarting ? ' 正在开始…' : ' 开始新游戏' }}
        </button>
      </div>
    </div>

    <!-- ══ 游戏主界面 ══ -->
    <div v-else class="game-screen">

      <!-- 顶部导航 -->
      <div class="top-nav">
        <div class="top-gold"><i class="fas fa-coins"></i> {{ userStore.goldBars }}</div>
        <div class="top-title">第{{ store.day }}回合 · {{ store.periodLabel }}</div>
        <div class="top-acts">
          <div class="icon-btn" @click="router.push({ name: 'JinjiCategory' })"><i class="fas fa-home"></i></div>
          <div class="icon-btn" @click="showSave = true"><i class="fas fa-save"></i></div>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content-area">

        <!-- 对话 Tab：完整历史记录 -->
        <div v-show="activeTab === 'chat'" class="tab-pane chat-history" ref="storyScroll" @click="onContentClick">
          <template v-for="(msg, i) in visibleMessages" :key="i">

            <!-- AI 叙述 -->
            <div v-if="msg.role === 'assistant'" class="msg-ai">
              <div class="ctx-tags" v-if="getMsgCtx(msg.content).time || getMsgCtx(msg.content).loc">
                <span v-if="getMsgCtx(msg.content).time" class="ctx-tag">
                  <i class="fas fa-clock"></i> {{ getMsgCtx(msg.content).time }}
                </span>
                <span v-if="getMsgCtx(msg.content).loc" class="ctx-tag">
                  <i class="fas fa-map-marker-alt"></i> {{ getMsgCtx(msg.content).loc }}
                </span>
              </div>
              <!-- 最新一条且正在打字：打字机动画 -->
              <template v-if="i === lastAiIdx && isTyping">
                <div class="story-body" v-html="displayHtml"></div>
                <span class="cursor-blink">▌</span>
              </template>
              <!-- 其余所有消息（含打字结束后的最新消息）：静态高亮 -->
              <div v-else class="story-body" v-html="getStaticHtml(msg.content)"></div>
            </div>

            <!-- 玩家选择 -->
            <div v-else-if="msg.role === 'user'" class="msg-user">
              <div class="user-bubble">{{ extractChoice(msg.content) }}</div>
            </div>

          </template>

          <!-- 加载中 -->
          <div v-if="store.isLoading" class="loading-state">
            <div class="dot-row"><span></span><span></span><span></span></div>
            <p>叙述中…</p>
          </div>

          <!-- 错误 -->
          <div v-if="store.apiError" class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ store.apiError }}</p>
            <button class="retry-btn" @click.stop="handleRetry">重试</button>
          </div>
        </div>

        <!-- 人物 Tab -->
        <div v-show="activeTab === 'chars'" class="tab-pane chars-pane">
          <div class="char-section">
            <div class="char-sec-title">林清池</div>
            <div class="stat-grid">
              <div v-for="(val, key) in store.stats.hero" :key="key" class="stat-chip">
                <span class="stat-k">{{ key }}</span><span class="stat-v">{{ val }}</span>
              </div>
            </div>
          </div>
          <div v-for="(vals, name) in store.stats.chars" :key="name" class="char-section">
            <div class="char-sec-title">{{ name }}</div>
            <div class="char-meta">{{ CHARS_DATA[name]?.relation }} · {{ CHARS_DATA[name]?.appearance }}</div>
            <div class="stat-grid">
              <div v-for="(v, k) in vals" :key="k" class="stat-chip">
                <span class="stat-k">{{ k }}</span><span class="stat-v">{{ v }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 场景 Tab -->
        <div v-show="activeTab === 'scene'" class="tab-pane scene-pane">
          <div class="scene-card">
            <div class="scene-row"><span>天数</span>第{{ store.day }}天</div>
            <div class="scene-row"><span>时段</span>{{ store.periodLabel }}</div>
            <div class="scene-row" v-if="storyLocation"><span>地点</span>{{ storyLocation }}</div>
            <div class="scene-row"><span>阶段</span>{{ store.day <= 3 ? '试探期' : store.day <= 6 ? '升温期' : '深陷期' }}</div>
          </div>
          <div class="scene-note">
            <p><i class="fas fa-sun"></i> 上班时段：周予璨 · 谢凛</p>
            <p><i class="fas fa-moon"></i> 下班时段：裴叙川 · 程宴</p>
          </div>
        </div>

        <!-- 手册 Tab -->
        <div v-show="activeTab === 'manual'" class="tab-pane manual-pane">
          <div class="manual-title">游戏手册</div>
          <div class="manual-block">
            <div class="manual-sub">玩法说明</div>
            <p>共10天，每天分上班与下班两个时段，每时段发生一段剧情，做出选择推进故事。</p>
          </div>
          <div class="manual-block">
            <div class="manual-sub">结局触发</div>
            <p>七天后丈夫怀疑值达上限或名声归零，触发【离婚挽留】结局事件。</p>
          </div>
          <div class="manual-block">
            <div class="manual-sub">四位男主</div>
            <div v-for="(data, name) in CHARS_DATA" :key="name" class="manual-char">
              <span class="manual-name">{{ name }}</span>
              <span class="manual-rel">{{ data.relation }}</span>
              <p>{{ data.personality }}</p>
            </div>
          </div>
        </div>


        <!-- 事件 Tab -->
        <div v-show="activeTab === 'events'" class="tab-pane events-pane">
          <div class="events-title">事件记录</div>
          <div v-if="!storyEvents.length" class="events-empty">
            <i class="fas fa-moon"></i> 还没有事件记录
          </div>
          <div v-for="(e, i) in storyEvents" :key="i" class="event-item">
            <div class="event-meta">
              <span v-if="e.time"><i class="fas fa-clock"></i> {{ e.time }}</span>
              <span v-if="e.loc"><i class="fas fa-map-marker-alt"></i> {{ e.loc }}</span>
              <span>第{{ e.round }}轮</span>
            </div>
            <div class="event-text">{{ e.summary }}</div>
          </div>
        </div>

      </div>

      <!-- 选项折叠栏 -->
      <div v-if="activeTab === 'chat'" class="choices-accordion">
        <div class="choices-header" @click="choicesOpen = !choicesOpen">
          <span><i class="fas fa-list-ul"></i> 展开行动选项</span>
          <div class="choices-right">
            <span v-if="store.latestParsed.choices.length" class="choices-badge">
              {{ store.latestParsed.choices.length }}
            </span>
            <i :class="choicesOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
          </div>
        </div>
        <div v-if="choicesOpen" class="choices-list">
          <div v-if="store.isLoading" class="choices-loading">
            <i class="fas fa-spinner fa-spin"></i> 等待回复…
          </div>
          <template v-else>
            <div
              v-for="(c, i) in store.latestParsed.choices" :key="i"
              class="choice-item"
              :class="{ disabled: isTyping }"
              @click="!isTyping && handleChoice(c)"
            >
              <span class="choice-idx">{{ ['A','B','C'][i] }}</span>
              <span>{{ c }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="input-row">
        <div class="input-icon"><i class="fas fa-pen-nib"></i></div>
        <input
          v-model="customInput"
          class="custom-input"
          placeholder="输入你的行动…"
          :disabled="store.isLoading"
          @keyup.enter="handleCustomSend"
        />
        <button class="send-btn" :disabled="!customInput.trim() || store.isLoading" @click="handleCustomSend">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>

      <!-- 底部 Tab 栏 -->
      <div class="bottom-tabs">
        <div v-for="tab in TABS" :key="tab.id"
          class="btab" :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id">
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </div>
      </div>

    </div>

    <!-- ══ 存档弹窗 ══ -->
    <div v-if="showSave" class="overlay" @click.self="showSave = false">
      <div class="modal-card">
        <div class="modal-header">
          <span><i class="fas fa-save"></i> 存档管理</span>
          <div class="icon-btn" @click="showSave = false">✕</div>
        </div>
        <div class="modal-slots">
          <div v-for="(slot, i) in store.saveSlots" :key="i" class="modal-slot">
            <div class="modal-slot-info">
              <template v-if="slot">
                <div class="slot-day">第{{ slot.day }}天·{{ slot.period === 'work' ? '上班' : '下班' }}</div>
                <div class="slot-time">{{ formatDate(slot.updatedAt) }}</div>
              </template>
              <template v-else>
                <div class="slot-empty-txt"><i class="fas fa-plus"></i> 空档位 {{ i + 1 }}</div>
              </template>
            </div>
            <div class="modal-slot-acts">
              <button v-if="slot" class="s-btn load" @click="loadSlot(i)">读取</button>
              <button class="s-btn save-b" @click="saveSlot(i)">{{ slot ? '覆盖' : '保存' }}</button>
              <button v-if="slot" class="s-btn del" @click="store.deleteSaveSlot(i)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRenwei001Store } from '@/stores/renwei001'
import { useUserStore } from '@/stores/userStore'
import { useThemeStore } from '@/stores/themeStore'

const router     = useRouter()
const store      = useRenwei001Store()
const userStore  = useUserStore()
const themeStore = useThemeStore()
onMounted(() => themeStore.clearTheme?.())

// ── 静态数据 ──
const CHARS_DATA = {
  裴叙川: { name: '裴叙川', relation: '丈夫',       personality: '温润如玉 · 高焦虑型',  appearance: '183cm 冷白皮 金丝眼镜' },
  程宴:   { name: '程宴',   relation: '丈夫好友',    personality: '嘴欠爱逗 · 偏执占有',  appearance: '185cm 小麦肤 侵略性眼神' },
  周予璨: { name: '周予璨', relation: '年下实习生',  personality: '直球撒娇 · 精通推拉',  appearance: '187cm 小鹿眼 浅金发耳骨钉' },
  谢凛:   { name: '谢凛',   relation: '初恋',        personality: '礼貌冷漠 · 掌控欲强',  appearance: '182cm 凤眼薄唇 眼角泪痣' },
}

const TABS = [
  { id: 'manual', label: '手册', icon: 'fas fa-book' },
  { id: 'scene',  label: '场景', icon: 'fas fa-map-marker-alt' },
  { id: 'chat',   label: '对话', icon: 'fas fa-comments' },
  { id: 'chars',  label: '人物', icon: 'fas fa-users' },
  { id: 'events', label: '事件', icon: 'fas fa-scroll' },
]

// ── 状态 ──
const activeTab   = ref('chat')
const showSave    = ref(false)
const customInput = ref('')
const isStarting  = ref(false)
const choicesOpen = ref(false)
const storyScroll = ref(null)

// ── 打字机 ──
const displayText = ref('')
const isTyping    = ref(false)
let   typingTimer = null
let   targetText  = ''

const canStart = computed(() => userStore.goldBars > 0)

const storyLocation = computed(() => store.latestParsed.location || '')

// 过滤 hidden 消息
const visibleMessages = computed(() => store.messages.filter(m => !m.hidden))

// 事件tab：取每轮AI叙事，提炼为简短事件摘要
const storyEvents = computed(() => {
  let round = 0
  return visibleMessages.value
    .filter(m => m.role === 'assistant')
    .map(m => {
      round++
      const ctx     = getMsgCtx(m.content)
      // 去掉标签、选项，取正文前60字作摘要
      const body    = m.content
        .replace(/【剧情】/, '')
        .replace(/【选项】[\s\S]*$/, '')
        .replace(/\[[^\]]+\]/g, '')
        .replace(/\n+/g, ' ')
        .trim()
      const summary = body.length > 60 ? body.slice(0, 60) + '…' : body
      return { round, time: ctx.time, loc: ctx.loc, summary }
    })
})

// 最后一条 AI 消息在 visibleMessages 中的索引
const lastAiIdx = computed(() => {
  const msgs = visibleMessages.value
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === 'assistant') return i
  }
  return -1
})

const CHAR_NAMES = ['裴叙川', '程宴', '周予璨', '谢凛']

function highlightText(text) {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\[时间[：:][^\]]+\]/g, '')
    .replace(/\[地点[：:][^\]]+\]/g, '')
    .trim()
  CHAR_NAMES.forEach(name => {
    html = html.replace(new RegExp(name, 'g'), `<span class="char-hl">${name}</span>`)
  })
  return html.replace(/\n/g, '<br>')
}

// 从原始 content 提取时间/地点标签
function getMsgCtx(content) {
  const time = content.match(/\[时间[：:]([^\]]+)\]/)?.[1] || ''
  const loc  = content.match(/\[地点[：:]([^\]]+)\]/)?.[1] || ''
  return { time, loc }
}

// 历史消息静态渲染
function getStaticHtml(content) {
  const narrative = content.replace(/【选项】[\s\S]*$/, '').replace(/^【剧情】/, '').trim()
  return highlightText(narrative)
}

// 提取玩家选择文本（去掉时间标签前缀）
function extractChoice(content) {
  return content.replace(/^【[^】]+】\s*我的选择：/, '').trim() || content
}

const displayHtml = computed(() => {
  if (!displayText.value) return ''
  if (isTyping.value) return displayText.value.replace(/\n/g, '<br>')
  return highlightText(displayText.value)
})

// ── 打字机核心 ──
function startTyping(text) {
  if (typingTimer) clearInterval(typingTimer)
  targetText = text
  displayText.value = ''
  isTyping.value = true
  choicesOpen.value = false
  let idx = 0
  typingTimer = setInterval(() => {
    if (idx < targetText.length) {
      displayText.value += targetText.slice(idx, idx + 5)
      idx += 5
      scrollDown()
    } else {
      clearInterval(typingTimer); typingTimer = null
      isTyping.value = false
      choicesOpen.value = true  // 打字结束自动展开选项
    }
  }, 20)
}

function skipTyping() {
  if (!isTyping.value) return
  if (typingTimer) { clearInterval(typingTimer); typingTimer = null }
  displayText.value = targetText
  isTyping.value = false
  choicesOpen.value = true
}

function onContentClick() { if (isTyping.value) skipTyping() }

async function scrollDown() {
  await nextTick()
  if (storyScroll.value) storyScroll.value.scrollTop = storyScroll.value.scrollHeight
}

watch(() => store.latestParsed.narrative, (val) => {
  if (val) { activeTab.value = 'chat'; startTyping(val) }
})

watch(() => visibleMessages.value.length, () => scrollDown())

// ── 操作 ──
async function handleNewGame() {
  if (isStarting.value) return
  const res = userStore.spendGold(1)
  if (!res.ok) { router.push('/shop'); return }
  isStarting.value = true
  displayText.value = ''
  await store.startGame()
  isStarting.value = false
}

async function handleChoice(text) {
  if (store.isLoading || isTyping.value) return
  const res = userStore.spendGold(1)
  if (!res.ok) { router.push('/shop'); return }
  choicesOpen.value = false
  await store.sendChoice(text)
}

async function handleCustomSend() {
  const text = customInput.value.trim()
  if (!text || store.isLoading || isTyping.value) return
  customInput.value = ''
  await handleChoice(text)
}

async function handleRetry() {
  const msgs = store.messages
  if (msgs.length && msgs[msgs.length - 1].role === 'assistant') msgs.pop()
  const res = userStore.spendGold(1)
  if (!res.ok) { router.push('/shop'); return }
  await store.callAPI()
}

function saveSlot(i) { store.saveToSlot(i); showSave.value = false }
function loadSlot(i) {
  store.loadFromSlot(i)
  showSave.value = false
  // 读档后直接静态展示最新叙事，不触发打字机
  displayText.value = store.latestParsed.narrative || ''
  isTyping.value = false
  nextTick(() => scrollDown())
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onUnmounted(() => { if (typingTimer) clearInterval(typingTimer) })
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.rw-page {
  height: 100vh; overflow: hidden;
  background: #0e0e16;
  font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', Georgia, serif;
  color: #ddd8e8;
  display: flex; flex-direction: column;
}

/* ══ 开场 ══ */
.intro-screen {
  height: 100vh; overflow-y: auto;
  display: flex; align-items: flex-start; justify-content: center;
  padding: 24px 16px 80px;
}
.intro-card {
  width: 100%; max-width: 400px;
  background: rgba(20,0,35,0.95);
  border: 1px solid rgba(192,80,122,0.28);
  border-radius: 22px; padding: 30px 20px 26px;
  box-shadow: 0 0 50px rgba(192,80,122,0.1);
}
.intro-header { text-align: center; margin-bottom: 22px; }
.intro-emblem {
  width: 62px; height: 62px; border-radius: 50%;
  background: radial-gradient(circle, rgba(192,80,122,0.22) 0%, transparent 70%);
  border: 1px solid rgba(192,80,122,0.4);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 13px;
  i { font-size: 24px; color: #c0507a; }
}
.intro-title {
  font-size: 1.7rem; font-weight: 700; letter-spacing: 4px;
  background: linear-gradient(135deg, #eed0de, #c0507a);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.intro-subtitle { font-size: 0.76rem; color: rgba(232,216,240,0.4); letter-spacing: 2px; margin-top: 4px; }
.intro-desc {
  background: rgba(192,80,122,0.05); border: 1px solid rgba(192,80,122,0.12);
  border-radius: 13px; padding: 13px 15px; margin-bottom: 16px;
  p { font-size: 0.85rem; color: rgba(232,216,240,0.7); line-height: 1.8; }
  p + p { margin-top: 3px; }
}
.gold-tip {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.78rem; color: rgba(232,216,240,0.52);
  background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.16);
  border-radius: 9px; padding: 8px 12px; margin-bottom: 16px;
  i { color: #c9a84c; }  strong { color: #c9a84c; }
}
.save-section { margin-bottom: 16px; }
.save-label { font-size: 0.71rem; color: rgba(232,216,240,0.35); margin-bottom: 8px; i { margin-right: 4px; } }
.intro-slots { display: flex; gap: 8px; }
.intro-slot {
  flex: 1; text-align: center;
  background: rgba(192,80,122,0.05); border: 1px solid rgba(192,80,122,0.16);
  border-radius: 10px; padding: 8px 5px; cursor: default; transition: all 0.15s;
  &:not(.empty) { cursor: pointer; &:hover { background: rgba(192,80,122,0.12); } }
}
.slot-day { font-size: 0.73rem; color: #eed0de; font-weight: 600; }
.slot-time { font-size: 0.62rem; color: rgba(232,216,240,0.35); margin-top: 2px; }
.slot-empty-txt { font-size: 0.7rem; color: rgba(232,216,240,0.26); i { margin-right: 3px; } }
.gold-warn {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
  background: rgba(220,100,100,0.07); border: 1px solid rgba(220,100,100,0.22);
  border-radius: 10px; padding: 10px 14px; margin-bottom: 13px;
  font-size: 0.8rem; color: #f0b0b0; i { margin-right: 5px; }
}
.btn-toshop {
  margin-left: auto; background: rgba(192,80,122,0.2);
  border: 1px solid rgba(192,80,122,0.4); border-radius: 18px;
  padding: 4px 14px; font-size: 0.78rem; color: #eed0de; cursor: pointer;
  &:hover { background: rgba(192,80,122,0.34); }
}
.btn-newgame {
  width: 100%; padding: 12px; border: none; border-radius: 13px;
  background: linear-gradient(135deg, #c0507a, #8a3055);
  color: #fff; font-size: 0.92rem; font-weight: 700; font-family: inherit;
  letter-spacing: 2px; cursor: pointer;
  box-shadow: 0 6px 20px rgba(192,80,122,0.35); transition: all 0.18s;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(192,80,122,0.48); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

/* ══ 游戏主界面 ══ */
.game-screen {
  height: 100vh; display: flex; flex-direction: column; overflow: hidden;
}

.top-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 14px; height: 46px;
  background: #09090f; border-bottom: 1px solid rgba(192,80,122,0.15);
  flex-shrink: 0;
}
.top-gold {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.82rem; color: #c9a84c;
  background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.18);
  border-radius: 20px; padding: 3px 10px;
  i { font-size: 0.78rem; }
}
.top-title { font-size: 0.85rem; color: #ddd8e8; font-weight: 600; font-family: sans-serif; }
.top-acts { display: flex; gap: 7px; }
.icon-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(192,80,122,0.09); border: 1px solid rgba(192,80,122,0.2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #ddd8e8; font-size: 0.82rem; transition: all 0.14s;
  &:hover { background: rgba(192,80,122,0.2); }
}

/* ── 内容区 ── */
.content-area { flex: 1; min-height: 0; overflow: hidden; position: relative; }

.tab-pane {
  height: 100%; overflow-y: auto; padding: 16px 15px 12px;
  scrollbar-width: thin; scrollbar-color: rgba(192,80,122,0.2) transparent;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(192,80,122,0.2); border-radius: 2px; }
}

/* 对话 tab - 历史记录 */
.chat-history { display: flex; flex-direction: column; gap: 20px; }

.msg-ai { display: flex; flex-direction: column; gap: 6px; }

.msg-user {
  display: flex; justify-content: flex-end;
}
.user-bubble {
  max-width: 75%;
  background: rgba(192,80,122,0.18);
  border: 1px solid rgba(192,80,122,0.32);
  border-radius: 18px 18px 4px 18px;
  padding: 9px 14px;
  font-size: 0.86rem; color: #eed0de; line-height: 1.5;
  word-break: break-word;
}

/* 加载中 */
.loading-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 60%; gap: 12px;
  p { font-size: 0.75rem; color: rgba(232,216,240,0.3); font-family: sans-serif; }
}
.dot-row {
  display: flex; gap: 7px;
  span {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(192,80,122,0.5);
    animation: dbounce 1.3s infinite ease-in-out;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}
@keyframes dbounce {
  0%,80%,100% { transform: scale(0.6); opacity: 0.35; }
  40% { transform: scale(1.1); opacity: 1; }
}
.error-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; padding: 30px 16px; text-align: center;
  font-size: 0.85rem; color: #f0b0b0;
  i { font-size: 1.3rem; color: #e08080; }
}
.retry-btn {
  background: rgba(192,80,122,0.18); border: 1px solid rgba(192,80,122,0.35);
  border-radius: 18px; padding: 6px 20px; font-size: 0.8rem;
  color: #eed0de; cursor: pointer; font-family: inherit;
  &:hover { background: rgba(192,80,122,0.3); }
}
.ctx-tags {
  display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;
}
.ctx-tag {
  font-size: 0.72rem; font-family: sans-serif;
  background: rgba(192,80,122,0.1); border: 1px solid rgba(192,80,122,0.2);
  border-radius: 20px; padding: 3px 10px; color: rgba(232,216,240,0.6);
  i { margin-right: 4px; }
}
.story-body {
  font-size: 0.95rem; line-height: 2.0; color: rgba(221,216,232,0.92);
  word-break: break-all;
  :deep(.char-hl) { color: #e85070; font-weight: 600; }
}
.cursor-blink {
  color: #c0507a; animation: blink 0.75s step-end infinite;
}
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

/* 人物 tab */
.chars-pane { display: flex; flex-direction: column; gap: 0; }
.char-section { padding: 14px 0; border-bottom: 1px solid rgba(192,80,122,0.1); }
.char-sec-title {
  font-size: 0.95rem; font-weight: 700; color: #e8c0d0; margin-bottom: 4px;
}
.char-meta { font-size: 0.73rem; color: rgba(232,216,240,0.42); font-family: sans-serif; margin-bottom: 8px; }
.stat-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.stat-chip {
  background: rgba(192,80,122,0.07); border: 1px solid rgba(192,80,122,0.18);
  border-radius: 8px; padding: 4px 10px; display: flex; gap: 6px; align-items: center;
}
.stat-k { font-size: 0.7rem; color: rgba(232,216,240,0.45); font-family: sans-serif; }
.stat-v { font-size: 0.8rem; color: #e8c0d0; font-weight: 600; font-family: sans-serif; }

/* 场景 tab */
.scene-pane { display: flex; flex-direction: column; gap: 14px; }
.scene-card {
  background: rgba(192,80,122,0.05); border: 1px solid rgba(192,80,122,0.15);
  border-radius: 14px; padding: 16px;
}
.scene-row {
  display: flex; gap: 14px; padding: 7px 0;
  border-bottom: 1px solid rgba(192,80,122,0.08); font-size: 0.88rem;
  &:last-child { border-bottom: none; }
  span { color: rgba(232,216,240,0.42); min-width: 40px; font-family: sans-serif; font-size: 0.78rem; }
}
.scene-note {
  font-size: 0.8rem; font-family: sans-serif; color: rgba(232,216,240,0.45);
  p { padding: 5px 0; }
  i { margin-right: 6px; color: rgba(192,80,122,0.5); }
}

/* 手册 tab */
.manual-pane { display: flex; flex-direction: column; gap: 16px; }
.manual-title { font-size: 1rem; font-weight: 700; color: #e8c0d0; }
.manual-block {
  background: rgba(192,80,122,0.04); border: 1px solid rgba(192,80,122,0.12);
  border-radius: 12px; padding: 13px;
}
.manual-sub {
  font-size: 0.78rem; font-family: sans-serif; color: #c0507a;
  letter-spacing: 1px; margin-bottom: 7px;
}
.manual-block p { font-size: 0.84rem; color: rgba(232,216,240,0.68); line-height: 1.7; }
.manual-char {
  padding: 8px 0; border-bottom: 1px solid rgba(192,80,122,0.08);
  &:last-child { border-bottom: none; }
  p { font-size: 0.78rem; color: rgba(232,216,240,0.5); font-family: sans-serif; margin-top: 3px; }
}
.manual-name { font-size: 0.88rem; font-weight: 700; color: #e8c0d0; margin-right: 8px; }
.manual-rel {
  font-size: 0.72rem; font-family: sans-serif;
  background: rgba(192,80,122,0.15); border-radius: 10px;
  padding: 2px 8px; color: #c0507a;
}

/* 事件 tab */
.events-pane { display: flex; flex-direction: column; gap: 10px; }
.events-title { font-size: 0.95rem; font-weight: 700; color: #e8c0d0; margin-bottom: 4px; }
.events-empty {
  text-align: center; color: rgba(232,216,240,0.3); padding: 30px 0;
  font-size: 0.85rem; font-family: sans-serif;
  i { margin-right: 6px; }
}
.event-item {
  background: rgba(192,80,122,0.04); border: 1px solid rgba(192,80,122,0.12);
  border-radius: 10px; padding: 10px 12px;
}
.event-meta { font-size: 0.68rem; font-family: sans-serif; color: rgba(192,80,122,0.6); margin-bottom: 5px; }
.event-text { font-size: 0.84rem; color: rgba(232,216,240,0.75); }

/* ── 选项折叠栏 ── */
.choices-accordion {
  flex-shrink: 0;
  background: #0d0d15; border-top: 1px solid rgba(192,80,122,0.18);
}
.choices-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 15px; cursor: pointer;
  font-size: 0.8rem; color: rgba(232,216,240,0.55); font-family: sans-serif;
  transition: background 0.12s;
  i:first-child { margin-right: 6px; color: #c0507a; }
  &:hover { background: rgba(192,80,122,0.06); }
}
.choices-right { display: flex; align-items: center; gap: 7px; }
.choices-badge {
  background: #c0507a; color: #fff; font-size: 0.68rem; font-weight: 700;
  border-radius: 10px; padding: 1px 7px; min-width: 20px; text-align: center;
}
.choices-list { padding: 4px 12px 10px; display: flex; flex-direction: column; gap: 6px; }
.choices-loading {
  text-align: center; font-size: 0.78rem; font-family: sans-serif;
  color: rgba(232,216,240,0.3); padding: 8px 0;
  i { margin-right: 5px; }
}
.choice-item {
  display: flex; align-items: flex-start; gap: 9px;
  background: rgba(192,80,122,0.06); border: 1px solid rgba(192,80,122,0.18);
  border-radius: 10px; padding: 9px 12px; cursor: pointer; transition: all 0.13s;
  font-size: 0.86rem; color: rgba(221,216,232,0.85);
  &:hover:not(.disabled) { background: rgba(192,80,122,0.14); border-color: rgba(192,80,122,0.38); }
  &.disabled { opacity: 0.4; cursor: not-allowed; }
}
.choice-idx {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
  background: rgba(192,80,122,0.2); border: 1px solid rgba(192,80,122,0.38);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.68rem; font-weight: 700; color: #eed0de; font-family: sans-serif;
}

/* ── 输入框 ── */
.input-row {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: #09090f; border-top: 1px solid rgba(192,80,122,0.12);
}
.input-icon {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: rgba(192,80,122,0.1); border: 1px solid rgba(192,80,122,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; color: rgba(192,80,122,0.7);
}
.custom-input {
  flex: 1; background: rgba(20,0,35,0.6);
  border: 1px solid rgba(192,80,122,0.2); border-radius: 20px;
  padding: 8px 14px; font-size: 0.85rem; color: #ddd8e8; font-family: inherit;
  outline: none;
  &::placeholder { color: rgba(232,216,240,0.28); }
  &:focus { border-color: rgba(192,80,122,0.45); }
  &:disabled { opacity: 0.38; }
}
.send-btn {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #c0507a, #8a3055);
  border: none; color: white; font-size: 0.8rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.13s;
  &:hover:not(:disabled) { transform: scale(1.1); }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
}

/* ── 底部 Tab ── */
.bottom-tabs {
  flex-shrink: 0; display: flex;
  background: #07070e; border-top: 1px solid rgba(192,80,122,0.12);
  height: 54px;
}
.btab {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 3px;
  cursor: pointer; transition: all 0.13s;
  i { font-size: 0.9rem; color: rgba(232,216,240,0.3); transition: color 0.13s; }
  span { font-size: 0.62rem; font-family: sans-serif; color: rgba(232,216,240,0.3); transition: color 0.13s; }
  &.active {
    i, span { color: #c0507a; }
  }
  &:hover:not(.active) { i, span { color: rgba(232,216,240,0.6); } }
}

/* 事件 tab */
.events-pane { display: flex; flex-direction: column; gap: 8px; }
.events-title { font-size: 0.95rem; font-weight: 700; color: #e8c0d0; margin-bottom: 4px; }
.events-empty {
  text-align: center; color: rgba(232,216,240,0.3);
  padding: 30px 0; font-size: 0.85rem; font-family: sans-serif;
  i { margin-right: 6px; }
}
.event-item {
  background: rgba(192,80,122,0.04); border: 1px solid rgba(192,80,122,0.12);
  border-radius: 10px; padding: 10px 12px;
}
.event-meta {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 5px;
  font-size: 0.68rem; font-family: sans-serif; color: rgba(192,80,122,0.6);
  i { margin-right: 3px; }
}
.event-text { font-size: 0.84rem; color: rgba(232,216,240,0.75); line-height: 1.6; }

/* ══ 存档弹窗 ══ */
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.78);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 20px;
}
.modal-card {
  background: rgba(12,0,22,0.99); border: 1px solid rgba(192,80,122,0.3);
  border-radius: 18px; padding: 20px; width: 100%; max-width: 350px;
  box-shadow: 0 0 40px rgba(192,80,122,0.15);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; font-size: 0.9rem; font-weight: 700; color: #eed0de;
  i { margin-right: 7px; color: #c0507a; }
}
.modal-slots { display: flex; flex-direction: column; gap: 9px; }
.modal-slot {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(192,80,122,0.05); border: 1px solid rgba(192,80,122,0.14);
  border-radius: 11px; padding: 10px 12px;
}
.modal-slot-info { flex: 1; }
.modal-slot-acts { display: flex; gap: 6px; flex-shrink: 0; }
.s-btn {
  border: none; border-radius: 7px; padding: 4px 10px;
  font-size: 0.7rem; font-family: inherit; cursor: pointer; font-weight: 600;
  &.load   { background: rgba(192,80,122,0.16); color: #eed0de; border: 1px solid rgba(192,80,122,0.26); &:hover { background: rgba(192,80,122,0.3); } }
  &.save-b { background: rgba(201,168,76,0.13); color: #c9a84c; border: 1px solid rgba(201,168,76,0.26); &:hover { background: rgba(201,168,76,0.24); } }
  &.del    { background: rgba(200,80,80,0.1);  color: #f0a0a0; border: 1px solid rgba(200,80,80,0.2);  &:hover { background: rgba(200,80,80,0.2); } }
}
</style>
