<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'rfc' => $this->faker->unique()->regexify('[A-Z]{4}[0-9]{6}[A-Z0-9]{3}'),
            'nss' => $this->faker->unique()->numerify('###########'),
            'position' => $this->faker->randomElement(['Recepcionista', 'Medico', 'Voluntario','Asistente']),
            'curp' => $this->faker->unique()->regexify('[A-Z]{4}[0-9]{6}[H,M][A-Z]{5}[0-9]{2}'),
        ];
    }
}
