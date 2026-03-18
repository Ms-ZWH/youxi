export const SHOP_CATEGORIES = [
  { id: 'attr',    name: '属性仙丹', icon: '💊' },
  { id: 'skill',   name: '才艺秘籍', icon: '📜' },
  { id: 'item',    name: '功能道具', icon: '🧪' },
  { id: 'special', name: '特殊商品', icon: '☠️' },
]

export const SHOP_ITEMS = [
  // ── 属性仙丹 ─────────────────────────────────────
  { id: 'yangyan',  category: 'attr',  name: '养颜丹',  cost: 100, icon: '💊', desc: '容貌 +5（永久）',  effect: { appearance: 5 } },
  { id: 'xisui',    category: 'attr',  name: '洗髓丹',  cost: 100, icon: '💊', desc: '体质 +5（永久）',  effect: { constitution: 5 } },
  { id: 'kaiqiao',  category: 'attr',  name: '开窍丸',  cost: 100, icon: '💊', desc: '心机 +5（永久）',  effect: { scheme: 5 } },

  // ── 才艺秘籍 ─────────────────────────────────────
  { id: 'jinghong', category: 'skill', name: '《惊鸿舞》入门',   cost: 100, icon: '📜', desc: '舞蹈 +10（永久）',  effect: { dance: 10 } },
  { id: 'lvqi',     category: 'skill', name: '《绿绮琴谱》',     cost: 100, icon: '📜', desc: '琴艺 +10（永久）',  effect: { qin: 10 } },
  { id: 'lanting',  category: 'skill', name: '《兰亭集序》摹本', cost: 100, icon: '📜', desc: '书法 +10（永久）',  effect: { calligraphy: 10 } },
  { id: 'luoshen',  category: 'skill', name: '《洛神赋图》摹本', cost: 100, icon: '📜', desc: '画画 +10（永久）',  effect: { painting: 10 } },
  { id: 'suxiu',    category: 'skill', name: '苏绣入门针法',     cost: 100, icon: '📜', desc: '女工 +10（永久）',  effect: { needlework: 10 } },
  { id: 'sunv',     category: 'skill', name: '《素女经》残卷',   cost: 300, icon: '📜', desc: '秘术 +10（永久）',  effect: { secret: 10 } },
  { id: 'zizhi',    category: 'skill', name: '《资治通鉴》节选', cost: 300, icon: '📜', desc: '心机 +10（永久）',  effect: { scheme: 10 } },

  // ── 功能道具 ─────────────────────────────────────
  { id: 'yiyun',   category: 'item', consumable: true, name: '易孕丹',     cost: 1000, icon: '🔴', desc: '下次侍寝必定怀孕' },
  { id: 'bizi',    category: 'item', consumable: true, name: '避子汤',     cost: 300,  icon: '🔵', desc: '一个月内侍寝不会怀孕' },
  { id: 'zhenxin', category: 'item', consumable: true, name: '真心话药丸', cost: 500,  icon: '💜', desc: '让一个NPC说一小时真心话' },
  { id: 'suixin',  category: 'item', consumable: true, name: '随心所欲符', cost: 500,  icon: '📋', desc: '指定一个对象做一个动作' },

  // ── 特殊商品 ─────────────────────────────────────
  { id: 'heding',  category: 'special', consumable: true, name: '鹤顶红', cost: 2000, icon: '☠️', desc: '无声无息让一个NPC暴毙' },
  { id: 'duotai',  category: 'special', consumable: true, name: '堕胎丸', cost: 500,  icon: '🖤', desc: '无声无息让一人流产' },
  { id: 'huirong', category: 'special', consumable: true, name: '毁容丹', cost: 500,  icon: '💢', desc: '让一个NPC容颜大幅下降' },
]
