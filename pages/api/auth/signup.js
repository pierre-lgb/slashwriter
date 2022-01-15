import User from "../../../models/User";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password, username } = req.body;

        // Creating User
        const user = new User({ username, email, password })
        user.save()
            .then(() => {
                res.status(201).json({ email, password })
            })
            .catch((err) => {
                if (err.name == 'ValidationError') {
                    res.status(422).json(err);
                } else {
                    res.status(500).json(err);
                }
            })

    }
}