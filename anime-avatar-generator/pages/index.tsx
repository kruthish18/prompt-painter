import Head from "next/head";
import PromptForm from "../components/PromptForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Anime Avatar Generator</title>
      </Head>
      <main className="min-h-screen p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Anime Avatar Generator</h1>
        <PromptForm />
      </main>
    </>
  );
}