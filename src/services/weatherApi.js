const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Simple in-memory cache
const weatherCache = new Map();

/**
 * Fetches weather data from OpenWeatherMap.
 * @param {number} lat Latitude.
 * @param {number} lon Longitude.
 * @param {string} units Units of measurement (e.g., 'metric', 'imperial').
 * @returns {Promise<any>} The weather data.
 */
async function fetchWeatherData(lat, lon, units = 'metric') {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

/** 
 * Gets weather forecasts for a given latitude and longitude.
 * @param {number} lat Latitude.
 * @param {number} lon Longitude.
 * @returns {Promise<{hourlyForecast: Array<object>, dailyForecast: Array<object>}>} Object containing hourly and daily forecasts.
 */
export async function getWeatherForecasts(lat, lon, cached = true) {
  const cacheKey = `${lat.toFixed(5)},${lon.toFixed(5)}`;

  if (weatherCache.has(cacheKey) && cached) {
    return weatherCache.get(cacheKey);
  }

  const data = await fetchWeatherData(lat, lon, 'metric');

  let hourlyForecast = [];
  let dailyForecast = [];

  if (data && data.list && data.list.length > 0) {
    // Hourly Forecast: API provides data in 3-hour intervals.
    hourlyForecast = data.list.slice(0, 3).map(item => ({
      dt: item.dt, // Timestamp
      temp: item.main.temp,
      humidity: item.main.humidity,
      icon: item.weather[0].icon,
    }));

    // Daily Forecast: Aggregate 3-hour data into daily summaries for the next 5 days.
    const dailyAggregates = {};
    data.list.forEach(item => {
      const dateStr = item.dt_txt.substring(0, 10); // YYYY-MM-DD

      if (!dailyAggregates[dateStr]) {
        dailyAggregates[dateStr] = {
          date: dateStr,
          temp_min_list: [],
          temp_max_list: [],
          forecastItems: []
        };
      }
      dailyAggregates[dateStr].temp_min_list.push(item.main.temp_min);
      dailyAggregates[dateStr].temp_max_list.push(item.main.temp_max);
      dailyAggregates[dateStr].forecastItems.push({
        dt: item.dt,
        dt_txt: item.dt_txt,
        icon: item.weather[0].icon,
        summary: item.weather[0].description,
      });
    });

    dailyForecast = Object.values(dailyAggregates).slice(0, 5).map(aggDay => {
      // Find a representative forecast for icon and summary (e.g., around midday)
      let representativeItem = aggDay.forecastItems.find(item => item.dt_txt.includes("12:00:00"));
      if (!representativeItem) {
        // Fallback: if no 12:00 forecast, take the middle one or the first one.
        representativeItem = aggDay.forecastItems[Math.floor(aggDay.forecastItems.length / 2)] || aggDay.forecastItems[0];
      }
      
      return {
        dt: representativeItem.dt,
        summary: representativeItem.summary,
        icon: representativeItem.icon,
        temp_min: Math.min(...aggDay.temp_min_list),
        temp_max: Math.max(...aggDay.temp_max_list),
      };
    });
  }

  const result = { hourlyForecast, dailyForecast };
  weatherCache.set(cacheKey, result);

  return result;
}