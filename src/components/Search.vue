<script setup>
import { ref, computed, onMounted, watch } from 'vue' // Added watch

const emit = defineEmits(['updateCity'])

const searchQuery = ref('') // For direct v-model binding
const debouncedSearchTerm = ref('') // For debounced filtering
const allCities = ref([])
const cityNotSelected = ref(true) // To track if a city is selected

// Debounce utility function
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// Watch for changes in searchQuery and update debouncedSearchTerm after a delay
watch(searchQuery, debounce((newValue) => {
  cityNotSelected.value = true
  debouncedSearchTerm.value = newValue
}, 300)) // 300ms debounce delay, adjust as needed

const searchResults = computed(() => {
  if (!debouncedSearchTerm.value) { // Use the debounced term for filtering
    return []
  }
  // Ensure allCities.value is an array before filtering
  if (!Array.isArray(allCities.value)) {
    console.error("allCities is not an array:", allCities.value);
    return [];
  }
  return allCities.value.filter(city =>
    city && city.name && typeof city.name === 'string' && // Add checks for city and city.name
    city.name.toLowerCase().includes(debouncedSearchTerm.value.toLowerCase())
  ).slice(0, 10).sort((a, b) => {
    const c = debouncedSearchTerm.value.toLowerCase() === a.name.toLowerCase() ? -1 : 1
    const d = debouncedSearchTerm.value.toLowerCase() === b.name.toLowerCase() ? -1 : 1
    if (c === d) return 0
    return c > d ? 1 : -1
  })
})

async function fetchCities() {
  try {
    // Assuming cities.json is in the public folder
    const response = await fetch('/cities.json')
    if (!response.ok) {
      throw new Error('Failed to load city data')
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      allCities.value = data
    } else {
      console.error("Fetched city data is not an array:", data);
      allCities.value = []; // Set to empty array to prevent errors
    }
  } catch (error) {
    console.error('Error fetching cities:', error)
    allCities.value = []; // Set to empty array on error
  }
}

function selectCity(city) {
  emit('updateCity', city)
  searchQuery.value = city.name // Set input to selected city name
  debouncedSearchTerm.value = city.name // Update debounced term
  cityNotSelected.value = false
}

onMounted(() => {
  fetchCities()
})
</script>

<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a city..."
    />
    <!-- Show results if there's a search query and the (debounced) searchResults have items -->
    <ul v-if="searchResults.length && searchQuery && cityNotSelected">
      <li
        v-for="city in searchResults"
        :key="city.id"
        @click="selectCity(city)"
      >
        <span>{{ city.name }} </span> 
        <span v-if="city.country"> ({{ city.country }})</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search-container {
  margin-bottom: 20px;
  position: relative;
}
input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  position: absolute;
  width: 100%;
  z-index: 1000;
  background-color: #242424;
}
li {
  padding: 10px;
  cursor: pointer;
}
li:hover {
  background-color: #303030;
}
</style>