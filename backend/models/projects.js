const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Testing', 'Completed'], // Changed 'On Hold' to 'Pending' to match frontend
        required: [true, 'Status is required'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Most Important', 'Important', 'Least Important'],
        required: [true, 'Priority is required'],
        default: 'Important'
    },
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Project', projectSchema);