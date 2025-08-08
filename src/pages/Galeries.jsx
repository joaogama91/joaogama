import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Galeries() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [galerias, setGalerias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const galeriasPorPagina = 6;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("galleries_content")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!error) setGalerias(data || []);
    };

    fetchData();
  }, []);

  const totalPaginas = Math.ceil(galerias.length / galeriasPorPagina);
  const galeriasVisiveis = galerias.slice(
    (pagina - 1) * galeriasPorPagina,
    pagina * galeriasPorPagina
  );

  return (
    <div
      className="text-center px-4 md:px-0 pb-16 max-w-4xl mx-auto"
      style={{ fontFamily: "var(--font-sans)", color: "var(--color-texto)" }}
    >
      <div className="grid gap-16">
        {galeriasVisiveis.map((galeria) => (
          <Link
            to={`/galerias/${galeria.slug}`}
            key={galeria.id}
            className="group block text-center"
          >
            <h3
              className="mt-4 text-lg md:text-xl mb-4 tracking-widest"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {galeria[`title_${lang}`]}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {Array.from({ length: 6 }, (_, i) => {
                const url = galeria[`image${i + 1}_url`];
                if (!url) return null;

                let visibilityClass = "";
                if (i === 0) visibilityClass = "block";                      // always visible
                else if (i === 1) visibilityClass = "hidden sm:block";       // 2 on sm+
                else if (i < 4) visibilityClass = "hidden md:block";         // 4 on md+
                else visibilityClass = "hidden lg:block";                    // 6 on lg+

                return (
                  <img
                    key={i}
                    src={url}
                    alt={`image ${i + 1}`}
                    className={`w-full h-40 object-cover rounded transition-transform group-hover:scale-[1.01] ${visibilityClass}`}
                  />
                );
              })}
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-line">
              {galeria[`description_${lang}`]?.slice(0, 180)}...
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
