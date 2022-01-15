import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "No user provided"],
        unique: true,
        minlength: [4, "Username length has to be 4 or more"]
    },
    email: {
        type: String,
        required: [true, "No email provided"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "No password provided"],
        minlength: [6, "Password length has to be 6 or more"]
    }
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    console.log(this.password)
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

// Static method to login user
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect Email")
}

export default mongoose.models.User || mongoose.model("User", UserSchema)