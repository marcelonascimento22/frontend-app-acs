import formatDate from '../../utils/formatDate';
import { api } from '../../services/api';
import type { Vacina } from '../../types/vacina';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '../../utils/Loading';

const VacinasAplicadas = () => {

    // 🔹 Buscar vacinas (tabela)
  const { data: vacinas, isLoading, error } = useQuery({
    queryKey: ['vacinas'],
    queryFn: () => api.get<Vacina[]>('/vacinacao').then(res => res.data),
  });


  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">Erro ao carregar vacinas</div>;
  //console.log(vacinas);
  return (
    <>
    {/* DESKTOP */}
    <div className="hidden md:block overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full" >
            <thead>
                <tr className="bg-gray-100">
                <th className="border px-4 py-2">Pessoa</th>
                <th className="border px-4 py-2">Vacina</th>
                <th className="border px-4 py-2">Dose</th>
                <th className="border px-4 py-2">Data</th>
                <th className="border px-4 py-2">Ações</th>
                </tr>
            </thead>

            <tbody>
                {vacinas?.map((v:any) => (
                <tr key={v.id}>
                    <td className="border px-4 py-2">{v.pessoa?.nome}</td>
                    <td className="border px-4 py-2">{v.vacina?.nome || '-'}</td>
                    <td className="border px-4 py-2">{v.dose}</td>
                    <td className="border px-4 py-2">{formatDate(v.dataAplicacao)}</td>
                    <td className="border px-4 py-2">
                        <button 
                        className="bg-blue-500 text-white px-3 py-1 rounded w-full" 
                        onClick={() => window.location.href = `/pessoa/${v.pessoa?.id}`}>
                            Detalhes
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>


    </div>

    {/* MOBILE */}
      <div className="md:hidden flex flex-col gap-4">
        {vacinas?.map((v: any) => (
          <div key={v.id} className="border rounded p-4 bg-white">
            <p><strong>Pessoa:</strong> {v.pessoa?.nome}</p>
            <p><strong>Vacina:</strong> {v.vacina?.nome || '-'}</p>
            <p><strong>Dose:</strong> {v.dose}</p>
            <p><strong>Data:</strong> {formatDate(v.dataAplicacao)}</p>
            <button 
            className="bg-blue-500 text-white px-3 py-1 rounded w-full" 
            onClick={() => window.location.href = `/pessoa/${v.pessoa?.id}`}>
              Detalhes
            </button>
          </div>
        ))}

      </div>
    </>
  );
};

export default VacinasAplicadas;