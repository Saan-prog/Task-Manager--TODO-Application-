import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [50, "Title cannot exceed 50 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [300, "Description cannot exceed 300 characters"],
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
        dueDate: {
            type: Date,
            default: null,
            validate: {
                validator: function(value) {
                    // Allow null/undefined (optional due date)
                    if (!value) return true;
                    
                    // Compare only dates, not times
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const dueDateOnly = new Date(value);
                    dueDateOnly.setHours(0, 0, 0, 0);
                    
                    // For new tasks: due date cannot be in the past
                    // For existing tasks: due date can be any date (remove this check for updates)
                    if (this.isNew) {
                        return dueDateOnly >= today;
                    }
                    
                    // For updates, allow any date
                    return true;
                },
                message: "Due date cannot be in the past"
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model("Task", taskSchema);