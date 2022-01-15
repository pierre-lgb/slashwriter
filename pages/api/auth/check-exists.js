import { Router } from "next/router";
import User from "../../../models/User";

export default async function handler(req, res) {
    if (req.method === "POST") {
        // Only check if either username or email is provided
        const filter = req.body.username ? { username: req.body.username } : req.body.email ? { email: req.body.email } : {}

        const user = await User.findOne(filter)
        res.status(200).json({
            exists: !!user
        })
    }
}