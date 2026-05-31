import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Pessoa } from '../types/pessoa';
import calculateAge from '../utils/calculateAge';
import formatCPF from '../utils/formatCPF';
import formatFone from '../utils/formatFone';
import formatSUS from '../utils/formatSUS';
import ModalEditPessoa from '../components/ModalEditPessoa';
import { Loading } from '../utils/Loading';



const PessoaList = () => {
  const queryClient = useQueryClient();
  const { data: pessoas, isLoading, error } = useQuery({
    queryKey: ['pessoas'],
    queryFn: () => api.get<Pessoa[]>('/pessoa').then(res => res.data),
  });

  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);
  const navigate = useNavigate();
  
  const handleSave = (updated: Pessoa) => {
    queryClient.setQueryData(['pessoas'], (oldData: any) =>
      oldData.map((p: Pessoa) => (p.id === updated.id ? updated : p))
    );
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Erro ao carregar pessoas</div>;

  return (

    



    <div className="overflow-x-auto">
      <h1 className="text-xl flex justify-center font-bold mb-4">Usuários</h1>
      
      <Link to="/pessoas/nova" className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-400 mb-4 inline-block">
        Cadastrar Nova Pessoa
      </Link>

      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nome</th>
              <th className="border px-4 py-2">Idade</th>
              <th className="border px-4 py-2">CPF</th>
              <th className="border px-4 py-2">SUS</th>
              <th className="border px-4 py-2">Telefone</th>
              <th className="border px-4 py-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {pessoas?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{p.nome}</td>
                <td className="border px-4 py-2">
                  {p.dataNascimento ? calculateAge(p.dataNascimento) : '-'}
                </td>
                <td className="border px-4 py-2">{formatCPF(p.cpf) || '-'}</td>
                <td className="border px-4 py-2">{formatSUS(p.sus) || '-'}</td>
                <td className="border px-4 py-2">{formatFone(p.telefone) || '-'}</td>

                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-1"
                    onClick={() => setSelectedPessoa(p)}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => navigate(`/pessoa/${p.id}`)}
                  >
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
        {pessoas?.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow">

            <p><strong>Nome:</strong> {p.nome}</p>
            <p><strong>Idade:</strong> {p.dataNascimento ? calculateAge(p.dataNascimento) : '-'}</p>
            <p><strong>CPF:</strong> {formatCPF(p.cpf) || '-'}</p>
            <p><strong>SUS:</strong> {formatSUS(p.sus) || '-'}</p>
            <p><strong>Telefone:</strong> {formatFone(p.telefone) || '-'}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded w-full"
                onClick={() => setSelectedPessoa(p)}
              >
                Editar
              </button>

              <button
                className="bg-gray-500 text-white px-3 py-1 rounded w-full"
                onClick={() => navigate(`/pessoa/${p.id}`)}
              >
                Detalhes
              </button>
            </div>

          </div>
        ))}
      </div>




      {selectedPessoa && (
        <ModalEditPessoa
          pessoa={selectedPessoa}
          onClose={() => setSelectedPessoa(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PessoaList;