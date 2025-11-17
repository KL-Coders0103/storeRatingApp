import {body, validationResult} from 'express-validator';

export const handleValidateErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    next();
};

export const validateRegistration =[
    body('name')
    .notEmpty()
    .isLength({min: 5, max: 60})
    .withMessage('Name must be between 5 and 60 characters'),

    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid Email is required'),

    body('password')
    .isLength({min:8, max:16})
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must be 8-16 characters with uppercase and special character'),

    body('address')
    .isLength({max:400})
    .withMessage('Address connot exceed 400 characters'),

    body('role')
    .isIn(['user', 'store_owner'])
    .withMessage('Role must be either user or store_owner'),

    handleValidateErrors
];

export const validateStore = [
    body('name')
    .notEmpty()
    .withMessage('Store name is required')
    .isLength({min: 5, max:60})
    .withMessage('Store name must be between 5 and 60 characters'),

    body('email')
    .isEmail()
    .withMessage('Valid store email is required'),

    body('address')
    .isLength({max:400})
    .withMessage('Address connot exceed 400 characters'),

    handleValidateErrors
];