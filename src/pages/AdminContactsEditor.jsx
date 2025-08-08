import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

export default function AdminContactsEditor() {
  const [form, setForm] = useState({
    id: null,
    email: "",
    mostrar_email: true,
    telefone: "",
    mostrar_telefone: true,
    localizacao: "",
    mostrar_localizacao: true,
    instagram: "",
    mostrar_instagram: true,
    facebook: "",
    mostrar_facebook: true,
    outras_redes: "",
    mostrar_outras_redes: true,
    mostrar_formulario: true,
    mostrar_mapa: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await supabase
        .from("contact_content")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (data) setForm(data);
    };

    fetchContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const upsertData = {
      ...form,
      id: form.id || uuidv4(),
      updated_at: new Date(),
      google_maps_link: form.localizacao
        ? `https://maps.google.com/maps?q=${encodeURIComponent(form.localizacao)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
        : "",
    };

    const { error } = await supabase.from("contact_content").upsert(upsertData);
    setLoading(false);

    if (error) {
      alert("Erro ao guardar.");
      console.error(error);
    } else {
      alert("Conteúdo guardado com sucesso!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans text-texto bg-admin p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Contactos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
            <label className="block mt-2">
              <input type="checkbox" name="mostrar_email" checked={form.mostrar_email} onChange={handleChange} className="mr-2" />
              Mostrar
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1">Telefone</label>
            <input name="telefone" value={form.telefone} onChange={handleChange} className="w-full border p-2 rounded" />
            <label className="block mt-2">
              <input type="checkbox" name="mostrar_telefone" checked={form.mostrar_telefone} onChange={handleChange} className="mr-2" />
              Mostrar
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1">Localização (Cidade / País)</label>
            <input name="localizacao" value={form.localizacao} onChange={handleChange} className="w-full border p-2 rounded" />
            <label className="block mt-2">
              <input type="checkbox" name="mostrar_localizacao" checked={form.mostrar_localizacao} onChange={handleChange} className="mr-2" />
              Mostrar
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1">Instagram</label>
            <input name="instagram" value={form.instagram} onChange={handleChange} className="w-full border p-2 rounded" />
            <label className="block mt-2">
              <input type="checkbox" name="mostrar_instagram" checked={form.mostrar_instagram} onChange={handleChange} className="mr-2" />
              Mostrar
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1">Facebook</label>
            <input name="facebook" value={form.facebook} onChange={handleChange} className="w-full border p-2 rounded" />
            <label className="block mt-2">
              <input type="checkbox" name="mostrar_facebook" checked={form.mostrar_facebook} onChange={handleChange} className="mr-2" />
              Mostrar
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1">Outras redes</label>
            <input name="outras_redes" value={form.outras_redes} onChange={handleChange} className="w-full border p-2 rounded" />
            <label className="block mt-2">
              <input type="checkbox" name="mostrar_outras_redes" checked={form.mostrar_outras_redes} onChange={handleChange} className="mr-2" />
              Mostrar
            </label>
          </div>
        </div>

        <label className="block mt-4">
          <input type="checkbox" name="mostrar_formulario" checked={form.mostrar_formulario} onChange={handleChange} className="mr-2" />
          Mostrar formulário de contacto
        </label>

        <label className="block mt-2">
          <input type="checkbox" name="mostrar_mapa" checked={form.mostrar_mapa} onChange={handleChange} className="mr-2" />
          Mostrar mapa
        </label>

        <button type="submit" disabled={loading} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800 mt-4">
          {loading ? "A guardar..." : "Guardar alterações"}
        </button>
      </form>
    </div>
  );
}
