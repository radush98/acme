import { Content } from "@/components/main/content/Content";
import { FileExplorer } from "@/components/main/content/FileExplorer";
import { Sidebar } from "@/components/main/sidebar/Sidebar";
import { StorageStatsWidget } from "@/components/main/sidebar/StorageStatsWidget";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-background text-foreground">
      <Sidebar>
        <StorageStatsWidget />
      </Sidebar>
      <Content>
        <FileExplorer />
      </Content>
    </div>
  );
}
