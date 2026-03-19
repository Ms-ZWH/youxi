import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'youxi_user'

// 20元畅玩包激活码：全站畅玩 + 150金条
const VIP_CODES_20 = new Set([
  '2W9X7KJ4M6P8Q3R5', 'A5B8C2D9F3G6H7J4', 'K9M2N4P7Q3R5T8V6',
  'X2Y4Z6W8L9J3H5G7', 'F8D6S4A2Q9W7E5R3', 'T9Y7U5I3P2O8L4K6',
  'N5B7V9C2X4Z6M8Q3', 'R4T6Y8U0P2S4D6F8', 'H3J5K7L9M2N4P6Q8',
  'A7S9D5F3G6H8J2K4', 'Z6X8C4V2B9N7M5L3', 'Q2W4E6R8T9Y7U5I3',
  'P9O7I5U3Y2T4R6E8', 'L4K6J8H2G5F7D9S3', 'M3N5B7V9C2X4Z6Q8',
  'W2E4R6T8Y9U7I5O3', 'A1S3D5F7G9H2J4K6', 'P8L4Q2W6E9R3T5Y7',
  'U9I7O5P3L1K2J4H6', 'F5D7S9G3H1J2K4L6',
])

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function persist(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useUserStore = defineStore('user', () => {
  const saved = load()

  const isVip    = ref(saved?.isVip    ?? false)
  const goldBars = ref(saved?.goldBars ?? 0)
  const vipCode  = ref(saved?.vipCode  ?? '')   // 已激活的全站畅玩码

  function save() {
    persist({ isVip: isVip.value, goldBars: goldBars.value, vipCode: vipCode.value })
  }

  // 激活全站畅玩码，返回 { ok, msg }
  function activateVipCode(code) {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return { ok: false, msg: '请输入激活码' }
    if (isVip.value) return { ok: true, msg: '您已激活，无需重复操作' }
    if (VIP_CODES_20.has(trimmed)) {
      isVip.value    = true
      goldBars.value += 150
      vipCode.value  = trimmed
      save()
      return { ok: true, msg: '激活成功！已获得全站畅玩权限 + 150金条 🎉' }
    }
    return { ok: false, msg: '激活码无效，请检查后重试' }
  }

  // 消耗金条，返回 { ok, msg }
  function spendGold(amount = 1) {
    if (goldBars.value < amount) return { ok: false, msg: '金条不足，请前往购买页充值' }
    goldBars.value -= amount
    save()
    return { ok: true }
  }

  return { isVip, goldBars, vipCode, activateVipCode, spendGold }
})
