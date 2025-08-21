const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee assignment is required']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project reference is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function(value) {
                return value instanceof Date && !isNaN(value);
            },
            message: 'Invalid start date'
        }
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (!value) return true; // Optional field
                return value instanceof Date && !isNaN(value);
            },
            message: 'Invalid due date'
        }
    },
    priority: {
        type: String,
        enum: ['Most Important', 'Important', 'Least Important'],
        required: [true, 'Priority is required'],
        default: 'Important'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        required: [true, 'Status is required'],
        default: 'Pending'
      
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Task', taskSchema);