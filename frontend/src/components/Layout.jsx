import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Outlet ,useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Menu, Store, User, LogOut, X, TrendingUp, Star, Home, Shield, Users, Building } from 'lucide-react';
import {motion as Motion, AnimatePresence} from 'framer-motion';

const Layout = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard', 
            href:"/app/dashboard", 
            icon: LayoutDashboard
        },
        {
            name: 'Stores',
            href: "/app/stores",
            icon: Store
        },
        ...(user?.role === 'store_owner' ) ? [
            {
                name: 'Store Dashboard',
                href: "/app/store-owner/dashboard",
                icon: TrendingUp
            },
            {
                name: 'Store Ratings',
                href: "/app/store-owner/ratings",
                icon: Star
            }
        ] : [],
        ...(user?.role === 'admin' ? [
            { 
                name: 'Admin Dashboard', 
                href: '/app/admin/dashboard', 
                icon: Shield 
            },
            { 
                name: 'Manage Users', 
                href: '/app/admin/users', 
                icon: Users 
            },
            { 
                name: 'Manage Stores', 
                href: '/app/admin/stores', 
                icon: Building 
            }
        ] : []),
        {
            name: 'Profile',
            href: '/app/profile',
            icon: User
        }
    ]

    const handleLogout = async () => {
        await logout(),
        navigate('/')
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className='min-h-screen bg-linear-to-br from-purple-600 via-blue-600 to-cyan-500'>
            <div className='hidden lg:fixed lg:inset-y-0 lg:w-64 lg:flex lg:flex-col'>
                <div className='glass-effect flex flex-col flex-1 min-h-0 rounded-r-r3xl m-4'>
                    <div className='flex-1 flex flex-col pt-8 pb-4 overflow-y-auto'>
                        <div className='flex items-center justify-center px-4 mb-8'>
                            <Motion.div
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                className='flex items-center space-x-3'
                            >
                                <Store className='h-8 w-8 text-white' />
                                <h1 className='text-2xl font-bold text-white'>RateStore</h1>
                            </Motion.div>
                        </div>
                        <nav className='mt-8 flex-1 px-4 space-y-2'>
                            {navigation.map((item) =>{
                                const Icon = item.icon
                                return (
                                    <Motion.button
                                        key={item.name}
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale:0.98}}
                                        onClick={() => navigate(item.href)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                            isActive(item.href)
                                            ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <Icon className='mr-3 h-5 w-5' />
                                            {item.name}
                                    </Motion.button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className='flex shrink-0 border-t border-white/20 p-4'>
                        <div className='flex items-center w-full'>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-white truncate'>{user?.name}</p>
                                <p className='text-sm text-white/60 truncate capitalize'>{user?.role}</p>
                            </div>
                            <Motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={handleLogout}
                                className='ml-4 p-2 text-white/70 hover:text-white transition-colors duration-300'                           
                            >
                                <div className='flex items-center gap-2 cursor-pointer'>
                                    <LogOut  size={18} />
                                    <span>LogOut</span>
                                </div>
                            </Motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='lg:hidden'>
                <div className='glass-effect m-4 rounded-2xl'>
                    <div className='flex items-center justify-between p-4'>
                        <div className='h-6 w-6 text-white'>
                            <h1 className='text-xl font-bold text-white'>RateStore</h1>
                        </div>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='text-white p-2'>
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className='h-6 w-6'/>}
                        </button>
                    </div>

                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <Motion.div
                                initial={{opacity: 0, height:0}}
                                animate={{opacity: 1, height:'auto'}}
                                exit={{opacity: 0, height:0}}
                                className='px-4 pb-4 space-y-2'
                            >
                                {navigation.map((item) =>{
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            navigate(item.href)
                                            setMobileMenuOpen(false)
                                        }}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                            isActive(item.href)
                                            ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <Icon className='mr-3 h-5 w-5' />
                                            {item.name}
                                    </button>
                                );
                            })}

                            <div className='py-2 border-t border-white/20'>
                                <div className='flex items-center justify-between px-4 py-2'>
                                    <div>
                                        <p className='text-sm font-medium text-white'>{user?.name}</p>
                                        <p className='text-xs text-white/60 capitalize'>{user?.role}</p>
                                    </div>

                                    <button onClick={handleLogout}
                                    className='p-2 text-white/70 hover:text-white transition-colors duration-300'>
                                        <div className='flex items-center gap-2 cursor-pointer'>
                                        <LogOut  size={18} />
                                        <span>LogOut</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </Motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className='lg:pl-72'>
                <main className='py-6 px-4 sm:px-6 lg:px-8'>
                    <AnimatePresence mode="wait">
                        <Motion.div
                            key={location.pathname}
                            initial={{opacity:0, y:20}}
                            animate={{opacity: 1, y:0}}
                            exit={{opacity:0, y:-20}}
                            transition={{duration: 0.3}}
                        >
                            <Outlet />
                        </Motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}

export default Layout