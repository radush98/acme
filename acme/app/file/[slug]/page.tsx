import Link from "next/link";

type FilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FilePage({ params }: FilePageProps) {
  const { slug } = await params;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-sm dark:bg-zinc-950">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          ← На главную
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {slug}
        </h1>

        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Страница файла: <span className="font-mono text-zinc-900 dark:text-zinc-200">/file/{slug}</span>
        </p>
      </main>
    </div>
  );
}
