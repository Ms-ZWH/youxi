<template>
  <div class="save-overlay" @click.self="$emit('close')">
    <div class="save-modal">
      <div class="modal-header">
        <h3>{{ mode === 'load' ? '📖 读取存档' : '💾 保存存档' }}</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="slots-list">
        <div
          v-for="(slot, i) in store.saveSlots"
          :key="i"
          class="slot-item"
          :class="{ 'has-save': !!slot }"
          @click="handleSlot(i, slot)"
        >
          <div class="slot-index">存档 {{ i + 1 }}</div>
          <div v-if="slot" class="slot-info">
            <div class="slot-main">{{ slot.rank }} · 第{{ slot.chapter }}章</div>
            <div class="slot-meta">积分 {{ slot.points }} · {{ formatDate(slot.updatedAt) }}</div>
          </div>
          <div v-else class="slot-empty">— 空存档槽 —</div>
          <button
            v-if="slot && mode === 'save'"
            class="delete-btn"
            @click.stop="store.deleteSaveSlot(i)"
          >删除</button>
        </div>
      </div>

      <transition name="toast">
        <div v-if="toast" class="save-toast">{{ toast }}</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHougong001Store } from '@/stores/hougong001'

const props = defineProps({
  mode: { type: String, default: 'save' }, // 'save' | 'load'
})
const emit = defineEmits(['close'])
const store = useHougong001Store()
const toast = ref('')

function handleSlot(i, slot) {
  if (props.mode === 'save') {
    store.saveToSlot(i)
    showToast('✓ 存档成功')
    setTimeout(() => emit('close'), 1000)
  } else {
    if (!slot) return
    store.loadFromSlot(i)
    emit('close')
  }
}

function showToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 1800)
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
</script>

<style lang="scss" scoped>
/* ── 遮罩层 ──────────────────────────────────────────── */
.save-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 2, 0.6);
  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  padding: 20px;
}

/* ── 弹窗主容器（palace-card 风格）──────────────────── */
.save-modal {
  width: 100%;
  max-width: 420px;
  background: rgba(12, 8, 5, 0.92);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(200, 160, 100, 0.35);
  border-radius: 48px;
  box-shadow: 0 30px 50px -20px black, 0 0 0 1px rgba(200,160,100,0.15) inset;
  padding: 28px 22px 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* 暗花底纹 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" opacity="0.06"><path d="M30 40 Q 50 20 70 40 T 110 40" stroke="%23d4b078" fill="none" stroke-width="0.8"/><circle cx="50" cy="65" r="3" fill="%23d4b078" opacity="0.3"/><circle cx="80" cy="65" r="3" fill="%23d4b078" opacity="0.3"/><path d="M40 95 Q 60 80 80 95" stroke="%23b29060" fill="none" stroke-width="1"/></svg>');
    background-repeat: repeat;
    background-size: 110px 110px;
    pointer-events: none;
    z-index: 0;
    border-radius: 48px;
  }
}

/* ── 头部 ────────────────────────────────────────────── */
.modal-header {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(200, 165, 110, 0.35);
  padding-bottom: 14px;

  h3 {
    font-family: 'Playfair Display', 'Noto Serif SC', 'STSong', serif;
    font-size: 26px;
    font-weight: 900;
    background: linear-gradient(180deg, #fbebcf 0%, #d4b17c 70%, #b38946 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 2px;
    line-height: 1;
  }
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #b38f5a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #d4b17c;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);

  &:hover {
    background: #5a3e28;
    color: #fbeaca;
    border-color: #eac384;
  }
}

/* ── 存档槽列表 ───────────────────────────────────────── */
.slots-list {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 完全沿用 intro 页存档槽样式 */
.slot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(180, 140, 80, 0.25);
  background: rgba(0, 0, 0, 0.3);
  transition: border-color 0.15s, background 0.15s;
  cursor: pointer;

  &.has-save:hover {
    border-color: rgba(220, 180, 100, 0.55);
    background: rgba(160, 110, 40, 0.12);
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

/* 删除按钮 */
.delete-btn {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(180, 100, 80, 0.4);
  color: rgba(200, 100, 80, 0.8);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba(180, 80, 60, 0.25);
    color: #e88;
    border-color: rgba(200, 100, 80, 0.7);
  }
}

/* ── 底部铭文风格（可选，和 intro 对齐） */
// 无额外内容，gap 已经处理间距

/* ── Toast 提示 ──────────────────────────────────────── */
.save-toast {
  position: fixed;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 12, 8, 0.95);
  border: 1px solid rgba(210, 175, 110, 0.5);
  color: #fadcad;
  padding: 10px 24px;
  border-radius: 40px;
  font-size: 14px;
  pointer-events: none;
  z-index: 200;
  box-shadow: 0 8px 20px rgba(0,0,0,0.6);
  white-space: nowrap;
}

.toast-enter-active, .toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
