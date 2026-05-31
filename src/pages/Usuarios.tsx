import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Loading } from "../utils/Loading";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  perfil: "ADMIN" | "ACS" | "ATENDIMENTO";
  ativo: boolean;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");

  const navigate = useNavigate();

  //console.log("Usuarios: ", usuarios)

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nome} ${u.email}`.toLowerCase().includes(busca.toLowerCase())
  );

  const toggleAtivo = async (usuario: Usuario) => {
    console.log("Usuario: ", usuario)
    try {
      await api.patch(`/usuarios/${usuario.id}`, {
        ativo: !usuario.ativo,
      });

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuario.id ? { ...u, ativo: !u.ativo } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuários</h1>

        <button
          onClick={() => navigate("/usuarios/novo")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Usuário
        </button>
      </div>

      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar por nome ou email..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* ================= MOBILE (CARDS) ================= */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          <Loading />
        ) : usuariosFiltrados.length === 0 ? (
          <p className="text-center">Nenhum usuário encontrado</p>
        ) : (
          usuariosFiltrados.map((u: Usuario) => (
            <div
              key={u.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
            >
              <p className="font-semibold text-lg">{u.nome}</p>

              <p className="text-sm">
                <span className="font-medium">Email: </span>
                {u.email}
              </p>

              <p className="text-sm">
                <span className="font-medium">Telefone: </span>
                {u.telefone?.trim() || "-"}
              </p>

              <p className="text-sm">
                <span className="font-medium">Perfil: </span>
                {u.perfil}
              </p>

              <p className="text-sm">
                <span className="font-medium">Status: </span>
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    u.ativo ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {u.ativo ? "Ativo" : "Inativo"}
                </span>
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => navigate(`/usuarios/${u.id}`)}
                  className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => toggleAtivo(u)}
                  className="flex-1 bg-gray-600 text-white px-3 py-1 rounded"
                >
                  {u.ativo ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP (TABELA) ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Nome</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Telefone</th>
              <th className="border p-2 text-left">Perfil</th>
              <th className="border p-2 text-center">Status</th>
              <th className="border p-2 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <Loading />
            ) : usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u: Usuario) => (
                <tr key={u.id}>
                  <td className="border p-2">{u.nome}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{u.telefone || "-"}</td>
                  <td className="border p-2">{u.perfil}</td>

                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        u.ativo ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/usuarios/${u.id}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => toggleAtivo(u)}
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      {u.ativo ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Usuarios;
