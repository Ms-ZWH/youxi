<template>
  <div class="info-card">
    <div class="card-title">🎥 直播间 · 弹幕</div>
    <div class="danmu-list" ref="listRef">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="danmu-item"
        :class="{ reward: msg.isReward }"
      >
        <template v-if="msg.isReward">
          <span class="reward-icon">🎁</span>
          <span class="reward-text">{{ msg.text }}</span>
        </template>
        <template v-else>
          <span class="danmu-user">{{ msg.user }}：</span>
          <span class="danmu-text">{{ msg.text }}</span>
        </template>
      </div>
      <div v-if="messages.length === 0" class="danmu-empty">等待直播开始…</div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const listRef = ref(null)
const messages = ref([])
let msgId = 0

function addMessage(user, text) {
  messages.value.push({ id: ++msgId, user, text, isReward: false })
  if (messages.value.length > 30) messages.value.shift()
  scrollBottom()
}

function addReward(text) {
  messages.value.push({ id: ++msgId, text, isReward: true })
  if (messages.value.length > 30) messages.value.shift()
  scrollBottom()
}

function addDanmakuBatch(danmaku) {
  danmaku.forEach((d, i) => {
    setTimeout(() => addMessage(d.user, d.text), i * 800)
  })
}

function scrollBottom() {
  nextTick(() => {
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
  })
}

defineExpose({ addMessage, addReward, addDanmakuBatch })
</script>

<style lang="scss" scoped>
.info-card {
  background: rgba(15, 10, 7, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 160, 110, 0.45);
  border-radius: 28px;
  padding: 18px 16px;
  box-shadow: 0 15px 25px -18px black, inset 0 0 20px rgba(160, 110, 50, 0.15);
  width: 100%;
}

.card-title {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 17px;
  font-weight: 700;
  color: #fadcad;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #b4945a;
  letter-spacing: 1px;
}

.danmu-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(180,140,80,0.4); border-radius: 2px; }
}

.danmu-item {
  background: rgba(230, 200, 150, 0.08);
  border-left: 3px solid #c9a459;
  padding: 9px 14px;
  border-radius: 0 20px 20px 0;
  font-size: 14px;
  color: #eedbba;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  animation: msgAppear 0.3s ease;

  &.reward {
    border-left-color: #d4b17c;
    background: rgba(212, 177, 124, 0.1);
    align-items: center;
  }
}

.danmu-user {
  color: #fbd996;
  font-weight: 600;
  flex-shrink: 0;
  font-family: 'Noto Serif SC', serif;
}

.danmu-text {
  color: #f2e0c5;
  word-break: break-word;
  line-height: 1.5;
}

.reward-icon { font-size: 15px; flex-shrink: 0; }
.reward-text { color: #f5d76e; font-size: 13px; }

.danmu-empty {
  font-size: 13px;
  color: rgba(180, 140, 80, 0.4);
  text-align: center;
  padding: 10px 0;
  letter-spacing: 1px;
}

@keyframes msgAppear {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
