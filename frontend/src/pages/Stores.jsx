import React, { useEffect, useState, useCallback } from "react";
import { ratingAPI, storesAPI } from "../services/api.js";
import { AnimatePresence, motion as Motion } from "framer-motion";
import RatingStars from "../components/RatingStars.jsx"
import LoadingSpinner from "../components/Loadingspinner.jsx";
import { Filter, MapPin, Search, Star } from "lucide-react";

const Stores = () => {

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [ratingStore, setRatingStore] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const fetchStores = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if(searchTerm) params.append('search', searchTerm);
            params.append('sortBy', sortBy); 
            params.append('sortOrder', sortOrder);

            const response = await storesAPI.get(`/stores?${params}`);
            setStores(response.data.stores)
        } catch(error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false)
        }
    },[searchTerm, sortBy,sortOrder]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores();
    };

    const handleRateStore = (store) => {
        setRatingStore(store)
        setUserRating(store.user_rating || 0);
    };

    const submitRating = async () => {
        if(!ratingStore || !userRating) return

        setSubmitting(true);
        try{
            await ratingAPI.post('/ratings', {
                storeId: ratingStore.id,
                rating: userRating
            });

            await fetchStores();
            setRatingStore(null);
            setUserRating(0);
        } catch(error) {
            console.error("error submitting ratings:", error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchStores() 
    },[fetchStores]);

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StoreCard = ({store, index}) => (
        <Motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{delay: index*0.1}}
            className="glass-effect rounded-2xl p-6 card-hover"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{store.name}</h3>
                    <div className="flex items-center text-white/60 mb-3">
                        <MapPin className="h-4 w-4 mr-1"/>
                        <span className="text-sm">{store.address}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <span className="text-white font-semibold">
                                    {parseFloat(store.average_rating || 0).toFixed(1)}
                                </span>
                            </div>
                            <span className="text-white/60 text-sm">
                                ({store.total_ratings || 0} ratings)
                            </span>
                        </div>

                        {store.user_rating && (
                            <div className="bg-primary-500/20 px-3 py-1 rounded-full">
                                <span className="text-primary-200 text-sm font-medium">
                                    Your Rating: {store.user_rating}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <Motion.button
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    onClick={() => handleRateStore(store)}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                    <Star className="h-4 w-4"/>
                    <span>{store.user_rating ? 'Update Rating' : 'Rate Store'}</span>
                </Motion.button>
            </div>
        </Motion.div>
    );

    return (
        <div className="space-y-6">
            <Motion.div
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y:0}}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white">Stores</h1>
                    <p className="text-white/60 mt-2">Discover and rate stores in your area</p>
                </div>
            </Motion.div>

            <Motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{delay: 0.1}}
                className="glass-effect rounded-2xl p-6"
            >
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                            <input 
                                type="text"
                                placeholder="Search Stores by name or address"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pr-4 pl-10"
                            />
                        </div>
                        <button type="submit" className="btn-primary whitespace-nowrap">
                            Search
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center ">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-white/60"/>
                            <span className="text-white text-sm font-medium">Sort by:</span>
                        </div>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto">
                            <option className='text-black'  value="name">Name</option>
                            <option className='text-black'  value="average_rating">Rating</option>
                            <option className='text-black'  value="created_at">Date Added</option>
                        </select>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-field w-auto">
                            <option className='text-black'  value="asc">Ascending</option>
                            <option className='text-black'  value="desc">Descending</option>
                        </select>
                    </div>
                </form>
            </Motion.div>

            {loading ? (
                <div className="flex items-center justify-center min-h-96">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <Motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.2}}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredStores.map((store, index) => (
                            <StoreCard key={store.id} store={store} index={index}/>
                        ))}
                    </AnimatePresence>
                </Motion.div>
            )}

            {!loading && filteredStores.length === 0 && (
                <Motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="text-center py-12"
                >
                    <Search className="h-16 w-16 text-white/40 mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold text-white mb-2">No Stores found</h3>
                    <p className="text-white/60">Try Adjusting your search criteria</p>
                </Motion.div>
            )}

            <AnimatePresence>
            {ratingStore && (
                <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                onClick={() => setRatingStore(null)}
                >
                <Motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-linear-to-br from-gray-800 to-gray-900 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Rate This Store</h3>
                    <p className="text-white/70 text-lg font-semibold">{ratingStore.name}</p>
                    <p className="text-white/50 text-sm mt-1">{ratingStore.address}</p>
                    </div>
                    <div className="mb-8">
                    <p className="text-white/80 text-center mb-4 text-lg">
                        How would you rate your experience?
                    </p>

                    <div className="flex justify-center mb-4">
                        <RatingStars
                        rating={userRating}
                        onRatingChange={setUserRating}
                        interactive={true}
                        size="lg"
                        />
                    </div>

                    {userRating > 0 && (
                        <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                        >
                        <p className="text-yellow-400 font-semibold text-lg">
                            {userRating} star{userRating > 1 ? 's' : ''} selected
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                            {userRating === 5 && 'Excellent! ✨'}
                            {userRating === 4 && 'Very Good! 👍'}
                            {userRating === 3 && 'Good! 😊'}
                            {userRating === 2 && 'Fair 👌'}
                            {userRating === 1 && 'Poor 😔'}
                        </p>
                        </Motion.div>
                    )}

                    <div className="flex justify-between text-white/50 text-xs mt-4 px-2">
                        <span>Poor</span>
                        <span>Fair</span>
                        <span>Good</span>
                        <span>Very Good</span>
                        <span>Excellent</span>
                    </div>
                    </div>

                    <div className="flex space-x-3">
                    <button 
                        onClick={() => setRatingStore(null)} 
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button 
                        onClick={submitRating} 
                        disabled={!userRating || submitting}
                        className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        {submitting ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                        </div>
                        ) : (
                        'Submit Rating'
                        )}
                    </button>
                    </div>

                    <p className="text-white/40 text-xs text-center mt-4">
                    Click on the stars to select your rating
                    </p>
                </Motion.div>
                </Motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default Stores;