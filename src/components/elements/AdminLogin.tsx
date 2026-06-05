import { useState } from "react";
import { BiLockAlt, BiUser } from "react-icons/bi";
import adminLogin from "../../controllers/admin/adminLogin";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await adminLogin({ username, password });

    if (response.status === 200) {
      window.location.reload(); // recarrega e o useEffect do AdminPage vai verificar o cookie
    } else {
      setError(response.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 bg-accent rounded-3xl flex items-center justify-center shadow-lg shadow-accent/30">
            <BiLockAlt className="text-white text-2xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
            <p className="text-sm text-gray-400 mt-0.5">Entre com suas credenciais</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">

          {/* Erro */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuário</label>
            <div className="flex items-center gap-3 border border-zinc-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all">
              <BiUser className="text-gray-300 text-lg shrink-0" />
              <input
                type="text"
                placeholder="seu_usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-300 bg-transparent"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Senha</label>
            <div className="flex items-center gap-3 border border-zinc-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all">
              <BiLockAlt className="text-gray-300 text-lg shrink-0" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-300 bg-transparent"
                required
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 mt-1 ${
              loading
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : "bg-accent text-white hover:opacity-90 active:scale-[0.99] shadow-md shadow-accent/25"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Entrando...
              </span>
            ) : "Entrar"}
          </button>

        </div>

        <p className="text-center text-xs text-gray-300 mt-6">Acesso restrito a administradores</p>
      </div>
    </div>
  );
}