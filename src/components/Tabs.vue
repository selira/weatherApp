<script setup>
import { ref } from 'vue'

const emit = defineEmits(['updateCity'])

const predefinedCities = ref([
  { id: 'rio', name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
  { id: 'beijing', name: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { id: 'la', name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
])

function selectCity(city) {
  emit('updateCity', city)
}
</script>

<template>
  <div class="tabs-container">
    <button
      v-for="city in predefinedCities"
      :key="city.id"
      @click="selectCity(city)"
    >
      {{ city.name }}
    </button>
  </div>
</template>

<style scoped>
.tabs-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
button {
  padding: 10px 15px;
  cursor: pointer;
}
</style>