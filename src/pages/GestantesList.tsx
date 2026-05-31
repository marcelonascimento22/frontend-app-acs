import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Gestantes } from '../types/gestantes';
import formatCPF from '../utils/formatCPF';
import formatDate from '../utils/formatDate';
import formatSUS from '../utils/formatSUS';
import calculateAge from '../utils/calculateAge';
import formatFone from '../utils/formatFone';
import { Loading } from '../utils/Loading';

const GestantesList = () => {
  const { data: gestantes, isLoading, error } = useQuery({
    queryKey: ['gestantes'],
    queryFn: () => api.get<Gestantes[]>('/gestacao').then(res => res.data),
  });

  if (isLoading) return <Loading />;

  if (error) return <div className="text-red-500">Erro ao carregar gestantes</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl flex justify-center font-bold mb-4">Gestantes</h1>

      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nome</th>
            <th className="border border-gray-300 px-4 py-2">Data de Nascimento</th>
            <th className="border border-gray-300 px-4 py-2">Fone</th>
            <th className="border border-gray-300 px-4 py-2">CPF</th>
            <th className="border border-gray-300 px-4 py-2">SUS</th>
            <th className="border border-gray-300 px-4 py-2">Data Prevista Parto</th>
            <th className="border border-gray-300 px-4 py-2">Observação</th>
          </tr>
        </thead>

        <tbody>
          {gestantes?.map(v => (
            <tr key={v.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{v.pessoa?.nome}</td>

              <td className="border border-gray-300 px-4 py-2">
                {v.pessoa?.dataNascimento ? calculateAge(v.pessoa.dataNascimento) : "N/A"}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {formatFone(v.pessoa?.telefone) || '-'}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {formatCPF(v.pessoa?.cpf)}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {formatSUS(String(v.pessoa?.sus)) || '-'}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {formatDate(v.dataPrevistaParto) || '-'}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {v.observacoes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestantesList;