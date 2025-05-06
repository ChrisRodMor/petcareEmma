import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ClientCard from './ClientCard';
import { AuthContext } from './AuthContext';

function ClientList() {
    const { authData } = useContext(AuthContext);
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            if (!authData || !authData.token) {
                console.error('No auth token available');
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/clients', {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        Accept: 'application/json'
                    }
                });
                
                const clientData = response.data.data.map(client => ({
                    id: client.user.id,
                    name: client.user.name,
                    image: client.user.file_path
                }));
                
                setClients(clientData);
                setFilteredClients(clientData);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, [authData]);

    useEffect(() => {
        applyFilters();
    }, [searchName]);

    const applyFilters = () => {
        let filtered = clients;

        if (searchName.trim() !== '') {
            filtered = filtered.filter(client => client.name.toLowerCase().includes(searchName.toLowerCase()));
        }

        setFilteredClients(filtered);
    };

    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
    };

    return (
        <Container className='mb-5'>
            <Row className='mb-5'>
                <Col>
                    <Form.Group controlId="formNombre">
                        <Form.Control type="text" placeholder="Ingresa aqui el nombre del cliente" value={searchName} onChange={handleSearchNameChange} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                {filteredClients.map(client => (
                    <Col key={client.id} md={4}>
                        <ClientCard 
                            name={client.name} 
                            image={`http://127.0.0.1:8000/${client.image}`} 
                            id={client.id} 
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ClientList;
