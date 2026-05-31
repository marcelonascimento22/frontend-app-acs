import { useEffect, useState } from "react";
import formatDate from "../utils/formatDate";
import FormularioVisita from "../components/FormularioVisita";
import getMinhasVisitas from "../services/getMinhasVisitas";
import { Loading } from "../utils/Loading";


const Visitas = () => {
  const [openModal, setOpenModal] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<any>(null);
  //const [pessoas, setPessoas] = useState<PessoaVisita[]>([]);
  const [minhasVisitas, setMinhasVisitas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const data = await getMinhasVisitas();
          setMinhasVisitas(data);
        } catch (err: any) {
          console.error(err.message || "Erro ao buscar visitas");
        } finally {
          setIsLoading(false);
        }
      };

  fetchData();
}, []);

  //console.log("Minhas Visitas:", minhasVisitas);
    
  /*  
    useEffect(() => {
      api.get("/visita/prioridade").then((res) => {
        setPessoas(res.data);
      });
    }, []);

    */

  function calcularDias(ultimaVisita: string | null) {
    if (!ultimaVisita) return Infinity;

    const hoje = new Date();
    const visita = new Date(ultimaVisita);

    return Math.floor((hoje.getTime() - visita.getTime()) / (1000 * 60 * 60 * 24));
  }

  ////console.log(pessoas);
  ////console.log('Pessoa Selecionada:', pessoaSelecionada);
  return (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Visitas</h1>




    {/* MOBILE */}
    <div className="block md:hidden space-y-4">
      {minhasVisitas.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-center">Nenhuma visita encontrada</p>
        </div>
      ) : (
        <>
          {minhasVisitas.map((f: any) =>
            f.pessoas.map((p: any) => {
              const visitasOrdenadas = [...(p.visitas || [])].sort(
                (a: any, b: any) =>
                  new Date(a.dataVisita).getTime() -
                  new Date(b.dataVisita).getTime()
              );

              const ultimaVisita =
                visitasOrdenadas.length > 0
                  ? visitasOrdenadas[visitasOrdenadas.length - 1]
                      .dataVisita
                  : null;

              const dias = calcularDias(ultimaVisita);
              const isVermelho = dias > 30;

              return (
                <div
                  key={p.id}
                  className={`rounded-xl shadow p-4 border ${
                    isVermelho
                      ? "bg-red-100 border-red-300"
                      : "bg-white"
                  }`}
                >
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-semibold">{p.nome}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Última visita
                      </p>

                      <p>
                        {ultimaVisita
                          ? formatDate(ultimaVisita)
                          : "Nunca visitado"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Dias sem visita
                      </p>

                      <p
                        className={`font-bold ${
                          isVermelho
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {isFinite(dias) ? dias : "∞"}
                      </p>
                    </div>

                    <button
                      className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2"
                      onClick={() => {
                        setPessoaSelecionada(p);
                        setOpenModal(true);
                      }}
                    >
                      Registrar Visita
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </div>

    {/* DESKTOP */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nome</th>
            <th className="border p-2">Última Visita</th>
            <th className="border p-2">Dias sem visita</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={4}
                className="border p-4 text-center"
              >
                <Loading />
              </td>
            </tr>
          ) : (
            <>
            {minhasVisitas.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border p-4 text-center"
                >
                  Nenhuma visita encontrada
                </td>
              </tr>
            ) : (

              <>
                {minhasVisitas.map((f: any) =>
                  f.pessoas.map((p: any) => {
                    const visitasOrdenadas = [...(p.visitas || [])].sort(
                      (a: any, b: any) =>
                        new Date(a.dataVisita).getTime() -
                        new Date(b.dataVisita).getTime()
                    );

                    const ultimaVisita =
                      visitasOrdenadas.length > 0
                        ? visitasOrdenadas[
                            visitasOrdenadas.length - 1
                          ].dataVisita
                        : null;

                    const dias = calcularDias(ultimaVisita);
                    const isVermelho = dias > 30;

                    return (
                      <tr
                        key={p.id}
                        className={
                          isVermelho ? "bg-red-100" : ""
                        }
                      >
                        <td className="border p-2">{p.nome}</td>

                        <td className="border p-2">
                          {ultimaVisita
                            ? formatDate(ultimaVisita)
                            : "Nunca visitado"}
                        </td>

                        <td
                          className={`border p-2 font-bold ${
                            isVermelho
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {isFinite(dias) ? dias : "∞"}
                        </td>

                        <td className="border p-2">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={() => {
                              setPessoaSelecionada(p);
                              setOpenModal(true);
                            }}
                          >
                            Registrar Visita
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </>
            )}

          </>
          )}
          
        </tbody>
      </table>
    </div>

    {openModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-[500px]">
          <FormularioVisita
            pessoa={pessoaSelecionada}
            onClose={() => setOpenModal(false)}
          />
        </div>
      </div>
    )}
  </div>
  );
};

export default Visitas;