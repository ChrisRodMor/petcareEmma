import { useState, useContext } from 'react';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useEffect } from 'react';

function ReporteAdopcion() {
  const { authData } = useContext(AuthContext);
  const [reportType] = useState('Reporte de adopción');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [animales, setAnimales] = useState([]);
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);



  const [formData, setFormData] = useState({
    user_id: '',
    animal_id: '',
    description: ''
  });

  useEffect(() => {
    if (!authData || !authData.token) return; // Espera a que esté disponible

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${authData.token}`,
          Accept: 'application/json',
        };

        const [clientesRes, animalesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/clients', { headers }),
          axios.get('http://127.0.0.1:8000/api/animals', { headers }),
        ]);

        setClientes(clientesRes.data.data);
        setAnimales(animalesRes.data.data);
      } catch (err) {
        setError('Error al cargar datos de clientes o animales.');
      }
    };

    fetchData();
  }, [authData]); // solo se ejecuta cuando authData cambia


  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });

    setValidationErrors({ ...validationErrors, [id]: null });

    if (id === 'animal_id') {
      const seleccionado = animales.find(a => a.id === parseInt(value));
      setAnimalSeleccionado(seleccionado || null);
    }

    if (id === 'user_id') {
    const seleccionado = clientes.find(c => c.user.id === parseInt(value));
    setClienteSeleccionado(seleccionado || null);
  }

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
      setAnimalSeleccionado(null);
      setClienteSeleccionado(null);
    } catch (error) {
      if (error.response?.status === 422) {
        // Laravel validation error
        setValidationErrors(error.response.data.errors || {});
      } else if (error.response?.data?.message) {
        setError(error.response.data.message); // Ej. animal ya adoptado
      } else {
        setError('Error al guardar el reporte.');
      }

      setFormData({ user_id: '', animal_id: '', description: '' });
      setAnimalSeleccionado(null);
      setClienteSeleccionado(null);
    }
  };

  return (
    <div>
      {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}
      <Container className="mb-5">
        <div className="mt-5 d-flex mb-5">
          <div className="me-auto">
            <h1 className="h1">{reportType}</h1>
          </div>
        </div>
        <Container className="bg-white p-5 rounded shadow mb-5">
          <Container className="d-flex text-align-center align-items-center">
            <Form onSubmit={handleSubmit} className="col-12">
              <Form.Group className="mb-3" controlId="user_id">
                <Form.Label>Selecciona Cliente</Form.Label>
                <Form.Select
                  value={formData.user_id}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.user_id}
                >
                  <option value="">Seleccione un cliente...</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.user.id}>
                      {cliente.user.name}
                    </option>
                  ))}
                </Form.Select>
                {clienteSeleccionado && (
                  <div className="border rounded p-3 mt-3 bg-light">
                    <h5>Ficha del cliente</h5>
                    <div className="d-flex align-items-start flex-wrap">
                      <img
                        src={`http://127.0.0.1:8000/${clienteSeleccionado.user.file_path}`}
                        alt="Foto del cliente"
                        className="me-4 mb-3 rounded"
                        style={{ width: '170px', height: 'auto' }}
                      />
                      <div className="me-5">
                        <p><strong>Nombre:</strong> {clienteSeleccionado.user.name}</p>
                        <p><strong>Email:</strong> {clienteSeleccionado.user.email}</p>
                        <p><strong>Teléfono:</strong> {clienteSeleccionado.user.phone}</p>
                      </div>
                      <div>
                        <p><strong>Dirección:</strong> {clienteSeleccionado.user.address}</p>
                        <p><strong>Fecha de nacimiento:</strong> {clienteSeleccionado.user.birthdate}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Form.Control.Feedback type="invalid">
                  {validationErrors.user_id}
                </Form.Control.Feedback>
              </Form.Group>



              <Form.Group className="mb-3" controlId="animal_id">
                <Form.Label>Selecciona Animal</Form.Label>
                <Form.Select
                  value={formData.animal_id}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.animal_id}
                >
                  <option value="">Seleccione una mascota...</option>
                  {animales.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                       {animal.name}
                    </option>
                  ))}
                </Form.Select>
                {animalSeleccionado && (
                  <div className="border rounded p-3 mt-3 bg-light">
                    <h5>Ficha de la mascota</h5>
                    <div className="d-flex align-items-start">
                      <img
                        src={`http://127.0.0.1:8000/${animalSeleccionado.file_path}`}
                        alt="Foto del animal"
                        className="me-4 mb-3 rounded"
                        style={{ width: '170px', height: 'auto' }}
                      />
                      <div className="me-5">
                        <p><strong>Nombre:</strong> {animalSeleccionado.name}</p>
                        <p><strong>Edad:</strong> {animalSeleccionado.age}</p>
                        <p><strong>Color:</strong> {animalSeleccionado.color}</p>
                        <p><strong>Salud:</strong> {animalSeleccionado.health}</p>
                      </div>
                      <div>
                        <p><strong>Genero:</strong> {animalSeleccionado.gender}</p>
                        <p><strong>Esterilizad@:</strong> {animalSeleccionado.sterilized}</p>
                        <p><strong>Descripcion:</strong> {animalSeleccionado.description}</p>
                        <p><strong>Tamaño:</strong> {animalSeleccionado.size}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Form.Control.Feedback type="invalid">
                  {validationErrors.animal_id}
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Es necesario indicar quien adopta a dicha mascota y de igual forma el nombre de la misma."
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.description}
                </Form.Control.Feedback>
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <div className="col-md-12 text-center">
                <Link to="/reportes">
                  <Button variant="warning" style={{ marginRight: '5%' }}>
                    Regresar
                  </Button>
                </Link>
                <Button type="submit" variant="warning">
                  Adoptar
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