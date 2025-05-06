import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className={`card border-${getStatusColor(status)}`} style={{ maxWidth: '18rem', margin: '1rem' }}>
      <div className={`card-header bg-${getStatusColor(status)} text-${getStatusColor(status) === 'warning' ? 'black' : 'white'}`}>
        {type}
      </div>
      <div className='card-body' style={{ color: 'black' }}>
        <h5 className='card-title'>{new Date(createdAt).toLocaleDateString()}</h5>
        <p className='card-text'>{description}</p>
        <p className='card-text'>Status: {status}</p>
        <p className='card-text'>ID: {id}</p>
      </div>
    </div>
  );
};

export default ReportCard;
