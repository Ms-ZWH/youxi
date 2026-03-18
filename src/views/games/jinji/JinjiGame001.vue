<template>
  <div class="jinji-game">

    <!-- 电击遮罩 -->
    <Transition name="shock">
      <div v-if="store.shockActive" class="shock-overlay" @click="store.clearShock">
        <div class="shock-box">
          <div class="shock-icon">⚡</div>
          <div class="shock-warning">警告：检测到人设偏移！</div>
          <div class="shock-original">
            <span class="strikethrough">{{ store.shockOriginal }}</span>
          </div>
          <div class="shock-arrow">↓ 强制修正</div>
          <div class="shock-forced">{{ store.shockMessage }}</div>
          <div class="shock-confirm">✓ 系统满意</div>
          <div class="shock-tap">点击继续</div>
        </div>
      </div>
    </Transition>

    <!-- 游戏结束遮罩 -->
    <div v-if="store.gameOver" class="gameover-overlay">
      <div class="gameover-box">
        <template v-if="store.gameOverType === 'success'">
          <div class="gameover-icon">💛</div>
          <div class="gameover-title">真心已找到</div>
          <div class="gameover-desc">{{ successEndingText }}</div>
        </template>
        <template v-else>
          <div class="gameover-icon">💔</div>
          <div class="gameover-title">30天已过</div>
          <div class="gameover-desc">没有人的真心值达到100%。<br>系统沉默地消失了，就像它从未出现过。</div>
          <div class="gameover-hint">也许……曾经有过一个不同的瞬间？</div>
        </template>
        <div class="gameover-btns">
          <button class="btn-gold" @click="handleRestart">再试一次</button>
          <button class="btn-ghost" @click="goHome">返回大厅</button>
        </div>
      </div>
    </div>

    <!-- 开场界面 -->
    <div v-if="!store.gameStarted" class="intro-screen">
      <div class="intro-card">
        <div class="intro-badge">系统绑定</div>
        <h1 class="intro-title">绑定富婆系统后<br>我包养了3个小白脸</h1>
        <div class="intro-divider"></div>
        <div class="intro-rules">
          <div class="rule-item">
            <span class="rule-icon">💰</span>
            <span>你拥有无限金钱</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">⏳</span>
            <span>30天内让一人真心值达100%</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">😈</span>
            <span>必须维持<strong>恶毒富婆</strong>人设</span>
          </div>
          <div class="rule-item">
            <span class="rule-icon">⚡</span>
            <span>破人设即遭电击惩罚</span>
          </div>
        </div>
        <div class="intro-warning">难度：极高</div>
        <button class="btn-start" @click="store.startNewGame()">开始游戏</button>
      </div>
    </div>

    <!-- 主游戏界面 -->
    <div v-else class="game-main">

      <!-- 顶部状态栏 -->
      <div class="status-bar">
        <div class="status-time">
          <span class="day-num">第 {{ store.day }} 天</span>
          <span class="period-tag">{{ store.periodLabel }}</span>
        </div>
        <div class="status-money">
          <span class="money-icon">💳</span>
          <span class="money-text">∞</span>
        </div>
      </div>

      <!-- 真心值面板 -->
      <div class="heart-panel" :class="{ collapsed: heartPanelCollapsed }">
        <div class="heart-panel-toggle" @click="heartPanelCollapsed = !heartPanelCollapsed">
          <span>攻略进度</span>
          <span class="toggle-arrow">{{ heartPanelCollapsed ? '▼' : '▲' }}</span>
        </div>
        <Transition name="panel-slide">
          <div v-if="!heartPanelCollapsed" class="heart-list">
            <div class="heart-row" v-for="c in characters" :key="c.id">
              <span class="char-name">{{ c.name }}</span>
              <div class="heart-bar-wrap">
                <div class="heart-bar" :style="{ width: store.hearts[c.id] + '%' }"></div>
              </div>
              <span class="heart-pct">{{ store.hearts[c.id] }}%</span>
              <span class="spending-info">¥{{ formatMoney(store.spending[c.id]) }}</span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 场景区 -->
      <div class="scene-area" :class="locationClass">

        <!-- 地点选择界面 -->
        <div v-if="currentView === 'location'" class="location-choose">
          <div class="scene-narrator">你站在家中，思考今天{{ store.periodLabel }}去哪里。</div>
          <div class="location-grid">
            <div
              v-for="loc in availableLocations"
              :key="loc.id"
              class="location-card"
              @click="goToLocation(loc.id)"
            >
              <span class="loc-icon">{{ loc.icon }}</span>
              <span class="loc-name">{{ loc.name }}</span>
              <span class="loc-desc">{{ loc.desc }}</span>
            </div>
          </div>
        </div>

        <!-- 剧情界面 -->
        <div v-else-if="currentView === 'scene'" class="scene-content">
          <div class="scene-location-tag">📍 {{ locationLabel }}</div>
          <div class="scene-narrator" v-if="currentSceneData.narrator">
            {{ currentSceneData.narrator }}
          </div>
          <div class="dialogue-wrap" v-if="currentSceneData.dialogue">
            <div class="char-say">
              <span class="char-tag">{{ currentSceneData.dialogue.who }}</span>
              <span class="char-words">「{{ currentSceneData.dialogue.words }}」</span>
            </div>
            <div class="char-thought" v-if="currentSceneData.dialogue.thought">
              {{ currentSceneData.dialogue.thought }}
            </div>
          </div>
          <!-- 旁白 -->
          <div class="narrative-list" v-if="store.narratives.length">
            <div class="narrative-item" v-for="(n, i) in store.narratives" :key="i">{{ n }}</div>
          </div>
          <!-- 选项 -->
          <div class="choices-wrap" v-if="currentSceneData.choices">
            <div
              v-for="(choice, i) in currentSceneData.choices"
              :key="i"
              class="choice-btn"
              @click="handleChoice(choice)"
            >
              {{ choice.text }}
            </div>
          </div>
          <!-- 继续按钮 -->
          <div v-if="!currentSceneData.choices" class="btn-next-wrap">
            <button class="btn-next" @click="handleNext">继续</button>
          </div>
        </div>

      </div>

      <!-- 底部导航 -->
      <div class="bottom-nav">
        <button class="nav-btn" @click="goHome">
          <span>🏠</span><span>大厅</span>
        </button>
        <button class="nav-btn" @click="showSavePanel = true">
          <span>💾</span><span>存档</span>
        </button>
      </div>

    </div>

    <!-- 存档面板（简单实现） -->
    <Transition name="panel-fade">
      <div v-if="showSavePanel" class="save-overlay" @click.self="showSavePanel = false">
        <div class="save-panel">
          <div class="save-title">存档</div>
          <div class="save-slots">
            <div v-for="(slot, i) in store.saveSlots" :key="i" class="save-slot">
              <div class="slot-info">
                <span class="slot-num">槽 {{ i + 1 }}</span>
                <span v-if="slot" class="slot-detail">第{{ slot.day }}天 {{ periodLabelMap[slot.period] }}</span>
                <span v-else class="slot-empty">空</span>
              </div>
              <div class="slot-btns">
                <button class="slot-btn save" @click="store.saveToSlot(i)">保存</button>
                <button class="slot-btn load" :disabled="!slot" @click="loadSlot(i)">读取</button>
                <button class="slot-btn del" :disabled="!slot" @click="store.deleteSaveSlot(i)">删除</button>
              </div>
            </div>
          </div>
          <button class="save-close" @click="showSavePanel = false">关闭</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJinji001Store } from '@/stores/jinji001.js'

