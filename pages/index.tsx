// import Head from "next/head";
// import PromptForm from "../components/PromptForm";

// export default function Home() {
//     return (
//         <>
//             <Head>
//                 <title>Anime Avatar Generator</title>
//             </Head>
//             <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-start py-10 px-4">
//             {/* <div className="min-h-screen bg-gradient-to-b from-[#f0f4ff] to-[#e0e7ff] flex flex-col items-center justify-start py-10 px-4"> */}
//                 <h1 className="text-3xl md:text-4xl font-bold font-sans mb-6 tracking-tight text-gray-900 border-b-2 border-gray-300 pb-2">
//                     Anime Avatar Generator
//                 </h1>

//                 <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg transition-all duration-300">
//                     <PromptForm />
//                 </div>
                
//             </div>
//         </>
//     );
// }

import Head from "next/head";
import PromptForm from "../components/PromptForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Anime Avatar Generator</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#e0eaff] via-[#f5f8ff] to-[#fff] flex flex-col items-center justify-start py-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight text-gray-900 animate-fade-in">
          Anime Avatar Generator
        </h1>

        <p className="text-center text-gray-600 max-w-xl mb-8 animate-fade-in delay-150">
          Describe your anime character and bring them to life with stunning AI-generated avatars.
        </p>

        {/* Card Wrapper */}
        <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-500 animate-fade-in delay-300">
          <PromptForm />
        </div>

        {/* <footer className="mt-16 text-center text-sm text-gray-400">
          Built with 💜 using Next.js, Tailwind CSS, and AI magic.
        </footer> */}
      </div>
    </>
  );
}