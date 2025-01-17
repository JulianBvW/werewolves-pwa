<script setup>
const props = defineProps(['title', 'backroute', 'actionroute'])
</script>

<template>
    <div class="fixed z-10 grid w-screen grid-cols-12 bg-white p-4">
        <div class="col-span-2 self-center">
            <img
                src="../assets/back.svg"
                alt="Back"
                class="svg-slate size-6"
                @click="$router.push(props.backroute)" />
        </div>
        <div class="col-span-8 text-center text-2xl font-semibold">
            {{ props.title }}
        </div>
        <div
            v-if="props.actionroute"
            class="col-span-2 ml-auto mr-1 self-center">
            <img
                src="../assets/play.svg"
                alt="Back"
                class="svg-slate size-5 scale-y-110"
                @click="$router.push(props.actionroute)" />
        </div>
    </div>
</template>

<style scoped></style>
