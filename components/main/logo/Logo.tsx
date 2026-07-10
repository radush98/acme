import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faShield} from '@fortawesome/free-solid-svg-icons/faShield'

export const Logo: React.FC = () => {
    return <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faShield} className="text-primary w-6 h-6"/>
        <div className="text-2xl font-bold">Acme Corp. Data Room</div>
    </div> 
}