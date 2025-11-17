import React, {  useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { storesAPI } from "../services/api.js";
import { motion as Motion } from "framer-motion";
import { Star, Store, TrendingUp, Users } from "lucide-react";
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {

    const {user} = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStores: 0,
        totalRatings: 0,
        averageRating: 0,
        userRatings: 0
    })
    const [recentStores, setRecentStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        fetchDashboardData();
    },[]);

    const fetchDashboardData = async () => {
        try{
            const [storesResponse] = await Promise.all([
                storesAPI.get('/stores')
            ])
            const stores = storesResponse.data.stores;
            const userRatings = stores.filter(store => store.user_rating).length;
            const totalRatings = stores.reduce((sum, store) => sum + (store.total_ratings || 0), 0);
            const averageRating = stores.length > 0 ? stores.reduce((sum, store) => sum + parseFloat(store.average_rating || 0), 0)/ stores.length : 0;

            setStats({
                totalStores: stores.length,
                totalRatings,
                averageRating: parseFloat(averageRating.toFixed(1)),
                userRatings
            })

            const sortedStores = [...stores].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,5);

            setRecentStores(sortedStores)
        } catch (error) {
            console.log('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    const StatCard = ({ icon, label, value, color }) => {
        const Icon = icon;
        return (
            <Motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                className="glass-effect rounded-2xl p-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/60 text-sm font-medium">{label}</p>
                        <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon className='h-6 w-6 text-white'/>
                    </div>
                </div>
            </Motion.div>
        )
    }

    if(loading){
        return(
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size='lg' />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <Motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                className="text-center"
            >
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-white/60 text-lg">
                Here's what's happening with your store ratings</p>
            </Motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Store}
                    label="Total Stores"
                    value={stats.totalStores}
                    color="bg-blue-500/20"
                />
                <StatCard
                    icon={Star}
                    label="Your Ratings"
                    value={stats.userRatings}
                    color="bg-yellow-500/20"
                />
                <StatCard
                    icon={Users}
                    label="Total Ratings"
                    value={stats.totalRatings}
                    color="bg-green-500/20"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Avg. Rating"
                    value={stats.averageRating}
                    color="bg-purple-500/20"
                />
            </div>

            <Motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{delay: 0.2}}
                className="glass-effect rounded-2xl p-6"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Recent Stores</h2>
                <div className="space-y-4">
                    {recentStores.length > 0 ? (
                        recentStores.map((store, index) => (
                            <Motion.div
                                key={store.id}
                                initial={{opacity:0, x:-20}}
                                animate={{opacity:1, x:0}}
                                transition={{delay: index * 0.1}}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300"
                            >
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">{store.name}</h3>
                                    <p className="text-white/60 text-sm mt-1">{store.address}</p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="text-white font-semibold">
                                                {parseFloat(store.average_rating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                        <p className="text-white/60 text-xs">
                                        {store.total_ratings || 0} ratings</p>
                                    </div>
                                    {store.user_rating && (
                                        <div className="bg-primary-500/20 px-3 py-1 rounded-full">
                                            <span className="text-primary-200 text-sm font-medium">
                                                Your ratings: {store.user_rating}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Store className="h-12 w-12 text-white/40 mx-auto mb-4" />
                            <p className="text-white/60">No Stores available yet</p>
                        </div>
                    )}
                </div>
            </Motion.div>

            <Motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{delay: 0.3}}
                className="glass-effect rounded-2xl p-6"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Motion.button
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        onClick={() => navigate('/stores')}
                        className="p-6 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 text-left"
                    >
                        <Store className="h-8 w-8 text-white mb-3" />
                        <h3 className="text-white font-semibold text-lg">Browse Stores</h3>
                        <p className="text-white/60 mt-1">Discover and rate new stores</p>
                    </Motion.button>

                    <Motion.button
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        onClick={() => navigate('/profile')}
                        className="p-6 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 text-left"
                    >
                        <Users className="h-8 w-8 text-white mb-3" />
                        <h3 className="text-white font-semibold text-lg">Update Profile</h3>
                        <p className="text-white/60 mt-1">Manage your account settings</p>
                    </Motion.button>


                </div>
            </Motion.div>
        </div>
    )
};

export default Dashboard;

