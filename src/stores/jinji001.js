import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

const SAVE_KEY = 'jinji001_saves'
const SLOT_COUNT = 3
const ACH_KEY = 'jinji001_achievements'

function loadRawSaves() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : Array(SLOT_COUNT).fill(null)
  } catch { return Array(SLOT_COUNT).fill(null) }
}

function loadAchievements() {
  try { return JSON.parse(localStorage.getItem(ACH_KEY)) || {} }
  catch { return {} }
}

export const useJinji001Store = defineStore('jinji001', () => {

  // ── 存档槽 ────────────────────────────────────────────
  const saveSlots = ref(loadRawSaves())

  // ── 游戏状态 ──────────────────────────────────────────
  const gameStarted = ref(false)
  const gameOver = ref(false)         // 30天结束
  const gameOverType = ref('')        // 'success' | 'fail'
  const successTarget = ref('')       // 攻略成功的角色id

  // ── 时间系统 ──────────────────────────────────────────
  // day: 1~30，period: 'morning' | 'afternoon' | 'night'
  const day = ref(1)
  const period = ref('morning')

  const periodLabel = computed(() => ({
    morning: '上午', afternoon: '下午', night: '晚上'
  }[period.value]))

  const PERIOD_ORDER = ['morning', 'afternoon', 'night']

  function nextPeriod() {
    const idx = PERIOD_ORDER.indexOf(period.value)
    if (idx < 2) {
      period.value = PERIOD_ORDER[idx + 1]
    } else {
      if (day.value >= 30) {
        triggerGameOver()
      } else {
        day.value++
        period.value = 'morning'
      }
    }
  }

  // ── 当前地点 ──────────────────────────────────────────
  const currentLocation = ref('home')   // home / bar / school / studio / mall / other

  // ── 三人真心值 & 消费 ─────────────────────────────────
  const hearts = reactive({ guyan: 0, shenmo: 0, luoyu: 0 })
  const spending = reactive({ guyan: 0, shenmo: 0, luoyu: 0 })

  // ── 访问追踪 ──────────────────────────────────────────
  // visitCount: 累计访问次数（每个角色地点）
  // visitCountByPhase: 按阶段分开计数，用于场景选择
  // streakCount: 连续回合访问同一角色次数
  // lastVisitedChar: 上一回合访问的角色id
  const visitCount   = reactive({ guyan: 0, shenmo: 0, luoyu: 0 })
  const visitCountByPhase = reactive({
    guyan:  { 1: 0, 2: 0, 3: 0 },
    shenmo: { 1: 0, 2: 0, 3: 0 },
    luoyu:  { 1: 0, 2: 0, 3: 0 },
  })
  const streakCount  = reactive({ guyan: 0, shenmo: 0, luoyu: 0 })
  const lastVisitedChar = ref(null)

  // 记录一次角色访问，更新连续访问数
  function recordVisit(charId, phase) {
    if (!charId || !(charId in visitCount)) return
    visitCount[charId]++
    if (phase && visitCountByPhase[charId]) {
      visitCountByPhase[charId][phase] = (visitCountByPhase[charId][phase] || 0) + 1
    }
    if (lastVisitedChar.value === charId) {
      streakCount[charId]++
    } else {
      Object.keys(streakCount).forEach(k => { if (k !== charId) streakCount[k] = 0 })
      streakCount[charId] = 1
    }
    lastVisitedChar.value = charId
  }

  // ── 真心值触发引擎 ────────────────────────────────────
  // 在角色场景选择完成后调用，基于访问规律给出额外微量变化
  // 返回本次额外变化量（用于UI提示）
  function evalHeartTrigger(charId) {
    if (!charId || !(charId in hearts)) return 0
    let delta = 0
    const v = visitCount[charId]
    const s = streakCount[charId]

    // 里程碑：第3/7/12次访问（各触发一次）
    if (v === 3  && !hasFlag(`${charId}_v3`))  { setFlag(`${charId}_v3`);  delta += 0.5 }
    if (v === 7  && !hasFlag(`${charId}_v7`))  { setFlag(`${charId}_v7`);  delta += 1   }
    if (v === 12 && !hasFlag(`${charId}_v12`)) { setFlag(`${charId}_v12`); delta += 1.5 }

    // 连续访问奖励：连续3回合访问同一人（每天仅一次）
    const streakKey = `streak3_${charId}_d${day.value}`
    if (s >= 3 && !hasFlag(streakKey)) { setFlag(streakKey); delta += 0.5 }

    // 随机波动：小概率轻微下降 / 偶尔额外上升
    const r = Math.random()
    if      (r < 0.06 && hearts[charId] > 1) delta -= 0.5
    else if (r > 0.90)                        delta += 0.5

    if (delta !== 0) changeHeart(charId, delta)
    return delta
  }

  // ── 系统旁白 ──────────────────────────────────────────
  const systemComment = ref('')
  function setSystemComment(text) { systemComment.value = text }
  function clearSystemComment()   { systemComment.value = '' }

  // ── 真心值变化（带上下限 0~100） ──────────────────────
  function changeHeart(target, delta) {
    if (!(target in hearts)) return
    hearts[target] = Math.min(100, Math.max(0, hearts[target] + delta))
    if (hearts[target] >= 100) triggerSuccess(target)
  }

  function addSpending(target, amount) {
    if (target in spending) spending[target] += amount
  }

  // ── 人设状态 ──────────────────────────────────────────
  // personaOk: 当前是否维持人设（每次选项后判断）
  const personaOk = ref(true)

  // 电击惩罚状态
  const shockActive = ref(false)
  const shockMessage = ref('')        // 被强制替换的话
  const shockOriginal = ref('')       // 原本想说的话（被划掉）

  function triggerShock(original, forced) {
    shockCount.value++
    if (shockCount.value >= 5) unlockAchievement('shock_5')
    shockOriginal.value = original
    shockMessage.value = forced
    shockActive.value = true
  }

  function clearShock() {
    shockActive.value = false
    shockOriginal.value = ''
    shockMessage.value = ''
  }

  // ── 成就系统（跨局持久化） ────────────────────────────
  const achievements = reactive(loadAchievements())
  const shockCount = ref(0)           // 本局电击次数

  // ── 关系日记（随存档保存，新游戏重置） ─────────────────
  const diary = reactive({ guyan: [], shenmo: [], luoyu: [] })
  // entry: { day, period, narrative, comment }
  function addDiaryEntry(charId, narrative, comment) {
    if (!diary[charId]) return
    const entries = diary[charId]
    if (entries.length >= 20) entries.shift()
    entries.push({ day: day.value, period: period.value, narrative, comment })
  }
  const newAchievement = ref(null)    // 刚解锁的成就id（toast用）

  function unlockAchievement(id) {
    if (achievements[id]) return
    achievements[id] = true
    newAchievement.value = id
    localStorage.setItem(ACH_KEY, JSON.stringify({ ...achievements }))
  }

  function clearNewAchievement() { newAchievement.value = null }

  function checkAchievements() {
    if (hasFlag('guyan_v12') || hasFlag('shenmo_v12') || hasFlag('luoyu_v12'))
      unlockAchievement('visit_12')
    if (hasFlag('guyan_v7') && hasFlag('shenmo_v7') && hasFlag('luoyu_v7'))
      unlockAchievement('all_v7')
    if (hearts.guyan >= 50 || hearts.shenmo >= 50 || hearts.luoyu >= 50)
      unlockAchievement('heart_50')
    const total = spending.guyan + spending.shenmo + spending.luoyu
    if (total >= 100000) unlockAchievement('spend_100k')
    if (spending.shenmo >= 30000) unlockAchievement('spend_shenmo_30k')
    if (Object.values(streakCount).some(v => v >= 5)) unlockAchievement('streak_5')
  }

  // ── 场景/剧情 ─────────────────────────────────────────
  const currentScene = ref('start')
  const flags = reactive({})          // 全局标志位，记录已发生的事件

  function goToScene(id) {
    currentScene.value = id
  }

  function setFlag(key, val = true) {
    flags[key] = val
  }

  function hasFlag(key) {
    return !!flags[key]
  }

  // ── 旁白队列 ──────────────────────────────────────────
  // 每次事件结束后的系统旁白（可多条）
  const narratives = ref([])

  function addNarrative(text) {
    narratives.value.push(text)
  }

  function clearNarratives() {
    narratives.value = []
  }

  // ── 游戏结束 ──────────────────────────────────────────
  function triggerSuccess(target) {
    gameOver.value = true
    gameOverType.value = 'success'
    successTarget.value = target
    unlockAchievement('end_success')
  }

  function triggerGameOver() {
    gameOver.value = true
    // 隐藏结局优先判定（真心值 70~99% + 特定 flag）
    if (hearts.guyan >= 70 && hearts.guyan < 100 && hasFlag('guyan_v12') && hasFlag('guyan_gift_seen')) {
      gameOverType.value = 'hidden'; successTarget.value = 'guyan'
      if (shockCount.value === 0) unlockAchievement('no_shock')
      unlockAchievement('end_hidden_guyan'); return
    }
    if (hearts.shenmo >= 70 && hearts.shenmo < 100 && hasFlag('shenmo_gift_seen') && spending.shenmo >= 30000) {
      gameOverType.value = 'hidden'; successTarget.value = 'shenmo'
      if (shockCount.value === 0) unlockAchievement('no_shock')
      unlockAchievement('end_hidden_shenmo'); return
    }
    if (hearts.luoyu >= 70 && hearts.luoyu < 100 && hasFlag('luoyu_gift_seen') && hasFlag('luoyu_v12')) {
      gameOverType.value = 'hidden'; successTarget.value = 'luoyu'
      if (shockCount.value === 0) unlockAchievement('no_shock')
      unlockAchievement('end_hidden_luoyu'); return
    }
    // 检查是否触发角色专属 Bad End（最高真心值 ≥ 50%）
    const maxHeart = Math.max(hearts.guyan, hearts.shenmo, hearts.luoyu)
    if (maxHeart >= 50) {
      const chars = ['guyan', 'shenmo', 'luoyu']
      const topChar = chars.reduce((a, b) => hearts[a] >= hearts[b] ? a : b)
      gameOverType.value = 'bad'
      successTarget.value = topChar
      if (shockCount.value === 0) unlockAchievement('no_shock')
      unlockAchievement('end_bad')
    } else {
      gameOverType.value = 'fail'
      if (shockCount.value === 0) unlockAchievement('no_shock')
      unlockAchievement('end_fail')
    }
  }

  // ── 快照（存档/读档） ─────────────────────────────────
  function getSnapshot() {
    return {
      updatedAt: new Date().toISOString(),
      day: day.value,
      period: period.value,
      currentLocation: currentLocation.value,
      hearts: { ...hearts },
      spending: { ...spending },
      visitCount: { ...visitCount },
      visitCountByPhase: JSON.parse(JSON.stringify(visitCountByPhase)),
      lastVisitedChar: lastVisitedChar.value,
      currentScene: currentScene.value,
      flags: { ...flags },
      shockCount: shockCount.value,
      diary: JSON.parse(JSON.stringify(diary)),
    }
  }

  function applySnapshot(data) {
    day.value = data.day ?? 1
    period.value = data.period ?? 'morning'
    currentLocation.value = data.currentLocation ?? 'home'
    Object.assign(hearts, data.hearts ?? {})
    Object.assign(spending, data.spending ?? {})
    Object.assign(visitCount, data.visitCount ?? { guyan: 0, shenmo: 0, luoyu: 0 })
    if (data.visitCountByPhase) {
      Object.keys(visitCountByPhase).forEach(char => {
        Object.assign(visitCountByPhase[char], data.visitCountByPhase[char] ?? { 1: 0, 2: 0, 3: 0 })
      })
    }
    Object.assign(streakCount, { guyan: 0, shenmo: 0, luoyu: 0 })
    lastVisitedChar.value = data.lastVisitedChar ?? null
    currentScene.value = data.currentScene ?? 'start'
    Object.keys(flags).forEach(k => delete flags[k])
    Object.assign(flags, data.flags ?? {})
    gameStarted.value = true
    gameOver.value = false
    gameOverType.value = ''
    successTarget.value = ''
    shockActive.value = false
    systemComment.value = ''
    narratives.value = []
    shockCount.value = data.shockCount ?? 0
    if (data.diary) {
      Object.keys(diary).forEach(k => { diary[k] = data.diary[k] ?? [] })
    }
  }

  function saveToSlot(slot) {
    saveSlots.value[slot] = getSnapshot()
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveSlots.value))
  }

  function loadFromSlot(slot) {
    const data = saveSlots.value[slot]
    if (!data) return false
    applySnapshot(data)
    return true
  }

  function deleteSaveSlot(slot) {
    saveSlots.value[slot] = null
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveSlots.value))
  }

  // ── 新游戏 ────────────────────────────────────────────
  function startNewGame() {
    day.value = 1
    period.value = 'morning'
    currentLocation.value = 'home'
    Object.assign(hearts,   { guyan: 0, shenmo: 0, luoyu: 0 })
    Object.assign(spending, { guyan: 0, shenmo: 0, luoyu: 0 })
    Object.assign(visitCount,  { guyan: 0, shenmo: 0, luoyu: 0 })
    Object.keys(visitCountByPhase).forEach(char => {
      Object.assign(visitCountByPhase[char], { 1: 0, 2: 0, 3: 0 })
    })
    Object.assign(streakCount, { guyan: 0, shenmo: 0, luoyu: 0 })
    lastVisitedChar.value = null
    currentScene.value = 'intro'
    Object.keys(flags).forEach(k => delete flags[k])
    gameStarted.value = true
    gameOver.value = false
    gameOverType.value = ''
    successTarget.value = ''
    shockActive.value = false
    narratives.value = []
    systemComment.value = ''
    shockCount.value = 0
    Object.keys(diary).forEach(k => { diary[k] = [] })
  }

  return {
    saveSlots,
    gameStarted, gameOver, gameOverType, successTarget,
    day, period, periodLabel, currentLocation,
    hearts, spending,
    visitCount, visitCountByPhase, streakCount, lastVisitedChar,
    systemComment,
    personaOk, shockActive, shockMessage, shockOriginal,
    currentScene, flags, narratives,
    achievements, shockCount, newAchievement,
    diary, addDiaryEntry,
    unlockAchievement, clearNewAchievement, checkAchievements,
    nextPeriod, changeHeart, addSpending,
    recordVisit, evalHeartTrigger,
    setSystemComment, clearSystemComment,
    triggerShock, clearShock,
    goToScene, setFlag, hasFlag,
    addNarrative, clearNarratives,
    triggerSuccess, triggerGameOver,
    saveToSlot, loadFromSlot, deleteSaveSlot, startNewGame,
  }
})
