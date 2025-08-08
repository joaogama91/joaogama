import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

export default function AdminAboutEditor() {
  const [form, setForm] = useState({
    id: null,
    about_pt: "",
    about_en: "",
    about_long_pt: "",
    about_long_en: "",
    extra_pt: "",
    extra_en: "",
    image_url: "",
    image_desc_pt: "",
    image_desc_en: "",
  });

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data } = await supabase
        .from("about_content")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setForm(data);
        setPreview(data.image_url);
      }
    };

    fetchAbout();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = form.image_url;

    if (file) {
      const fileName = `about-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        alert("Erro ao fazer upload da imagem: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // Garante que o ID está presente na primeira inserção
    const upsertData = {
      ...form,
      id: form.id || uuidv4(),
      image_url: imageUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("about_content").upsert(upsertData);

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
      <h2 className="text-xl font-bold mb-4">Editar Página Sobre</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Sobre (PT)</label>
            <input type="text" name="about_pt" value={form.about_pt} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sobre (EN)</label>
            <input type="text" name="about_en" value={form.about_en} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Extra (PT)</label>
            <input type="text" name="extra_pt" value={form.extra_pt} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Extra (EN)</label>
            <input type="text" name="extra_en" value={form.extra_en} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Sobre Longo (PT)</label>
            <textarea name="about_long_pt" value={form.about_long_pt} onChange={handleChange} className="w-full border p-2 rounded" rows={4} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sobre Longo (EN)</label>
            <textarea name="about_long_en" value={form.about_long_en} onChange={handleChange} className="w-full border p-2 rounded" rows={4} />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Imagem</label>
          <label className="inline-block bg-texto text-admin px-4 py-2 rounded cursor-pointer hover:bg-gray-800">
            Escolher ficheiro
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {preview && (
            <img src={preview} alt="Pré-visualização" className="mt-2 w-full max-h-64 object-cover rounded" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Descrição da imagem (PT)</label>
            <input type="text" name="image_desc_pt" value={form.image_desc_pt} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Descrição da imagem (EN)</label>
            <input type="text" name="image_desc_en" value={form.image_desc_en} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">
          {loading ? "A guardar..." : "Guardar alterações"}
        </button>
      </form>
    </div>
  );
}
