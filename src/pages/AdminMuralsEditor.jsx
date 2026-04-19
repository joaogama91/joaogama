import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

export default function AdminMuralsEditor() {
  const [form, setForm] = useState({
    id: null,
    title_pt: "",
    title_en: "",
    description_pt: "",
    description_en: "",
    slug: "",
    video_url: ""
  });
  const [imagens, setImagens] = useState([]);
  const [imagemAviso, setImagemAviso] = useState("");
  const [loading, setLoading] = useState(false);
  const [murais, setMurais] = useState([]);
  const [muralsOrder, setMuralsOrder] = useState("updated_desc");
  const fileInputRef = useRef(null);

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

  const fetchMurais = async () => {
    const { data, error } = await supabase
      .from("murals_content")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error) setMurais(data);
  };

  const fetchMuralsOrder = async () => {
    const { data, error } = await supabase
      .from("theme_config")
      .select("id, murals_order")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setMuralsOrder(data.murals_order || "updated_desc");
    }
  };

  useEffect(() => {
    fetchMurais();
    fetchMuralsOrder();
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

  const handleSaveMuralsOrder = async () => {
    const { data: existingConfig, error: fetchError } = await supabase
      .from("theme_config")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !existingConfig?.id) {
      alert("Erro ao guardar a ordenação.");
      return;
    }

    const { error } = await supabase
      .from("theme_config")
      .update({
        murals_order: muralsOrder,
        updated_at: new Date()
      })
      .eq("id", existingConfig.id);

    if (error) {
      alert("Erro ao guardar a ordenação.");
      console.error(error);
    } else {
      alert("Ordenação dos murais guardada com sucesso!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imagensFinal = [];

    for (const img of imagens) {
      if (img.file) {
        const compressed = await compressImage(img.file);
        const fileName = `mural-${Date.now()}-${img.file.name}`;
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
      video_url: form.video_url,
      updated_at: new Date(),
      published: true,
      ...imagesData
    };

    const { error } = await supabase.from("murals_content").upsert(dataToSend);
    setLoading(false);

    if (error) {
      alert("Erro ao guardar.");
      console.error(error);
    } else {
      alert("Mural guardado com sucesso!");
      setForm({
        id: null,
        title_pt: "",
        title_en: "",
        description_pt: "",
        description_en: "",
        slug: "",
        video_url: ""
      });
      setImagens([]);
      setImagemAviso("");
      fetchMurais();
    }
  };

  const handleEdit = (mur) => {
    setForm({
      id: mur.id,
      title_pt: mur.title_pt,
      title_en: mur.title_en,
      description_pt: mur.description_pt,
      description_en: mur.description_en,
      slug: mur.slug,
      video_url: mur.video_url || ""
    });

    const imgs = Array.from({ length: 15 }, (_, i) => {
      const url = mur[`image${i + 1}_url`];
      if (!url) return null;
      return {
        file: null,
        url,
        caption_pt: mur[`image${i + 1}_caption_pt`] || "",
        caption_en: mur[`image${i + 1}_caption_en`] || ""
      };
    }).filter(Boolean);

    setImagens(imgs);
    setImagemAviso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Tens a certeza que queres apagar este mural?")) return;
    const { error } = await supabase.from("murals_content").delete().eq("id", id);
    if (!error) fetchMurais();
  };

  return (
    <div className="max-w-3xl mx-auto text-texto font-sans bg-admin p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{form.id ? "Editar Mural" : "Adicionar Mural"}</h2>

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

        <div>
          <label className="block font-semibold mb-1">URL do vídeo (YouTube)</label>
          <input
            type="text"
            name="video_url"
            value={form.video_url}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {getYoutubeEmbedUrl(form.video_url) && (
            <div className="mt-4 aspect-video w-full overflow-hidden rounded">
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedUrl(form.video_url)}
                title="Pré-visualização do vídeo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">
          {loading ? "A guardar..." : form.id ? "Atualizar Mural" : "Guardar Mural"}
        </button>
      </form>

      <div className="my-8 border rounded p-4 bg-white text-black">
        <label className="block font-semibold mb-2">Ordenação dos Murais</label>
        <select
          value={muralsOrder}
          onChange={(e) => setMuralsOrder(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="updated_desc">Mais recentes primeiro</option>
          <option value="updated_asc">Mais antigos primeiro</option>
          <option value="title_asc">Título A-Z</option>
          <option value="title_desc">Título Z-A</option>
        </select>

        <button
          type="button"
          onClick={handleSaveMuralsOrder}
          className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800"
        >
          Guardar ordenação
        </button>
      </div>

      <hr className="my-8" />
      <h2 className="text-lg font-bold mb-4">Murais Existentes</h2>
      <ul className="space-y-6">
        {murais.map((mur) => (
          <li key={mur.id} className="bg-white text-black rounded p-4 shadow">
            <p className="font-serif text-lg font-bold">{mur.title_pt}</p>
            {mur.image1_url && (
              <img src={mur.image1_url} alt="thumb" className="mb-4 w-full max-h-64 object-cover rounded" />
            )}
            {getYoutubeEmbedUrl(mur.video_url) && (
              <div className="mb-4 aspect-video w-full overflow-hidden rounded">
                <iframe
                  className="w-full h-full"
                  src={getYoutubeEmbedUrl(mur.video_url)}
                  title="Vídeo do mural"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
            <div className="flex gap-4">
              <button onClick={() => handleEdit(mur)} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">Editar</button>
              <button onClick={() => handleDelete(mur.id)} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">Apagar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
