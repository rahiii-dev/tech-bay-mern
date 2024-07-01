import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        set: capitalize
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone_no : {
        type: String,
        trim: true,
        required : false
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isVerified : {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

function capitalize(val) {
    if (typeof val !== 'string') return '';
    return val.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
