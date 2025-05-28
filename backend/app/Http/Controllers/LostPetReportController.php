<?php

namespace App\Http\Controllers;

use App\Models\LostPetReport;
use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Requests\StoreLostPetReportRequest;
use App\Http\Requests\UpdateLostPetReportStatusRequest;


class LostPetReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        // Obtener todos los reportes de mascotas perdidas sin recuperar,
        // cargando también las relaciones report (y su user), type y breed
        $lostPetReports = LostPetReport::with([
                'report.user',   // quien creó el reporte
                'type',          // la especie de la mascota
                'breed'          // la raza de la mascota
            ])
            ->where('is_found', false)
            ->get();

        return response()->json([
            'data' => $lostPetReports
        ], 200);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(StoreLostPetReportRequest  $request)
    {
       
        // Obtener el usuario autenticado
        $user = auth()->user();

        // Crear un nuevo reporte
        $report = $user->reports()->create([
            'type_report' => 'MASCOTA_PERDIDA',
            'description' => $request->input('description'),
            'status' => 'Revisando',
        ]);

        // Crear un nuevo reporte de mascota perdida relacionado
        $reportAbuse = $report->lostPetReport()->create([
            'type_id' => $request->input('type_id'),
            'breed_id' => $request->input('breed_id'),
            'date_event' => $request->input('date_event'),
            'pet_name' => $request->input('pet_name'),
            'pet_gender' => $request->input('pet_gender'),
            'pet_color' => $request->input('pet_color'),
            'is_found' => false,
        ]);

        // actualiza  el file_path
        if ($request->hasFile('animal_picture')) {
            $file = $request->file('animal_picture');

            // Generate a unique name for the image
            $fileName = time() . '.' . $file->getClientOriginalExtension();

            // Save the image in the 'animals_pictures' folder
            $file->move(public_path('losts_animals_pictures'), $fileName);

            // Store the file path in the animal_data array
            $reportAbuse['file_path'] = 'losts_animals_pictures/' . $fileName;
            $reportAbuse->save();
        }

        // Retornar una respuesta JSON
        return response()->json(['message' => 'El reporte de mascota perdida se ha registrado correctamente', 'data' => $reportAbuse], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(LostPetReport $lostPetReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LostPetReport $lostPetReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
 public function updateStatus($idReport)
    {
        // 1. Recuperar el Report por su ID
        $report = Report::find($idReport);
        if (! $report) {
            return response()->json([
                'message' => 'El reporte ingresado no existe.'
            ], 400);
        }

        // 2. Recuperar el reporte de mascota perdida asociado
        $lostPetReport = LostPetReport::where('report_id', $idReport)->first();
        if (! $lostPetReport) {
            return response()->json([
                'message' => 'El reporte de mascota perdida no existe.'
            ], 404);
        }

        // 3. Marcar el Report principal como "Terminado"
        $report->update([
            'status' => 'Terminado',
        ]);

        // 4. Marcar la mascota como encontrada
        $lostPetReport->update([
            'is_found' => true,
        ]);

        // 5. Responder con ambas entidades ya actualizadas
        return response()->json([
            'message' => 'El reporte ha sido finalizado y la mascota marcada como encontrada.',
            'data'    => [
                'report'          => $report->fresh(),
                'lost_pet_report' => $lostPetReport->fresh(),
            ],
        ], 200);
    }
    /**
     * Calcula y retorna la tasa de recuperación de mascotas perdidas,
     * además de los datos listos para gráfico.
     */
    public function lostPetsRecovery(Request $request)
    {
        // 1. Conteos de encontrados y no encontrados
        $foundCount    = LostPetReport::where('is_found', true)->count();
        $notFoundCount = LostPetReport::where('is_found', false)->count();
        $total         = $foundCount + $notFoundCount;

        // 2. Tasa de recuperación (porcentaje)
        $recoveryRate = $total
            ? round( ($foundCount / $total) * 100, 2 )
            : 0;

        // 3. Preparar labels y data para gráfico
        $labels = ['Recuperadas', 'No recuperadas'];
        $data   = [$foundCount, $notFoundCount];

        return response()->json([
            'total_reports'  => $total,
            'found_count'    => $foundCount,
            'not_found_count'=> $notFoundCount,
            'recovery_rate'  => $recoveryRate,   // en %
            'labels'         => $labels,
            'data'           => $data,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LostPetReport $lostPetReport)
    {
        //
    }
}
