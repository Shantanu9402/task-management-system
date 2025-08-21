import { Tag, useToast, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidenav from '../../components/sidenav/Sidenav';
import "./attendance.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { IoMdAdd } from "react-icons/io";
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import AddAttendanceModal from './modals/AddAttendance';

function Attendance() {
  const [isAddAttendanceModalOpen, setIsAddAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [employees, setEmployees] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  // Modal control functions
  const openAddAttendanceModal = () => setIsAddAttendanceModalOpen(true);
  const closeAddAttendanceModal = () => setIsAddAttendanceModalOpen(false);

  // Format time in 24-hour format (HH:MM)
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    try {
      // Convert 12-hour format to 24-hour format
      const [time, period] = timeString.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    } catch {
      return timeString || '--:--'; // Return original if conversion fails
    }
  };

  // Format day as "Day DD/MM/YYYY"
  const formatDay = (dayString) => {
    if (!dayString) return '--/--/----';
    try {
      const date = new Date(dayString);
      if (isNaN(date.getTime())) return dayString; // Return original if invalid
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = days[date.getDay()];
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${dayName} ${day}/${month}/${year}`;
    } catch {
      return dayString || '--/--/----';
    }
  };

  // Fetch employee data
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      const employeesMap = {};
      response.data.forEach(emp => {
        employeesMap[emp._id] = `${emp.firstName} ${emp.lastName}`;
      });
      setEmployees(employeesMap);
    } catch (error) {
      toast({
        title: 'Error loading employees',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Fetch attendance data
  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/attendances');
      const formattedData = response.data.map(record => ({
        ...record,
        employeeName: employees[record.employee] || 'Unknown',
        formattedDay: formatDay(record.day),
        formattedTimeIn: formatTime(record.timeIn),
        formattedTimeOut: formatTime(record.timeOut),
        workingHours: record.workingHours || '0h 0m'
      }));
      setAttendanceData(formattedData);
      setFilteredAttendance(formattedData); // Initialize filtered data with all records
    } catch (error) {
      toast({
        title: 'Error loading attendance',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter attendance by employee name
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAttendance(attendanceData);
    } else {
      const filtered = attendanceData.filter(record =>
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAttendance(filtered);
    }
  }, [searchTerm, attendanceData]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (Object.keys(employees).length > 0) {
      fetchAttendance();
    }
  }, [employees]);

  return (
    <>
      <AddAttendanceModal 
        isOpen={isAddAttendanceModalOpen} 
        onClose={closeAddAttendanceModal} 
        onAttendanceAdded={fetchAttendance}
      />
      
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav /></div>
        <div className='app-main-right-container'>
          <Navbar />
          
          <div className='table-main-header'>
            <p className='table-header-text'>Attendance</p>
            <button className='table-btn' onClick={openAddAttendanceModal}>
              <IoMdAdd />Add Attendance
            </button>
          </div><br></br>

          {/* Search Input */}
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
                  <Th>Employee</Th>
                  <Th>Day</Th>
                  <Th>Time In</Th>
                  <Th>Time Out</Th>
                  <Th>Working Hours</Th>
                  {/* <Th>Action</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center">Loading attendance records...</Td>
                  </Tr>
                ) : filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <Tr key={record._id}>
                      <Td>{record.employeeName}</Td>
                      <Td>{record.formattedDay}</Td>
                      <Td>{record.formattedTimeIn}</Td>
                      <Td>{record.formattedTimeOut}</Td>
                      <Td>{record.workingHours}</Td>
                      {/* <Td>
                        <button className='action-btn'>Edit</button>
                      </Td> */}
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center">
                      {searchTerm ? 'No matching records found' : 'No attendance records found'}
                    </Td>
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

export default Attendance;