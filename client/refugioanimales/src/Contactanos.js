import { AuthContext } from './AuthContext';
import React, { useContext } from 'react';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import { Container } from 'react-bootstrap';
import gmail from './img/gmail.webp';
import instagram from './img/instagram.webp';
import tiktok from './img/tiktok.webp';
import whatsapp from './img/whatsapp.png';
import facebook from './img/facebook.png';
import horarios from './img/stopwatch.svg';
import telefono from './img/telephone-fill.svg';
import location from './img/geo-alt-fill.svg';


function Contactanos(){
    const { authData } = useContext(AuthContext);
    if (!authData) {
        return <div>Loading...</div>;
    }
    return(
        <div>
            {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}
            <Container>
                <div className='mt-5 d-flex mb-5'>
                    <div className='me-auto'>
                        <h1 className="h1">Contactanos</h1>
                    </div>
                </div>

                <Container className="bg-white p-5 rounded shadow mb-5">

                    <Container className= "d-flex flex-column text-align-center justify-content-center align-items-center">

                        <p className='fw-light'>¡Conéctate con nosotros en las redes sociales para mantenerte al día con nuestras últimas noticias, eventos y adopciones especiales!</p>
                        <hr className='my-3' style={{ borderTop: '2px solid #D2D5D8', width: '100%'}}></hr>
                        
                    </Container>

                    <Container className='d-flex flex-wrap'>
                    <div className='mx-auto col-md-6 col-12'>
                        <div className='mb-4'>
                            <h5>Correo electrónico</h5>
                            <div className='d-flex align-items-center'>
                                <img src={gmail} alt='yimei' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>perritosrefugio2003@petcare.com</p>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h5>Facebook</h5>
                            <div className='d-flex align-items-center'>
                                <img src={facebook} alt='feis' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>PetcareMascotas</p>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h5>Instagram</h5>
                            <div className='d-flex align-items-center'>
                                <img src={instagram} alt='insta' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>Petcare22</p>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h5>TikTok</h5>
                            <div className='d-flex align-items-center'>
                                <img src={tiktok} alt='tiktok' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>Pet_Care35</p>
                            </div>
                        </div>
                    </div>
                    <div className='mx-auto col-md-6 col-12'>
                        <div className='mb-4'>
                            <h5>Horarios</h5>
                            <div className='d-flex align-items-center'>
                                <img src={horarios} alt='timer' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>Estamos abiertos de Lunes a viernes de 8 am hasta 8pm. ¡Esperamos verte pronto!</p>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h5>Teléfono</h5>
                            <div className='d-flex align-items-center'>
                                <img src={telefono} alt='telefono' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>612 124 8754</p>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h5>Whatsapp</h5>
                            <div className='d-flex align-items-center'>
                                <img src={whatsapp} alt='whats' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>+52 612 117 1213</p>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <h5>Dirección</h5>
                            <div className='d-flex align-items-center'>
                                <img src={location} alt='location' style={{width: '20px', height: '20px', marginRight: '8px'}}></img>
                                <p className='fw-light mb-0'>Av.Universidad, Solidaridad Mezquititio I, II.</p>
                            </div>
                        </div>
                    </div>
                </Container>


                    

                </Container>
            </Container>
        </div>
    );
}

export default Contactanos;