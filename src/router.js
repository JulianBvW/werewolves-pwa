import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import HelloWorld2 from './components/HelloWorld2.vue'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/players', component: HelloWorld2 },
  // { path: '/cards', component: CardManagementView },
  // { path: '/new_game', component: NewGameSettingsView },
  // { path: '/game', component: GameView },
  // { path: '/settings', component: SettingsView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
