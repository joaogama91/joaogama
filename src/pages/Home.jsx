import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase";
import LightboxGallery from "../components/LightboxGallery";

export default function Home() {
  const { i18n } = useTranslation();
  const [eventos, setEventos] = useState([]);
  const lang = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar eventos:", error.message);
        return;
      }

      setEventos(data || []);
    };

    fetchData();
  }, []);

  const allImages = eventos.map((evento) => ({
    url: evento.image_url,
    caption: evento[`extra_${lang}`],
    alt: evento[`extra_${lang}`] || "Imagem",
  }));

  return (
    <div
      className="text-center px-4 md:px-0 pb-10"
      style={{ fontFamily: "var(--font-sans)", color: "var(--color-texto)" }}
    >
      {eventos.map((evento, index) => (
        <div key={evento.id} className="mb-10">
          <LightboxGallery
            mode="single"
            images={[
              {
                url: evento.image_url,
                caption: evento[`extra_${lang}`],
                alt: evento[`extra_${lang}`] || "Imagem",
              },
            ]}
            fullList={allImages}
            fullIndex={index}
          />

          <h1
            className="mt-4 text-lg md:text-xl mb-4 tracking-widest"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {evento[`titulo_${lang}`]}
          </h1>
          <a href="#" className="text-sm underline block mb-4">
            {evento[`datas_${lang}`]}
          </a>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {evento[`descricao_${lang}`]}
          </p>
        </div>
      ))}
    </div>
  );
}
