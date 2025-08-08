import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Projetos() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [projetos, setProjetos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const projetosPorPagina = 6;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("projects_content")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!error) setProjetos(data || []);
    };

    fetchData();
  }, []);

  const totalPaginas = Math.ceil(projetos.length / projetosPorPagina);
  const projetosVisiveis = projetos.slice(
    (pagina - 1) * projetosPorPagina,
    pagina * projetosPorPagina
  );

  return (
    <div
      className="text-center px-4 md:px-0 pb-16 max-w-4xl mx-auto"
      style={{ fontFamily: "var(--font-sans)", color: "var(--color-texto)" }}
    >
      <div className="grid gap-16">
        {projetosVisiveis.map((projeto) => (
          <Link
            to={`/projetos/${projeto.slug}`}
            key={projeto.id}
            className="group block text-center"
          >
            <h3
              className="mt-4 text-lg md:text-xl mb-4 tracking-widest"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {projeto[`title_${lang}`]}
            </h3>

            {projeto.image1_url && (
              <img
                src={projeto.image1_url}
                alt={projeto[`title_${lang}`]}
                className="rounded mb-4 w-full max-h-96 object-cover transition-transform group-hover:scale-[1.01]"
              />
            )}

            <p className="text-sm leading-relaxed whitespace-pre-line">
              {projeto[`description_${lang}`]?.slice(0, 180)}...
            </p>
          </Link>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="mt-16 flex justify-center gap-6 items-center text-sm">
          <button
            onClick={() => setPagina((p) => Math.max(p - 1, 1))}
            disabled={pagina === 1}
            className="px-4 py-1 rounded border disabled:opacity-40"
          >
            {lang === "pt" ? "Anterior" : "Previous"}
          </button>
          <span className="font-semibold">
            {lang === "pt" ? "Página" : "Page"} {pagina} / {totalPaginas}
          </span>
          <button
            onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
            className="px-4 py-1 rounded border disabled:opacity-40"
          >
            {lang === "pt" ? "Próxima" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
