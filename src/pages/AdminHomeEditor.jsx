import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from 'uuid';

export default function AdminHomeEditor() {
  const [form, setForm] = useState({
    id: null,
    titulo_pt: "",
    titulo_en: "",
    datas_pt: "",
    datas_en: "",
    descricao_pt: "",
    descricao_en: "",
    extra_pt: "",
    extra_en: "",
    image_url: "",
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState([]);

  const fetchEventos = async () => {
    const { data, error } = await supabase
      .from("home_content")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error) setEventos(data);
  };

  useEffect(() => {
    fetchEventos();
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
      const fileName = `home-${Date.now()}-${file.name}`;
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

    const isEditing = !!form.id;
    const dataToSend = {
      ...form,
      image_url: imageUrl,
      updated_at: new Date(),
    };
    if (!isEditing) dataToSend.id = uuidv4();

    const { error } = await supabase.from("home_content").upsert(dataToSend);

    setLoading(false);

    if (error) {
      alert("Erro ao guardar.");
      console.error(error);
    } else {
      alert("Conteúdo guardado com sucesso!");
      setForm({
        id: null,
        titulo_pt: "",
        titulo_en: "",
        datas_pt: "",
        datas_en: "",
        descricao_pt: "",
        descricao_en: "",
        extra_pt: "",
        extra_en: "",
        image_url: "",
      });
      setPreview(null);
      setFile(null);
      fetchEventos();
    }
  };

  const handleEdit = (evento) => {
    setForm(evento);
    setPreview(evento.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Tens a certeza que queres apagar este evento?")) return;
    const { error } = await supabase.from("home_content").delete().eq("id", id);
    if (error) {
      alert("Erro ao apagar o evento.");
      console.error(error);
    } else {
      fetchEventos();
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans text-texto bg-admin p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{form.id ? "Editar Evento" : "Adicionar Evento à Página Inicial"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Título (PT)</label>
            <input type="text" name="titulo_pt" value={form.titulo_pt} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Título (EN)</label>
            <input type="text" name="titulo_en" value={form.titulo_en} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Datas (PT)</label>
            <input type="text" name="datas_pt" value={form.datas_pt} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Datas (EN)</label>
            <input type="text" name="datas_en" value={form.datas_en} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Descrição (PT)</label>
            <textarea name="descricao_pt" value={form.descricao_pt} onChange={handleChange} className="w-full border p-2 rounded" rows={4} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Descrição (EN)</label>
            <textarea name="descricao_en" value={form.descricao_en} onChange={handleChange} className="w-full border p-2 rounded" rows={4} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Extra (PT)</label>
            <input type="text" name="extra_pt" value={form.extra_pt} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Extra (EN)</label>
            <input type="text" name="extra_en" value={form.extra_en} onChange={handleChange} className="w-full border p-2 rounded" />
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

        <button type="submit" disabled={loading} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">
          {loading ? "A guardar..." : form.id ? "Atualizar" : "Guardar alterações"}
        </button>
      </form>

      <hr className="my-8" />

      <h2 className="text-lg font-bold mb-4">Eventos Existentes</h2>
      <ul className="space-y-6">
        {eventos.map((ev) => (
          <li key={ev.id} className="bg-white text-black rounded p-4 shadow">
            <p className="font-serif text-lg font-bold">{ev.titulo_pt}</p>
            <p className="text-sm italic mb-2">{ev.datas_pt}</p>
            {ev.image_url && (
              <img src={ev.image_url} alt="Evento" className="mb-4 w-full max-h-64 object-cover rounded" />
            )}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => handleEdit(ev)}
                className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(ev.id)}
                className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800"
              >
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
