import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "fdsfdfgdfdf";

export const generateAccesToken = (userID, res) => {
  const token = jwt.sign({ id: userID }, jwtSecret, {
    expiresIn: "15m",
  });
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
    sameSite: 'None',
    // domain: process.env.CLIENT_ORIGIN, 
  });

  return token;
};

export const generateToken = (userID, res) => {
  generateAccesToken(userID, res)
  const refreshToken = jwt.sign({ id: userID}, jwtSecret, {
    expiresIn: "7d",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'None',
    // domain: process.env.CLIENT_ORIGIN, 
  });
};



export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const clearToken = (res) => {
  res.clearCookie('token');
  res.clearCookie('refresh_token');
};
