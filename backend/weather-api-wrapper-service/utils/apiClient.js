import axios from "axios";

const API_BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

const getWeatherData = async (city, key) => {
  try {
    const url = `${API_BASE_URL}/${encodeURIComponent(
      city
    )}?unitGroup=metric&key=${key}&contentType=json`;
    console.log(url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in API call", error.message);
    return null;
  }
};

export { getWeatherData };
("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/yangon?unitGroup=metric&key=ASW7QM5R4XNWTAL6B8MNMYVCR&contentType=json");
