<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'

// const playerId = parseInt(useRoute().params.id)
// const players = ref([])
const title = ref('Add Player')

// onMounted(() => {
//     const storedPlayers = localStorage.getItem('players')
//     players.value = storedPlayers ? JSON.parse(storedPlayers) : []
// })

const router = useRouter()
const name = ref('')
const photoPreview = ref(null)
const photoFile = ref(null)

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

const addPlayer = async () => {
    if (!name.value || !photoFile.value) {
        return
    }

    // Get players from localStorage or initialize an empty array
    const players = JSON.parse(localStorage.getItem('players') || '[]')

    // Calculate the next ID
    const nextId =
        players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1

    // Add the new player to the array
    const newPlayer = { id: nextId, name: name.value }
    console.log('pl')
    console.log(players)
    console.log('ls')
    console.log(localStorage)
    console.log('gp')
    console.log(localStorage.getItem('players'))
    players.push(newPlayer)

    // Save updated players to localStorage
    localStorage.setItem('players', JSON.stringify(players))

    // Save the photo in Cache Storage
    const cache = await caches.open('werewolves-pwa-cache')
    const photoBlob = new Blob([photoFile.value], {
        type: photoFile.value.type
    })
    await cache.put(`player-${nextId}`, new Response(photoBlob))

    // Navigate back to the players page
    router.push('/players')
}
</script>

<template>
    <div>
        <Header :title="title" :backroute="'/players'"></Header>
        <div class="mt-20 h-screen w-screen p-10">
            <!-- Input for player name -->
            <input
                v-model="name"
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
                    class="h-32 w-32 overflow-hidden rounded-full border border-gray-300">
                    <img
                        :src="photoPreview"
                        alt="Player Preview"
                        class="h-full w-full object-cover" />
                </div>
            </div>
            <!-- Add Player Button -->
            <button
                @click="addPlayer"
                class="mt-4 w-full rounded-lg bg-slate-700 px-6 py-3 text-lg text-white hover:bg-slate-500">
                Add Player
            </button>
        </div>
    </div>
</template>

<style scoped></style>
