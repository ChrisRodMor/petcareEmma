import React, { useState, useContext } from 'react';
import Navbarcliente from './Navbarcliente';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Importa el contexto de autenticación

function ReporteAdopcion() {
  const { authData } = useContext(AuthContext); // Obtiene authData del contexto
  const [reportType] = useState('Reporte de adopcion');
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    user_id: '',
    animal_id: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar existencia de IDs de cliente y animal
    try {
      const [clientResponse, animalResponse] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/clients/${formData.user_id}`, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: 'application/json'
          }
        }),
        axios.get(`http://127.0.0.1:8000/api/animals/${formData.animal_id}`, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: 'application/json'
          }
        })
      ]);

      // Si alguno de los IDs no existe, muestra un error y no envía el formulario
      if (clientResponse.data.error || animalResponse.data.error) {
        setError('ID de cliente o animal no encontrado.');
        return;
      }

      // Si ambos IDs existen, procede a enviar el formulario
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('animal_id', formData.animal_id);
      formDataToSend.append('description', formData.description);

      await axios.post('http://127.0.0.1:8000/api/store-adoption-report', formDataToSend, {
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

  return (
    <div>
      <Navbarcliente />
      <Container className="mb-5">
        <div className="mt-5 d-flex mb-5">
          <div className="me-auto">
            <h1 className="h1">{reportType}</h1>
          </div>
        </div>
        <Container className="bg-white p-5 rounded shadow mb-5">
          {error && <Alert variant="danger">{error}</Alert>}
          <Container className="d-flex text-align-center align-items-center">
            <Form onSubmit={handleSubmit} className="col-12">

                <Form.Group className="mb-3" controlId="user_id">
                    <Form.Label>ID Cliente</Form.Label>
                    <Form.Control type="number" placeholder="Ingrese aquí su identificador..." onChange={handleInputChange} min={1}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="animal_id">
                    <Form.Label>ID Animal</Form.Label>
                    <Form.Control type="number" placeholder="Identificador de la mascota a adoptar" onChange={handleInputChange} min={1}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Describa aquí los detalles de la adopción" onChange={handleInputChange} />
                </Form.Group>

                <div className="col-md-12 text-center">
                  <Link to="/reportes">
                    <Button variant="outline-warning" className="btn-block" style={{ marginRight: '5%' }}>Regresar</Button>
                  </Link>
                  <Button type="submit" variant="warning">Guardar</Button>
                </div>
              
            </Form>
          </Container>
        </Container>
      </Container>
    </div>
  );
}

export default ReporteAdopcion;
