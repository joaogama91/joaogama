import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase";
import LightboxGallery from "../components/LightboxGallery";

export default function About() {
  const { i18n } = useTranslation();
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data } = await supabase
        .from("about_content")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      setAbout(data);
    };

    fetchAbout();
  }, []);

  if (!about) return null;

  const lang = i18n.language;

  return (
    <main
      className="px-4 md:px-0 py-8 max-w-4xl mx-auto text-center"
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--color-texto)",
      }}
    >
      <h2
        className="text-xl md:text-2xl mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {about[`about_${lang}`]}
      </h2>

      <p className="italic mb-4">{about[`extra_${lang}`]}</p>

      <LightboxGallery
        mode="single"
        images={[
          {
            url: about.image_url,
            caption: about[`image_desc_${lang}`],
            alt: about[`image_desc_${lang}`] || "Imagem",
          },
        ]}
      />

      <p className="mt-6 mb-4 whitespace-pre-line text-sm leading-relaxed">
        {about[`about_long_${lang}`]}
      </p>
    </main>
  );
}
