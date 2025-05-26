<script setup>
import { ref } from 'vue'
import Search from '../components/Search.vue'
import Tabs from '../components/Tabs.vue'
import NextHours from '../components/NextHours.vue'
import NextDays from '../components/NextDays.vue'

defineProps({
  msg: String,
})

const currentCity = ref({})
</script>

<template>
    <div>
    <Search
      :currentCityId="currentCity.id"
      :currentCityName="currentCity.name"
      @updateCity="updateCity"
    />
    <Tabs
      :currentCityId="currentCity.id"
      @updateCity="updateCity"
    />
    <NextHours
      :currentCity="currentCity"
    />
    <NextDays
      :currentCity="currentCity"
    />
  </div>
</template>

<style scoped>
</style>
