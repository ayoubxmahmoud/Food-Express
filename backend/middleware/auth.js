import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized, please login again!" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.id; // Attach userId directly to req object
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ success: false, message: "Token expired" });
    }
    console.log(error);
    res.status(403).json({ success: false, message: "Invalid token, authorization failed" });
  }
};

export default authMiddleware;
