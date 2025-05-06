<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $typeReport = $this->faker->randomElement(['ADOPCION', 'MASCOTA_PERDIDA', 'MALTRATO']);

        $description = '';
        switch ($typeReport) {
            case 'ADOPCION':
                $description = ' Esta mascota encontró un hogar amoroso y responsable.';
                break;
            case 'MASCOTA_PERDIDA':
                $description =  ' Se perdió en las cercanías de ' . $this->faker->streetName . '. Por favor, contáctenos si tiene alguna información.';
                break;
            case 'MALTRATO':
                $description =  ' Se observó que esta mascota está siendo maltratada en ' . $this->faker->address . '. Necesita ayuda urgente.';
                break;
        }

        return [
            'user_id' => User::factory(),
            'type_report' => $typeReport,
            'description' => $description,
            'status' => $typeReport === 'ADOPCION' ? 'Terminado' : $this->faker->randomElement(['Revisando', 'Avanzando', 'Terminado'])
        ];
    }
}
