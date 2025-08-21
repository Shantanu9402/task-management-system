import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./dashboard.css"
import welcome from '../../assets/dashboard/welcome.png';
import complete from '../../assets/tasks/complete.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { FcStatistics } from "react-icons/fc";
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';

function Dashboard() {
  const [employeesStats, setEmployeesStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inActiveEmployees: 0,
    terminatedEmployees: 0
  });
  const [projectsStats, setProjectsStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    testing: 0
  });
  const [timesheetsStats, setTimesheetsStats] = useState({
    totalTimesheets: 0,
    developmentType: 0,
    testType: 0,
    otherType: 0
  });

  const getEmployeesStats = async () => {
    try {
      const response = await axios.get('api/employees-stats');
      setEmployeesStats(response.data);
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    }
  };

  const getProjectsStats = async () => {
    try {
      const response = await axios.get('api/projects');
      const stats = {
        total: response.data.length,
        completed: response.data.filter(p => p.status === 'Completed').length,
        inProgress: response.data.filter(p => p.status === 'In Progress').length,
        pending: response.data.filter(p => p.status === 'Pending').length,
        testing: response.data.filter(p => p.status === 'Testing').length
      };
      setProjectsStats(stats);
    } catch (error) {
      console.error('Error fetching project stats:', error);
    }
  };

  const getTimesheetsStats = async () => {
    try {
      const response = await axios.get('api/timesheets-stats');
      setTimesheetsStats(response.data);
    } catch (error) {
      console.error('Error fetching timesheet stats:', error);
    }
  };

  useEffect(() => {
    getEmployeesStats();
    getProjectsStats();
    getTimesheetsStats();
  }, []);

  return (
    <>
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav /></div>
        <div className='app-main-right-container'>
           <Navbar /> 
          <div className='welcome-main-container'>
            <div className='welcome-left-container'>
              <p className='mng-text'>Welcome To</p>
              <p className='mng-text'>Task Management Area</p>
              <p className='mng-para'>In this task management hub, the system seamlessly orchestrates task creation, assignment, and tracking, ensuring projects move forward smoothly and collaboratively.</p>
            </div>
            <div className='welcome-right-container'>
              <img className='welcome-img' src={welcome} alt="welcome" />
            </div>
          </div>
          <div className='dashboard-main-container'>
            <div className='dashboard-main-left-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Employees Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>{employeesStats.totalEmployees}</p>
                      <p className='stats-text'>Total Employees</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>{employeesStats.activeEmployees}</p>
                      <p className='stats-text'>Active Employees</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>{employeesStats.inActiveEmployees}</p>
                      <p className='stats-text'>In Active Employees</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>{employeesStats.terminatedEmployees}</p>
                      <p className='stats-text'>Terminated Employees</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Projects Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>{projectsStats.total}</p>
                      <p className='stats-text'>Total Projects</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>{projectsStats.completed}</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>{projectsStats.inProgress}</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>{projectsStats.pending}</p>
                      <p className='stats-text'>Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Timesheets Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>{timesheetsStats.totalTimesheets}</p>
                      <p className='stats-text'>Total Timesheets</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>{timesheetsStats.developmentType}</p>
                      <p className='stats-text'>Development Type</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>{timesheetsStats.testType}</p>
                      <p className='stats-text'>Testing Type</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>{timesheetsStats.otherType}</p>
                      <p className='stats-text'>Other Type</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='dashboard-main-right-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Employees Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress 
                      value={employeesStats.totalEmployees ? (employeesStats.activeEmployees / employeesStats.totalEmployees) * 100 : 0} 
                      color='#05A301' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {employeesStats.totalEmployees ? Math.round((employeesStats.activeEmployees / employeesStats.totalEmployees) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Active</p>
                  </div>
                  <div>
                    <CircularProgress 
                      value={employeesStats.totalEmployees ? (employeesStats.inActiveEmployees / employeesStats.totalEmployees) * 100 : 0} 
                      color='#0225FF' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {employeesStats.totalEmployees ? Math.round((employeesStats.inActiveEmployees / employeesStats.totalEmployees) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Active</p>
                  </div>
                  <div>
                    <CircularProgress 
                      value={employeesStats.totalEmployees ? (employeesStats.terminatedEmployees / employeesStats.totalEmployees) * 100 : 0} 
                      color='#F21E1E' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {employeesStats.totalEmployees ? Math.round((employeesStats.terminatedEmployees / employeesStats.totalEmployees) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Termintaed</p>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Projects Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress 
                      value={projectsStats.total ? (projectsStats.completed / projectsStats.total) * 100 : 0} 
                      color='#05A301' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {projectsStats.total ? Math.round((projectsStats.completed / projectsStats.total) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Completed</p>
                  </div>
                  <div>
                    <CircularProgress 
                      value={projectsStats.total ? (projectsStats.inProgress / projectsStats.total) * 100 : 0} 
                      color='#0225FF' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {projectsStats.total ? Math.round((projectsStats.inProgress / projectsStats.total) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Progress</p>
                  </div>
                  <div>
                    <CircularProgress 
                      value={projectsStats.total ? (projectsStats.testing / projectsStats.total) * 100 : 0} 
                      color='orange' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {projectsStats.total ? Math.round((projectsStats.testing / projectsStats.total) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='testing'>Testing</p>
                  </div>
                  <div>
                    <CircularProgress 
                      value={projectsStats.total ? (projectsStats.pending / projectsStats.total) * 100 : 0} 
                      color='#F21E1E' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {projectsStats.total ? Math.round((projectsStats.pending / projectsStats.total) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Pending</p>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Timesheets Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress 
                      value={timesheetsStats.totalTimesheets ? (timesheetsStats.developmentType / timesheetsStats.totalTimesheets) * 100 : 0} 
                      color='#05A301' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {timesheetsStats.totalTimesheets ? Math.round((timesheetsStats.developmentType / timesheetsStats.totalTimesheets) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Development</p>
                  </div>
                  <div>
                    <CircularProgress 
                      value={timesheetsStats.totalTimesheets ? (timesheetsStats.testType / timesheetsStats.totalTimesheets) * 100 : 0} 
                      color='orange' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {timesheetsStats.totalTimesheets ? Math.round((timesheetsStats.testType / timesheetsStats.totalTimesheets) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='testing'>Testing</p>
                  </div>
                  <div>
                    <CircularProgress 
                      value={timesheetsStats.totalTimesheets ? (timesheetsStats.otherType / timesheetsStats.totalTimesheets) * 100 : 0} 
                      color='#F21E1E' 
                      size={'100px'}
                    >
                      <CircularProgressLabel>
                        {timesheetsStats.totalTimesheets ? Math.round((timesheetsStats.otherType / timesheetsStats.totalTimesheets) * 100) : 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Other</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard