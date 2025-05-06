<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Employee;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'PetCare',
            'email' => 'admin@petcare.com',
            'password'=>Hash::make('23Secret*Password10'),
        ]);

        User::factory()->create([
            'name' => 'Cliente',
            'email' => 'client@petcare.com',
            'password'=>Hash::make('Client123*petcare'),
        ]);



        $this->call([
            ClientSeeder::class,
            EmployeeSeeder::class,
            BreedSeeder::class,
            AnimalSeeder::class,
            AbuseReportSeeder::class
        ]);
    }
}
