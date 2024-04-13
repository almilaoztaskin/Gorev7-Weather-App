/* eslint-disable no-undef */
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import WeatherBox from "./components/WeatherBox";
import WeatherCard from "./components/WeatherCard";

const SEED_DATA = [
  {
    city: "Ankara",
    // id: "TR",
    country: "Turkey",
  },
];

const weatherApi = {
  key: "2c006b98e2ee5b157418ce7c4325967d",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [cities, setCities] = useState(SEED_DATA);
  const [weatherData, setWeatherData] = useState([]);

  const { colorMode, onToggleDarkMode } = useColorMode();

  const isDarkMode = colorMode === "dark";

  const toggleDarkMode = () => {
    onToggleDarkMode();
  };

  const removeCity = (cityName) => {
    setCities(cities.filter((city) => city.city != cityName));
    setWeatherData(
      weatherData.filter((weather) => weather.cityName !== cityName)
    );
  };

  const getCityCoordinates = async (cityName) => {
    const apiURL = `${weatherApi.base}weather?q=${cityName}&appid=${weatherApi.key}`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { lat: data.coord.lat, lon: data.coord.lon };
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
    }
  };

  const getWeeklyWeather = async (cityName) => {
    try {
      const { lat, lon } = await getCityCoordinates(cityName);
      if (!lat || !lon) {
        throw new Error("Coordinates not found");
      }
      const apiURL = `${weatherApi.base}onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${weatherApi.key}`;

      const response = await fetch(apiURL);
      const data = await response.json();

      console.log("API response:", data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error("Error fetching weekly weather data:", error);
    }
  };

  useEffect(() => {
    const retrieveWeatherData = async () => {
      const weatherUpdates = [];
      for (const city of cities) {
        const encodedCityName = encodeURIComponent(city.city);

        const apiURL = `${weatherApi.base}weather?q=${encodedCityName}&units=metric&appid=${weatherApi.key}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        console.log(data);

        if (data.weather && data.weather[0]) {
          weatherUpdates.push({
            weatherIcon: data.weather[0].icon,
            cityName: city.city,
            iso: city.id,
            description: data.weather[0].description,
            currentTemp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: Math.round(data.main.humidity),
          });
        }
      }

      setWeatherData(weatherUpdates);
    };
    retrieveWeatherData();
  }, [cities]);

  const handleCitySelection = (selectedCityInfo) => {
    setCities((prevCities) => [...prevCities, selectedCityInfo]);
  };

  return (
    <ChakraProvider>
      <Navbar
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      ></Navbar>

      <WeatherBox onCity={handleCitySelection}></WeatherBox>

      <div className="App">
        {weatherData.map((weather, index) => (
          <WeatherCard
            key={index}
            weatherIcon={weather.weatherIcon}
            cityName={weather.cityName}
            iso={weather.iso}
            description={weather.description}
            currentTemp={weather.currentTemp}
            feelsLike={weather.feelsLike}
            humidity={weather.humidity}
            onRemoveCity={removeCity}
            getWeekWeather={() => getWeeklyWeather(weather.cityName)}
          />
        ))}
      </div>
    </ChakraProvider>
  );
}

export default App;
