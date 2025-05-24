import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
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
    const [validationErrors, setValidationErrors] = useState({});

    const formatValidationErrors = (errors) => {
    return (
        <div className="text-start">
        {Object.values(errors)
            .flat()
            .map((msg, index) => (
            <div key={index}>• {msg}</div>
            ))}
        </div>
    );
    };



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

        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: null
        }));
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
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
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

            if (error.errors) {
                setValidationErrors(error.errors);
                setModalMessage('Error al actualizar el perfil'); // ← aquí se guarda como JSX
                setOperationSuccess(false);
                setShowModal(true);
            } else {
                setModalMessage('Error al actualizar el perfil');
                setOperationSuccess(false);
                setShowModal(true);
            }
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
                                        isInvalid={!!validationErrors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {Array.isArray(validationErrors.email) ? validationErrors.email[0] : validationErrors.email}
                                    </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="formPhone" className='mb-3'>
                                    <Form.Label>Celular</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        placeholder="El campo debe contener 10 dígitos."
                                        value={formData.phone}
                                        onChange={handleChange}
                                        isInvalid={!!validationErrors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {Array.isArray(validationErrors.phone) ? validationErrors.phone[0] : validationErrors.phone}
                                    </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="formPassword" className='mb-3'>
                                    <Form.Label>Cambiar contraseña</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Debe contener al menos 8 caracteres. Una mayúscula, número y (!, $, #, %, *)."
                                        value={formData.password}
                                        onChange={handleChange}
                                        isInvalid={!!validationErrors.password}
                                        />
                                        <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                        <i className={showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}></i>
                                        </InputGroup.Text>
                                        <Form.Control.Feedback type="invalid">
                                        {Array.isArray(validationErrors.password) ? validationErrors.password[0] : validationErrors.password}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="formAddress" className='mb-3'>
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        placeholder="Tu dirección..."
                                        value={formData.address}
                                        onChange={handleChange}
                                        isInvalid={!!validationErrors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {Array.isArray(validationErrors.address) ? validationErrors.address[0] : validationErrors.address}
                                    </Form.Control.Feedback>
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
