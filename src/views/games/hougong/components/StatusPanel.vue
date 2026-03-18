<template>
  <div class="info-card">
    <div class="card-title">⚙️ 设置·属性</div>

    <!-- 基础资源 -->
    <div class="stat-item">
      <span class="stat-label">位分</span>
      <span class="stat-value rank-val">{{ store.rank }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">银钱</span>
      <span class="stat-value">{{ store.money }}两</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">积分</span>
      <span class="stat-value gold">{{ store.points }}分</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">死亡</span>
      <span class="stat-value muted">{{ store.deathCount }}次</span>
    </div>

    <!-- 六维属性 -->
    <div class="attr-section-title">属性</div>
    <div class="attr-grid">
      <div v-for="a in store.attrList" :key="a.key" class="attr-item">
        <span class="attr-label">{{ a.label }}</span>
        <span class="attr-value">{{ a.value }}</span>
      </div>
    </div>

    <!-- 才艺（有值才显示） -->
    <template v-if="hasSkills">
      <div class="attr-section-title">才艺</div>
      <div class="attr-grid">
        <div v-for="s in activeSkills" :key="s.key" class="attr-item">
          <span class="attr-label">{{ s.label }}</span>
          <span class="attr-value">{{ s.value }}</span>
        </div>
      </div>
    </template>

    <!-- 背包（有道具才显示） -->
    <template v-if="store.inventory.length > 0">
      <div class="attr-section-title">背包</div>
      <div class="inventory-list">
        <div v-for="item in store.inventory" :key="item.id" class="inv-item">
          <span>{{ item.icon }} {{ item.name }}</span>
          <span class="inv-count">x{{ item.count }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHougong001Store } from '@/stores/hougong001'

const store = useHougong001Store()

const hasSkills = computed(() => store.skillList.some(s => s.value > 0))
const activeSkills = computed(() => store.skillList.filter(s => s.value > 0))
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

/* 数据行 */
.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 14px;
  color: #d4bc9b;
  padding: 6px 2px;
  border-bottom: 1px dotted rgba(180, 140, 80, 0.25);

  &:last-of-type { border-bottom: none; }
}
.stat-label { font-weight: 400; color: rgba(212, 188, 155, 0.75); }
.stat-value {
  font-weight: 600;
  color: #f5deb3;
  &.gold { color: #f5d76e; }
  &.muted { color: rgba(255,255,255,0.4); }
}
.rank-val { color: #e6b873; }

/* 属性分区标题 */
.attr-section-title {
  font-size: 14px;
  color: #e2c289;
  margin: 14px 0 8px;
}

/* 属性网格 */
.attr-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 8px;
}

.attr-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.25);
  padding: 6px 10px;
  border-radius: 40px;
  border: 1px solid #826f4b;
  color: #ebd7b8;
}
.attr-label { font-weight: 400; }
.attr-value { font-weight: 700; color: #f3d998; }

/* 背包 */
.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.inv-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(220, 195, 155, 0.8);
  padding: 6px 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  border: 1px solid rgba(180,140,80,0.2);
}
.inv-count { color: #f5d76e; }
</style>
