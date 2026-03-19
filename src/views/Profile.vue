<template>
  <div class="profile-page">
    <div class="activation-palace">

      <!-- 飘浮圆点装饰 -->
      <div class="float-dots">
        <span></span><span></span><span></span><span></span>
      </div>

      <!-- 主标题 -->
      <div class="title-row">
        <i class="fas fa-magic"></i>
        <h1>激活乐园</h1>
      </div>

      <!-- 全站畅玩验证码激活 -->
      <div class="activate-card">
        <div class="card-title">
          <i class="fas fa-globe"></i>
          <span>全站畅玩验证码激活</span>
          <span v-if="userStore.isVip" class="vip-badge"><i class="fas fa-check-circle"></i> 已激活</span>
        </div>
        <input
          type="text"
          class="input-field"
          :class="{ activated: userStore.isVip }"
          :value="userStore.isVip ? userStore.vipCode : vipInput"
          :readonly="userStore.isVip"
          placeholder="请输入畅玩激活码"
          @input="vipInput = $event.target.value"
        />
        <button
          v-if="!userStore.isVip"
          class="activate-btn"
          @click="handleVipActivate"
        >
          <i class="fas fa-check-circle"></i> 确定激活
        </button>
        <div v-if="vipMsg" class="result-msg" :class="{ success: vipOk, error: !vipOk }">
          {{ vipMsg }}
        </div>
        <div class="hint-text">激活一次全站游戏畅玩</div>
      </div>

      <!-- 装饰分隔 -->
      <div class="divider">
        <span class="divider-line"></span>
        <i class="fas fa-heart"></i>
        <span class="divider-line"></span>
      </div>

      <!-- 金条验证码激活 -->
      <div class="activate-card">
        <div class="card-title">
          <i class="fas fa-coins"></i>
          <span>金条验证码激活</span>
        </div>
        <div class="gold-balance">
          <span class="label"><i class="fas fa-coins"></i> 我的金条</span>
          <span class="amount">{{ userStore.goldBars }} 根</span>
        </div>
        <input type="text" class="input-field" placeholder="请输入金条验证码" />
        <button class="activate-btn"><i class="fas fa-check-circle"></i> 确定激活</button>
      </div>

      <!-- 底部装饰 -->
      <div class="footer-charm">
        <i class="fas fa-candy-cane"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-moon"></i>
      </div>

      <div class="footer-tip">✨ 激活后权益立即生效，请妥善保管验证码 ✨</div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { useUserStore } from '@/stores/userStore'

const themeStore = useThemeStore()
const userStore  = useUserStore()

onMounted(() => themeStore.clearTheme())

const vipInput = ref('')
const vipMsg   = ref('')
const vipOk    = ref(false)

function handleVipActivate() {
  const result = userStore.activateVipCode(vipInput.value)
  vipOk.value  = result.ok
  vipMsg.value = result.msg
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #fce4f0 0%, #f3d1e4 100%);
  font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px 16px 80px;
  color: #4a2c3d;
  line-height: 1.5;
  display: flex;
  justify-content: center;
}

.activation-palace {
  max-width: 500px;
  width: 100%;
  background: rgba(255, 248, 252, 0.88);
  backdrop-filter: blur(8px);
  border-radius: 52px 52px 40px 40px;
  box-shadow: 0 25px 45px -12px rgba(160, 100, 140, 0.5),
              inset 0 1px 0 0 rgba(255, 230, 245, 0.8);
  padding: 30px 24px 40px;
  border: 1px solid #ffeef5;
  height: fit-content;
}

