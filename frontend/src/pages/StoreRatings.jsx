import React, { useCallback, useEffect, useState } from "react";
import { storesAPI } from "../services/api.js";
import { motion as Motion } from "framer-motion";
import LoadingSpinner from "../components/Loadingspinner.jsx";
import { Calendar, Filter, Mail, MapPin, Search, Star } from "lucide-react";

const StoreRatings = () => {

    const [ratings, setRatings] = useState([]);
    const [loading,setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters,setFilters] = useState({
        page:1,
        limit:10,
        sortBy: 'created_at',
        sortOrder: 'desc'
    });

    const fetchRatings = useCallback (async () => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                params.append(key, value)
            })    
            const response = await storesAPI.get(`/store-owner/ratings?${params}`)
            setRatings(response.data.ratings);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching store ratings', error)
        } finally {
            setLoading(false)
        }
    },[filters]);

    useEffect(() => {
        fetchRatings()
    },[fetchRatings]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            ...(key !== 'page' && {page: 1})
        }))
    }

    const RatingCard = ({rating, index}) => (
        <Motion.div
            initial={{opacity: 0, y:20}}
            animate={{opacity: 1, y:0}}
            transition={{delay: index * 0.1}}
            className="glass-effect roundex-2xl p-6 hover:bg-white/10 transition-all duration-300"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-1">
                            <Star className="h-6 w-6 text-yellow-400 fill-current"/>
                            <span className="text-white font-bold text-xl">
                                {rating.rating}
                            </span>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold text-lg">{rating.user_name}</h4>
                            <div className="flex items-center space-x-2 text-white/60 text-sm mt-1">
                                <Mail className="h-4 w-4"/>
                                <span>{rating.user_email}</span> 
                            </div>

                            {rating.user_address && (
                                <div className="flex items-center space-x-2 text-white/60 text-sm mt-1">
                                    <MapPin className="h-4 w-4"/>
                                    <span className="truncate">{rating.user_address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:text-right mt-4 lg:mt-0 lg:ml-4">
                    <div className="flex items-center space-x-1 text-white/60 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(rating.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
                {[1,2,3,4,5].map(star => (
                    <div key={star} className={`w-8 h-2 rounded-full transition-all duration-300 ${star <= rating.rating ? 'bg-yellow-400' : 'bg-white/20'}`}>
                    </div>
                ))}
            </div>
        </Motion.div>
    )

    return (
        <div className="space-y-6">
            <Motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                className="flec flex-col lg:flex-row lg:items-center lg:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white">Customer Ratings</h1>
                    <p className="text-white/60 mt-2">
                        View all ratings and feedback for your store
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    <div className="flex items-center space-x-2 text-white/60">
                        <Filter className="h-4 w-4" />
                        <span>Sortby:</span>
                    </div>

                    <select value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)} className="input-field w-auto"
                    >
                        <option className='text-black' value="created_at">Date</option>
                        <option className='text-black' value="rating">Rating</option>
                    </select>

                    <select value={filters.sortOrder} 
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)} className="input-field w-auto"
                    >
                        <option className='text-black' value="desc"> Newest First</option>
                        <option className='text-black' value="asc">Oldest First</option>
                    </select>
                </div>
            </Motion.div>

            {!loading && (
                <Motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    className="glass-effect rounded-2xl p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-yellow-400"/>
                            <span className="text-white font-semibold">
                                {pagination.totalRatings || 0} Total Ratings
                            </span>
                        </div>
                        {pagination.totalPages > 1 && (
                            <span className="text-white/60 text-sm">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                        )}
                    </div>
                </Motion.div>
            )}

            { loading ? (
                <div className="flex items-center justify-center min-h-96">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <Motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    className="space-y-4"
                >
                    {ratings.length > 0 ? (
                        ratings.map((rating, index) => (
                            <RatingCard key={index} rating={rating} index={index} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Star className="h-16 w-16 text-white/40 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Ratings yet</h3>
                            <p className="text-white/60">
                                Customer ratings will appear here once they start reviewing your store
                            </p>
                        </div>
                    )}
                </Motion.div>
            )}

            {!loading && pagination.totalPages > 1 && (
                <Motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    className="flex justify-center items-center space-x-4"
                >
                    <button
                        onClick={()=> handleFilterChange('page', pagination.currentPage -1)} disabled={!pagination.hasPrev}
                        className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="text-white/60 text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}</span>

                    <button
                        onClick={()=> handleFilterChange('page', pagination.currentPage +1)} disabled={!pagination.hasNext}
                        className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </Motion.div>
            )}
        </div>
    );
};

export default StoreRatings;