import express from "express";
import { getBids, createBid } from "../controllers/bidController";
const router = express.Router();

router.get("/", getBids);
router.post("/", createBid);

export default router;