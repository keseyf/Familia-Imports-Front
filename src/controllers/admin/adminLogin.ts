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
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // <-- salva o cookie
      }
    );
    return { status: 200, message: response.data.message };
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? "Erro ao realizar login.";
    console.log(error.response?.data);
    return { status, message };
  }
}