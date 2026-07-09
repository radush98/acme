import { Content } from "@/components/main/content/Content";
import { Header } from "@/components/main/header/Header";
import { Logo } from "@/components/main/logo/Logo";
import { Sidebar } from "@/components/main/sidebar/Sidebar";
import { SidebarItem } from "@/components/main/sidebar/sidebarItem/SidebarItem";
import { SIDEBAR_ITEMS } from "@/shared/constants/siderbarItems";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header>
        <Logo/>
      </Header>
      <div className="flex min-h-0 flex-1 overflow-hidden bg-background text-foreground">
        <Sidebar>
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem key={item.href} icon={item.icon} text={item.text} href={item.href} />
          ))}
        </Sidebar>
        <Content>
          <h1>Test</h1>
        </Content>
      </div>
    </div>
  );
}
