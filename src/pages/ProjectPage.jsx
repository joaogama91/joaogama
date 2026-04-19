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

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url);

      if (
        parsedUrl.hostname.includes("youtube.com") &&
        parsedUrl.searchParams.get("v")
      ) {
        return `https://www.youtube.com/embed/${parsedUrl.searchParams.get("v")}`;
      }

      if (parsedUrl.hostname.includes("youtu.be")) {
        const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsedUrl.pathname.includes("/embed/")) {
        return url;
      }

      return "";
    } catch {
      return "";
    }
  };

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
          TESTE PROJECT PAGE
        </h1>

        <p className="mt-6 mb-6 text-sm leading-relaxed whitespace-pre-line">
          {project[`description_${lang}`]}
        </p>

        {getYoutubeEmbedUrl(project.video_url) && (
          <div className="mb-8 w-full overflow-hidden rounded-2xl shadow-lg aspect-video">
            <iframe
              className="w-full h-full"
              src={getYoutubeEmbedUrl(project.video_url)}
              title={project[`title_${lang}`] || "Vídeo"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        <LightboxGallery
          mode="multiple"
          images={galleryImages}
          showCaptions={theme?.show_captions}
        />
      </div>
    </>
  );
}