const router = useRouter()
const store = useJinji001Store()

// ── UI状态 ────────────────────────────────────────────
const heartPanelCollapsed = ref(false)
const showSavePanel = ref(false)
const currentView = ref('location')   // 'location' | 'scene'
const currentSceneData = ref({})

// ── 角色配置 ──────────────────────────────────────────
const characters = [
  { id: 'guyan',  name: '顾衍' },
  { id: 'shenmo', name: '沈默' },
  { id: 'luoyu',  name: '洛屿' },
]

// ── 地点配置 ──────────────────────────────────────────
const availableLocations = [
  { id: 'bar',     icon: '🥂', name: '酒吧',   desc: '顾衍在这里' },
  { id: 'school',  icon: '📚', name: '大学校园', desc: '沈默在这里' },
  { id: 'studio',  icon: '📸', name: '模特工作室', desc: '洛屿在这里' },
  { id: 'mall',    icon: '🛍️', name: '购物中心', desc: '随便逛逛' },
  { id: 'home',    icon: '🏠', name: '待在家',   desc: '休息一个回合' },
]

const locationNames = {
  bar: '酒吧', school: '大学校园', studio: '模特工作室', mall: '购物中心', home: '家'
}

const locationLabel = computed(() => locationNames[store.currentLocation] || '')

