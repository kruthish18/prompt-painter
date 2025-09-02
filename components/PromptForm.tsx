// Main form component for collecting user inputs to generate an anime avatar and optionally a video

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

// Dropdown options for image aspect ratios
const imageAspectRatios = [
    { label: "512x512", value: "512x512" },
    { label: "512x768", value: "512x768" },
    { label: "768x512", value: "768x512" },
];

// Video sizes (labels are for the user; values are WxH used by the API)
const videoAspectRatios = [
    { label: "1:1 Square - 480p", value: "640x640" },
    { label: "1:1 Square - 1080p", value: "1440x1440" },
    { label: "16:9 Landscape - 480p", value: "1920x1088" },
    { label: "16:9 Landscape - 1080p", value: "1920x1088" },
    { label: "21:9 Ultra-Wide/Landscape - 480p", value: "960x416" },
    { label: "21:9 Ultra-Wide/Landscape - 1080p", value: "2176x928" },
    { label: "9:16 Tall/Portrait - 480p", value: "480x864" },
    { label: "9:16 Tall/Portrait - 1080p", value: "1088x1920" },
];

export default function PromptForm() {
    // Form + request state
    const [form, setForm] = useState<FormData>({
        characterName: "",
        description: "",
        style: animeStyles[0].value,
        imageAspectRatio: "512x512",
        videoAspectRatio: "1440x1440",
    });

    const [imageUrl, setImageUrl] = useState("");
    const [imageUUID, setImageUUID] = useState("");
    const [loading, setLoading] = useState(false);
    const [showVideoPrompt, setShowVideoPrompt] = useState(false);
    const [videoPrompt, setVideoPrompt] = useState(
        "wind blowing through hair, character blinking slowly"
    );
    const [videoUrl, setVideoUrl] = useState("");
    const [videoLoading, setvideoLoading] = useState(false);
    const [taskUUID, setTaskUUID] = useState("");

    // Update form values on input
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit form to generate image. returns image URL + IDs we reuse for the video
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setImageUrl("");
        setImageUUID("");
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
            setImageUUID(data.imageUUID);
            setTaskUUID(data.taskUUID);
        } catch (error) {
            console.error("Error generating image", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Submit image + prompt to generate video
    const handleVideoGenerate = async () => {
        if (!imageUUID || !videoPrompt.trim()) {
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
            imageUUID,
        });


        try {
            const res = await fetch("/api/video", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    prompt: videoPrompt,
                    videoAspectRatio: form.videoAspectRatio,
                    taskUUID,
                    inputImage: imageUUID,
                }),
            });

            const data = await res.json();
            console.log("Video generation response:", data);

            // Prefer the API’s URL; if not present, use a constructed fallback
            const rawUrl =
                (data.videoUrl as string | null) ??
                (data.fallbackUrl as string | null) ??
                (data.taskUUID ? `https://vm.runware.ai/video/ws/2/vi/${data.taskUUID}.mp4` : null);

            if (!res.ok) {
                console.error("Video generation failed:", data);
                alert("Something went wrong during video generation");
                setvideoLoading(false);
                return;
            }

            if (!rawUrl) {
                alert("Video task created but no URL returned. Please try again.");
                setvideoLoading(false);
                return;
            }

            // Warm the URL to avoid a stale, zero-second clip
            const cleanUrl = rawUrl.split("?")[0];
            for (let i = 0; i < 2; i++) {
                try {
                    const head = await fetch(cleanUrl, { method: "HEAD" });
                    if (head.ok) break;
                } catch { }
                await new Promise(r => setTimeout(r, 800));
            }

            // Cache-bust the inline player
            const playbackUrl = `${cleanUrl}?t=${Date.now()}`;
            setVideoUrl(playbackUrl);

        } catch (err) {
            console.error("Error:", err);
            alert("server error");
        } finally {
            setvideoLoading(false);
        }
    };

    // Render Form for UI
    return (
        <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

            {/* The full form layout is in a grid that adjusts responsively */}
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
                {/* Character Name Field*/}
                <div>
                    <label className="block font-semibold">Character Name (optional)</label>
                    <input
                        type="text"
                        name="characterName"
                        value={form.characterName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"
                        placeholder="e.g. Nezuko"
                    />
                </div>

                {/* Anime Style Dropdown */}
                <div>
                    <label className="block font-semibold">Anime Style</label>
                    <select
                        name="style"
                        value={form.style}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"
                    >
                        {animeStyles.map((style) => (
                            <option key={style.label} value={style.value}>
                                {style.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Row 2: Full-width Description */}
                <div className="md:col-span-2">
                    <label className="block font-semibold">Avatar Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"
                        rows={3}
                        placeholder="e.g. A girl with fair skin, long black hair that fades to flame orange, pale pink eyes, and a bamboo muzzle, in her pink kimono"
                        required
                    />
                </div>

                {/* Row 3: Image Aspect Ratios */}
                <div>
                    <label className="block font-semibold">Image Aspect Ratio</label>
                    <select
                        name="imageAspectRatio"
                        value={form.imageAspectRatio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"

                    >
                        {imageAspectRatios.map((ratio) => (
                            <option key={ratio.label} value={ratio.value}>
                                {ratio.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Video Aspect Ratio */}

                <div>
                    <label className="block font-semibold">Video Aspect Ratio</label>
                    <select
                        name="videoAspectRatio"
                        value={form.videoAspectRatio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-brand-purple)] focus:outline-none"

                    >
                        {videoAspectRatios.map((ratio) => (
                            <option key={ratio.label} value={ratio.value}>
                                {ratio.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Row 4: Centered Submit Button */}
                <div className="md:col-span-2 flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 text-white font-semibold rounded-[8px] shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-purple)]"
                        style={{ backgroundColor: "var(--color-brand-purple)" }}
                    >
                        {loading ? "Generating..." : "Generate Avatar"}
                    </button>
                </div>

            </form>

            {/* Avatar Image Preview & Video Section */}
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

                    {/* New: Video Creation Section */}
                    <div className="mt-8 text-left max-w-lg mx-auto">
                        <button
                            className="w-full rounded-[8px] text-white px-4 py-2 font-semibold shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-purple)]"
                            style={{ backgroundColor: "var(--color-brand-purple)" }}
                            onClick={() => setShowVideoPrompt(true)}
                        >
                            Create Anime Video
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
                                    className="w-full py-3 px-6 text-white font-semibold rounded-[8px] shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-purple)]"
                                    style={{ backgroundColor: "var(--color-brand-purple)" }}
                                    onClick={handleVideoGenerate}
                                    disabled={videoLoading}
                                >
                                    {videoLoading ? "Generating Video..." : "Generate Video"}
                                </button>

                            </div>
                        )}
                    </div>

                    {/* Video Preview */}
                    {videoUrl && (
                        <div className="mt-6">
                            <video
                                key={videoUrl}
                                src={videoUrl}
                                controls
                                loop
                                playsInline
                                crossOrigin="anonymous"
                                preload="auto"
                                onError={() => {
                                    // one silent retry with a new cache-buster
                                    const clean = videoUrl.split("?")[0];
                                    const retryUrl = `${clean}?t=${Date.now() + 1}`;
                                    if (retryUrl !== videoUrl) setVideoUrl(retryUrl);
                                }}
                                onLoadedMetadata={(e) => {
                                    console.log("Loaded duration:", e.currentTarget.duration);
                                }}
                                className="mx-auto rounded shadow w-full max-w-lg"
                            >
                                <source src={videoUrl} type="video/mp4" />
                            </video>

                            <div className="mt-4 text-center">
                                <a
                                    href={videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 text-white rounded mr-2"
                                    style={{ backgroundColor: "var(--color-brand-purple)" }}
                                >
                                    Open Video in New Tab
                                </a>

                                {/* Direct download from the same origin helps avoid CORS issues */}
                                <a
                                    href={videoUrl}
                                    download="anime-avatar-video.mp4"
                                    className="inline-block px-4 py-2 text-white rounded"
                                    style={{ backgroundColor: "var(--color-brand-purple)" }}
                                >
                                    Download Video
                                </a>

                            </div>

                            <div className="mt-2 text-xs text-gray-500 text-center">
                                Video URL:{" "}
                                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                                    {videoUrl}
                                </a>
                            </div>
                        </div>
                    )}


                </div>
            )}
        </div>
    );
}
