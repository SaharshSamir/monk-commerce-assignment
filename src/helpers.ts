import axios from "axios";

let baseUrl = "http://stageapi.monkcommerce.app/"

const axiosInstance = axios.create({
  baseURL: baseUrl
});

export default axiosInstance;

