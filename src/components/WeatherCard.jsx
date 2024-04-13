import { useEffect, useState } from "react";
import { LiaEllipsisVSolid } from "react-icons/lia";
import { IconContext } from "react-icons";
import propTypes from "prop-types";
import "./WeatherCard.css";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const WeatherCard = ({
  weatherIcon,
  cityName,
  iso,
  description,
  currentTemp,
  feelsLike,
  humidity,

  onRemoveCity,
  getWeekWeather,
}) => {
  const [todayDate, setTodayDate] = useState();
  const [todayDay, setTodayDay] = useState();

  const [showOptions, setShowOptions] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeklyWeatherData, setWeeklyWeatherData] = useState(null);

  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const [isDayDetailsModalOpen, setIsDayDetailsModalOpen] = useState(false);

  const viewWeatherDetails = async () => {
    try {
      const weatherDetails = await getWeekWeather(cityName);
      setWeeklyWeatherData(weatherDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching weekly weather:", error);
    }
  };
  const showDayDetails = (day) => {
    setSelectedDayDetails(day);
    setIsDayDetailsModalOpen(true);
  };

  useEffect(() => {
    const date = new Date();
    const changedDay = date.toLocaleDateString("en-us", {
      day: "numeric",
      month: "long",
    });
    const day = date.toLocaleDateString("en-us", { weekday: "long" });

    setTodayDate(changedDay);
    setTodayDay(day);
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  return (
    <div className="card">
      <div className="card-container center">
        <div className="card-img"></div>
        <div className="options" onClick={toggleOptions}>
          <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
            <LiaEllipsisVSolid />
          </IconContext.Provider>
          {showOptions && (
            <div className="options-menu">
              <button onClick={viewWeatherDetails}>View Weather</button>
              <button onClick={() => onRemoveCity(cityName)}>
                Remove City
              </button>
            </div>
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>7 Day Forecast for {cityName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody style={{ background: "#f0f2f5" }}>
              {weeklyWeatherData ? (
                <div
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    padding: "10px",
                  }}
                >
                  {weeklyWeatherData.daily.map((day, index) => (
                    <div
                      key={index}
                      onClick={() => showDayDetails(day)}
                      style={{
                        minWidth: "120px",
                        margin: "5px",
                        padding: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {new Date(day.dt * 1000).toLocaleDateString("en", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <img
                        src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                        alt="weather"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        Max: {day.temp.max}°C
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        Min: {day.temp.min}°C
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        Humidity: {day.humidity}%
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isDayDetailsModalOpen}
          onClose={() => setIsDayDetailsModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Weather Details</ModalHeader>
            <ModalCloseButton />
            <Modal
              isOpen={isDayDetailsModalOpen}
              onClose={() => setIsDayDetailsModalOpen(false)}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Weather Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody
                  style={{
                    background: "white",
                    backgroundSize: "cover",
                    color: "teal",
                  }}
                >
                  {selectedDayDetails && (
                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`http://openweathermap.org/img/w/${selectedDayDetails.weather[0].icon}.png`}
                        alt="Weather icon"
                        style={{ width: "100px", height: "100px" }}
                      />

                      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Date:{" "}
                        {new Date(
                          selectedDayDetails.dt * 1000
                        ).toLocaleDateString()}
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Max Temperature: {selectedDayDetails.temp.max}°C
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Min Temperature: {selectedDayDetails.temp.min}°C
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Humidity: {selectedDayDetails.humidity}%
                      </p>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button onClick={() => setIsDayDetailsModalOpen(false)}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </ModalContent>
        </Modal>
      </div>
      <div className="weather-details">
        <div className="date center">
          <p className="day">{todayDay}</p>
          <p className="date">{todayDate}</p>
        </div>
        <div className="center">
          <img
            alt=""
            className="icons"
            src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
          ></img>
        </div>

        <div className="country center">
          <p className="city">
            {cityName}
            <span className="iso">{iso}</span>
          </p>
          <p className="description">{description}</p>
        </div>
        <div className="temperature">
          <p>Current: {currentTemp}°C</p>
          <p>Feels Like: {feelsLike}°C</p>
        </div>
        <div className="humidity">
          <p>Humidity: {humidity}%</p>
        </div>
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  weatherIcon: propTypes.string.isRequired,
  cityName: propTypes.string.isRequired,
  iso: propTypes.string.isRequired,
  description: propTypes.string.isRequired,
  currentTemp: propTypes.number.isRequired,
  feelsLike: propTypes.number.isRequired,
  humidity: propTypes.number.isRequired,
  onRemoveCity: propTypes.func,
  getWeekWeather: propTypes.func.isRequired,
};

export default WeatherCard;
