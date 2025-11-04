import { Request, Response } from "express";
import Bid from "../models/Bid";

export const getBids = async (req: Request, res: Response) => {
  const bids = await Bid.find();
  res.json(bids);
};

export const createBid = async (req: Request, res: Response) => {
  const bid = new Bid(req.body);
  await bid.save();
  res.json(bid);
};
