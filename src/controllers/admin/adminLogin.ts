import axios from "axios";

interface AdminLoginData {
  username: string;
  password: string;
}

export default async function adminLogin({ username, password }: AdminLoginData) {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + "admin/login",
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    localStorage.setItem("adminToken", response.data.token);
    return { status: 200, message: response.data.message };
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? "Erro ao realizar login.";
    return { status, message };
  }
}