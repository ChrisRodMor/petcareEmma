import React, { useState } from 'react';
import { Form, Container, InputGroup, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import banner from './img/bannerPetCare.png';
import './Register.css';

function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        address: '',
        birthdate: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showpassword_confirmation, setShowpassword_confirmation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
        setValidationErrors({ ...validationErrors, [name]: null }); // limpiar error del campo al escribir
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const togglepassword_confirmationVisibility = () => setShowpassword_confirmation(!showpassword_confirmation);

    const axiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000/api',
         headers: { 'Content-Type': 'application/json' }
     });

    const csrfAxiosInstance = axios.create({ baseURL: 'http://127.0.0.1:8000' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        setRegistrationSuccess(false);

        try {
            await csrfAxiosInstance.get('/sanctum/csrf-cookie');
            const response = await axiosInstance.post('/register', form);

            setRegistrationSuccess(true);
            setShowModal(true);
            setForm({
                name: '',
                email: '',
                phone: '',
                password: '',
                password_confirmation: '',
                address: '',
                birthdate: '',
            });

            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
            } else {
                setRegistrationSuccess(false);
            }
            setShowModal(true);
        }
    };

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css"
            />

            <div className="fondo">
                <Container className="d-flex justify-content-center align-items-center vh-100">
                    <div className="register-form">
                        <Form onSubmit={handleSubmit}>
                            <div className="text-center">
                                <img src={banner} alt='banner' className='img-fluid' style={{ width: '50%' }} />
                                <h5>Regístrate</h5>
                            </div>

                            <Form.Group controlId="formName">
                                <Form.Label>Nombre completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Ingrese su nombre..."
                                    value={form.name}
                                    onChange={handleChange}
                                    isInvalid={!!validationErrors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-center">
                                <Form.Group controlId="formEmail" style={{ width: '48%', marginRight: '5%' }}>
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="example@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        isInvalid={!!validationErrors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formPhone" style={{ width: '48%' }}>
                                    <Form.Label>Celular</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        placeholder="10 dígitos"
                                        value={form.phone}
                                        onChange={handleChange}
                                        isInvalid={!!validationErrors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Debe contener 8 caracteres, mayúscula, número y (!, $, #, % o *)"
                                        value={form.password}
                                        onChange={handleChange}
                                        isInvalid={!!validationErrors.password}
                                    />
                                    <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                        <i className={showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}></i>
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.password}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formpassword_confirmation">
                                <Form.Label>Confirmar contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showpassword_confirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        placeholder="********"
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        isInvalid={!!validationErrors.password_confirmation}
                                    />
                                    <InputGroup.Text onClick={togglepassword_confirmationVisibility} style={{ cursor: 'pointer' }}>
                                        <i className={showpassword_confirmation ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}></i>
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.password_confirmation}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formAddress">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Av. Conchalito 24, Col. Correcaminos"
                                    value={form.address}
                                    onChange={handleChange}
                                    isInvalid={!!validationErrors.address}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.address}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBirthDate">
                                <Form.Label>Fecha de nacimiento</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birthdate"
                                    value={form.birthdate}
                                    onChange={handleChange}
                                    isInvalid={!!validationErrors.birthdate}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.birthdate}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="text-center mt-3">
                                <Link to='/login'>
                                    <button type="button" className="btn btn-warning btn-sm btn-block" style={{ marginRight: '5%' }}>Cancelar</button>
                                </Link>
                                <button type="submit" className="btn btn-warning btn-sm btn-block">Aceptar</button>

                                <div style={{ marginTop: '10px' }}>
                                    <Link to='/login' className="link-secondary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover">
                                        ¿Ya tienes una cuenta? Inicia sesión aquí
                                    </Link>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Container>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center" style={{ backgroundColor: registrationSuccess ? '#28A745' : '#DC3545', color: 'white' }}>
                    {registrationSuccess ? '¡Registro exitoso!' : 'Error al registrar usuario'}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Register;
