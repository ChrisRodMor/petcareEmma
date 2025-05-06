import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge } from 'react-bootstrap';
import { BsCalendarDate } from 'react-icons/bs';

const ReportCard = ({ type, description, status, createdAt, id }) => {
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

  return (
    <div
      className={`card border-${getStatusColor(status)}`}
      style={{
        width: '300px',
        margin: '1rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div
        className={`card-header bg-${getStatusColor(status)} text-${getStatusColor(status) === 'warning' ? 'dark' : 'white'}`}
        style={{ fontWeight: 'bold', textAlign: 'center', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
      >
        {type.toUpperCase()}
      </div>
      <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
        <div className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
          <BsCalendarDate style={{ marginRight: '5px' }} />
          {new Date(createdAt).toLocaleDateString()}
        </div>
        <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
          {description}
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <Badge bg={getStatusColor(status)} className="px-3 py-2 text-uppercase">
            {status}
          </Badge>
          <small className="text-muted">ID: {id}</small>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
