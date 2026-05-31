import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Familia } from "../types/familia";
import type { Pessoa } from "../types/pessoa";
import { useFamilia } from "../hooks/useFamilia";



const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  //console.log("USUÁRIO NO NAVBAR:", usuario);
  const isAdmin =
    usuario?.perfil !== 'ACS'
    && !!usuario?.perfil;

  //console.log("IS ADMIN?", isAdmin);

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchDebounced(search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const searchRef = useRef<HTMLDivElement | null>(null);
  
  // click outside
  useEffect(() => {
    

    function handleClickOutside(e: any) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {data: familias} = useFamilia();



  function handleLogout() {
    localStorage.clear(); // limpa tudo
    window.location.href = "/login"; // força reload (zera estado)
  }

  const termo = searchDebounced?.toLowerCase() ?? "";

  const pessoasFiltradas = (familias ?? []).flatMap((f: Familia) =>
  (f.pessoas ?? [])
    .filter((p: Pessoa) => {
      if (!termo) return true;

      return (
        (p.nome ?? "").toLowerCase().includes(termo) ||
        (p.cpf ?? "").includes(termo) ||
        (p.sus ?? "").includes(termo) ||
        String(f.id ?? "").includes(termo) ||
        (f.endereco ?? "").toLowerCase().includes(termo) ||
        (f.bairro ?? "").toLowerCase().includes(termo)
      );
    })
    .map((p: Pessoa) => ({
      ...p,
      familiaId: f.id,
    }))
);

  return (

        <nav className="w-full flex items-center bg-green-800 text-white shadow-lg">
          
          <div className="max-w-7xl mx-auto px-4 w-full">
            
            <div className="flex justify-between h-16 items-center">

              {/* MENU DESKTOP */}
              <div className="hidden md:flex space-x-8">
                <Link to="/visitas" className="hover:text-blue-400 transition">
                  Visitas
                </Link>
                
                <Link to="/familias" className="hover:text-blue-400 transition">
                  Famílias
                </Link>



                <Link to="/pessoas" className="hover:text-blue-400 transition">
                  Pessoas
                </Link>

                <Link to="/vacinas" className="hover:text-blue-400 transition">
                  Vacina
                </Link>
                
                <Link to="/comorbidades" className="hover:text-blue-400 transition">
                  Comorbidades
                </Link>

                <Link to="/zonas" className="hover:text-blue-400 transition">
                  Regiões
                </Link>
                {isAdmin && (
                  <>
                  <Link to="/atendimentos" className="hover:text-blue-400 transition">
                    Agendas
                  </Link>

                  <Link to="/consultar" className="hover:text-blue-400 transition">
                    Consultar
                  </Link>

                  <Link 
                    to="/usuarios"
                    className="hover:text-blue-400 transition"
                  >
                  Usuários
                  </Link>
                  </>
                )}

                <div ref={searchRef} className="relative w-72">
                  <input
                    type="text"
                    placeholder="Buscar pessoa, CPF, SUS..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-200 p-2 pl-8 rounded-lg text-black"
                  />


                  <span className="absolute left-2 top-2 text-gray-500">
                    🔍
                  </span>
                  {searchDebounced.length > 0 && (
                    <div className="absolute top-14 w-72 bg-white text-black rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">

                      {pessoasFiltradas?.length === 0 && (
                        <p className="p-3 text-sm text-gray-500">
                          Nenhum resultado
                        </p>
                      )}

                      {pessoasFiltradas?.slice(0, 10).map((p: Pessoa) => (
                        <Link
                          key={p.id}
                          to={`/pessoa/${p.id}`}
                          onClick={() => setSearch("")}
                          className="block p-3 hover:bg-gray-100 border-b transition"
                        >
                          <p className="font-semibold">{p.nome}</p>

                          <p className="text-xs text-gray-500">
                            {p.cpf || p.sus} • {familias.find((f:any) => f.id === p.familiaId)?.descricao}
                          </p>

                          <p className="text-xs text-gray-400">
                            {familias.find((f:any) => f.id === p.familiaId)?.endereco},  
                            {familias.find((f:any) => f.id === p.familiaId)?.numero} -  
                            {familias.find((f:any) => f.id === p.familiaId)?.bairro}
                          </p>
                        </Link>
                      ))}

                    </div>
                  )}
                  
                </div>

                <Link 
                  to="/login"
                  onClick={handleLogout}
                  className="hover:text-blue-400 transition"
                >
                  Sair
                </Link>

                <Link 
                  to="/perfil"
                  className="hover:text-blue-400 transition"
                 >
                 Perfil
                </Link>


              </div>

              {/* BOTÃO MOBILE */}
              <button
                className="md:hidden text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>
                    
              {/* BARRA PESQUISA MOBILE */}
              <div className="w-full flex h-screen items-center justify-center md:hidden mt-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-3/4 bg-gray-200 p-2 rounded text-black"
                />
                {searchDebounced.length > 0 && (
                  <div className="absolute top-14 w-72 bg-white text-black rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">

                    {pessoasFiltradas?.length === 0 && (
                      <p className="p-3 text-sm text-gray-500">
                        Nenhum resultado
                      </p>
                    )}

                    {pessoasFiltradas?.slice(0, 10).map((p: Pessoa) => (
                      <Link
                        key={p.id}
                        to={`/pessoa/${p.id}`}
                        onClick={() => setSearch("")}
                        className="block p-3 hover:bg-gray-100 border-b transition"
                      >
                        <p className="font-semibold">{p.nome}</p>

                        <p className="text-xs text-gray-500">
                          {p.cpf || p.sus} • {familias.find((f:any) => f.id === p.familiaId)?.descricao}
                        </p>

                        <p className="text-xs text-gray-400">
                          {familias.find((f:any) => f.id === p.familiaId)?.endereco},  
                          {familias.find((f:any) => f.id === p.familiaId)?.numero} -  
                          {familias.find((f:any) => f.id === p.familiaId)?.bairro}
                        </p>
                      </Link>
                    ))}

                  </div>
                )}

              </div>

            </div>

            {/* MENU MOBILE */}
            {menuOpen && (
              <div
                className="fixed inset-0 bg-black/40 z-[1500] md:hidden"
                onClick={() => setMenuOpen(false)}
              >
                <div
                  className="absolute top-0 left-0 w-64 h-full bg-green-800 text-white p-4 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col space-y-4 mt-6">

                    <Link to="/visitas" onClick={() => setMenuOpen(false)}>
                      Visitas
                    </Link>

                    <Link to="/familias" onClick={() => setMenuOpen(false)}>
                      Famílias
                    </Link>



                    <Link to="/pessoas" onClick={() => setMenuOpen(false)}>
                      Pessoas
                    </Link>

                    <Link to="/vacinas" onClick={() => setMenuOpen(false)}>
                      Vacina
                    </Link>

                    <Link to="/comorbidades" onClick={() => setMenuOpen(false)}>
                      Comorbidades
                    </Link>

                    <Link to="/zonas" onClick={() => setMenuOpen(false)}>
                      Regiões
                    </Link>
                    {isAdmin && (
                      <>
                      <Link to="/consultar" onClick={() => setMenuOpen(false)}>
                        Consultar
                      </Link>

                      <Link to="/atendimentos" onClick={() => setMenuOpen(false)}>
                        Agendas
                      </Link>                    

                      <Link to="/usuarios" onClick={() => setMenuOpen(false)}>
                        Usuários
                      </Link>                     
                      </>
                    )}


                    <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                      Perfil
                    </Link>

                    <Link
                      to="/login"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="text-red-300"
                    >
                      Sair
                    </Link>

                  </div>
                </div>
              </div>

            )}

          </div>
            
        </nav>
  );
};

export default Navbar;