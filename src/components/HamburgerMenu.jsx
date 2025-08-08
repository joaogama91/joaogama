import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const links = [
  { key: "menu.Início", path: "/" },
  { key: "menu.Projetos", path: "/projetos" },
  { key: "menu.Galerias", path: "/galerias" },
  { key: "menu.Murais", path: "/murais" }, // ← NOVO
  { key: "menu.Sobre", path: "/Sobre" },
  { key: "menu.Contactos", path: "/Contactos" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      {/* Hamburger icon */}
      <div className="font-sans md:hidden relative z-50">
        <button
          onClick={() => setOpen(!open)}
          className="font-sans p-4 focus:outline-none"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <div className="font-sans relative w-6 h-6">
            <span
              className={`absolute left-0 right-0 h-[2px] bg-texto transition-all duration-300 ${
                open ? "rotate-45 top-1/2 translate-y-[-1px]" : "top-[6px]"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[2px] bg-texto transition-all duration-300 ${
                open ? "opacity-0" : "top-[12px]"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[2px] bg-texto transition-all duration-300 ${
                open ? "-rotate-45 top-1/2 translate-y-[-1px]" : "top-[18px]"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Slide-out menu with admin background */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-admin z-40 transform transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="font-sans flex flex-col items-center justify-center h-full space-y-6 text-base text-texto">
          {links.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={i}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`transition-colors ${
                  isActive ? "font-bold underline" : "hover:underline"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
