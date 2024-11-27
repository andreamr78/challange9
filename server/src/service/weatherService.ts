import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates{
  lat: number;
  lon: number;
}

class Weather{
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number ){
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;

  }
}

// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
class WeatherService {
  private baseUrl = process.env.API_BASE_URL as string;
  private apiKey = process.env.API_KEY as string;
  private cityName!: string;
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method WORKS
  private async fetchLocationData(query: string){
    try {
      const response = await fetch(query);
      const json = await response.json();
      // console.log(json);
      return json;
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }
  // TODO: Create destructureLocationData method WORKS
  private destructureLocationData(locationData: Coordinates): Coordinates {
    let {lat: latitude, lon: longitude} = locationData;
    const newCoord : Coordinates = {lat: latitude, lon: longitude};
    // console.log(newCoord);
    return newCoord;
  }
  // TODO: Create buildGeocodeQuery method  WORKS
  private buildGeocodeQuery(): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method  WORKS
  private buildWeatherQuery(coordinates: Coordinates): string {
    // console.log(coordinates);
    return `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method WORKS
  private async fetchAndDestructureLocationData() {
    let locData = await this.fetchLocationData(this.buildGeocodeQuery());
    if (Array.isArray(locData) && locData.length > 0) {
      return this.destructureLocationData(locData[0]); 
    } else {
      console.error('No location data found');
      return null; 
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    console.log(data);
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    // console.log({response});
    const city = this.cityName;
    const date = new Date(response.list[0].dt * 1000).toLocaleDateString();
    const icon = response.list[0].weather[0].icon;
    const iconDescription = response.list[0].weather[0].description;
    const tempF = ((response.list[0].main.temp - 273.15) * 9) / 5 + 32;
    const windSpeed = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray = [];
    forecastArray.push(currentWeather);

    for (let i = 1; i < weatherData.length; i++) {
      const city = this.cityName;
      const date = new Date(weatherData[i].dt * 1000).toLocaleDateString();
      const icon = weatherData[i].weather[0].icon;
      const iconDescription = weatherData[i].weather[0].description;
      const tempF = ((weatherData[i].main.temp - 273.15) * 9) / 5 + 32; // Convert temperature to Fahrenheit
      const windSpeed = weatherData[i].wind.speed;
      const humidity = weatherData[i].main.humidity;

      forecastArray.push(new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity));
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    
    if (!coordinates) {
      throw new Error('Could not find coordinates');
  }
  const weatherData = await this.fetchWeatherData(coordinates);
  // console.log(weatherData);
  const currentWeather = this.parseCurrentWeather(weatherData);
  const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
  // console.log({ currentWeather, forecastArray });
  return { currentWeather, forecastArray };
  
  }
}

export default new WeatherService();
