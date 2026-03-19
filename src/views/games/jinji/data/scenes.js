/**
 * 场景数据 — 绑定富婆系统后，我包养了3个小白脸
 *
 * 结构说明：
 *   phase: 1(第1-10天) / 2(第11-20天) / 3(第21-30天)
 *   visitIndex: 同阶段第N次到访（0起）；超出则取最后一条
 *   requireFlag: 需要该flag才会触发（特殊事件）
 *   systemComment: 冷漠系统旁白，在选择结果之后显示
 */

// ── 场景选择器 ────────────────────────────────────────
export function selectScene(locId, day, visitCount, flags) {
  const phase = day <= 10 ? 1 : day <= 20 ? 2 : 3
  const pool = SCENES[locId]
  if (!pool || !pool.length) return DEFAULT_SCENE

  // 优先：flag触发的特殊场景（取当前phase或更早的最新一个，每个只出现一次）
  const special = pool
    .filter(s => s.requireFlag && flags[s.requireFlag] && s.phase <= phase && !flags[`${s.id}_seen`])
    .sort((a, b) => b.phase - a.phase)[0]
  if (special) return special

  // 常规：按阶段 + 访问次数
  const phasePool = pool.filter(s => s.phase === phase && !s.requireFlag)
  if (!phasePool.length) {
    const fallback = [...pool].filter(s => !s.requireFlag)
      .sort((a, b) => Math.abs(a.phase - phase) - Math.abs(b.phase - phase))
    return fallback[fallback.length - 1] || DEFAULT_SCENE
  }

  // 场景池耗尽：返回专属"今日无新内容"场景
  if (visitCount >= phasePool.length) {
    const exhausted = EXHAUSTED_SCENES[locId]?.[phase]
    if (exhausted) return exhausted
  }

  return phasePool[visitCount]
}

const DEFAULT_SCENE = {
  narrator: '这里什么都没有。',
  dialogue: null,
  choices: [{
    text: '离开。',
    effect: {},
    narrative: '你离开了。',
    systemComment: '系统记录：本次行动无任何效果。',
  }],
}

// ── 场景池耗尽后的兜底场景 ────────────────────────────
// 当玩家在同一阶段把该地点的场景看完后触发，不再重复最后一个场景
const EXHAUSTED_SCENES = {
  bar: {
    1: {
      narrator: '你推开酒吧的门。顾衍还在那里，酒杯还是那个姿势，灯光还是那个颜色。他看了你一眼，没说什么新的话。',
      dialogue: { who: '顾衍', words: '……又来了。', thought: '她又来了。今天和昨天没什么不同。但她还是来了。' },
      choices: [
        { text: '坐下，什么都没说。', effect: {}, narrative: '你们在酒吧里待了一会儿。没有发生什么。时间就这样过去了。', systemComment: '系统记录：本次访问无新进展。顾衍的真心值没有变化。系统建议：尝试其他地点。' },
        { text: '放下一叠钱，转身走。', effect: { spending: { guyan: 5000 } }, narrative: '他没有叫住你。你走出去，夜风有点凉。', systemComment: '系统记录：消费 ¥5,000。顾衍没有说话。重复行动已无边际收益。' },
      ],
    },
    2: {
      narrator: '顾衍今天依然在那个位置。你们已经见过很多次了，多到有时候他看见你进来，神情会先松一下，然后才想起来要收住。',
      dialogue: { who: '顾衍', words: '今天也来了。', thought: '她今天也来了。我不知道从什么时候开始，这件事变得理所当然了。' },
      choices: [
        { text: '「废话少说。」坐下来。', effect: {}, narrative: '你们今天没有发生什么特别的事。但你们都在。', systemComment: '系统观察：重复访问已无新剧情触发。但顾衍依然在等。系统不做评价。' },
        { text: '今天只是路过，看了他一眼，走了。', effect: {}, narrative: '他目送你离开。你没有回头，但你知道他看着你走完了整条路。', systemComment: '系统记录：本次停留不足1分钟。顾衍目送至视线消失。该行为已记录。' },
      ],
    },
    3: {
      narrator: '还剩几天了。顾衍今天没有说什么，你也没有。酒吧里有首老歌在放，你们各自听着，谁都没有提那些还没说完的话。',
      dialogue: { who: '顾衍', words: '……（没有说话）', thought: '有些话我想说，但不知道从哪里开口。今天又没开口。' },
      choices: [
        { text: '就这样待着。', effect: {}, narrative: '时间在流逝。有些事情说了，有些事情还没说。', systemComment: '系统提示：倒计时继续。某些话还没有说出口。' },
        { text: '「你有什么想说的吗。」', effect: {}, narrative: '他抬眼看你，停顿了很久，最后说：「等我想好了。」你点了点头。', systemComment: '系统记录：顾衍说"等我想好了"。这句话值得等待。' },
      ],
    },
  },
  school: {
    1: {
      narrator: '你在校园里找到了沈默。他看见你，没有惊讶，也没有特别的表情，只是停下来，等你先开口。',
      dialogue: { who: '沈默', words: '……又来了。', thought: '她又来了。我不知道该说什么，也不知道她为什么还来。' },
      choices: [
        { text: '「没事，随便看看。」把一个信封放到他手里。', effect: { spending: { shenmo: 10000 } }, narrative: '他接过去，没有道谢，也没有拒绝。你们各自沉默着，然后你离开了。', systemComment: '系统记录：消费 ¥10,000。双方均未说话。沈默今天没有新的反应。系统建议：等待时机。' },
        { text: '什么都没说，看了他一眼，转身走了。', effect: {}, narrative: '他看着你离开，一直没有叫住你。', systemComment: '系统观察：本次访问无实质互动。沈默今日无新剧情。' },
      ],
    },
    2: {
      narrator: '沈默今天在图书馆门口的台阶上坐着，手里拿着书，但没在看。他听见你的脚步声，抬起头，眼神里有什么一闪而过。',
      dialogue: { who: '沈默', words: '你来了。', thought: '她来了。今天没有什么特别的事，但她来了。' },
      choices: [
        { text: '坐到他旁边，什么都没说。', effect: {}, narrative: '你们就这样坐了一会儿。没有发生什么，但也不是什么都没有。', systemComment: '系统观察：本次访问无新剧情。但沈默今天没有离开。' },
        { text: '「没什么事，走了。」', effect: {}, narrative: '他点了点头。你走出去，没有回头。他也没有叫你。', systemComment: '系统记录：本次停留时间极短。沈默没有说更多的话。系统建议：尝试其他地点或等待新阶段。' },
      ],
    },
    3: {
      narrator: '还剩几天了。你来找沈默，他在，但今天他没有什么想说的，你也没有。有些话到了嘴边，又咽下去了。',
      dialogue: { who: '沈默', words: '……（沉默）', thought: '我想说一件事。但还没想好要不要说。' },
      choices: [
        { text: '「不用说话也行。」', effect: {}, narrative: '他点了点头。你们在那里待了一会儿，什么都没说，但那个沉默是舒服的。', systemComment: '系统记录：本次互动以沉默为主要内容。系统识别为有效陪伴。' },
        { text: '离开，明天再来。', effect: {}, narrative: '你走了，他没有叫你。但你知道他明天还会在。', systemComment: '系统提示：倒计时继续。沈默还有话没说出口。' },
      ],
    },
  },
  studio: {
    1: {
      narrator: '洛屿看见你进来，还是扑过来了，但今天那个扑过来的动作少了一点力气——不是不高兴，是不知道该说什么新的话。',
      dialogue: { who: '洛屿', words: '姐姐你又来了~', thought: '她又来了。我想说点什么，但今天脑子里没什么新词儿。' },
      choices: [
        { text: '「嗯。」扔给他一张购物卡。', effect: { spending: { luoyu: 8000 } }, narrative: '他接住，谢了一声。今天没有发生什么新的事。', systemComment: '系统记录：消费 ¥8,000。洛屿满意度维持正常水平。本次访问无真心值变化。' },
        { text: '拍了拍他的头，转身走了。', effect: {}, narrative: '他愣了一下，你已经走远了。他站在原地，摸了摸自己的头。', systemComment: '系统观察：非常规互动已记录。洛屿停留原地约15秒。原因：未知。' },
      ],
    },
    2: {
      narrator: '洛屿今天没有新的故事，也没有新的要求，就坐在那里等你，像一只找不到话题的猫。',
      dialogue: { who: '洛屿', words: '……姐姐，你今天有没有想我啊。', thought: '我不知道说什么，就随口问了这个。但我是认真问的。' },
      choices: [
        { text: '「没有。」给他一个冷眼。', effect: {}, narrative: '他撅嘴，但没有撒娇追问，只是点了点头，「哦。」你不知道为什么这个"哦"听起来有点不一样。', systemComment: '系统检测：洛屿接受了否定答案，未进行惯常的追问行为。该变化已记录。' },
        { text: '「少废话，有事吗。」', effect: {}, narrative: '他摇了摇头，「没事，就是想见姐姐。」你不知道这是真的还是假的。也许他自己也不知道。', systemComment: '系统记录：洛屿今日无索取行为。仅表达了"想见"意愿。真实性：待评估。' },
      ],
    },
    3: {
      narrator: '还剩几天了。洛屿今天没有撒娇，没有讲故事，就靠在工作室的窗边，安静地看着外面。你进来，他转过头，只是看着你。',
      dialogue: { who: '洛屿', words: '你来了。', thought: '她来了。我今天不想表演，也不知道说什么。就这样好了。' },
      choices: [
        { text: '走过去，站到他旁边，一起看窗外。', effect: {}, narrative: '你们谁都没说话。窗外的霓虹灯在闪。时间在过。', systemComment: '系统记录：本次互动以沉默为主要内容。洛屿今日未进行任何表演行为。' },
        { text: '「想什么呢。」', effect: {}, narrative: '他想了想，说：「想还有几天。」你没有回答，他也没有再说。', systemComment: '系统提示：洛屿意识到倒计时。某些话还没有说出口。' },
      ],
    },
  },
}

