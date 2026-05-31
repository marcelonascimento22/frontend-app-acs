import { useEffect, useMemo, useState } from "react";
import CriarAgenda from "../../services/criarAgenda";
import { useProfissionais } from "../../hooks/useProfissional";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale/pt-BR";
import { Loading } from "../../utils/Loading";

// 🔹 Função segura contra timezone
const toLocalDate = (dateStr?: string) => {
  if (!dateStr) return new Date();

  const clean = dateStr.slice(0, 10);
  const [y, m, d] = clean.split("-").map(Number);

  return new Date(y, m - 1, d, 12, 0, 0);
};

const Agenda = () => {
  const [dataPrevista, setDataPrevista] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("12:00");
  const [quantidade, setQuantidade] = useState(4);
  const [observacoes, setObservacoes] = useState("");

  const [feriados, setFeriados] = useState<
    { date: string; name: string }[]
  >([]);

  const { data: profissionais, isLoading } = useProfissionais();

  // 🔹 Datas dos feriados
  const feriadosDate = useMemo(
    () =>
      feriados
        .filter((f) => f?.date)
        .map((f) => toLocalDate(f.date)),
    [feriados]
  );

  // 🔹 Feriado selecionado
  const feriadoSelecionado = feriados.find(
    (f) => f?.date?.slice(0, 10) === dataPrevista
  );

  const selectedDate = dataPrevista
    ? toLocalDate(dataPrevista)
    : undefined;

  // 🔹 Buscar feriados
  useEffect(() => {
    fetch("https://brasilapi.com.br/api/feriados/v1/2026")
      .then((res) => res.json())
      .then((json) =>
        setFeriados(
          json
            .filter((f: any) => f?.date && f?.name)
            .map((f: any) => ({
              date: f.date,
              name: f.name,
            }))
        )
      )
      .catch((err) => console.error("Erro feriados:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataPrevista) {
      alert("Selecione uma data");
      return;
    }

    if (!profissionalId) {
      alert("Selecione um profissional");
      return;
    }

    try {
      await CriarAgenda({
        dataPrevista,
        profissionalId: Number(profissionalId),
        horaInicio,
        horaFim,
        quantidadeAtendimentos: quantidade,
        observacoes,
      });

      //console.log("Agenda criada:", agenda);
      alert("Agenda criada com sucesso");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Erro ao criar agenda");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-6">Criar Agenda</h2>


            {/* 📅 CALENDÁRIO BONITO */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-md border w-full max-w-sm transition hover:shadow-lg">
            <DayPicker
              mode="single"
              selected={selectedDate}
              locale={ptBR}
              onSelect={(d) => {
                if (d) {
                  const normalized = new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate()
                  );

                  setDataPrevista(
                    format(normalized, "yyyy-MM-dd")
                  );
                }
              }}
              modifiers={{ feriado: feriadosDate }}
              modifiersStyles={{
                feriado: {
                  backgroundColor: "#fecaca",
                  color: "#991b1b",
                  fontWeight: "bold",
                },
              }}
              classNames={{
                months: "flex justify-center",
                month: "space-y-2",
                caption:
                  "flex justify-center font-semibold text-gray-700",

                table: "w-full border-collapse",
                head_row: "flex",
                head_cell: "text-gray-500 w-10 text-sm",
                row: "flex w-full mt-1",
                cell: "w-10 h-10 text-center",
                day:
                  "w-10 h-10 rounded-lg hover:bg-gray-100 transition",
                day_selected:
                  "bg-green-500 text-white hover:bg-green-600",
                day_today: "border border-blue-400",
              }}
            />

            {/* 📅 FERIADO */}
            {feriadoSelecionado && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm">
                📅 {feriadoSelecionado.name}
              </div>
            )}
          </div>
        </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >

        

        {/* PROFISSIONAL */}
        <div>
          <label className="font-semibold block mb-1">
            Profissional
          </label>
          <select
            className="border px-3 py-2 rounded-lg w-full"
            value={profissionalId}
            onChange={(e) => setProfissionalId(e.target.value)}
            required
          >
            <option value="">Selecione um profissional</option>

            {isLoading ? (
              <option><Loading /></option>
            ) : (
              profissionais?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.usuario?.nome} -{" "}
                  {p.especialidade || "Sem especialidade"}
                </option>
              ))
            )}
          </select>
        </div>



        {/* HORA INÍCIO */}
        <div>
          <label className="font-semibold block mb-1">
            Hora Início
          </label>
          <input
            type="time"
            className="border px-3 py-2 rounded-lg w-full"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
          />
        </div>

        {/* HORA FIM */}
        <div>
          <label className="font-semibold block mb-1">
            Hora Fim
          </label>
          <input
            type="time"
            className="border px-3 py-2 rounded-lg w-full"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            required
          />
        </div>

        {/* QUANTIDADE */}
        <div>
          <label className="font-semibold block mb-1">
            Quantidade de Atendimentos
          </label>
          <input
            type="number"
            className="border px-3 py-2 rounded-lg w-full"
            min={1}
            value={quantidade}
            onChange={(e) =>
              setQuantidade(Number(e.target.value))
            }
            required
          />
        </div>

        {/* OBSERVAÇÃO */}
        <div>
          <label className="font-semibold block mb-1">
            Observação
          </label>
          <input
            type="text"
            className="border px-3 py-2 rounded-lg w-full"
            value={observacoes}
            onChange={(e) =>
              setObservacoes(e.target.value)
            }
          />
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition mt-2"
        >
          Criar Agenda
        </button>
      </form>
    </div>
  );
};

export default Agenda;