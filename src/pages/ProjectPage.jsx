import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import LightboxGallery from "../components/LightboxGallery";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

export default function ProjectPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [project, setProject] = useState(null);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects_content")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error) setProject(data);
    };

    const fetchTheme = async () => {
      const { data, error } = await supabase
        .from("theme_config")
        .select("show_captions")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (!error) setTheme(data);
    };

    fetchProject();
    fetchTheme();
  }, [slug]);

  if (!project) return <div className="text-center mt-10">Carregando...</div>;

  const galleryImages = Array.from({ length: 15 }, (_, i) => {
    const url = project[`image${i + 1}_url`];
    const caption = project[`image${i + 1}_caption_${lang}`];
    return url ? { url, caption, alt: caption || `Imagem ${i + 1}` } : null;
  }).filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{project[`title_${lang}`]} | João Gama</title>
        <meta name="description" content={project[`description_${lang}`]?.slice(0, 150)} />
      </Helmet>

      <div
        className="px-4 md:px-0 py-8 max-w-4xl mx-auto text-center"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-texto)" }}
      >
        <Link to="/projetos" className="text-sm underline mb-6 inline-block">
          {lang === "pt" ? "← Voltar aos projetos" : "← Back to projects"}
        </Link>

        <h1
          className="mt-4 text-lg md:text-xl mb-6 tracking-widest"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {project[`title_${lang}`]}
        </h1>

        <p className="mt-6 mb-6 text-sm leading-relaxed whitespace-pre-line">
          {project[`description_${lang}`]}
        </p>

        <LightboxGallery
          mode="multiple"
          images={galleryImages}
          showCaptions={theme?.show_captions}
        />
      </div>
    </>
  );
}
