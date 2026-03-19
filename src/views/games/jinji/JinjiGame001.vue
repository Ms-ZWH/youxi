<template>
  <div class="jinji-game">

    <!-- ══ 真心值变动提示 ══ -->
    <Transition name="delta-pop">
      <div v-if="heartDelta" class="heart-delta-toast" :class="heartDelta.delta > 0 ? 'positive' : 'negative'">
        {{ heartDelta.char }} 真心值
        {{ heartDelta.delta > 0 ? '+' : '' }}{{ heartDelta.delta.toFixed(1) }}%
      </div>
    </Transition>

    <!-- ══ 成就 Toast ══ -->
    <Transition name="ach-pop">
      <div v-if="achToast" class="ach-toast">
        <span class="ach-toast-icon">{{ achToast.icon }}</span>
        <span>成就解锁：{{ achToast.name }}</span>
      </div>
    </Transition>

    <!-- ══ 电击遮罩 ══ -->
    <Transition name="shock">
      <div v-if="store.shockActive" class="shock-overlay" @click="store.clearShock">
        <div class="shock-box">
          <div class="shock-icon">⚡</div>
          <div class="shock-warning">警告：检测到人设偏移！</div>
          <div class="shock-original"><span class="strikethrough">{{ store.shockOriginal }}</span></div>
          <div class="shock-arrow">↓ 强制修正</div>
          <div class="shock-forced">{{ store.shockMessage }}</div>
          <div class="shock-confirm">✓ 系统满意</div>
          <div class="shock-tap">点击继续</div>
        </div>
      </div>
    </Transition>

    <!-- ══ 游戏结束遮罩 ══ -->
    <div v-if="store.gameOver" class="gameover-overlay">
      <div class="game-card gameover-card">
        <div class="symbol-mini"><div class="ring"></div></div>

        <!-- 成功结局 -->
        <template v-if="store.gameOverType === 'success'">
          <div class="gameover-icon">♥</div>
          <div class="gameover-title">真心已找到</div>
          <div class="gameover-desc" style="white-space:pre-line">{{ successEndingText }}</div>
          <div class="gameover-hint">系统发出了最后一声提示音，然后沉默了。</div>
        </template>

        <!-- Bad End -->
        <template v-else-if="store.gameOverType === 'bad'">
          <div class="gameover-icon" style="color:#9090cc">♥</div>
          <div class="gameover-title" style="color:#c0c0ff">差一点</div>
          <div class="gameover-desc" style="white-space:pre-line">{{ badEndingText }}</div>
          <div class="gameover-hint">也许……再多一天就够了。</div>
        </template>

        <!-- 隐藏结局 -->
        <template v-else-if="store.gameOverType === 'hidden'">
          <div class="gameover-icon" style="color:#c9a84c">◈</div>
          <div class="gameover-title" style="color:#f5d076">隐藏结局</div>
          <div class="gameover-desc" style="white-space:pre-line">{{ hiddenEndingText }}</div>
          <div class="gameover-hint">系统无法对此进行评分。</div>
        </template>

        <!-- 普通失败 -->
        <template v-else>
          <div class="gameover-icon">♡</div>
          <div class="gameover-title">30天已过</div>
          <div class="gameover-desc">三十天就这么过去了。<br>系统发来了最后一条通知：『任务失败。真心值未达标。连接断开。』<br>然后什么都没了。<br><br>你坐在那里，想起那些——他退回来的一半现金，他在门口等的那个晚上，他讲了一半又收住的那句话。<br>也许那些才算数。只是你们都不确定。</div>
          <div class="gameover-hint">也许……曾经有过一个不同的瞬间？</div>
        </template>

        <div class="bottom-actions" style="margin-top:8px">
          <div class="action-btn" @click="handleRestart"><i class="fas fa-redo"></i> 再试一次</div>
          <div class="action-btn" @click="goHome"><i class="fas fa-arrow-left"></i> 大厅</div>
        </div>
      </div>
    </div>

    <!-- ══ 开场界面 ══ -->
    <div v-if="!store.gameStarted" class="page-center">
      <div class="game-card intro-card">

        <!-- 顶部返回 -->
        <div class="top-nav">
          <div class="top-btn" @click="goHome"><i class="fas fa-arrow-left"></i></div>
          <div style="display:flex;gap:8px">
            <div class="top-btn" @click="showDiary = true" title="日记"><i class="fas fa-book-open"></i></div>
            <div class="top-btn" @click="showAchievements = true" title="成就"><i class="fas fa-trophy"></i></div>
          </div>
        </div>

        <!-- 装饰符 -->
        <div class="symbol-mini"><div class="ring"></div></div>

        <!-- 系统绑定标签 -->
        <div class="day-badge" style="align-self:center">
          <i class="fas fa-lock"></i> 系统绑定
        </div>

        <!-- 主标题 -->
        <div class="section-title" style="text-align:center;border:none;margin-bottom:4px">
          绑定富婆系统后<br>我包养了3个小白脸
        </div>

        <!-- 夜晚氛围文案 -->
        <div class="intro-atmosphere">
          <i class="fas fa-moon"></i>
          某个深夜，一个声音突然出现在你脑海中。<br>
          它给了你花不完的钱，却要你用最恶毒的方式，去找到一个真心爱你的人。<br>
          <span class="atm-sub">三十天。三个男人。一场你从来没想过会输的游戏。</span>
        </div>

        <!-- 人物介绍 -->
        <div class="section-title" style="font-size:1.2rem;margin-bottom:12px">登场人物</div>
        <div class="char-intro-list">

          <div class="char-intro-card">
            <div class="char-intro-header">
              <div class="char-intro-avatar">衍</div>
              <div class="char-intro-meta">
                <div class="char-intro-name">顾衍 <span class="char-intro-tag">酒吧哥 · 26岁</span></div>
                <div class="char-intro-label">金融精英 / 凤凰男 / 情场老手</div>
              </div>
            </div>
            <div class="char-intro-quote">
              「他用算计的眼神看你，你却莫名觉得，他早就看穿了你。」
            </div>
          </div>

          <div class="char-intro-card">
            <div class="char-intro-header">
              <div class="char-intro-avatar" style="background:rgba(30,60,120,0.4);border-color:#6f8fbc">默</div>
              <div class="char-intro-meta">
                <div class="char-intro-name">沈默 <span class="char-intro-tag" style="border-color:#6f8fbc;color:#b0c8ff">大学生哥 · 21岁</span></div>
                <div class="char-intro-label">名校风云 / 沉默骄傲 / 自尊心极强</div>
              </div>
            </div>
            <div class="char-intro-quote">
              「他从不开口要钱，但你每次扔给他的时候，他都接了。」
            </div>
          </div>

          <div class="char-intro-card">
            <div class="char-intro-header">
              <div class="char-intro-avatar" style="background:rgba(100,30,100,0.4);border-color:#bc6fbc">屿</div>
              <div class="char-intro-meta">
                <div class="char-intro-name">洛屿 <span class="char-intro-tag" style="border-color:#bc6fbc;color:#f0b0ff">男模哥 · 23岁</span></div>
                <div class="char-intro-label">顶级绿茶 / 楚楚可怜 / 占有欲极强</div>
              </div>
            </div>
            <div class="char-intro-quote">
              「他对你说的每一句话都是假的——除了某一句，他自己也不知道是哪句。」
            </div>
          </div>

        </div>

        <!-- 游戏规则 -->
        <div class="section-title" style="font-size:1.2rem;margin-bottom:12px">游戏规则</div>
        <div class="desc-text" style="margin-bottom:8px">
          <div class="rule-row"><i class="fas fa-coins"></i> 你拥有<strong>无限金钱</strong></div>
          <div class="rule-row"><i class="fas fa-hourglass-half"></i> 30天内让一人真心值达<strong>100%</strong></div>
          <div class="rule-row"><i class="fas fa-mask"></i> 必须维持<strong style="color:#ff8888">恶毒富婆</strong>人设</div>
          <div class="rule-row"><i class="fas fa-bolt"></i> 破人设即遭<strong style="color:#ff8888">电击惩罚</strong></div>
        </div>
        <div class="difficulty-tag">难度：极高</div>

        <!-- 开始按钮 -->
        <div class="btn-start" @click="store.startNewGame()">
          <i class="fas fa-play"></i> 开始游戏
        </div>

        <div class="note">❤ 禁忌之恋 · 富婆养成</div>
      </div>
    </div>

    <!-- ══ 主游戏界面 ══ -->
    <div v-else class="page-center">
      <div class="game-card">

        <!-- 顶部导航 -->
        <div class="top-nav">
          <div class="top-btn" @click="goHome"><i class="fas fa-arrow-left"></i></div>
          <div style="display:flex;gap:8px">
            <div class="top-btn" @click="showDiary = true" title="日记"><i class="fas fa-book-open"></i></div>
            <div class="top-btn" @click="showAchievements = true" title="成就"><i class="fas fa-trophy"></i></div>
            <div class="top-btn" @click="showSavePanel = true"><i class="fas fa-save"></i></div>
          </div>
        </div>

        <!-- 极简装饰符 -->
        <div class="symbol-mini"><div class="ring"></div></div>

        <!-- 天数 · 时间段 -->
        <div class="header-day">
          <div class="day-badge">
            <i class="fas fa-calendar-alt"></i> 第{{ store.day }}天
          </div>
          <div class="time-badge">
            <i :class="periodIcon"></i> {{ store.periodLabel }}
          </div>
        </div>

        <!-- 攻略进度 -->
        <div class="section-title">攻略进度</div>
        <div class="progress-row">
          <div class="character-card" v-for="c in characters" :key="c.id">
            <div class="char-name">{{ c.name }}</div>
            <div class="char-percent">{{ store.hearts[c.id].toFixed(1) }}%</div>
            <div class="progress-bar-bg">
              <div class="progress-fill" :style="{ width: store.hearts[c.id] + '%' }"></div>
            </div>
            <div class="char-money">
              <i class="fas fa-coins"></i> {{ formatMoney(store.spending[c.id]) }}
            </div>
          </div>
        </div>

        <!-- 地点选择界面 -->
        <template v-if="currentView === 'location'">
          <div class="desc-text">
            <i class="fas fa-map-marker-alt" style="margin-right:8px"></i>
            你思考着今天{{ store.periodLabel }}去哪里。
          </div>
          <div class="location-grid">
            <div
              v-for="loc in availableLocations"
              :key="loc.id"
              class="location-btn"
              @click="goToLocation(loc.id)"
            >
              <i :class="loc.faIcon"></i> {{ loc.name }}
              <span v-if="loc.char" class="location-tag">
                <i class="fas fa-heart"></i> {{ loc.char }}在这里
              </span>
            </div>
          </div>
        </template>

        <!-- 剧情界面 -->
        <template v-else-if="currentView === 'scene'">
          <div class="desc-text scene-narrator" v-if="currentSceneData.narrator">
            <i class="fas fa-map-marker-alt" style="margin-right:6px;opacity:0.6"></i>
            {{ locationLabel }} &nbsp;·&nbsp;
            {{ currentSceneData.narrator }}
          </div>
          <div class="dialogue-card" v-if="currentSceneData.dialogue">
            <div class="char-say-name">{{ currentSceneData.dialogue.who }}</div>
            <div class="char-say-words">「{{ currentSceneData.dialogue.words }}」</div>
            <div class="char-thought" v-if="currentSceneData.dialogue.thought">
              {{ currentSceneData.dialogue.thought }}
            </div>
          </div>
          <div class="narrative-list" v-if="store.narratives.length">
            <div class="narrative-item" v-for="(n, i) in store.narratives" :key="i">{{ n }}</div>
          </div>
          <!-- 连续访问提示 -->
          <Transition name="hint-fade">
            <div v-if="showStreakHint" class="streak-hint-box">
              <i class="fas fa-exclamation-triangle"></i>
              系统观察：你似乎发现了本游戏的最优解。但最优解通常也是最无聊的解。
            </div>
          </Transition>

          <!-- 系统冷漠旁白 -->
          <div class="system-comment" v-if="store.systemComment">
            <i class="fas fa-robot"></i> {{ store.systemComment }}
          </div>
          <div class="location-grid" v-if="currentSceneData.choices" style="margin-bottom:0">
            <div
              v-for="(choice, i) in currentSceneData.choices"
              :key="i"
              class="location-btn choice-item"
              @click="handleChoice(choice)"
            >
              {{ choice.text }}
            </div>
          </div>
          <div class="bottom-actions" v-if="!currentSceneData.choices">
            <div class="action-btn full-btn" @click="handleNext">
              <i class="fas fa-arrow-right"></i> 继续
            </div>
          </div>
        </template>

        <div class="note">❤ 禁忌之恋 · 夜色抉择</div>
      </div>
    </div>

    <!-- ══ 存档面板 ══ -->
    <Transition name="panel-fade">
      <div v-if="showSavePanel" class="save-overlay" @click.self="showSavePanel = false">
        <div class="game-card save-panel">
          <div class="section-title" style="border:none;margin:0 0 8px">存档</div>
          <div class="save-slots">
            <div v-for="(slot, i) in store.saveSlots" :key="i" class="save-slot">
              <div class="slot-info">
                <span class="slot-num">槽 {{ i + 1 }}</span>
                <span v-if="slot" class="slot-detail">第{{ slot.day }}天 {{ periodLabelMap[slot.period] }}</span>
                <span v-else class="slot-empty">空</span>
              </div>
              <div class="slot-btns">
                <button class="slot-btn sbtn-save" @click="store.saveToSlot(i)">保存</button>
                <button class="slot-btn sbtn-load" :disabled="!slot" @click="loadSlot(i)">读取</button>
                <button class="slot-btn sbtn-del"  :disabled="!slot" @click="store.deleteSaveSlot(i)">删除</button>
              </div>
            </div>
          </div>
          <div class="bottom-actions">
            <div class="action-btn full-btn" @click="showSavePanel = false">关闭</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ 成就面板 ══ -->
    <div v-if="showAchievements" class="ach-overlay" @click.self="showAchievements = false">
      <div class="game-card ach-panel">
        <div class="ach-header">
          <span>成就 {{ unlockedCount }}/{{ ACHIEVEMENTS.length }}</span>
          <div class="top-btn" @click="showAchievements = false">✕</div>
        </div>
        <div class="ach-list">
          <div v-for="a in ACHIEVEMENTS" :key="a.id"
               class="ach-item" :class="{ locked: !store.achievements[a.id] }">
            <span class="ach-icon">{{ store.achievements[a.id] ? a.icon : '?' }}</span>
            <div class="ach-info">
              <div class="ach-name">{{ store.achievements[a.id] ? a.name : '???' }}</div>
              <div class="ach-desc">{{ store.achievements[a.id] ? a.desc : '未解锁' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 关系日记面板 ══ -->
    <div v-if="showDiary" class="ach-overlay" @click.self="showDiary = false">
      <div class="game-card diary-panel">
        <div class="ach-header">
          <span>关系日记</span>
          <div class="top-btn" @click="showDiary = false">✕</div>
        </div>
        <div class="diary-tabs">
          <div v-for="c in characters" :key="c.id"
               class="diary-tab" :class="{ active: diaryTab === c.id }"
               @click="diaryTab = c.id">
            {{ c.name }}
            <span class="diary-count">{{ store.diary[c.id].length }}</span>
          </div>
        </div>
        <div class="diary-list" v-if="store.diary[diaryTab].length">
          <div v-for="(e, i) in [...store.diary[diaryTab]].reverse()" :key="i" class="diary-entry">
            <div class="diary-date">第{{ e.day }}天 {{ periodLabelMap[e.period] }}</div>
            <div class="diary-narrative" v-if="e.narrative">「{{ e.narrative }}」</div>
            <div class="diary-comment">—— {{ e.comment }}</div>
          </div>
        </div>
        <div class="diary-empty" v-else>
          <i class="fas fa-moon"></i> 还没有记录
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJinji001Store } from '@/stores/jinji001.js'
import { selectScene } from '@/views/games/jinji/data/scenes.js'
import { ACHIEVEMENTS } from './data/achievements.js'

const router = useRouter()
const store  = useJinji001Store()

// ── UI 状态 ───────────────────────────────────────────
const showSavePanel    = ref(false)
const showAchievements = ref(false)
const showDiary        = ref(false)
const diaryTab         = ref('guyan')
const currentView      = ref('location')
const currentSceneData = ref({})
const heartDelta       = ref(null)   // 真心值变动提示 {char, delta}
let heartDeltaTimer    = null

// ── 成就 toast ────────────────────────────────────────
const achToast = ref(null)
let achToastTimer = null

watch(() => store.newAchievement, (id) => {
  if (!id) return
  const def = ACHIEVEMENTS.find(a => a.id === id)
  if (!def) return
  if (achToastTimer) clearTimeout(achToastTimer)
  achToast.value = def
  store.clearNewAchievement()
  achToastTimer = setTimeout(() => { achToast.value = null }, 2500)
})

const unlockedCount = computed(() =>
  ACHIEVEMENTS.filter(a => store.achievements[a.id]).length
)

// ── 连续访问同一地点追踪 ──────────────────────────────
const locationStreak = ref({ loc: null, count: 0 })

function updateLocationStreak(locId) {
  if (locationStreak.value.loc === locId) {
    locationStreak.value.count++
  } else {
    locationStreak.value = { loc: locId, count: 1 }
  }
  return locationStreak.value.count
}

const showStreakHint = ref(false)

function checkStreakHint(streak) {
  showStreakHint.value = streak >= 5
}

// ── 角色 ──────────────────────────────────────────────
const characters = [
  { id: 'guyan',  name: '顾衍' },
  { id: 'shenmo', name: '沈默' },
  { id: 'luoyu',  name: '洛屿' },
]

// ── 地点 ──────────────────────────────────────────────
const availableLocations = [
  { id: 'bar',    faIcon: 'fas fa-glass-martini-alt', name: '酒吧',      char: '顾衍' },
  { id: 'school', faIcon: 'fas fa-university',        name: '大学校园',   char: '沈默' },
  { id: 'studio', faIcon: 'fas fa-tshirt',            name: '模特工作室', char: '洛屿' },
  { id: 'mall',   faIcon: 'fas fa-shopping-bag',      name: '购物中心',   char: null  },
  { id: 'walk',   faIcon: 'fas fa-walking',           name: '随便逛逛',   char: null  },
  { id: 'home',   faIcon: 'fas fa-door-closed',       name: '待在家 · 休息一回合', char: null },
]

const locationNames = {
  bar: '酒吧', school: '大学校园', studio: '模特工作室',
  mall: '购物中心', walk: '街头', home: '家'
}
const locationLabel = computed(() => locationNames[store.currentLocation] || '')

const periodLabelMap = { morning: '上午', afternoon: '下午', night: '晚上' }
const periodIcon = computed(() => ({
  morning: 'fas fa-sun', afternoon: 'fas fa-cloud-sun', night: 'fas fa-moon'
}[store.period]))

// ── 工具 ──────────────────────────────────────────────
function formatMoney(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return n ? n.toLocaleString() : '0'
}

// ── 导航 ──────────────────────────────────────────────
function goHome() { router.push({ name: 'JinjiCategory' }) }
function loadSlot(i) {
  store.loadFromSlot(i)
  showSavePanel.value = false
  currentView.value = 'location'
  locationStreak.value = { loc: null, count: 0 }
  showStreakHint.value = false
}

// ── 地点跳转 ──────────────────────────────────────────
// 角色地点 → 记录访问 → 触发真心值引擎 → 选择场景
const CHAR_LOCATION_MAP = { bar: 'guyan', school: 'shenmo', studio: 'luoyu' }

function goToLocation(locId) {
  store.currentLocation = locId
  store.clearNarratives()
  store.clearSystemComment()

  const phase  = store.day <= 10 ? 1 : store.day <= 20 ? 2 : 3
  const charId = CHAR_LOCATION_MAP[locId] || null
  if (charId) store.recordVisit(charId, phase)

  // 使用按阶段计数，避免上一阶段的访问次数影响新阶段的场景选择
  const visits = charId ? store.visitCountByPhase[charId][phase] - 1 : 0
  const scene  = selectScene(locId, store.day, visits, store.flags)

  // 特殊flag触发场景：标记已看过，防止重复触发
  if (scene.requireFlag && !store.flags[`${scene.id}_seen`]) {
    store.setFlag(`${scene.id}_seen`)
  }

  // 连续访问同一地点：触发醒目提示
  const streak = updateLocationStreak(locId)
  checkStreakHint(streak)

  currentSceneData.value = scene
  currentView.value = 'scene'
  store.checkAchievements()
}

// ── 选项处理 ──────────────────────────────────────────
function handleChoice(choice) {
  store.clearNarratives()
  store.clearSystemComment()

  if (choice.breakPersona) {
    store.triggerShock(choice.text, choice.forcedText)
    const eff = choice.forcedEffect || {}
    applyEffect(eff)
    if (choice.narrative)      store.addNarrative(choice.narrative)
    if (choice.systemComment)  store.setSystemComment(choice.systemComment)
    runHeartTrigger()
    if (choice.next) loadScene(choice.next)
    else             currentSceneData.value = { ...currentSceneData.value, choices: null }
    const _diaryChar1 = CHAR_LOCATION_MAP[store.currentLocation]
    if (_diaryChar1 && store.systemComment) {
      const _narrative1 = store.narratives[store.narratives.length - 1] ?? ''
      store.addDiaryEntry(_diaryChar1, _narrative1, store.systemComment)
    }
    store.checkAchievements()
    return
  }

  if (choice.effect)    applyEffect(choice.effect)
  if (choice.narrative) store.addNarrative(choice.narrative)
  if (choice.systemComment) store.setSystemComment(choice.systemComment)
  runHeartTrigger()
  if (choice.next) loadScene(choice.next)
  else             currentSceneData.value = { ...currentSceneData.value, choices: null }
  const _diaryChar2 = CHAR_LOCATION_MAP[store.currentLocation]
  if (_diaryChar2 && store.systemComment) {
    const _narrative2 = store.narratives[store.narratives.length - 1] ?? ''
    store.addDiaryEntry(_diaryChar2, _narrative2, store.systemComment)
  }
  store.checkAchievements()
}

// 触发真心值引擎，有变动时显示提示
function runHeartTrigger() {
  const charId = CHAR_LOCATION_MAP[store.currentLocation]
  if (!charId) return
  const delta = store.evalHeartTrigger(charId)
  if (delta !== 0) {
    const charNames = { guyan: '顾衍', shenmo: '沈默', luoyu: '洛屿' }
    heartDelta.value = { char: charNames[charId], delta }
    clearTimeout(heartDeltaTimer)
    heartDeltaTimer = setTimeout(() => { heartDelta.value = null }, 2500)
  }
}

function applyEffect(effect) {
  if (effect.heart)   Object.entries(effect.heart).forEach(([k, v]) => store.changeHeart(k, v))
  if (effect.spending) Object.entries(effect.spending).forEach(([k, v]) => store.addSpending(k, v))
  if (effect.flags)   Object.entries(effect.flags).forEach(([k, v]) => store.setFlag(k, v))
}

function loadScene(sceneId) {
  store.goToScene(sceneId)
  currentSceneData.value = getSceneById(sceneId)
  currentView.value = 'scene'
}

function handleNext() {
  store.clearNarratives()
  store.clearSystemComment()
  showStreakHint.value = false
  store.nextPeriod()
  currentView.value = 'location'
  currentSceneData.value = {}
}

// ── 游戏结束 ──────────────────────────────────────────
const successEndingText = computed(() => ({
  guyan:  '顾衍放下了酒杯，第一次用不带算计的眼神看向你。\n\n你忽然想起第一次见他时，他说：「来了。今天想花多少？」\n\n他已经很久没有提过钱了。',
  shenmo: '沈默说了一句话，不是为了钱，也不是为了任何人。\n\n他沉默了很久，才开口。你等了那么久，等到了一句值得等的话。\n\n他说完，低下头，假装在看地面。',
  luoyu:  '洛屿做了一件对自己毫无好处的事，他自己都没有意识到。\n\n然后他抬起头，看见你在看他，沉默了一下，说：「就这样。」\n\n「就这样」是他说过最长的承诺。',
}[store.successTarget] || ''))

const badEndingText = computed(() => ({
  guyan:  '倒计时归零那天，顾衍的手机关机了。他留下的最后一条消息是一个转账记录——不是还给你的，是他把你的钱投资的项目刚刚到账了。\n\n你知道他走了。你知道你早就知道他会走。但你不知道为什么坐了很久，舍不得把那个联系方式删掉。',
  shenmo: '30天的最后一天，你收到了一个银行转账。金额分毫不差——你在他身上花过的每一分钱，全部退了回来。\n\n备注只有三个字：「已结清。」\n\n没有多余的话，他的微信头像变成了灰色。你想，他为什么没有早一点走。',
  luoyu:  '新金主的条件比你好多了。洛屿当着你的面接了对方的名片，笑得和第一次见你时一样甜。「姐姐，你会找到更好的。」\n\n这句话他说得很轻，像是安慰你，也像是安慰自己。\n\n你站在那里，脑子里转来转去的是他上次没有撒谎时的样子。',
}[store.successTarget] || ''))

const hiddenEndingText = computed(() => {
  if (store.successTarget === 'shenmo') {
    const amount = formatMoney(store.spending.shenmo)
    return `30天的最后一天，沈默给你发来一张照片——是一个账本，密密麻麻的数字，从第一天到最后一天，你在他身上花过的每一笔钱，全部记录在案。\n\n最后一行写着：「总计 ¥${amount}。归还计划：待定。」\n\n不是「已结清」，是「待定」。\n\n你盯着那两个字看了很久。待定的意思是——他还打算回来。`
  }
  return ({
    guyan:  '倒计时归零的那一刻，顾衍把酒杯放下来，看着你。\n\n「你知道吗，」他说，「我一开始把你当成一步棋。」\n\n停顿。「后来发现你也在下棋。」\n\n他笑了一下，那个笑里没有算计。「输赢我没想清楚。但棋局……我不想收了。」\n\n系统的倒计时在这一刻静止了，然后消失了。它没有说任务失败，也没有说成功。\n\n有些事不在它的评分体系里。',
    luoyu:  '游戏结束的时候，洛屿没有撒娇，没有讲故事，没有哭，没有任何一个他准备过的表情。\n\n他只是坐在那里，用一种陌生的、安静的方式看着你。\n\n「姐姐，」他说，「我不知道接下来该说什么了。」\n\n这是他说过最诚实的一句话。\n\n「我把所有的剧本都用完了，」他停了一下，「剩下的，」他抬起头，「是真的。」',
  }[store.successTarget] || '')
})

function handleRestart() {
  store.startNewGame()
  currentView.value = 'location'
  currentSceneData.value = {}
  locationStreak.value = { loc: null, count: 0 }
  showStreakHint.value = false
}

// ── 占位场景数据 ──────────────────────────────────────
function getLocationScene(locId) {
  const remaining = 30 - store.day + 1
  const scenes = {
    bar: {
      narrator: '你推开酒吧沉重的木门，昏黄灯光打在顾衍轮廓分明的侧脸上。他端着威士忌，懒洋洋地抬了抬眼皮。',
      dialogue: { who: '顾衍', words: '来了。今天心情不错？', thought: '她今天戴的那条项链，保守估计三十万。' },
      choices: [
        { text: '「废话少说，跟我走。」', effect: { spending: { guyan: 5000 } }, narrative: '你扔出一张黑卡压在他酒杯旁。他唇角微弯，跟了上来。' },
        { text: '「你今天……看起来还不错。」', breakPersona: true, forcedText: '「哼，今天气色差成这样，出门不怕丢脸？」', forcedEffect: { heart: { guyan: 0.5 } }, narrative: '他愣了一秒，随即恢复了那副漫不经心的笑。' },
      ],
    },
    school: {
      narrator: '你在图书馆门口找到了沈默——他站在公告栏前，盯着助学金截止通知，一动不动。',
      dialogue: { who: '沈默', words: '……你来这里做什么。', thought: '她又来了。我痛恨这种被人俯视的感觉。' },
      choices: [
        { text: '「碍事，让开。」往他手里塞了一个信封。', effect: { spending: { shenmo: 20000 }, heart: { shenmo: 0.5 } }, narrative: '他接过信封，手微微抖了一下。你没有等他道谢，转身就走。' },
        { text: '「你还好吗？」', breakPersona: true, forcedText: '「站这里发什么呆，晦气。」', forcedEffect: {}, narrative: '他把视线移开，没有说话。' },
      ],
    },
    studio: {
      narrator: '工作室灯光刺眼。洛屿穿着白衬衫，一看见你就扑了过来，眼睛亮晶晶的。',
      dialogue: { who: '洛屿', words: '姐姐！你来了！我今天拍得好不好看——', thought: '只要把她哄开心，我的好日子就来了。' },
      choices: [
        { text: '「凑合。」扔给他一张购物卡。', effect: { spending: { luoyu: 10000 } }, narrative: '他接住购物卡，立刻换上了一个更甜的笑。' },
        { text: '「好看。」', breakPersona: true, forcedText: '「一般般，别自恋了。」', forcedEffect: { heart: { luoyu: 0.5 } }, narrative: '他撅了撅嘴，却悄悄把刚才那一秒记在了心里。' },
      ],
    },
    mall: {
      narrator: '购物中心的冷气让你清醒了一些。你漫无目的地走着，周围人声嘈杂。',
      dialogue: null,
      choices: [
        { text: '随手买了一堆东西，打发时间。', narrative: '你花了一个回合，什么也没想清楚。' },
        { text: '在咖啡馆坐了一会儿。', narrative: '你想起了今天的某个眼神，又觉得可能是自己多想了。' },
      ],
    },
    walk: {
      narrator: '你一个人走在街头，霓虹灯的光把影子拉得很长。',
      dialogue: null,
      choices: [
        { text: '随便走走，放空自己。', narrative: '有时候什么都不做，也是一种决定。' },
      ],
    },
    home: {
      narrator: `你回到家，空荡荡的客厅里只有你一个人。系统提示音响了一声：剩余 ${remaining} 天。`,
      dialogue: null,
      choices: [
        { text: '休息，等待下一个回合。', narrative: '这一个回合什么也没发生。时间就这样过去了。' },
      ],
    },
  }
  return scenes[locId] || { narrator: '这里什么都没有。', choices: [{ text: '离开' }] }
}

function getSceneById(sceneId) {
  return { narrator: '（场景加载中）', choices: null }
}
</script>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

// ══ 页面底层 ══════════════════════════════════════════
.jinji-game {
  background: #0b0101;
  min-height: 100vh;
  font-family: 'Montserrat', 'Noto Sans SC', sans-serif;
  background-image:
    radial-gradient(circle at 30% 40%, rgba(120, 30, 30, 0.3) 0%, transparent 40%),
    repeating-linear-gradient(45deg, rgba(200,120,120,0.02) 0px, rgba(200,120,120,0.02) 2px, transparent 2px, transparent 6px);
}

// ══ 居中容器 ══════════════════════════════════════════
.page-center {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 16px;
}

// ══ 主卡片 ════════════════════════════════════════════
.game-card {
  max-width: 440px;
  width: 100%;
  background: rgba(18, 8, 8, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 48px;
  border: 1px solid rgba(210, 130, 130, 0.3);
  box-shadow:
    0 40px 70px -20px black,
    0 0 0 1px rgba(180, 90, 90, 0.2) inset,
    0 0 40px rgba(120, 30, 0, 0.3);
  padding: 28px 22px 32px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -15%; left: -10%;
    width: 200px; height: 200px;
    background: radial-gradient(circle, #a1424220, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -10%; right: -10%;
    width: 250px; height: 250px;
    background: radial-gradient(circle, #80353520, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

// ══ 顶部导航 ══════════════════════════════════════════
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  position: relative;
  z-index: 1;
}

.top-btn {
  width: 38px;
  height: 38px;
  background: rgba(80, 20, 20, 0.5);
  border: 1px solid #bc6f6f88;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffa2a2;
  font-size: 0.95rem;
  transition: all 0.15s;
  box-shadow: 0 2px 8px #1a0000;

  &:hover {
    background: rgba(140, 40, 40, 0.6);
    border-color: #ff9090;
    color: #ffcece;
  }
}

// ══ 装饰符号 ══════════════════════════════════════════
.symbol-mini {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  opacity: 0.5;

  .ring {
    width: 40px; height: 40px;
    border: 1px solid rgba(200, 100, 100, 0.5);
    border-radius: 50%;
    box-shadow: 0 0 10px #b14b4b;
    position: relative;

    &::after {
      content: '♥';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      color: #ffa0a0;
      font-size: 1.2rem;
      filter: drop-shadow(0 0 6px #ff5151);
    }
  }
}

// ══ 天数行 ════════════════════════════════════════════
.header-day {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.day-badge {
  background: rgba(100, 25, 25, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid #bc6f6f;
  border-radius: 40px;
  padding: 8px 22px;
  font-size: 1.1rem;
  font-weight: 300;
  color: #fad7d7;
  letter-spacing: 2px;
  box-shadow: 0 4px 12px #2f0000;
  cursor: default;

  i { margin-right: 8px; color: #ffa2a2; }
}

.time-badge {
  background: rgba(80, 20, 20, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid #bc6f6f;
  border-radius: 40px;
  padding: 8px 22px;
  font-size: 1.1rem;
  font-weight: 300;
  color: #fad7d7;
  cursor: default;

  i { margin-right: 8px; color: #ffa2a2; }
}

// ══ 区块标题 ══════════════════════════════════════════
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.7rem;
  font-weight: 600;
  color: #fccaca;
  text-shadow: 0 2px 10px #b33b3b;
  border-bottom: 1px solid #a75858;
  padding-bottom: 6px;
  margin: 15px 0 16px;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

// ══ 角色进度卡片 ══════════════════════════════════════
.progress-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.character-card {
  flex: 1;
  background: rgba(25, 8, 8, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(190, 100, 100, 0.4);
  border-radius: 24px;
  padding: 8px 6px;
  box-shadow: 0 8px 16px -8px #1e0101, 0 0 0 1px #8f4b4b inset;
  text-align: center;
}

.char-name {
  font-size: 1rem;
  font-weight: 500;
  color: #ffd3d3;
  margin-bottom: 4px;
}

.char-percent {
  font-size: 0.85rem;
  font-weight: 300;
  color: #ffaeae;
  background: rgba(0,0,0,0.2);
  border-radius: 20px;
  padding: 2px 6px;
  display: inline-block;
  margin-bottom: 4px;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: rgba(60, 20, 20, 0.7);
  border-radius: 10px;
  margin: 6px 0;
  overflow: hidden;
  box-shadow: inset 0 2px 4px black;
}

.progress-fill {
  height: 100%;
  min-width: 2px;
  background: linear-gradient(90deg, #ff7b7b, #ff3a3a);
  border-radius: 10px;
  box-shadow: 0 0 10px #ff5a5a;
  transition: width 0.5s ease;
}

.char-money {
  font-size: 0.9rem;
  font-weight: 400;
  color: #ffd9b0;
  text-shadow: 0 0 8px #ffae5e;
  margin-top: 4px;

  i { font-size: 0.75rem; margin-right: 3px; color: #ffc96e; }
}

// ══ 描述/旁白文字块 ═══════════════════════════════════
.desc-text {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 300;
  color: #efcfcf;
  background: rgba(40, 12, 12, 0.3);
  backdrop-filter: blur(4px);
  padding: 14px 14px;
  border-radius: 40px;
  border: 1px solid #a75959;
  margin: 0 0 20px;
  line-height: 1.6;
  box-shadow: 0 6px 12px -6px black;
  position: relative;
  z-index: 1;

  i { color: #ffa2a2; }
}

.scene-narrator {
  text-align: left;
  border-radius: 24px;
  line-height: 1.8;
}

.rule-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
  text-align: left;

  i { color: #ffa2a2; width: 18px; flex-shrink: 0; }
  strong { color: #ffd3d3; }
}

// ══ 地点网格 ══════════════════════════════════════════
.location-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.location-btn {
  background: rgba(25, 8, 8, 0.6);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(200, 110, 110, 0.5);
  border-radius: 28px;
  padding: 14px 8px;
  color: #fad0d0;
  font-size: 0.9rem;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 8px 16px -8px #200000, 0 0 0 1px #b16262 inset;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  line-height: 1.4;

  i { font-size: 1.1rem; color: #ffa2a2; }

  &:hover {
    background: rgba(60, 15, 15, 0.7);
    border-color: #ff9a9a;
    transform: translateY(-2px);
    box-shadow: 0 12px 20px -8px #2a0000, 0 0 0 1px #d08080 inset;
  }
}

.choice-item {
  border-radius: 20px;
  font-size: 0.88rem;
  padding: 12px 10px;
  line-height: 1.5;
}

.location-tag {
  background: rgba(150, 50, 50, 0.6);
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.7rem;
  color: #ffe1e1;
  border: 1px solid #ffa0a0;
  white-space: nowrap;

  i { font-size: 0.6rem; margin-right: 3px; }
}

// ══ 对话卡片 ══════════════════════════════════════════
.dialogue-card {
  background: rgba(30, 8, 8, 0.5);
  border: 1px solid rgba(190, 100, 100, 0.35);
  border-radius: 24px;
  padding: 16px 18px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.char-say-name {
  font-size: 0.8rem;
  color: #ffa2a2;
  font-weight: 600;
  letter-spacing: 2px;
}

.char-say-words {
  font-size: 1rem;
  color: #fae8e8;
  line-height: 1.7;
}

.char-thought {
  font-size: 0.8rem;
  color: #7a5a5a;
  font-style: italic;
  border-top: 1px solid #ffffff0d;
  padding-top: 8px;
  line-height: 1.6;
}

// ══ 旁白 ══════════════════════════════════════════════
.narrative-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.narrative-item {
  font-size: 0.85rem;
  color: #d4a8a8;
  line-height: 1.8;
  font-style: italic;
  padding: 10px 14px;
  background: rgba(40,10,10,0.3);
  border-radius: 16px;
  border-left: 2px solid #a75858;
}

// ══ 底部操作按钮 ══════════════════════════════════════
.bottom-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 10px;
  position: relative;
  z-index: 1;
}

.action-btn {
  flex: 1;
  max-width: 160px;
  background: rgba(20, 5, 5, 0.5);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(200, 110, 110, 0.6);
  border-radius: 40px;
  padding: 14px 0;
  font-size: 1rem;
  font-weight: 300;
  color: #f2c9c9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 14px -8px black, 0 0 0 1px #b65757 inset;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.15s;

  i { color: #ffa6a6; }

  &:hover {
    background: rgba(60, 10, 10, 0.6);
    border-color: #ff9090;
  }

  &.full-btn { max-width: 100%; flex: 1; }
}

// ══ 备注 ══════════════════════════════════════════════
.note {
  font-size: 0.7rem;
  text-align: center;
  color: #a16464;
  margin-top: 15px;
  opacity: 0.5;
  position: relative;
  z-index: 1;
}

// ══ 开场专用 ══════════════════════════════════════════
.intro-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  margin-top: 20px;

  .desc-text { text-align: left; border-radius: 24px; }
}

// 夜晚氛围文案
.intro-atmosphere {
  background: rgba(20, 5, 5, 0.5);
  border: 1px solid #a7595988;
  border-radius: 24px;
  padding: 18px 16px;
  font-size: 0.9rem;
  font-weight: 300;
  color: #efcfcf;
  line-height: 1.9;
  text-align: center;
  margin: 8px 0 16px;
  position: relative;
  z-index: 1;

  i { color: #ffa2a2; margin-right: 6px; }

  .atm-sub {
    display: block;
    margin-top: 10px;
    font-size: 0.8rem;
    color: #a16464;
    font-style: italic;
    letter-spacing: 0.5px;
  }
}

// 人物介绍列表
.char-intro-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.char-intro-card {
  background: rgba(25, 8, 8, 0.5);
  border: 1px solid rgba(190, 100, 100, 0.35);
  border-radius: 24px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.15s;

  &:hover {
    background: rgba(40, 10, 10, 0.6);
    border-color: rgba(210, 120, 120, 0.5);
  }
}

.char-intro-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-intro-avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: rgba(100, 25, 25, 0.4);
  border: 1px solid #bc6f6f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  color: #ffd3d3;
  box-shadow: 0 0 12px rgba(180, 60, 60, 0.3);
}

.char-intro-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.char-intro-name {
  font-size: 1rem;
  font-weight: 600;
  color: #ffd3d3;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.char-intro-tag {
  font-size: 0.7rem;
  font-weight: 300;
  color: #ffaeae;
  border: 1px solid #bc6f6f88;
  border-radius: 20px;
  padding: 1px 8px;
  letter-spacing: 0.5px;
}

.char-intro-label {
  font-size: 0.75rem;
  color: #9a6464;
  letter-spacing: 0.5px;
}

.char-intro-quote {
  font-size: 0.85rem;
  color: #e8c8c8;
  font-style: italic;
  line-height: 1.7;
  border-left: 2px solid #a7595966;
  padding-left: 12px;
}

.difficulty-tag {
  text-align: center;
  font-size: 0.8rem;
  color: #ff7070;
  letter-spacing: 3px;
  border: 1px solid #ff404033;
  border-radius: 20px;
  padding: 5px 0;
  margin: 8px 0;
}

.btn-start {
  background: rgba(160, 40, 40, 0.5);
  border: 1px solid rgba(220, 120, 120, 0.7);
  border-radius: 40px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 300;
  color: #fff0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 6px 20px -8px black, 0 0 0 1px #e08080 inset;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.15s;
  margin-top: 8px;
  position: relative;
  z-index: 1;

  i { color: #ffcece; }

  &:hover {
    background: rgba(200, 50, 50, 0.5);
    box-shadow: 0 0 20px #ff5050aa, 0 0 0 1px #ffaaaa inset;
    transform: translateY(-1px);
  }
}

// ══ 游戏结束 ══════════════════════════════════════════
.gameover-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.88);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.gameover-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.gameover-icon {
  font-size: 2.5rem;
  color: #ffa2a2;
  text-shadow: 0 0 20px #ff5050;
}

.gameover-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  color: #fccaca;
  text-shadow: 0 2px 10px #b33b3b;
}

.gameover-desc {
  font-size: 0.95rem;
  color: #efcfcf;
  line-height: 1.8;
}

.gameover-hint {
  font-size: 0.82rem;
  color: #7a5a5a;
  font-style: italic;
}

// ══ 存档面板 ══════════════════════════════════════════
.save-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.save-panel {
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-slots { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }

.save-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30,8,8,0.5);
  border: 1px solid rgba(190,100,100,0.3);
  border-radius: 20px;
  padding: 12px 16px;
}

.slot-info  { display: flex; flex-direction: column; gap: 2px; }
.slot-num   { font-size: 0.78rem; color: #a16464; }
.slot-detail { font-size: 0.9rem; color: #fad0d0; }
.slot-empty { font-size: 0.85rem; color: #5a3a3a; }

.slot-btns { display: flex; gap: 6px; }

.slot-btn {
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.78rem;
  cursor: pointer;
  border: 1px solid;
  background: transparent;
  transition: all 0.15s;

  &.sbtn-save { border-color: #bc6f6f88; color: #ffa2a2;
    &:hover { background: rgba(180,70,70,0.2); } }
  &.sbtn-load { border-color: #6fbc8888; color: #a2ffbe;
    &:hover { background: rgba(70,180,100,0.2); }
    &:disabled { opacity: 0.3; cursor: not-allowed; } }
  &.sbtn-del  { border-color: #88446688; color: #ffaad4;
    &:hover { background: rgba(150,50,80,0.2); }
    &:disabled { opacity: 0.3; cursor: not-allowed; } }
}

// ══ 电击遮罩 ══════════════════════════════════════════
.shock-overlay {
  position: fixed;
  inset: 0;
  background: rgba(180, 0, 0, 0.88);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shock-flash 0.12s ease-in-out 4;
  cursor: pointer;
}

@keyframes shock-flash {
  0%, 100% { background: rgba(180,0,0,0.88); }
  50%       { background: rgba(255,60,0,0.96); }
}

.shock-box {
  background: rgba(18,5,5,0.97);
  border: 2px solid #ff3333;
  border-radius: 32px;
  padding: 32px 28px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 50px #ff000099;
}

.shock-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  animation: shake 0.25s ease infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-12deg); }
  75% { transform: rotate(12deg); }
}

.shock-warning {
  color: #ff4444;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.shock-original { font-size: 0.9rem; color: #7a4a4a; margin-bottom: 8px; }

.strikethrough {
  text-decoration: line-through;
  text-decoration-color: #ff3333;
  text-decoration-thickness: 2px;
}

.shock-arrow { color: #ff6666; font-size: 1.1rem; margin: 6px 0; }
.shock-forced { font-size: 1rem; color: #fad0d0; margin-bottom: 12px; font-weight: 500; }
.shock-confirm { color: #66ff88; font-size: 0.85rem; margin-bottom: 8px; }
.shock-tap { font-size: 0.72rem; color: #5a3a3a; letter-spacing: 1px; }

// ══ 连续访问提示 ══════════════════════════════════════
.streak-hint-box {
  background: rgba(30, 22, 5, 0.85);
  border: 1px solid #c9a84c;
  border-radius: 16px;
  padding: 10px 14px;
  font-size: 0.82rem;
  color: #f5d076;
  line-height: 1.7;
  letter-spacing: 0.3px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
  animation: hint-pulse 2s ease-in-out infinite;

  i { margin-right: 6px; color: #ffcc44; font-size: 0.78rem; }
}

@keyframes hint-pulse {
  0%, 100% { box-shadow: 0 0 6px rgba(201, 168, 76, 0.3); border-color: #c9a84c; }
  50%       { box-shadow: 0 0 18px rgba(201, 168, 76, 0.7); border-color: #ffd566; }
}

.hint-fade-enter-active { transition: all 0.4s ease-out; }
.hint-fade-leave-active { transition: all 0.2s ease-in; }
.hint-fade-enter-from   { opacity: 0; transform: translateY(-6px); }
.hint-fade-leave-to     { opacity: 0; }

// ══ 系统旁白 ══════════════════════════════════════════
.system-comment {
  background: rgba(10, 5, 5, 0.7);
  border: 1px solid rgba(150, 60, 60, 0.4);
  border-left: 3px solid #bc6f6f;
  border-radius: 0 16px 16px 0;
  padding: 10px 14px;
  font-size: 0.8rem;
  color: #9a6464;
  font-style: italic;
  line-height: 1.7;
  letter-spacing: 0.3px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;

  i { margin-right: 6px; color: #7a4a4a; font-size: 0.75rem; }
}

// ══ 真心值变动浮动提示 ════════════════════════════════
.heart-delta-toast {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 500;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  pointer-events: none;

  &.positive {
    background: rgba(80, 30, 30, 0.9);
    border: 1px solid #bc6f6f;
    color: #ffaeae;
  }
  &.negative {
    background: rgba(20, 20, 40, 0.9);
    border: 1px solid #6f6fbc;
    color: #aeaeff;
  }
}

// ══ 过渡动画 ══════════════════════════════════════════
.shock-enter-active, .shock-leave-active { transition: opacity 0.1s; }
.shock-enter-from, .shock-leave-to       { opacity: 0; }

.panel-fade-enter-active, .panel-fade-leave-active { transition: opacity 0.2s; }
.panel-fade-enter-from, .panel-fade-leave-to       { opacity: 0; }

.delta-pop-enter-active { transition: all 0.25s ease-out; }
.delta-pop-leave-active { transition: all 0.3s ease-in; }
.delta-pop-enter-from   { transform: translateX(24px); opacity: 0; }
.delta-pop-leave-to     { transform: translateX(24px); opacity: 0; }

// ══ 小屏适配 ══════════════════════════════════════════
@media (max-width: 380px) {
  .character-card { padding: 6px 4px; }
  .char-name { font-size: 0.88rem; }
  .char-percent { font-size: 0.78rem; }
  .char-money { font-size: 0.82rem; }
  .location-btn { padding: 10px 6px; font-size: 0.82rem; }
  .day-badge, .time-badge { padding: 6px 14px; font-size: 1rem; }
}

// ══ 成就 Toast ════════════════════════════════════════
.ach-toast {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  background: rgba(10,8,2,0.92); border: 1px solid #c9a84c; color: #f5d076;
  padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; z-index: 1100;
  display: flex; align-items: center; gap: 8px; white-space: nowrap;
}
.ach-toast-icon { font-size: 1.1rem; }
.ach-pop-enter-active, .ach-pop-leave-active { transition: all 0.4s ease; }
.ach-pop-enter-from { opacity: 0; transform: translateX(-50%) translateY(20px); }
.ach-pop-leave-to   { opacity: 0; transform: translateX(-50%) translateY(-10px); }

// ══ 成就面板 ══════════════════════════════════════════
.ach-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  z-index: 850; display: flex; align-items: center; justify-content: center;
}
.ach-panel { width: min(420px, 92vw); max-height: 80vh; overflow-y: auto; padding: 24px; }
.ach-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px; color: #c9a84c; font-size: 1rem;
}
.ach-list { display: flex; flex-direction: column; gap: 10px; }
.ach-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 14px;
  background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.25);
  border-radius: 10px;
}
.ach-item.locked { opacity: 0.45; filter: grayscale(0.6); }
.ach-icon { font-size: 1.4rem; min-width: 28px; text-align: center; color: #c9a84c; }
.ach-name { color: #f5d076; font-size: 0.9rem; }
.ach-desc { color: #888; font-size: 0.78rem; margin-top: 2px; }

/* ── 关系日记 ─────────────────────────────── */
.diary-panel { width: min(420px, 92vw); max-height: 82vh; overflow-y: auto; padding: 24px; }
.diary-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
.diary-tab {
  flex: 1; padding: 6px 0; border-radius: 20px; text-align: center;
  font-size: 0.85rem; color: #888; cursor: pointer;
  border: 1px solid rgba(201,168,76,0.2); transition: all 0.15s;
  &.active { background: rgba(201,168,76,0.15); color: #f5d076; border-color: #c9a84c; }
}
.diary-count {
  font-size: 0.72rem; background: rgba(201,168,76,0.2);
  border-radius: 10px; padding: 0 5px; margin-left: 4px;
}
.diary-list { display: flex; flex-direction: column; gap: 14px; }
.diary-entry {
  padding: 12px 14px;
  background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.18);
  border-radius: 12px;
}
.diary-date { font-size: 0.75rem; color: #c9a84c; margin-bottom: 6px; letter-spacing: 1px; }
.diary-narrative {
  font-size: 0.88rem; color: #f0e8d0; line-height: 1.6;
  font-style: italic; margin-bottom: 6px;
}
.diary-comment { font-size: 0.78rem; color: #888; line-height: 1.5; }
.diary-empty { text-align: center; color: #555; padding: 32px 0; font-size: 0.9rem;
  i { margin-right: 8px; } }
</style>
