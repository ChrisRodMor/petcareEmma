<?php

namespace Database\Seeders;
use App\Models\Animal;

use App\Models\Vaccine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnimalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Animal::factory()->count(50)->create()->each(function ($animal) {
            // Crear una o más vacunas para cada animal
            $numVaccines = rand(1, 3); // Genera un número aleatorio de vacunas por animal

            // Crear las vacunas para el animal actual
            Vaccine::factory($numVaccines)->create([
                'animal_id' => $animal->id,
            ]);
        });
    }
}
