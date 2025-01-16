import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import PlayersPage from './pages/PlayersPage.vue'
import CardsPage from './pages/CardsPage.vue'
import NewGamePage from './pages/NewGamePage.vue'
import GamePage from './pages/GamePage.vue'
import PlayerPage from './pages/PlayerPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/players', component: PlayersPage },
  { path: '/cards', component: CardsPage },
  { path: '/new-game', component: NewGamePage },
  { path: '/game', component: GamePage },
  { path: '/player/:id', component: PlayerPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
