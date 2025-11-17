import React, { useEffect, useState } from "react";
import {useAuth} from '../contexts/AuthContext.js'
import { storesAPI } from "../services/api.js";
import {motion as Motion} from 'framer-motion';
import LoadingSpinner from '../components/Loadingspinner.jsx';
import {BarChart3, Calendar, Star, TrendingUp, Users, Plus, Store} from 'lucide-react';

const StoreOwnerDashboard = () => {

    const {user} = useAuth();
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchDashboardData = async () => {
        try {
            const response = await storesAPI.get('/store-owner/dashboard')
            setDashboardData(response.data)
        } catch (error) {
            if(error.response?.status === 404){
                setDashboardData(null)
            } else {
                console.error('Error fetching store owner dashboard', error)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, [])

    const RatingDistribution = ({distribution}) => {
        const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

        return (
            <div className="space-y-2">
                {[5,4,3,2,1].map(rating =>(
                    <div key={rating} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 w-16">
                            <span className="text-white font-medium w-4">{rating}</span>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>

                        <div className="flex-1 bg-white/10 rounded-full h-3">
                            <div className="bg-linear-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500" style={{
                                width: total > 0 ? 
                                `${(distribution[rating] / total) * 100}%` : '0%'}}/>
                            </div>
                            <span className="text-white/60 text-sm w-8">
                                {distribution[rating]}
                            </span>
                    </div>
                ))}
            </div>
        );
    };
    

    const RecentRatingCard = ({rating}) => (
        <Motion.div
            initial={{opacity: 0, x:-20}}
            animate={{opacity: 1, x:0}}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300"
        >
            <div className="flex-1">
                <h4 className="font-semibold text-white">{rating.user_name}</h4>
                <p className="text-white/60 text-sm">{rating.user_email}</p>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold text-lg">{rating.rating}</span>
                </div>

                <div className="text-right">
                    <p className="text-white/60 text-xs">
                    {new Date(rating.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        </Motion.div>
    )

    if (loading){
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if(!loading && !dashboardData) {
        return (
            <div className="text-center py-12">
                <Store className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Stores found</h3>
                <p className="text-white/60">Your store information could not be loaded. Please contact support.</p>
            </div>
        );
    };

    const {store, recentRatings, ratingDistribution, stats} = dashboardData;

    return (
        <div className="space-y-8">
            <Motion.div
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y:0}}
                className="text-center"
            >
                <h1 className="text-4xl font-bold text-white mb-2">
                    Store Dashboard
                </h1>
                <p className="text-white/60 text-lg">
                    Welcome back, {user?.name}. Here's your store performance
                </p>
            </Motion.div>

            <Motion.div
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y:0}}
                transition={{delay: 0.1}}
                className="glass-effect rounded-2xl p-6"
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">{store.name}</h2>
                        <p className="text-white/60 mb-4">{store.address}</p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <span className="text-white font-semibold text-xl">
                                    {store.average_rating}
                                </span>
                                <span className="text-white/60">Average 
                                Rating</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-400 " />
                                <span className="text-white font-semibold text-xl">
                                    {stats.totalRatings}
                                </span>
                                <span className="text-white/60">Total 
                                Ratings</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6">
                        <div className="bg-linear-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl text-center">
                            <span className="text-white font-bold text-2xl">
                                {store.average_rating} /5
                            </span>
                            <p className="text-white/90 text-sm">Overall Score</p>
                        </div>
                    </div>
                </div>
            </Motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Motion.div
                    initial={{opacity: 0, x:-20}}
                    animate={{opacity:1, x:0}}
                    transition={{delay: 0.2}}
                    className="glass-effect rounded-2xl p-6"
                >
                    <div className="flex items-center space-x-2 mb-6">
                        <BarChart3 className="h-5 w-5 text-white" />
                        <h3 className="text-xl font-bold text-white">Rating Distribution</h3>
                    </div>
                    <RatingDistribution distribution={ratingDistribution} />
                </Motion.div>

                <Motion.div
                    initial={{opacity: 0, x:20}}
                    animate={{opacity:1, x:0}}
                    transition={{delay: 0.2}}
                    className="glass-effect rounded-2xl p-6"
                >
                    <div className="flex items-center space-x-2 mb-6">
                        <TrendingUp className="h-5 w-5 text-white"/>
                        <h3 className="text-xl font-bold text-white">Performance Insights</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">Average Rating</span>
                            <span className="text-white font-semibold">{store.average_rating}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">Total Ratings</span>
                            <span className="text-white font-semibold">{stats.totalRatings}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">5-Star Rating</span>
                            <span className="text-white font-semibold">{ratingDistribution[5]}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">Response Rate</span>
                            <span className="text-green-400 font-semibold">100&</span>
                        </div>
                    </div>
                </Motion.div>
            </div>

            <Motion.div
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y:0}}
                transition={{delay: 0.3}}
                className="glass-effect rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-white"/>
                        <h3 className="text-xl font-bold text-white">Recent Ratings</h3>
                    </div>
                    <span className="text-white/60 text-sm">
                    Last {recentRatings.length} ratings</span>
                </div>

                <div className="space-y-3">
                    {recentRatings.length > 0 ? (
                        recentRatings.map((rating, index) => (
                            <RecentRatingCard key={index} rating={rating} />
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Star className="h-12 w-12 text-white/40 mx-auto mb-4"/>
                            <p className="text-white/60">No ratings yet for your store</p>
                            <p className="text-white/40 text-sm mt-1">
                                Ratings will apear here once customers start reviewing your store
                            </p>
                        </div>
                    )}
                </div>
            </Motion.div>

            <Motion.div
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y:0}}
                transition={{delay: 0.4}}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="glass-effect rounded-2xl p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-white font-semibold text-lg mb-2">Store Performance</h4>
                    <p className="text-white/60 text-sm">Monitor how customer are rating your store over time</p>
                </div>

                <div className="glass-effect rounded-2xl p-6 text-center">
                    <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-white font-semibold text-lg mb-2">Customer Feedback</h4>
                    <p className="text-white/60 text-sm">See what your customers are saying about their experience</p>
                </div>
            </Motion.div>
        </div>
    );
};

export default StoreOwnerDashboard;