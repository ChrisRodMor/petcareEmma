import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import axios from 'axios';
import { Container, Form, InputGroup, Button, Modal, Col, Row } from 'react-bootstrap';
import ClientCardProfile from './ClientCardProfile';

function Configuracion() {
    const { authData } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [operationSuccess, setOperationSuccess] = useState(false);

    useEffect(() => {
        if (authData) {
            setFormData({
                email: authData.email,
                phone: authData.phone,
                password: '',
                address: authData.address
            });
        }
    }, [authData]);

    useEffect(() => {
        if (showModal && operationSuccess) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showModal, operationSuccess]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = { ...formData };
    
        if (profilePicture) {
            updatedData.profile_picture = profilePicture;
        }
    
        try {
            const formDataToSend = new FormData();
            for (const key in updatedData) {
                formDataToSend.append(key, updatedData[key]);
            }
    
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/api/update-profile', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formDataToSend
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                throw responseData;
            }
    
            console.log('Perfil editado: ', responseData);
    
            // Configura el mensaje y el estado de éxito del modal
            setModalMessage('Cambios guardados exitosamente');
            setOperationSuccess(true);
            setShowModal(true);
    
        } catch (error) {
            console.error('Error:', error);
    
            // Configura el mensaje y el estado de error del modal
            let errorMessage = 'Error al actualizar el perfil';
            if (error.errors) {
                // Si hay errores específicos, los concatenamos en un solo mensaje
                errorMessage = Object.values(error.errors).flat().join(' ');
            }
            setModalMessage(errorMessage);
            setOperationSuccess(false);
            setShowModal(true);
        }
    };

    if (!authData) {
        return <div>Loading...</div>;
    }

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css"
            />
            <div>
                {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}
                <Container className='col-12'>
                    <div className='mt-5 d-flex mb-5'>
                        <div className='me-auto'>
                            <h1 className="h1">Mi Perfil</h1>
                        </div>
                    </div>

                    <Row className='d-flex'>
                        <Col md={3} className='me-5 mb-3'>
                            <ClientCardProfile name={authData.name} file_path={`http://127.0.0.1:8000/${authData.file_path}`} />
                            <input type="file" className="form-control" id="profilePicture" onChange={handleFileChange} />
                        </Col>
                        <Col md={8} className='mb-3'>
                            <Container className="bg-white p-5 rounded shadow">
                                <Form className="d-flex flex-column justify-content-center" onSubmit={handleSubmit}>
                                    <Form.Group controlId="formId" className='mb-3'>
                                        <Form.Label>ID</Form.Label>
                                        <Form.Control type="text" value={authData.id} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="formFullName" className='mb-3'>
                                        <Form.Label>Nombre Completo</Form.Label>
                                        <Form.Control type="text" value={authData.name} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="formEmail" className='mb-3'>
                                        <Form.Label>Correo Electrónico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPhone" className='mb-3'>
                                        <Form.Label>Celular</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            placeholder='El campo debe de contener a 10 dígitos.'
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPassword" className='mb-3'>
                                        <Form.Label>Cambiar contraseña</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="Debe contener al menos 8 caracteres. una mayúscula, número y un (!, $, #, % o *)."
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                                <i className={showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}></i>
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formAddress" className='mb-3'>
                                        <Form.Label>Dirección</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            placeholder="Nueva contraseña..."
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formBirthDate" className='mb-5'>
                                        <Form.Label>Fecha de Nacimiento</Form.Label>
                                        <Form.Control type="text" value={authData.birthdate} disabled />
                                    </Form.Group>
                                    <div className='d-flex justify-content-end'>
                                        <Button type="submit" variant="warning">Guardar</Button>
                                    </div>
                                </Form>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Modal para mostrar el resultado de la operación */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center" style={{ backgroundColor: operationSuccess ? '#28A745' : '#DC3545', color: 'white' }}>
                    {modalMessage}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Configuracion;
