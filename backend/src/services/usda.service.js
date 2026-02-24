import axios from "axios";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export const searchUSDAFoods = async (query) => {
  const res = await axios.get(`${USDA_BASE_URL}/foods/search`, {
    params: {
      api_key: process.env.USDA_API_KEY,
      query,
      pageSize: 10
    }
  });

  return res.data.foods || [];
};
