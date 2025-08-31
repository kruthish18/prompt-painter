import Head from "next/head";
import PromptForm from "../components/PromptForm";

export default function Home() {
    return (
        <>
            <Head>
                <title>Anime Avatar Generator</title>
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-start py-10 px-4">
                <h1 className="text-3xl md:text-4xl font-bold font-sans mb-6 tracking-tight text-gray-900 border-b-2 border-gray-300 pb-2">
                    Anime Avatar Generator
                </h1>

                <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg transition-all duration-300">
                    <PromptForm />
                </div>
            </div>
        </>
    );
}