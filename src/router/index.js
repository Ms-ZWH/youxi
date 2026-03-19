import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Category from '@/views/Category.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '游戏大厅', showTab: true }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/Shop.vue'),
    meta: { title: '购买', showTab: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '我的', showTab: true }
  },
  {
    path: '/category/jinji',
    name: 'JinjiCategory',
    component: () => import('@/views/games/jinji/JinjiCategory.vue'),
    meta: { title: '禁忌之恋' }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    meta: { title: '游戏分类' }
  },
  {
    path: '/game/hougong/intro',
    name: 'HougongIntro',
    component: () => import('@/views/games/hougong/HougongIntro.vue'),
    meta: { title: '序章 · 游园惊梦', categoryId: 'hougong' }
  },
  {
    path: '/game/hougong/game-001',
    name: 'HougongGame001',
    component: () => import('@/views/games/hougong/HougongGame001.vue'),
    meta: { title: '穿越后宫我直播宫斗', categoryId: 'hougong' }
  },
  {
    path: '/game/jinji/game-001',
    name: 'JinjiGame001',
    component: () => import('@/views/games/jinji/JinjiGame001.vue'),
    meta: { title: '绑定富婆系统后，我包养了3个小白脸', categoryId: 'jinji' }
  },
  {
    path: '/game/jinji/renwei-001',
    name: 'RenweiGame001',
    component: () => import('@/views/games/jinji/RenweiGame001.vue'),
    meta: { title: '人妻模拟器之现代厌倦丈夫以后', categoryId: 'jinji' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 游戏乐园`
  }
})

export default router