const locationClass = computed(() => ({
  'loc-bar': store.currentLocation === 'bar',
  'loc-school': store.currentLocation === 'school',
  'loc-studio': store.currentLocation === 'studio',
  'loc-mall': store.currentLocation === 'mall',
  'loc-home': store.currentLocation === 'home',
}))

const periodLabelMap = { morning: '上午', afternoon: '下午', night: '晚上' }

// ── 工具 ──────────────────────────────────────────────
function formatMoney(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return n.toLocaleString()
}

// ── 导航 ──────────────────────────────────────────────
function goHome() {
  router.push('/')
}

function loadSlot(i) {
  store.loadFromSlot(i)
  showSavePanel.value = false
  currentView.value = 'location'
}

// ── 地点跳转 ──────────────────────────────────────────
function goToLocation(locId) {
  store.currentLocation = locId
  store.clearNarratives()
  // 根据地点加载对应场景
  const scene = getLocationScene(locId)
  currentSceneData.value = scene
  currentView.value = 'scene'
}

// ── 选项处理 ──────────────────────────────────────────
function handleChoice(choice) {
  store.clearNarratives()

  // 如果是破人设的选项，触发电击
  if (choice.breakPersona) {
    store.triggerShock(choice.text, choice.forcedText)
    // 执行强制替换后的效果
    if (choice.forcedEffect) applyEffect(choice.forcedEffect)
    // 更新场景
    if (choice.next) loadScene(choice.next)
    else handleNext()
    return
  }

  // 正常选项
  if (choice.effect) applyEffect(choice.effect)
  if (choice.narrative) store.addNarrative(choice.narrative)
  if (choice.next) loadScene(choice.next)
  else handleNext()
}

function applyEffect(effect) {
  if (effect.heart) {
    Object.entries(effect.heart).forEach(([k, v]) => store.changeHeart(k, v))
  }
  if (effect.spending) {
    Object.entries(effect.spending).forEach(([k, v]) => store.addSpending(k, v))
  }
  if (effect.flags) {
    Object.entries(effect.flags).forEach(([k, v]) => store.setFlag(k, v))
  }
}

function loadScene(sceneId) {
  store.goToScene(sceneId)
  const scene = getSceneById(sceneId)
  currentSceneData.value = scene
  currentView.value = 'scene'
}

function handleNext() {
  store.clearNarratives()
  // 回合推进
  store.nextPeriod()
  currentView.value = 'location'
  currentSceneData.value = {}
}

// ── 游戏结束 ──────────────────────────────────────────
const successEndingText = computed(() => {
  const map = {
    guyan:  '顾衍放下了酒杯，第一次用不带算计的眼神看向你。',
    shenmo: '沈默开口说了一句话，不是为了钱，也不是为了任何人。',
    luoyu:  '洛屿做了一件对自己毫无好处的事，他自己都没意识到。',
  }
  return map[store.successTarget] || ''
})

