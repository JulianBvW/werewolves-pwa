<script setup>
// import { ref, onMounted } from 'vue'
import Header from '../components/Header.vue'

// const players = ref([])

// onMounted(() => {
//     const storedPlayers = localStorage.getItem('players')
//     players.value = storedPlayers ? JSON.parse(storedPlayers) : []
// })

import { ref, onMounted } from 'vue'

const players = ref([])
const cachePhotos = ref({})

// Fetch players and their photos on component mount
const fetchPlayers = async () => {
    // Get players from localStorage
    players.value = JSON.parse(localStorage.getItem('players') || '[]')

    // Retrieve photos from the Cache API
    const cache = await caches.open('werewolves-pwa-cache')
    for (const player of players.value) {
        const cachedPhoto = await cache.match(`player/player-${player.id}`)
        if (cachedPhoto) {
            const photoBlob = await cachedPhoto.blob()
            cachePhotos.value[player.id] = URL.createObjectURL(photoBlob)
        }
    }
}

// Fetch players when the component is mounted
onMounted(fetchPlayers)
</script>

<template>
    <div>
        <Header :title="'Manage Players'" :backroute="'/'"></Header>
        <div class="mt-10 h-screen w-screen bg-gray-200">
            <button @click="$router.push('/player/-1')">new</button>
            <div class="p-6">
                <div class="grid grid-cols-4 gap-6">
                    <div
                        v-for="player in players"
                        :key="player.id"
                        class="flex flex-col items-center text-center">
                        <!-- Player photo -->
                        <div
                            class="h-24 w-24 overflow-hidden rounded-full border border-gray-300">
                            <img
                                :src="cachePhotos[player.id] || ''"
                                alt="Player Photo"
                                class="h-full w-full object-cover" />
                        </div>

                        <!-- Player name -->
                        <p class="mt-2 text-lg font-medium">
                            {{ player.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
