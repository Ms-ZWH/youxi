<template>
  <div class="shop-overlay" @click.self="$emit('close')">
    <div class="shop-modal">
      <!-- 头部 -->
      <div class="shop-header">
        <h2 class="shop-title">⚙ 系统商城</h2>
        <div class="shop-points">⭐ {{ store.points }} 积分</div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- 分类 Tab -->
      <div class="category-tabs">
        <button
          v-for="cat in SHOP_CATEGORIES"
          :key="cat.id"
          class="cat-tab"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- 商品列表 -->
      <div class="items-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="item-card"
          :class="{ 'can-buy': store.points >= item.cost, 'special': item.category === 'special' }"
        >
          <div class="item-icon">{{ item.icon }}</div>
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-desc">{{ item.desc }}</div>
          </div>
          <div class="item-right">
            <div class="item-cost">⭐ {{ item.cost }}</div>
            <button
              class="buy-btn"
              :disabled="store.points < item.cost"
              @click="handleBuy(item)"
            >
              {{ store.points >= item.cost ? '购买' : '不足' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 购买反馈 -->
      <transition name="toast">
        <div v-if="toastMsg" class="buy-toast">{{ toastMsg }}</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHougong001Store } from '@/stores/hougong001'
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../data/shop.js'

defineEmits(['close'])

const store = useHougong001Store()
const activeCategory = ref('attr')
const toastMsg = ref('')

const filteredItems = computed(() =>
  SHOP_ITEMS.filter(i => i.category === activeCategory.value)
)

function handleBuy(item) {
  const ok = store.buyItem(item)
  if (ok) {
    showToast(`✓ 已购买：${item.name}`)
  } else {
    showToast('✗ 积分不足')
  }
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 2000)
}
</script>

<style lang="scss" scoped>
/* ── 遮罩层 ──────────────────────────────────────────── */
.shop-overlay {
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

/* ── 弹窗主容器 ───────────────────────────────────────── */
.shop-modal {
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  background: rgba(18, 12, 8, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(210, 175, 110, 0.5);
  border-radius: 48px;
  box-shadow: 0 30px 50px -20px black, 0 0 0 1px #b4945a inset, 0 0 30px rgba(140, 90, 40, 0.3);
  padding: 28px 22px 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scrollbar-width: thin;
  scrollbar-color: #a3824e #1f150e;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: #1f150e; }
  &::-webkit-scrollbar-thumb { background-color: #a3824e; border-radius: 20px; }

  /* 暗花洒金底纹 */
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

/* ── 头部：title + 积分 + 关闭 ───────────────────────── */
.shop-header {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-areas: "title close" "points points";
  grid-template-columns: 1fr auto;
  gap: 16px 12px;
  border-bottom: 1px solid rgba(200, 165, 110, 0.4);
  padding-bottom: 16px;
  align-items: start;
}

.shop-title {
  grid-area: title;
  font-family: 'Playfair Display', 'Noto Serif SC', 'STSong', serif;
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(180deg, #fbebcf 0%, #d4b17c 70%, #b38946 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 2px;
  line-height: 1;
}

/* 积分区（复用 balance-area 风格） */
.shop-points {
  grid-area: points;
  background: rgba(15, 10, 7, 0.6);
  border: 1px solid #b4945a;
  border-radius: 60px;
  padding: 14px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.6), 0 6px 12px -8px black;
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 18px;
  font-weight: 500;
  color: #ecd7b9;
  letter-spacing: 1px;
}

.close-btn {
  grid-area: close;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #b38f5a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #d4b17c;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  flex-shrink: 0;

  &:hover {
    background: #5a3e28;
    color: #fbeaca;
    border-color: #eac384;
  }
}

/* ── 分类选项卡（玉牌风格）──────────────────────────── */
.category-tabs {
  position: relative;
  z-index: 5;
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0;
  border-bottom: none;
}

.cat-tab {
  flex: 1 0 auto;
  min-width: 72px;
  text-align: center;
  background: rgba(10, 6, 4, 0.6);
  border: 1px solid #7f623e;
  border-radius: 60px;
  padding: 11px 8px;
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 14px;
  font-weight: 600;
  color: #e2c48b;
  letter-spacing: 1px;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);

  &:hover:not(.active) {
    border-color: #b4945a;
    color: #fadcad;
  }

  &.active {
    background: linear-gradient(145deg, #b4945a, #8e6d40);
    border-color: #f5d79c;
    color: #22170c;
    box-shadow: 0 0 12px #dbb77a;
  }
}

/* ── 商品列表容器 ────────────────────────────────────── */
.items-grid {
  position: relative;
  z-index: 5;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 32px;
  padding: 16px 12px;
  border: 1px solid rgba(200, 160, 110, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: visible;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(180,140,80,0.4); border-radius: 2px; }
}

/* ── 商品卡片 ────────────────────────────────────────── */
.item-card {
  background: rgba(15, 10, 7, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(200, 160, 110, 0.45);
  border-radius: 28px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 10px 20px -15px black, inset 0 0 15px rgba(150, 100, 30, 0.2);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #dbb77a;
    box-shadow: 0 12px 20px -16px #b98c4a, inset 0 0 15px rgba(150,100,30,0.2);
  }

  &.special {
    border-color: rgba(200, 160, 110, 0.6);
    background: rgba(20, 14, 8, 0.9);
  }
}

.item-icon {
  font-size: 26px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-name {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 18px;
  font-weight: 700;
  color: #fbdeb9;
  line-height: 1.2;
}

.item-desc {
  font-size: 13px;
  color: #d2bc9f;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

/* 价格标签（★ 前缀 pill）*/
.item-cost {
  font-weight: 700;
  font-size: 20px;
  color: #f3d998;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 14px;
  border-radius: 40px;
  border: 1px solid #b38f5a;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "★";
    font-size: 16px;
    color: #fad25c;
  }
}

/* 购买按钮：可购买 / 不足 两态 */
.buy-btn {
  padding: 6px 18px;
  border-radius: 40px;
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;

  &:not(:disabled) {
    background: linear-gradient(145deg, #dbb77a, #be9357);
    border: none;
    color: #1e130b;
    box-shadow: 0 4px 12px -6px #0f0803;

    &:hover { opacity: 0.88; transform: translateY(-1px); }
    &:active { transform: translateY(0); }
  }

  &:disabled {
    background: rgba(30, 20, 10, 0.7);
    border: 1px solid #7a623f;
    color: #a17e55;
    cursor: not-allowed;
    font-size: 13px;
  }
}

/* ── 购买 Toast 提示 ─────────────────────────────────── */
.buy-toast {
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

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* 小屏适配 */
@media (max-width: 380px) {
  .item-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .item-right {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  .cat-tab {
    font-size: 13px;
    padding: 9px 6px;
  }
}
</style>
