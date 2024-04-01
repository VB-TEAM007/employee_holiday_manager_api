import axios from 'axios';
import { ApiError } from '../exceptions/api.error.js';

const getByYearAndCountry = async (req, res) => {
  const { year, countryCode } = req.params;
  
  try {
    const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    
    const formatedData = response.data.map(holiday => ({
      date: holiday.date,
      name: holiday.name,
      countryCode: holiday.countryCode
    }));

    res.send(formatedData);
  } catch (e) {
    throw ApiError.BadRequest('Bad request', e);
  }
}

export const publicHolidaysController = {
  getByYearAndCountry
}
