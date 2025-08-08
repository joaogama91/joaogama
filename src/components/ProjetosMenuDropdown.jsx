import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ProjetosMenuDropdown() {
  const [projetos, setProjetos] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    const fetchProjetos = async () => {
      const { data, error } = await supabase
        .from("projects_content")
        .select("id, slug, title_pt, title_en, updated_at")
        .order("updated_at", { ascending: false });

      if (!error) setProjetos(data);
    };

    fetchProjetos();
  }, []);

  const currentSlug = location.pathname.startsWith("/projetos/")
    ? location.pathname.split("/projetos/")[1]
    : "";

  const handleClick = (slug) => {
    navigate(`/projetos/${slug}`);
    setOpen(false);
  };

  const handleNavigateToProjetos = () => {
    navigate("/projetos");
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const projetosVisiveis = mostrarTodos ? projetos : projetos.slice(0, 5);

  return (
    <div ref={dropdownRef} className="relative z-30">
      <div className="flex items-center gap-1">
        <button
          onClick={handleNavigateToProjetos}
          className={`transition-colors duration-300 hover:text-gray-600 ${
            location.pathname.startsWith("/projetos") ? "font-bold" : ""
          }`}
        >
          {t("menu.Projetos")}
        </button>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={t("menu.Projetos")}
          className="text-gray-700 hover:text-gray-500"
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="left-0 mt-2 bg-fundo border border-gray-200 shadow-xl rounded-lg w-60 max-h-80 overflow-y-auto py-2"
          >
            {projetosVisiveis.length === 0 && (
              <li className="text-sm text-gray-500 px-4 py-2">
                {t("menu.NenhumProjeto")}
              </li>
            )}

            {projetosVisiveis.map((proj) => {
              const isActive = currentSlug === proj.slug;
              const title = proj[`title_${lang}`] || proj.title_pt || "(sem título)";
              return (
                <li key={proj.id}>
                  <button
                    onClick={() => handleClick(proj.slug)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      isActive ? "font-bold bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    {title.trim()}
                  </button>
                </li>
              );
            })}

            {projetos.length > 5 && (
              <li className="border-t border-gray-200 mt-2 pt-1 px-2">
                <button
                  onClick={() => setMostrarTodos(!mostrarTodos)}
                  className="text-xs text-gray-600 hover:underline"
                >
                  {mostrarTodos
                    ? t("menu.VerMenosProjetos")
                    : t("menu.VerTodosProjetos")}
                </button>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
