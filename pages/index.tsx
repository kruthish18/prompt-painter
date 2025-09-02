import Head from "next/head";
import PromptForm from "../components/PromptForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Anime Avatar Generator</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#e0eaff] via-[#f5f8ff] to-[#fff] flex flex-col items-center justify-start py-12 px-4">
        {/* <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight text-gray-900 animate-fade-in">
          Anime Avatar Generator
        </h1> */}

        <h1 className="flex items-center justify-center text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 animate-fade-in space-x-4">
          <img
            src="/images/itachi-logo.png"
            alt="Itachi"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border-2 border-black"
          />
          <span>Anime Avatar Generator</span>
        </h1>


        <p className="text-center text-gray-600 max-w-xl mb-8 animate-fade-in delay-150">
          Describe your anime character and bring them to life with stunning <br/>AI-generated avatars.
        </p>

        {/* Card Wrapper */}
        <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-500 animate-fade-in delay-300">
          <PromptForm />
        </div>
      </div>
    </>
  );
}