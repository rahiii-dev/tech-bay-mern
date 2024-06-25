import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || "fdsfdfgdfdf";

export const generateToken = (user, res) => {
    const token = jwt.sign({ id: user._id}, jwtSecret, {
        expiresIn: '1h'
    });

    res.cookie('token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000
    });
};

export const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

export const clearToken = (res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
}

