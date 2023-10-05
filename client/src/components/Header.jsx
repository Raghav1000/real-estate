import { routes } from "../utils/helper"
import { Link } from "react-router-dom"

const Header = () => {

    return (
        <header className='shadow-[0_2px_8px_0px_rgba(99,99,99,0.2)]'>
            <div className='flex justify-between place-items-center max-w-7xl mx-auto p-4'>
                <Link to='/'>
                    <h1 className='font-bold text-lg'>Real Estate</h1>
                </Link>
                <form>
                    <input type='text' placeholder='Search' className='py-2 indent-3 border bg-slate-100 rounded-sm focus:outline-none' />
                </form>
                <ul className="flex gap-5">
                    {
                        routes.map(({ route, title }) => (
                            <Link to={route}>
                                <li className="hover:text-blue-900">{title}</li>
                            </Link>))
                    }
                </ul>
            </div>
        </header>
    )
}

export default Header