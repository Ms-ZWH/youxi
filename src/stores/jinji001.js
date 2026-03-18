import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

const SAVE_KEY = 'jinji001_saves'
const SLOT_COUNT = 3

function loadRawSaves() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : Array(SLOT_COUNT).fill(null)
  } catch { return Array(SLOT_COUNT).fill(null) }
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
  const hearts = reactive({
    guyan: 0,    // 顾衍
    shenmo: 0,   // 沈默
    luoyu: 0,    // 洛屿
  })

  const spending = reactive({
    guyan: 0,
    shenmo: 0,
    luoyu: 0,
  })

  // 真心值变化（带上下限 0~100）
  function changeHeart(target, delta) {
    hearts[target] = Math.min(100, Math.max(0, hearts[target] + delta))
    if (hearts[target] >= 100) {
      triggerSuccess(target)
    }
  }

  function addSpending(target, amount) {
    spending[target] += amount
  }

  // ── 人设状态 ──────────────────────────────────────────
  // personaOk: 当前是否维持人设（每次选项后判断）
  const personaOk = ref(true)

  // 电击惩罚状态
  const shockActive = ref(false)
  const shockMessage = ref('')        // 被强制替换的话
  const shockOriginal = ref('')       // 原本想说的话（被划掉）

  function triggerShock(original, forced) {
    shockOriginal.value = original
    shockMessage.value = forced
    shockActive.value = true
  }

  function clearShock() {
    shockActive.value = false
    shockOriginal.value = ''
    shockMessage.value = ''
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
  }

  function triggerGameOver() {
    gameOver.value = true
    gameOverType.value = 'fail'
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
      currentScene: currentScene.value,
      flags: { ...flags },
    }
  }

  function applySnapshot(data) {
    day.value = data.day ?? 1
    period.value = data.period ?? 'morning'
    currentLocation.value = data.currentLocation ?? 'home'
    Object.assign(hearts, data.hearts ?? {})
    Object.assign(spending, data.spending ?? {})
    currentScene.value = data.currentScene ?? 'start'
    Object.keys(flags).forEach(k => delete flags[k])
    Object.assign(flags, data.flags ?? {})
    gameStarted.value = true
    gameOver.value = false
    gameOverType.value = ''
    successTarget.value = ''
    shockActive.value = false
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
    Object.assign(hearts, { guyan: 0, shenmo: 0, luoyu: 0 })
    Object.assign(spending, { guyan: 0, shenmo: 0, luoyu: 0 })
    currentScene.value = 'intro'
    Object.keys(flags).forEach(k => delete flags[k])
    gameStarted.value = true
    gameOver.value = false
    gameOverType.value = ''
    successTarget.value = ''
    shockActive.value = false
    narratives.value = []
  }

  return {
    saveSlots,
    gameStarted, gameOver, gameOverType, successTarget,
    day, period, periodLabel, currentLocation,
    hearts, spending,
    personaOk, shockActive, shockMessage, shockOriginal,
    currentScene, flags, narratives,
    nextPeriod, changeHeart, addSpending,
    triggerShock, clearShock,
    goToScene, setFlag, hasFlag,
    addNarrative, clearNarratives,
    triggerSuccess, triggerGameOver,
    saveToSlot, loadFromSlot, deleteSaveSlot, startNewGame,
  }
})
