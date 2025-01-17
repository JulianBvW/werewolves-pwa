<script setup>
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue'

const players = ref([])
const cachePhotos = ref({})

const fetchPlayers = async () => {
    // Fetch players
    players.value = JSON.parse(localStorage.getItem('players') || '[]')

    // Fetch photos
    const cache = await caches.open('werewolves-pwa-cache')
    for (const player of players.value) {
        const cachedPhoto = await cache.match(`player/player-${player.id}`)
        if (cachedPhoto) {
            const photoBlob = await cachedPhoto.blob()
            cachePhotos.value[player.id] = URL.createObjectURL(photoBlob)
        }
    }
}

onMounted(fetchPlayers)
</script>

<template>
    <div>
        <Header :title="'Manage Players'" :backroute="'/'"></Header>
        <div class="h-screen w-screen pt-20">
            <div class="p-6">
                <div class="grid grid-cols-3 gap-6">
                    <div
                        class="flex flex-col items-center text-center"
                        @click="$router.push('/player/-1')">
                        <div
                            class="h-24 w-24 overflow-hidden rounded-full border-2 border-slate-600 p-[1px] text-7xl">
                            <span class="text-slate-500">+</span>
                        </div>
                        <p class="mt-2 text-lg font-medium">New Player</p>
                    </div>
                    <div
                        v-for="player in players"
                        :key="player.id"
                        class="flex flex-col items-center text-center"
                        @click="$router.push('/player/' + player.id)">
                        <div
                            class="h-24 w-24 overflow-hidden rounded-full border-2 border-slate-600">
                            <img
                                :src="cachePhotos[player.id] || ''"
                                alt="Player Photo"
                                class="h-full w-full object-cover" />
                        </div>
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
