<script setup>
import Header from '../components/Header.vue'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const cardId = parseInt(route.params.id)

const cardName = ref('')
const photoPreview = ref('')
const photoFile = ref(null)

const cards = JSON.parse(localStorage.getItem('cards') || '[]')

const title = ref(cardId < 0 ? 'Add Card' : 'Edit Card')

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
    await cache.put(`card/card-${id}`, response)
}

const fetchCard = async () => {
    const card = cards.find((c) => c.id === cardId)

    if (!card) {
        alert('Card not found!')
        router.push('/cards')
        return
    }
    cardName.value = card.name

    // Load photo from Cache
    const cache = await caches.open('werewolves-pwa-cache')
    const cachedPhoto = await cache.match(`card-${card.id}`)
    if (cachedPhoto) {
        const photoBlob = await cachedPhoto.blob()
        photoPreview.value = URL.createObjectURL(photoBlob)
    }
}

const addCard = async () => {
    if (!cardName.value || !photoFile.value) {
        return
    }

    // Get next ID
    const nextId =
        cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1

    // Save updated players to localStorage
    cards.push({ id: nextId, name: cardName.value })
    localStorage.setItem('cards', JSON.stringify(cards))

    // Save the photo in Cache Storage
    savePhoto(nextId)

    router.push('/cards')
}

const editCard = async () => {
    if (!cardName.value) {
        return
    }

    // Save updated cards to localStorage
    const updatedCards = cards.map((c) =>
        c.id === cardId ? { ...c, name: cardName.value } : c
    )
    localStorage.setItem('cards', JSON.stringify(updatedCards))

    // Update photo in Cache Storage
    if (photoFile.value) {
        savePhoto(cardId)
    }

    router.push('/cards')
}

const deleteCard = async () => {
    // Remove card from localStorage
    const updatedCards = cards.filter((c) => c.id !== cardId)
    localStorage.setItem('cards', JSON.stringify(updatedCards))

    // Remove photo from Cache
    const cache = await caches.open('werewolves-pwa-cache')
    const cachedPhoto = await cache.match(`card-${cardId}`)
    await cache.delete(`card-${cardId}`)

    router.push('/cards')
}

onMounted(async () => {
    if (cardId < 0) {
        return
    }
    fetchCard()
})
</script>

<template>
    <div>
        <Header :title="title" :backroute="'/cards'"></Header>
        <div class="mt-20 h-screen w-screen p-10">
            <!-- Input for card name -->
            <input
                v-model="cardName"
                type="text"
                placeholder="Enter card name"
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
                    Upload Image
                </label>
                <div
                    v-if="photoPreview"
                    class="h-32 w-32 overflow-hidden rounded-xl border-2 border-slate-600">
                    <img
                        :src="photoPreview"
                        alt="Card Preview"
                        class="h-full w-full object-cover" />
                </div>
            </div>
            <!-- Add Card Button -->
            <button
                v-if="cardId < 0"
                @click="addCard"
                class="mt-4 w-full rounded-lg bg-slate-700 px-6 py-3 text-lg text-white hover:bg-slate-500">
                Add Card
            </button>
            <!-- Save Card Button -->
            <button
                v-if="cardId >= 0"
                @click="editCard"
                class="mt-4 w-full rounded-lg bg-slate-700 px-6 py-3 text-lg text-white hover:bg-slate-500">
                Save Card
            </button>
            <!-- Delete Card Button -->
            <button
                v-if="cardId >= 0"
                @click="deleteCard"
                class="mt-4 w-full rounded-lg bg-red-700 px-6 py-3 text-lg text-white hover:bg-red-500">
                Delete Card
            </button>
        </div>
    </div>
</template>

<style scoped></style>
