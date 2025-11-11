import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
    const {code, language} = req.body;
    try {
        const result = eval(code);
        res.json({result});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

export default router;