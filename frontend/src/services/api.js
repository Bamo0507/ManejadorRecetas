import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api", //TODO: modificar cuando Brandon lo tnega
});

export default api;