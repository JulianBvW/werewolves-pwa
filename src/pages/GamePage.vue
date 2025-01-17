<script setup>
import Header from '../components/Header.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const playerList = JSON.parse(decodeURIComponent(route.query.playerList))
const cardList = JSON.parse(decodeURIComponent(route.query.cardList))

const players = ref([])
const cachePhotosPlayers = ref({})

const cards = ref([])
const cachePhotosCards = ref({})
const cardNames = reactive({})

const cardShown = ref(null)
const showIdentities = ref(false)

const fetchPlayers = async () => {
    // Fetch players
    let allPlayers = JSON.parse(localStorage.getItem('players') || '[]')
    allPlayers = allPlayers.filter((player) => playerList.includes(player.id))
    let i = 0
    for (const player of allPlayers) {
        player['assignedCardId'] = cardList[i]
        i++
    }
    players.value = allPlayers

    // Fetch photos
    const cache = await caches.open('werewolves-pwa-cache')
    for (const player of players.value) {
        const cachedPhoto = await cache.match(`player/player-${player.id}`)
        if (cachedPhoto) {
            const photoBlob = await cachedPhoto.blob()
            cachePhotosPlayers.value[player.id] = URL.createObjectURL(photoBlob)
        }
    }
}

const fetchCards = async () => {
    // Fetch cards
    cards.value = JSON.parse(localStorage.getItem('cards') || '[]')

    // Fetch photos
    const cache = await caches.open('werewolves-pwa-cache')
    for (const card of cards.value) {
        const cachedPhoto = await cache.match(`card/card-${card.id}`)
        if (cachedPhoto) {
            const photoBlob = await cachedPhoto.blob()
            cachePhotosCards.value[card.id] = URL.createObjectURL(photoBlob)
        }
    }

    for (const card of cards.value) {
        cardNames[card.id] = card.name
    }
}

onMounted(async () => {
    fetchPlayers()
    fetchCards()
})
</script>

<template>
    <div>
        <Header :title="''" :backroute="'/'"></Header>
        <div class="w-screen pt-20">
            <div class="p-6">
                <div class="mt-8 grid grid-cols-3 gap-2">
                    <div
                        v-for="player in players"
                        :key="player.id"
                        class="flex flex-col items-center text-center"
                        @click="cardShown = player.assignedCardId">
                        <div
                            class="size-24 overflow-hidden rounded-full border-2 border-slate-600">
                            <img
                                :src="cachePhotosPlayers[player.id] || ''"
                                alt="Player Photo"
                                class="h-full w-full object-cover" />
                        </div>
                        <div
                            v-if="showIdentities"
                            class="mb-[-1rem] mr-[-4rem] mt-[-2rem] size-12 overflow-hidden rounded-xl border-2 border-slate-600">
                            <img
                                :src="
                                    cachePhotosCards[player.assignedCardId] ||
                                    ''
                                "
                                alt="Player Photo"
                                class="h-full w-full object-cover" />
                        </div>
                        <p class="mt-3 text-lg">
                            {{ player.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-10 flex w-screen justify-center">
            <button
                class="m-4 rounded-xl bg-slate-200 p-4"
                @click="showIdentities = !showIdentities">
                Show Identities
            </button>
        </div>
        <div v-if="cardShown" @click="cardShown = null">
            <div
                class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
                <img
                    :src="cachePhotosCards[cardShown] || ''"
                    alt="Player Photo"
                    class="size-72 rounded-2xl border-8 border-slate-800 object-cover" />
                <span class="mt-4 text-4xl font-semibold text-slate-200">{{
                    cardNames[cardShown]
                }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
