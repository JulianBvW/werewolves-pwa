<script setup></script>

<template>
    <div
        class="grid h-screen content-center justify-center gap-4 text-2xl font-semibold">
        <button
            class="flex size-60 flex-col items-center justify-center gap-4 rounded-3xl border-4 border-slate-600 bg-slate-100 drop-shadow-xl active:bg-slate-200"
            @click="console.log($router.push('/new-game'))">
            <img
                src="../assets/wolf.svg"
                alt="Wolf Icon"
                class="svg-slate size-[8rem]" />
            New Game
        </button>
        <button
            class="h-20 w-60 rounded-3xl border-4 border-slate-600 bg-slate-100 drop-shadow-xl active:bg-slate-200"
            @click="console.log($router.push('/players'))">
            Players
        </button>
        <button
            class="h-20 w-60 rounded-3xl border-4 border-slate-600 bg-slate-100 drop-shadow-xl active:bg-slate-200"
            @click="console.log($router.push('/cards'))">
            Cards
        </button>
    </div>
</template>

<style scoped>
.svg-slate {
    filter: invert(30%) sepia(25%) saturate(502%) hue-rotate(176deg)
        brightness(95%) contrast(87%);
}
</style>
