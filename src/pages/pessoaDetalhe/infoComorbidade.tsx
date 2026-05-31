import { useState } from "react";


import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from "../../services/api";

import { useListaComorbidade } from "../../hooks/useListaComorbidade";
import { useComorbidadePessoa } from "../../hooks/useComorbidadePessoa";
import type { Comorbidade } from "../../types/comorbidade";
import type { PessoaComorbidade } from "../../types/pessoaComorbidade";
import formatDate from "../../utils/formatDate";
import ModalEditarComorbidade from "../../components/ModalEditarComorbidade";
import { Loading } from "../../utils/Loading";




const InfoComrbidade = () => {
    const { id } = useParams();

    const queryClient = useQueryClient();
    
    const [mostrarForm, setMostrarForm] = useState(false);

    //Comorbidades da pessoa
    const { data: comorbidades, isLoading: loadingComorbidades } = useComorbidadePessoa(id);

    const [form, setForm] = useState({
        comorbidadeId: '',
        dataDiagnostico: '',
        observacao: '',
        status: 'Inicio de Tratamento',
    });

    const [itemEditando, setItemEditando] = useState<PessoaComorbidade | null>(null);

    // 🔹 Lista geral
    const { data: listaComorbidades } = useListaComorbidade();

    const idsVinculados = comorbidades?.map(
        (c: PessoaComorbidade) => c.comorbidade.id
    );

      //Vincular
  const vincularMutation = useMutation({
    mutationFn: async () => {
      return api.post('/pessoa-comorbidade/vincular', {
        pessoaId: Number(id),
        comorbidadeId: Number(form.comorbidadeId),
        dataDiagnostico: form.dataDiagnostico,
        observacao: form.observacao,
        status: form.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoa-comorbidades', id] });

      setForm({
        comorbidadeId: '',
        dataDiagnostico: '',
        observacao: '',
        status: 'Inicio de Tratamento',
      });

      setMostrarForm(false); //fecha automaticamente
    },
  });

    // 🔹 Remover
    const removerMutation = useMutation({
        mutationFn: async (relacaoId: number) => {
            return api.delete(`/pessoa-comorbidade/${relacaoId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pessoa-comorbidades', id] });
        },
    });

    if(loadingComorbidades) return <Loading />;


    return(
        <>
        <label className="font-semibold block mb-1 mt-6">Comorbidades</label>
        
        {
          comorbidades && comorbidades.length > 0 ? (
            <>
            {/* MOBILE */}
            <div className="md:hidden flex flex-col gap-4">
              {comorbidades?.map((item: PessoaComorbidade) => (
                <div key={item.id} className="border rounded-lg p-4 shadow">

                  <p><strong>Doença:</strong> {item.comorbidade.nome}</p>
                  <p><strong>Observação</strong> {item.observacao || '-'}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Data:</strong> {formatDate(item.dataDiagnostico)}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded w-full"
                      onClick={() => setItemEditando(item)}
                    >
                      Editar
                    </button>

                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded w-full"
                      onClick={() => {
                        if (!confirm('Deseja remover?')) return;
                        removerMutation.mutate(item.id);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Doença</th>
                    <th className="border px-4 py-2">Observação</th>
                    <th className="border px-4 py-2">Data</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {comorbidades?.map((item: PessoaComorbidade) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.comorbidade.nome}</td>
                      <td className="border px-4 py-2">{item.observacao || '-'}</td>
                      <td className="border px-4 py-2">{formatDate(item.dataDiagnostico)}</td>
                      <td className="border px-4 py-2">{item.status}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                          onClick={() => setItemEditando(item)}
                        >
                          Editar
                        </button>

                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => {
                            if (!confirm('Deseja remover?')) return;
                            removerMutation.mutate(item.id);
                          }}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            

            
            </>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6" role="alert">
                <p className="font-bold">Nenhuma comorbidade encontrada</p>
                <p>Não há registros de comorbidades para esta pessoa.</p>
            </div>

          )

        }

        {/* FORM */}
        <button
          className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 mb-4 mt-6"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : 'Adicionar Comorbidade'}
        </button>

        {mostrarForm && (
          <div className="bg-gray-50 p-4 rounded mb-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              <div>
                <label className="font-semibold block mb-1">Comorbidade</label>
                <select
                  className="border px-3 py-2 rounded w-full"
                  value={form.comorbidadeId}
                  onChange={(e) =>
                    setForm({ ...form, comorbidadeId: e.target.value })
                  }
                >
                  <option value="">Selecione</option>
                  {listaComorbidades
                    ?.filter((c: Comorbidade) => !idsVinculados?.includes(c.id))
                    .map((c: Comorbidade) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Data</label>
                <input
                  type="date"
                  className="border px-3 py-2 rounded w-full"
                  value={form.dataDiagnostico}
                  onChange={(e) =>
                    setForm({ ...form, dataDiagnostico: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Status</label>
                <select
                  className="border px-3 py-2 rounded w-full"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Inicio de Tratamento</option>
                  <option>Controlado</option>
                  <option>Curado</option>
                  <option>Tratamento Abandonado</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="font-semibold block mb-1">Observação</label>
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-full"
                  value={form.observacao}
                  onChange={(e) =>
                    setForm({ ...form, observacao: e.target.value })
                  }
                />
              </div>

            </div>

            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 mt-4 w-full md:w-auto"
              onClick={() => {
                if (!form.comorbidadeId) return;
                vincularMutation.mutate();
              }}
            >
              {vincularMutation.isPending ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        )}


        
        {itemEditando && (
          <ModalEditarComorbidade
          item={itemEditando}
          onClose={() => setItemEditando(null)}
          onSuccess={() => {
              queryClient.invalidateQueries({
              queryKey: ['pessoa-comorbidades', id],
              });
              setItemEditando(null);
          }}
          />
        )}
        </>
    );
}

export default InfoComrbidade;