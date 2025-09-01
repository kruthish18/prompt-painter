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

// const videoAspectRatios = [
//     { label: "Square (1:1)", value: "1080x1080" },
//     { label: "Landscape (16:9)", value: "1920x1080" },
//     { label: "Portrait (9:16)", value: "1080x1920" },
// ];

const videoAspectRatios = [
    { label: "1:1 Square - 480p", value: "640x640" },
    { label: "1:1 Square - 1080p", value: "1440x1440" },
    { label: "16:9 Landscape - 480p", value: "1920x1088" },
    { label: "16:9 Landscape - 1080p", value: "1920x1088" },
    { label: "21:9 Ultra-Wide/Landscape - 480p", value: "960x416" },
    { label: "21:9 Ultra-Wide/Landscape - 480p", value: "2176x928" },
    { label: "9:16 Tall/Portrait - 480p", value: "480x864" },
    { label: "9:16 Tall/Portrait - 480p", value: "1088x1920" },
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

        console.log("Submitting for video with values:", {
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

    const inputStyle = {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '1.5',
        color: '#374151',
        backgroundColor: '#ffffff',
        border: '1.5px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px 16px',
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        outline: 'none',
    };

    const selectStyle = {
        ...inputStyle,
        appearance: 'none' as const,
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px',
        paddingRight: '40px',
    };

    const labelStyle = {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '6px',
        display: 'block',
    };

    const buttonStyle = {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#633cff',
        border: 'none',
        borderRadius: '8px',
        padding: '14px 32px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        outline: 'none',
        opacity: loading ? 0.7 : 1,
    };

    return (
        <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* // ADDED THIS ENTIRE SECTION (NEW): */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
                    .custom-input:focus {
                    border-color: #633cff !important;
                    box-shadow: 0 0 0 3px rgba(99, 60, 255, 0.1) !important;
                    }
                    
                    .custom-button:hover:not(:disabled) {
                    background-color: #5b34e8 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 60, 255, 0.3);
                    }
                    
                    .custom-select:focus {
                    border-color: #633cff !important;
                    box-shadow: 0 0 0 3px rgba(99, 60, 255, 0.1) !important;
                    }
                    
                    .test-card {
                    background: linear-gradient(135deg, #633cff, #7c4dff);
                    border-radius: 8px;
                    padding: 16px;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                    text-align: center;
                    margin-bottom: 16px;
                    }
  `}
            </style>
            {/* <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow"
            > */}
            <form
                onSubmit={handleSubmit}
                className="animate-fade-in"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    backgroundColor: '#ffffff',
                    padding: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f3f4f6',
                }}
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"
                        placeholder="e.g. Hikari"
                    />
                </div>


                <div>
                    <label className="block font-semibold">Anime Style</label>
                    <select
                        name="style"
                        value={form.style}
                        onChange={handleChange}
                        // className="w-full border p-2 rounded"
                        // className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple"
                        // className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple bg-white text-gray-800"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"
                    >
                        {animeStyles.map((style) => (
                            <option key={style.label} value={style.value}>
                                {style.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* <div className="bg-brandPurple text-white p-4"> */}
                {/* <div className="bg-brand-purple text-white p-4"> */}


                {/* Row 2: Full-width Description */}
                <div className="md:col-span-2">
                    <label className="block font-semibold">Avatar Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"
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
                        // className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"

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
                        // className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"

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
                        // className="bg-brandPurple text-white px-6 py-3 mt-4 rounded-lg font-semibold hover:bg-purple-700 transition focus:ring-2 focus:ring-brandPurple"
                        className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300"    
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
                        Download Image ⬇️
                    </a>

                    {/* ✨ New: Video Creation Section */}
                    <div className="mt-8 text-left max-w-lg mx-auto">
                        <button
                            className="rounded hover:bg-purple-700 transition bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300"
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"
                                    placeholder="e.g. wind blowing through hair, character blinking slowly"
                                    value={videoPrompt}
                                    onChange={(e) => setVideoPrompt(e.target.value)}
                                    rows={3}
                                />
                                <button
                                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300"
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
                                Download Video ⬇️
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
