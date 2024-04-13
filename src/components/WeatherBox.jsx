import propTypes from "prop-types";
import City from "./City";
import "./WeatherBox.css";

const WeatherBox = (props) => {
  const onSaveCityHandler = (selectedCityInfo) => {
    props.onCity(selectedCityInfo);
  };
  return (
    <div className="container">
      <div className="weatherPic"></div>
      <div className="content">
        <h3 className="header">Şehir seçerek hava durumunu öğrenebilirsiniz</h3>
        <h5 className="smallheader">Şehrini seç ve hava durumunu öğren</h5>
        <City onSaveCity={onSaveCityHandler}></City>
      </div>
    </div>
  );
};

WeatherBox.propTypes = {
  onCity: propTypes.func.isRequired,
};

export default WeatherBox;
