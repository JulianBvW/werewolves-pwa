<script setup>

</script>

<template>
  <h1 class="bg-slate-500">Home</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/players">Go to Players</RouterLink>
  </nav>
</template>

<style scoped>

</style>
