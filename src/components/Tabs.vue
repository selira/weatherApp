<script setup>
import { ref } from 'vue'

const emit = defineEmits(['updateCity'])

defineProps({
  selectedCountryId: String,
})

const predefinedCities = ref([
  { id: '3451190', name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'Brazil' },
  { id: '1816670', name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'China' },
  { id: '5368361', name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'United States' },
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
      :class="{ selected: selectedCountryId === city.id }"
    >
      {{ city.name }}
    </button>
  </div>
</template>

<style scoped>
.tabs-container {
  margin-bottom: 20px;
  display: flex;
  gap: 0px;
}

.tabs-container button {
  border-radius: 3px;
}

button {
  padding: 10px 15px;
  cursor: pointer;
}
button.selected {
  background-color: #007bff;
  color: white;
}
</style>