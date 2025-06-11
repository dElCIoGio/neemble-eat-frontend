import {Link} from "react-router";
import {ChevronLeft} from "lucide-react"

interface props {
    path: string,
    title: string
}

function ReturnNav({title, path}: props) {
    return (
        <div className='flex relative justify-between items-center mt-4 mb-8'>
            <Link to={path}
                  className='absolute flex-none'>
                <div className="text-left">
                    <p className='text-lg font-bold pr-3'>
                        <ChevronLeft/>
                    </p>
                </div>
            </Link>
            <div className='flex-grow'/>
            <div className='flex-none text-center '>
                {title}
            </div>
            <div className='flex-grow'></div>
        </div>
    );
}

export default ReturnNav;