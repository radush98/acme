import { Content } from "@/components/main/content/Content";
import { FileExplorer } from "@/components/main/content/FileExplorer";
import { Header } from "@/components/main/header/Header";
import { Logo } from "@/components/main/logo/Logo";
import { Sidebar } from "@/components/main/sidebar/Sidebar";
import { StorageStatsWidget } from "@/components/main/sidebar/StorageStatsWidget";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header>
        <Logo/>
      </Header>
      <div className="flex min-h-0 flex-1 overflow-hidden bg-background text-foreground">
        <Sidebar>
          <StorageStatsWidget />
        </Sidebar>
        <Content>
          <FileExplorer />
        </Content>
      </div>
    </div>
  );
}
