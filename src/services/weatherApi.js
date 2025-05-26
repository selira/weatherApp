const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

/**
 * Fetches weather data from OpenWeatherMap.
 * @param {number} lat Latitude.
 * @param {number} lon Longitude.
 * @param {string} exclude Parts to exclude (e.g., 'current,minutely,alerts').
 * @param {string} units Units of measurement (e.g., 'metric', 'imperial').
 * @returns {Promise<any>} The weather data.
 */
async function fetchWeatherData(lat, lon, exclude = '', units = 'metric') {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${API_KEY}&units=${units}`;
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
 * Gets the hourly forecast for the next 5 hours and daily forecast for the next 5 days
 * using a single API call.
 * @param {number} lat Latitude.
 * @param {number} lon Longitude.
 * @returns {Promise<{hourlyForecast: Array<object>, dailyForecast: Array<object>}>} Object containing hourly and daily forecasts.
 */
export async function getWeatherForecasts(lat, lon) {
  // Fetch data, excluding parts not needed for hourly/daily forecasts to be efficient
  // The One Call API includes hourly and daily by default if not excluded.
  const data = await fetchWeatherData(lat, lon, 'current,minutely,alerts');

  let hourlyForecast = [];
  if (data && data.hourly) {
    hourlyForecast = data.hourly.slice(0, 5).map(hour => ({
      dt: hour.dt, // Timestamp
      temp: hour.temp,
      humidity: hour.humidity,
      icon: hour.weather[0].icon,
    }));
  }

  let dailyForecast = [];
  if (data && data.daily) {
    // Takes the first 5 days from the forecast (usually includes today as the first day)
    dailyForecast = data.daily.slice(0, 5).map(day => ({
      dt: day.dt, // Timestamp
      summary: day.weather[0].description, // Text summary
      icon: day.weather[0].icon,
      temp_min: day.temp.min,
      temp_max: day.temp.max,
    }));
  }

  return { hourlyForecast, dailyForecast };
}