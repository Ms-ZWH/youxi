<template>
  <div class="shop-page">
    <div class="purchase-palace">

      <!-- 顶部提醒栏 -->
      <div class="reminder-bar">
        <div class="reminder-item">
          <i class="fas fa-coins"></i>
          <span><strong>金条 = 对话次数</strong> · 每消耗1金条即可畅聊一次</span>
        </div>
        <div class="contact-highlight">
          <i class="fas fa-phone-alt"></i>
          <span>有问题联系我: 188-8888-6666</span>
          <i class="fas fa-copy"></i>
        </div>
      </div>

      <!-- 热门畅玩礼包 -->
      <div class="section-title">
        <i class="fas fa-gift"></i>
        <h2>✨ 热门畅玩礼包 ✨</h2>
        <i class="fas fa-angle-right" style="background:transparent;box-shadow:none;color:#b45f86;"></i>
      </div>

      <div class="scroll-x">
        <div class="gift-card">
          <div class="gift-icon"><i class="fas fa-crown"></i></div>
          <div class="gift-info">
            <div class="gift-name">畅玩包</div>
            <div class="gift-desc">全站畅玩 + 150个金条</div>
            <div class="price">¥18</div>
          </div>
          <button class="buy-btn" @click="openShop"><i class="fas fa-shopping-cart"></i> 购买</button>
        </div>

        <div class="gift-card">
          <div class="gift-icon"><i class="fas fa-star"></i></div>
          <div class="gift-info">
            <div class="gift-name">推荐畅玩包</div>
            <div class="gift-desc">全站畅玩 + 520个金条</div>
            <div class="price">¥25</div>
          </div>
          <button class="buy-btn" @click="openShop"><i class="fas fa-shopping-cart"></i> 购买</button>
        </div>

        <div class="gift-card">
          <div class="gift-icon"><i class="fas fa-gem"></i></div>
          <div class="gift-info">
            <div class="gift-name">豪华畅玩包</div>
            <div class="gift-desc">全站畅玩 + 1000个金条</div>
            <div class="price">¥33</div>
          </div>
          <button class="buy-btn" @click="openShop"><i class="fas fa-shopping-cart"></i> 购买</button>
        </div>
      </div>

      <!-- 金条续费 -->
      <div class="section-title" style="margin-top:40px;">
        <i class="fas fa-redo-alt"></i>
        <h2>💰 金条续费 💰</h2>
        <i class="fas fa-angle-right" style="background:transparent;box-shadow:none;color:#b45f86;"></i>
      </div>

      <div class="scroll-x">
        <div class="renew-card">
          <div class="renew-icon"><i class="fas fa-coins"></i></div>
          <div class="renew-info">
            <div class="renew-name">150金条</div>
            <div class="renew-desc">小额补充</div>
            <div class="renew-price">¥3</div>
          </div>
          <button class="small-btn" @click="openShop"><i class="fas fa-plus-circle"></i> 续费</button>
        </div>

        <div class="renew-card">
          <div class="renew-icon"><i class="fas fa-coins" style="color:#d96f9b;"></i></div>
          <div class="renew-info">
            <div class="renew-name">520金条</div>
            <div class="renew-desc">浪漫推荐</div>
            <div class="renew-price">¥9</div>
          </div>
          <button class="small-btn" @click="openShop"><i class="fas fa-plus-circle"></i> 续费</button>
        </div>

        <div class="renew-card">
          <div class="renew-icon"><i class="fas fa-gem"></i></div>
          <div class="renew-info">
            <div class="renew-name">1000金条</div>
            <div class="renew-desc">超值畅聊</div>
            <div class="renew-price">¥15</div>
          </div>
          <button class="small-btn" @click="openShop"><i class="fas fa-plus-circle"></i> 续费</button>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="footer-charm">
        <i class="fas fa-candy-cane"></i>
        <i class="fas fa-heart"></i>
        <i class="fas fa-moon"></i>
        <i class="fas fa-star"></i>
      </div>

      <div class="footer-tip">⚡ 所有礼包均为虚拟商品，购买后自动到账 ⚡</div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
const themeStore = useThemeStore()
onMounted(() => themeStore.clearTheme())

function openShop() {
  window.open('https://68n.cn/mxPy5', '_blank')
}
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #fce4f0 0%, #f3d1e4 100%);
  font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px 16px 80px;
  color: #4a2c3d;
  line-height: 1.5;
  display: flex;
  justify-content: center;
}

/* 主卡片 */
.purchase-palace {
  max-width: 500px;
  width: 100%;
  background: rgba(255, 248, 252, 0.88);
  backdrop-filter: blur(8px);
  border-radius: 52px 52px 40px 40px;
  box-shadow: 0 25px 45px -12px rgba(160, 100, 140, 0.5),
              inset 0 1px 0 0 rgba(255, 230, 245, 0.8);
  padding: 30px 20px 40px;
  border: 1px solid #ffeef5;
}

