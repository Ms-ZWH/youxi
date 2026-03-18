<template>
  <transition name="rebirth">
    <div v-if="visible" class="rebirth-overlay">
      <div class="rebirth-box">
        <!-- 死亡标题 -->
        <div class="death-title">
          <span class="skull">💀</span>
          <h2>你死了</h2>
          <span class="skull">💀</span>
        </div>

        <!-- 死亡原因 -->
        <div class="death-reason">
          <p class="reason-label">死亡原因</p>
          <p class="reason-text">{{ reason }}</p>
        </div>

        <!-- 系统吐槽 -->
        <div class="system-comment">
          <span class="sys-tag">系统评价</span>
          <p class="sys-text">{{ comment }}</p>
        </div>

        <!-- 弹幕展示 -->
        <div v-if="danmaku.length" class="death-danmaku">
          <div v-for="(d, i) in danmaku" :key="i" class="death-dm-item">
            <span class="dm-user">{{ d.user }}：</span>{{ d.text }}
          </div>
        </div>

        <!-- 保留属性 -->
        <div class="preserved">
          <p class="preserved-title">✓ 已保留属性</p>
          <div class="attr-tags">
            <span v-for="a in attrTags" :key="a.label" class="attr-tag">
              {{ a.label }} {{ a.value }}
            </span>
            <span class="attr-tag gold">积分 {{ store.points }}</span>
          </div>
        </div>

        <!-- 倒计时 / 按钮 -->
        <button class="rebirth-btn" @click="handleRebirth">
          ↺ 重新来过
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useHougong001Store } from '@/stores/hougong001'

const props = defineProps({
  visible: Boolean,
  reason: { type: String, default: '' },
  comment: { type: String, default: '' },
  danmaku: { type: Array, default: () => [] },
})
const emit = defineEmits(['rebirth'])

const store = useHougong001Store()

const attrTags = computed(() => [
  { label: '容貌', value: store.attrs.appearance },
  { label: '心机', value: store.attrs.scheme },
  { label: '才华', value: store.attrs.talent },
  { label: '体质', value: store.attrs.constitution },
])

function handleRebirth() {
  store.rebirth()
  emit('rebirth')
}
</script>

<style lang="scss" scoped>
.rebirth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.rebirth-box {
  width: 480px;
  max-width: 90vw;
  background: linear-gradient(160deg, #0a0000 0%, #1a0505 100%);
  border: 1px solid rgba(192, 57, 43, 0.5);
  border-radius: 20px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

.death-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  h2 {
    font-family: var(--font-title);
    font-size: 28px;
    color: #c0392b;
    letter-spacing: 6px;
  }
}
.skull {
  font-size: 28px;
  animation: skullPulse 1.5s ease-in-out infinite;
}

.death-reason {
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.2);
  border-radius: 12px;
  padding: 14px 18px;
}
.reason-label {
  font-size: 11px;
  color: rgba(192, 57, 43, 0.6);
  letter-spacing: 3px;
  margin-bottom: 8px;
}
.reason-text {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  font-family: var(--font-title);
  line-height: 1.7;
}

.system-comment {
  position: relative;
  padding: 14px 18px 14px 36px;
  background: rgba(0,0,0,0.3);
  border-radius: 10px;
  text-align: left;
}
.sys-tag {
  position: absolute;
  top: -10px;
  left: 16px;
  font-size: 10px;
  color: #f5d76e;
  background: #1a0505;
  padding: 0 8px;
  letter-spacing: 2px;
}
.sys-text {
  font-size: 13px;
  color: rgba(245, 215, 110, 0.7);
  font-family: var(--font-title);
  line-height: 1.7;
  font-style: italic;
}

.death-danmaku {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.death-dm-item {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  text-align: left;
  padding: 0 8px;
}
.dm-user { color: #f5d76e; }

.preserved {
  background: rgba(39, 174, 96, 0.06);
  border: 1px solid rgba(39, 174, 96, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
}
.preserved-title {
  font-size: 12px;
  color: #27ae60;
  letter-spacing: 2px;
  margin-bottom: 10px;
}
.attr-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.attr-tag {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.1);
  &.gold { color: #f5d76e; border-color: rgba(245, 215, 110, 0.3); background: rgba(245, 215, 110, 0.08); }
}

.rebirth-btn {
  width: 100%;
  padding: 13px 0;
  background: linear-gradient(135deg, #8b0000, #c0392b);
  border: none;
  border-radius: 10px;
  color: #f5d76e;
  font-size: 16px;
  font-family: var(--font-title);
  letter-spacing: 4px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  &:hover { opacity: 0.88; transform: translateY(-1px); }
}

.rebirth-enter-active { animation: rebirthIn 0.5s ease; }
.rebirth-leave-active { animation: rebirthIn 0.4s ease reverse; }

@keyframes rebirthIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes skullPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
