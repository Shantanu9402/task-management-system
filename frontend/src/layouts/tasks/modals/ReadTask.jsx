import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Tag,
    useToast,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
import axios from 'axios';

function ReadTaskModal({ isOpen, onClose, task, onTaskDeleted }) {
    const toast = useToast();
    const { 
        isOpen: isDeleteDialogOpen, 
        onOpen: onDeleteDialogOpen, 
        onClose: onDeleteDialogClose 
    } = useDisclosure();
    const cancelRef = React.useRef();

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'green';
            case 'In Progress': return 'blue';
            case 'Pending': return 'red';
            default: return 'gray';
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("tm_token");
            await axios.delete(`http://localhost:8000/api/tasks/${task._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast({
                title: 'Task deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Call the callback function to notify parent component
            if (onTaskDeleted) {
                onTaskDeleted(task._id);
            }

            onDeleteDialogClose();
            onClose();
        } catch (error) {
            toast({
                title: 'Failed to delete task',
                description: error.response?.data?.message || error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const token = localStorage.getItem("tm_token");
            const response = await axios.put(`http://localhost:8000/api/tasks/${task._id}/status`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            toast({
                title: 'Status Updated',
                description: `Task status changed to ${newStatus}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Update the task object
            task.status = newStatus;
            task.updatedAt = response.data.updatedAt;

        } catch (error) {
            toast({
                title: 'Update failed',
                description: error.response?.data?.message || error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (!task) return null;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Task Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='task-card-container'>
                            <div className='task-status-container' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag
                                    size='md'
                                    colorScheme={getStatusColor(task.status)}
                                    borderRadius='full'
                                >
                                    {task.status}
                                </Tag>
                                <select value={task.status} onChange={handleStatusChange} className='status-dropdown'>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <p className='task-title'>{task.title}</p>
                            <div className='task-desc-container'>
                                <p className='task-desc'>{task.description}</p>
                            </div>
                            <div className='task-card-footer-container'>
                                <div>
                                    {task.priority && (
                                        <Tag size='md' colorScheme='red' borderRadius='full'>
                                            <p className='tag-text'>{task.priority}</p>
                                        </Tag>
                                    )}
                                </div>
                                <div>
                                    <div className='task-read' onClick={onDeleteDialogOpen}>
                                        <MdDelete className='read-icon' />
                                    </div>
                                </div>
                            </div>
                            <p className='created'>
                                {task.status === 'Completed'
                                    ? `Completed on: ${formatDate(task.updatedAt)}`
                                    : `Created on: ${formatDate(task.createdAt)}`}
                            </p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' color="white" bg='darkcyan' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteDialogClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Task
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete "{task?.title}"? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default ReadTaskModal;