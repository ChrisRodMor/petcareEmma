<?php

namespace Database\Factories;

use App\Models\Animal;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vaccine>
 */
class VaccineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        // Arrays de datos reales para marcas y tipos de vacunas animales
        $vaccineBrands = ['Zoetis', 'Merck Animal Health', 'Elanco', 'Boehringer Ingelheim', 'Virbac'];
        $vaccineTypes = ['Rabia', 'Moquillo', 'Parvovirus', 'Leptospirosis', 'Bordetella', 'Enfermedad de Lyme'];

        // Obtener la fecha máxima permitida para la aplicación de la vacuna (fecha actual)
        $maxDate = Carbon::now();

        return [
            'animal_id' => null, // Se establecerá cuando se cree en el seeder
            'vaccine_brand' => $this->faker->randomElement($vaccineBrands),
            'vaccine_type' => $this->faker->randomElement($vaccineTypes),
            'vaccine_batch' => $this->faker->regexify('[A-Za-z0-9]{10}'), // No es necesario opcional()
            // Generar una fecha entre la fecha de nacimiento del animal y la fecha actual
            'application_date' => function (array $attributes) use ($maxDate) {
                // Obtener la fecha de nacimiento del animal según el animal_id proporcionado
                $animalBirthDate = Animal::find($attributes['animal_id'])->birthdate;

                // Generar una fecha entre la fecha de nacimiento del animal y la fecha actual
                return $this->faker->dateTimeBetween($animalBirthDate, $maxDate)->format('Y-m-d');
            },
            'doctor_name' => $this->faker->name,
            'doctor_license' => $this->faker->regexify('[A-Za-z0-9]{8}')
        ];
    }
}
