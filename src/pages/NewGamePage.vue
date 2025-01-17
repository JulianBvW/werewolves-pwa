<script setup>
import Header from '../components/Header.vue'
import { ref, reactive, onMounted, computed } from 'vue'

const players = ref([])
const cachePhotosPlayers = ref({})

const cards = ref([])
const cachePhotosCards = ref({})

const playersSelected = reactive({})
const cardsSelected = reactive({})

const correctNumberOfCards = computed(() => {
    const playerCount = players.value.reduce(
        (acc, v) => acc + playersSelected[v.id] * 1,
        0
    )
    const cardCount = cards.value.reduce(
        (acc, v) => acc + cardsSelected[v.id],
        0
    )
    return playerCount === cardCount
})

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

    // Set default card selection
    for (const card of cards.value) {
        cardsSelected[card.id] = 0
    }
}

function selectAll() {
    const someSelected = players.value.reduce(
        (acc, v) => acc || playersSelected[v.id],
        false
    )

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
        <div class="h-screen w-screen pt-20">
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
                            class="size-20 overflow-hidden rounded-full border-2 border-slate-600">
                            <img
                                :src="cachePhotosPlayers[player.id] || ''"
                                alt="Player Photo"
                                class="h-full w-full object-cover" />
                        </div>
                        <p
                            :class="
                                'mt-1 text-lg' +
                                (playersSelected[player.id]
                                    ? ' font-semibold text-green-500'
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
                                class="size-[4.5rem] overflow-hidden rounded-xl border-2 border-slate-600">
                                <img
                                    :src="cachePhotosCards[card.id] || ''"
                                    alt="Card Photo"
                                    class="h-full w-full object-cover" />
                            </div>
                            <p class="text-lg font-medium">
                                {{ card.name }}
                            </p>
                        </div>
                        <div
                            class="bg-sgreen-500 ml-4 flex h-full w-full flex-row justify-center gap-2">
                            <div
                                class="mt-4 size-14 overflow-hidden rounded-full border-2 border-slate-600 text-4xl leading-[2.7rem]"
                                @click="
                                    cardsSelected[card.id] = Math.max(
                                        0,
                                        cardsSelected[card.id] - 1
                                    )
                                ">
                                <span class="text-slate-600">-</span>
                            </div>
                            <div
                                class="mt-6 size-14 min-w-20 overflow-hidden text-4xl font-semibold">
                                <span
                                    :class="
                                        correctNumberOfCards
                                            ? 'text-slate-500'
                                            : 'text-red-600'
                                    "
                                    >{{ cardsSelected[card.id] }}</span
                                >
                            </div>
                            <div
                                class="mt-4 size-14 overflow-hidden rounded-full border-2 border-slate-600 text-4xl leading-[2.7rem]"
                                @click="cardsSelected[card.id]++">
                                <span class="text-slate-600">+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
