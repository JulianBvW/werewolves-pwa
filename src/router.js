import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'

import PlayersPage from './pages/PlayersPage.vue'
import PlayerPage from './pages/PlayerPage.vue'

import CardsPage from './pages/CardsPage.vue'
import CardPage from './pages/CardPage.vue'

import NewGamePage from './pages/NewGamePage.vue'
import GamePage from './pages/GamePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/players', component: PlayersPage },
  { path: '/player/:id', component: PlayerPage },
  { path: '/cards', component: CardsPage },
  { path: '/card/:id', component: CardPage },
  { path: '/new-game', component: NewGamePage },
  { path: '/game', component: GamePage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
