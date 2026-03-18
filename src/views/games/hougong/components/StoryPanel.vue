<template>
  <div class="story-panel" ref="panelRef" @click="skipTypewriter">
    <!-- 正文（打字机效果） -->
    <div class="story-text">
      <p
        v-for="(para, i) in visibleParagraphs"
        :key="i"
        class="para"
        :class="{ typing: i === currentParaIndex && !done }"
      >
        <span v-if="i < currentParaIndex || done">{{ para }}</span>
        <span v-else>{{ currentTyped }}<span class="cursor">▌</span></span>
      </p>
    </div>

    <!-- 反馈文字（选择后） -->
    <div v-if="reactionText" class="reaction-text">
      <p v-for="(line, i) in reactionLines" :key="i">{{ line }}</p>
    </div>

    <!-- 底部提示 -->
    <div v-if="done && !reactionText" class="scroll-hint">
      点击任意位置跳过 · 等待弹出选项 ↓
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  paragraphs: { type: Array, default: () => [] },
  reactionText: { type: String, default: '' },
})
const emit = defineEmits(['done'])

const panelRef = ref(null)
const currentParaIndex = ref(0)
const currentTyped = ref('')
const done = ref(false)
let timer = null

const visibleParagraphs = computed(() => props.paragraphs.slice(0, currentParaIndex.value + 1))
const reactionLines = computed(() => props.reactionText.split('\n').filter(Boolean))

function startTypewriter() {
  clearInterval(timer)
  currentParaIndex.value = 0
  currentTyped.value = ''
  done.value = false
  typeParagraph(0)
}

function typeParagraph(idx) {
  if (idx >= props.paragraphs.length) {
    done.value = true
    emit('done')
    return
  }
  currentParaIndex.value = idx
  currentTyped.value = ''
  const text = props.paragraphs[idx]
  let i = 0
  timer = setInterval(() => {
    if (i < text.length) {
      currentTyped.value += text[i++]
      scrollToBottom()
    } else {
      clearInterval(timer)
      setTimeout(() => typeParagraph(idx + 1), 180)
    }
  }, 28)
}

function skipTypewriter() {
  if (done.value) return
  clearInterval(timer)
  currentParaIndex.value = props.paragraphs.length - 1
  currentTyped.value = props.paragraphs[props.paragraphs.length - 1]
  done.value = true
  emit('done')
}

function scrollToBottom() {
  nextTick(() => {
    if (panelRef.value) panelRef.value.scrollTop = panelRef.value.scrollHeight
  })
}

watch(() => props.paragraphs, () => { startTypewriter() }, { immediate: true })

onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
.story-panel {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  color: #dac6ab;
  background: rgba(0, 0, 0, 0.2);
  padding: 16px 18px;
  border-radius: 28px;
  border: 1px solid rgba(180, 140, 80, 0.3);
  text-shadow: 0 1px 3px black;
  cursor: pointer;
  user-select: none;
  height: 280px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(180, 140, 80, 0.4); border-radius: 2px; }
}

.story-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.para {
  color: #dac6ab;

  &.typing { color: #f0dfc0; }
}

.cursor {
  display: inline-block;
  animation: blink 0.8s step-end infinite;
  color: #b68f54;
}

.reaction-text {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(180, 140, 80, 0.08);
  border-left: 3px solid #b68f54;
  border-radius: 0 16px 16px 0;

  p {
    font-size: 14px;
    line-height: 1.8;
    color: rgba(220, 198, 160, 0.85);
    & + p { margin-top: 6px; }
  }
}

.scroll-hint {
  margin-top: 16px;
  font-size: 12px;
  color: rgba(180, 140, 80, 0.4);
  text-align: center;
  letter-spacing: 2px;
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes fadeInOut {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.9; }
}
</style>
