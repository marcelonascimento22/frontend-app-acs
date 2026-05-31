import { useEffect, useState } from "react";
import api from "../services/api";
import ModalComorbidade from "../components/ModalComorbidade";
import { Loading } from "../utils/Loading";

interface Comorbidade {
  ativo: boolean;
  id?: number;
  nome: string;
  cid: string;
  descricao: string;
}

export default function Comorbidades() {
  const [lista, setLista] = useState<Comorbidade[]>([]);
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [comorbidadeSelecionada, setComorbidadeSelecionada] =
    useState<Comorbidade | null>(null);

  async function carregar() {
    try {
      setIsLoading(true);

      const { data } = await api.get("/comorbidade");

      setLista(data);
    } catch (err) {
      console.error("Erro ao carregar comorbidades:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluir(id: number) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta comorbidade?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/comorbidade/${id}`);
      carregar();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  }

  const listaFiltrada = lista.filter((item) => {
    const termo = busca.toLowerCase();

    return (
      item.nome?.toLowerCase().includes(termo) ||
      item.cid?.toLowerCase().includes(termo) ||
      item.descricao?.toLowerCase().includes(termo)
    );
  });

  return (
    <>
      <div className="p-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

          <h1 className="text-2xl font-bold">
            Gerenciar Comorbidades
          </h1>

          <button
            onClick={() => {
              setComorbidadeSelecionada(null);
              setOpenModal(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Nova Comorbidade
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar por nome, CID ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Cod</th>
                    <th className="border p-2">Nome</th>
                    <th className="border p-2">CID</th>
                    <th className="border p-2">Descrição</th>
                    <th className="border p-2">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {listaFiltrada.map((item) => (
                    item.ativo && (
                       <>
                                           <tr key={item.id}>
                      <td className="border p-2 text-center">
                        {item.id}
                      </td>

                      <td className="border p-2">
                        {item.nome}
                      </td>

                      <td className="border p-2">
                        {item.cid}
                      </td>

                      <td className="border p-2">
                        {item.descricao}
                      </td>

                      <td className="border p-2">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => {
                              setComorbidadeSelecionada(item);
                              setOpenModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => excluir(item.id!)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Desativar
                          </button>

                        </div>
                      </td>
                    </tr>
                       </> 
                    )

                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="grid gap-3 md:hidden">
              {listaFiltrada.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <div className="space-y-1">

                    <p>
                      <strong>Cod:</strong> {item.id}
                    </p>

                    <p>
                      <strong>Nome:</strong> {item.nome}
                    </p>

                    <p>
                      <strong>CID:</strong> {item.cid}
                    </p>

                    <p>
                      <strong>Descrição:</strong>{" "}
                      {item.descricao}
                    </p>

                  </div>

                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() => {
                        setComorbidadeSelecionada(item);
                        setOpenModal(true);
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluir(item.id!)}
                      className="flex-1 bg-red-500 text-white py-2 rounded"
                    >
                      Excluir
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {listaFiltrada.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma comorbidade encontrada.
              </div>
            )}
          </>
        )}
      </div>

      {openModal && (
        <ModalComorbidade
          comorbidade={comorbidadeSelecionada}
          onClose={() => {
            setOpenModal(false);
            setComorbidadeSelecionada(null);
          }}
          onSave={carregar}
        />
      )}
    </>
  );
}