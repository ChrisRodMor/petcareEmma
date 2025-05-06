import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';
import PetCard from './PetCard';

function PetList() {
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('');
    const [types, setTypes] = useState([]);
    const [breeds, setBreeds] = useState([]); // Estado para almacenar las razas

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/animals');
                setPets(response.data.data);
                setFilteredPets(response.data.data);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        fetchPets();
    }, []);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/types');
                setTypes(response.data.data); // Establecer los tipos de animal desde la API
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        fetchTypes();
    }, []);

    useEffect(() => {
        const fetchBreeds = async () => {
            if (selectedType !== '') {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/breeds/${selectedType}`);
                    setBreeds(response.data.data); // Establecer las razas según el tipo de animal seleccionado
                } catch (error) {
                    console.error('Error fetching breeds:', error);
                }
            }
        };

        fetchBreeds();
    }, [selectedType]);

    useEffect(() => {
        applyFilters();
    }, [searchName, selectedType, selectedBreed]);

    const applyFilters = () => {
        let filtered = pets;

        if (searchName.trim() !== '') {
            filtered = filtered.filter(pet => pet.name.toLowerCase().includes(searchName.toLowerCase()));
        }

        if (selectedType !== '') {
            filtered = filtered.filter(pet => pet.type_id === parseInt(selectedType));
        }

        if (selectedBreed !== '') {
            filtered = filtered.filter(pet => pet.breed_id === parseInt(selectedBreed));
        }

        setFilteredPets(filtered);
    };

    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setSelectedBreed(''); // Resetear la raza seleccionada cuando se cambia el tipo de animal
    };

    const handleBreedChange = (e) => {
        setSelectedBreed(e.target.value);
    };

    return (
        <Container className='mb-5'>
            <Row className='mb-5'>
                <Col>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Mascota</Form.Label>
                        <Form.Control type="text" placeholder="Nombre" value={searchName} onChange={handleSearchNameChange} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formAnimal">
                        <Form.Label>Tipo animal</Form.Label>
                        <Form.Select value={selectedType} onChange={handleTypeChange} style={{ color: 'black' }}>
                            <option value="">Selecciona un tipo</option>
                            {types.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formRaza">
                        <Form.Label>Raza</Form.Label>
                        <Form.Select value={selectedBreed} className="text-dark" onChange={handleBreedChange} style={{ color: 'black' }}>
                            <option value="">Todas</option>
                            {breeds.map(breed => (
                                <option key={breed.id} value={breed.id}>{breed.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                {filteredPets.map(pet => (
                    <Col key={pet.id} md={4}>
                        <PetCard 
                            name={pet.name} 
                            image={`http://127.0.0.1:8000/${pet.file_path}`} 
                            id = {pet.id} 
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default PetList;
