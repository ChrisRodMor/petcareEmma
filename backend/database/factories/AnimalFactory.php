<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Type;
use App\Models\Breed;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Animal>
 */
class AnimalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition()
    {
        // Seleccionar aleatoriamente un ID de Type existente
        $type_id = Type::pluck('id')->random();

        // Seleccionar aleatoriamente un ID de Breed existente que coincida con el type_id
        $breed_id = Breed::where('type_id', $type_id)->pluck('id')->random();

        // Generar una fecha de nacimiento entre 2009 y la fecha actual
        $birthdate = $this->faker->dateTimeBetween('-15 years', 'now')->format('Y-m-d');

        // Calcular la edad basada en la fecha de nacimiento
        $age = Carbon::parse($birthdate)->age . ' years';

        // Generar un nombre de acuerdo al género
        $gender = $this->faker->randomElement(['Hembra', 'Macho']);
        $name = ($gender === 'Hembra') ? $this->faker->firstNameFemale() : $this->faker->firstNameMale();

        return [
            'type_id' => $type_id,
            'breed_id' => $breed_id,
            'gender' => $gender,
            'name' => $name,
            'is_adopted' => false,
            'sterilized' => $this->faker->randomElement(['Si', 'No']),
            'birthdate' => $birthdate, // Fecha entre 2009 y ahora
            'age' => $age, // Edad calculada basada en la fecha de nacimiento
            'color' => $this->faker->randomElement(['Blanco', 'Negro', 'Marrón', 'Gris', 'Beige']),
            'weight' => $this->faker->randomFloat(2, 1, 40),
            'size' => $this->faker->randomElement(['Pequeño', 'Mediano', 'Grande']),
            'health' => $this->faker->randomElement(['Mala', 'Regular', 'Buena', 'Excelente']),
            'description' => $this->faker->randomElement([
                'Es un compañero leal y afectuoso, siempre dispuesto a jugar y recibir cariño.',
                'Tiene una personalidad tranquila y relajada, disfruta de largas siestas bajo el sol.',
                'Es curioso y enérgico, le encanta explorar su entorno y descubrir nuevas aventuras.',
                'Es un amante de la comida y nunca dirá que no a un bocadillo sabroso.',
                'Es independiente y orgulloso, disfruta de su tiempo a solas pero siempre está listo para unirse a la diversión.',
                'Es juguetón y travieso, siempre buscando la próxima travesura para entretenerse.',
                'Tiene un corazón amable y gentil, se lleva bien con todos y siempre está dispuesto a ayudar.',
                'Es un verdadero atleta, disfruta de largas caminatas y emocionantes juegos al aire libre.',
                'Es tímido al principio, pero una vez que te conoce se convierte en un amigo leal y cariñoso.',
                'Es inteligente y astuto, siempre encontrando formas creativas de resolver problemas y conseguir lo que quiere.',
            ]),
            'file_path' => 'animals_picture/default.jpg',
        ];
    }

}
