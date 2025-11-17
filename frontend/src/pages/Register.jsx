import React, { useState } from "react";
import {useAuth} from '../contexts/AuthContext.js'
import LoadingSpinner from '../components/Loadingspinner.jsx'
import {motion as Motion} from 'framer-motion';
import {Link, useNavigate} from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Store, User, Building } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user',
        storeName: '',
        storeEmail: '',
        storeAddress: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const {register} = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {

        const errors = {}
        if(formData.name.length < 5 || formData.name.length > 60 ){
            errors.name = 'Name must be between 5 and 60 characters'
        }

        if(formData.address.length > 400){
            errors.address = 'Address cannot exceed 400 characters'
        }

        if(formData.password.length < 8 || formData.password.length > 16){
            errors.password = 'Password must be 8-16 characters'
        } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)){
            errors.password = 'Password must include uppercase and special characters'
        }

        if (formData.role === 'store_owner') {
            if (!formData.storeName.trim()) {
                errors.storeName = 'Store name is required'
            } else if (formData.storeName.length < 5 || formData.storeName.length > 60) {
                errors.storeName = 'Store name must be between 5 and 60 characters'
            }

            if (!formData.storeEmail.trim()) {
                errors.storeEmail = 'Store email is required'
            } else if (!/^\S+@\S+\.\S+$/.test(formData.storeEmail)) {
                errors.storeEmail = 'Valid store email is required'
            }

            if (!formData.storeAddress.trim()) {
                errors.storeAddress = 'Store address is required'
            } else if (formData.storeAddress.length > 400) {
                errors.storeAddress = 'Store address cannot exceed 400 characters'
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
        if(validationErrors[e.target.name]){
            setValidationErrors(prev => ({
                ...prev,
                [e.target.name]:''
            }))
        }
    }

    const handleRoleChange = (role) => {
        setFormData(prev => ({
        ...prev,
        role,
        ...(role === 'user' && {
            storeName: '',
            storeEmail: '',
            storeAddress: ''
        })
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()){
            return
        }
        setLoading(true);
        setError('');

        const registrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            address: formData.address,
            role: formData.role
        }

        if (formData.role === 'store_owner') {
            registrationData.storeName = formData.storeName
            registrationData.storeEmail = formData.storeEmail
            registrationData.storeAddress = formData.storeAddress
        }
        console.log('Sending registration data:', registrationData)
        try {
        const result = await register(registrationData);

        if(result.success){
            navigate('/dashboard')
        } else {
            setError(result.error)
        }
        } catch (error) {
            console.error('Registration error:', error)
            setError('Registration failed. Please check the console for details.')
        } finally {
        setLoading(false)
    }
}

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{duration: 0.5}}
                className="max-w-md w-full space-y-6"
            >
                <div className="text-center">
                    <Motion.div
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        transition={{delay: 0.2, type:"spring", stiffness:200}}
                        className="mx-auto flex items-center justify-center h-16 w-16 bg-white/20 rounded-full"
                    >
                        <Store className="h-8 w-8 text-white"/>
                    </Motion.div>
                    <Motion.h2
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{delay: 0.3}}
                        className="mt-6 text-3xl font-extrabold text-white"
                    >
                        Create Account
                    </Motion.h2>
                    <Motion.p
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{delay: 0.4}}
                        className="mt-2 text-sm text-white/60"
                    >
                        Join RateStore to start rating stores
                    </Motion.p>
                </div>

                <Motion.form
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{delay: 0.5}}
                        className="glass-effect rounded-3xl p-8 space-y-6"
                        onSubmit={handleSubmit}
                    >
                        {error && (
                            <Motion.div
                                initial={{opacity:0, scale: 0.95}}
                                animate={{opacity:1, scale: 1}}
                                className="bg-red-500/20 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm"
                            >
                                {error}
                            </Motion.div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-white mb-3">
                            Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                            <Motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleChange('user')}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                formData.role === 'user' 
                                    ? 'border-accent-500 bg-accent-500/20' 
                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <User className="h-6 w-6 text-white mb-2" />
                                <h4 className="font-semibold text-white">Customer</h4>
                                <p className="text-white/60 text-xs mt-1">
                                Rate and review stores
                                </p>
                            </Motion.button>

                            <Motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleChange('store_owner')}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                formData.role === 'store_owner' 
                                    ? 'border-accent-500 bg-accent-500/20' 
                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <Building className="h-6 w-6 text-white mb-2" />
                                <h4 className="font-semibold text-white">Store Owner</h4>
                                <p className="text-white/60 text-xs mt-1">
                                Manage your store and ratings
                                </p>
                            </Motion.button>
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                  {formData.role === 'store_owner' ? 'Owner Information' : 'Personal Information'}  
                                </h3>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                               {formData.role === 'store_owner' ? 'Owner Name' : 'Full Name'} ({formData.name.length}/60)   
                            </label>
                            <input type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder={
                                formData.role === 'store_owner'
                                ? 'Enter your full name as store owner'
                                : 'Enter your full name'
                            }
                            minLength={5}
                            maxLength={60} />
                            {validationErrors.name && (
                                <p className="mt-1 text-sm text-red-300">{validationErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email Address</label>
                            <input type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter your email" />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
                                {formData.role === 'store_owner' ? 'Owner Address' : 'Address'} ({formData.address.length}/400)
                            </label>
                            <textarea
                            id="address"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="input-field resize-none"
                            placeholder={
                                formData.role === 'store_owner'
                                ? 'enter your personal address'
                                : 'enter your address'
                            }
                            maxLength={400} />
                            {validationErrors.address && (
                                <p className="mt-1 text-sm text-red-300">{validationErrors.address}</p>
                            )}
                        </div>

                        {formData.role === 'store_owner' && (
                            <Motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="border-t border-white/20 pt-6"
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">Store Information</h3>
                                
                                <div>
                                    <label htmlFor="storeName" className="block text-sm font-medium text-white mb-2">
                                    Store Name *
                                    </label>
                                    <input
                                    id="storeName"
                                    name="storeName"
                                    type="text"
                                    required
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter your store name"
                                    minLength={2}
                                    maxLength={100}
                                    />
                                    {validationErrors.storeName && (
                                    <p className="mt-1 text-sm text-red-300">{validationErrors.storeName}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="storeEmail" className="block text-sm font-medium text-white mb-2">
                                    Store Email *
                                    </label>
                                    <input
                                    id="storeEmail"
                                    name="storeEmail"
                                    type="email"
                                    required
                                    value={formData.storeEmail}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="store@example.com"
                                    />
                                    {validationErrors.storeEmail && (
                                    <p className="mt-1 text-sm text-red-300">{validationErrors.storeEmail}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="storeAddress" className="block text-sm font-medium text-white mb-2">
                                    Store Address * ({formData.storeAddress.length}/400)
                                    </label>
                                    <textarea
                                    id="storeAddress"
                                    name="storeAddress"
                                    required
                                    value={formData.storeAddress}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-field resize-none"
                                    placeholder="Enter your store address"
                                    maxLength={400}
                                    />
                                    {validationErrors.storeAddress && (
                                    <p className="mt-1 text-sm text-red-300">{validationErrors.storeAddress}</p>
                                    )}
                                </div>
                            </Motion.div>
                        )}
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field pr-10"
                                placeholder="Enter your password" />

                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="mt-1 text-sm text-red-300">{validationErrors.password}</p>
                            )}
                            <p className="mt-1 text-xs text-white/60">8-16 characters with uppercase and special character required</p>
                        </div>
                        </div>

                        <Motion.button
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm"/>
                            ): (
                                <UserPlus className="h-5 w-5"/>
                            )}
                            <span>{loading ? 'Creating account...' : `Sign up as ${formData.role === 'store_owner' ? 'Store Owner' : 'Customer'}`}</span>
                        </Motion.button>

                        <div className="text-center">
                            <span className="text-white/60 text-sm">Alrrady have an account</span>
                            <Link
                                to="/login"
                                className="text-accent-300 hover:text-accent-200 font-medium text-sm transition-colors"
                            >
                                Sign in
                            </Link>
                        </div>
                    </Motion.form>
            </Motion.div>
        </div>
    );
};

export default Register