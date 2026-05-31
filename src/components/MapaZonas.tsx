import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import api from "../services/api";
import DialogEditarZona from "./DialogEditarZona";
import { ZonaLayer } from "./ZonaLayer";
import { Loading } from "../utils/Loading";



// Ícone das famílias
const createFamilyIcon = (numeroIntegrantes: number) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #ef4444; 
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        border: 2px solid white; 
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 11px;
        font-weight: bold;
      ">
        ${numeroIntegrantes}
      </div>
    `,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Cores
const cores = [
  "#ef4444",
  "#22c55e", 
  "#3b82f6", 
  "#eab308", 
  "#a855f7", 
  "#f97316", 
  "#14b8a6"
];

type Zona = {
  id: number;
  nome: string;
  descricao: string;
  geometria: any;
};



// 🔹 Geoman Controls
function GeomanControls({ onCreate }: { onCreate: (geojson: any) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

  map.pm.addControls({
    position: "topright",
    drawPolygon: true,

    // ❌ desativando
    drawMarker: false,
    drawCircle: false,
    drawPolyline: false,
    drawRectangle: false,
    drawCircleMarker: false,
    drawText: false,

    drawLayer: false,
    rotateMode: false,
    
    editMode: true,
    dragMode: true,
    cutPolygon: true,
    removalMode: true,
  }
);

    const handler = (e: any) => {
      const geojson = e.layer.toGeoJSON();
      onCreate(geojson);
      e.layer.remove();
    };

    map.on("pm:create", handler);

    return () => {
      map.off("pm:create", handler);
    };
  }, [map, onCreate]);

  return null;
}

// 🔹 COMPONENTE PRINCIPAL
const MapaZonas = () => {
  const queryClient = useQueryClient();
  const [modoDialog, setModoDialog] = useState<"editar" | "criar">("editar");
  const [geometriaNovaZona, setGeometriaNovaZona] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [zonaSelecionada, setZonaSelecionada] = useState<any>(null);
  const [zonasEditadas, setZonasEditadas] = useState<any[]>([]);

  // 🔹 Queries
  const { data: familia } = useQuery({
    queryKey: ["familia"],
    queryFn: () => api.get("/familia").then(res => res.data),
  });

  const { data: zonas, isLoading, isError } = useQuery({
    queryKey: ["zonas"],
    queryFn: () => api.get("/zonas").then(res => res.data),
  });

  // Adicione esta query no topo do seu componente MapaZonas
  const { data: usuarios } = useQuery({
    queryKey: ["usuarios", "ACS"],
    queryFn: async () => {
      const res = await api.get("/usuarios?tipo=ACS");
      return res.data;
    },
  });
  
 // 2. Editar geometria (Memoizado para não quebrar o onEachZona)
  const editarZonaGeometria = useCallback((id: number, geojson: any) => {
    setZonasEditadas(prev => {
      const existente = prev.find(z => z.id === id);
      if (existente) {
        return prev.map(z =>
          z.id === id ? { ...z, geometria: geojson.geometry } : z
        );
      }
      return [...prev, { id, geometria: geojson.geometry }];
    });
  }, []);

  // 🔹 Criar zona
  const criarZona = (geojson: any) => {

    if (!geojson?.geometry) return;

    setModoDialog("criar");
    setGeometriaNovaZona(geojson.geometry);
    setZonaSelecionada({ nome: "", descricao: "", acsId: "" });
    setDialogOpen(true);
  };

  // 🔹 Eventos da zona

// 3. Eventos da zona (A Lógica que você queria trazer)
  const onEachZona = useCallback((feature: any, layer: L.Layer) => {
    if (!feature || !feature.properties) return;

    const {
      nome = "Sem nome",
      acsNome = "Sem ACS",
      id,
      acsId,
      descricao = "Sem descrição",
    } = feature.properties;

    // Tooltip agora exibe o ACS injetado pelo ZonaLayer
    layer.bindTooltip(
      `<strong>${nome}</strong><br/>
       <span style="color: blue">ACS: ${acsNome}</span><br/>
       <small>${descricao}</small>`,
      { permanent: true, direction: "center", className: "zona-tooltip" }
    );

    layer.on({

      click: () => {
        //console.log("CLICOU NA ZONA 🔥");
        
        setModoDialog("editar");
        // Passamos o acsId buscado pela API para o Dialog
        setZonaSelecionada({ 
          id, 
          nome, 
          descricao, 
          acsId, 
          geometria: feature.geometry 
        });
        setDialogOpen(true);
      },
    });

    // Integração com Geoman para salvar edição de arrastar/cortar
    (layer as any).on("pm:edit", (e: any) => {
      if (id) {
        const geojson = e.target.toGeoJSON();
        editarZonaGeometria(id, geojson);
      }
    });

    (layer as any).on("pm:remove", async () => {
      if (!id) return;
      if (!window.confirm(`Excluir a zona "${nome}"?`)) return;
      await api.delete(`/zonas/${id}`);
      queryClient.invalidateQueries({ queryKey: ["zonas"] });
    });
  }, [editarZonaGeometria, queryClient]);

  // 🔹 Salvar geometria
  const salvarAlteracoesGeometria = async () => {

    for (const zona of zonasEditadas) {
      await api.put(`/zonas/${zona.id}/geometria`, {
        geometria: zona.geometria,
      });
    }
    setZonasEditadas([]);
    queryClient.invalidateQueries({ queryKey: ["zonas"] });
  };

  // 🔹 Salvar formulário
  const salvarDadosForm = async (data: any) => {
    try {
      //console.log("Dados Recebidos", data);

      if (modoDialog === "criar") {
        if (!geometriaNovaZona) {
          throw new Error("Geometria não definida para nova zona");
        }

        try{
          console.log("Criando zona com dados:", {
            ...data,
            geometria: geometriaNovaZona,
          });

          const res = await api.post("/zonas", {
            nome: data.nome,
            descricao: data.descricao,
            geometria: geometriaNovaZona,
          });

          // criar vínculo
          await api.post("/usuarios-zonas", {
            usuarioId: data.acsId
            ,
            zonaId: res.data.id,
          });
        } catch (error: any) {
          console.error(error.response?.data || error);
        }

      } else {
        const editada = zonasEditadas.find(
          (z) => z.id === zonaSelecionada.id
        );

        //console.log('zonasEditadas:', zonasEditadas)

        //console.log("Zona Editada", editada);

        const geometriaFinal =
          editada?.geometria ?? zonaSelecionada.geometria;

        if (!geometriaFinal) {
          throw new Error("Zona sem geometria válida");
        }

        await api.put(`/zonas/${zonaSelecionada.id}`, {
          ...data,
          geometria: geometriaFinal,
        });

        // remove vínculo antigo
        await api.delete(`/usuarios-zonas/zona/${zonaSelecionada.id}`);


        // atualizar vínculo
        await api.post(`/usuarios-zonas`, {
          usuarioId: data.acsId,
          zonaId: zonaSelecionada.id
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["zonas"] });

      setDialogOpen(false);
      setZonasEditadas([]);

    } catch (error) {
      console.error("Erro ao salvar zona:", error);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Erro ao carregar</div>;

  return (
    <div className="md:p-4">
      {/** Botão Salvar */}
      {zonasEditadas.length > 0 && (
        <button 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 md:top-20 md:bottom-auto z-[1000]"
          onClick={salvarAlteracoesGeometria}
        >
          💾 Salvar Alterações ({zonasEditadas.length})
        </button>
      )}

      {/* MAPA */}
      <div className="fixed inset-x-0 bottom-0 top-16 md:relative md:h-[calc(100vh-80px)]">
        <MapContainer center={[-0.9853, -49.939]} zoom={16} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <GeomanControls onCreate={criarZona} />

          {/* ZONAS CORRIGIDO */}
          {zonas?.map((zona: Zona) => (
            <ZonaLayer
              key={zona.id}
              zona={zona}
              onEachZona={onEachZona}
              cores={cores}
            />
          ))}

          {/* FAMÍLIAS */}
          {familia?.map((fam: any) => {
            if (!fam.latitude || !fam.longitude) return null;

            const total = fam.pessoas?.length || 0;
            return (
              <Marker
                key={fam.id}
                position={[Number(fam.latitude), Number(fam.longitude)]}
                icon={createFamilyIcon(total)}
              >
                <Popup maxWidth={250}>
                  <div>
                    <strong>Família {fam.id}</strong> <br />
                    Pessoas: {total} <br />

                    <hr />

                    {fam.pessoas && fam.pessoas.length > 0 ? (
                      fam.pessoas.map((p: any, index: number) => (
                        <div key={p.id || index}>
                          {index + 1}º: {p.nome || "Sem nome"} - 
                            <Link to={`/pessoa/${p.id}`} target="_blank" className="text-blue-500 underline">
                              Detalhes
                            </Link>
                        </div>
                      ))
                    ) : (
                      <div>Sem pessoas cadastradas</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* MODAL CORRIGIDO */}
      <DialogEditarZona
        open={dialogOpen}
        zona={zonaSelecionada} // Aqui já deve conter o acsId vindo do onEachZona
        modo={modoDialog}
        onClose={() => setDialogOpen(false)}
        onSave={salvarDadosForm}
        acsList={usuarios || []}
      />
    </div>






  );
};

export default MapaZonas;