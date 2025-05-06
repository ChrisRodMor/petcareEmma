import React, { useState, useContext } from 'react';
import Navbarcliente from './Navbarcliente';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

function ReporteAdopcion() {
  const { authData } = useContext(AuthContext);
  const [reportType] = useState('Reporte de adopción');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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
    setValidationErrors({ ...validationErrors, [id]: null }); // Limpiar error del campo al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('animal_id', formData.animal_id);
      formDataToSend.append('description', formData.description);

      const response = await axios.post('http://127.0.0.1:8000/api/store-adoption-report', formDataToSend, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.message);
      setFormData({ user_id: '', animal_id: '', description: '' }); // Limpiar campos
    } catch (error) {
      if (error.response?.status === 422) {
        // Laravel validation error
        setValidationErrors(error.response.data.errors || {});
      } else if (error.response?.data?.message) {
        setError(error.response.data.message); // Ej. animal ya adoptado
      } else {
        setError('Error al guardar el reporte.');
      }
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
          {success && <Alert variant="success">{success}</Alert>}
          <Container className="d-flex text-align-center align-items-center">
            <Form onSubmit={handleSubmit} className="col-12">
              <Form.Group className="mb-3" controlId="user_id">
                <Form.Label>ID Cliente</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese aquí su identificador..."
                  value={formData.user_id}
                  onChange={handleInputChange}
                  min={1}
                  isInvalid={!!validationErrors.user_id}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.user_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="animal_id">
                <Form.Label>ID Animal</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Identificador de la mascota a adoptar"
                  value={formData.animal_id}
                  onChange={handleInputChange}
                  min={1}
                  isInvalid={!!validationErrors.animal_id}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.animal_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Describa aquí los detalles de la adopción"
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="col-md-12 text-center">
                <Link to="/reportes">
                  <Button variant="outline-warning" className="btn-block" style={{ marginRight: '5%' }}>
                    Regresar
                  </Button>
                </Link>
                <Button type="submit" variant="warning">
                  Guardar
                </Button>
              </div>
            </Form>
          </Container>
        </Container>
      </Container>
    </div>
  );
}

export default ReporteAdopcion;
