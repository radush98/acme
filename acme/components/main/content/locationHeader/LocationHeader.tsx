import { ROOT_LOCATION } from "@/shared/constants";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface LocationHeaderProps {
    location?: string;
    children: React.ReactNode;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({ location = ROOT_LOCATION, children }) => {
    const isRoot = location === ROOT_LOCATION;

    return (
        <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
                {isRoot && <FontAwesomeIcon icon={faHome} className="w-4 h-4" />}
                {isRoot ? ROOT_LOCATION : location}
            </h2>
            <div className="flex items-center gap-2">
                {children}
            </div>
        </div>
    );
}