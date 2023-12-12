var express = require('express');
require('dotenv').config();
var axios = require('axios');
var router = express.Router();

const API_KEY = process.env.API_KEY_WEATHER;
const BASE_URL = process.env.BASE_URL;

/* GET weather listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET weather listing. */
router.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'You have to provide a city!' });
    }

    const apiUrl = `${BASE_URL}?q=${city}&appid=${API_KEY}`;
    const weatherResponse = await axios.get(apiUrl);
    console.log("temperature: ", weatherResponse.data.main.temp);  //Test get temperature
    const weatherData = weatherResponse.data;

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Something wrong!'});
  }
});

module.exports = router;
