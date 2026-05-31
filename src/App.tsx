import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import "leaflet/dist/leaflet.css";

import Navbar from "./components/Navbar";
import Cadastrar from "./components/ModalNovaPessoa";
import PessoasList from "./pages/PessoaList";
import VacinaList from "./pages/VacinaList";
import GestantesList from "./pages/GestantesList";
import AcsList from "./pages/AcsList";
import ZonaPage from "./pages/ZonaPage";
import PessoaDetalhe from "./pages/PessoaDetalhe";
import PrivateRoute from "./pages/PrivateRoute";
import Login from "./pages/Login";
import Familias from "./pages/Familias";
import BotaoVoltar from "./pages/botaoVoltar";
import { useAuth } from "./context/AuthContext";
import Atendimento from "./pages/Atendimentos";
import Visitas from "./pages/Visitas";
import Consultar from "./pages/Consultar";
import NovoUsuario from "./pages/NovoUsuario";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import EditarUsuarios from "./pages/EditarUsuarios";
import Comorbidades from "./pages/Comorbidades";


function App() {
  const { token } = useAuth();

  const ProtectedLayout = () => (
    <PrivateRoute>
      <>
        {/* 🔥 Navbar FULL WIDTH */}
        {token && <Navbar />}

        {/* 🔽 Fundo da tela */}
        <div className="w-full min-h-screen bg-gray-900 flex justify-center">
          
          {/* 🔽 Container central */}
          <div
            className="
              w-full 
              sm:max-w-6xl 
              bg-white 
              sm:rounded-lg 
              sm:shadow-lg 
              p-3 sm:p-6
            "
          >
            {token && <BotaoVoltar />}
            <Outlet />
          </div>
        </div>
      </>
    </PrivateRoute>
  );
  //console.log("TOKEN:", localStorage.getItem("token"));


  return (
    <Routes>
      {/* 🔓 Pública */}
      <Route path="/login" element={<Login />} />

      {/* 🔒 Protegidas */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/pessoas" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/familias" element={<Familias />} />
        <Route path="/pessoas" element={<PessoasList />} />
        <Route path="/consultar" element={<Consultar />} />
        <Route path="/pessoa/:id" element={<PessoaDetalhe />} />
        <Route path="/pessoas/nova" element={<Cadastrar />} />
        <Route path="/vacinas" element={<VacinaList />} />
        <Route path="/comorbidades" element={<Comorbidades />} />
        <Route path="/gestantes" element={<GestantesList />} />
        <Route path="/acs" element={<AcsList />} />
        <Route path="/usuarios/novo" element={<NovoUsuario />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/:id" element={<EditarUsuarios />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/atendimentos" element={<Atendimento />} />
        <Route path="/visitas" element={<Visitas />} />
        <Route path="/zonas" element={<ZonaPage />} />
      </Route>

      {/* 🔥 fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


export default App;

