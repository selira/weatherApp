<script setup>
import { ref, watch } from 'vue'
import Search from '../components/Search.vue'
import Tabs from '../components/Tabs.vue'
import NextHours from '../components/NextHours.vue'
import NextDays from '../components/NextDays.vue'
import { getWeatherForecasts } from '../services/weatherApi'

defineProps({
  msg: String,
})

const currentCity = ref({})
const hourlyForecastData = ref([])
const dailyForecastData = ref([])
const isLoadingWeather = ref(false)
const weatherError = ref(null)

function updateCity(city) {
  currentCity.value = city
}

async function loadWeatherData(city) {
  if (!city || !city.lat || !city.lon) {
    hourlyForecastData.value = []
    dailyForecastData.value = []
    weatherError.value = null
    return
  }
  isLoadingWeather.value = true
  weatherError.value = null
  try {
    const { hourlyForecast, dailyForecast } = await getWeatherForecasts(city.lat, city.lon)
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

watch(currentCity, (newCity) => {
  if (newCity && newCity.lat !== undefined && newCity.lon !== undefined) {
    loadWeatherData(newCity)
  } else {
    // Clear data if city is invalid or cleared
    hourlyForecastData.value = []
    dailyForecastData.value = []
    weatherError.value = null
  }
}, { deep: true, immediate: true }) // immediate: true if you want to load for an initial city if set

</script>

<template>
  <h1>Weather App</h1>
  <div>
    <Search @updateCity="updateCity" />
    <Tabs @updateCity="updateCity" />

    <div v-if="currentCity.name">
      <NextHours
        :city-name="currentCity.name"
        :hourly-forecast="hourlyForecastData"
        :is-loading="isLoadingWeather"
        :error="weatherError"
      />
      <NextDays
        :city-name="currentCity.name"
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
</style>