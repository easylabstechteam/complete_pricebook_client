import axios from "axios";
import { BACKEND_URL} from "@/config/core";

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 3000,
  headers: {},
});

export { client };
