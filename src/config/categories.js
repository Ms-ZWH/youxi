/**
 * 游戏分类配置
 * 每个分类包含：id、名称、描述、主题配置（颜色/背景风格）、游戏列表
 */
export const CATEGORIES = [
  {
    id: 'hougong',
    name: '后宫宅斗',
    icon: '👑',
    faIcon: 'fas fa-crown',
    desc: '宫廷权谋，步步为营，在深宫中书写你的传奇',
    theme: {
      primary: '#c0392b',
      secondary: '#f39c12',
      accent: '#8b0000',
      bg: '#1a0a00',
      cardBg: 'rgba(139, 0, 0, 0.15)',
      gradient: 'linear-gradient(135deg, #1a0a00 0%, #3d0c02 50%, #1a0a00 100%)',
      pattern: 'palace',
      textColor: '#f5d76e'
    },
    games: [
      {
        id: 'hougong-001',
        name: '穿越后宫我直播宫斗',
        icon: '📺',
        summary: '穿越进高难度宫斗游戏，开启直播间，从底层秀女一步步逆袭',
        tags: ['穿越', '无限重生', '养成', '宫斗'],
        isNew: true,
        routeName: 'HougongIntro',
      }
    ]
  },
  {
    id: 'jinji',
    name: '禁忌之恋',
    icon: '💔',
    faIcon: 'fas fa-heart-broken',
    desc: '命运交错，越界的爱恋，越是禁忌越是心动',
    routeName: 'JinjiCategory',
    theme: {
      primary: '#8e44ad',
      secondary: '#c0392b',
      accent: '#4a0033',
      bg: '#0d0010',
      cardBg: 'rgba(142, 68, 173, 0.15)',
      gradient: 'linear-gradient(135deg, #0d0010 0%, #2c0040 50%, #0d0010 100%)',
      pattern: 'rose',
      textColor: '#e8b4d8'
    },
    games: [
      {
        id: 'jinji-001',
        name: '绑定富婆系统后，我包养了3个小白脸',
        icon: '💰',
        summary: '绑定富婆系统，拥有无限金钱，却必须用"恶毒富婆"人设寻找真爱',
        tags: ['系统流', '多线攻略', '逆袭', '养成'],
        isNew: true,
        routeName: 'JinjiGame001',
      }
    ]
  },
  {
    id: 'jingying',
    name: '经营养成',
    icon: '🌱',
    faIcon: 'fas fa-seedling',
    desc: '从零打造属于你的小天地，经营生活的无限可能',
    theme: {
      primary: '#27ae60',
      secondary: '#f39c12',
      accent: '#1e8449',
      bg: '#0a1a0a',
      cardBg: 'rgba(39, 174, 96, 0.15)',
      gradient: 'linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #0a1a0a 100%)',
      pattern: 'leaf',
      textColor: '#a8e6cf'
    },
    games: []
  },
  {
    id: 'kuaichuan',
    name: '快穿穿书',
    icon: '📖',
    faIcon: 'fas fa-book-open',
    desc: '穿越世界，绑定系统，在无数故事中寻找归途',
    theme: {
      primary: '#2980b9',
      secondary: '#8e44ad',
      accent: '#1a5276',
      bg: '#050a1a',
      cardBg: 'rgba(41, 128, 185, 0.15)',
      gradient: 'linear-gradient(135deg, #050a1a 0%, #0a1f3d 50%, #050a1a 100%)',
      pattern: 'cyber',
      textColor: '#7fb3d3'
    },
    games: []
  },
  {
    id: 'lishi',
    name: '历史同人',
    icon: '🪶',
    faIcon: 'fas fa-feather-alt',
    desc: '以史为幕，与历史人物共赴一场跨越时空的故事',
    theme: {
      primary: '#b7950b',
      secondary: '#784212',
      accent: '#7d6608',
      bg: '#0f0c00',
      cardBg: 'rgba(183, 149, 11, 0.12)',
      gradient: 'linear-gradient(135deg, #0f0c00 0%, #2a2000 50%, #0f0c00 100%)',
      pattern: 'ink',
      textColor: '#d4ac0d'
    },
    games: []
  },
  {
    id: 'lianai',
    name: '恋爱养成',
    icon: '💗',
    faIcon: 'fas fa-heart',
    desc: '培养专属于你的甜蜜关系，解锁每一个动人瞬间',
    theme: {
      primary: '#e91e8c',
      secondary: '#ff6b9d',
      accent: '#ad1457',
      bg: '#0f0010',
      cardBg: 'rgba(233, 30, 140, 0.12)',
      gradient: 'linear-gradient(135deg, #0f0010 0%, #2a0030 50%, #0f0010 100%)',
      pattern: 'star',
      textColor: '#f8bbd9'
    },
    games: []
  },
  {
    id: 'lianzongh',
    name: '恋综娱乐园',
    icon: '🎪',
    faIcon: 'fas fa-star',
    desc: '燃情恋综现场，你就是今晚最耀眼的嘉宾',
    theme: {
      primary: '#ff4757',
      secondary: '#ffa502',
      accent: '#ff6348',
      bg: '#0a0010',
      cardBg: 'rgba(255, 71, 87, 0.12)',
      gradient: 'linear-gradient(135deg, #0a0010 0%, #1a0520 50%, #0a0010 100%)',
      pattern: 'neon',
      textColor: '#ff9ff3'
    },
    games: []
  },
  {
    id: 'lingyi',
    name: '灵异怪谈',
    icon: '👁️',
    faIcon: 'fas fa-eye',
    desc: '暗夜之中，那些不该知晓的秘密正在等待你',
    theme: {
      primary: '#4a4a8a',
      secondary: '#2c3e50',
      accent: '#1a1a3e',
      bg: '#010108',
      cardBg: 'rgba(74, 74, 138, 0.12)',
      gradient: 'linear-gradient(135deg, #010108 0%, #0a0a20 50%, #010108 100%)',
      pattern: 'fog',
      textColor: '#a29bfe'
    },
    games: []
  }
]

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id)
