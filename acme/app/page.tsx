import { Content } from "@/components/main/content/Content";
import { DragNDrop } from "@/components/main/content/dragNDrop/DragNDrop";
import { Header } from "@/components/main/header/Header";
import { Logo } from "@/components/main/logo/Logo";
import { Sidebar } from "@/components/main/sidebar/Sidebar";
import { SidebarItem } from "@/components/main/sidebar/sidebarItem/SidebarItem";
import { Table } from "@/components/main/content/table/Table";
import { items } from "@/shared/constants/mock";
import { SIDEBAR_ITEMS } from "@/shared/constants/siderbarItems";
import { LocationHeader } from "@/components/main/content/locationHeader/LocationHeader";
import { Button } from "@/components/shared/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
        <LocationHeader>
          <Button primary className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Create Folder
          </Button>
        </LocationHeader>
            <DragNDrop>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Drag and Drop</h1>
                <p className="text-sm text-gray-500">Drag and drop files here</p>
              </div>
            </DragNDrop>
            <Table items={items} />
        </Content>
      </div>
    </div>
  );
}
