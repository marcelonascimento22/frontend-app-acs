import { useEffect, useState } from "react";
import formatDate from "../utils/formatDate";
import FormularioVisita from "../components/FormularioVisita";
import getMinhasVisitas from "../services/getMinhasVisitas";


const Visitas = () => {
    const [openModal, setOpenModal] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<any>(null);
    //const [pessoas, setPessoas] = useState<PessoaVisita[]>([]);
    const [minhasVisitas, setMinhasVisitas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const data = await getMinhasVisitas();
          setMinhasVisitas(data);
        } catch (err: any) {
          setError(err.message || "Erro ao buscar visitas");
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
    <div>

      <h1>Visitas</h1>
      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
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
          {
            minhasVisitas.length === 0 ? (
              <tr className="bg-green-200">
                <td className="border p-2 font-bold">Total de visitas realizadas: {minhasVisitas.length}</td>
              </tr>
            ) : (
              <>
              {
                minhasVisitas.map((f: any) =>
                  f.pessoas.map((p: any) => {
                    const ultimaVisita =
                      p.visitas?.length > 0
                        ? p.visitas[p.visitas.length - 1]?.dataVisita
                        : null;

                    const dias = calcularDias(ultimaVisita);
                    const isVermelho = dias > 30;

                    return (
                      <tr key={p.id} className={isVermelho ? "bg-red-200" : ""}>
                        <td className="border p-2">{p.nome}</td>

                        <td className="border p-2">
                          {p.visitas.length > 0
                            ? formatDate(
                                p.visitas
                                  .sort((a:any, b:any) => new Date(a.dataVisita).getTime() - new Date(b.dataVisita).getTime())
                                  [p.visitas.length - 1].dataVisita
                              )
                            : "Nunca visitado"}
                        </td>

                        <td className={`border p-2 font-bold ${isVermelho ? "text-red-600" : ""}`}>
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
                )
              }

              </>
            )
          }


        </tbody>
      </table>

        {openModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            
            <div className="bg-white p-6 rounded w-[500px]">
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