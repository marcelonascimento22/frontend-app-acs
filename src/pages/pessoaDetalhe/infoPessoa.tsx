import { useParams } from "react-router-dom";
import calculateAge from "../../utils/calculateAge";
import formatDate from "../../utils/formatDate";
import formatSUS from "../../utils/formatSUS";
import { usePessoa } from "../../hooks/usePessoa";
import type { Pessoa } from "../../types/pessoa";
import { useState } from "react";
import ModalEditPessoa from "../../components/ModalEditPessoa";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "../../utils/Loading";



const InfoPessoa = () => {

  const queryClient = useQueryClient();

    const { id } = useParams();

    const { data: pessoa, isLoading: loadingPessoa } = usePessoa(id);

    const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);

    const handleSave = (updated: Pessoa) => {
    queryClient.setQueryData(['pessoas'], (oldData: any) =>
      oldData.map((p: Pessoa) => (p.id === updated.id ? updated : p))
    );
  };

    if (loadingPessoa) {
     return <Loading />;
    }

        ////console.log('ID: ', id)
    
    return(
        <>
            {/* TÍTULO */}
          <h1 className="text-xl md:text-2xl font-bold text-center mb-6">
            Detalhes da Pessoa
          </h1>

          {/* CARD */}
          <div className="bg-white shadow rounded p-4 mb-6 space-y-1 text-sm md:text-base">
            <p><strong>Nome:</strong> {pessoa.nome}</p>
            <p><strong>Idade:</strong> {calculateAge(pessoa.dataNascimento)} anos</p>
            <p><strong>Data de Nascimento:</strong> {formatDate(pessoa.dataNascimento)}</p>
            <p><strong>SUS:</strong> {formatSUS(pessoa.sus) || 'Não informado'}</p>
            
            <button
                className="bg-blue-500 text-white px-3 py-1 rounded w-full"
                onClick={() => setSelectedPessoa(pessoa)}
              >
                Editar
              </button>
            
          </div>


          {selectedPessoa && (
          <ModalEditPessoa
            pessoa={selectedPessoa}
            onClose={() => setSelectedPessoa(null)}
            onSave={handleSave}
        />
      )}
        </>

    );
}

export default InfoPessoa;