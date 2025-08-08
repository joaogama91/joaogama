import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

const THEMES = [
  {
    name: "Clássico",
    description: "Elegância tradicional com foco em tons neutros e tipografia serifada refinada.",
    primary_color: "#3e1f06",
    background_color: "#FFFDF8",
    admin_color: "#f5eee6",
    font_serif: "Rosarivo",
    font_sans: "Inter",
  },
  {
    name: "Minimalista",
    description: "Preto, branco e fontes modernas para uma estética limpa e profissional.",
    primary_color: "#111111",
    background_color: "#ffffff",
    admin_color: "#f0f0f0",
    font_serif: "Georgia",
    font_sans: "Helvetica Neue",
  },
  {
    name: "Noite Suave",
    description: "Ideal para sites escuros com fonte clara e estilo contemporâneo.",
    primary_color: "#e0e0e0",
    background_color: "#121212",
    admin_color: "#1f1f1f",
    font_serif: "Playfair Display",
    font_sans: "Open Sans",
  },
  {
    name: "Terroso",
    description: "Inspirado na natureza e em tons quentes para um visual aconchegante.",
    primary_color: "#4a2e2b",
    background_color: "#fdf6f0",
    admin_color: "#e4d8c3",
    font_serif: "Merriweather",
    font_sans: "Lato",
  },
  {
    name: "Contemporâneo",
    description: "Sofisticado e moderno com tons frios e contraste suave.",
    primary_color: "#2c3e50",
    background_color: "#ecf0f1",
    admin_color: "#dfe6e9",
    font_serif: "Cormorant Garamond",
    font_sans: "Nunito",
  },
];

export default function ThemeEditor() {
  const [form, setForm] = useState({ ...THEMES[0], menu_layout: "vertical", show_captions: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTheme = async () => {
      const { data, error } = await supabase
        .from("theme_config")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) console.error("Erro ao buscar tema:", error.message);
      if (data) setForm((prev) => ({ ...prev, ...data }));
    };

    fetchTheme();
  }, []);

  const applyTheme = (theme) => setForm((prev) => ({ ...prev, ...theme }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const upsertData = {
      id: form.id || uuidv4(),
      primary_color: form.primary_color,
      background_color: form.background_color,
      admin_color: form.admin_color,
      font_serif: form.font_serif,
      font_sans: form.font_sans,
      menu_layout: form.menu_layout || "vertical",
      show_captions: form.show_captions,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("theme_config").upsert(upsertData);
    setLoading(false);

    if (error) {
      alert("Erro ao guardar tema.");
      console.error("Supabase upsert error:", error);
    } else {
      alert("Tema atualizado com sucesso!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-sans text-texto bg-admin p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Editor de Tema</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {THEMES.map((theme, i) => (
          <button
            key={i}
            onClick={() => applyTheme(theme)}
            className="p-4 border rounded hover:bg-gray-100 text-left transition"
          >
            <h3 className="font-bold mb-1">{theme.name}</h3>
            <p className="text-sm text-gray-700">{theme.description}</p>
            <div className="mt-2 flex gap-2">
              <span className="w-5 h-5 rounded" style={{ background: theme.primary_color }} />
              <span className="w-5 h-5 rounded" style={{ background: theme.background_color }} />
              <span className="w-5 h-5 rounded" style={{ background: theme.admin_color }} />
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Cor principal (texto)</label>
            <input
              type="color"
              name="primary_color"
              value={form.primary_color}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Cor de fundo</label>
            <input
              type="color"
              name="background_color"
              value={form.background_color}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Cor do admin</label>
            <input
              type="color"
              name="admin_color"
              value={form.admin_color}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Fonte serif (títulos)</label>
            <input
              type="text"
              name="font_serif"
              value={form.font_serif}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Fonte sans-serif (texto)</label>
            <input
              type="text"
              name="font_sans"
              value={form.font_sans}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Layout do menu (desktop)</label>
            <select
              name="menu_layout"
              value={form.menu_layout}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="show_captions"
                checked={form.show_captions}
                onChange={handleChange}
              />
              Mostrar legendas das imagens fora do fullscreen
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-texto text-admin px-4 py-2 rounded hover:bg-gray-800">
          {loading ? "A guardar..." : "Guardar tema"}
        </button>
      </form>
    </div>
  );
}
