import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  initialLat?: number | null;
  initialLng?: number | null;
  onSelect: (lat: number, lng: number) => void;
  onAddressSelect: (endereco: any) => void;
  onClose: () => void;
}

export default function ModalMapa({
  initialLat,
  initialLng,
  onSelect,
  onAddressSelect,
  onClose,
}: Props) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat != null && initialLng != null ? [initialLat, initialLng] : null
  );

  const [loadingLocation, setLoadingLocation] = useState(false);
  const debounceRef = useRef<any>(null);

  // 🔥 Reverse geocode com debounce
  const handleReverse = (lat: number, lng: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
          {
            headers: {
              "User-Agent": "AppSaude/1.0",
            },
          }
        );

        const data = await res.json();

        if (data?.address) {
          const addr = data.address;

          onAddressSelect({
            endereco: addr.road || addr.pedestrian || addr.footway || "",
            bairro: addr.suburb || addr.neighbourhood || "",
            cidade: addr.city || addr.town || addr.village || "",
            estado: addr.state || "",
            numero: addr.house_number || "",
          });
        }
      } catch (err) {
        console.error("Erro ao buscar endereço:", err);
      }
    }, 500);
  };

  // 📡 GPS automático otimizado
  useEffect(() => {
    if (position) return;

    if (!navigator.geolocation) {
      alert("Seu dispositivo não suporta geolocalização");
      return;
    }

    setLoadingLocation(true);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setLoadingLocation(false);

        handleReverse(lat, lng);

        navigator.geolocation.clearWatch(watchId);
      },
      (err) => {
        setLoadingLocation(false);

        if (err.code === 1) {
          alert("Permissão de localização negada");
        } else {
          alert("Erro ao obter localização");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 🎯 Centraliza mapa suavemente
  function RecenterMap({ position }: any) {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, 18, { duration: 1.5 });
      }
    }, [position]);

    return null;
  }

  // 👆 Clique no mapa
  function ClickHandler() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setPosition([lat, lng]);
        handleReverse(lat, lng);
      },
    });

    return null;
  }

  // 📡 botão manual de localização
  const getCurrentLocation = () => {
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setLoadingLocation(false);
        handleReverse(lat, lng);
      },
      () => {
        setLoadingLocation(false);
        alert("Erro ao obter localização");
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 w-full max-w-3xl">

        <h2 className="text-xl font-bold mb-3">
          Selecionar localização no mapa
        </h2>

        {loadingLocation && (
          <p className="text-sm text-gray-500 mb-2">
            📡 Obtendo localização...
          </p>
        )}

        {position && (
          <p className="text-sm text-green-600 mb-2">
            📍 {Number(position[0]).toFixed(5)}, {Number(position[1]).toFixed(5)}
          </p>
        )}

        <MapContainer
          center={position || [-0.9853, -49.939]}
          zoom={16}
          className="h-[400px] w-full rounded-lg cursor-crosshair"
        >
          <RecenterMap position={position} />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler />

          {position && (
            <Marker
              position={position}
              icon={icon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const latlng = marker.getLatLng();

                  setPosition([latlng.lat, latlng.lng]);
                  handleReverse(latlng.lat, latlng.lng);
                },
              }}
            />
          )}
        </MapContainer>

        <div className="flex justify-between mt-4">
          <button
            onClick={getCurrentLocation}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            📡 Minha localização
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancelar
            </button>

            <button
              disabled={!position}
              onClick={() => {
                if (position) {
                  onSelect(Number(position[0]), Number(position[1]));
                  onClose();
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Confirmar localização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}