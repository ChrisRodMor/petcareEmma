<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\Type;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BreedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposConRazas = [
            'Perro' => [
                'Mestizo','Otro', 'Afgano', 'Beagle', 'Boxer', 'Bullterrier', 'Caniche', 'Chihuahua', 'Cocker spaniel',
                'Dalmata', 'Doberman', 'Dogo aleman', 'Fox terrier', 'French poodle', 'Golden retriever', 'Labrador retriever',
                'Maltes', 'Mastin español', 'Pastor aleman', 'Pastor belga', 'Pekines', 'Pitbull', 'Pointer', 'Rottweiler',
                'Salchicha', 'San bernardo', 'Scottish terrier', 'Shar pei', 'Schnauzer', 'Galgos', 'Viejo Pastor Ingles',
                'Bernes de la montaña', 'Gran Danes', 'Terrier', 'Gigante de los Pirineos'
            ],
            'Gato' => ['Mestizo', 'Otro','Atigrado','Oriental','Europeo','Siames', 'Persa', 'Maine Coon', 'Sphynx', 'Bengala' ],
            'Conejo' => [ 'Holandés', 'Rex', 'Cabeza de León', 'Mini Lop', 'Angora','Otro'],
            'Ave' => ['Periquito', 'Canario', 'Cacatúa', 'Loro', 'Agapornis','Otro'],
            'Reptil' => ['Iguana', 'Gecko', 'Camaleón', 'Serpiente', 'Tortuga', 'Otro'],
            'Roedor' => ['Hámster', 'Cobaya', 'Chinchilla', 'Ratón', 'Jerbo', 'Otro'],
            'Pez' => ['Goldfish', 'Betta', 'Guppy', 'Tetra', 'Pez Ángel',  'Otro'],
            //'Caballo' => ['Árabe', 'Cuarto de Milla', 'Pura Sangre', 'Appaloosa', 'Percherón', 'Mestizo', 'Otro'],
            'Otro' => ['Furón', 'Erizo', 'Hurón', 'Mapache', 'Petauro del Azúcar','Otro']
        ];

        foreach ($tiposConRazas as $tipoNombre => $razas) {
            $tipo = Type::create(['name' => $tipoNombre]);
            foreach ($razas as $razaNombre) {
                Breed::create(['name' => $razaNombre, 'type_id' => $tipo->id]);
            }
        }
    }
}
