import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReportCard from './ReportCard';

function Reportes() {
  const { authData } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!authData || !authData.token) {
        console.error('No auth token available');
        return;
      }
      

      try {
        let apiUrl = '';
        if (authData.type === 'employee') {
          apiUrl = 'http://127.0.0.1:8000/api/reports';
        } else if (authData.type === 'client') {
          apiUrl = 'http://127.0.0.1:8000/api/user-reports';
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: 'application/json'
          }
        });
        
        setReports(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, [authData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  let pageTitle = 'Reportes';
  let rutaBoton = '/reporteadopcion';

  if (authData.type === 'client') {
    pageTitle = 'Mis reportes';
    rutaBoton = '/nuevoreporte'; // Cambiar por la dirección deseada para clientes
  }

  return (
    <div>
      {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}
      <Container>
        <div className='mt-5 d-flex flex-column align-items-center'>
          <div className='d-flex justify-content-center'>
            <h1 className="h1">{pageTitle}</h1>
          </div>

          <div className="ms-4 d-flex align-items-center mx-auto flex-column flex-md-row">
            <span className="badge mb-2 mb-md-0" style={{ backgroundColor: '#f1c40f', color: 'black' }}>Revisando</span>
            <span className="badge mb-2 mb-md-0 ms-md-2" style={{ backgroundColor: '#1abc9c', color: 'white' }}>Avanzando</span>
            <span className="badge ms-md-2" style={{ backgroundColor: '#27ae60', color: 'white' }}>Terminado</span>
          </div>

          <div className='d-flex justify-content-end align-items-center w-100'>
            <Link to={rutaBoton}>
              <Button type="submit" className="btn btn-warning btn-sm btn-block">Crear reporte</Button>
            </Link>
          </div>
        </div>

        <div className='d-flex flex-wrap justify-content-center'>
          {reports.map(report => (
            <ReportCard
              key={report.id}
              type={report.type_report}
              description={report.description}
              status={report.status}
              createdAt={report.created_at}
              id={report.id}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Reportes;