/* 飘浮圆点 */
.float-dots {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding-left: 8px;
}
.float-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f9b8d4;
  box-shadow: 0 2px 8px #fec7df;
}
.float-dots span:nth-child(2) { width: 12px; height: 12px; background: #fcc9df; }
.float-dots span:nth-child(3) { width: 6px; height: 6px; background: #ffdaec; }

/* 主标题 */
.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.title-row i {
  font-size: 36px;
  color: #f5a9c7;
  filter: drop-shadow(0 4px 8px #fcc6dd);
}
.title-row h1 {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(130deg, #b45a7a, #974468);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  line-height: 1.1;
}

/* 激活卡片 */
.activate-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 32px;
  padding: 24px 20px;
  margin-bottom: 8px;
  box-shadow: 0 15px 28px -14px rgba(150, 80, 120, 0.35),
              0 0 0 2px #fff8fe inset,
              0 0 0 3px #ffeef5;
  border: 1px solid #ffe0f0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #643953;
  margin-bottom: 18px;
}
.card-title i {
  font-size: 24px;
  color: #e17aa3;
  background: white;
  border-radius: 50%;
  padding: 9px;
  box-shadow: 0 4px 8px #ffdbea;
}

/* 金条余额 */
.gold-balance {
  background: #fff3f9;
  border-radius: 60px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  border: 1px solid #ffcfe4;
  box-shadow: 0 5px 12px -6px #e2aac4;
}
.gold-balance .label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 600;
  color: #822f59;
}
.gold-balance .label i {
  font-size: 24px;
  color: #f09bc0;
}
.gold-balance .amount {
  font-size: 26px;
  font-weight: 700;
  color: #a53864;
}

/* 输入框 */
.input-field {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid #ffdbea;
  border-radius: 60px;
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  color: #4a2c3d;
  background: white;
  outline: none;
  transition: 0.2s;
  margin-bottom: 16px;
  box-shadow: 0 3px 8px #fce1ef inset, 0 2px 6px #ffdae9;
}
.input-field:focus {
  border-color: #f5aac5;
  box-shadow: 0 0 0 4px #ffdae9, 0 3px 10px #ffc8e0 inset;
}
.input-field::placeholder {
  color: #bb8caa;
  font-weight: 400;
  opacity: 0.8;
}

/* 激活按钮 */
.activate-btn {
  background: linear-gradient(145deg, #ffb1cf, #ff90bb);
  border: 1px solid #ffe5f0;
  border-radius: 60px;
  padding: 14px 28px;
  width: 100%;
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 5px #b33b6b;
  box-shadow: 0 12px 20px -8px #dd74a0, 0 0 0 2px #fff3f9 inset;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.activate-btn i { font-size: 17px; color: white; }
.activate-btn:hover {
  background: linear-gradient(145deg, #ffa5c7, #ff7eb0);
  transform: scale(1.02);
  box-shadow: 0 16px 26px -8px #cf5f8f;
}

/* 提示文字 */
.hint-text {
  font-size: 14px;
  color: #ac6d8e;
  margin-top: 14px;
  text-align: center;
  background: #fff2f9;
  padding: 7px 18px;
  border-radius: 60px;
  border: 1px solid #ffdeec;
  display: inline-block;
}

/* 分隔装饰 */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: #e09dbe;
}
.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #feb6d2, transparent);
}
.divider i { font-size: 20px; opacity: 0.8; }

/* 底部装饰 */
.footer-charm {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 28px;
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
  margin-top: 18px;
  font-size: 13px;
  color: #b28faa;
}

@media (max-width: 400px) {
  .title-row h1 { font-size: 30px; }
  .card-title { font-size: 16px; }
  .gold-balance .amount { font-size: 22px; }
}

.vip-badge {
  margin-left: auto;
  font-size: 12px;
  font-weight: 600;
  color: #27ae60;
  background: #eafaf1;
  border: 1px solid #a9dfbf;
  border-radius: 20px;
  padding: 3px 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.input-field.activated {
  border-color: #a9dfbf;
  background: #f0faf5;
  color: #27ae60;
  font-weight: 600;
  letter-spacing: 1px;
}

.result-msg {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  margin: 10px 0 4px;
  padding: 8px 16px;
  border-radius: 20px;

  &.success {
    color: #1e8449;
    background: #eafaf1;
    border: 1px solid #a9dfbf;
  }
  &.error {
    color: #922b21;
    background: #fdedec;
    border: 1px solid #f5b7b1;
  }
}
</style>
