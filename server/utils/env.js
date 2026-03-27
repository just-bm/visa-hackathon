import "dotenv/config";

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

export { 
    PORT, 
    CORS_ORIGIN 
};