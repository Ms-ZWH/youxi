<template>
  <div class="save-slots-modal" v-if="visible" @click.self="$emit('close')">
    <div class="modal-box glass-card">
      <div class="modal-header">
        <h3>{{ mode === 'load' ? '读取存档' : '选择存档槽' }}</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="slots-list">
        <div
          v-for="(save, index) in saves"
          :key="index"
          class="slot-item"
          :class="{ 'has-save': save, 'is-active': activeSlot === index }"
          @click="handleSlotClick(index, save)"
        >
          <div class="slot-index">存档 {{ index + 1 }}</div>

          <div v-if="save" class="slot-info">
            <div class="slot-game-name">{{ save.gameName }}</div>
            <div class="slot-meta">
              第 {{ save.chapter }} 章 · {{ formatDate(save.updatedAt) }}
            </div>
          </div>
          <div v-else class="slot-empty">空存档槽</div>

          <div v-if="save && mode === 'manage'" class="slot-actions">
            <button class="slot-btn delete" @click.stop="handleDelete(index)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  visible: Boolean,
  mode: {
    type: String,
    default: 'load' // 'load' | 'save' | 'manage'
  },
  gameId: String,
  gameName: String
})
const emit = defineEmits(['close', 'loaded', 'saved'])

const gameStore = useGameStore()
const { saves, activeSlot } = storeToRefs(gameStore)

function handleSlotClick(index, save) {
  if (props.mode === 'load') {
    if (!save) return
    gameStore.loadGame(index)
    emit('loaded', index)
    emit('close')
  } else if (props.mode === 'save') {
    gameStore.saveGame(index)
    emit('saved', index)
    emit('close')
  } else if (props.mode === 'new') {
    gameStore.startGame(props.gameId, props.gameName, index)
    emit('loaded', index)
    emit('close')
  }
}

function handleDelete(index) {
  if (confirm('确定删除此存档吗？')) {
    gameStore.deleteSave(index)
  }
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
</script>

<style lang="scss" scoped>
.save-slots-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  width: 420px;
  padding: 28px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h3 {
    font-size: 18px;
    font-family: var(--font-title);
    color: var(--color-primary);
    letter-spacing: 2px;
  }
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #fff; }
}

.slots-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slot-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: var(--color-primary);
    background: rgba(255,255,255,0.06);
  }

  &.is-active {
    border-color: var(--color-primary);
    background: rgba(255,255,255,0.05);
  }

  &:not(.has-save) {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border-color: rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.03);
    }
  }
}

.slot-index {
  font-size: 12px;
  color: var(--color-primary);
  min-width: 44px;
  text-align: center;
  background: rgba(255,255,255,0.06);
  padding: 4px 8px;
  border-radius: 6px;
}

.slot-game-name {
  font-size: 14px;
  color: var(--color-text);
  margin-bottom: 4px;
}

.slot-meta {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
}

.slot-empty {
  font-size: 13px;
  color: rgba(255,255,255,0.25);
}

.slot-actions {
  margin-left: auto;
}

.slot-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  cursor: pointer;

  &.delete {
    background: rgba(231,76,60,0.2);
    color: #e74c3c;
    border: 1px solid rgba(231,76,60,0.3);
    &:hover { background: rgba(231,76,60,0.4); }
  }
}
</style>
