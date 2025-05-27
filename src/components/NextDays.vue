<script setup>
// import { ref, watch, onMounted } from 'vue' // No longer needed for fetching
// import { getWeatherForecasts } from '../services/weatherApi' // No longer needed

const props = defineProps({
  cityName: String,
  dailyForecast: Array,
  isLoading: Boolean,
  error: String,
})

function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
</script>

<template>
  <div class="next-days-container">
    <h3>Next 5 Days in {{ props.cityName || 'Selected City' }}</h3>
    <div v-if="props.isLoading">Loading daily forecast...</div>
    <div v-else-if="props.error && !props.dailyForecast?.length" class="error">{{ props.error }}</div>
    <div v-else-if="!props.isLoading && props.dailyForecast && props.dailyForecast.length" class="forecast-list">
      <div v-for="day in props.dailyForecast" :key="day.dt" class="day-card">
        <p class="date">{{ formatDate(day.dt) }}</p>
        <img :src="getWeatherIconUrl(day.icon)" :alt="day.summary">
        <p class="summary">{{ day.summary }}</p>
        <p>Max: {{ Math.round(day.temp_max) }}°C</p>
        <p>Min: {{ Math.round(day.temp_min) }}°C</p>
      </div>
    </div>
    <div v-else-if="!props.isLoading && !props.error && props.cityName && (!props.dailyForecast || !props.dailyForecast.length)">
      No daily data available for {{ props.cityName }}.
    </div>
    <!-- Message for no city selected is now handled by Home.vue -->
  </div>
</template>

<style scoped>
.next-days-container {
  margin-bottom: 20px;
}
.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}
.day-card {
  border: 1px solid #eee;
  padding: 15px;
  text-align: center;
}
.day-card img {
  width: 50px;
  height: 50px;
  margin: 5px 0;
}
.date {
  font-weight: bold;
}
.summary {
  text-transform: capitalize;
  margin: 5px 0;
}
.error {
  color: red;
}
</style>