import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { motion as Motion } from "framer-motion";
import LoadingSpinner from "../components/Loadingspinner.jsx";
import { CheckCircle, Eye, EyeOff, Shield, User } from "lucide-react";


const PasswordField = ({label, name, value, show, error,onChange, onToggle}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-white mb-2">{label}</label>
        <div className="relative">
            <input 
                id={name}
                name={name}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                className="input-field pr-10"
                placeholder={`Enter ${label.toLowerCase()}`}
            />

            <button
                type="button"
                onClick={() => onToggle(name)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-wgite/60 hover:text-white transition-colors"
            >
                {show ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
            </button>
        </div>
        {error && (
            <p className="mt-1 text-sm text-red-300">{error}</p>
        )}
    </div>
);

const Profile = () => {

    const {user, updatePassword} = useAuth();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({})

    const validatePassword = (password) => {
        if(password.length < 8 || password.length > 16){
            return 'Password must be 8-16 characaters'
        }

        if(!/(?=.*[A-Z])/.test(password)){
            return 'Password must include at least one uppercase letter'
        }

        if(!/(?=.*[!@#$%^&*])/.test(password)){
            return 'Password must include at least one special character'
        }

        return ''
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
        setMessage('');

        if(errors[name]){
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }

        if(name === 'newPassword') {
            const error = validatePassword(value)
            if(error){
                setErrors(prev => ({
                    ...prev,
                    newPassword: error
                }))
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const newErrors = {};

        if(!passwordData.currentPassword){
            newErrors.currentPassword = 'current password is required'
        }

        const passwordError = validatePassword(passwordData.newPassword);
        if(passwordError){
            newErrors.newPassword = passwordError;
        }

        if(passwordData.newPassword !== passwordData.confirmPassword){
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if(Object.keys(newErrors).length >0 ){
            setErrors(newErrors);
            setLoading(false);
            return
        }

        const result = await updatePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        })

        if(result.success){
            setMessage('Password updated successfully');
            setPasswordData({
                currentPassword:'',
                newPassword: '',
                confirmPassword: ''
            })
            setErrors({})
        } else {
            setErrors({currentPassword: result.error})
        }

        setLoading(false);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Motion.div
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                className="text-center"
            >
                <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-4">
                    <User className="h-10 w-10 text-white"/>
                </div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-white/60 mt-2">Manage your account information and security</p>
            </Motion.div>

            <Motion.div
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{delay: 0.1}}
                className="glass-effect rounded-2xl p-6"
            >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Perosnal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">
                            Full Name
                        </label>
                        <p className="text-white font-semibold">{user?.name}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">
                            Email Address
                        </label>
                        <p className="text-white font-semibold">{user?.email}</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/60 mb-1">
                            Role
                        </label>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/20">
                            <span className="text-primary-200 font-medium capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>
            </Motion.div>

            <Motion.div
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{delay: 0.2}}
                className="glass-effect rounded-2xl p-6"
            >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Change Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <Motion.div
                            initial={{opacity:0, scale: 0.95}}
                            animate={{opacity:1, scale:1}}
                            className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl flex items-center space-x-2"
                        >
                            <CheckCircle className="h-5 w-5" />
                            <span>{message}</span>
                        </Motion.div>
                    )}

                    <PasswordField
                        label="Current Password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        show={showPassword.current}
                        error={errors.currentPassword}
                        onChange={handlePasswordChange}
                        onToggle={() => togglePasswordVisibility('current')}
                    />

                    <PasswordField
                        label="New Password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        show={showPassword.new}
                        error={errors.newPassword}
                        onChange={handlePasswordChange}
                        onToggle={() => togglePasswordVisibility('new')}
                    />

                    <PasswordField
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        show={showPassword.confirm}
                        error={errors.confirmPassword}
                        onChange={handlePasswordChange}
                        onToggle={() => togglePasswordVisibility('confirm')}
                    />

                    <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="text-white font-semibold mb-2">Password Requirements</h4>
                        <ul className="text-white/60 text-sm space-y-1 ">
                            <li>• 8-16 characters long</li>
                            <li>• At least one uppercase letter (A-Z)</li>
                            <li>• At least one special character (!@#$%^&*)</li>
                        </ul>
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
                        ) : (
                            <Shield className="h-5 w-5"/>
                        )}
                        <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
                    </Motion.button>
                </form>
            </Motion.div>
        </div>
    );


};

export default Profile;