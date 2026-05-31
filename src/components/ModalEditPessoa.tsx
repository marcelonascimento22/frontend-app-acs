import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Pessoa } from '../types/pessoa';
import type { Familia } from '../types/familia';
import ModalEditFamilia from './ModalEditFamilia';
import formatSUS from '../utils/formatSUS';
import formatCPF from '../utils/formatCPF';
import formatFone from '../utils/formatFone';

interface Props {
  pessoa: Pessoa | null;
  onClose: () => void;
  onSave: (p: Pessoa) => void;
}

const ModalEditPessoa = ({ pessoa, onClose, onSave }: Props) => {
  const [busca, setBusca] = useState('');
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [, setIsLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [form, setForm] = useState<Pessoa | null>(null);
  const [openFamilia, setOpenFamilia] = useState(false);


  const formatarEnderecoCompleto = (f: Familia) => {
    const partes = [
      f.descricao ? `${f.descricao}` : 'Sem Descrição',
      f.endereco,
      f.numero ? `Nº ${f.numero}` : 'S/N',
      f.bairro ? `Bairro ${f.bairro}` : ''
    ].filter(Boolean); // Remove campos nulos/vazios

    return partes.join(' - ');
  };

  function formatDateToInput(date: string | undefined) {
    if (!date) return '';

    if (date.includes('T')) {
      return date.split('T')[0];
    }

    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    }

    return date;
  }

  // --- EFFECT 1: Inicializa o formulário ao abrir o modal ---
useEffect(() => {
  if (pessoa) {
    setForm({
      ...pessoa,
      dataNascimento: formatDateToInput(pessoa.dataNascimento),
    });
  }
}, [pessoa]); // Roda apenas quando a 'pessoa' mudar (abertura do modal)

// --- EFFECT 2: Lógica de Busca de Endereços (Debounce) ---
useEffect(() => {
  const buscarEnderecos = async () => {
    if (busca.length < 3) {
      setFamilias([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.get(`/familia?search=${busca}`);
      setFamilias(data);
    } catch (err) {
      console.error("Erro ao buscar famílias", err);
    } finally {
      setIsLoading(false);
    }
  };

  const timer = setTimeout(buscarEnderecos, 300);
  return () => clearTimeout(timer);
}, [busca]); // Roda apenas quando o texto da 'busca' mudar


  if (!form || !pessoa) return null;

  const handleChange = (field: keyof Pessoa, value: any) => {
    setForm(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = async () => {
    if (!form?.id) return;

    try {
      const payload: any = {
        nome: form.nome,
        cpf: form.cpf,
        sexo: form.sexo,
        telefone: form.telefone,
        dataNascimento: form.dataNascimento
        ? new Date(form.dataNascimento).toISOString()
        : '',
        sus: form.sus ? String(form.sus).replace(/\D/g, '') : undefined,
      };

      if (form.familia?.id) {
        payload.familiaId = Number(form.familia.id);
      }

      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );

      if (Object.keys(cleanPayload).length === 0) {
        alert('Altere pelo menos um campo antes de salvar.');
        return;
      }

      const { data } = await api.put(`/pessoa/${form.id}`, cleanPayload);

      onSave(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar.');
    }
  };

  const handleNovaFamilia = () => {
    setOpenFamilia(true);
  };

  return (
    <>
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-lg shadow-xl  p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Editar Pessoa</h2>

          <div className="space-y-3">

            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input 
                value={form.nome || ''} 
                onChange={e => handleChange('nome', e.target.value)} 
                className="w-full border p-2 rounded mt-1" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input 
                value={formatCPF(form.cpf) || ''} 
                onChange={e => handleChange('cpf', e.target.value)} 
                className="w-full border p-2 rounded mt-1" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SUS</label>
              <input 
                value={formatSUS(String(form.sus)) || ''} 
                onChange={e => handleChange('sus', e.target.value)} 
                className="w-full border p-2 rounded mt-1" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <input 
                type="date"
                value={form.dataNascimento || ''} 
                onChange={e => handleChange('dataNascimento', e.target.value)} 
                className="w-full border p-2 rounded mt-1" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sexo</label>
              <select
                value={form.sexo || ''}
                onChange={e => handleChange('sexo', e.target.value)}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input 
                value={formatFone(form.telefone || '')}
                onChange={e => {
                  const onlyNumbers = e.target.value.replace(/\D/g, '');
                  handleChange('telefone', onlyNumbers);
                }}
                className="w-full border p-2 rounded mt-1" 
              />
            </div>

<div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200 relative">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-800">Vincular Novo Endereço</h3>
    <button
      type="button"
      onClick={handleNovaFamilia}
      className="text-sm text-green-600 hover:underline font-medium"
    >
      + Criar Novo
    </button>
  </div>

  {/* Campo de Busca */}
  <input
    type="text"
    placeholder="Digite a rua ou bairro..."
    value={busca}
    onChange={(e) => {
      setBusca(e.target.value);
      setMostrarResultados(true);
    }}
    className="w-full border p-2 rounded text-sm mb-2"
  />

  {/* Lista de Resultados (Dropdown) */}
  {mostrarResultados && familias.length > 0 && (
    <ul className="absolute left-0 right-0 bg-white border shadow-lg max-h-40 overflow-auto z-[70] mt-[-8px] rounded-b">
      {familias.map((f) => (
        <li
          key={f.id}
          onClick={() => {
            handleChange('familia', f); // Atualiza o objeto família no form
            setBusca(''); // Limpa a busca
            setMostrarResultados(false);
          }}
          className="p-2 hover:bg-blue-50 cursor-pointer text-sm border-b"
        >
          {formatarEnderecoCompleto(f)}
        </li>
      ))}
    </ul>
  )}

  {/* Endereço Atual Selecionado */}
  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
    <span className="text-xs font-bold text-blue-700 uppercase">Endereço Selecionado:</span>
    <p className="text-sm text-gray-700">
      {form.familia
        ? formatarEnderecoCompleto(form.familia)
        : 'Nenhum endereço vinculado'}
    </p>
  </div>
</div>

          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-4 py-1 text-gray-600 hover:bg-gray-100 rounded mb-4 inline-block">
              Cancelar
            </button>
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-400 mb-4 inline-block">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>

      {openFamilia && (
        <ModalEditFamilia
          key={form.familia?.id ?? 'nova'}
          familia={openFamilia && !form.familia ? undefined : form.familia}
          onClose={() => setOpenFamilia(false)}
          onSave={(familiaAtualizada) => {
            if (!familiaAtualizada.id) return;
            setForm(prev => prev ? { ...prev, familia: familiaAtualizada } : prev);
            setOpenFamilia(false);
          }}
        />
      )}
    </>
  );
};

export default ModalEditPessoa;