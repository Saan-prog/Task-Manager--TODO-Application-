import Task from "../models/Task.js";


export const createTask = async(req, res, next) => {
    try {
        const {title, description, dueDate, status} = req.body;

         if (!title || title.trim() === '') {
            return res.status(400).json({ message: "Title is required" });
        }
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const taskData = {
            title,
            description,
            user: req.user._id,
        };

        if(status) {
            taskData.status = status;
        }

        if (dueDate && dueDate !== "") {
            const parsedDate = new Date(dueDate);
            if (!isNaN(parsedDate.getTime())) {
                // Set to midnight for consistent date comparison
                parsedDate.setHours(0, 0, 0, 0);
                taskData.dueDate = parsedDate;
            }
        }

        const task = await Task.create(taskData);
        

        console.log("Task created successfully:", task);
        res.status(200).json(task);

        
    } catch (error) {
         console.error("Create task error:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        next(error);
    }
}

export const getTasks = async(req, res, next) => {
    try {
    const {status} = req.query;

    let filter = { user: req.user._id };

    if(status) {
         filter.status = status;
    }

    const task = await Task.find(filter).sort({ createdAt : -1 });
    return res.status(200).json(task);
    } catch (error) {
       next(error);
    }
}

export const getTaskbyId = async(req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

export const updateTask = async(req, res, next) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const taskId = req.params.id;
        
        // First, get the existing task
        const existingTask = await Task.findOne({ _id: taskId, user: req.user._id });
        
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        
        // Build update object
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        
        // Handle dueDate specially for updates
        if (dueDate !== undefined) {
            if (dueDate === "" || dueDate === null) {
                updateData.dueDate = null;
            } else {
                const parsedDate = new Date(dueDate);
                if (!isNaN(parsedDate.getTime())) {
                    parsedDate.setHours(0, 0, 0, 0);
                    updateData.dueDate = parsedDate;
                }
            }
        }
        
        // Skip validation for dueDate during update (or handle separately)
        const task = await Task.findOneAndUpdate(
            { _id: taskId, user: req.user._id },
            updateData,
            { 
                new: true, 
                runValidators: false  // Set to false to skip validation for updates
            }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        console.log("Task updated successfully:", task);
        return res.status(200).json(task);
        
    } catch (error) {
        console.error("Update task error:", error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        next(error);
    }
}


export const updateStatus = async(req, res, next) => {
    try {
        const { status } = req.body;

        const task = await Task.findOneAndUpdate(
             { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
        );

         if(!task){
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
       next(error);
    }
}

export const deleteTask = async(req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({ message: "task deleted successfully"});
    } catch (error) {
        next(error);
    }
}