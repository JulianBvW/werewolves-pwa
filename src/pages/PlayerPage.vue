<script setup>
import Header from '../components/Header.vue'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const playerId = parseInt(route.params.id)

const playerName = ref('')
const photoPreview = ref('')
const photoFile = ref(null)

const players = JSON.parse(localStorage.getItem('players') || '[]')

const title = ref(playerId < 0 ? 'Add Player' : 'Edit Player')

const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        photoFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
            photoPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const savePhoto = async (id) => {
    const cache = await caches.open('werewolves-pwa-cache')
    const response = new Response(photoFile.value, {
        headers: { 'Content-Type': photoFile.value.type }
    })
    await cache.put(`player/player-${id}`, response)
}

const fetchPlayer = async () => {
    const player = players.find((p) => p.id === playerId)

    if (!player) {
        alert('Player not found!')
        router.push('/players')
        return
    }
    playerName.value = player.name

    // Load photo from Cache
    const cache = await caches.open('werewolves-pwa-cache')
    const cachedPhoto = await cache.match(`player-${player.id}`)
    if (cachedPhoto) {
        const photoBlob = await cachedPhoto.blob()
        photoPreview.value = URL.createObjectURL(photoBlob)
    }
}

const addPlayer = async () => {
    if (!playerName.value || !photoFile.value) {
        return
    }

    // Get next ID
    const nextId =
        players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1

    // Save updated players to localStorage
    players.push({ id: nextId, name: playerName.value })
    localStorage.setItem('players', JSON.stringify(players))

    // Save the photo in Cache Storage
    savePhoto(nextId)

    router.push('/players')
}

const editPlayer = async () => {
    if (!playerName.value) {
        return
    }

    // Save updated players to localStorage
    const updatedPlayers = players.map((p) =>
        p.id === playerId ? { ...p, name: playerName.value } : p
    )
    localStorage.setItem('players', JSON.stringify(updatedPlayers))

    // Update photo in Cache Storage
    if (photoFile.value) {
        savePhoto(playerId)
    }

    router.push('/players')
}

const deletePlayer = async () => {
    // Remove player from localStorage
    const updatedPlayers = players.filter((p) => p.id !== playerId)
    localStorage.setItem('players', JSON.stringify(updatedPlayers))

    // Remove photo from Cache
    const cache = await caches.open('werewolves-pwa-cache')
    await cache.delete(`player-${playerId}`)

    router.push('/players')
}

onMounted(async () => {
    if (playerId < 0) {
        return
    }
    fetchPlayer()
})
</script>

<template>
    <div>
        <Header :title="title" :backroute="'/players'"></Header>
        <div class="mt-20 h-screen w-screen p-10">
            <!-- Input for player name -->
            <input
                v-model="playerName"
                type="text"
                placeholder="Enter player name"
                class="w-full rounded-lg border border-gray-300 p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <!-- Photo upload and preview -->
            <div class="flex flex-col items-center gap-4">
                <input
                    type="file"
                    accept="image/*"
                    @change="handlePhotoUpload"
                    class="hidden"
                    id="photoUpload" />
                <label
                    for="photoUpload"
                    class="mt-4 cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Upload Photo
                </label>
                <div
                    v-if="photoPreview"
                    class="h-32 w-32 overflow-hidden rounded-full border-2 border-slate-600">
                    <img
                        :src="photoPreview"
                        alt="Player Preview"
                        class="h-full w-full object-cover" />
                </div>
            </div>
            <!-- Add Player Button -->
            <button
                v-if="playerId < 0"
                @click="addPlayer"
                class="mt-4 w-full rounded-lg bg-slate-700 px-6 py-3 text-lg text-white hover:bg-slate-500">
                Add Player
            </button>
            <!-- Save Player Button -->
            <button
                v-if="playerId >= 0"
                @click="editPlayer"
                class="mt-4 w-full rounded-lg bg-slate-700 px-6 py-3 text-lg text-white hover:bg-slate-500">
                Save Player
            </button>
            <!-- Delete Player Button -->
            <button
                v-if="playerId >= 0"
                @click="deletePlayer"
                class="mt-4 w-full rounded-lg bg-red-700 px-6 py-3 text-lg text-white hover:bg-red-500">
                Delete Player
            </button>
        </div>
    </div>
</template>

<style scoped></style>
