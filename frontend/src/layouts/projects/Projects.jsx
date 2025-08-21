import React, { useState, useEffect } from 'react';
import Sidenav from '../../components/sidenav/Sidenav';
import { CircularProgress, CircularProgressLabel, useToast, Input, Box, Tag } from '@chakra-ui/react';
import './projects.css';
import pending from '../../assets/tasks/Pending.png';
import complete from '../../assets/tasks/complete.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { IoReaderOutline } from 'react-icons/io5';
import { FcStatistics } from 'react-icons/fc';
import Navbar from '../../components/navbar/Navbar';
import AddProjectModal from './modals/AddProject';
import ReadProjectModal from './modals/ReadProject';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    testing: 0
  });
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isReadProjectModalOpen, setIsReadProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tm_token');
      const response = await axios.get('http://localhost:8000/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(response.data);
      calculateStats(response.data);
    } catch (error) {
      toast({
        title: 'Failed to fetch projects',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projects) => {
    const stats = {
      total: projects.length,
      completed: projects.filter((p) => p.status === 'Completed').length,
      inProgress: projects.filter((p) => p.status === 'In Progress').length,
      pending: projects.filter((p) => p.status === 'Pending').length,
      testing: projects.filter((p) => p.status === 'Testing').length
    };
    setStats(stats);
  };

  const handleProjectAdded = (newProject) => {
    setProjects([...projects, newProject]);
    calculateStats([...projects, newProject]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      const token = localStorage.getItem('tm_token');
      await axios.put(`http://localhost:8000/api/projects/${projectId}/status`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        title: 'Status updated!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      fetchProjects();
    } catch (error) {
      toast({
        title: 'Failed to update status',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddProjectModal = () => {
    setIsAddProjectModalOpen(true);
  };

  const openReadProjectModal = (project) => {
    setSelectedProject(project);
    setIsReadProjectModalOpen(true);
  };

  const closeAddProjectModal = () => setIsAddProjectModalOpen(false);
  const closeReadProjectModal = () => setIsReadProjectModalOpen(false);

  const pendingProjects = projects.filter((p) => p.status === 'Pending');
  const inProgressProjects = projects.filter((p) => p.status === 'In Progress');
  const testingProjects = projects.filter((p) => p.status === 'Testing');
  const completedProjects = projects.filter((p) => p.status === 'Completed');

  const filteredProjects = (projects) => {
    return projects.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  const renderProjectCards = (projects) => {
    const projectsToRender = searchTerm ? filteredProjects(projects) : projects;
    return (
      <div className="projects-grid">
        {projectsToRender.map((project) => (
          <div key={project._id} className='task-card-container'>
            <p className='task-title'>{project.title}</p>
            <div className='task-desc-container'>
              <p className='task-desc'>{project.description}</p>
            </div>
            <div className='task-card-footer-container'>
              <div>
                <Tag size='lg' colorScheme={getStatusColor(project.status)} borderRadius='full'>
                  <p className='tag-text'>{project.status}</p>
                </Tag>
                <select
                  className='status-dropdown'
                  value={project.status}
                  onChange={(e) => updateProjectStatus(project._id, e.target.value)}
                  style={{ marginTop: '5px', padding: '4px 6px', borderRadius: '5px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Testing">Testing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <div className='task-read' onClick={() => openReadProjectModal(project)}>
                  <IoReaderOutline className='read-icon' />
                </div>
              </div>
            </div>
            <p className='created'>Created on: {formatDate(project.createdAt)}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <AddProjectModal isOpen={isAddProjectModalOpen} onClose={closeAddProjectModal} onProjectAdded={handleProjectAdded} />
      <ReadProjectModal isOpen={isReadProjectModalOpen} onClose={closeReadProjectModal} project={selectedProject} />
      <div className='app-main-container'>
        <div className='app-main-left-container'>
          <Sidenav />
        </div>
        <div className='app-main-right-container'>
          <Navbar />
          <Box px={4} py={3} bg="white" boxShadow="sm">
            <Input
              placeholder='Search projects...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="md"
              borderRadius="md"
              focusBorderColor="teal.400"
            />
          </Box>
          <div className='dashboard-main-container'>
            <div className='dashboard-main-left-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Projects Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt='totaltasks' />
                    <div>
                      <p className='stats-num'>{stats.total}</p>
                      <p className='stats-text'>Total Projects</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt='totalcomplete' />
                    <div>
                      <p className='stats-num'>{stats.completed}</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt='totalprogress' />
                    <div>
                      <p className='stats-num'>{stats.inProgress}</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt='totalpending' />
                    <div>
                      <p className='stats-num'>{stats.pending}</p>
                      <p className='stats-text'>Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={pending} alt='pending' />
                    <p className='todo-text'>To-Do Projects</p>
                  </div>
                  <button className='table-btn-task' onClick={openAddProjectModal}>
                    <IoMdAdd />Add Project
                  </button>
                </div>
                <div className="project-category-container">
                  <div className="project-category-section">
                    <p className="category-title">Pending Projects</p>
                    {renderProjectCards(pendingProjects)}
                  </div>
                  <div className="project-category-section">
                    <p className="category-title">In Progress Projects</p>
                    {renderProjectCards(inProgressProjects)}
                  </div>
                  <div className="project-category-section">
                    <p className="category-title">Testing Projects</p>
                    {renderProjectCards(testingProjects)}
                  </div>
                  <div className="project-category-section">
                    <p className="category-title">Completed Projects</p>
                    {renderProjectCards(completedProjects)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
