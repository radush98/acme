import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export const SidebarItem: React.FC<{ icon: IconProp, text: string, href: string }> = ({ icon, text, href }) => {
    return <Link href={href}>
        <div className="flex items-center gap-2 text-md font-medium hover:text-primary hover:bg-accent p-2 rounded-md"><FontAwesomeIcon icon={icon} className="w-4 h-4"/> {text}</div>
    </Link>
}