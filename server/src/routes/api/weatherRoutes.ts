import { Router } from 'express';
const router = Router();

import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { cityName } = req.body;
  // TODO: GET weather data from city name
  // TODO: save city to search history

    try {
      let data = await weatherService.getWeatherForCity(cityName);
      res.json(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).send({ error: 'Failed to fetch weather data' });
    }


  try {
    await historyService.addCity(cityName);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add city' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const citiesData = await historyService.getCities();
    res.json(citiesData);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch History' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await historyService.removeCity(id);
    res.status(204).send(); // No content to return on successful delete
  } catch (error) {
    console.error('Error removing city from history:', error);
    res.status(500).send({ error: 'Failed to remove city from history' });
  }
});

export default router;
