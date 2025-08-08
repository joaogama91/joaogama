import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase";

export default function Contacts() {
  const { i18n } = useTranslation();
  const [contact, setContact] = useState(null);
  const lang = i18n.language;

  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await supabase
        .from("contact_content")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      setContact(data);
    };

    fetchContact();
  }, []);

  if (!contact) return null;

  return (
    <div
      className="px-4 md:px-0 py-8 max-w-4xl mx-auto"
      style={{
        color: "var(--color-texto)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h2
        className="text-xl md:text-2xl mb-6 text-center"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {lang === "pt" ? "Contactos" : "Contacts"}
      </h2>

      <div className="space-y-4 text-left">
        {contact.mostrar_email && (
          <p>
            <strong>Email:</strong> {contact.email}
          </p>
        )}
        {contact.mostrar_telefone && (
          <p>
            <strong>{lang === "pt" ? "Telefone" : "Phone"}:</strong>{" "}
            {contact.telefone}
          </p>
        )}
        {contact.mostrar_localizacao && (
          <p>
            <strong>{lang === "pt" ? "Localização" : "Location"}:</strong>{" "}
            {contact.localizacao}
          </p>
        )}
        {contact.mostrar_instagram && (
          <p>
            <strong>Instagram:</strong>{" "}
            <a
              href={`https://instagram.com/${contact.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-gray-600"
            >
              @{contact.instagram}
            </a>
          </p>
        )}
        {contact.mostrar_facebook && (
          <p>
            <strong>Facebook:</strong>{" "}
            <a
              href={`https://facebook.com/${contact.facebook}`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-gray-600"
            >
              {contact.facebook}
            </a>
          </p>
        )}
        {contact.mostrar_outras_redes && (
          <p>
            <strong>{lang === "pt" ? "Outras redes" : "Other networks"}:</strong>{" "}
            {contact.outras_redes}
          </p>
        )}
      </div>

      {contact.mostrar_formulario && (
        <form
          action={`https://formsubmit.co/${contact.email}`}
          method="POST"
          className="mt-10 space-y-4"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input
            type="hidden"
            name="_subject"
            value="Nova mensagem do site João Gama"
          />

          <div>
            <label className="block font-semibold mb-1">
              {lang === "pt" ? "Nome" : "Name"}
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              {lang === "pt" ? "Mensagem" : "Message"}
            </label>
            <textarea
              name="message"
              rows="4"
              required
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-6 py-2 rounded border transition duration-300 shadow-sm hover:shadow-md"
            style={{
              backgroundColor: "var(--color-admin)",
              color: "var(--color-texto)",
              borderColor: "var(--color-texto)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {lang === "pt" ? "Enviar mensagem" : "Send message"}
          </button>
        </form>
      )}

      {contact.mostrar_mapa && contact.google_maps_link && (
        <div className="mt-10 space-y-2 text-left">
          {contact.mostrar_localizacao && contact.localizacao && (
            <p>
              <strong>{lang === "pt" ? "Localização" : "Location"}:</strong>{" "}
              {contact.localizacao}
            </p>
          )}
          <iframe
            title="Google Maps"
            src={contact.google_maps_link}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded"
          ></iframe>
        </div>
      )}
    </div>
  );
}
