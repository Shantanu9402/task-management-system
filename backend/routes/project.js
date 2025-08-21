const express = require('express');
const router = express.Router();
const Project = require('../models/projects');

// Add new project
router.post('/project', async (req, res) => {
    try {
        const { title, description, clientName, startDate, status, priority } = req.body;
        
        if (!title || !description || !clientName || !startDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newProject = new Project({
            title,
            description,
            clientName,
            startDate: new Date(startDate),
            status: status || 'Pending',
            priority: priority || 'Important'
        });

        await newProject.save();
        res.status(201).json({
            message: 'Project added successfully',
            project: newProject
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ 
            message: 'Failed to add project',
            error: error.message 
        });
    }
});

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ 
            message: 'Failed to fetch projects',
            error: error.message 
        });
    }
});

// ✅ Update project status by ID
router.put('/projects/:id/status', async (req, res) => {
    try {
        const projectId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const project = await Project.findByIdAndUpdate(
            projectId,
            { status },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project status updated successfully',
            project
        });
    } catch (error) {
        console.error('Error updating project status:', error);
        res.status(500).json({ 
            message: 'Failed to update status',
            error: error.message 
        });
    }
});
// ✅ Delete project
router.delete('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete project', error: error.message });
    }
});




module.exports = router;
