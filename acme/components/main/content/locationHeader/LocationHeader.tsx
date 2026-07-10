import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface LocationHeaderProps {
    location: string;
    children: React.ReactNode;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({ location, children }) => {
    return <div>
        <h2 className="text-2xl font-bold">{location}</h2>
        <div className="flex items-center gap-2">
            {children}
        </div>
    </div>
}