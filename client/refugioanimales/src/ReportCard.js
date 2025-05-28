import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, Modal, Spinner, Image } from 'react-bootstrap';
import { BsCalendarDate } from 'react-icons/bs';

const ReportCard = ({ type, description, status, createdAt, id }) => {
  const [show, setShow] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Revisando':
        return 'warning';
      case 'Avanzando':
        return 'info';
      case 'Terminado':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const handleShow = async () => {
    setShow(true);
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Ajusta si lo guardas con otro nombre
      const res = await fetch(`http://127.0.0.1:8000/api/report/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setReportData(json.data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    setShow(false);
    setReportData(null);
  };

  return (
    <>
      <div
        className={`card border-${getStatusColor(status)}`}
        style={{
          width: '300px',
          height: '250px',
          margin: '1rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          className={`card-header bg-${getStatusColor(status)} text-${getStatusColor(status) === 'warning' ? 'dark' : 'white'}`}
          style={{ fontWeight: 'bold', textAlign: 'center', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', padding: '0.75rem' }}
        >
          {type.toUpperCase()}
        </div>
        <div className="card-body d-flex flex-column justify-content-between" style={{ padding: '1rem' }}>
          <div className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
            <BsCalendarDate style={{ marginRight: '5px' }} />
            {new Date(createdAt).toLocaleDateString()}
          </div>
          <p
            style={{
              fontSize: '0.95rem',
              flexGrow: 1,
              textAlign: 'justify',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              marginBottom: '1rem'
            }}
          >
            {description}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <Badge bg={getStatusColor(status)} className="px-3 py-2 text-uppercase">
              {status}
            </Badge>
            <Button variant="secondary" size="sm" onClick={handleShow}>
              <i className="bi bi-eye-fill"></i>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal con más información */}
      <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del reporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando datos...</p>
            </div>
          ) : reportData ? (
            <>
              <p><strong>Tipo de reporte: </strong> {reportData.type_report}</p>
              <p><strong>ID:</strong> {reportData.id}</p>
              <p><strong>Estado:</strong> {reportData.status}</p>
              <p><strong>Descripción:</strong> {reportData.description}</p>
              {reportData.type_report === "MASCOTA_PERDIDA" && reportData.lost_pet_report && (
                <>
                  <div className="mb-3">
                    <p><strong>Nombre:</strong> {reportData.lost_pet_report.pet_name}</p>
                    <p><strong>Género:</strong> {reportData.lost_pet_report.pet_gender}</p>
                    <p><strong>Color:</strong> {reportData.lost_pet_report.pet_color}</p>
                    <p><strong>Especie:</strong> {reportData.lost_pet_report.type.name}</p>
                    <p><strong>Raza:</strong> {reportData.lost_pet_report.breed.name}</p>
                    <p><strong>Fecha del evento:</strong> {reportData.lost_pet_report.date_event}</p>
                    <p><strong>¿Encontrado?:</strong> {reportData.lost_pet_report.is_found ? 'Sí' : 'No'}</p>
                  </div>

                  <div className="d-flex justify-content-center mb-3">
                    {reportData.lost_pet_report.file_path ? (
                      <img
                        src={`http://127.0.0.1:8000/${reportData.lost_pet_report.file_path}`}
                        alt="Mascota perdida"
                        style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '0.75rem' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.replaceWith(document.createTextNode('Imagen no localizada'));
                        }}
                      />
                    ) : (
                      <div style={{ width: '180px', textAlign: 'center' }}>Imagen no localizada</div>
                    )}
                  </div>
                </>
              )}


              {reportData.type_report === "ADOPCION" && reportData.adoption_report && (
                <>
                  <div className="mb-3">
                    <p><strong>Nombre:</strong> {reportData.adoption_report.animal.name}</p>
                    <p><strong>Género:</strong> {reportData.adoption_report.animal.gender}</p>
                    <p><strong>Color:</strong> {reportData.adoption_report.animal.color}</p>
                    <p><strong>Edad:</strong> {reportData.adoption_report.animal.age}</p>
                    <p><strong>Tamaño:</strong> {reportData.adoption_report.animal.size}</p>
                    <p><strong>Peso:</strong> {reportData.adoption_report.animal.weight} kg</p>
                    <p><strong>Salud:</strong> {reportData.adoption_report.animal.health}</p>
                    <p><strong>Esterilizado:</strong> {reportData.adoption_report.animal.sterilized}</p>
                    <p><strong>Especie:</strong> {reportData.adoption_report.animal.type.name}</p>
                    <p><strong>Raza:</strong> {reportData.adoption_report.animal.breed.name}</p>
                    <p><strong>Descripción:</strong> {reportData.adoption_report.animal.description}</p>
                  </div>

                  <div className="d-flex justify-content-center mb-3">
                    {reportData.adoption_report.animal.file_path ? (
                      <img
                        src={`http://127.0.0.1:8000/${reportData.adoption_report.animal.file_path}`}
                        alt="Animal adoptado"
                        style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '0.75rem' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.replaceWith(document.createTextNode('Imagen no localizada'));
                        }}
                      />
                    ) : (
                      <div style={{ width: '180px', textAlign: 'center' }}>Imagen no localizada</div>
                    )}
                  </div>
                </>
              )}


              {reportData.type_report === "MALTRATO" && reportData.abuse_report && (
                <>
                  <p><strong>Dirección del evento:</strong> {reportData.abuse_report.direction_event}</p>
                  <p><strong>Fecha del evento:</strong> {reportData.abuse_report.date_event}</p>
                  <p><strong>Hora del evento:</strong> {reportData.abuse_report.hour_event}</p>
                </>
              )}
            </>
          ) : (
            <p>No se pudo cargar la información.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReportCard;
