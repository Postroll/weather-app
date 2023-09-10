import React, { useEffect, useState } from "react";
import './WeatherApp.css'
import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import humidity_icon from '../Assets/humidity.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import geolocalisation_icon from '../Assets/geolocalisation.png'

export default function WeatherApp(){
    const apiKey ="3f5d2d7b46e4f39ebb46390d5b43a6bf";
    const [city, setCity] = useState("Angouleme");
    const [cityInput, setCityInput] = useState("");
    const [temp, setTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [windSpeed, setWindSpeed] = useState(0);
    const [offcialName, setOfficialName] = useState("");
    const [weatherIcon, setWeatherIcon] = useState(snow_icon);
    const [unit, setUnit] = useState("metric");
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);

    useEffect(() => {
        if (city !== "")
            search();
    }, [city])

    useEffect(() => {
        if (lat.length != 0 && long.length != 0)
            searchLocal();
      }, [lat, long]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (cityInput === "")
            return 0;
        setCity(cityInput);
        setCityInput("");
    }

    const handleGeoLocalisation = (event) => {
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(function(position) {
            if (position.coords.latitude === lat && position.coords.longitude === long)
                searchLocal();
            else{
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
            }
        });
    }

    const handleChange = (event) =>{
        setCityInput(event.target.value);
    }

    const search = async() =>{
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
            let response = await fetch(url);
            let data = await response.json();
            updateWeather(data);
    }

    const searchLocal = async() =>{
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${unit}`
        let response = await fetch(url);
        let data = await response.json();
        updateWeather(data);
    }

    const updateWeather = (data) =>{
        if (!data.main)
            return 0;
        setTemp(Math.floor(data.main.temp));
        setHumidity(data.main.humidity);
        setWindSpeed(Math.floor(data.wind.speed));
        setOfficialName(data.name);
        if (data.weather[0].main === 'Clear')
            setWeatherIcon(clear_icon);
        else if (data.weather[0].main === 'Drizzle')
            setWeatherIcon(drizzle_icon);
        else if (data.weather[0].main === 'Rain')
            setWeatherIcon(rain_icon);
        else if (data.weather[0].main === 'Snow')
            setWeatherIcon(snow_icon);
        else if (data.weather[0].main === 'Clouds')
            setWeatherIcon(cloud_icon);
        else
            setWeatherIcon(drizzle_icon);
    }

    return (
        <div className="container">
            <form className="topBar">
                <input
                    value={cityInput}
                    type="text"
                    placeholder="Search..."
                    className="cityInput"
                    onChange={handleChange}
                />
                <button className="searchBtn" onClick={(handleSubmit)}>
                    <img className="searchIcon" src={search_icon} alt="search"/>
                </button>
                <button className="geolocalisationBtn" onClick={handleGeoLocalisation}>
                    <img className="geolocalisationIcon" src={geolocalisation_icon} alt=""/>    
                </button>
            </form>
            <div className="weatherImg">
                <img src={weatherIcon} alt="" />
            </div>
            <div className="weatherTemp">{temp}°c</div>
            <div className="weatherLocation">{offcialName}</div>
            <div className="dataContainer">
                <div className="element">
                    <img src={humidity_icon} alt="" className="icon"/>
                    <div className="data">
                        <div className="humidityPercent">{humidity}%</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={wind_icon} alt="" className="icon"/>
                    <div className="data">
                        <div className="humidityPercent">{windSpeed} km/h</div>
                        <div className="text">Wind speed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};