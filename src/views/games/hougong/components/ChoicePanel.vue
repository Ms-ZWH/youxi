<template>
  <div class="choice-overlay" @click.self="$emit('close')">
    <div class="choice-modal">
      <button class="modal-close" @click="$emit('close')" title="关闭">✕</button>
      <div class="modal-header">— 你的选择 —</div>
      <div class="choices-grid">
        <button
          v-for="choice in choices"
          :key="choice.id"
          class="choice-btn"
          :class="{
            'is-dangerous': choice.isDangerous,
            'is-disabled': disabled,
          }"
          :disabled="disabled"
          @click="handleClick(choice)"
        >
          <!-- 序号 -->
          <span class="choice-label-tag">{{ choice.label }}</span>

          <!-- 文字 -->
          <div class="choice-content">
            <span class="choice-text">{{ choice.text }}</span>

            <!-- 属性条件提示 -->
            <span
              v-if="choice.conditionHint && !choice.conditionItem"
              class="condition-hint"
              :class="{ 'met': checkCondition(choice), 'unmet': !checkCondition(choice) }"
            >
              {{ checkCondition(choice) ? '✓' : '✗' }} {{ choice.conditionHint }}
            </span>
            <!-- 道具条件提示 -->
            <span
              v-if="choice.conditionItem"
              class="condition-hint"
              :class="{ 'met': checkItemCondition(choice), 'unmet': !checkItemCondition(choice) }"
            >
              {{ checkItemCondition(choice) ? '✓ 已备' : '✗ 未备' }} {{ choice.conditionHint }}
            </span>

            <!-- 危险提示（移动端常显） -->
            <span v-if="choice.isDangerous" class="danger-hint-inline">
              ⚠ {{ choice.dangerHint }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHougong001Store } from '@/stores/hougong001'

const props = defineProps({
  choices: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['choose', 'close'])

const store = useHougong001Store()

function checkCondition(choice) {
  if (!choice.condition) return true
  const { attr, min } = choice.condition
  return store.attrs[attr] >= min
}

function checkItemCondition(choice) {
  if (!choice.conditionItem) return true
  return store.hasItem(choice.conditionItem)
}

function handleClick(choice) {
  if (props.disabled) return
  emit('choose', choice)
}
</script>

<style lang="scss" scoped>
/* 遮罩层 */
.choice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 0 16px;
}

/* 弹框主体 */
.choice-modal {
  width: 100%;
  max-width: 380px;
  background: rgba(12, 8, 5, 0.96);
  border: 1px solid rgba(200, 160, 110, 0.5);
  border-radius: 28px;
  padding: 22px 16px 20px;
  box-shadow: 0 20px 50px -10px rgba(0,0,0,0.9), inset 0 0 20px rgba(160,110,50,0.1);
  position: relative;
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(200, 160, 100, 0.12);
  border: 1px solid rgba(200, 160, 100, 0.3);
  color: rgba(200, 160, 100, 0.7);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: rgba(200, 160, 100, 0.25);
    color: #fadcad;
  }
}

.modal-header {
  font-size: 12px;
  color: rgba(200, 160, 100, 0.6);
  letter-spacing: 4px;
  text-align: center;
  margin-bottom: 14px;
}

.choices-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choice-btn {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 14px;
  background: rgba(200, 160, 100, 0.07);
  border: 1px solid rgba(200, 160, 100, 0.28);
  border-radius: 18px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;

  &:active:not(:disabled) {
    background: rgba(200, 160, 100, 0.18);
    border-color: rgba(200, 160, 100, 0.65);
    transform: scale(0.98);
  }

  &:hover:not(:disabled) {
    background: rgba(200, 160, 100, 0.14);
    border-color: rgba(200, 160, 100, 0.5);
  }

  &.is-dangerous {
    border-color: rgba(192, 57, 43, 0.4);
    background: rgba(192, 57, 43, 0.06);

    &:hover:not(:disabled), &:active:not(:disabled) {
      border-color: rgba(192, 57, 43, 0.7);
      background: rgba(192, 57, 43, 0.14);
    }
  }

  &.is-disabled, &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
}

.choice-label-tag {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(200, 160, 100, 0.2);
  border: 1px solid rgba(200, 160, 100, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fadcad;
  font-weight: bold;
  margin-top: 1px;
}

.choice-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.choice-text {
  font-size: 14px;
  color: #e8d3bb;
  font-family: 'Noto Serif SC', 'STSong', serif;
  line-height: 1.6;
}

.condition-hint {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  align-self: flex-start;

  &.met {
    color: #7dcea0;
    background: rgba(39, 174, 96, 0.1);
    border: 1px solid rgba(39, 174, 96, 0.3);
  }
  &.unmet {
    color: #e88;
    background: rgba(192, 57, 43, 0.1);
    border: 1px solid rgba(192, 57, 43, 0.3);
  }
}

.danger-hint-inline {
  font-size: 11px;
  color: rgba(231, 76, 60, 0.75);
  letter-spacing: 0.5px;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
