import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

export default function AdminGalleriesEditor() {
  const [form, setForm] = useState({
    id: null,
    title_pt: "",
    title_en: "",
    description_pt: "",
    description_en: "",
    slug: ""
  });
  const [imagens, setImagens] = useState([]);
  const [imagemAviso, setImagemAviso] = useState("");
  const [loading, setLoading] = useState(false);
  const [galerias, setGalerias] = useState([]);
  const fileInputRef = useRef(null);

  const fetchGalerias = async () => {
    const { data, error } = await supabase
      .from("galleries_content")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error) setGalerias(data);
  };

  useEffect(() => {
    fetchGalerias();
  }, []);

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const availableSlots = 15 - imagens.length;

    if (selectedFiles.length > availableSlots) {
      setImagemAviso(`Só pode adicionar mais ${availableSlots} imagem(ns).`);
    } else {
      setImagemAviso("");
    }

    if (availableSlots <= 0) return;

    const filesToAdd = selectedFiles.slice(0, availableSlots).map((file) => ({
      file,
      caption_pt: "",
      caption_en: ""
    }));

    setImagens((prev) => [...prev, ...filesToAdd]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCaptionChange = (index, lang, value) => {
    setImagens((prev) => {
      const newArr = [...prev];
      newArr[index][lang] = value;
      return newArr;
    });
  };

  const handleRemoveImage = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
    setImagemAviso("");
  };

  const compressImage = (file) =>
    new Promise((resolve) => {
      if (file.size <= 300 * 1024) return resolve(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scaleFactor = Math.sqrt(300 * 1024 / file.size);
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: file.type }));
            },
            file.type,
            0.75
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imagensFinal = [];

    for (const img of imagens) {
      if (img.file) {
        const compressed = await compressImage(img.file);
        const fileName = `gallery-${Date.now()}-${img.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, compressed, { upsert: true });

        if (uploadError) {
          alert("Erro no upload: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        imagensFinal.push({
          url: data.publicUrl,
          caption_pt: img.caption_pt,
          caption_en: img.caption_en
        });
      } else if (img.url) {
        imagensFinal.push({
          url: img.url,
          caption_pt: img.caption_pt,
          caption_en: img.caption_en
        });
      }
    }

    const isEditing = !!form.id;
    const slug = generateSlug(form.title_pt);

    const imagesData = Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => {
        const img = imagensFinal[i];
        return img
          ? [
              [`image${i + 1}_url`, img.url],
              [`image${i + 1}_caption_pt`, img.caption_pt],
              [`image${i + 1}_caption_en`, img.caption_en]
            ]
          : [
              [`image${i + 1}_url`, null],
              [`image${i + 1}_caption_pt`, null],
              [`image${i + 1}_caption_en`, null]
            ];
      }).flat()
    );

    const dataToSend = {
      id: isEditing ? form.id : uuidv4(),
      title_pt: form.title_pt,
      title_en: form.title_en,
      description_pt: form.description_pt,
      description_en: form.description_en,
      slug,
      updated_at: new Date(),
      published: true,
      ...imagesData
    };

    const { error } = await supabase.from("galleries_content").upsert(dataToSend);
    setLoading(false);

    if (error) {
      alert("Erro ao guardar.");
      console.error(error);
    } else {
      alert("Galeria guardada com sucesso!");
      setForm({
        id: null,
        title_pt: "",
        title_en: "",
        description_pt: "",
        description_en: "",
        slug: ""
      });
      setImagens([]);
      setImagemAviso("");
      fetchGalerias();
    }
  };

  const handleEdit = (gal) => {
    setForm({
      id: gal.id,
      title_pt: gal.title_pt,
      title_en: gal.title_en,
      description_pt: gal.description_pt,
      description_en: gal.description_en,
      slug: gal.slug
    });

    const imgs = Array.from({ length: 15 }, (_, i) => {
      const url = gal[`image${i + 1}_url`];
      if (!url) return null;
      return {
        file: null,
        url,
        caption_pt: gal[`image${i + 1}_caption_pt`] || "",
        caption_en: gal[`image${i + 1}_caption_en`] || ""
      };
    }).filter(Boolean);

    setImagens(imgs);
    setImagemAviso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Tens a certeza que queres apagar esta galeria?")) return;
    const { error } = await supabase.from("galleries_content").delete().eq("id", id);
    if (!error) fetchGalerias();
  };

  return (
    <div className="max-w-3xl mx-auto text-texto font-sans bg-admin p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{form.id ? "Editar Galeria" : "Adicionar Galeria"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title_pt" value={form.title_pt} onChange={handleChange} placeholder="Título (PT)" className="border p-2 rounded w-full" />
          <input name="title_en" value={form.title_en} onChange={handleChange} placeholder="Título (EN)" className="border p-2 rounded w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea name="description_pt" value={form.description_pt} onChange={handleChange} placeholder="Descrição (PT)" className="border p-2 rounded w-full" />
          <textarea name="description_en" value={form.description_en} onChange={handleChange} placeholder="Descrição (EN)" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Imagens (até 15)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={imagens.length >= 15}
          />
          <p className="text-sm text-gray-600 mt-1">
            {`Pode adicionar até ${15 - imagens.length} imagem(ns).`}
          </p>
          {imagemAviso && (
            <p className="text-sm text-red-600 font-semibold mt-1">{imagemAviso}</p>
          )}

          {imagens.map((img, i) => (
            <div key={i} className="mt-4 border p-2 rounded bg-white relative">
              <img
                src={img.file ? URL.createObjectURL(img.file) : img.url}
                alt={`preview-${i}`}
                className="h-32 object-cover mb-2 rounded"
              />
              <input type="text" placeholder="Legenda (PT)" value={img.caption_pt} onChange={(e) => handleCaptionChange(i, "caption_pt", e.target.value)} className="mb-2 w-full p-1 border rounded" />
              <input type="text" placeholder="Legenda (EN)" value={img.caption_en} onChange={(e) => handleCaptionChange(i, "caption_en", e.target.value)} className="w-full p-1 border rounded" />
              <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-2 right-2 bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-700">
                Remover
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">
          {loading ? "A guardar..." : form.id ? "Atualizar Galeria" : "Guardar Galeria"}
        </button>
      </form>

      <hr className="my-8" />
      <h2 className="text-lg font-bold mb-4">Galerias Existentes</h2>
      <ul className="space-y-6">
        {galerias.map((gal) => (
          <li key={gal.id} className="bg-white text-black rounded p-4 shadow">
            <p className="font-serif text-lg font-bold">{gal.title_pt}</p>
            {gal.image1_url && (
              <img src={gal.image1_url} alt="thumb" className="mb-4 w-full max-h-64 object-cover rounded" />
            )}
            <div className="flex gap-4">
              <button onClick={() => handleEdit(gal)} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">Editar</button>
              <button onClick={() => handleDelete(gal.id)} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">Apagar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
