<script setup>
import { ref, watch, onMounted } from 'vue'
import Search from '../components/Search.vue'
import Tabs from '../components/Tabs.vue'
import NextHours from '../components/NextHours.vue'
import NextDays from '../components/NextDays.vue'
import { getWeatherForecasts } from '../services/weatherApi'

const currentCity = ref({})
const hourlyForecastData = ref([])
const dailyForecastData = ref([])
const isLoadingWeather = ref(false)
const weatherError = ref(null)

function updateCity(city) {
  currentCity.value = city
}

async function loadWeatherData(city, cached = true) {
  if (!city || !city.lat || !city.lon) {
    hourlyForecastData.value = []
    dailyForecastData.value = []
    weatherError.value = null
    return
  }
  isLoadingWeather.value = true
  weatherError.value = null
  try {
    const { hourlyForecast, dailyForecast } = await getWeatherForecasts(city.lat, city.lon, cached)
    hourlyForecastData.value = hourlyForecast
    dailyForecastData.value = dailyForecast
  } catch (err) {
    console.error("Error loading weather data in Home:", err)
    weatherError.value = 'Failed to load weather data.'
    hourlyForecastData.value = []
    dailyForecastData.value = []
  } finally {
    isLoadingWeather.value = false
  }
}

function handleRefresh() {
  if (currentCity.value && currentCity.value.lat !== undefined && currentCity.value.lon !== undefined) {
    loadWeatherData(currentCity.value, false) // Pass false to force refresh;
  } else {
    // Optionally, provide feedback if no city is selected to refresh
    console.log("No city selected to refresh.");
  }
}

watch(currentCity, (newCity) => {
  if (newCity && newCity.lat !== undefined && newCity.lon !== undefined) {
    loadWeatherData(newCity)
  } else {
    // Clear data if city is invalid or cleared
    hourlyForecastData.value = []
    dailyForecastData.value = []
    weatherError.value = null
  }
}, { deep: true })

onMounted(() => {
  currentCity.value = {
    id: '3451190',
    name: 'Rio de Janeiro',
    lat: -22.9068,
    lon: -43.1729,
    country: 'Brazil'
  };
  if (currentCity.value.id) { 
    loadWeatherData(currentCity.value);
  }
});

</script>

<template>
  <h2>Weather App</h2>
  <div>
    <Search @updateCity="updateCity" />
    <Tabs 
      :selected-country-id="currentCity.id"
      @updateCity="updateCity" 
    />
    <div class="refresh-container">
      <button 
        @click="handleRefresh" 
        class="refresh-button" 
        title="Refresh weather data"
        v-if="!isLoadingWeather && currentCity.id"
      >
      🔄
      </button>
      <h3 v-if="currentCity.name" class="refresh-header">
        {{ currentCity.name }} 
      </h3>
    </div>

    <div v-if="currentCity.name">
      <NextHours
        :hourly-forecast="hourlyForecastData"
        :is-loading="isLoadingWeather"
        :error="weatherError"
      />
      <NextDays
        :daily-forecast="dailyForecastData"
        :is-loading="isLoadingWeather"
        :error="weatherError"
      />
    </div>
    <div v-else-if="!isLoadingWeather && !weatherError">
      <p>Please select a city to see the weather forecast.</p>
    </div>
    <div v-if="isLoadingWeather">
      <p>Loading weather data...</p>
    </div>
    <div v-if="weatherError && !isLoadingWeather">
      <p class="error">{{ weatherError }}</p>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
}

.refresh-button {
  background-color: transparent;
  border: none;
  padding: 0px;
  margin: 0px;
  cursor: pointer;
  font-size: 24px;
  position: absolute;
  top: 0;
  left: 0;
}

.refresh-container {
  position: relative;
}

.refresh-header {
  margin: 0;
  padding: 0;
}
</style>