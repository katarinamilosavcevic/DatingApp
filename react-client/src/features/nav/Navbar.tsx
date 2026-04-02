import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { toast } from '../../services/toast';

export default function Navbar() {
    const { currentUser, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const isAdminOrMod = currentUser?.roles?.includes('Admin') || currentUser?.roles?.includes('Moderator');

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/members');
            setEmail('');
            setPassword('');
            toast.success('Logged in successfully');
        } catch {
            toast.error('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate('/');
    };

    return (
        <header className="p-3 w-full fixed top-0 z-50 bg-linear-to-r from-purple-700 to-black">
            <div className="flex items-center px-6 gap-6">
                <NavLink to="/" className="flex items-center gap-3 text-white border-r-2 border-white pr-6 no-underline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                    </svg>
                    <span className="text-2xl font-semibold uppercase">Dating App</span>
                </NavLink>

                <nav className="flex gap-4 uppercase text-white text-lg">
                    {currentUser && (
                        <>
                            <NavLink to="/members" className="text-white no-underline hover:text-purple-300">Matches</NavLink>
                            <NavLink to="/lists" className="text-white no-underline hover:text-purple-300">Lists</NavLink>
                            <NavLink to="/messages" className="text-white no-underline hover:text-purple-300">Messages</NavLink>
                            {isAdminOrMod && (
                                <NavLink to="/admin" className="text-white no-underline hover:text-purple-300">Admin</NavLink>
                            )}
                        </>
                    )}
                </nav>

                <div className="flex items-center ml-auto gap-3">
                    {currentUser ? (
                        <div ref={dropdownRef} className="relative">
                            <div onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-white cursor-pointer">
                                <img src={currentUser.imageUrl || '/user.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                <span>{currentUser.displayName}</span>
                            </div>
                            {dropdownOpen && (
                                <ul className="absolute right-0 top-12 bg-white rounded-lg p-2 min-w-44 shadow-lg list-none m-0 z-50">
                                    <li>
                                        <NavLink to={`/members/${currentUser.id}`}
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-3 py-2 text-gray-700 no-underline hover:bg-gray-100 rounded">
                                            Edit profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded bg-transparent border-none cursor-pointer">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="flex items-center gap-2 relative z-50">
                            <input type="text" placeholder="Email" value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="px-3 py-1.5 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/50 outline-none text-sm" />
                            <input type="password" placeholder="Password" value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="px-3 py-1.5 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/50 outline-none text-sm" />
                            <button type="submit" disabled={loading}
                                className="px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer border-none">
                                {loading ? '...' : 'Login'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </header>
    );
}