function handleRestart() {
  store.startNewGame()
  currentView.value = 'location'
  currentSceneData.value = {}
}

// ── 场景数据（第一次开发用占位场景，后续替换为完整事件库） ──
function getLocationScene(locId) {
  const scenes = {
    bar: {
      narrator: '你推开酒吧沉重的木门，昏黄灯光打在顾衍轮廓分明的侧脸上。他端着威士忌，懒洋洋地朝你抬了抬眼皮。',
      dialogue: {
        who: '顾衍',
        words: '来了。今天心情不错？',
        thought: '她今天戴的那条项链，保守估计三十万。',
      },
      choices: [
        {
          text: '「废话少说，跟我走。」',
          effect: { spending: { guyan: 5000 } },
          narrative: '你扔出一张黑卡压在他酒杯旁。他唇角微弯，跟了上来。',
        },
        {
          text: '「你今天……看起来还不错。」',
          breakPersona: true,
          forcedText: '「哼，今天气色差成这样，出门不怕丢脸？」',
          forcedEffect: { heart: { guyan: 0.5 }, spending: { guyan: 0 } },
          narrative: '他愣了一秒，随即恢复了那副漫不经心的笑。',
        },
      ],
    },
    school: {
      narrator: '校园里人来人往。你在图书馆门口找到了沈默——他站在公告栏前，盯着助学金申请截止日期的通知，一动不动。',
      dialogue: {
        who: '沈默',
        words: '……你来这里做什么。',
        thought: '她又来了。我痛恨这种被人俯视的感觉。',
      },
      choices: [
        {
          text: '「碍事，让开。」然后往他手里塞了一个信封。',
          effect: { spending: { shenmo: 20000 }, heart: { shenmo: 0.5 } },
          narrative: '他接过信封，手微微抖了一下。你没有等他道谢，转身就走。',
        },
        {
          text: '「你还好吗？」',
          breakPersona: true,
          forcedText: '「站这里发什么呆，晦气。」',
          forcedEffect: {},
          narrative: '他把视线移开，没有说话。',
        },
      ],
    },
    studio: {
      narrator: '工作室里灯光刺眼。洛屿穿着一件薄薄的白衬衫，一看见你就扑了过来，眼睛亮晶晶的。',
      dialogue: {
        who: '洛屿',
        words: '姐姐！你来了！我今天拍得好不好看——',
        thought: '她来了就好，只要把她哄开心，我的好日子就来了。',
      },
      choices: [
        {
          text: '「凑合。」扔给他一张购物卡。',
          effect: { spending: { luoyu: 10000 } },
          narrative: '他接住购物卡，立刻换上了一个更甜的笑。',
        },
        {
          text: '「好看。」',
          breakPersona: true,
          forcedText: '「一般般，别自恋了。」',
          forcedEffect: { heart: { luoyu: 0.5 } },
          narrative: '他撅了撅嘴，却悄悄把刚才那一秒记在了心里。',
        },
      ],
    },
    mall: {
      narrator: '购物中心的冷气让你清醒了一些。你漫无目的地走着，周围人声嘈杂。',
      dialogue: null,
      choices: [
        {
          text: '买一堆东西，打发时间。',
          effect: { spending: {} },
          narrative: '你花了一下午，什么也没想清楚。',
        },
        {
          text: '在咖啡馆坐了一会儿。',
          effect: {},
          narrative: '你想起了今天的某个眼神，又觉得可能是自己多想了。',
        },
      ],
    },
    home: {
      narrator: '你回到家，空荡荡的客厅里只有你一个人。系统的提示音又响了一声：剩余 ' + (30 - store.day + 1) + ' 天。',
      dialogue: null,
      choices: [
        {
          text: '休息。',
          effect: {},
          narrative: '这一个回合什么也没发生。时间就这样过去了。',
        },
      ],
    },
  }
  return scenes[locId] || { narrator: '这里什么都没有。', choices: [{ text: '离开', effect: {} }] }
}

