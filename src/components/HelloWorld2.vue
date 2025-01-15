<script setup>
import { ref } from 'vue'

const i = ref(0)

function showStore() {
  const savedPlayers = JSON.parse(localStorage.getItem('players')) || []
  console.log(savedPlayers)
}

function addStore() {
  localStorage.setItem('players', JSON.stringify({'player': [i, 'cool']}))
  i.value++
}

function delStore() {
  localStorage.setItem('players', JSON.stringify(''))
  i.value++
}

</script>

<template>
  <h1>Players</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
  </nav>
  <hr>
  <button @click="showStore">Show</button>
  <hr>
  <button @click="addStore">Add</button>
  <hr>
  <button @click="delStore">Delete</button>
  <hr>
</template>

<style scoped>

</style>
