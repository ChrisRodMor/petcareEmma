import React, { useState } from 'react';
import { Form, Container, InputGroup, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa Axios
import banner from './img/bannerPetCare.png';
import './Register.css';

function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false); // Estado para controlar si el inicio de sesión fue exitoso

    const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Configura la instancia principal de Axios
    const axiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000/api',
        headers: {
            'Content-Type': 'application/json',
        },
        //withCredentials: true // Permite que Axios envíe cookies con las solicitudes
    });

    // Configura la instancia de Axios para la solicitud CSRF
    const csrfAxiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        //withCredentials: true // Permite que Axios envíe cookies con las solicitudes
    });

    const bearer = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud CSRF para inicializar la protección CSRF
            await csrfAxiosInstance.get('/sanctum/csrf-cookie');
            // Realiza la solicitud de inicio de sesión
            const response = await axiosInstance.post('/login', form);
            console.log(response.data);
            // Guarda el token en el almacenamiento local
            localStorage.setItem('token', response.data.data.token); // Asegúrate de usar la ruta correcta al token
            // Llama a la función bearer para configurar el token en los encabezados de las solicitudes
            bearer();
            // Marca el inicio de sesión como exitoso
            setLoginSuccess(true);
            // Muestra el modal de éxito
            setShowModal(true);
            // Redirige a la página principal después de 3 segundos
            setTimeout(() => {
                setShowModal(false);
                navigate('/inicio'); // Usa navigate en lugar de history.push
            }, 3000);
        } catch (error) {
            console.error(error.response.data);
            // Marca el inicio de sesión como no exitoso
            setLoginSuccess(false);
            // Muestra el modal de error
            setShowModal(true);
        }
    };

    return (
        <>
            {/* Import Bootstrap Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css"
            />
            <div className="fondo">
                <Container className="d-flex justify-content-center align-items-center vh-100">
                    <div className="register-form">
                        <Form onSubmit={handleSubmit}>
                            <div className="text-center">
                                <img src={banner} alt='banner' className='img-fluid' style={{ width: '80%' }} />
                                <h5>Iniciar Sesión</h5>
                            </div>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="example@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="********"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                    <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                        <i className={showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}></i>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            <div className="text-center mt-3">
                                <button type="submit" className="btn btn-warning">Ingresar</button>
                                <div style={{ marginTop: '10px' }}>
                                    <Link to='/register' className="link-secondary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover">¿Aún no tienes una cuenta? Regístrate aquí</Link>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Container>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center" style={{ backgroundColor: loginSuccess ? '#28A745' : '#DC3545', color: 'white' }}>
                    {loginSuccess ? '¡Has iniciado sesión correctamente!' : 'Correo y/o contraseña invalidos'}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Login;
