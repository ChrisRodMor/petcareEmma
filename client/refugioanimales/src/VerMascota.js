import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Col, Row } from 'react-bootstrap';
import ClientCardProfile from './ClientCardProfile';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import { AuthContext } from './AuthContext';

function VerMascota() {
    const { authData } = useContext(AuthContext);
    const { id } = useParams();
    const [mascota, setMascota] = useState(null);
    const [vacunas, setVacunas] = useState(null);
    const [currentVacunaIndex, setCurrentVacunaIndex] = useState(0);

    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/animals/${id}`);
                setMascota(response.data.data); // Establecer los datos de la mascota desde la API
            } catch (error) {
                console.error('Error fetching pet details:', error);
            }
        };

        const fetchVacunas = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/vaccines/${id}`);
                setVacunas(response.data.data); // Establecer las vacunas desde la API
            } catch (error) {
                console.error('Error fetching vaccines:', error);
                setVacunas([]); // En caso de error, establecer un array vacío para evitar el problema de undefined
            }
        };
        
        fetchMascota();
        fetchVacunas();
    }, [id]);

    if (!mascota) {
        return <div>Loading...</div>; // Mostrar un mensaje de carga mientras se obtienen los datos
    }

    // Validar si existe el nombre de la mascota
    if (!mascota.name) {
        return <div>No se encontró el nombre de la mascota.</div>;
    }

    let vacunaActual = null;
    try {
        if (vacunas && vacunas.length > 0) {
            vacunaActual = vacunas[currentVacunaIndex];
        }
    } catch (error) {
        console.error('Error accessing vaccines:', error);
    }

    const handleNextVacuna = () => {
        try {
            if (vacunas && currentVacunaIndex < vacunas.length - 1) {
                setCurrentVacunaIndex(currentVacunaIndex + 1);
            }
        } catch (error) {
            console.error('Error navigating to next vaccine:', error);
        }
    };

    const handlePrevVacuna = () => {
        try {
            if (vacunas && currentVacunaIndex > 0) {
                setCurrentVacunaIndex(currentVacunaIndex - 1);
            }
        } catch (error) {
            console.error('Error navigating to previous vaccine:', error);
        }
    };

    return (
        <div>
            {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}

            <Container className='col-12'>
                <div className='mt-5 d-flex mb-5'>
                    <div className='me-auto'>
                        <h1 className="h1">Refugio</h1>
                    </div>
                </div>

                <Row className='d-flex'>
                    <Col md={3} className='me-5 mb-3'>
                        <ClientCardProfile name={mascota.name} file_path={`http://127.0.0.1:8000/${mascota.file_path}`} />
                        <Container className="bg-white p-5 rounded shadow">
                            {vacunaActual && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <p className="h3">Vacunas</p>
                                    </div>
                                    <div>
                                        <p>Marca: {vacunaActual.vaccine_brand}</p>
                                        <p>Tipo: {vacunaActual.vaccine_type}</p>
                                        <p>Lote: {vacunaActual.vaccine_batch}</p>
                                        <p>Fecha de Aplicación: {vacunaActual.application_date}</p>
                                        <p>Nombre del Doctor: {vacunaActual.doctor_name}</p>
                                        <p>Licencia del Doctor: {vacunaActual.doctor_license}</p>
                                    </div>
                                    {vacunas.length > 1 && (
                                        <div>
                                            <Button variant="light" onClick={handlePrevVacuna} disabled={currentVacunaIndex === 0}>
                                                &#8249; Anterior
                                            </Button>
                                            <Button variant="light" onClick={handleNextVacuna} disabled={currentVacunaIndex === vacunas.length - 1}>
                                                Siguiente &#8250;
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Container>
                    </Col>
                    <Col md={8} className='mb-3'>
                        <Container className="bg-white p-5 rounded shadow">
                            <p className="h3">Descripción detallada</p>
                            <div className='mb-5'>
                                <p className='lead'>ID: {mascota.id}</p>
                                <p className='lead'>Especie: {mascota.type_name}</p>
                                <p className='lead'>Raza: {mascota.breed_name}</p>
                                <p className='lead'>Nombre: {mascota.name}</p>
                                <p className='lead'>Sexo: {mascota.gender}</p>
                                <p className='lead'>Esta esterilizado: {mascota.sterilized}</p>
                                <p className='lead'>Fecha de Nacimiento: {mascota.birthdate}</p>
                                <p className='lead'>Edad: {mascota.age}</p>
                                <p className='lead'>Color: {mascota.color}</p>
                                <p className='lead'>Peso: {mascota.weight}</p>
                                <p className='lead'>Tamaño: {mascota.size}</p>
                                <p className='lead'>Salud: {mascota.health}</p>
                                <p className='lead'>Descripción: {mascota.description}</p>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <Link to='/adoptar'>
                                    <Button type="button" variant="btn btn-outline-warning btn-block" className='me-5'>Regresar</Button>
                                </Link>
                                <Button href="https://docs.google.com/forms/d/e/1FAIpQLScl546kYHW1Jlz8lb2Fiaq74cIeLXiF2OEi6X0XszkyagsTTw/viewform?embedded=true" target="_blank" type="button" variant="warning">Adoptar</Button>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default VerMascota;
