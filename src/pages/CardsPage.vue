<script setup>
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue'

const cards = ref([])
const cachePhotos = ref({})

const fetchCards = async () => {
    // Fetch cards
    cards.value = JSON.parse(localStorage.getItem('cards') || '[]')

    // Fetch photos
    const cache = await caches.open('werewolves-pwa-cache')
    for (const card of cards.value) {
        const cachedPhoto = await cache.match(`card/card-${card.id}`)
        if (cachedPhoto) {
            const photoBlob = await cachedPhoto.blob()
            cachePhotos.value[card.id] = URL.createObjectURL(photoBlob)
        }
    }
}

onMounted(fetchCards)
</script>

<template>
    <div>
        <Header :title="'Manage Cards'" :backroute="'/'"></Header>
        <div class="mt-10 h-screen w-screen">
            <div class="p-6">
                <div class="grid grid-cols-3 gap-6">
                    <div
                        class="flex flex-col items-center text-center"
                        @click="$router.push('/card/-1')">
                        <div
                            class="h-24 w-24 overflow-hidden rounded-xl border-2 border-slate-600 p-[1px] text-7xl">
                            <span class="text-slate-500">+</span>
                        </div>
                        <p class="mt-2 text-lg font-medium">New Card</p>
                    </div>
                    <div
                        v-for="card in cards"
                        :key="card.id"
                        class="flex flex-col items-center text-center"
                        @click="$router.push('/card/' + card.id)">
                        <div
                            class="h-24 w-24 overflow-hidden rounded-xl border-2 border-slate-600">
                            <img
                                :src="cachePhotos[card.id] || ''"
                                alt="Card Photo"
                                class="h-full w-full object-cover" />
                        </div>
                        <p class="mt-2 text-lg font-medium">
                            {{ card.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
