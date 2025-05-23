import { AuthContext } from './AuthContext';
import { useContext, useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import axios from 'axios';

function AgregarAnimal() {
    const { authData } = useContext(AuthContext);
    const [validationErrors, setValidationErrors] = useState({});
    const [types, setTypes] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


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
    const { id, value } = e.target;

    if (id === 'birthdate') {
        const edad = calcularEdad(value);
        setFormData({
        ...formData,
        birthdate: value,
        age: `${edad} años`
        });
    } else {
        setFormData({
        ...formData,
        [id]: value
        });
    }
    };


    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            animal_picture: e.target.files[0]
        });
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

            // Si fue exitoso
            setSuccess('Animal guardado exitosamente');
            setError(null);
            setValidationErrors({});

            // Limpiar el formulario
            setFormData({
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
            setSelectedType('');
            setSelectedBreed('');
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
                setError('Corrige los campos marcados.');
                setSuccess(null);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
                setSuccess(null);
            } else {
                setError('Error al guardar el animal.');
                setSuccess(null);
            }
        }
    };

    const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad;
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
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el nombre"
                                        id="name"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="gender">
                                    <Form.Label>Sexo</Form.Label>
                                    <Form.Select
                                        id="gender"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.gender}
                                    >
                                        <option value="">Selecciona sexo</option>
                                        <option value="Macho">Macho</option>
                                        <option value="Hembra">Hembra</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.gender}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="sterilized">
                                    <Form.Label>Esterilizado</Form.Label>
                                    <Form.Select
                                        id="sterilized"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.sterilized}
                                    >
                                        <option value="">Selecciona opción</option>
                                        <option value="No">No</option>
                                        <option value="Si">Sí</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.sterilized}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Group controlId="type_id">
                                    <Form.Label>Especie</Form.Label>
                                    <Form.Select
                                        id="type_id"
                                        value={selectedType}
                                        onChange={handleTypeChange}
                                        isInvalid={!!validationErrors.type_id}
                                    >
                                        <option value="">Selecciona una especie</option>
                                        {types.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.type_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="breed_id">
                                    <Form.Label>Raza</Form.Label>
                                    <Form.Select
                                        id="breed_id"
                                        value={selectedBreed}
                                        onChange={handleBreedChange}
                                        isInvalid={!!validationErrors.breed_id}
                                    >
                                        <option value="">Selecciona una raza</option>
                                        {breeds.map(breed => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.breed_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="birthdate">
                                    <Form.Label>Fecha de nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        id="birthdate"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.birthdate}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.birthdate}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="age">
                                    <Form.Label>Edad en años</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="age"
                                        value={formData.age}
                                        disabled
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.age}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.age}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Group controlId="color">
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el color"
                                        id="color"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.color}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.color}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="weight">
                                    <Form.Label>Peso</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="1 kg"
                                        id="weight"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.weight}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.weight}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="size">
                                    <Form.Label>Tamaño</Form.Label>
                                    <Form.Select
                                        id="size"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.size}
                                    >
                                        <option value="">Selecciona tamaño</option>
                                        <option value="Pequeño">Pequeño</option>
                                        <option value="Mediano">Mediano</option>
                                        <option value="Grande">Grande</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.size}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="health">
                                    <Form.Label>Salud</Form.Label>
                                    <Form.Select
                                        id="health"
                                        onChange={handleInputChange}
                                        isInvalid={!!validationErrors.health}
                                    >
                                        <option value="">Selecciona estado</option>
                                        <option value="Excelente">Excelente</option>
                                        <option value="Buena">Buena</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Mala">Mala</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.health}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="description">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe al animal."
                                id="description"
                                onChange={handleInputChange}
                                isInvalid={!!validationErrors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                    
                        <Form.Group controlId="animal_picture">
                            <Form.Label>Foto del animal</Form.Label>
                            <Form.Control
                                type="file"
                                id="animal_picture"
                                onChange={handleFileChange}
                                isInvalid={!!validationErrors.animal_picture}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.animal_picture}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <br></br>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}


                        <div className='d-flex justify-content-center'>
                            <Button variant="outline-warning" as={Link} to="/adoptar" style={{ marginRight: '5%' }}>Regresar</Button>
                            <Button variant="warning" type="submit">Guardar</Button>
                        </div>
                </Form>
            </Container>
        </Container>

    </div>
);
}

export default AgregarAnimal;