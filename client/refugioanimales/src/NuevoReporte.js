import React, { useState, useEffect, useContext } from 'react';
import Navbarcliente from './Navbarcliente';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Importa el contexto de autenticación

function NuevoReporte() {
  const { authData } = useContext(AuthContext); // Obtiene authData del contexto
  const [reportType, setReportType] = useState('Reporte de maltrato');
  const [formData, setFormData] = useState({
    date_event: '',
    hour_event: '',
    pet_name: '',
    petBirthDate: '',
    type_id: '',
    breed_id: '',
    pet_color: '',
    petSize: '',
    pet_gender: '',
    animal_picture: null,
    description: '',
    direction_event: '',
  });
  const [types, setTypes] = useState([]); // Estado para almacenar los tipos de mascotas
  const [breeds, setBreeds] = useState([]); // Estado para almacenar las razas de mascotas filtradas por tipo seleccionado
  const [selectedType, setSelectedType] = useState(''); // Estado para almacenar el tipo seleccionado
  const [selectedBreed, setSelectedBreed] = useState(''); // Estado para almacenar la raza seleccionada

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
    setFormData({
      ...formData,
      type_id: typeId,
    });
  };

  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);
    setFormData({
      ...formData,
      breed_id: breedId,
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
        ...formData,
        animal_picture: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint =
      reportType === 'Reporte de maltrato'
        ? 'http://127.0.0.1:8000/api/store-abuse-report'
        : 'http://127.0.0.1:8000/api/store-lost-pet';

    const formDataToSend = new FormData();

    formDataToSend.append('date_event', formData.date_event);
    formDataToSend.append('hour_event', formData.hour_event + ':00');
    formDataToSend.append('description', formData.description);

    if (reportType === 'Reporte de maltrato') {
      formDataToSend.append('direction_event', formData.direction_event);
    } else {
      formDataToSend.append('pet_name', formData.pet_name);
      formDataToSend.append('petBirthDate', formData.petBirthDate);
      formDataToSend.append('type_id', formData.type_id);
      formDataToSend.append('breed_id', formData.breed_id);
      formDataToSend.append('pet_color', formData.pet_color);
      formDataToSend.append('petSize', formData.petSize);
      formDataToSend.append('pet_gender', formData.pet_gender);
      formDataToSend.append('animal_picture', formData.animal_picture);
    }

    try {
      await axios.post(apiEndpoint, formDataToSend, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Reporte guardado con éxito');
    } catch (error) {
      console.error('Error al guardar el reporte:', error);
      alert('Hubo un error al guardar el reporte');
    }
  };

  const renderAdditionalFields = () => {
    switch (reportType) {
      case 'Reporte de mascota perdida':
        return (
          <>
            <Form.Group className="mb-3" controlId="animal_picture">
                <Form.Label>Foto del animal</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pet_name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre de la mascota" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="petBirthDate">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control type="date" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="type_id">
              <Form.Label>Especie</Form.Label>
              <Form.Control as="select" onChange={handleTypeChange} value={selectedType}>
                <option value="">Selecciona una especie</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="breed_id">
              <Form.Label>Raza</Form.Label>
              <Form.Control as="select" onChange={handleBreedChange} value={selectedBreed}>
                <option value="">Selecciona una raza</option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="pet_color">
              <Form.Label>Color</Form.Label>
              <Form.Control type="text" placeholder="Color" onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="petSize">
              <Form.Label>Tamaño</Form.Label>
              <Form.Control as="select" onChange={handleInputChange}>
                <option>Pequeño</option>
                <option>Mediano</option>
                <option>Grande</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="pet_gender">
              <Form.Label>Género</Form.Label>
              <Form.Control as="select" onChange={handleInputChange}>
                <option>Macho</option>
                <option>Hembra</option>
              </Form.Control>
            </Form.Group>
          </>
        );
      case 'Reporte de maltrato':
        return (
          <Form.Group className="mb-3" controlId="direction_event">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" placeholder="Última vez visto..." onChange={handleInputChange} />
          </Form.Group>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbarcliente />
      <Container className="mb-5">
        <div className="mt-5 d-flex mb-5">
          <div className="me-auto">
            <h1 className="h1">Nuevo reporte</h1>
          </div>
        </div>
        <Container className="bg-white p-5 rounded shadow mb-5">
          <Container className="d-flex text-align-center align-items-center">
            <Form onSubmit={handleSubmit} className="col-12">
              <Form.Group className="mb-3" controlId="reportType">
                <Form.Label>Tipo</Form.Label>
                <Form.Control as="select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option>Reporte de maltrato</option>
                  <option>Reporte de mascota perdida</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="date_event">
                <Form.Label>Fecha de los hechos</Form.Label>
                <Form.Control type="date" onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="hour_event">
                <Form.Label>Hora de los hechos</Form.Label>
                <Form.Control type="time" onChange={handleInputChange} />
              </Form.Group>
              {renderAdditionalFields()}
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Descripción de los hechos</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Describe los hechos" onChange={handleInputChange} />
              </Form.Group>
              <div className="row">
                <div className="col-md-12 text-center">
                  <Link to="/reportes">
                    <Button variant="outline-warning" className="btn-block" style={{ marginRight: '5%' }}>Regresar</Button>
                  </Link>
                  <Button type="submit" variant="warning">Guardar</Button>
                </div>
              </div>
            </Form>
          </Container>
        </Container>
      </Container>
    </div>
  );
}

export default NuevoReporte;
