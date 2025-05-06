import { AuthContext } from './AuthContext';
import React, { useContext, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import PetList from './PetList';

function Adoptar() {
    const { authData } = useContext(AuthContext);
    const [animals] = useState([]);
    const [searchResult] = useState(null);

    if (!authData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}
            <Container>
                <div className='mt-5 d-flex mb-4'>
                    <div className='me-auto'>
                        <h1 className="h1">Refugio</h1>
                    </div>
                    {authData.type === 'employee' && (
                        <Link to = '/agregaranimal'><Button variant="warning">Agregar</Button></Link>
                    )}
                </div>
                <div className='d-flex flex-wrap'>
                    <PetList animals={searchResult || animals} />
                </div>
            </Container>
        </div>
    );
}

export default Adoptar;
