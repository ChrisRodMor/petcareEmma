<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Report;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AbuseReport>
 */
class AbuseReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Obtener una fecha y hora aleatorias
        $dateTime = $this->faker->dateTimeBetween('-1 year', 'now');

        return [
            'report_id' => Report::factory(), // Relacionar con un reporte creado
            'direction_event' => $this->faker->address,
            'date_event' => $dateTime->format('Y-m-d'),
            'hour_event' => $dateTime->format('H:i:s'),
        ];
    }
}