function getSceneById(sceneId) {
  // 后续章节事件库接入点，目前返回空场景
  return { narrator: '（场景加载中）', choices: null }
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

// ── 基础 ──────────────────────────────────────────────
.jinji-game {
  min-height: 100vh;
  background: #0a0a0f;
  color: #f0ece0;
  font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
  position: relative;
  overflow-x: hidden;
}

// ── 电击遮罩 ──────────────────────────────────────────
.shock-overlay {
  position: fixed;
  inset: 0;
  background: rgba(180, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shock-flash 0.15s ease-in-out 3;
  cursor: pointer;
}

@keyframes shock-flash {
  0%, 100% { background: rgba(180, 0, 0, 0.85); }
  50%       { background: rgba(255, 50, 0, 0.95); }
}

.shock-box {
  background: #0a0a0f;
  border: 2px solid #ff3333;
  border-radius: 16px;
  padding: 32px 28px;
  max-width: 340px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 40px #ff0000aa;
}

.shock-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  animation: shake 0.3s ease infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(-10deg); }
  75%       { transform: rotate(10deg); }
}

.shock-warning {
  color: #ff4444;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.shock-original {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 8px;
}

.strikethrough {
  text-decoration: line-through;
  text-decoration-color: #ff3333;
  text-decoration-thickness: 2px;
}

.shock-arrow {
  color: #ff6666;
  font-size: 1.2rem;
  margin: 6px 0;
}

.shock-forced {
  font-size: 1.05rem;
  color: #f0ece0;
  margin-bottom: 12px;
  font-weight: 500;
}

.shock-confirm {
  color: #66ff88;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.shock-tap {
  font-size: 0.75rem;
  color: #555;
  letter-spacing: 1px;
}

