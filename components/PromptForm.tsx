import { useState } from "react";

// Interface for UI form fields
interface FormData {
    characterName: string;
    description: string;
    style: string;
    imageAspectRatio: string;
    videoAspectRatio: string;
}

// defining anime-styles to select from the dropdown
const animeStyles = [
    {
        label: "Studio Ghibli",
        value: "Ghibli-style, soft pastel tones, cinematic lighting",
    },
    {
        label: "Shonen / Action",
        value: "shonen anime style, sharp lines, dramatic lighting",
    },
    {
        label: "Moe / Kawaii",
        value: "moe style, big eyes, soft colors, cutesy vibe",
    },
    {
        label: "Cyberpunk",
        value: "cyberpunk anime style, neon colors, futuristic design",
    },
    {
        label: "Fantasy RPG",
        value: "fantasy anime style, medieval aesthetic, elven features",
    },
    {
        label: "Retro 90s Anime",
        value: "90s anime style, VHS grain, bold outlines",
    },
];

const imageAspectRatios = [
    { label: "512x512", value: "512x512" },
    { label: "512x768", value: "512x768" },
    { label: "768x512", value: "768x512" },
];

const videoAspectRatios = [
    { label: "Square (1:1)", value: "1080x1080" },
    { label: "Landscape (16:9)", value: "1920x1080" },
    { label: "Portrait (9:16)", value: "1080x1920" },
];

export default function PromptForm() {
    const [form, setForm] = useState<FormData>({
        characterName: "",
        description: "",
        style: animeStyles[0].value,
        imageAspectRatio: "512x512",
        videoAspectRatio: "1440x1440",
    });

    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showVideoPrompt, setShowVideoPrompt] = useState(false);
    const [videoPrompt, setVideoPrompt] = useState(
        "wind blowing through hair, character blinking slowly"
    );
    const [videoUrl, setVideoUrl] = useState("");
    const [videoLoading, setvideoLoading] = useState(false);
    const [taskUUID, setTaskUUID] = useState("");

    // form input handler
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // avator image generation handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setImageUrl("");
        setTaskUUID("");

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    characterName: form.characterName,
                    description: form.description,
                    style: form.style,
                    imageAspectRatio: form.imageAspectRatio,
                }),
            });

            const data = await res.json();
            console.log("Generate API response:", data);
            setImageUrl(data.imageUrl);
            setTaskUUID(data.taskUUID);
        } catch (error) {
            console.error("Error generating image", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // video generation handler
    const handleVideoGenerate = async () => {
        if (!imageUrl || !videoPrompt.trim()) {
            alert("Image or prompt missing");
            return;
        }

        const [widthStr, heightStr] = form.videoAspectRatio.split("x");
        const width = parseInt(widthStr);
        const height = parseInt(heightStr);

        setvideoLoading(true);
        setVideoUrl("");

        console.log("🚀 Submitting for video with values:", {
            prompt: videoPrompt,
            width,
            height,
            taskUUID,
        });


        try {
            const res = await fetch("/api/video", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    prompt: videoPrompt,
                    videoAspectRatio: form.videoAspectRatio,
                    taskUUID,
                    inputImage: imageUrl,
                }),
            });

            const data = await res.json();

            const videoUrl = data.videoUrl;

            if (res.ok && videoUrl) {
                setVideoUrl(videoUrl);

                console.log("Runware full video data:", data);

            } else {
                console.error("Video generation failed:", data);
                alert("Something went wrong during video generation");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("server error");
        } finally {
            setvideoLoading(false);
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow"
            >
                {/* Row 1: Character Name + Anime Style */}
                <div>
                    <label className="block font-semibold">Character Name (optional)</label>
                    <input
                        type="text"
                        name="characterName"
                        value={form.characterName}
                        onChange={handleChange}
                        // className="w-full border p-2 rounded"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Hikari"
                    />
                </div>

                <div className="bg-red-500 text-white p-4">
  If this is red, Tailwind is working
</div>


                <div>
                    <label className="block font-semibold">Anime Style</label>
                    <select
                        name="style"
                        value={form.style}
                        onChange={handleChange}
                        // className="w-full border p-2 rounded"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple"

                    >
                        {animeStyles.map((style) => (
                            <option key={style.label} value={style.value}>
                                {style.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-brandPurple text-white p-4">
  This should have a purple background
</div>

                {/* Row 2: Full-width Description */}
                <div className="md:col-span-2">
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

                {/* Row 3: Aspect Ratios */}
                <div>
                    <label className="block font-semibold">Image Aspect Ratio</label>
                    <select
                        name="imageAspectRatio"
                        value={form.imageAspectRatio}
                        onChange={handleChange}
                        // className="w-full border p-2 rounded"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple"

                    >
                        {imageAspectRatios.map((ratio) => (
                            <option key={ratio.label} value={ratio.value}>
                                {ratio.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Video Aspect Ratio</label>
                    <select
                        name="videoAspectRatio"
                        value={form.videoAspectRatio}
                        onChange={handleChange}
                        // className="w-full border p-2 rounded"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple"

                    >
                        {videoAspectRatios.map((ratio) => (
                            <option key={ratio.label} value={ratio.value}>
                                {ratio.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Row 4: Centered Submit Button (spans 2 cols) */}
                <div className="md:col-span-2 flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        // className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        // className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-400"
                        className="bg-brandPurple text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition focus:ring-2 focus:ring-brandPurple"

                    >
                        {loading ? "Generating..." : "Generate Avatar"}
                    </button>
                </div>
            </form>


            {/* <div className="mt-6">
                <label className="block font-semibold">Motion Prompt</label>
                <input
                    type="text"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="e.g. blinking eyes, wind blowing"
                />

                <button
                    onClick={handleVideoGenerate}
                    disabled={loading || !imageUrl}
                    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                    {loading ? "Generating Video..." : "Generate Video from Image"}
                </button>
            </div> */}


            {imageUrl && (
                <div className="mt-6 text-center">
                    <img
                        src={imageUrl}
                        alt="Anime Avatar"
                        className="mx-auto rounded shadow"
                    />
                    <a
                        href={imageUrl}
                        download="anime-avatar.png"
                        className="inline-block mt-2 text-blue-600 underline"
                    >
                        Download Image
                    </a>

                    {/* ✨ New: Video Creation Section */}
                    <div className="mt-8 text-left max-w-lg mx-auto">
                        <button
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                            onClick={() => setShowVideoPrompt(true)}
                        >
                            🎥 Create Anime Video
                        </button>

                        {showVideoPrompt && (
                            <div className="mt-4 space-y-2">
                                <label className="block font-semibold">
                                    Describe the Animation
                                </label>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    placeholder="e.g. wind blowing through hair, character blinking slowly"
                                    value={videoPrompt}
                                    onChange={(e) => setVideoPrompt(e.target.value)}
                                    rows={3}
                                />
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                    onClick={handleVideoGenerate}
                                    disabled={videoLoading}
                                >
                                    {videoLoading ? "Generating Video..." : "Generate Video"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 🎬 Video Preview */}
                    {videoUrl && (
                        <div className="mt-6">
                            <video
                                key={videoUrl}
                                src={videoUrl}
                                controls
                                autoPlay
                                loop
                                onError={(e) => {
                                    console.error("Video failed to load", e);
                                    alert("Video failed to load. Try reloading the page or regenerating.");
                                }}
                                preload="auto"
                                className="mx-auto rounded shadow w-full max-w-lg"
                            >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            <a
                                href={videoUrl}
                                download="anime-avatar-video.mp4"
                                className="inline-block mt-2 text-green-600 underline"
                            >
                                Download Video
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
