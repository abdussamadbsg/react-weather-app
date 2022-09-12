import "./App.css";
import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg); 

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      console.log(data);
      setWeather(data);

      // dynamic bg
      const threshold = units === "metric" ? 20 : 60;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    console.log(currentUnit);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "ºF" : "ºC";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur(); 
    }
  }

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section_inputs">
              <input onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter city..."
              ></input>
              <button onClick={(e) => handleUnitsClick(e)}>ºF</button>
            </div>

            <div className="section section_temperature">
              <div className="icon">
                <h3>{weather.name}, {weather.country}</h3>
                <img
                  src={weather.iconURL}
                  alt="weatherIcon"
                />
                <h3>{weather.description}</h3>
              </div>

              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} º${
                  units === "metric" ? "C" : "F"
              }`}</h1>
              </div>
            </div>

            {/* bottom description */}

            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
