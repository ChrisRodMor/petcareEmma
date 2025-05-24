<?php

namespace App\Http\Controllers;

use App\Models\LostPetReport;
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
        // Obtener todos los reportes de mascotas perdidas donde is_found es false
        $lostPetReports = LostPetReport::where('is_found', false)->get();

        // Retornar una respuesta JSON con los reportes encontrados
        return response()->json(['data' => $lostPetReports], 200);
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
    public function updateStatus(UpdateLostPetReportStatusRequest  $request, $idReport)
    {
        // 1. Intentar recuperar el reporte
    $lostPetReport = LostPetReport::find($idReport);

    // 2. Si no existe, devolver 404
    if (! $lostPetReport) {
        return response()->json([
            'message' => 'El reporte de mascota perdida no existe.'
        ], 404);
    }

    // 3. Actualizar sólo el campo is_found (su validación ya viene en el Form Request)
    $lostPetReport->update([
        'is_found' => $request->input('is_found'),
    ]);

    // 4. Devolver la entidad fresca
    return response()->json([
        'message' => 'El estado del reporte de mascota perdida ha sido actualizado correctamente.',
        'data'    => $lostPetReport->fresh(),
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
