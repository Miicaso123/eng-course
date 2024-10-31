import MainFull from '@/components/MainFull.vue'
import LevelLane from '@/components/LevelLane.vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AdminLane from '@/components/AdminLane.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'MainFull',
    component: MainFull
  },
  {
    path: '/test',
    name: 'LevelLane',
    component: LevelLane
  },
  {
    path: '/admin',
    name: 'AdminLane',
    component: AdminLane
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