// ── 游戏结束 ──────────────────────────────────────────
.gameover-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gameover-box {
  background: #10100f;
  border: 1px solid #c9a84c55;
  border-radius: 20px;
  padding: 40px 28px;
  max-width: 340px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gameover-icon { font-size: 2.8rem; }
.gameover-title { font-size: 1.4rem; color: #c9a84c; font-weight: 700; }
.gameover-desc  { font-size: 0.95rem; color: #d0c8b8; line-height: 1.7; }
.gameover-hint  { font-size: 0.85rem; color: #888; font-style: italic; }

.gameover-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}

.btn-gold {
  background: linear-gradient(135deg, #c9a84c, #a07830);
  color: #0a0a0f;
  border: none;
  border-radius: 30px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { opacity: 0.85; }
}

.btn-ghost {
  background: transparent;
  color: #888;
  border: 1px solid #444;
  border-radius: 30px;
  padding: 10px 24px;
  font-size: 0.95rem;
  cursor: pointer;
  &:hover { border-color: #888; color: #ccc; }
}

// ── 开场界面 ──────────────────────────────────────────
.intro-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(ellipse at 30% 30%, rgba(201,168,76,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 70%, rgba(100,60,120,0.08) 0%, transparent 60%);
}

.intro-card {
  background: rgba(15,14,20,0.95);
  border: 1px solid #c9a84c44;
  border-radius: 24px;
  padding: 40px 28px;
  max-width: 380px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px #c9a84c22 inset;
}

.intro-badge {
  background: rgba(201,168,76,0.15);
  border: 1px solid #c9a84c88;
  border-radius: 30px;
  padding: 4px 16px;
  font-size: 0.8rem;
  color: #c9a84c;
  letter-spacing: 3px;
}

.intro-title {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
  background: linear-gradient(135deg, #f0ece0, #c9a84c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.intro-divider {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a84c, transparent);
}

.intro-rules {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #c8c0b0;

  .rule-icon { font-size: 1.2rem; }
  strong { color: #ff6666; }
}

.intro-warning {
  font-size: 0.85rem;
  color: #ff4444;
  letter-spacing: 2px;
  border: 1px solid #ff444433;
  border-radius: 20px;
  padding: 4px 16px;
}

.btn-start {
  background: linear-gradient(135deg, #c9a84c, #a07830);
  color: #0a0a0f;
  border: none;
  border-radius: 30px;
  padding: 14px 40px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 2px;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(201,168,76,0.4);
  }
}

// ── 主游戏界面 ────────────────────────────────────────
.game-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// ── 状态栏 ────────────────────────────────────────────
.status-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10,10,15,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #c9a84c22;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-time {
  display: flex;
  align-items: center;
  gap: 10px;
}

.day-num {
  font-size: 1rem;
  font-weight: 700;
  color: #c9a84c;
}

.period-tag {
  background: rgba(201,168,76,0.15);
  border: 1px solid #c9a84c55;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 0.8rem;
  color: #c9a84c;
}

.status-money {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  color: #c9a84c;

  .money-text { font-weight: 700; font-size: 1.1rem; }
}

// ── 真心值面板 ────────────────────────────────────────
.heart-panel {
  background: rgba(15,14,20,0.9);
  border-bottom: 1px solid #c9a84c22;
  padding: 0 16px;
}

.heart-panel-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 0.85rem;
  color: #888;
  letter-spacing: 1px;

  .toggle-arrow { color: #c9a84c; }
}

.heart-list {
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.heart-row {
  display: grid;
  grid-template-columns: 50px 1fr 44px 70px;
  align-items: center;
  gap: 8px;
}

.char-name {
  font-size: 0.85rem;
  color: #c0b8a8;
}

.heart-bar-wrap {
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
}

.heart-bar {
  height: 100%;
  background: linear-gradient(90deg, #c9a84c, #ff9966);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.heart-pct {
  font-size: 0.8rem;
  color: #c9a84c;
  text-align: right;
}

.spending-info {
  font-size: 0.75rem;
  color: #666;
  text-align: right;
}

// ── 场景区 ────────────────────────────────────────────
.scene-area {
  flex: 1;
  padding: 20px 16px;
  min-height: 0;
  transition: background 0.5s ease;

  &.loc-bar    { background: radial-gradient(ellipse at 50% 0%, rgba(120,20,20,0.3) 0%, transparent 70%); }
  &.loc-school { background: radial-gradient(ellipse at 50% 0%, rgba(20,60,120,0.3) 0%, transparent 70%); }
  &.loc-studio { background: radial-gradient(ellipse at 50% 0%, rgba(100,20,120,0.3) 0%, transparent 70%); }
  &.loc-mall   { background: radial-gradient(ellipse at 50% 0%, rgba(40,40,80,0.3)  0%, transparent 70%); }
  &.loc-home   { background: radial-gradient(ellipse at 50% 0%, rgba(20,20,40,0.3)  0%, transparent 70%); }
}

// ── 地点选择 ──────────────────────────────────────────
.location-choose {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scene-narrator {
  font-size: 0.95rem;
  color: #c8c0b0;
  line-height: 1.8;
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border-left: 2px solid #c9a84c44;
  border-radius: 0 8px 8px 0;
}

.location-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.location-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(201,168,76,0.2);
  border-radius: 12px;
  padding: 14px 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s;

  .loc-icon { font-size: 1.4rem; }
  .loc-name { font-size: 0.95rem; color: #e0d8c8; font-weight: 600; }
  .loc-desc { font-size: 0.78rem; color: #888; }

  &:hover {
    background: rgba(201,168,76,0.1);
    border-color: #c9a84c88;
    transform: translateY(-2px);
  }
}

// ── 剧情界面 ──────────────────────────────────────────
.scene-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scene-location-tag {
  font-size: 0.8rem;
  color: #888;
  letter-spacing: 1px;
}

.dialogue-wrap {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(201,168,76,0.15);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.char-say {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.char-tag {
  font-size: 0.8rem;
  color: #c9a84c;
  font-weight: 700;
  letter-spacing: 1px;
}

.char-words {
  font-size: 1rem;
  color: #f0ece0;
  line-height: 1.7;
}

.char-thought {
  font-size: 0.82rem;
  color: #666;
  font-style: italic;
  border-top: 1px solid #ffffff11;
  padding-top: 8px;
  line-height: 1.6;
}

.narrative-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.narrative-item {
  font-size: 0.88rem;
  color: #a89880;
  line-height: 1.7;
  font-style: italic;
  padding-left: 12px;
  border-left: 2px solid #c9a84c33;
}

// ── 选项 ──────────────────────────────────────────────
.choices-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choice-btn {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 0.95rem;
  color: #e0d8c8;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.5;

  &:hover {
    background: rgba(201,168,76,0.1);
    border-color: #c9a84c;
    color: #f0ece0;
  }
}

.btn-next-wrap {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.btn-next {
  background: transparent;
  border: 1px solid #c9a84c55;
  border-radius: 30px;
  padding: 10px 32px;
  color: #c9a84c;
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.2s;

  &:hover {
    background: rgba(201,168,76,0.1);
    border-color: #c9a84c;
  }
}

// ── 底部导航 ──────────────────────────────────────────
.bottom-nav {
  display: flex;
  border-top: 1px solid #c9a84c22;
  background: rgba(10,10,15,0.95);
}

.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
  background: transparent;
  border: none;
  color: #666;
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.2s;

  span:first-child { font-size: 1.2rem; }
  &:hover { color: #c9a84c; }
}

// ── 存档面板 ──────────────────────────────────────────
.save-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 800;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.save-panel {
  background: #12111a;
  border: 1px solid #c9a84c33;
  border-radius: 20px 20px 0 0;
  padding: 24px 16px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.save-title {
  font-size: 1rem;
  color: #c9a84c;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
}

.save-slots {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.save-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.04);
  border: 1px solid #c9a84c22;
  border-radius: 10px;
  padding: 12px 14px;
}

.slot-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slot-num   { font-size: 0.8rem; color: #888; }
.slot-detail { font-size: 0.9rem; color: #c8c0b0; }
.slot-empty { font-size: 0.85rem; color: #555; }

.slot-btns {
  display: flex;
  gap: 6px;
}

.slot-btn {
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s;

  &.save { border-color: #c9a84c88; color: #c9a84c; background: transparent;
    &:hover { background: rgba(201,168,76,0.15); } }
  &.load { border-color: #44aa6688; color: #44aa66; background: transparent;
    &:hover { background: rgba(68,170,102,0.15); }
    &:disabled { opacity: 0.3; cursor: not-allowed; } }
  &.del  { border-color: #aa444488; color: #aa4444; background: transparent;
    &:hover { background: rgba(170,68,68,0.15); }
    &:disabled { opacity: 0.3; cursor: not-allowed; } }
}

.save-close {
  align-self: center;
  background: transparent;
  border: 1px solid #444;
  border-radius: 20px;
  padding: 8px 28px;
  color: #888;
  cursor: pointer;
  &:hover { color: #ccc; border-color: #888; }
}

// ── 过渡动画 ──────────────────────────────────────────
.shock-enter-active, .shock-leave-active { transition: opacity 0.15s; }
.shock-enter-from, .shock-leave-to       { opacity: 0; }

.panel-slide-enter-active, .panel-slide-leave-active { transition: all 0.25s ease; }
.panel-slide-enter-from, .panel-slide-leave-to       { opacity: 0; transform: translateY(-8px); }

.panel-fade-enter-active, .panel-fade-leave-active { transition: opacity 0.2s; }
.panel-fade-enter-from, .panel-fade-leave-to       { opacity: 0; }
</style>
