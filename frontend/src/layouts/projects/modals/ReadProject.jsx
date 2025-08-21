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
} from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
import axios from 'axios';

function ReadProjectModal({ isOpen, onClose, project }) {
    const toast = useToast();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'N/A';
            }
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('tm_token');
            await axios.delete(`http://localhost:8000/api/projects/${project._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast({
                title: 'Project deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: 'Failed to delete project',
                description: error.response?.data?.message || error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
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
        <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{project?.title || 'Project Details'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {project ? (
                        <div className='task-card-container'>
                            <p className='task-title'>{project.title}</p>
                            <div className='task-desc-container'>
                                <p className='task-desc'>{project.description}</p>
                            </div>
                            <div className='task-card-footer-container'>
                                <div>
                                    <Tag size='lg' colorScheme={getStatusColor(project.status)} borderRadius='full'>
                                        <p className='tag-text'>{project.status}</p>
                                    </Tag>
                                </div>
                                <div>
                                    <div className='task-read' onClick={handleDelete}>
                                        <MdDelete className='read-icon' />
                                    </div>
                                </div>
                            </div>
                            <p className='created'>Created on: {formatDate(project.createdAt)}</p>
                            {project.dueDate && (
                                <p className='created'>Due date: {formatDate(project.dueDate)}</p>
                            )}
                        </div>
                    ) : (
                        <p>No project data available</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant='solid' color="white" bg='darkcyan' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ReadProjectModal;