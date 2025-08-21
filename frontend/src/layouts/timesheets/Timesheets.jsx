import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidenav from '../../components/sidenav/Sidenav';
import "./timesheets.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { IoMdAdd } from "react-icons/io";
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { FcStatistics } from "react-icons/fc";
import AddTimesheetModal from './modals/AddTimesheet';
import axios from 'axios';

function Timesheets() {
  const [isAddTimesheetModalOpen, setIsAddTimesheetModalOpen] = useState(false);
  const [timesheetsData, setTimesheetsData] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [employees, setEmployees] = useState({});
  const [projects, setProjects] = useState({});
  const [tasks, setTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [timesheetsStats, setTimesheetsStats] = useState({
    totalTimesheets: 0,
    developmentType: 0,
    testType: 0,
    otherType: 0,
  });

  const openAddTimesheetModal = () => setIsAddTimesheetModalOpen(true);
  const closeAddTimesheetModal = () => setIsAddTimesheetModalOpen(false);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('api/employees');
      const employeesMap = {};
      response.data.forEach(emp => {
        employeesMap[emp._id] = `${emp.firstName} ${emp.lastName}`;
      });
      setEmployees(employeesMap);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('api/projects');
      const projectsMap = {};
      response.data.forEach(proj => {
        projectsMap[proj._id] = proj.title;
      });
      setProjects(projectsMap);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('api/tasks');
      const tasksMap = {};
      response.data.forEach(task => {
        tasksMap[task._id] = task.title;
      });
      setTasks(tasksMap);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getTimesheets = async () => {
    try {
      const response = await axios.get('api/timesheets');
      setTimesheetsData(response.data);
      setFilteredTimesheets(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTimesheetsStats = async () => {
    try {
      const response = await axios.get('api/timesheets-stats');
      setTimesheetsStats(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB');
    } catch {
      return '-';
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchTasks();
    getTimesheets();
    getTimesheetsStats();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTimesheets(timesheetsData);
    } else {
      const filtered = timesheetsData.filter(ts =>
        (employees[ts.employee] || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTimesheets(filtered);
    }
  }, [searchTerm, timesheetsData, employees]);

  return (
    <>
      <AddTimesheetModal isOpen={isAddTimesheetModalOpen} onClose={closeAddTimesheetModal} />
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav /></div>
        <div className='app-main-right-container'>
          <Navbar />
          <div className='task-status-card-container'>
            {/* Stats cards code remains the same */}
          </div>

          <div className='table-main-header'>
            <p className='table-header-text'>Timesheets</p>
            <button className='table-btn' onClick={openAddTimesheetModal}><IoMdAdd />Add Timesheet</button>
          </div><br></br>

          {/* 🔍 Search Input */}
          <div className='search-container' style={{ marginBottom: '1rem', maxWidth: '300px' }}>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.300' />
              </InputLeftElement>
              <Input 
                placeholder='Search by employee name' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>

          <TableContainer className='table-main-container'>
            <Table variant='striped' colorScheme='teal'>
              <Thead>
                <Tr>
                  <Th>Notes</Th>
                  <Th>Employee</Th>
                  <Th>Project</Th>
                  <Th>Task</Th>
                  <Th>Progress</Th>
                  <Th>Time Spent</Th>
                  <Th>Created Date</Th>
                  <Th>Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTimesheets.length > 0 ? (
                  filteredTimesheets.map((ts) => (
                    <Tr key={ts._id}>
                      <Td>{ts.notes || '-'}</Td>
                      <Td>{employees[ts.employee] || '-'}</Td>
                      <Td>{projects[ts.project] || '-'}</Td>
                      <Td>{tasks[ts.task] || '-'}</Td>
                      <Td>{ts.progress ? `${ts.progress}%` : '-'}</Td>
                      <Td>{ts.timeSpent || '-'}</Td>
                      <Td>{formatDate(ts.date)}</Td>
                      <Td>{ts.type || '-'}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={8} textAlign="center">No matching records found</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default Timesheets;
