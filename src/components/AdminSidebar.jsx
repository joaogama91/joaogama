import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminSidebar({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/admin", label: "Início / Home" },
    { path: "/admin/sobre", label: "Sobre / About" },
    { path: "/admin/contactos", label: "Contactos / Contacts" },
    { path: "/admin/projetos", label: "Projetos / Projects" },
    { path: "/admin/galerias", label: "Galerias / Galleries" },
    { path: "/admin/murais", label: "Murais / Murals" }, // ← NOVO LINK ADICIONADO
    { path: "/admin/tema", label: "Tema / Theme" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE: full screen overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-fundo z-50 transform transition-transform duration-500 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="font-sans flex flex-col items-center justify-center h-full space-y-6 text-base text-texto">
          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="text-base text-texto hover:underline"
          >
            Sair
          </button>
          {links.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`block truncate transition-colors duration-300 hover:text-gray-600 ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* DESKTOP: fixed sidebar */}
      <aside className="hidden md:block bg-fundo text-texto w-60 border-r h-screen">
        <nav className="font-sans flex flex-col items-start px-6 pt-16 space-y-2 text-base">
          <button
            onClick={handleLogout}
            className="text-base text-texto hover:underline pt-4"
          >
            Sair
          </button>
          {links.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`block truncate transition-colors duration-300 hover:text-gray-600 ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
