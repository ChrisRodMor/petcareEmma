import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Col, Row } from 'react-bootstrap';
import ClientCardProfile from './ClientCardProfile';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import { AuthContext } from './AuthContext';

function VerCliente() {
    const { authData } = useContext(AuthContext);
    const { id } = useParams();
    const [client, setClient] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            if (!authData || !authData.token) {
                console.error('No auth token available');
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/clients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        Accept: 'application/json'
                    }
                });
                setClient(response.data.data.user); // Establecer los datos del cliente desde la API
            } catch (error) {
                console.error('Error fetching client details:', error);
            }
        };

        fetchClient();
    }, [id, authData]);

    if (!client) {
        return <div>Loading...</div>; // Mostrar un mensaje de carga mientras se obtienen los datos
    }

    return (
        <div>
            {authData && authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}

            <Container className='col-12'>
                <div className='mt-5 d-flex mb-5'>
                    <div className='me-auto'>
                        <h1 className="h1">Clientes</h1>
                    </div>
                </div>

                <Row className='d-flex'>
                    <Col md={3} className='me-5 mb-3'>
                        <ClientCardProfile name={client.name} file_path={`http://127.0.0.1:8000/${client.file_path}`} />
                    </Col>
                    <Col md={8} className='mb-3'>
                        <Container className="bg-white p-5 rounded shadow">
                            
                            <p className="h3">Descripcion detallada</p>

                            <div className='mb-5'>
                                <p className='lead'>ID: {client.id}</p>
                                <p className='lead'>Nombre: {client.name}</p>
                                <p className='lead'>Email: {client.email}</p>
                                <p className='lead'>Teléfono: {client.phone}</p>
                                <p className='lead'>Fecha de Nacimiento: {client.birthdate}</p>
                                <p className='lead'>Dirección: {client.address}</p>
                            </div>

                            <div className='d-flex justify-content-center'>
                                <Link to='/clientes'><Button type="button" variant="btn btn-outline-warning btn-block">Regresar</Button></Link>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default VerCliente;
