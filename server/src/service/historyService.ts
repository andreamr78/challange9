// TODO: Define a City class with name and id properties
import fs from 'fs-extra';

class City{
  name: string;
  id: string;
  
  constructor(name: string,id: string ){
    this.name = name,
    this.id = id
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private path: string = './db/db.json';
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      let data = await fs.readJSONSync(this.path);
      return data as City[];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]):Promise<void> {
    try {
      await fs.writeJson(this.path, cities);
    } catch (error) {
      return console.log(error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  //validation
  async getCities() : Promise<City[]> {
    return this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      let cityArray = await this.getCities();
      let newCity = new City(city, `${Date.now()}`);
      cityArray.push(newCity);
      await this.write(cityArray);
    } catch (error) {
      return console.log(error);
    }

  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    try {
      const cities = await this.getCities();
      
      const updatedCities = cities.filter(city => city.id !== id);
      
      await this.write(updatedCities);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new HistoryService();
