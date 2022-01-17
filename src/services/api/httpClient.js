import axios from "axios";

const httpClient = axios.create({
    baseURL: "http://invoices.test/api/v1/", // You can use any api service by changing the baseURL
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Authorization
const getAuthToken = () => localStorage.getItem('token');

const authInterceptor = (config) => {
    config.headers['Authorization'] = getAuthToken();
    return config;
}

httpClient.interceptors.request.use(authInterceptor);

export default httpClient;
