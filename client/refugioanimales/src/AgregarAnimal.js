import { AuthContext } from './AuthContext';
import React, { useContext, useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import axios from 'axios';

function AgregarAnimal() {
    const { authData } = useContext(AuthContext);
    const [types, setTypes] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        sterilized: '',
        type_id: '',
        breed_id: '',
        birthdate: '',
        age: '',
        color: '',
        weight: '',
        size: '',
        health: '',
        description: '',
        animal_picture: null
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/types');
                setTypes(response.data.data);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        fetchTypes();
    }, []);

    useEffect(() => {
        const fetchBreeds = async () => {
            if (selectedType !== '') {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/breeds/${selectedType}`);
                    setBreeds(response.data.data);
                } catch (error) {
                    console.error('Error fetching breeds:', error);
                }
            }
        };

        fetchBreeds();
    }, [selectedType]);

    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        setSelectedType(typeId);
    
        // Update formData with type_id
        setFormData({
            ...formData,
            type_id: typeId // Set type_id directly to the selected value (ID)
        });
    };

    const handleBreedChange = (e) => {
        const breedId = e.target.value;
        setSelectedBreed(breedId);
    
        // Update formData with breed_id
        setFormData({
            ...formData,
            breed_id: breedId // Set breed_id directly to the selected value (ID)
        });
    };
    
    

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            animal_picture: e.target.files[0]
        });
    };

    const handleCloseModal = () => setShowModal(false);

    const handleShowModal = (success, message) => {
        setIsSuccess(success);
        setModalMessage(message);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authData || !authData.token) {
            console.error('No auth token available');
            return;
        }

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            await axios.post('http://127.0.0.1:8000/api/store-animals', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });

            handleShowModal(true, 'Animal guardado exitosamente');
        } catch (error) {
            console.error('Error al guardar el animal:', error);
            handleShowModal(false, 'Error al guardar el animal');
        }
    };

    if (!authData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}
            <Container>
                <div className='mt-5 d-flex mb-4'>
                    <div className='me-auto'>
                        <h1 className="h1">Agregar animal</h1>
                    </div>
                </div>
                <Container className="bg-white p-5 rounded shadow">
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" placeholder="Ingresa el nombre" onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                            <Form.Group controlId="gender">
                                <Form.Label>Sexo</Form.Label>
                                <Form.Select onChange={handleInputChange}>
                                    <option value="Macho">Macho</option>
                                    <option value="Hembra">Hembra</option>
                                </Form.Select>
                            </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="sterilized">
                                    <Form.Label>Esterilizado</Form.Label>
                                    <Form.Select onChange={handleInputChange}>
                                        <option value="No">No</option>
                                        <option value="Si">Si</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Group controlId="type_id">
                                    <Form.Label>Especie</Form.Label>
                                    <Form.Select value={selectedType} onChange={handleTypeChange}>
                                        <option value="">Selecciona una especie</option>
                                        {types.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="breed_id">
                                    <Form.Label>Raza</Form.Label>
                                    <Form.Select value={selectedBreed} onChange={handleBreedChange}>
                                        <option value="">Selecciona una raza</option>
                                        {breeds.map(breed => (
                                            <option key={breed.id} value={breed.id}>{breed.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="birthdate">
                                    <Form.Label>Fecha de nacimiento</Form.Label>
                                    <Form.Control type="date" onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="age">
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control type="text" placeholder="Escribe su edad" onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Group controlId="color">
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control type="text" placeholder="Ingresa el color" onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="weight">
                                    <Form.Label>Peso</Form.Label>
                                    <Form.Control type="text" placeholder="1 kg" onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="size">
                                    <Form.Label>Tamaño</Form.Label>
                                    <Form.Select onChange={handleInputChange}>
                                        <option value="Pequeño">Pequeño</option>
                                        <option value="Mediano">Mediano</option>
                                        <option value="Grande">Grande</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                            <Form.Group controlId="health">
                                <Form.Label>Salud</Form.Label>
                                <Form.Select onChange={handleInputChange}>
                                    <option value="Excelente">Excelente</option>
                                    <option value="Buena">Buena</option>
                                    <option value="Regular">Regular</option>
                                    <option value="Mala">Mala</option>
                                </Form.Select>
                            </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Describe al animal." onChange={handleInputChange} />
                        </Form.Group>
                    
                        <Form.Group className="mb-3" controlId="animal_picture">
                            <Form.Label>Foto del animal</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>

                        <div className='d-flex justify-content-center'>
                            <Button variant="outline-warning" as={Link} to="/adoptar" style={{ marginRight: '5%' }}>Regresar</Button>
                            <Button variant="warning" type="submit">Guardar</Button>
                        </div>
                </Form>
            </Container>
        </Container>

        {/* Modal para mostrar mensaje de éxito o error */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isSuccess ? 'Éxito' : 'Error'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
);
}

export default AgregarAnimal;