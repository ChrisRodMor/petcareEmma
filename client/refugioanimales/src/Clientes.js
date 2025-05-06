import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import { Container } from 'react-bootstrap';
import ClientList from './ClientList';

function Clientes() {
    const { authData, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authData) {
        return <div>Not authenticated</div>;
    }

    return (
        <div>
            {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}
            <Container>
                <div className='mt-5 d-flex mb-4'>
                    <div className='me-auto'>
                        <h1 className="h1">Clientes</h1>
                    </div>
                </div>
                <div className='d-flex flex-wrap'>
                    <ClientList />
                </div>
            </Container>
        </div>
    );
}

export default Clientes;
