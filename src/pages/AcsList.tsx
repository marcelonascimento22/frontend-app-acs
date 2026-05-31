import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import formatFone from '../utils/formatFone';
import type { Usuario } from '../types/usuarios';
import { Loading } from '../utils/Loading';

const AcsList = () => {
  const { data: acs, isLoading, error } = useQuery({
    queryKey: ['usuarios', 'acs'],
    queryFn: () => api.get<Usuario[]>('/usuarios').then(res => res.data),
  });

  if (isLoading) return <Loading />;

  if (error) return <div>Erro ao carregar acs</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl flex justify-center font-bold mb-4">ACS</h1>

      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nome</th>
            <th className="border border-gray-300 px-4 py-2">E-mail</th>
            <th className="border border-gray-300 px-4 py-2">Telefone</th>
            <th className="border border-gray-300 px-4 py-2">Perfil</th>
          </tr>
        </thead>
        <tbody>
          {acs
            ?.filter(a => a.perfil === 'ACS')
            .map(a => (
              <tr key={a.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{a.nome}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {a.email ? a.email : '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {a.telefone ? formatFone(a.telefone) : '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {a.perfil ? a.perfil : '-'}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      
    </div>
  );
};

export default AcsList;



