import React, { useState, useEffect } from 'react';
import Sidenav from '../../components/sidenav/Sidenav';
import { useToast } from '@chakra-ui/react';
import "./tasks.css";
import { IoReaderOutline } from "react-icons/io5";
import Navbar from '../../components/navbar/Navbar';
import { Tag, Input } from '@chakra-ui/react';  // Import Input from Chakra UI
import AddTaskModal from './modals/AddTask';
import ReadTaskModal from './modals/ReadTask';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");  // Track search term
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isReadTaskModalOpen, setIsReadTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const toast = useToast();

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("tm_token");
            const response = await axios.get('http://localhost:8000/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(response.data);
            setFilteredTasks(response.data);  // Initially, show all tasks
        } catch (error) {
            toast({
                title: 'Failed to fetch tasks',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter tasks based on search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value === "") {
            setFilteredTasks(tasks);  // If no search term, show all tasks
        } else {
            const filtered = tasks.filter(task =>
                task.title.toLowerCase().includes(value.toLowerCase()) ||
                task.description.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTasks(filtered);
        }
    };

    const handleTaskAdded = (newTask) => {
        setTasks([...tasks, newTask]);
        setFilteredTasks([...tasks, newTask]);  // Update filtered list
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };

    const openReadTaskModal = (task) => {
        setSelectedTask(task);
        setIsReadTaskModalOpen(true);
    };

    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };

    const closeReadTaskModal = () => {
        setIsReadTaskModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'green';
            case 'In Progress': return 'blue';
            case 'Testing': return 'orange';
            case 'Pending': return 'red';
            default: return 'gray';
        }
    };

    return (
        <>
            <AddTaskModal 
                isOpen={isAddTaskModalOpen} 
                onClose={closeAddTaskModal} 
                onTaskAdded={handleTaskAdded} 
            />
            <ReadTaskModal 
                isOpen={isReadTaskModalOpen} 
                onClose={closeReadTaskModal} 
                task={selectedTask}
            />
            <div className='app-main-container'>
                <div className='app-main-left-container'><Sidenav /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='tasks-cluster-container'>
                        <div className='cluster-header'>
                            <h2>Task Cluster</h2>
                            <Input 
                                value={searchTerm} 
                                onChange={handleSearchChange} 
                                placeholder="Search tasks by title or description"
                                size="sm"
                                className="search-input"
                            />
                            <button className='cluster-add-btn' onClick={openAddTaskModal}>
                                <IoMdAdd className='add-icon' />
                            </button>
                        </div>
                        
                        {loading ? (
                            <div className='loading-message'>Loading tasks...</div>
                        ) : (
                            <div className='tasks-cluster-grid'>
                                {filteredTasks.map(task => (
                                    <div key={task._id} className='task-cluster-card' onClick={() => openReadTaskModal(task)}>
                                        <div className='cluster-card-top'>
                                            <Tag 
                                                size='sm' 
                                                colorScheme={getStatusColor(task.status)} 
                                                borderRadius='full'
                                                className='cluster-status'
                                            >
                                                {task.status}
                                            </Tag>
                                            <h3 className='cluster-title'>{task.title}</h3>
                                        </div>
                                        <p className='cluster-desc'>{task.description}</p>
                                        <div className='cluster-card-bottom'>
                                            <span className='cluster-date'>
                                                {formatDate(task.status === 'Completed' ? task.updatedAt : task.createdAt)}
                                            </span>
                                            <IoReaderOutline className='cluster-read-icon' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tasks;
