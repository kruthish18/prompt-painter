import { useState } from "react";
import { generateKey } from "crypto";

interface FormData {
  characterName: string;
  description: string;
  style: string;
  aspectRatio: string;
}

const animeStyles = [
  { label: "Studio Ghibli", value: "Ghibli-style, soft pastel tones, cinematic lighting" },
  { label: "Shonen / Action", value: "shonen anime style, sharp lines, dramatic lighting" },
  { label: "Moe / Kawaii", value: "moe style, big eyes, soft colors, cutesy vibe" },
  { label: "Cyberpunk", value: "cyberpunk anime style, neon colors, futuristic design" },
  { label: "Fantasy RPG", value: "fantasy anime style, medieval aesthetic, elven features" },
  { label: "Retro 90s Anime", value: "90s anime style, VHS grain, bold outlines" },
];

const aspectRatios = [
  { label: "Square (1:1)", value: "512x512" },
  { label: "Portrait (3:4)", value: "512x768" },
  { label: "Banner (16:9)", value: "768x512" },
];

export default function PromptForm() {
  const [form, setForm] = useState<FormData>({
    characterName: "",
    description: "",
    style: animeStyles[0].value,
    aspectRatio: "512x512",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating image", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-semibold">Character Name (optional)</label>
          <input
            type="text"
            name="characterName"
            value={form.characterName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g. Hikari"
          />
        </div>

        <div>
          <label className="block font-semibold">Avatar Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="e.g. pink-haired girl with a cyberpunk jacket"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Anime Style</label>
          <select name="style" value={form.style} onChange={handleChange} className="w-full border p-2 rounded">
            {animeStyles.map((style) => (
              <option key={style.label} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Aspect Ratio</label>
          <select name="aspectRatio" value={form.aspectRatio} onChange={handleChange} className="w-full border p-2 rounded">
            {aspectRatios.map((ratio) => (
              <option key={ratio.label} value={ratio.value}>
                {ratio.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Avatar"}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-6 text-center">
          <img src={imageUrl} alt="Anime Avatar" className="mx-auto rounded shadow" />
          <a
            href={imageUrl}
            download="anime-avatar.png"
            className="inline-block mt-2 text-blue-600 underline"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}