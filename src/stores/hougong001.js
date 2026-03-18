import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

const SAVE_KEY = 'hougong001_saves'
const SLOT_COUNT = 3

function loadRawSaves() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : Array(SLOT_COUNT).fill(null)
  } catch { return Array(SLOT_COUNT).fill(null) }
}

export const useHougong001Store = defineStore('hougong001', () => {
  // ── 存档槽 ───────────────────────────────────────────
  const saveSlots = ref(loadRawSaves())

  // ── 玩家信息 ──────────────────────────────────────────
  const playerName = ref('林若')
  const family = ref('翰林学士之女')
  const rank = ref('秀女')
  const money = ref(10)
  const points = ref(0)

  // ── 六维属性 ──────────────────────────────────────────
  const attrs = reactive({
    appearance: 50,    // 容貌
    scheme: 0,         // 心机
    talent: 0,         // 才华
    constitution: 20,  // 体质
    secret: 0,         // 秘术
    favor: 0,          // 宠爱
  })

  // ── 才艺 ─────────────────────────────────────────────
  const skills = reactive({
    dance: 0, qin: 0, calligraphy: 0, painting: 0, needlework: 0,
  })

  // ── NPC 关系 ──────────────────────────────────────────
  const npcRelations = reactive({
    emperor: 0, guiFei: 0, xianFei: 0, chenFei: 0,
    springPeach: 0, ruier: 0, liuMaMa: 0,
  })

  // ── 背包 ─────────────────────────────────────────────
  const inventory = ref([])

  // ── 进度 ─────────────────────────────────────────────
  const currentScene = ref('start')   // 'start' = 未开始
  const currentChapter = ref(1)
  const deathCount = ref(0)
  const flags = reactive({})

  // ── 死亡状态 ──────────────────────────────────────────
  const isDead = ref(false)
  const deathReason = ref('')
  const deathComment = ref('')
  const rebirthScene = ref('c01s01')

  // ── 章节完成 ──────────────────────────────────────────
  const isChapterEnd = ref(false)

  // ── 游戏已开始 ────────────────────────────────────────
  const gameStarted = ref(false)

  // ── computed ──────────────────────────────────────────
  const totalSkill = computed(() =>
    skills.dance + skills.qin + skills.calligraphy + skills.painting + skills.needlework
  )

  const attrList = computed(() => [
    { key: 'appearance',   label: '容貌', value: attrs.appearance,   max: 100 },
    { key: 'scheme',       label: '心机', value: attrs.scheme,       max: 100 },
    { key: 'talent',       label: '才华', value: attrs.talent,       max: 100 },
    { key: 'constitution', label: '体质', value: attrs.constitution, max: 100 },
    { key: 'secret',       label: '秘术', value: attrs.secret,       max: 100 },
    { key: 'favor',        label: '宠爱', value: attrs.favor,        max: 100 },
  ])

  const skillList = computed(() => [
    { key: 'dance',       label: '舞蹈', value: skills.dance },
    { key: 'qin',         label: '琴艺', value: skills.qin },
    { key: 'calligraphy', label: '书法', value: skills.calligraphy },
    { key: 'painting',    label: '画画', value: skills.painting },
    { key: 'needlework',  label: '女工', value: skills.needlework },
  ])

  // ── 效果应用 ──────────────────────────────────────────
  function applyEffect(effect) {
    if (!effect) return
    if (effect.attrs) {
      Object.entries(effect.attrs).forEach(([k, v]) => {
        if (k in attrs) attrs[k] = Math.max(0, attrs[k] + v)
      })
    }
    if (effect.skills) {
      Object.entries(effect.skills).forEach(([k, v]) => {
        if (k in skills) skills[k] = Math.max(0, skills[k] + v)
      })
    }
    if (typeof effect.money === 'number') money.value = Math.max(0, money.value + effect.money)
    if (typeof effect.points === 'number') points.value = Math.max(0, points.value + effect.points)
    if (effect.npc) {
      Object.entries(effect.npc).forEach(([k, v]) => {
        if (k in npcRelations) npcRelations[k] += v
      })
    }
    if (effect.flags) Object.assign(flags, effect.flags)
  }

  // ── 道具消耗 ──────────────────────────────────────────
  function consumeItem(itemId) {
    const idx = inventory.value.findIndex(i => i.id === itemId)
    if (idx === -1) return false
    inventory.value[idx].count--
    if (inventory.value[idx].count <= 0) inventory.value.splice(idx, 1)
    return true
  }

  function hasItem(itemId) {
    return inventory.value.some(i => i.id === itemId && i.count > 0)
  }

  // ── 商城 ─────────────────────────────────────────────
  function buyItem(item) {
    if (points.value < item.cost) return false
    points.value -= item.cost
    if (item.category === 'attr') applyEffect({ attrs: item.effect })
    else if (item.category === 'skill') applyEffect({ skills: item.effect })
    else {
      const ex = inventory.value.find(i => i.id === item.id)
      if (ex) ex.count++
      else inventory.value.push({ ...item, count: 1 })
    }
    return true
  }

  // ── 死亡 / 重生 ───────────────────────────────────────
  function triggerDeath(reason, comment, backTo) {
    isDead.value = true
    deathReason.value = reason
    deathComment.value = comment
    rebirthScene.value = backTo || 'c01s01'
    deathCount.value++
  }

  function rebirth() {
    isDead.value = false
    deathReason.value = ''
    deathComment.value = ''
    currentScene.value = rebirthScene.value
  }

  function goToScene(id) { currentScene.value = id }

  // ── 存档 ─────────────────────────────────────────────
  function getSnapshot() {
    return {
      updatedAt: new Date().toISOString(),
      chapter: currentChapter.value,
      rank: rank.value,
      playerName: playerName.value, family: family.value,
      money: money.value, points: points.value,
      attrs: { ...attrs }, skills: { ...skills },
      npcRelations: { ...npcRelations },
      inventory: JSON.parse(JSON.stringify(inventory.value)),
      currentScene: currentScene.value,
      currentChapter: currentChapter.value,
      deathCount: deathCount.value,
      flags: { ...flags },
    }
  }

  function applySnapshot(data) {
    playerName.value = data.playerName ?? '林若'
    family.value = data.family ?? '翰林学士之女'
    rank.value = data.rank ?? '秀女'
    money.value = data.money ?? 10
    points.value = data.points ?? 0
    Object.assign(attrs, data.attrs ?? {})
    Object.assign(skills, data.skills ?? {})
    Object.assign(npcRelations, data.npcRelations ?? {})
    inventory.value = data.inventory ?? []
    currentScene.value = data.currentScene ?? 'c01s01'
    currentChapter.value = data.currentChapter ?? 1
    deathCount.value = data.deathCount ?? 0
    Object.keys(flags).forEach(k => delete flags[k])
    Object.assign(flags, data.flags ?? {})
    isDead.value = false
    isChapterEnd.value = false
    gameStarted.value = true
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

  function startNewGame() {
    playerName.value = '林若'
    family.value = '翰林学士之女'
    rank.value = '秀女'
    money.value = 10
    points.value = 0
    Object.assign(attrs, { appearance: 50, scheme: 0, talent: 0, constitution: 20, secret: 0, favor: 0 })
    Object.assign(skills, { dance: 0, qin: 0, calligraphy: 0, painting: 0, needlework: 0 })
    Object.assign(npcRelations, { emperor: 0, guiFei: 0, xianFei: 0, chenFei: 0, springPeach: 0, ruier: 0, liuMaMa: 0 })
    inventory.value = []
    currentScene.value = 'c01s01'
    currentChapter.value = 1
    deathCount.value = 0
    isDead.value = false
    deathReason.value = ''
    deathComment.value = ''
    rebirthScene.value = 'c01s01'
    isChapterEnd.value = false
    gameStarted.value = true
    Object.keys(flags).forEach(k => delete flags[k])
  }

  return {
    saveSlots, playerName, family, rank, money, points,
    attrs, skills, npcRelations, inventory,
    currentScene, currentChapter, deathCount, flags,
    isDead, deathReason, deathComment, rebirthScene,
    isChapterEnd, gameStarted,
    totalSkill, attrList, skillList,
    applyEffect, buyItem, consumeItem, hasItem,
    triggerDeath, rebirth, goToScene,
    saveToSlot, loadFromSlot, deleteSaveSlot, startNewGame,
  }
})
