import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { CreatePessoaDto } from '../types/pessoa';
import type { Familia } from '../types/familia';
import ModalEditFamilia from './ModalEditFamilia';
import { Loading } from '../utils/Loading';

const ModalNovaPessoa = () => {
  // 🔹 Controle do modal de família
  const [openFamilia, setOpenFamilia] = useState(false);

  // 🔹 Busca e seleção
  const [busca, setBusca] = useState('');
  const [familiaSelecionada, setFamiliaSelecionada] = useState<Familia | null>(null);

  const formatarEnderecoCompleto = (f: Familia) => {
    const partes = [
      f.endereco,
      f.numero ? `Nº ${f.numero}` : 'S/N',
      f.bairro ? `Bairro ${f.bairro}` : ''
    ].filter(Boolean); // Remove campos nulos/vazios

    return partes.join(' - ');
  };

  

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreatePessoaDto>({
    defaultValues: {
      nome: '',
      cpf: '',
      sus: '',
      dataNascimento: undefined,
      sexo: '',
      telefone: '',
      familiaId: undefined,
    },
    shouldUnregister: false,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 🔎 BUSCA DE FAMÍLIAS
  const { data: familias = [], isLoading } = useQuery({
    queryKey: ['familias', busca],
    queryFn: async () => {
      if (!busca) return [];
      const response = await api.get(`/familia?search=${busca}`);
      return response.data;
    },
    enabled: !!busca,
    staleTime: 0, // 🔥 evita cache estranho
  });

  // 🚀 MUTATION (SALVAR PESSOA)
  const mutation = useMutation({
    mutationFn: async (data: CreatePessoaDto) => {
      //console.log('ENVIANDO PRO BACKEND:', data);
      const response = await api.post('/pessoa', data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
      navigate('/pessoas');
    },

    onError: (error: any) => {
      console.error('ERRO AO SALVAR:', error);

      if (error.response) {
        alert(error.response.data.message || 'Erro ao salvar');
      } else {
        alert('Erro de conexão com o servidor');
      }
    },
  });

  // ✅ SUBMIT
  const onSubmit = (data: CreatePessoaDto) => {
    //console.log('DADOS DO FORMULÁRIO:', data);
    if (!data.nome) {
      alert('Nome é obrigatório!');
      return;
    }

    if (!data.familiaId) {
      alert('Selecione uma família!');
      return;
    }
    //console.log('FORM DATA:', data);
    const payload = {
      ...data,
      familiaId: Number(data.familiaId),
      dataNascimento: data.dataNascimento ? String(data.dataNascimento): '',
    };

    //console.log('ENVIANDO AJUSTADO:', payload);

    mutation.mutate(payload);
  };

  // ✅ SELECIONAR FAMÍLIA (CORREÇÃO PRINCIPAL)
  const selecionarFamilia = (familia: Familia) => {
    setFamiliaSelecionada(familia);
    setBusca(familia.endereco ?? '');

    // 🔥 AGORA SALVA O ID CORRETAMENTE
    setValue('familiaId', familia.id, { shouldValidate: true });
  };

  // ➕ ABRIR MODAL NOVA FAMÍLIA
  const handleNovaFamilia = () => {
    //console.log('CLICOU NO BOTÃO NOVO ENDEREÇO');
    setOpenFamilia(true);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl flex justify-center">Cadastrar Pessoa</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* 🔥 CAMPO OCULTO (OBRIGATÓRIO) */}
        <input type="hidden" {...register('familiaId')} />

        {/* NOME */}
        <div>
          <label>Nome</label>
          <input
            {...register('nome', { required: 'Nome é obrigatório' })}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.nome && (
            <p className="text-red-500 text-sm">{errors.nome.message}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label>CPF</label>
          <input
            {...register('cpf')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* SUS */}
        <div>
          <label>SUS</label>
          <input
            {...register('sus')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* DATA NASCIMENTO */}
        <div>
          <label>Data de Nascimento</label>
          <input
            type="date"
            {...register('dataNascimento')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* SEXO */}
        <div>
          <label>Sexo</label>
          <select
            {...register('sexo')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        {/* TELEFONE */}
        <div>
          <label>Telefone</label>
          <input
            {...register('telefone')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* 🔎 BUSCA DE FAMÍLIA */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Buscar Endereço</label>
          <input
            value={busca}
            onChange={(e) => {
              const value = e.target.value;
              setBusca(value); // Aqui mantemos apenas o que o usuário digita
              setFamiliaSelecionada(null);
              setValue('familiaId', undefined); // Limpa o ID se ele voltar a digitar
            }}
            placeholder="Ex: Rua das Flores, 123..."
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* LOADING */}
          {isLoading && (
            <Loading />
          )}

          {/* RESULTADOS */}
          {familias.length > 0 && !familiaSelecionada && (
            <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-auto z-30 shadow-xl rounded-md">
              {familias.map((f: Familia) => (
                <li
                  key={f.id}
                  onClick={() => selecionarFamilia(f)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-none text-sm"
                >
                  {/* 🔥 Exibe formatado na lista de sugestões */}
                  <span className="font-semibold text-gray-800">
                    {formatarEnderecoCompleto(f)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ➕ NOVO ENDEREÇO */}
        <button
          type="button"
          onClick={handleNovaFamilia}
          className="relative z-20 text-sm text-green-600 hover:underline font-medium"
        >
          Novo Endereço
        </button>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-500 text-white py-1 rounded hover:bg-green-400 disabled:opacity-50"
        >
          {mutation.isPending ? 'Salvando...' : 'Cadastrar'}
        </button>

        {/* 🧩 MODAL DE FAMÍLIA */}
        {openFamilia && (
          <ModalEditFamilia
            key={familiaSelecionada?.id ?? 'nova'}
            familia={familiaSelecionada ?? undefined}
            onClose={() => setOpenFamilia(false)}
            onSave={(familiaAtualizada: Familia) => {
              if (!familiaAtualizada.id) {
                console.error("Família sem ID");
                return;
              }
              // Atualiza seleção automaticamente
              setFamiliaSelecionada(familiaAtualizada);
              setBusca(familiaAtualizada.endereco ?? '');

              //CRUCIAL: já salva o ID no form
              setValue('familiaId', familiaAtualizada.id, { shouldValidate: true });

              setOpenFamilia(false);
            }}
          />
        )}

      </form>
    </div>
  );
};

export default ModalNovaPessoa;