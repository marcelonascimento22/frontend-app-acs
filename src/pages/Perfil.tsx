import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Loading } from "../utils/Loading";

const Perfil = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const [senha, setSenha] = useState({
    atual: "",
    nova: "",
  });

  // 🔹 Carregar usuário logado
  const carregarPerfil = async () => {
    const userData = JSON.parse(localStorage.getItem("usuario") || "null");
    //console.log("Dados do usuário no localStorage:", userData);

    try {
      setLoading(true);

      if (!userData) {
        alert("Usuário não encontrado. Faça login novamente.");
        return
      }

      const res = await api.get(`/usuarios/me/${Number(userData.id)}`, );
      //console.log("Resposta do perfil:", res.data);

      setUsuario(res.data);
      setForm({
        nome: res.data.nome,
        email: res.data.email,
        telefone: res.data.telefone || "",
        cpf: res.data.cpf || "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const atualizarPerfil = async () => {
    try {
      await api.patch("/usuarios/me", form);
      alert("Perfil atualizado!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar perfil");
    }
  };

  const alterarSenha = async () => {
    try {
      await api.patch("/usuarios/me/senha", senha);
      alert("Senha alterada com sucesso!");
      setSenha({ atual: "", nova: "" });
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar senha");
    }
  };

  if (loading || !usuario) {
    return <Loading />
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>

      {/* Dados */}
      <div className="space-y-4 border p-4 rounded">
        <h2 className="font-semibold">Dados</h2>

        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Nome"
        />

        <input
          name="cpf"
          value={form.cpf}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="CPF"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Email"
        />

        <input
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Telefone"
        />

        <div className="text-sm text-gray-600">
          Perfil: <strong>{usuario.perfil}</strong>
        </div>

        <button
          onClick={atualizarPerfil}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Salvar alterações
        </button>
      </div>

      {/* Senha */}
      <div className="space-y-4 border p-4 rounded">
        <h2 className="font-semibold">Alterar Senha</h2>

        <input
          type="password"
          placeholder="Senha atual"
          value={senha.atual}
          onChange={(e) =>
            setSenha({ ...senha, atual: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Nova senha"
          value={senha.nova}
          onChange={(e) =>
            setSenha({ ...senha, nova: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <button
          onClick={alterarSenha}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Alterar senha
        </button>
      </div>
    </div>
  );
};

export default Perfil;