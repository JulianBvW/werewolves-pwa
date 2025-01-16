<script setup></script>

<template>
    <div>
        <div class="absolut grid grid-cols-12 bg-gray-300 p-4">
            <div class="col-span-2 self-center">
                <img
                    src="../assets/back.svg"
                    alt="Back"
                    class="svg-slate size-6"
                    @click="$router.push('/')" />
            </div>
            <div class="col-span-8 text-center text-2xl font-semibold">
                Manage Cards
            </div>
            <div class="col-span-2"></div>
        </div>
        <div class="h-screen w-screen bg-gray-200 pt-40">body<br />hi</div>
    </div>
</template>

<style scoped></style>
