import { useState } from "react";
import { loginService } from "../services/auth";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      setErro("Preencha email e senha");
      return;
    }

    try {
      setLoading(true);
      setErro("");

      const res = await loginService(email, senha);

      if (res && res.data) {
        const token = res.data.access_token;
        const usuario = res.data.usuario;

        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario));

        login(token);
        navigate("/");
      }
    } catch (error: unknown) {
      let msg = "Erro ao fazer login";

      if (axios.isAxiosError(error)) {
        msg =
          error.response?.data?.message ||
          `Erro ${error.response?.status}` ||
          "Erro na API";
      }

      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      setErro("Preencha nome, email e senha");
      return;
    }

    try {
      setLoading(true);
      setErro("");

      await api.post("/auth/register", {
        nome,
        email,
        senha,
        perfil: "ACS",
        ativo: true
      });

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      setIsRegistering(false);
      setSenha("");
    } catch (error: unknown) {
      let msg = "Erro ao fazer cadastro";

      if (axios.isAxiosError(error)) {
        msg =
          error.response?.data?.message ||
          `Erro ${error.response?.status}` ||
          "Erro na API";
      }

      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl text-center font-bold mb-4">
          {isRegistering ? "Cadastre-se" : "Login"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isRegistering) {
              handleRegister();
            } else {
              handleLogin();
            }
          }}
          className="space-y-4"
        >
          {erro && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
              {erro}
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                placeholder="João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="joao@teste.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              placeholder="******"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            {loading ? "Aguarde..." : isRegistering ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErro("");
            }}
            className="text-sm text-blue-500 hover:underline focus:outline-none"
          >
            {isRegistering
              ? "Já possui uma conta? Faça login"
              : "Não possui uma conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
}