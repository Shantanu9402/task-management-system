const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');

// Add new task
router.post('/task', async (req, res) => {
    try {
        const { title, description, assignTo, project, startDate, dueDate, priority, status } = req.body;

        // Validate required fields
        if (!title || !description || !assignTo || !project || !startDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new task with proper date handling
        const newTask = new Task({
            title,
            description,
            assignTo,
            project,
            startDate: new Date(startDate),
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority: priority || 'Important',
            status: status || 'Pending'
        });

        await newTask.save();

        // Return the complete task data including timestamps
        res.status(201).json({
            message: 'Task added successfully',
            task: newTask
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            message: 'Failed to add task',
            error: error.message
        });
    }
});

// Get all tasks with optional population of references
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('assignTo', 'name email') // Populate employee details
            .populate('project', 'title clientName'); // Populate project details

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            message: 'Failed to fetch tasks',
            error: error.message
        });
    }
});

// Update task status by task ID
router.put('/tasks/:id/status', async (req, res) => {
    const { status } = req.body;
    
    // Validate status
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        await task.save();

        res.json({
            message: 'Task status updated successfully',
            task: task
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({
            message: 'Failed to update task status',
            error: error.message
        });
    }
});

// Delete task by ID
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
});

module.exports = router;
