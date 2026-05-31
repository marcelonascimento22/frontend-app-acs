import { useAgenda } from "../../hooks/useAgenda";
import { cancelarAgenda } from "../../services/cancelarAgenda";
import formatDate from "../../utils/formatDate";
import { Loading } from "../../utils/Loading";

const InfoAgendasCriadas = () => {
    const { data: agendas, isLoading } = useAgenda();

    const handleCancelar = async (agendaId: number) => {
        const obs = prompt("Informe o motivo do cancelamento:");

        if (!obs) return;

        try {
        await cancelarAgenda(agendaId, obs);

        alert("Agenda cancelada com sucesso");

        // aqui você pode recarregar os dados
        window.location.reload();

        } catch (error) {
        console.error(error);
        alert("Erro ao cancelar agenda");
        }
    };


    //console.log('Agendas : ', agendas)

    if(isLoading) {
        return <Loading />;
    }
  return (
    <>
    {
    agendas && agendas?.length > 0 ? (
        <>
            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead>
                        <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Profissional</th>
                        <th className="border px-4 py-2">Data</th>
                        <th className="border px-4 py-2 text-center">Horário</th>
                        <th className="border px-4 py-2 text-center">Observações</th>
                        <th className="border px-4 py-2 text-center">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {agendas
                        ?.filter((agenda) => {
                            const hoje = new Date().toLocaleDateString("sv-SE");
                            //console.log("Hoje: ", hoje)
                            return agenda.dataPrevista >= hoje;
                        })?.map((agenda:any) => (
                        <tr key={agenda.id} className="hover:bg-gray-100 transition">
                            <td className="border px-4 py-2">
                            {agenda.profissional?.usuario?.nome || 'Profissional não disponível'}
                            </td>
                            <td className="border px-4 py-2">
                            {(formatDate(agenda.dataPrevista)) || 'Data não disponível'}
                            </td>
                            <td className="border px-4 py-2 text-center">
                            {
                                agenda.slots?.length
                                    ? `${agenda.slots[0].horario} - ${agenda.slots[agenda.slots.length - 1].horario}`
                                    : 'Horário não disponível'
                            }
                            </td>
                            <td className="border px-4 py-2 text-center">
                            {agenda.observacoes || 'Nenhuma observação'}
                            </td>

                            <td className="border px-4 py-2 text-center">
                                {agenda.status !== 'CANCELADO' ? 
                                    <button 
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleCancelar(agenda.id)}>
                                        Cancelar Agenda
                                    </button>
                                : "Agenda Cancelada"}                            </td>

                            
                        </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {/** MOVEL  */}
            <div className="md:hidden space-y-3">
            {agendas?.map((agenda: any) => (
            <div
                key={agenda.id}
                className="border p-4 rounded shadow-sm"
            >
                <div className="font-bold">
                    Profissional:  
                {(
                        ` ${agenda.profissional?.usuario?.nome} - 
                        ${agenda.profissional?.especialidade || 'Especialidade não especificada'}`
                        ) || "Profissional não especificado"}
                </div>
                
                <div>
                Data: {formatDate(agenda.dataPrevista)}
                </div>

                <div>
                Horario das {agenda.slots?.[0]?.horario?.slice(0, 5) ?? "--:--"} às  {agenda.slots?.[agenda.slots.length - 1]?.horario?.slice(0, 5) ?? "--:--"}
                </div>

                

                <div className="text-sm mt-1">
                Observações: {agenda.observacoes || 'Nenhuma observação'}
                </div>

                <div className="text-sm mt-1">
                    {agenda.status !== 'CANCELADO' ? 
                        <button 
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleCancelar(agenda.id)}>
                            Cancelar Agenda
                        </button>
                    : "Agenda Cancelada"}
                    
                </div>

                

                
            </div>
            ))}
        </div>
        </>
    ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6" role="alert">
            <p className="font-bold">Nenhuma agenda encontrada</p>
            <p>Não há registros de agendas cadastradas.</p>
        </div>
    )
    }

    </>
  );
};

export default InfoAgendasCriadas;