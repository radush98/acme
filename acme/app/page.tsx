import { Content } from "@/components/content/Content";
import { Header } from "@/components/header/Header";
import { Logo } from "@/components/logo/Logo";
import { Sidebar } from "@/components/sidebar/Sidebar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header>
        <Logo/>
      </Header>
      <main className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        <Sidebar>
          <div className="flex flex-col gap-4">
            <Link href="/">Главная</Link>
            <Link href="/file">Файлы</Link>
            <Link href="/settings">Настройки</Link>
          </div>
        </Sidebar>
        <Content>
          <h1>Test</h1>
        </Content>
      </main>

    </div>

    // <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
    //   <main className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-sm dark:bg-zinc-950">
    //     <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
    //       Главная страница
    //     </h1>

    //     <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
    //       Добро пожаловать. Перейдите на страницу файла по ссылке ниже.
    //     </p>

    //     <Link
    //       href="/file/example"
    //       className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    //     >
    //       Открыть /file/example
    //     </Link>
    //   </main>
    // </div>
  );
}