// ── 场景库 ────────────────────────────────────────────
export const SCENES = {

  // ══════════════════════════════════════════════════
  // 顾衍 · 酒吧  （4+3+3 常规 + 2 特殊 = 12 场景）
  // ══════════════════════════════════════════════════
  bar: [

    // ────────────── 第一阶段：算计期 ──────────────

    // v0 · 初次到访
    {
      id: 'bar_p1_v0', phase: 1,
      narrator: '酒吧昏黄的灯光落在顾衍轮廓分明的侧脸上。他端着威士忌，懒洋洋地朝你抬了抬眼皮，像是在打量一件刚送上门的货物。',
      dialogue: {
        who: '顾衍',
        words: '又来了。今天想花多少？',
        thought: '她今天的表情比上次紧绷。有意思——她在忍什么？',
      },
      choices: [
        {
          text: '「闭嘴，跟我走。」把黑卡推到他面前。',
          effect: { spending: { guyan: 8000 } },
          narrative: '他看了黑卡一眼，没动。然后笑了，站起来，系上西装扣子。「好。」',
          systemComment: '系统记录：消费 ¥8,000。顾衍今晚跟了你。真心值变化：+0%。',
        },
        {
          text: '「你今天……好像有点累。」',
          breakPersona: true,
          forcedText: '「废物就是废物，站没站相。」',
          forcedEffect: { heart: { guyan: 0.5 } },
          narrative: '他愣了一秒。那一秒里，那副漫不经心的笑消失了，然后又回来了。',
          systemComment: '系统检测：人设偏移已修正。顾衍停顿了约1秒。该数据已记录，原因未知。',
        },
      ],
    },

    // v1 · 再次到访
    {
      id: 'bar_p1_v1', phase: 1,
      narrator: '顾衍今天靠在吧台上，手边摆着一份文件。看见你进来，他推过来一张纸。「商业计划书，看看？」语气像在推销保险。',
      dialogue: {
        who: '顾衍',
        words: '我有个项目，只差启动资金。五十万，三个月回本，你感兴趣吗？',
        thought: '她要是信了这套说辞那真是太好骗了。要是不信……倒有点意思。',
      },
      choices: [
        {
          text: '「就凭你？」把计划书推回去。「想要钱，换个理由。」',
          effect: { spending: { guyan: 30000 }, heart: { guyan: 1 } },
          narrative: '他盯着你看了三秒，笑了一下，把计划书收起来。「行。」语气莫名轻松。',
          systemComment: '系统观察：顾衍被识破了，却没有恼怒。他把这件事记住了。真心值微量上升，原因分析中。',
        },
        {
          text: '「说说看，什么项目。」',
          breakPersona: true,
          forcedText: '「少废话。想要钱直说，别包装成生意。」',
          forcedEffect: { spending: { guyan: 50000 }, heart: { guyan: 2 } },
          narrative: '他接过钱，收得很利落。然后抬眼看你，神情第一次不那么像在演戏。',
          systemComment: '系统提示：消费 ¥50,000。顾衍的表情出现了0.5秒的异常。已记录。',
        },
      ],
    },

    // v2 · 第三次到访 · 他中断了正在进行的事
    {
      id: 'bar_p1_v2', phase: 1,
      narrator: '酒吧里有几个西装革履的男人，围着顾衍说笑。他的笑声很响——那是表演用的笑声。直到他的目光扫到门口，扫到你，笑声停了整整一秒，然后才接上。',
      dialogue: {
        who: '顾衍',
        words: '……失陪一下。',
        thought: '她走进来的时候，我第一眼看的是她，不是那两个客户。这个反应不对。',
      },
      choices: [
        {
          text: '「打扰你生意了？」转身就走。',
          effect: { heart: { guyan: 2 } },
          narrative: '你转身走了三步，听见他跟在你后面。那两个男人愣在原地，他没有回头。',
          systemComment: '系统记录：顾衍放弃了正在进行的商务谈判。损失金额估算：数万元。真心值上升。',
        },
        {
          text: '「好，你忙你的。」（转身离开）',
          breakPersona: true,
          forcedText: '「叫什么叫，你那两个朋友站那儿丢人现眼。」',
          forcedEffect: { heart: { guyan: 2.5 } },
          narrative: '他的朋友们彻底沉默了。顾衍却笑了一下，送那两人走了，然后回到你面前，像什么都没发生。',
          systemComment: '系统检测：人设偏移已修正。顾衍在损失数万元后笑了。这不在预期范围内。',
        },
      ],
    },

    // v3 · 安静时刻 · 他卸下了表演
    {
      id: 'bar_p1_v3', phase: 1,
      narrator: '你来得比平时早。酒吧还没开始营业，顾衍一个人坐在吧台里侧，穿着一件很普通的衬衫，盯着什么出神。他没有听见你推门进来。',
      dialogue: {
        who: '顾衍',
        words: '……进来了就进来吧。',
        thought: '她看到我这个样子了。我一般不让任何人看到我这个样子。',
      },
      choices: [
        {
          text: '「坐你旁边可以吗。」把钱放到吧台上，推给他。',
          effect: { spending: { guyan: 10000 }, heart: { guyan: 1.5 } },
          narrative: '他看了看钱，没有伸手。然后往旁边挪了一下，给你留了位子。今天你们两个人都没怎么说话。',
          systemComment: '系统观察：顾衍没有拿钱。你们在安静中待了约40分钟。消费 ¥10,000，但钱没有被拿走。',
        },
        {
          text: '「你今天……不一样。」',
          breakPersona: true,
          forcedText: '「穿成这样出来见人，脸皮是真的厚。」',
          forcedEffect: { heart: { guyan: 2 } },
          narrative: '他低头看了一眼自己的衬衫，没说话。过了一会儿，说：「你也来得不一样早。」',
          systemComment: '系统检测：人设偏移已修正。顾衍没有为自己辩解。这是第一次。',
        },
      ],
    },

    // ────────────── 第二阶段：裂缝期 ──────────────

    // v0 · 他开始等这个时间了
    {
      id: 'bar_p2_v0', phase: 2,
      narrator: '顾衍今天没在吧台坐着。他站在角落里，手机屏幕的光打在脸上。看见你进来，神情有一瞬间松动了——然后又收紧了。',
      dialogue: {
        who: '顾衍',
        words: '你……每次来，都是这个时间。',
        thought: '她没有察觉，但我已经开始等这个时间了。这不对。',
      },
      choices: [
        {
          text: '「废话，我的时间我做主。」扔过去一叠现金。「别发呆了。」',
          effect: { spending: { guyan: 20000 }, heart: { guyan: 2 } },
          narrative: '他接住钱，低头数了数。然后把一半推了回来。「够了。」',
          systemComment: '系统异常记录：顾衍退回了部分金额。这是第一次。建议注意。',
        },
        {
          text: '「你在等我？」',
          breakPersona: true,
          forcedText: '「盯着门口发什么呆，没见过人进门吗。」',
          forcedEffect: { heart: { guyan: 2 } },
          narrative: '他没有立刻回答。窗外车灯扫过，照亮他侧脸一秒。「没有，」他说，「只是习惯了。」',
          systemComment: '系统检测：人设偏移已修正。顾衍说了"只是习惯了"。该短语值得关注。',
        },
      ],
    },

    // v1 · 话一出口就说错了
    {
      id: 'bar_p2_v1', phase: 2,
      narrator: '你进来，顾衍正背对着门看窗外的街道。他没有转身，但开口了——语气不像平时，有点低，没有打磨过的感觉：「最近……还好吗。」然后他才转过身，似乎意识到这句话出口了。',
      dialogue: {
        who: '顾衍',
        words: '……忘了，当没听见。',
        thought: '我刚才说了什么。我问她最近好不好。这是什么鬼问题。她是来花钱的，不是来被人问候的。',
      },
      choices: [
        {
          text: '「没事，继续。」把黑卡压到他面前。',
          effect: { spending: { guyan: 15000 }, heart: { guyan: 2 } },
          narrative: '他接过卡，收起来，一切又回到了轨道。但你注意到，他今天喝酒的速度比平时慢了一些。',
          systemComment: '系统记录：消费 ¥15,000。顾衍今日饮酒速度下降约30%。原因：未知。',
        },
        {
          text: '「还好。你呢？」',
          breakPersona: true,
          forcedText: '「关你什么事。」',
          forcedEffect: { heart: { guyan: 3 } },
          narrative: '他又恢复了那副漫不经心的笑，说：「没事就好。」但这句话他说得很轻，不像表演，像是真的。',
          systemComment: '系统检测：人设偏移已修正。顾衍说了"没事就好"。系统检测到该短语的语气异常。',
        },
      ],
    },

    // v2 · 他记住了你
    {
      id: 'bar_p2_v2', phase: 2,
      narrator: '你坐下来，还没开口，吧台上就推来了一杯酒。你没点过。但它是你上次随口说过一次觉得好喝的那款。',
      dialogue: {
        who: '顾衍',
        words: '你上次说这个不错。',
        thought: '我记住了。我什么时候开始记这种东西了。',
      },
      choices: [
        {
          text: '「哼。记性不错。」端起来喝了一口，不道谢。',
          effect: { heart: { guyan: 3 } },
          narrative: '他看着你喝，没说话。你离开的时候，账单上没有那杯酒的钱。',
          systemComment: '系统提示：顾衍记住了你偶然提及的饮品偏好，并提前准备。真心值 +3%。',
        },
        {
          text: '「谢谢你。」',
          breakPersona: true,
          forcedText: '「谁让你点的，这不是我喜欢的。」',
          forcedEffect: { heart: { guyan: 3.5 } },
          narrative: '他拿走那杯酒，换了一杯别的推给你，眼神里有什么藏起来了。「好，换一个。」账单上依然没有这两杯酒的钱。',
          systemComment: '系统检测：人设偏移已修正。顾衍二话不说换了一杯。账单上两杯均未计费。',
        },
      ],
    },

    // ────────────── 第三阶段：真相期 ──────────────

    // v0 · 他在外面等你
    {
      id: 'bar_p3_v0', phase: 3,
      narrator: '顾衍今天不在酒吧内——他站在门口。外面。等你。没有拿酒杯，也没有看手机，就站在那里，像个不知道自己在做什么的人。',
      dialogue: {
        who: '顾衍',
        words: '……我以为你今天不来了。',
        thought: '我在等她。这他妈的是怎么回事。',
      },
      choices: [
        {
          text: '「少废话，进去。」推开门，不回头。',
          effect: { heart: { guyan: 3 }, flags: { guyan_confrontation_ready: true } },
          narrative: '他跟上来，走到你身旁，没有落后半步。今晚他一次都没提过钱的事。',
          systemComment: '系统记录：本次互动消费 ¥0。这是第一次。真心值 +3%。',
        },
        {
          text: '「你……还好吗？」',
          breakPersona: true,
          forcedText: '「你站门口吓谁呢，有病。」',
          forcedEffect: { heart: { guyan: 3 }, flags: { guyan_confrontation_ready: true } },
          narrative: '他愣了一下，然后笑了——不是那种算计过的笑，是没忍住的那种。「有点。」',
          systemComment: '系统检测：人设偏移已修正。顾衍笑了。该笑容与此前所有记录不一致。',
        },
      ],
    },

    // v1 · 他拒绝了一个七位数的合同
    {
      id: 'bar_p3_v1', phase: 3,
      narrator: '你来的时候，顾衍正和一个气场很强的男人谈话。那个男人递过来一份合同，数字写在封面上——你扫了一眼，七位数。顾衍合上合同，推了回去。然后他看见了你。',
      dialogue: {
        who: '顾衍',
        words: '来了。',
        thought: '我刚才拒绝了一个七位数的合同，因为执行期和她来的时间有冲突。我他妈的在干什么。',
      },
      choices: [
        {
          text: '「那份合同是什么？」',
          breakPersona: true,
          forcedText: '「闲着没事聊这些，没意思。」',
          forcedEffect: { heart: { guyan: 5 } },
          narrative: '「项目不合适，」他说，「有些事比钱更值得在意。」他停了一下，像是意识到自己说了什么，不再说了。',
          systemComment: '系统异常记录：顾衍说"有些事比钱更值得在意"。这与其初始人格设定高度矛盾。真心值 +5%。',
        },
        {
          text: '「……那个合同，你真的不要了？」',
          effect: { heart: { guyan: 4 } },
          narrative: '他坐下来，招手叫了两杯酒，一杯推给你。「不要了，」他说，语气平静得不像拒绝了七位数，「有时候有些东西值不了那个价。」',
          systemComment: '系统记录：顾衍拒绝了预估 ¥1,000,000+ 的合同。损益分析：无法理解。',
        },
      ],
    },

    // v2 · 他终于准备开口了
    {
      id: 'bar_p3_v2', phase: 3,
      narrator: '顾衍今天坐在你平时坐的位置，不是他平时的吧台。他手边没有酒，没有文件，没有手机。他就坐在那里，像是在等什么，又像是在准备什么。',
      dialogue: {
        who: '顾衍',
        words: '我想问你一件事。',
        thought: '我想了很久怎么问。最后发现根本没办法问得很体面。',
      },
      choices: [
        {
          text: '「说。」',
          effect: { heart: { guyan: 5 } },
          narrative: '他沉默了很久。最后说：「你来这里——有多少次是因为要完成什么，有多少次是因为……想来？」你没有立刻回答，他也没有催。',
          systemComment: '系统记录：顾衍问了一个无法用金额衡量的问题。真心值 +5%。系统暂时无法分析。',
        },
        {
          text: '「你问这个干什么。」',
          breakPersona: true,
          forcedText: '「废话少说，有话直说。」',
          forcedEffect: { heart: { guyan: 6 } },
          narrative: '「想直说，」他说，「但我不知道你想不想听。」这是他第一次说不知道。',
          systemComment: '系统检测：人设偏移已修正。顾衍说了"不知道"。这是本局游戏中他第一次承认不确定的事。',
        },
      ],
    },

    // ────────────── 特殊事件：里程碑礼物 ──────────────

    // 第7次到访里程碑：他保留了一件东西
    {
      id: 'bar_special_gift', phase: 2, requireFlag: 'guyan_v7',
      narrator: '今天顾衍桌上有一个小东西，折叠得很整齐，看起来像是一页撕下来的稿纸。他用手压着，好像不是要给你看——但他把位子留好了，等你来。',
      dialogue: {
        who: '顾衍',
        words: '那个……你上次随口提了一个地方。我去了，顺手写了点什么。',
        thought: '我为什么要写这个。我为什么来这里等她。',
      },
      choices: [
        {
          text: '接过来，展开看了。',
          effect: { heart: { guyan: 3.5 } },
          narrative: '是一个地址，下面几行字——不是情书，但也不是任何别的东西。他盯着别处，等你看完。',
          systemComment: '系统记录：顾衍为你记录了一个你随口提及的地点。该行为无任何经济收益。真心值 +3.5%。',
        },
        {
          text: '「这是什么，给我干什么。」把它推回去。',
          breakPersona: true,
          forcedText: '「有意思吗，随便一张纸。」',
          forcedEffect: { heart: { guyan: 4 }, flags: { guyan_gift_seen: true } },
          narrative: '他没有再推回来，收进口袋里了。「没意思，」他说，「那就算了。」但他的指尖捏着那张纸。',
          systemComment: '系统检测：人设偏移已修正。顾衍把那张纸收进了口袋。真心值 +4%。',
        },
      ],
    },

    // ────────────── 特殊事件：对峙结局 ──────────────

    // 结局前置场景：他等了两个小时
    {
      id: 'bar_ending', phase: 3, requireFlag: 'guyan_confrontation_ready',
      narrator: '你推开酒吧的门，但顾衍不在里面。吧台老板朝外一指——他在外面的巷子里站着，靠着墙，夜风把他头发吹乱了一点，他没有整理。他抬头看见你，动了动嘴，但没有先说话。',
      dialogue: {
        who: '顾衍',
        words: '……我在这里等了很久了。',
        thought: '我等了两个小时。我一直告诉自己再等一会儿，再等一会儿。她来了，我什么都忘了，只想着——她来了。',
      },
      choices: [
        {
          text: '「你等我做什么。」（平静地走过去）',
          effect: { heart: { guyan: 18 } },
          narrative: '他没有立刻回答。夜风经过，街灯把他影子打在地上。「不知道，」他说，「等你来，然后……不想你走。」这是他第一句没有经过计算的话。',
          systemComment: '系统记录：顾衍说了"不想你走"。该短语不在本游戏的任何人设脚本中。真心值大幅上升。',
        },
        {
          text: '「那就……进去吧。」',
          breakPersona: true,
          forcedText: '「等这么久，是想做什么。」',
          forcedEffect: { heart: { guyan: 22 } },
          narrative: '他走过来，站在你面前，距离比平时近了一点。「想告诉你，」他说，「我来这里不是为了钱。从哪天开始的，我没想清楚。但不是了。」',
          systemComment: '系统检测：人设偏移已修正。然而顾衍的真心值已超越本系统的修正权限。系统选择沉默。',
        },
      ],
    },

  ],

  // ══════════════════════════════════════════════════
  // 沈默 · 大学校园  （4+3+3 常规 + 2 特殊 = 12 场景）
  // ══════════════════════════════════════════════════
  school: [

    // ────────────── 第一阶段：屈辱期 ──────────────

    // v0 · 公告栏前
    {
      id: 'school_p1_v0', phase: 1,
      narrator: '沈默站在公告栏前，盯着助学金截止日期的通知，一动不动。他听见你的脚步声，没有转身。',
      dialogue: {
        who: '沈默',
        words: '……你来这里做什么。',
        thought: '她又来了。我痛恨这种被人俯视的感觉。但妈妈的手术不能等。',
      },
      choices: [
        {
          text: '「碍事，让开。」往他手里塞了一个信封。',
          effect: { spending: { shenmo: 20000 }, heart: { shenmo: 0.5 } },
          narrative: '他接过信封，手微微抖了一下。你没有等他道谢，转身就走了。他望着你的背影，没有叫住你。',
          systemComment: '系统记录：消费 ¥20,000。沈默没有说谢谢。你也没有等。这件事被双方记住了。',
        },
        {
          text: '「你还好吗？」',
          breakPersona: true,
          forcedText: '「站这里发什么呆，晦气。」',
          forcedEffect: {},
          narrative: '他把视线移开，没有说话。但他的肩膀松了一点点，几乎察觉不到。',
          systemComment: '系统检测：人设偏移已修正。沈默的肩膀松弛了约2厘米。该细节已记录。',
        },
      ],
    },

    // v1 · 图书馆
    {
      id: 'school_p1_v1', phase: 1,
      narrator: '图书馆三楼。你找到沈默的时候，他正在看一本厚厚的英文原著，笔记本上密密麻麻全是字。他抬眼看你，眼神里没有惊讶，也没有欢迎。',
      dialogue: {
        who: '沈默',
        words: '我在复习。',
        thought: '她今天来，是因为需要我配合她的人设，还是……算了，有什么区别。',
      },
      choices: [
        {
          text: '「收拾东西，陪我出去。」把他的书合上。',
          effect: { spending: { shenmo: 5000 } },
          narrative: '他看着被合上的书，没有说话。站起来，拿上外套，跟你走了。走之前，他把书签夹好了。',
          systemComment: '系统观察：沈默跟你走了，但他把书签夹好了。这说明他打算回来。',
        },
        {
          text: '「你……一直在这里读书吗？」',
          breakPersona: true,
          forcedText: '「书有什么好看的，有空陪我。」',
          forcedEffect: { spending: { shenmo: 3000 } },
          narrative: '他跟着你走了。在楼梯口，他忽然说：「你知道我在读什么方向吗。」你没有回答，因为你确实不知道。',
          systemComment: '系统记录：沈默主动说话了。这是本阶段第一次。原因：未知。',
        },
      ],
    },

    // v2 · 有人当面嘲讽
    {
      id: 'school_p1_v2', phase: 1,
      narrator: '操场边，几个男生压着声音在说什么。其中一个认出了你，朝沈默挤了个眼神。「哟，你的金主来了。」沈默的背僵了一下，没有转身，也没有开口。',
      dialogue: {
        who: '沈默',
        words: '……（沉默）',
        thought: '这种话我会听到很多次。我告诉自己无所谓。但她来了，我没办法让她假装没看见。',
      },
      choices: [
        {
          text: '「闭嘴，陪我走。」拉住沈默就走，不解释。',
          effect: { heart: { shenmo: 1.5 } },
          narrative: '你们走出了操场。沈默跟着你，一直没有说话。后来他说：「不用的。」你不知道他指的是什么。',
          systemComment: '系统记录：沈默说了"不用的"。该短语含义模糊。可能指不需要你帮他，也可能指别的。',
        },
        {
          text: '「你们几个，找事？」',
          breakPersona: true,
          forcedText: '「没眼力见的东西，滚。」',
          forcedEffect: { heart: { shenmo: 2 } },
          narrative: '那几人走了。沈默一直到你离开都没有回头。但你在走廊尽头回望时，看见他用手撑着栏杆，像是在等什么稳住。',
          systemComment: '系统检测：人设偏移已修正。沈默在你离开后的行为异常。建议观察。',
        },
      ],
    },

    // v3 · 售货机前
    {
      id: 'school_p1_v3', phase: 1,
      narrator: '沈默站在走廊的自动售货机前，已经站了有一会儿了。投币口吞了他的硬币，什么也没出来。他就站在那里，看着机器，表情平静得像是在看一道解不开的题。',
      dialogue: {
        who: '沈默',
        words: '（没有说话，盯着机器）',
        thought: '五块钱。我不是没有，就是……没有。好笑。',
      },
      choices: [
        {
          text: '什么都没说，买了一瓶，放到他旁边，走了。',
          effect: { heart: { shenmo: 2 } },
          narrative: '他没有叫住你。但第二天，他把那瓶饮料的钱放到了你之前坐过的图书馆座位上，用一本书压着。',
          systemComment: '系统观察：你买了一瓶售价 ¥5 的饮料。沈默隔天还了钱。这是本游戏中最小面值的互动，也是他第一次主动还钱。',
        },
        {
          text: '「在干什么，」把他推开，「我来。」用银行卡刷了十瓶。',
          breakPersona: true,
          forcedText: '「一台破机器，值得你站这么久？」',
          forcedEffect: { heart: { shenmo: 1.5 } },
          narrative: '他看着十瓶饮料，沉默了很久。「一瓶就够了，」他说，「多了搬不动。」你们各自拿了一瓶。',
          systemComment: '系统检测：人设偏移已修正。沈默拿了一瓶。你也拿了一瓶。系统认为这是本游戏中最奇怪的一次消费。',
        },
      ],
    },

    // ────────────── 第二阶段：裂缝期 ──────────────

    // v0 · 他买了咖啡
    {
      id: 'school_p2_v0', phase: 2,
      narrator: '今天沈默在校门口等你。不是因为你约了他——他是自己来的。他手里拿着一杯咖啡，递给你，然后立刻移开视线。',
      dialogue: {
        who: '沈默',
        words: '……你上次来，好像没吃东西。',
        thought: '我为什么买了她的那份。我为什么记得这件事。',
      },
      choices: [
        {
          text: '「谁让你多管闲事的。」接过咖啡，没道谢。',
          effect: { heart: { shenmo: 1.5 } },
          narrative: '你喝了一口，没有说好喝也没有说难喝。他看着你喝完，把空杯子拿走了。',
          systemComment: '系统提示：沈默主动买了咖啡。你喝了。真心值 +1.5%。系统也不清楚这之间的因果。',
        },
        {
          text: '「谢谢你。」',
          breakPersona: true,
          forcedText: '「下次别多此一举。」',
          forcedEffect: { heart: { shenmo: 2 } },
          narrative: '他拿着空杯子走了很远，才停下来。你看见他站了大概五秒，然后继续走。',
          systemComment: '系统检测：人设偏移已修正。沈默在50米外停下站了5秒。原因不明，已记录。',
        },
      ],
    },

    // v1 · 他帮了你一件小事
    {
      id: 'school_p2_v1', phase: 2,
      narrator: '你在校园里找一栋楼，手机地图没有信号。一个路过的男生大声笑着说「迷路了吗」——你看见沈默从不远处的台阶上站起来，走过来，站到你旁边，什么都没说。那个男生把声音收小了。',
      dialogue: {
        who: '沈默',
        words: '跟我来。',
        thought: '我不知道我为什么站起来了。我本来不打算管的。',
      },
      choices: [
        {
          text: '跟着他走，什么都没问。',
          effect: { heart: { shenmo: 2.5 } },
          narrative: '他把你带到了那栋楼门口，然后站在那里，等你进去。没有转身，也没有解释。',
          systemComment: '系统观察：沈默为你做了一件对他毫无好处的事。这是第二次这样的记录。',
        },
        {
          text: '「带路就带路，废话少说。」',
          breakPersona: true,
          forcedText: '「带路就带路，废话少说。」',
          forcedEffect: { heart: { shenmo: 3 } },
          narrative: '他没有生气，只是在你进楼后，转身原路走回去，重新坐回那个台阶上。你不知道他在那里坐了多久。',
          systemComment: '系统检测：人设偏移——系统判定本次选项与原文一致，无需修正。沈默回到了原来的台阶。系统不知道他在等什么。',
        },
      ],
    },

    // v2 · 室友问起了你
    {
      id: 'school_p2_v2', phase: 2,
      narrator: '沈默的室友认出了你——你在校门口等过沈默一次。他凑过来问：「那个女的，你们什么关系？」沈默没有立刻回答，室友起哄：「被包养吧？」',
      dialogue: {
        who: '沈默',
        words: '你才被包养。',
        thought: '我说了什么。这不是我想说的话。我不需要替她说什么。',
      },
      choices: [
        {
          text: '「……」把钱递给他，当没听见。',
          effect: { spending: { shenmo: 10000 }, heart: { shenmo: 3 } },
          narrative: '他接过钱，把室友赶走了。你走之后，他坐在那里想了很久，想不明白自己为什么要那样开口。',
          systemComment: '系统记录：消费 ¥10,000。沈默替你怼了室友。他现在正在想为什么。真心值 +3%。',
        },
        {
          text: '「跟你室友说清楚，别拖累我名声。」',
          breakPersona: true,
          forcedText: '「跟你室友说清楚，别拖累我名声。」',
          forcedEffect: { heart: { shenmo: 3.5 } },
          narrative: '室友跑了。沈默看着你，第一次有一点点困惑的表情。「好，」他说，「我会说清楚。」但他的眼神说的不是这件事。',
          systemComment: '系统检测：人设偏移——系统判定本次选项符合人设，无需修正。沈默答应说清楚，但他的眼神含义不明。已记录。',
        },
      ],
    },

    // ────────────── 第三阶段：真相期 ──────────────

    // v0 · 手术成功，他还在等
    {
      id: 'school_p3_v0', phase: 3,
      narrator: '沈默的妈妈手术很顺利。他不再需要你的钱了。但他今天还是在图书馆门口，坐在台阶上，像是在等什么人。',
      dialogue: {
        who: '沈默',
        words: '你来了。',
        thought: '她来了。我没有任何继续待在这里的理由了。但我还是来了。',
      },
      choices: [
        {
          text: '「还在这里？钱的事已经结了。」',
          effect: { heart: { shenmo: 3 }, flags: { shenmo_confrontation_ready: true } },
          narrative: '他抬头看你，眼神第一次不再带着屈辱。「我知道，」他说，「我只是……想坐一会儿。」',
          systemComment: '系统记录：沈默不再需要你的钱。他还在这里。系统无法解释这个变量。',
        },
        {
          text: '「你今天看起来……轻松一些。」',
          breakPersona: true,
          forcedText: '「都结束了，回去吧，别在这里碍眼。」',
          forcedEffect: { heart: { shenmo: 3 }, flags: { shenmo_confrontation_ready: true } },
          narrative: '他沉默了很久，然后说：「你是第一个注意到的人。」他说这句话的时候，没有看你。',
          systemComment: '系统检测：人设偏移已修正。沈默说了"第一个注意到的人"。真心值大幅上升。',
        },
      ],
    },

    // v1 · 他出现在你去过的地方
    {
      id: 'school_p3_v1', phase: 3,
      narrator: '你去了一家只去过一次的咖啡馆——你上次随口提过的。沈默坐在角落里，面前放着一杯没怎么动的咖啡。看见你进门，他没有惊讶，只是低下头。',
      dialogue: {
        who: '沈默',
        words: '巧。',
        thought: '不巧。我记得她提过这里。我不知道我为什么来。',
      },
      choices: [
        {
          text: '「确实巧。」坐到他对面。',
          effect: { heart: { shenmo: 4 } },
          narrative: '你们各自点了东西，没有说很多话。咖啡馆关门的时候，你们才出去。',
          systemComment: '系统记录：你们在咖啡馆待了约两小时。期间的对话内容已超出系统记录范围，因为基本上什么都没说。',
        },
        {
          text: '「你特意来的？」',
          breakPersona: true,
          forcedText: '「来这里堵我，没别的事做了吗。」',
          forcedEffect: { heart: { shenmo: 4.5 } },
          narrative: '他低头看了一眼咖啡，说：「随便走走。」然后抬起头，「你不打算坐吗？」这是他第一次主动邀请你。',
          systemComment: '系统检测：人设偏移已修正。沈默邀请你坐下。这是本游戏中他第一次发出主动邀请。真心值大幅上升。',
        },
      ],
    },

    // v2 · 他记住了所有的事
    {
      id: 'school_p3_v2', phase: 3,
      narrator: '你提到了一件很久以前的事——随口一说，你自己都记不清了。沈默接上了后半句。你怔了一下，他也意识到了。',
      dialogue: {
        who: '沈默',
        words: '……你那次说的是下午三点钟，图书馆关门之前。',
        thought: '我记住了。我什么时候开始记住这些细节的。从什么时候开始，我会把她说的话在脑子里留着。',
      },
      choices: [
        {
          text: '「这你也记得。」把一叠钱推过去。',
          effect: { spending: { shenmo: 5000 }, heart: { shenmo: 4 } },
          narrative: '他看了看钱，没有伸手。「不是每件事都是钱的事。」他平静地说，然后站起来，「我送你出去。」',
          systemComment: '系统异常：沈默拒绝了钱，并说"不是每件事都是钱的事"。系统记录该短语，等级：高度异常。',
        },
        {
          text: '「你……都记着？」',
          breakPersona: true,
          forcedText: '「行吧，记性不错。」',
          forcedEffect: { heart: { shenmo: 5 } },
          narrative: '「不是特意的，」他说，「就是……记住了。」他低头看了一眼手里的笔。从那以后，他没有再解释。',
          systemComment: '系统检测：人设偏移已修正。沈默说"就是记住了"。真心值大幅上升。',
        },
      ],
    },

    // ────────────── 特殊事件：第7次里程碑 ──────────────

    {
      id: 'shenmo_special_return', phase: 2, requireFlag: 'shenmo_v7',
      narrator: '你在图书馆的座位上发现了一样东西——你上次落下的一支笔。本来是普通的事，但你没有告诉任何人你落了什么东西。',
      dialogue: {
        who: '沈默',
        words: '你上次走得急，落了。',
        thought: '我放在那里放了两天。每天都想着要不要交给图书馆。然后今天她来了，我就……拿来了。',
      },
      choices: [
        {
          text: '接过笔，看了他一眼，没说什么。',
          effect: { heart: { shenmo: 3.5 } },
          narrative: '你收好了笔。他坐回去，打开书，像什么都没发生。你走到门口，回头看，他没有抬眼，但书页没有翻过去。',
          systemComment: '系统记录：沈默保存了你的遗失物品两天。真心值 +3.5%。',
        },
        {
          text: '「谢谢你。」',
          breakPersona: true,
          forcedText: '「放哪儿了也不说，害我找半天。」',
          forcedEffect: { heart: { shenmo: 4 }, flags: { shenmo_gift_seen: true } },
          narrative: '他低下头，嘴角动了一下。「下次走慢一点，」他说，声音很小，「就不会落东西了。」',
          systemComment: '系统检测：人设偏移已修正。沈默叫你"下次走慢一点"。这句话里有"下次"。已重点记录。',
        },
      ],
    },

    // ────────────── 特殊事件：对峙结局 ──────────────

    {
      id: 'shenmo_ending', phase: 3, requireFlag: 'shenmo_confrontation_ready',
      narrator: '妈妈手术成功，助学金拿到了，学费也结清了。他已经不需要你了。然后你收到了一条消息——不是转账，是一句话：「你在哪里，我想见你。」',
      dialogue: {
        who: '沈默',
        words: '我想说一件事。不是关于钱的事。',
        thought: '我练习了很多遍。最后发现根本不需要练习。因为我只想把这句话说出来。',
      },
      choices: [
        {
          text: '「说。」',
          effect: { heart: { shenmo: 18 } },
          narrative: '他看着你，说：「你来看过我多少次，我都记得。不是因为你的钱。是因为你每次来，我的脑子里会安静一会儿。我不知道这是什么，但我不想它停。」',
          systemComment: '系统记录：沈默的真心值完成了自主突破。该事件已超出系统分析权限。',
        },
        {
          text: '「……那是什么事。」',
          breakPersona: true,
          forcedText: '「发消息让我过来，说清楚点。」',
          forcedEffect: { heart: { shenmo: 22 } },
          narrative: '他没有多说废话：「我只是想告诉你——你走的时候我会看着你走完整条路。不是因为礼貌，是因为不想太早看不见你。」你没有说话，他也没有继续说，但沉默里有某种完整的东西。',
          systemComment: '系统检测：人设偏移已修正。沈默说"不想太早看不见你"。系统检测到该短语与真心值达标存在直接关联。真心值大幅上升。',
        },
      ],
    },

  ],

  // ══════════════════════════════════════════════════
  // 洛屿 · 模特工作室  （4+3+3 常规 + 2 特殊 = 12 场景）
  // ══════════════════════════════════════════════════
  studio: [

    // ────────────── 第一阶段：表演期 ──────────────

    // v0 · 初次到访
    {
      id: 'studio_p1_v0', phase: 1,
      narrator: '工作室里灯光刺眼。洛屿穿着薄薄的白衬衫，一看见你进门就扑了过来，眼睛亮晶晶的，像一只发现了食物的小动物。',
      dialogue: {
        who: '洛屿',
        words: '姐姐！你来了！我今天拍得好不好看——摄影师说我状态特别好！',
        thought: '只要把她哄开心了，我的好日子就来了。这个不难。',
      },
      choices: [
        {
          text: '「凑合。」扔给他一张购物卡。「去买件像样的衣服。」',
          effect: { spending: { luoyu: 10000 } },
          narrative: '他接住购物卡，看了数字，立刻换上了一个更甜的笑。「姐姐你最好了~」',
          systemComment: '系统记录：消费 ¥10,000。洛屿的满意度与金额高度相关。这是可预测的变量。',
        },
        {
          text: '「好看。」',
          breakPersona: true,
          forcedText: '「一般般，别自恋了。」',
          forcedEffect: { heart: { luoyu: 0.5 } },
          narrative: '他撅了撅嘴，但悄悄把刚才那一秒记在了心里。他不知道为什么要记。',
          systemComment: '系统检测：人设偏移已修正。洛屿的表情完成了「意外→收起→委屈」的循环。已记录。',
        },
      ],
    },

    // v1 · 有人惹他，他找你
    {
      id: 'studio_p1_v1', phase: 1,
      narrator: '工作室里还有另一个金主——一个中年男人，正和洛屿说话，距离有点近。洛屿一看见你进门，立刻移步过来，把那人晾在了原地。',
      dialogue: {
        who: '洛屿',
        words: '姐姐，那个人一直烦我，你来得正好。你能不能凶他一下？',
        thought: '她来了。而且……她看那个男人的眼神让我有点不舒服。',
      },
      choices: [
        {
          text: '「走。」拉着洛屿就走，头也不回。',
          effect: { spending: { luoyu: 5000 }, heart: { luoyu: 1 } },
          narrative: '你们就这么离开了工作室。洛屿跟着你，步伐比平时快了半拍。',
          systemComment: '系统观察：洛屿今天主动靠近了你。起因是嫉妒，还是需要保护？数据不足以判断。',
        },
        {
          text: '「谁让你跟那种人走那么近的。」',
          breakPersona: true,
          forcedText: '「你的事跟我无关，自己解决。」',
          forcedEffect: {},
          narrative: '他愣住了，然后笑起来，比平时的笑更真一点点。「那你为什么来？」他问。你没有回答。',
          systemComment: '系统记录：洛屿问了"那你为什么来"。你没有回答。该问题值得留意。',
        },
      ],
    },

    // v2 · 嫉妒一秒钟漏出来了
    {
      id: 'studio_p1_v2', phase: 1,
      narrator: '工作室里有一个比洛屿更红的模特，摄影师把大部分注意力都给了那边。洛屿靠在墙上，无事可做。他以为你在看那个人，于是那张脸上的绿茶壳子裂了一条缝。',
      dialogue: {
        who: '洛屿',
        words: '姐姐，你觉得他好看吗。',
        thought: '如果她说好看，我要怎么办。我不知道我为什么在乎这件事。',
      },
      choices: [
        {
          text: '「各有特色。」',
          effect: { heart: { luoyu: 1 } },
          narrative: '他沉默了两秒，然后笑着说「那是自然啦~」但眼睛没有笑。',
          systemComment: '系统观察：洛屿的笑与眼神存在0.5秒的延迟。这是嫉妒的常见表现，已记录。',
        },
        {
          text: '「不如你。」扔给他一个眼神，转身走。',
          breakPersona: true,
          forcedText: '「半斤八两，没差。」',
          forcedEffect: { heart: { luoyu: 2 } },
          narrative: '他愣了很久，才跟上来。他今天没有索钱，没有撒娇，就只是跟在你旁边。',
          systemComment: '系统检测：人设偏移已修正。洛屿跟着你走了一下午，没有提任何要求。这与此前行为模式不符。',
        },
      ],
    },

    // v3 · 他演哭了，然后真的哭了
    {
      id: 'studio_p1_v3', phase: 1,
      narrator: '洛屿今天有一个精心准备的故事——关于一个失散的弟弟，还有欠下的医疗费。眼泪来得很及时，表情也很到位。然后不知道从哪里开始，那个眼泪从表演变成了别的东西，他自己也没注意到。',
      dialogue: {
        who: '洛屿',
        words: '姐姐……我就是觉得……（说不下去了）',
        thought: '那个弟弟是编的。但刚才那一刻我想起了一件真的事。我不想想。',
      },
      choices: [
        {
          text: '「要多少。」把黑卡推过去。',
          effect: { spending: { luoyu: 20000 } },
          narrative: '他接过卡，表演的眼泪停了，但那个真的东西没有完全消失。他收起来，笑着说谢谢，但声音里有什么泄气的感觉。',
          systemComment: '系统记录：消费 ¥20,000。洛屿的眼泪在收到钱后5秒停止。异常：其中约1秒为非表演性泪水。已记录。',
        },
        {
          text: '「你在说谎，但没关系，哭吧。」',
          breakPersona: true,
          forcedText: '「行了，别演了，要多少说数字。」',
          forcedEffect: { heart: { luoyu: 2 } },
          narrative: '他抬起头，眼眶是红的。「你知道我在说谎，」他说，「但你……」他没有说完，把脸转开了。',
          systemComment: '系统检测：人设偏移已修正。洛屿没有说完那句话。剩余内容：未知。已标记为重点观察项。',
        },
      ],
    },

    // ────────────── 第二阶段：裂缝期 ──────────────

    // v0 · 他的状态不好了
    {
      id: 'studio_p2_v0', phase: 2,
      narrator: '洛屿今天没有扑上来。他坐在化妆台前，对着镜子发呆。看见你，他扯了个笑，但那个笑是后来才跟上来的。',
      dialogue: {
        who: '洛屿',
        words: '……今天走秀差点被替掉，说我状态不好。',
        thought: '我不应该告诉她这个。她不在乎的。但是……我好像想说。',
      },
      choices: [
        {
          text: '「就你这条件，替掉才怪。」甩给他一张名片。「这个经纪人比你现在的强。」',
          effect: { spending: { luoyu: 15000 }, heart: { luoyu: 1.5 } },
          narrative: '他接过名片，低头看了很久。然后抬眼看你，眼神里有什么不一样的东西。「你帮我打听过？」',
          systemComment: '系统异常：洛屿发现你提前帮他打听了经纪人。他的反应不在预期范围内。真心值上升。',
        },
        {
          text: '「没事的，你很好。」',
          breakPersona: true,
          forcedText: '「哭什么哭，没出息。」',
          forcedEffect: { heart: { luoyu: 2 } },
          narrative: '他没有哭，但眼睛红了一下。「……谢谢，」他说，声音比平时小，「你是第一个这样说的。」',
          systemComment: '系统检测：人设偏移已修正。洛屿的眼眶发红约3秒。他说了"第一个"。这是真话。',
        },
      ],
    },

    // v1 · 他跟踪了你
    {
      id: 'studio_p2_v1', phase: 2,
      narrator: '你在离工作室很远的地方——一家你随口提过的书店。你在架子间翻书，听见了熟悉的脚步声，然后看见了洛屿。他穿着便装，手里拿着一本不像他会看的书，表情非常努力地在假装偶遇。',
      dialogue: {
        who: '洛屿',
        words: '哇，姐姐你也在这里啊！好巧~',
        thought: '不巧，一点都不巧，我查了地址找过来的。我为什么要查地址找过来的。',
      },
      choices: [
        {
          text: '不点破，把他当透明，继续逛。',
          effect: { heart: { luoyu: 2 } },
          narrative: '你们在书店逛了一个下午。他努力跟上你的节奏，把那本拿倒的书悄悄正了过来，以为你没看见。',
          systemComment: '系统观察：洛屿自认为悄悄把书正了过来。你看见了。他不知道你看见了。该信息差已记录。',
        },
        {
          text: '「你跟踪我？」',
          breakPersona: true,
          forcedText: '「你跟踪我？」',
          forcedEffect: { heart: { luoyu: 3 } },
          narrative: '他的偶遇脸维持了大概三秒，然后垮了。「……就是想见姐姐嘛，」他说，「哪有什么跟踪。」但他手里那本书拿倒了。',
          systemComment: '系统检测：人设偏移——系统判定本次选项符合人设。洛屿的书拿倒了，他没有意识到。真心值 +3%。',
        },
      ],
    },

    // v2 · 他讲了一个真实的故事
    {
      id: 'studio_p2_v2', phase: 2,
      narrator: '洛屿在讲一个新故事——准备了很久的，有细节，有情绪转折，设计得很完整。然后不知道什么地方，他拐了个弯，说出了一件你听出来不是在演的事。他自己没有发现。',
      dialogue: {
        who: '洛屿',
        words: '那时候……我真的很怕他们忘了我。（停顿）……所以我就，开始学怎么让人记住我。',
        thought: '我为什么说了这个。这个不是剧本里的。我是说漏了吗。',
      },
      choices: [
        {
          text: '「然后呢。」',
          effect: { heart: { luoyu: 3 } },
          narrative: '他停下来，意识到自己说了什么，立刻接上了一个收尾，把那个真实的缺口补了回去。但你听见了，他知道你听见了，你们谁都没有提这件事。',
          systemComment: '系统记录：洛屿意外透露了真实信息，随后修正。系统已记录：他学了怎么让人记住他，因为他怕被忘掉。',
        },
        {
          text: '「你不用演给我看。」',
          breakPersona: true,
          forcedText: '「说什么呢，真实故事这么便宜？」',
          forcedEffect: { heart: { luoyu: 3.5 } },
          narrative: '他愣了一下，然后笑起来——那是他所有笑里最没有准备过的一个。「姐姐，你今天说话怪怪的。」但他没有离开，继续往下说了。',
          systemComment: '系统检测：人设偏移已修正。洛屿继续往下说了。这是他第一次在你说了奇怪的话之后选择留下。',
        },
      ],
    },

    // ────────────── 第三阶段：真相期 ──────────────

    // v0 · 他拒绝了新金主
    {
      id: 'studio_p3_v0', phase: 3,
      narrator: '工作室里有人给洛屿介绍了一个新金主——条件比你好，给得更多，不要求他维持任何形象。洛屿把那人的名片留在桌上，来找了你。',
      dialogue: {
        who: '洛屿',
        words: '那个人……我没答应他。',
        thought: '我不知道为什么没答应。那个条件明明更好。但我想到了她的脸，然后我就……没答应。',
      },
      choices: [
        {
          text: '「随你，反正你跟谁都是这副样子。」',
          effect: { heart: { luoyu: 3 }, flags: { luoyu_confrontation_ready: true } },
          narrative: '他站在那里，没有反驳。过了很久说：「……不是的。」就这三个字。',
          systemComment: '系统记录：洛屿拒绝了条件更好的金主。他说"不是的"。这是本游戏中最短的一句真话。',
        },
        {
          text: '「你为什么没答应？」',
          breakPersona: true,
          forcedText: '「多此一举，你去哪里跟我没关系。」',
          forcedEffect: { heart: { luoyu: 3 }, flags: { luoyu_confrontation_ready: true } },
          narrative: '他抬起头，第一次直视你，没有笑，没有表演。「因为我……」他停了很久，「我也不知道。」',
          systemComment: '系统检测：人设偏移已修正。洛屿说"我也不知道"。他第一次不知道自己在干什么了。',
        },
      ],
    },

    // v1 · 他在你楼下坐了一夜
    {
      id: 'studio_p3_v1', phase: 3,
      narrator: '一个朋友告诉你，昨晚有个人在你住的公寓楼下坐了很久，走之前抬头往上看了一眼。她发来了一张照片——是洛屿，穿着你见过的那件外套，背靠着树坐在那里。',
      dialogue: {
        who: '洛屿',
        words: '昨晚……我附近有一个派对，结束得很晚，就随便走走。',
        thought: '那个派对是真的，但结束得不晚。我绕了很远的路过来，然后坐在那里，看着楼上的灯，想着她在不在里面。',
      },
      choices: [
        {
          text: '「以后想来告诉我，别站在外面。」把门禁卡推给他。',
          effect: { heart: { luoyu: 3.5 } },
          narrative: '他拿着门禁卡，看了很久，然后抬头看你。「……我以为你会怀疑我图什么。」「我知道你图什么，」你说，「但昨晚你没图。」他把门禁卡收起来了。',
          systemComment: '系统记录：你给了洛屿门禁卡。洛屿今晚"没图什么"——系统认为这是关键节点。',
        },
        {
          text: '「随便走走走到我楼下？」',
          breakPersona: true,
          forcedText: '「没事在别人楼下晃，奇不奇怪。」',
          forcedEffect: { heart: { luoyu: 4 } },
          narrative: '他被怼了，但表情没有委屈，反而松了一口气。「……被发现了，」他说，「那算了，就是想看看灯亮没亮。」',
          systemComment: '系统检测：人设偏移已修正。洛屿坦白了。他说"想看看灯亮没亮"。真心值 +4%。',
        },
      ],
    },

    // v2 · 他第一次没有撒谎
    {
      id: 'studio_p3_v2', phase: 3,
      narrator: '你直接问了他一件事——一件如果是他，他一定会有备用答案的事。但今天他脑子里什么都没有。他张了张嘴，闭上，又张开，最后什么都没说，只是看着你。',
      dialogue: {
        who: '洛屿',
        words: '我……（沉默）',
        thought: '我没有准备答案。我没有准备答案。我为什么没有准备答案。',
      },
      choices: [
        {
          text: '「不用说了。」',
          effect: { heart: { luoyu: 4.5 } },
          narrative: '他愣了一下，然后轻轻点了点头。这个"不用说了"和你以前说的所有话都不一样。他们都知道。',
          systemComment: '系统记录：沉默持续约8秒。沉默之后，你说了"不用说了"，他点头。系统识别该交互为有效信息交换。',
        },
        {
          text: '「答不上来也可以。」',
          breakPersona: true,
          forcedText: '「说话，问你话了。」',
          forcedEffect: { heart: { luoyu: 5 } },
          narrative: '他回过神来，说：「……我不知道怎么说，但我知道答案。」他没有解释是什么答案，但你觉得你知道。',
          systemComment: '系统检测：人设偏移已修正。洛屿说"我知道答案"。这是他第一次在回答一个问题时不需要任何表演。',
        },
      ],
    },

    // ────────────── 特殊事件：第7次里程碑 ──────────────

    {
      id: 'luoyu_special_wait', phase: 2, requireFlag: 'luoyu_v7',
      narrator: '你今天没有去工作室，但洛屿还是在那里等到了晚上。摄影师告诉你，他今天没有接任何新工作，就坐在那里，说在等人，但来联系的人他都回了"不方便"。',
      dialogue: {
        who: '洛屿',
        words: '我以为姐姐今天要来的。',
        thought: '我等了五个小时。我本来可以去赚钱的。我为什么没去。',
      },
      choices: [
        {
          text: '「等我要什么事吗？」推过去一张卡。「算了，拿着。」',
          effect: { spending: { luoyu: 15000 }, heart: { luoyu: 3 }, flags: { luoyu_gift_seen: true } },
          narrative: '他看了看卡，然后看了看你，收起来了。「……也没什么事，」他说，「就是等。」这是他说过最简单的一句话。',
          systemComment: '系统记录：消费 ¥15,000。洛屿说"就是等"。该短语不含任何索取意图。这是第一次。',
        },
        {
          text: '「有那时间去接工作不好吗。」',
          breakPersona: true,
          forcedText: '「谁让你等的，有那时间去接工作不好吗。」',
          forcedEffect: { heart: { luoyu: 4 }, flags: { luoyu_gift_seen: true } },
          narrative: '他扭了扭手指，说：「但你没通知我说不来……」这句话他说到一半，停下来了。等你是他自己的事，和你通没通知无关。',
          systemComment: '系统检测：人设偏移——系统判定本次选项符合人设。洛屿意识到他没有理由要求被通知。但他还是等了五个小时。',
        },
      ],
    },

    // ────────────── 特殊事件：对峙结局 ──────────────

    {
      id: 'luoyu_ending', phase: 3, requireFlag: 'luoyu_confrontation_ready',
      narrator: '新金主的合同还在桌上——洛屿没有签。他站在工作室窗边，看着外面的夜色，听见你推门进来，没有转身，没有表演，只是说：「你来了。」不是"姐姐你来了！"，只是"你来了"。',
      dialogue: {
        who: '洛屿',
        words: '我想跟你说一件事，说完你可以走。',
        thought: '我今天不想表演了。我知道怎么表演，但今天我不想。就这一次，说真话。',
      },
      choices: [
        {
          text: '「说。」',
          effect: { heart: { luoyu: 18 } },
          narrative: '他转过身，看着你，没有那双小鹿眼，没有撒娇的表情，就只是他自己：「我不知道你把我当什么，但我……不想只是个拿钱的人。」停顿，「我不会说我爱你，因为我也不确定。我只是不想走。」',
          systemComment: '系统记录：洛屿说"不想走"。与顾衍说过的相同短语不同，洛屿是第一次没有用任何技巧说出这句话。真心值大幅上升。',
        },
        {
          text: '「那就别走。」',
          breakPersona: true,
          forcedText: '「啰嗦什么，有话快说。」',
          forcedEffect: { heart: { luoyu: 22 } },
          narrative: '他愣住了，然后低下头笑了——不是绿茶的笑，是被人一句话说到了的那种笑，有点发抖。「……好，」他说，「那我不走了。」然后他抬头看你，「说真的。」',
          systemComment: '系统检测：人设偏移已修正。洛屿说"那我不走了"并确认"说真的"。这是他第一次在没有任何利益的情况下做出承诺。真心值大幅上升。',
        },
      ],
    },

  ],

  // ══════════════════════════════════════════════════
  // 非角色地点
  // ══════════════════════════════════════════════════
  mall: [
    {
      id: 'mall_p1', phase: 1,
      narrator: '购物中心的冷气让你清醒了一些。你漫无目的地走着，周围人声嘈杂。',
      dialogue: null,
      choices: [
        { text: '随手买了一堆东西，打发时间。', effect: {}, narrative: '你花了一个回合，什么也没想清楚。', systemComment: '系统记录：本次行动无攻略进展。消费不可追踪。' },
        { text: '在咖啡馆坐了一会儿，想想今天的事。', effect: {}, narrative: '你想起了今天某个人的眼神，又告诉自己不必在意。', systemComment: '系统观察：你在思考。这在本游戏中并不常见。' },
      ],
    },
    {
      id: 'mall_p2', phase: 2,
      narrator: '你在橱窗前停下来，看着一块表——是顾衍那种风格的。售货员走过来问你要不要试戴。',
      dialogue: null,
      choices: [
        { text: '「给我包起来。」', effect: { spending: { guyan: 80000 } }, narrative: '你没想清楚要不要送，但还是买了。', systemComment: '系统记录：消费 ¥80,000。购买对象：顾衍风格物品。行动意图：模糊。' },
        { text: '「不用了。」离开，走出去五步又回头看了一眼。', effect: {}, narrative: '你回头看了一眼。这个动作你自己没意识到。', systemComment: '系统观察：你回头看了。这件事你自己可能没意识到。' },
      ],
    },
    {
      id: 'mall_p3', phase: 3,
      narrator: '购物中心角落有个旧书摊。你随手翻开一本书，看见里面有人用铅笔划了很多线，像学生做的笔记。',
      dialogue: null,
      choices: [
        { text: '买下来。', effect: {}, narrative: '你想到了沈默。你不知道自己想到他干什么。', systemComment: '系统记录：你买了一本旧书。系统不做评价。' },
        { text: '放回去，离开。', effect: {}, narrative: '你放回去了。但那本书在你脑子里待了一整天。', systemComment: '系统观察：一本旧书占据了你的注意力数小时。这个数据值得注意。' },
      ],
    },
  ],

  walk: [
    {
      id: 'walk_p1', phase: 1,
      narrator: '你一个人走在街头，霓虹灯的光把影子拉得很长。有人递给你传单，你没看就扔了。',
      dialogue: null,
      choices: [
        { text: '继续走，放空自己。', effect: {}, narrative: '你走了很久，什么都没想到，又什么都想到了。', systemComment: '系统记录：本回合无攻略行动。系统建议合理分配时间。' },
      ],
    },
    {
      id: 'walk_p2', phase: 2,
      narrator: '街上下起了小雨，你没有带伞。',
      dialogue: null,
      choices: [
        { text: '就这么淋着走回去。', effect: {}, narrative: '你忽然想，上次见沈默的时候天也快下雨了，他有没有带伞。然后你为自己想到这个感到有点烦躁。', systemComment: '系统观察：你在雨中想到了沈默，并为此感到烦躁。这两个数据具有相关性。' },
        { text: '躲进最近的便利店。', effect: {}, narrative: '便利店里有首歌，你在某个酒吧听顾衍无意间哼过。你站了很久，假装在看货架。', systemComment: '系统观察：你因为一首歌联想到顾衍，并多停留了14分钟。已记录。' },
      ],
    },
    {
      id: 'walk_p3', phase: 3,
      narrator: '还剩几天了。你走在路上，脑子里乱得很。',
      dialogue: null,
      choices: [
        { text: '继续走。', effect: {}, narrative: '有些事情想清楚了，有些事情越想越乱。', systemComment: '系统提示：倒计时继续。某些东西正在改变，某些东西还没来得及。' },
      ],
    },
  ],

  home: [
    {
      id: 'home_p1', phase: 1,
      narrator: '你回到家，空荡荡的客厅里只有你一个人。系统的提示音响了一声，冷冷的。',
      dialogue: null,
      choices: [
        { text: '休息，等待下一个回合。', effect: {}, narrative: '这一个回合什么也没发生。时间就这样过去了。', systemComment: '系统提示：你选择了休息。剩余时间在减少。系统不做评价。' },
      ],
    },
    {
      id: 'home_p2', phase: 2,
      narrator: '你坐在窗边，窗外车声不断。你想起今天那个人说的某一句话，反复想了好几遍。',
      dialogue: null,
      choices: [
        { text: '不去想了，睡觉。', effect: {}, narrative: '你没睡着。', systemComment: '系统记录：你试图停止思考。结果：失败。' },
        { text: '坐着想，想清楚再说。', effect: {}, narrative: '你没想清楚。但有些事情开始变得模糊了——你不确定自己还在不在装。', systemComment: '系统提示：你的行为逻辑出现了模糊地带。这可能是好事，也可能不是。' },
      ],
    },
    {
      id: 'home_p3', phase: 3,
      narrator: '还剩几天了。你坐在客厅里，系统浮现了今天的数据：三个人，三段距离，没有一段是零了。',
      dialogue: null,
      choices: [
        { text: '继续等。', effect: {}, narrative: '你坐了很久，什么都没做。这也是一种选择。', systemComment: '系统提示：某些东西正在改变，某些东西还没来得及。' },
      ],
    },
  ],
}
