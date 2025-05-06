<?php

namespace Database\Seeders;

use App\Models\AbuseReport;
use App\Models\Report;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AbuseReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 3 reportes para el usuario con id 2
        $reports = Report::factory()->count(3)->create([
            'user_id' => 2,
            'type_report' => 'MALTRATO', // Aseguramos que el tipo de reporte sea 'MALTRATO'
        ]);

        // Crear un reporte de abuso para cada reporte
        foreach ($reports as $report) {
            AbuseReport::factory()->create([
                'report_id' => $report->id,
            ]);
        }
    }
}
