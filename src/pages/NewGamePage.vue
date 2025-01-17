<script setup>
import Header from '../components/Header.vue'
import { ref, reactive, onMounted } from 'vue'

const players = ref([])
const cachePhotosPlayers = ref({})

const cards = ref([])
const cachePhotosCards = ref({})

const playersSelected = reactive({})

const fetchPlayers = async () => {
    // Fetch players
    players.value = JSON.parse(localStorage.getItem('players') || '[]')

    // Fetch photos
    const cache = await caches.open('werewolves-pwa-cache')
    for (const player of players.value) {
        const cachedPhoto = await cache.match(`player/player-${player.id}`)
        if (cachedPhoto) {
            const photoBlob = await cachedPhoto.blob()
            cachePhotosPlayers.value[player.id] = URL.createObjectURL(photoBlob)
        }
    }

    // Set default player selection
    for (const player of players.value) {
        playersSelected[player.id] = false
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
}

function selectAll() {
    let someSelected = false
    for (const player of players.value) {
        if (playersSelected[player.id]) {
            someSelected = true
        }
    }

    for (const player of players.value) {
        playersSelected[player.id] = !someSelected
    }
}

onMounted(async () => {
    fetchPlayers()
    fetchCards()
})
</script>

<template>
    <div>
        <Header :title="'New Game'" :backroute="'/'"></Header>
        <div class="mt-10 h-screen w-screen">
            <!-- Select Players-->
            <div class="p-6">
                <span
                    class="border-b-4 border-slate-300 text-xl font-semibold"
                    @click="selectAll">
                    Select Players
                </span>
                <div class="mt-8 grid grid-cols-4 gap-2">
                    <div
                        v-for="player in players"
                        :key="player.id"
                        :class="
                            'flex flex-col items-center text-center' +
                            (playersSelected[player.id] ? '' : ' opacity-40')
                        "
                        @click="
                            playersSelected[player.id] =
                                !playersSelected[player.id]
                        ">
                        <div
                            class="h-20 w-20 overflow-hidden rounded-full border-2 border-slate-600">
                            <img
                                :src="cachePhotosPlayers[player.id] || ''"
                                alt="Player Photo"
                                class="h-full w-full object-cover" />
                        </div>
                        <p
                            :class="
                                'mt-1 text-lg font-medium' +
                                (playersSelected[player.id]
                                    ? ' text-green-500'
                                    : '')
                            ">
                            {{ player.name }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Select Cards-->
            <div class="p-6">
                <span class="border-b-4 border-slate-300 text-xl font-semibold">
                    Select Cards
                </span>
                <div class="mt-8 grid grid-cols-1 gap-6">
                    <div
                        v-for="card in cards"
                        :key="card.id"
                        class="flex flex-row items-center text-center">
                        <div class="flex flex-col">
                            <div
                                class="h-[4.5rem] w-[4.5rem] overflow-hidden rounded-xl border-2 border-slate-600">
                                <img
                                    :src="cachePhotosCards[card.id] || ''"
                                    alt="Card Photo"
                                    class="h-full w-full object-cover" />
                            </div>
                            <p class="mt-0 text-lg font-medium">
                                {{ card.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
