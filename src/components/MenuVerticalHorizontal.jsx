import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProjetosMenuDropdown from "../components/ProjetosMenuDropdown";
import GaleriesMenuDropdown from "../components/GaleriesMenuDropdown";
import MuralsMenuDropdown from "../components/MuralsMenuDropdown";

const menuLinks = [
  { key: "menu.Início", path: "/" },
  { key: "menu.Projetos", path: "/projetos", isProjetosDropdown: true },
  { key: "menu.Galerias", path: "/galerias", isGaleriasDropdown: true },
  { key: "menu.Murais", path: "/murais", isMuralsDropdown: true },
  { key: "menu.Sobre", path: "/Sobre" },
  { key: "menu.Contactos", path: "/Contactos" },
];

export default function MenuVerticalHorizontal({ layout }) {
  const { t } = useTranslation();
  const location = useLocation();

  if (layout === "horizontal") {
    return (
      <nav className="w-full flex justify-center items-center">
        <ul
          className="flex space-x-10 text-base"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-texto)" }}
        >
          {menuLinks.map((link, i) => {
            if (link.isProjetosDropdown) return <ProjetosMenuDropdown key="projetos" />;
            if (link.isGaleriasDropdown) return <GaleriesMenuDropdown key="galerias" />;
            if (link.isMuralsDropdown) return <MuralsMenuDropdown key="murais" />;

            const isActive = location.pathname === link.path;
            return (
              <li key={i}>
                <Link
                  to={link.path}
                  className={`transition-colors duration-300 hover:text-gray-600 ${
                    isActive ? "font-bold" : ""
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  // vertical layout with fixed sidebar
  return (
    <div className="hidden md:block">
      <nav
        className="fixed top-0 left-0 h-full pt-[6.5rem] w-44 px-4 space-y-2 text-base text-left bg-admin z-20"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-texto)" }}
      >
        {menuLinks.map((link, i) => {
          if (link.isProjetosDropdown)
            return (
              <div key="projetos" className="block w-full mb-1">
                <ProjetosMenuDropdown />
              </div>
            );
          if (link.isGaleriasDropdown)
            return (
              <div key="galerias" className="block w-full mb-1">
                <GaleriesMenuDropdown />
              </div>
            );
          if (link.isMuralsDropdown)
            return (
              <div key="murais" className="block w-full mb-1">
                <MuralsMenuDropdown />
              </div>
            );

          const isActive = location.pathname === link.path;
          return (
            <Link
              key={i}
              to={link.path}
              className={`block truncate transition-colors duration-300 hover:text-gray-600 ${
                isActive ? "font-bold" : ""
              }`}
            >
              {t(link.key)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
