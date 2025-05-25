import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Col, Row, Modal, Form } from 'react-bootstrap';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
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
    const [validationErrors, setValidationErrors] = useState({});
    const [vaccineValidationErrors, setVaccineValidationErrors] = useState({});
    const [showVaccineModal, setShowVaccineModal] = useState(false);
    const [vaccineFormData, setVaccineFormData] = useState({
        vaccine_brand: '',
        vaccine_type: '',
        application_date: '',
        doctor_name: '',
        doctor_license: '',
        vaccine_batch: ''
    });



    const reasons = [
        'Reubicación',
        'Fallecimiento',
        'Error de registro',
        'Escape o desaparición',
        'Caso especial (otros)'
    ];



    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/animals/${id}`);
                setMascota(response.data.data);
            } catch (error) {
                console.error('Error fetching pet details:', error);
            }
        };

        const fetchVacunas = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/vaccines/${id}`);
                setVacunas(response.data.data);
            } catch (error) {
                console.error('Error fetching vaccines:', error);
                setVacunas([]); // En caso de error, establecer un array vacío para evitar el problema de undefined
            }
        };
        
        fetchMascota();
        fetchVacunas();
    }, [id,mascota]);

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

    if (!authData) {
        return <div>Loading...</div>;
    }

    const handleOpenEditModal = () => {
        setEditFormData({
            name: mascota.name || '',
            gender: mascota.gender || '',
            sterilized: mascota.sterilized || '',
            birthdate: mascota.birthdate || '',
            age: mascota.age || '',
            color: mascota.color || '',
            weight: mascota.weight || '',
            size: mascota.size || '',
            health: mascota.health || '',
            description: mascota.description || '',
            type_id: mascota.type_id || '',
            breed_id: mascota.breed_id || '',
        });
        setValidationErrors({});
        setShowEditModal(true);
    };

    const handleEditarAnimal = async () => {
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();

        Object.entries(editFormData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update-animals/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            },
            body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
            if (response.status === 422) {
                setValidationErrors(data.errors || {});
            } else {
                setValidationErrors({});
                setError(data.message || 'Error al editar el animal');
            }
            } else {
            setValidationErrors({});
            setShowEditModal(false);
            setSuccess('Animal actualizado exitosamente.');
            setTimeout(() => window.location.reload(), 2000);
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor.');
        }
    };



    const handleEliminarAnimal = () => {
        if (!deleteReason) {
            setError('Debes seleccionar un motivo para eliminar.');
            return;
        }

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('reason', deleteReason);

        fetch(`http://127.0.0.1:8000/api/delete-animals/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            body: formData
        })
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(({ status, body }) => {
                if (status === 200) {
                    setSuccess('Animal eliminado exitosamente.');
                    setError(null);
                    setTimeout(() => {
                        window.location.href = '/adoptar';
                    }, 2000);
                } else {
                    setError(body.message || 'Ocurrió un error al eliminar el animal.');
                    setSuccess(null);
                }
            })
            .catch(err => {
                console.error(err);
                setError('Error de conexión con el servidor.');
                setSuccess(null);
            });
    };

    const handleAgregarVacuna = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        Object.entries(vaccineFormData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/store-vaccine/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    setVaccineValidationErrors(data.errors);
                } else {
                    throw new Error(data.message || 'Error al registrar la vacuna');
                }
                return;
            }

            setShowVaccineModal(false);
            setSuccess('Vacuna registrada exitosamente.');
            setError(null);
            setVaccineValidationErrors({});
            setTimeout(() => window.location.reload(), 2000);

        } catch (error) {
            console.error(error);
            setError(error.message || 'Error de conexión al servidor');
            setSuccess(null);
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
                                        {authData.type === 'employee' && (
                                            <Button variant="outline-dark" size="sm" onClick={() => setShowVaccineModal(true)}>+</Button>
                                        )}
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
                                <Button href="https://docs.google.com/forms/d/e/1FAIpQLScl546kYHW1Jlz8lb2Fiaq74cIeLXiF2OEi6X0XszkyagsTTw/viewform?embedded=true" className="me-5" target="_blank" type="button" variant="warning">Adoptar</Button>
                                {authData.type === 'employee' && (
                                    <>
                                        <Button variant="success" className="me-5" onClick={handleOpenEditModal}>
                                            Editar
                                        </Button>
                                        <br></br>
                                        <Button
                                            variant="danger"
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            Eliminar
                                        </Button>
                                    </>
                                )}

                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar mascota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Group className="mb-2" controlId="name">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        isInvalid={!!validationErrors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="gender">
                        <Form.Label>Género</Form.Label>
                        <Form.Select
                        value={editFormData.gender}
                        onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                        isInvalid={!!validationErrors.gender}
                        >
                        <option value="">Selecciona</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.gender}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="sterilized">
                        <Form.Label>Esterilizado</Form.Label>
                        <Form.Select
                        value={editFormData.sterilized}
                        onChange={(e) => setEditFormData({ ...editFormData, sterilized: e.target.value })}
                        isInvalid={!!validationErrors.sterilized}
                        >
                        <option value="">Selecciona</option>
                        <option value="Si">Sí</option>
                        <option value="No">No</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.sterilized}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="birthdate">
                        <Form.Label>Fecha de nacimiento</Form.Label>
                        <Form.Control
                        type="date"
                        value={editFormData.birthdate}
                        onChange={(e) => setEditFormData({ ...editFormData, birthdate: e.target.value })}
                        isInvalid={!!validationErrors.birthdate}
                        />
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.birthdate}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="age">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control
                        type="text"
                        value={editFormData.age}
                        onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                        isInvalid={!!validationErrors.age}
                        />
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.age}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="color">
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                        type="text"
                        value={editFormData.color}
                        onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
                        isInvalid={!!validationErrors.color}
                        />
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.color}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="weight">
                        <Form.Label>Peso</Form.Label>
                        <Form.Control
                        type="number"
                        value={editFormData.weight}
                        onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                        isInvalid={!!validationErrors.weight}
                        />
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.weight}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="size">
                        <Form.Label>Tamaño</Form.Label>
                        <Form.Select
                        value={editFormData.size}
                        onChange={(e) => setEditFormData({ ...editFormData, size: e.target.value })}
                        isInvalid={!!validationErrors.size}
                        >
                        <option value="">Selecciona</option>
                        <option value="Pequeño">Pequeño</option>
                        <option value="Mediano">Mediano</option>
                        <option value="Grande">Grande</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.size}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="editHealth">
                        <Form.Label>Salud</Form.Label>
                        <Form.Select
                            name="health"
                            value={editFormData.health}
                            onChange={(e) => setEditFormData({ ...editFormData, health: e.target.value })}
                            isInvalid={!!validationErrors.health}
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Mala">Mala</option>
                            <option value="Regular">Regular</option>
                            <option value="Buena">Buena</option>
                            <option value="Excelente">Excelente</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.health}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="description">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows={3}
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        isInvalid={!!validationErrors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                        {validationErrors.description}
                        </Form.Control.Feedback>
                    </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                    Cancelar
                    </Button>
                    <Button variant="success" onClick={handleEditarAnimal}>
                    Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Motivo de baja</Form.Label>
                        <Form.Select value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)}>
                            <option value="">Selecciona una opción...</option>
                            {reasons.map((r, i) => (
                                <option key={i} value={r}>{r}</option>
                            ))}
                        </Form.Select>
                        <br></br>
                        {error && <div className="alert alert-danger text-center">{error}</div>}
                        {success && <div className="alert alert-success text-center">{success}</div>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleEliminarAnimal}>Confirmar eliminación</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showVaccineModal} onHide={() => setShowVaccineModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Vacuna</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control
                                type="text"
                                value={vaccineFormData.vaccine_brand}
                                onChange={(e) => setVaccineFormData({ ...vaccineFormData, vaccine_brand: e.target.value })}
                                isInvalid={!!vaccineValidationErrors.vaccine_brand}
                            />
                            <Form.Control.Feedback type="invalid">
                                {vaccineValidationErrors.vaccine_brand}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                type="text"
                                value={vaccineFormData.vaccine_type}
                                onChange={(e) => setVaccineFormData({ ...vaccineFormData, vaccine_type: e.target.value })}
                                isInvalid={!!vaccineValidationErrors.vaccine_type}
                            />
                            <Form.Control.Feedback type="invalid">
                                {vaccineValidationErrors.vaccine_type}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Lote</Form.Label>
                            <Form.Control
                                type="text"
                                value={vaccineFormData.vaccine_batch}
                                onChange={(e) => setVaccineFormData({ ...vaccineFormData, vaccine_batch: e.target.value })}
                                isInvalid={!!vaccineValidationErrors.vaccine_batch}
                            />
                            <Form.Control.Feedback type="invalid">
                                {vaccineValidationErrors.vaccine_batch}
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group className="mb-2">
                            <Form.Label>Fecha de aplicación</Form.Label>
                            <Form.Control
                                type="date"
                                value={vaccineFormData.application_date}
                                onChange={(e) => setVaccineFormData({ ...vaccineFormData, application_date: e.target.value })}
                                isInvalid={!!vaccineValidationErrors.application_date}
                            />
                            <Form.Control.Feedback type="invalid">
                                {vaccineValidationErrors.application_date}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Nombre del Doctor</Form.Label>
                            <Form.Control
                                type="text"
                                value={vaccineFormData.doctor_name}
                                onChange={(e) => setVaccineFormData({ ...vaccineFormData, doctor_name: e.target.value })}
                                isInvalid={!!vaccineValidationErrors.doctor_name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {vaccineValidationErrors.doctor_name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Licencia del Doctor</Form.Label>
                            <Form.Control
                                type="text"
                                value={vaccineFormData.doctor_license}
                                onChange={(e) => setVaccineFormData({ ...vaccineFormData, doctor_license: e.target.value })}
                                isInvalid={!!vaccineValidationErrors.doctor_license}
                            />
                            <Form.Control.Feedback type="invalid">
                                {vaccineValidationErrors.doctor_license}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowVaccineModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleAgregarVacuna}>Agregar</Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
}

export default VerMascota;
