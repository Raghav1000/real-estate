import { routes } from "../utils/helper"
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'

const Header = () => {
    const { currentUser } = useSelector((state => state.user))
    return (
        <header className='shadow-[0_2px_8px_0px_rgba(99,99,99,0.2)]'>
            <div className='flex justify-between place-items-center max-w-7xl mx-auto p-4'>
                <Link to='/'>
                    <h1 className='font-bold text-lg'>Real Estate</h1>
                </Link>
                <ul className="flex gap-10 place-items-center">
                    <form>
                        <input type='text' placeholder='Search' className='py-2 indent-3 border bg-slate-100 rounded-sm' />
                    </form>
                    {
                        routes.map(({ route, title }) => (
                            <Link key={title} to={route}>
                                <li className="hover:text-blue-900">{title}</li>
                            </Link>))
                    }
                    {
                        currentUser &&
                        <Link to='/profile'>
                            <img src={currentUser?.avatar} alt={`${currentUser?.username}'s profile`}
                                className="w-7 h-7 border border-gray-300 rounded-full bg-blue-400" />
                        </Link>
                    }
                </ul>
            </div>
        </header>
    )
}

export default Header