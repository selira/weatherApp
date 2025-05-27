<script setup>

const props = defineProps({
  cityName: String,
  countryName: String,
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
    <h3>Next 5 Days</h3>
    <div v-if="props.isLoading">Loading daily forecast...</div>
    <div v-else-if="props.error && !props.dailyForecast?.length" class="error">{{ props.error }}</div>
    <div v-else-if="!props.isLoading && props.dailyForecast && props.dailyForecast.length" class="forecast-list">
      <div v-for="day in props.dailyForecast" :key="day.dt" class="day-row">
        <div class="day-icon">
          <img :src="getWeatherIconUrl(day.icon)" :alt="day.summary">
        </div>
        <div class="day-info">
          <p class="date">{{ formatDate(day.dt) }}</p>
          <p class="summary-caption">{{ day.summary }}</p>
        </div>
        <div class="day-temps">
          <p>{{ Math.round(day.temp_max) }}°</p>
          <p class="temp-min">{{ Math.round(day.temp_min) }}°</p>
        </div>
      </div>
    </div>
    <div v-else-if="!props.isLoading && !props.error  && (!props.dailyForecast || !props.dailyForecast.length)">
      No daily data available.
    </div>
  </div>
</template>

<style scoped>
.next-days-container {
  margin-bottom: 20px;
}

.next-days-container h3 {
  text-align: left
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.day-row {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  padding: 5px 15px;
  gap: 15px;
}

.day-icon img {
  width: 50px;
  height: 50px;
  display: block;
}

.day-info {
  flex-grow: 1;
  text-align: left;
}

.date {
  font-weight: bold;
  margin: 0 0 4px 0;
}

.summary-caption {
  font-size: 0.9em;
  color: #888888;
  text-transform: capitalize;
  margin: 0;
}

.day-temps {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  min-width: 50px;
}

.day-temps p {
  margin: 0;
  font-weight: bold;
}

.day-temps .temp-min {
  font-size: 0.9em;
  color: #777;
  font-weight: normal;
}

.error {
  color: red;
}
</style>