import { useParams } from "react-router-dom";
import { useVacina } from "../../hooks/useVacina";
import formatDate from "../../utils/formatDate";
import { Loading } from "../../utils/Loading";

export const InfoVacina = () => {

     const { id } = useParams();

     const idNumber = id ? Number(id) : undefined;

    const { data: vacinas, isLoading } = useVacina(idNumber);


    ////////console.log('Vacinas: ', vacinas);

    if (isLoading) return <Loading />;

    
    
    return (
        <>

        <label className="font-semibold block mb-1 mt-6">Vacinas Aplicadas</label>

        {
            vacinas && vacinas.length > 0 ? (
                <>
    
                

                {/* DESKTOP */}
                <div className="hidden md:block overflow-x-auto">
                                   
                    <table className="table-auto border-collapse border border-gray-300 w-full">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Nome</th>
                            <th className="border px-4 py-2">Dose</th>
                            <th className="border px-4 py-2">Lote</th>
                            <th className="border px-4 py-2">Vai de Administração</th>
                            <th className="border px-4 py-2">Data da Aplicação</th>
                        </tr>
                        </thead>

                        <tbody>
                        {vacinas?.map((v: any) => (
                            <tr key={v.id} >

                            <td className="border px-4 py-2">
                                {v.vacina?.nome || 'Sem Nome'}
                            </td>

                            <td className="border px-4 py-2">
                                {v.dose || '-'}
                            </td>

                            <td className="border px-4 py-2">
                                {v.lote || '-'}
                            </td>

                            <td className="border px-4 py-2">
                                {v.vacina?.viaAdministracao || '-'}
                            </td>

                            <td className="border px-4 py-2">
                                {formatDate(v.dataAplicacao) || '-'}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>

                {/* MOBILE */}
                <div className="md:hidden space-y-4">
                    

                    {vacinas?.map((v: any)=> (
                        <div key={v.id} className="border rounded-lg p-4 shadow">
                            <p><strong>Vacina:</strong> {v.vacina?.nome || 'Sem Nome'}</p>
                            <p><strong>Dose:</strong> {v.dose || '-'}</p>
                            <p><strong>Lote:</strong> {v.lote || '-'}</p>
                            <p><strong>Via de Administração:</strong> {v.vacina?.viaAdministracao || '-'}</p>
                            <p><strong>Data de Aplicação:</strong> {formatDate(v.dataAplicacao) || '-'}</p>
                        </div>
                    ))}
                </div>
                </>

                ) : (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6" role="alert">
                        <p className="font-bold">Nenhuma vacina encontrada</p>
                        <p>Não há registros de vacinas aplicadas para esta pessoa.</p>
                    </div>
                )  
        } 
        
        </>
    );
}