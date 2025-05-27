<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const emit = defineEmits(['updateCity'])

const searchQuery = ref('')
const debouncedSearchTerm = ref('')
const allCities = ref([])
const isInputFocused = ref(false)
const searchResultsListRef = ref(null);

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
  debouncedSearchTerm.value = newValue
}, 300)) // 300ms debounce delay

const searchResults = computed(() => {
  if (!debouncedSearchTerm.value || !isInputFocused.value) {
    return []
  }
  if (!Array.isArray(allCities.value)) {
    console.error("allCities is not an array:", allCities.value);
    return [];
  }
  return allCities.value.filter(city =>
    city && city.name && typeof city.name === 'string' &&
    city.name.toLowerCase().includes(debouncedSearchTerm.value.toLowerCase())
  ).slice(0, 10).sort((a, b) => {
    const searchTermLower = debouncedSearchTerm.value.toLowerCase();
    const aNameLower = a.name.toLowerCase();
    const bNameLower = b.name.toLowerCase();

    // Prioritize exact matches
    if (aNameLower === searchTermLower && bNameLower !== searchTermLower) return -1;
    if (bNameLower === searchTermLower && aNameLower !== searchTermLower) return 1;
    
    // Then sort alphabetically for other matches
    if (aNameLower < bNameLower) return -1;
    if (aNameLower > bNameLower) return 1;
    return 0;
  })
})

async function fetchCities() {
  try {
    const response = await fetch('/cities.json')
    if (!response.ok) {
      throw new Error('Failed to load city data')
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      allCities.value = data
    } else {
      console.error("Fetched city data is not an array:", data);
      allCities.value = [];
    }
  } catch (error) {
    console.error('Error fetching cities:', error)
    allCities.value = [];
  }
}

function selectCity(city) {
  emit('updateCity', city)
  searchQuery.value = city.name
  debouncedSearchTerm.value = city.name
  isInputFocused.value = false
}

function handleInputFocus() {
  isInputFocused.value = true
}

function handleInputBlur(event) {
  if (event.relatedTarget && searchResultsListRef.value && searchResultsListRef.value.contains(event.relatedTarget)) {
    return;
  }
  isInputFocused.value = false
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
      @focus="handleInputFocus"
      @blur="handleInputBlur"
    />
    <ul 
      ref="searchResultsListRef" 
      v-if="searchResults.length && searchQuery && isInputFocused"
    >
      <li
        v-for="city in searchResults"
        :key="city.id"
        @click="selectCity(city)"
        tabindex="-1" 
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