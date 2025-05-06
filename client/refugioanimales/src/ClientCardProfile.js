import React from 'react';
import { Card } from 'react-bootstrap';

function ClientCardProfile({ name, file_path }) {
    return (
        <Card className="pet-card mb-3" style={{ borderRadius: '21px' }}>
            <Card.Body
                className="d-flex justify-content-center align-items-center"
                style={{
                    backgroundImage: `url(${file_path})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    position: 'relative',
                    minHeight: '300px',
                    color: 'white',
                    borderRadius: '20px',
                }}
            >
                <div
                    className="d-flex p-4"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '20px',
                    }}
                >
                    <Card.Title>{name}</Card.Title>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ClientCardProfile;
