import axios from "axios";

let baseUrl = "https://stageapi.monkcommerce.app/"


export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: false
});


