import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PetCard({ name, image, id }) {
    return (
        <Card className="pet-card mb-3" style={{borderRadius: '21px'}}>
            <Link to={`/adoptar/${id}`}>
                <Card.Body 
                    className="d-flex justify-content-center align-items-center" 
                    style={{ 
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'contain', // Ajuste para que la imagen se adapte al contenedor
                        backgroundRepeat: 'no-repeat', // Evita la repetición de la imagen
                        backgroundPosition: 'center', // Centra la imagen dentro del contenedor
                        position: 'relative',
                        minHeight: '300px', // Ajusta la altura según tus necesidades
                        color: 'white',
                        borderRadius: '20px', // Bordes redondeados
                    }}
                >
                    <div 
                        className="d-flex p-4" 
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Color de fondo con opacidad
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: '20px', // Bordes redondeados
                        }}
                    >
                        <Card.Title>{name}</Card.Title>
                    </div>
                </Card.Body>
            </Link>
        </Card>
    );
}

export default PetCard;
