import Navbarcliente from './Navbarcliente';
import { Container,Button } from 'react-bootstrap';
import imgmascotas from './img/grupomascotas.jpg'
import './contenedor.css';

function Donaciones(){
    return(
        <div>
            <Navbarcliente/>
            <Container>
                <div className='mt-5 d-flex mb-5'>
                    <div className='me-auto'>
                        <h1 className="h1">Gracias!</h1>
                    </div>
                </div>
                <Container className="bg-white p-5 rounded shadow d-flex">
                    <Container className= " d-flex flex-column text-align-center justify-content-center align-items-center">

                        <p className='fw-light'>¡Gracias por considerar adoptar, donar o voluntariar con nosotros! Tu apoyo es fundamental para nuestra misión de ayudar a los animales necesitados.</p>
                        <hr className='my-3' style={{ borderTop: '2px solid #D2D5D8', width: '100%'}}></hr>
                             
                        <h5>Transferencia interbancaria</h5>

                        <div className='m-3'>
                            <img src={imgmascotas} alt='img'style={{width: '40vh'}}></img>
                        </div>

                        <div className='d-flex'>
                            <div className='p-4'>
                                <p className='fw-light'>No. Tarjeta: 5161 0200 0249 7370</p>
                                <p className='fw-light'>No. de Cuenta 3447777860201</p>
                                <p className='fw-light'>CLABE 030040900029051209</p>
                                <p className='fw-light'>Banco El Bajío</p>
                            </div>
                            <div className='m-4'>
                                <p className='fw-light'>No. Tarjeta: 4152 3136 4345 1573</p>
                                <p className='fw-light'>BBVA BANCOMER</p>
                                <p className='fw-light'>Marina Contreras</p>
                                <p className='fw-light'>Comunidad Patitas A.C.</p>
                            </div>

                        </div>
                        
                        
                        <Button href = "https://forms.gle/qco7BH8QqwNZGDfN8" target="_blank" type="submit" className="btn btn-warning btn-sm btn-block">Apoyar!</Button>
                    
                    </Container>
                </Container>
            </Container>


        </div>
    );
}

export default Donaciones;