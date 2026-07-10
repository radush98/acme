import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface SidebarItem {
    icon: IconProp;
    text: string;
    href: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        icon: faFolder,
        text: 'All Folders',
        href: '/'
    },
    {
        icon: faInfoCircle,
        text: 'Info',
        href: '/info'
    },
]