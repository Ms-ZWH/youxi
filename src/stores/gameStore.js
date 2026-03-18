import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const SAVE_KEY = 'youxi_saves'
const MAX_SLOTS = 3

const defaultSave = () => ({
  id: null,
  gameId: null,
  gameName: '',
  chapter: 1,
  scene: 0,
  variables: {},
  choices: [],
  unlockedEndings: [],
  playTime: 0,
  createdAt: null,
  updatedAt: null
})

export const useGameStore = defineStore('game', () => {
  // 存档槽位 (3个)
  const saves = ref(loadSaves())
  // 当前激活存档槽位索引 (0/1/2)
  const activeSlot = ref(null)
  // 当前游戏运行时状态
  const currentSave = ref(null)

  const activeSave = computed(() =>
    activeSlot.value !== null ? saves.value[activeSlot.value] : null
  )

  function loadSaves() {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return Array(MAX_SLOTS).fill(null)
      return JSON.parse(raw)
    } catch {
      return Array(MAX_SLOTS).fill(null)
    }
  }

  function persistSaves() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saves.value))
  }

  function startGame(gameId, gameName, slotIndex = 0) {
    const save = {
      ...defaultSave(),
      id: `${gameId}_${Date.now()}`,
      gameId,
      gameName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saves.value[slotIndex] = save
    activeSlot.value = slotIndex
    currentSave.value = { ...save }
    persistSaves()
  }

  function loadGame(slotIndex) {
    const save = saves.value[slotIndex]
    if (!save) return false
    activeSlot.value = slotIndex
    currentSave.value = { ...save }
    return true
  }

  function saveGame(slotIndex = activeSlot.value) {
    if (slotIndex === null || !currentSave.value) return
    currentSave.value.updatedAt = new Date().toISOString()
    saves.value[slotIndex] = { ...currentSave.value }
    persistSaves()
  }

  function deleteSave(slotIndex) {
    saves.value[slotIndex] = null
    if (activeSlot.value === slotIndex) {
      activeSlot.value = null
      currentSave.value = null
    }
    persistSaves()
  }

  function setVariable(key, value) {
    if (!currentSave.value) return
    currentSave.value.variables[key] = value
  }

  function getVariable(key, defaultValue = null) {
    return currentSave.value?.variables[key] ?? defaultValue
  }

  function recordChoice(sceneId, choiceIndex) {
    if (!currentSave.value) return
    currentSave.value.choices.push({ sceneId, choiceIndex, at: Date.now() })
  }

  function nextScene() {
    if (!currentSave.value) return
    currentSave.value.scene++
  }

  function nextChapter() {
    if (!currentSave.value) return
    currentSave.value.chapter++
    currentSave.value.scene = 0
  }

  function unlockEnding(endingId) {
    if (!currentSave.value) return
    if (!currentSave.value.unlockedEndings.includes(endingId)) {
      currentSave.value.unlockedEndings.push(endingId)
    }
  }

  return {
    saves, activeSlot, currentSave, activeSave,
    startGame, loadGame, saveGame, deleteSave,
    setVariable, getVariable, recordChoice,
    nextScene, nextChapter, unlockEnding
  }
})
