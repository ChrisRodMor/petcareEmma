<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Employee::factory(1)->create([
            'user_id' => 1,
            'position'=>'Administrador'
        ]);
        Employee::factory(1)->create([
            'position'=>'Recepcionista'
        ]);
        Employee::factory(1)->create([
            'position'=>'Voluntario'
        ]);
        Employee::factory(3)->hasUser(1)->create();
    }
}
