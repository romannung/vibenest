import axios from "axios";

export const client = axios.create({
	baseURL: "http://0.0.0.0:5000/api/",
});
