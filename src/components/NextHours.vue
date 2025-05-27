<script setup>
// import { ref, watch, onMounted } from 'vue' // No longer needed for fetching
// import { getWeatherForecasts } from '../services/weatherApi' // No longer needed

const props = defineProps({
  cityName: String,
  hourlyForecast: Array,
  isLoading: Boolean,
  error: String,
})

function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <div class="next-hours-container">
    <h3>Next 5 Hours in {{ props.cityName || 'Selected City' }}</h3>
    <div v-if="props.isLoading">Loading hourly forecast...</div>
    <div v-else-if="props.error && !props.hourlyForecast?.length" class="error">{{ props.error }}</div>
    <div v-else-if="!props.isLoading && props.hourlyForecast && props.hourlyForecast.length" class="forecast-grid">
      <div v-for="hour in props.hourlyForecast" :key="hour.dt" class="hour-card">
        <p>{{ formatTime(hour.dt) }}</p>
        <img :src="getWeatherIconUrl(hour.icon)" :alt="hour.weather?.[0]?.description || 'Weather icon'">
        <p>{{ Math.round(hour.temp) }}°C</p>
        <p>Humidity: {{ hour.humidity }}%</p>
      </div>
    </div>
    <div v-else-if="!props.isLoading && !props.error && props.cityName && (!props.hourlyForecast || !props.hourlyForecast.length)">
      No hourly data available for {{ props.cityName }}.
    </div>
    <!-- Message for no city selected is now handled by Home.vue -->
  </div>
</template>

<style scoped>
.next-hours-container {
  margin-bottom: 20px;
}
.forecast-grid {
  display: flex;
  gap: 10px;
  overflow-x: auto; /* For smaller screens */
}
.hour-card {
  border: 1px solid #eee;
  padding: 10px;
  text-align: center;
  min-width: 100px;
}
.hour-card img {
  width: 50px;
  height: 50px;
}
.error {
  color: red;
}
</style>