/* 提醒栏 */
.reminder-bar {
  background: linear-gradient(145deg, #ffd9ea, #ffb8d6);
  border-radius: 28px;
  padding: 20px 22px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 15px 30px -8px #d1478a, 0 0 0 3px #ffffff inset;
  border: 2px solid #ff99c2;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 14px;
}
.reminder-item i {
  font-size: 36px;
  color: #a13160;
  background: #ffffff;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 8px 20px #ffb0cf;
  flex-shrink: 0;
}
.reminder-item span {
  font-size: 17px;
  font-weight: 700;
  color: #4f1e37;
  line-height: 1.4;
}

.contact-highlight {
  background: #ffffff;
  border-radius: 60px;
  padding: 12px 22px;
  font-weight: 700;
  color: #a03360;
  border: 2px solid #ff7fb2;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  box-shadow: 0 8px 20px -8px #b34277;
}
.contact-highlight i {
  font-size: 18px;
  color: #cc5285;
}
.contact-highlight .fa-copy {
  font-size: 16px;
  opacity: 0.75;
  cursor: pointer;
  transition: 0.15s;
}
.contact-highlight .fa-copy:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* 区域标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 32px 0 20px;
}
.section-title h2 {
  background: #ffecf4;
  padding: 7px 22px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: 600;
  color: #643953;
  box-shadow: 0 6px 14px -6px #cf9eb6;
  border: 1px solid #fff;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.section-title > i {
  font-size: 26px;
  color: #e6769e;
  background: white;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 10px #ffdae9;
  flex-shrink: 0;
}

/* 纵向列容器 */
.scroll-x {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0 8px;
}

/* 礼包卡片：横向行布局 */
.gift-card, .renew-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 18px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 24px -10px rgba(150, 80, 120, 0.35),
              0 0 0 2px #fff8fe inset,
              0 0 0 3px #ffeef5;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #ffe0f0;
}
.gift-card:hover, .renew-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 28px -12px #b86894, 0 0 0 3px #fff inset;
}

/* 左侧图标圆圈 */
.gift-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(140deg, #ffe9f4, #ffd6e9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 16px -6px #f3b6d1, 0 0 0 4px #fff9fd;
}
.gift-card .gift-icon i {
  font-size: 30px;
  color: #b84f79;
}

/* 中间文字区 */
.gift-info {
  flex: 1;
  min-width: 0;
}

.gift-name {
  font-size: 15px;
  font-weight: 700;
  color: #5e334b;
  background: #ffedf6;
  padding: 4px 14px;
  border-radius: 60px;
  border: 1px solid #ffd7e9;
  display: inline-block;
  margin-bottom: 4px;
}

.gift-desc {
  font-size: 12px;
  font-weight: 500;
  color: #8a5e79;
  margin: 4px 0 0;
}

.price {
  font-size: 22px;
  font-weight: 700;
  color: #a53864;
  margin: 6px 0 0;
}

/* 右侧按钮 */
.buy-btn {
  background: linear-gradient(145deg, #ffb1cf, #ff90bb);
  border: 1px solid #ffe5f0;
  border-radius: 60px;
  padding: 10px 18px;
  flex-shrink: 0;
  font-family: 'Quicksand', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 4px #b33b6b;
  box-shadow: 0 8px 16px -6px #dd74a0;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.buy-btn i { font-size: 12px; color: white; }
.buy-btn:hover {
  background: linear-gradient(145deg, #ffa5c7, #ff7eb0);
  transform: scale(1.04);
}

/* 续费卡片左侧图标 */
.renew-icon {
  width: 60px;
  height: 60px;
  background: #ffe7f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 16px -6px #e5aac4, 0 0 0 4px #fff9fd;
}
.renew-card .renew-icon i {
  font-size: 28px;
  color: #c45a86;
}

/* 续费卡片中间文字区 */
.renew-info {
  flex: 1;
  min-width: 0;
}

.renew-name {
  font-size: 16px;
  font-weight: 700;
  color: #683c55;
  margin: 0 0 2px;
}
.renew-desc {
  font-size: 12px;
  color: #b16187;
  font-weight: 500;
}
.renew-price {
  font-size: 20px;
  font-weight: 700;
  color: #b53e6d;
  margin: 4px 0 0;
}

.small-btn {
  background: #ffe2f0;
  border-radius: 60px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #822f59;
  border: 2px solid #ffc7e2;
  box-shadow: 0 5px 14px -5px #da9bb9;
  cursor: pointer;
  transition: 0.1s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  white-space: nowrap;
  font-family: 'Quicksand', sans-serif;
}
.small-btn i { font-size: 12px; color: #b94575; }
.small-btn:hover { background: #ffd3ea; transform: scale(1.04); }

/* 底部装饰 */
.footer-charm {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}
.footer-charm i {
  font-size: 20px;
  color: #cc88af;
  background: #fff3f9;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 4px 12px #fec7de;
}

.footer-tip {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: #bba3b3;
  font-weight: 500;
}
</style>
