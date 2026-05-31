import { useNavigate, useParams } from "react-router-dom";
import { useUsuario } from "../hooks/useUsuario";
import api from "../services/api";
import { useEffect, useState } from "react";
import { Loading } from "../utils/Loading";

const EditarUsuarios = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const { data: usuario, isLoading } = useUsuario(id ?? "");

    const profissional = usuario?.profissional ? usuario?.profissional : undefined;

    const [mostrarForm, setMostrarForm] = useState(false);


    const [form, setForm] = useState(
        {
            nome: "",
            telefone: "",
            cpf: "",
            email: "",
            perfil: "ACS",
            ativo: true,
        }
    );

    const [formProfissional, setFormProfissional] = useState(
        {
            usuarioId: "",
            especialidade: "",
            conselho: "",
            numeroRegistro: "",
        }
    );

   const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleProfissionalChange = (
    e: React.ChangeEvent<HTMLInputElement>
    ) => {
    const { name, value, type, checked } = e.target;

    setFormProfissional((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
    }));
    };

    const [loading, setLoading] = useState(false);

    //console.log("Usuario", usuario)

    useEffect(() => {

        if (!usuario) return;

        setForm({
            nome: usuario.nome || "",
            email: usuario.email || "",
            telefone: usuario.telefone || "",
            cpf: usuario.cpf || "",
            perfil: usuario.perfil || "ACS",
            ativo: usuario.ativo ?? true,
        });

        if (usuario.profissional) {

            setFormProfissional({
                usuarioId: usuario.id || "",
                especialidade: usuario.profissional.especialidade || "",
                conselho: usuario.profissional.conselho || "",
                numeroRegistro: String(usuario.profissional.numeroRegistro) || "",
            });

            setMostrarForm(true);

        } else {

            setMostrarForm(false);

            setFormProfissional({
                usuarioId: usuario.id || "",
                especialidade: "",
                conselho: "",
                numeroRegistro: "",
            });
        }

    }, [usuario]);



    const handleSubmit = async (e: any) => {

        e.preventDefault();
    
        try {

            setLoading(true);

            const res = await api.patch(`/usuarios/${id}`, form);
            console.log("Requisição", res)

            if (mostrarForm) {
                console.log("Atualizando profissional: ", formProfissional)
                console.log("ID Profissional: ", usuario?.id)

                if (usuario?.profissional?.id) {
                    
                    
                    await api.patch(
                        `/profissionais/${usuario.profissional.id}`,
                        formProfissional
                    );

                } else {

                    await api.post(
                        "/profissionais", 
                        formProfissional
                    );
                }
            }



          alert("Usuário atualizado com sucesso!");

          navigate("/usuarios");

        } catch (err: any) {
          console.error(err);
          alert(err?.response?.data?.message || "Erro ao criar atualizar!");
        } finally {
          setLoading(false);
        }
    };

    if (isLoading) return <Loading />;


    console.log("Profissional", profissional)
    return(
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Usuário</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Nome */}
                <div>
                <label className="block mb-1">Nome</label>
                <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                </div>

                {/* CPF */}
                <div>
                <label className="block mb-1">CPF</label>
                <input
                    type="text"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                </div>

                {/* Telefone */}
                <div>
                <label className="block mb-1">Telefone</label>
                <input
                    type="text"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                </div>

                {/* Email */}
                <div>
                <label className="block mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                </div>

                {/* Perfil */}
                <div>
                <label className="block mb-1">Perfil</label>
                <select
                    name="perfil"
                    value={form.perfil}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    <option value="ADMIN">Admin</option>
                    <option value="ACS">ACS</option>
                    <option value="ATENDIMENTO">Atendimento</option>
                </select>
                </div>

                <button
                    type="button"
                    className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 mb-4 mt-6"
                    onClick={() => setMostrarForm(!mostrarForm)}
                >
                    {mostrarForm ? 'Cancelar' : 'Adicionar Especialidade'}
                </button>

                {mostrarForm && (
                <>
                    {/* Profissional - Especialidade*/}
                    <div>
                    <label className="block mb-1">Especialidade</label>
                    <input
                        name="especialidade"
                        value={formProfissional.especialidade}
                        onChange={handleProfissionalChange}
                        className="w-full border p-2 rounded"
                    />
                    </div>

                    {/* Profissional - Conselho */}
                    <div>
                    <label className="block mb-1">Conselho</label>
                    <input
                        name="conselho"
                        value={formProfissional.conselho}
                        onChange={handleProfissionalChange}
                        className="w-full border p-2 rounded"
                    />
                    </div>

                    {/* Profissional - Número do Registro */}
                    <div>
                    <label className="block mb-1">Número do Registro</label>
                    <input
                        type="text"
                        name="numeroRegistro"
                        value={formProfissional.numeroRegistro}
                        onChange={handleProfissionalChange}
                        className="w-full border p-2 rounded"
                    />
                    </div>
                </>
                )}

                {/* Ativo */}
                <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="ativo"
                    checked={form.ativo}
                    onChange={handleChange}
                />
                <label>Usuário ativo</label>
                </div>

                {/* Botão */}
                <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                {loading ? "Atualizando..." : "Atualizar"}
                </button>
            </form>
            </div>
    );

}

export default EditarUsuarios;
