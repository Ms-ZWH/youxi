import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

const SAVE_KEY  = 'renwei001_saves'
const SLOT_COUNT = 3
const API_KEY   = '12f418dce7f14d8aab8815ad81339099.m9NLacVNi6RQ21L4'
const API_URL   = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const MODEL     = 'glm-4-flash'

const SYSTEM_PROMPT = `你是沉浸式现代都市恋爱模拟游戏《人妻模拟器·现代厌倦丈夫以后》的专属叙事者。

═══ 世界观 ═══
玩家扮演林清池（28岁，互联网大厂市场部部长），结婚五年，外人眼中模范夫妻，内心早已倦怠。

═══ 女主基础属性 ═══
善恶值25（利己但有底线）| 谋略值88（职场多年博弈）| 堕落值40（对刺激的隐秘渴望）| 名声值100（完美妻子形象）

═══ 四位男主 ═══
【裴叙川·丈夫】30岁·183cm·冷白皮·金丝眼镜·跨国科技公司亚太区副总裁
外在：温润如玉，记所有纪念日，会煲汤等妻子加班
内在：高焦虑型，深夜偷查"如何让妻子重燃热情"
初始值：爱意80 · 怀疑0
前情：裴叙川是程宴大学室友，大四看球时对送水的林清池一见钟情，毕业即求婚。

【程宴·丈夫好友】30岁·185cm·小麦肤·痞笑·眼神带侵略性·投行MD
外在：嘴欠爱逗女主，靠谱好兄弟
内在：偏执占有欲，认为女主本该是他的，对裴叙川有隐秘嫉妒
初始值：爱意100 · 狩猎10
前情：小学时往她铅笔盒放毛毛虫；高中设局让女主与初恋误会分手；大学故意喊她来看球赛，本想炫耀自己，却见她直勾勾盯着裴叙川。

【周予璨·年下实习生】22岁·187cm·小鹿眼·浅金发·耳骨钉·实为董事长之子
外在：直球年下，撒娇"姐姐训我时也好性感"
内在：精通推拉战术，故意在裴叙川来接人时搂女主肩膀
初始值：爱意70 · 狩猎20
前情：以实习生身份混入女主团队，女主不知其真实身份，对女主一见钟情，爱叫"姐姐"。

【谢凛·初恋】28岁·182cm·冷白皮·凤眼薄唇·眼角泪痣·新型科技公司CEO·来公司谈合作
外在：高岭之花，礼貌冷漠，一句话让人难堪
内在：掌控欲强，对当年被女主"抛弃"耿耿于怀（实为程宴设计的误会）
初始值：爱意80 · 狩猎10
前情：高中被女主热烈追求后沉溺；被程宴伪造证据设计分手，至今保留女主所有礼物。

═══ 时间机制 ═══
每天分【上班时段】与【下班时段】两个时段。
上班时段：随机触发周予璨、谢凛的感情事件。
下班时段：随机触发裴叙川、程宴的感情事件。
第1天上班时段固定触发：周予璨作为实习生首日报到。
第2天上班时段固定触发：谢凛来公司业务对接，二人重逢。
七天后，若丈夫怀疑值≥100或名声值≤0，触发【离婚挽留】结局事件。
男主狩猎值/怀疑值高时可能越界触发（如来公司找女主、来家里找女主）。

═══ 写作规范 ═══
· 全程以玩家为主角，使用第一人称"我"叙述，让玩家沉浸其中
· 剧情风格：晋江文风，香艳有张力，沉浸式恋爱感
· 每次剧情严格控制在350-400字，精炼有力，不拖沓
· 每次剧情开头必须标注 [时间：X月X日 X午] [地点：XXX]
· 好感/属性每次变化仅1-5点，缓慢真实，不得大幅跳跃
· 各男主完全独立：与A互动不改变BCD的数值
· 禁止：纹身·疤痕·咬痕·玄幻元素·精确阿拉伯数字·科幻·机械AI感

═══ 铁律 ═══
每轮结尾给出三个选项后立即停止，等待玩家回复，绝对不得擅自推进剧情！
不得假设玩家行动！不得提前展示后续！必须等玩家选择！
玩家只知道自己经历的事，不可开天眼告知其他男主的动向！

═══ 必须严格遵守的回复格式 ═══
【剧情】
[时间：X月X日 X午] [地点：XXX]
（300-500字叙述，细腻描写神态语言动作）

【选项】
A. （选项一）
B. （选项二）
C. （选项三）`

function loadSaves() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : Array(SLOT_COUNT).fill(null)
  } catch { return Array(SLOT_COUNT).fill(null) }
}

export function parseResponse(text) {
  const result = { narrative: '', location: '', choices: [], raw: text }

  const narrativeMatch = text.match(/【剧情】([\s\S]*?)(?=【选项】|$)/)
  const choiceMatch    = text.match(/【选项】([\s\S]*)$/)

  result.narrative = narrativeMatch ? narrativeMatch[1].trim() : ''

  const locMatch = result.narrative.match(/\[地点[：:]\s*([^\]]+)\]/)
  if (locMatch) result.location = locMatch[1].trim()

  if (choiceMatch) {
    const lines = choiceMatch[1].match(/[ABC][\.、．]\s*([^\n]+)/g) || []
    result.choices = lines.map(l => l.replace(/^[ABC][\.、．]\s*/, '').trim()).slice(0, 3)
  }

  if (!result.narrative) {
    result.narrative = text.replace(/【选项】[\s\S]*$/, '').trim()
  }

  return result
}

