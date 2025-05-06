import React, { useContext,useEffect } from 'react';
import { Container, Figure } from 'react-bootstrap';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbarcliente from './Navbarcliente';
import Navbaremployee from './Navbaremployee';
import "bootstrap/js/dist/carousel";
import img1 from './img/carousel1.jpg';
import img2 from './img/carousel2.jpg';
import img3 from './img/carousel3.jpg';
import imgdoggy from './img/GettyImages-1209050323.png';

function Inicio() { 
    
    
    const { authData } = useContext(AuthContext);
    const navigate = useNavigate();
    
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const refreshed = sessionStorage.getItem('refreshed');
        
        if (!token) {
            navigate('/login');
        } else if (!refreshed) {
            window.location.reload();
            sessionStorage.setItem('refreshed', 'true');
        }
    }, [navigate]);
    
    if (!authData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            
            {authData.type === 'employee' ? <Navbaremployee /> : <Navbarcliente />}

            <div id="carouselExampleCaptions" className="carousel slide">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={img1} className="d-block w-100" alt="img1"></img>
                    </div>
                    <div className="carousel-item">
                        <img src={img2} className="d-block w-100" alt="img2"></img>
                    </div>
                    <div className="carousel-item">
                        <img src={img3} className="d-block w-100" alt="img3"></img>
                        <div className="carousel-caption d-none d-md-block">
                            <h5>¡Adopta, no compres!</h5>
                            <h5>En nuestro refugio, cada patita tiene una historia esperando un final feliz. Ven y conoce a tu nuevo mejor amigo.</h5>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className="d-flex justify-content-center flex-column align-items-center">

                <Container className="p-5 m-5 row">
                    <div className="col-12 col-md-6 d-flex flex-column align-items-center">
                        <Figure className="text-left">
                            <blockquote className="blockquote mb-4">
                                <p>¡Bienvenidos a Refugio de Amor Animal!</p>
                            </blockquote>
                            <figcaption className="blockquote-footer">
                                En nuestro santuario, cada latido cuenta una historia de amor y esperanza. Somos un hogar para aquellos que han sido abandonados, maltratados o simplemente necesitan un poco más de cariño en sus vidas.
                                Aquí, cada patita es recibida con los brazos abiertos y cada ronroneo es una melodía de gratitud. Nuestro compromiso es ofrecer un refugio seguro y cálido para aquellos que no tienen voz, y encontrarles un hogar lleno de amor y compasión.
                                Ven y sé parte de nuestra familia, donde las colas siempre están moviéndose con alegría y los corazones latiendo al unísono por una causa noble. Juntos, podemos marcar la diferencia en la vida de aquellos que más lo necesitan. ¡Únete a nosotros en nuestra misión de amor animal!
                            </figcaption>
                        </Figure>
                    </div>
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                        <img src={imgdoggy} className="img-fluid" alt="imgdog"></img>
                    </div>
                </Container>

            </div>
        </div>
    );
}

export default Inicio;
