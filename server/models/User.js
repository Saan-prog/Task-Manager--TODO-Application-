import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must contain atleast 3 characters"],
            maxlength: [50, "Name cannot exceed 50 characters" ],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowercase: true,
            match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address",
      ],
        },
        password: {
            type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return;  
    
    this.password = await bcrypt.hash(this.password, 10);
    // No next() call needed
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);