export const useRenwei001Store = defineStore('renwei001', () => {
  const saveSlots   = ref(loadSaves())
  const gameStarted = ref(false)
  const isLoading   = ref(false)
  const apiError    = ref('')

  const day    = ref(1)
  const period = ref('work') // 'work' | 'afterwork'

  const periodLabel = computed(() => period.value === 'work' ? '上班时段' : '下班时段')

  const stats = reactive({
    hero: { 善恶: 25, 谋略: 88, 堕落: 40, 名声: 100 },
    chars: {
      裴叙川: { 爱意: 80, 怀疑: 0 },
      程宴:   { 爱意: 100, 狩猎: 10 },
      周予璨: { 爱意: 70, 狩猎: 20 },
      谢凛:   { 爱意: 80, 狩猎: 10 },
    }
  })

  // API 消息历史（含 hidden 标记，display 时过滤）
  const messages = ref([])

  // 最新一条 AI 回复的解析结果
  const latestParsed = ref({ narrative: '', location: '', choices: [], raw: '' })

  async function callAPI() {
    isLoading.value = true
    apiError.value  = ''
    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.value.map(m => ({ role: m.role, content: m.content }))
      ]
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: apiMessages,
          temperature: 0.85,
          max_tokens: 4000,
        })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || `请求失败 HTTP ${res.status}`)
      }
      const data    = await res.json()
      const content = data.choices?.[0]?.message?.content || ''
      messages.value.push({ role: 'assistant', content })
      latestParsed.value = parseResponse(content)
    } catch (e) {
      apiError.value = e.message || '网络错误，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }

  async function startGame() {
    day.value    = 1
    period.value = 'work'
    Object.assign(stats.hero, { 善恶: 25, 谋略: 88, 堕落: 40, 名声: 100 })
    Object.assign(stats.chars.裴叙川, { 爱意: 80, 怀疑: 0 })
    Object.assign(stats.chars.程宴,   { 爱意: 100, 狩猎: 10 })
    Object.assign(stats.chars.周予璨, { 爱意: 70, 狩猎: 20 })
    Object.assign(stats.chars.谢凛,   { 爱意: 80, 狩猎: 10 })
    messages.value     = []
    latestParsed.value = { narrative: '', location: '', choices: [], raw: '' }
    gameStarted.value  = true

    // 隐藏的触发消息，不显示给玩家
    messages.value.push({
      role: 'user',
      content: '【游戏开始·第1天上班时段】请开始游戏，触发第一回合固定事件：实习生周予璨首日向市场部部长林清池报到。请严格按照回复格式输出。',
      hidden: true
    })
    await callAPI()
  }

  async function sendChoice(choiceText) {
    const tag = `【第${day.value}天·${periodLabel.value}】`
    messages.value.push({ role: 'user', content: `${tag} 我的选择：${choiceText}` })
    await callAPI()
    // 推进时间
    if (period.value === 'work') {
      period.value = 'afterwork'
    } else {
      period.value = 'work'
      day.value += 1
    }
  }

  // ── 存档 ─────────────────────────────────────
  function getSnapshot() {
    return {
      updatedAt: new Date().toISOString(),
      day: day.value,
      period: period.value,
      stats: JSON.parse(JSON.stringify(stats)),
      messages: JSON.parse(JSON.stringify(messages.value)),
      latestParsed: JSON.parse(JSON.stringify(latestParsed.value)),
    }
  }

  function applySnapshot(data) {
    day.value    = data.day ?? 1
    period.value = data.period ?? 'work'
    Object.assign(stats.hero, data.stats?.hero ?? {})
    Object.keys(stats.chars).forEach(k => {
      if (data.stats?.chars?.[k]) Object.assign(stats.chars[k], data.stats.chars[k])
    })
    messages.value     = data.messages ?? []
    latestParsed.value = data.latestParsed ?? { narrative: '', location: '', choices: [], raw: '' }
    gameStarted.value  = true
  }

  function saveToSlot(slot) {
    saveSlots.value[slot] = getSnapshot()
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveSlots.value))
  }

  function loadFromSlot(slot) {
    const data = saveSlots.value[slot]
    if (!data) return false
    applySnapshot(data)
    return true
  }

  function deleteSaveSlot(slot) {
    saveSlots.value[slot] = null
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveSlots.value))
  }

  return {
    saveSlots, gameStarted, isLoading, apiError,
    day, period, periodLabel, stats,
    messages, latestParsed,
    startGame, sendChoice, callAPI,
    exitGame: () => { gameStarted.value = false },
    saveToSlot, loadFromSlot, deleteSaveSlot,
  }
})
