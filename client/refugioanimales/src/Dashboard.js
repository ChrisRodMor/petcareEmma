import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import Navbaremployee from './Navbaremployee';
import { Container, Row, Col } from 'react-bootstrap';
import './contenedor.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Dashboard() {
  const [animalData, setAnimalData] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    fetch('http://127.0.0.1:8000/api/dashboard/animals/counts', { headers })
      .then(res => res.json())
      .then(data => {
        setAnimalData(data);

        fetch('http://127.0.0.1:8000/api/dashboard/animals/deletions', { headers })
          .then(res => res.json())
          .then(deletions => {
            setAnimalData(prev => ({ ...prev, deletions }));

            return fetch('http://127.0.0.1:8000/api/dashboard/animals/income', { headers });
          })
          .then(res => res.json())
          .then(income => {
            setAnimalData(prev => ({ ...prev, income }));

            return fetch('http://127.0.0.1:8000/api/dashboard/adoptions', { headers });
          })
          .then(res => res.json())
          .then(adoptions => {
            setAnimalData(prev => ({ ...prev, adoptions }));

            return fetch('http://127.0.0.1:8000/api/dashboard/reports', { headers });
          })
          .then(res => res.json())
          .then(reports => {
            setAnimalData(prev => ({ ...prev, reports }));

            return fetch('http://127.0.0.1:8000/api/dashboard/lost-pets', { headers });
          })
          .then(res => res.json())
          .then(lostPets => {
            setAnimalData(prev => ({ ...prev, lostPets }));
          });
      });
  }, []);

  return (
    <div>
      <Navbaremployee />
      <Container>
        <div className="mt-5 d-flex mb-5">
          <div className="me-auto">
            <h1 className="h1">Panel de control</h1>
          </div>
        </div>

        <Container className="bg-white p-5 rounded shadow">
          {!animalData ? (
            <p>Cargando datos...</p>
          ) : (
            <Row className="align-items-stretch">
              <Col md={6} className="mb-4">
                <h5 className="text-center">Animales por Tipo</h5>
                <p className="text-center text-muted">
                  Total registrados: {animalData.total_active}
                </p>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={{
                      labels: animalData.by_type.labels,
                      datasets: [{
                        label: 'Cantidad',
                        data: animalData.by_type.data,
                        backgroundColor: 'rgba(75,192,192,0.5)',
                      }],
                    }}
                    options={chartOptions}
                  />
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Tamaño</h5>
                <div style={{ height: '300px' }}>
                  <Doughnut
                    data={{
                      labels: animalData.by_size.labels,
                      datasets: [{
                        data: animalData.by_size.data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                      }],
                    }}
                    options={chartOptions}
                  />
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Estado de Salud</h5>
                <div style={{ height: '300px' }}>
                  <Doughnut
                    data={{
                      labels: animalData.by_health.labels,
                      datasets: [{
                        data: animalData.by_health.data,
                        backgroundColor: ['#dc3545', '#ffc107', '#17a2b8', '#28a745'],
                      }],
                    }}
                    options={chartOptions}
                  />
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Distribución por Edad</h5>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={{
                      labels: animalData.by_age.labels,
                      datasets: [{
                        label: 'Edad',
                        data: animalData.by_age.data,
                        backgroundColor: 'rgba(153,102,255,0.5)',
                      }],
                    }}
                    options={chartOptions}
                  />
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Animales Eliminados</h5>
                <p className="text-center text-muted">
                  Total eliminados: {animalData.deletions?.total_deletions}
                </p>
                <div style={{ height: '300px' }}>
                  {animalData.deletions?.data.length > 0 ? (
                    <Bar
                      data={{
                        labels: animalData.deletions.labels,
                        datasets: [{
                          data: animalData.deletions.data,
                          label: 'Eliminados',
                          backgroundColor: 'rgba(255,99,132,0.5)',
                        }],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <p className="text-center text-muted">No hay registros de eliminaciones.</p>
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Ingresos de Animales</h5>
                <p className="text-center text-muted">
                  Total ingresos: {animalData.income?.total_animals}
                </p>
                {animalData.income?.datasets.length > 0 ? (
                  animalData.income.datasets.map((dataset, index) => (
                    <div key={index} className="mb-3" style={{ height: '300px' }}>
                      <h6 className="text-center">Año {dataset.year}</h6>
                      <Bar
                        data={{
                          labels: dataset.labels,
                          datasets: [{
                            data: dataset.data,
                            label: 'Ingresos',
                            backgroundColor: 'rgba(54,162,235,0.5)',
                          }],
                        }}
                        options={chartOptions}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">No hay ingresos registrados.</p>
                )}
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Adopciones</h5>
                <p className="text-center text-muted">
                  Total adopciones: {animalData.adoptions?.total_adoptions}
                </p>
                {animalData.adoptions?.datasets.length > 0 ? (
                  animalData.adoptions.datasets.map((dataset, index) => (
                    <div key={index} className="mb-3" style={{ height: '300px' }}>
                      <h6 className="text-center">Año {dataset.year}</h6>
                      <Bar
                        data={{
                          labels: dataset.labels,
                          datasets: [{
                            label: 'Adopciones',
                            data: dataset.data,
                            backgroundColor: 'rgba(255, 206, 86, 0.6)',
                          }]
                        }}
                        options={chartOptions}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">No hay adopciones registradas.</p>
                )}
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Reportes</h5>
                <p className="text-center text-muted">
                  Total reportes: {animalData.reports?.total_reports}
                </p>
                <div style={{ height: '300px' }}>
                  {animalData.reports?.data.length > 0 ? (
                    <Doughnut
                      data={{
                        labels: animalData.reports.labels,
                        datasets: [{
                          data: animalData.reports.data,
                          backgroundColor: ['#28a745', '#ffc107'],
                        }],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <p className="text-center text-muted">No hay reportes registrados.</p>
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <h5 className="text-center">Mascotas Perdidas</h5>
                <p className="text-center text-muted">
                  Total reportes: {animalData.lostPets?.total_reports} – Tasa de recuperación: {animalData.lostPets?.recovery_rate}%
                </p>
                <div style={{ height: '300px' }}>
                  {animalData.lostPets?.data.some(val => val > 0) ? (
                    <Doughnut
                      data={{
                        labels: animalData.lostPets.labels,
                        datasets: [{
                          data: animalData.lostPets.data,
                          backgroundColor: ['#36A2EB', '#FF6384'],
                        }],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <p className="text-center text-muted">No hay mascotas perdidas registradas.</p>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </Container>
    </div>
  );
}

export default Dashboard;
