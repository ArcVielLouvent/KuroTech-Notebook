import rateLimit from "express-rate-limit";

export default rateLimit({
    windows: 10 * 10 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 10 minutes"
});