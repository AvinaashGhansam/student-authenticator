import axios from "axios";

const API_URL = "http://localhost:4000";

export async function saveUserToDb(user: {
  email: string;
  firstName: string;
  lastName: string;
  university: string;
}) {
  return axios.post(`${API_URL}/users`, user);
}
