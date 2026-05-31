import { useEffect, useState } from "react";
import api from "../services/api";

interface Comorbidade {
  id?: number;
  nome: string;
  cid: string;
  descricao: string;
}

interface Props {
  comorbidade: Comorbidade | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ModalComorbidade({
  comorbidade,
  onClose,
  onSave,
}: Props) {
  const [nome, setNome] = useState("");
  const [cid, setCid] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (comorbidade) {
      setNome(comorbidade.nome || "");
      setCid(comorbidade.cid || "");
      setDescricao(comorbidade.descricao || "");
    } else {
      limparFormulario();
    }
  }, [comorbidade]);

  function limparFormulario() {
    setNome("");
    setCid("");
    setDescricao("");
  }

  async function salvar() {
    if (!nome.trim()) {
      alert("Informe o nome da comorbidade.");
      return;
    }

    if (!cid.trim()) {
      alert("Informe o CID.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        nome: nome.trim(),
        cid: cid.trim().toUpperCase(),
        descricao: descricao.trim(),
      };

      if (comorbidade?.id) {
        await api.patch(`/comorbidade/${comorbidade.id}`, payload);
        // console.log("Resposta da API:", req.data);
      } else {
        await api.post("/comorbidade", payload);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar comorbidade.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">

          {/* Cabeçalho */}
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-bold">
              {comorbidade
                ? "Editar Comorbidade"
                : "Nova Comorbidade"}
            </h2>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Hipertensão Arterial"
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CID *
              </label>

              <input
                type="text"
                value={cid}
                onChange={(e) =>
                  setCid(e.target.value.toUpperCase())
                }
                placeholder="Ex: I10"
                maxLength={10}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>

              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição da comorbidade..."
                rows={4}
                className="w-full border rounded p-2 resize-none"
              />
            </div>

          </div>

          {/* Rodapé */}
          <div className="border-t px-6 py-4 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={salvar}
              disabled={isSaving}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving
                ? "Salvando..."
                : comorbidade
                ? "Atualizar"
                : "Cadastrar"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}