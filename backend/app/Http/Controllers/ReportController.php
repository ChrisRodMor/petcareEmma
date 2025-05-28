<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports=Report::all();
        return response()->json(['data' => $reports], 200);
    }
    
    public function statusSummary(Request $request)
    {
        // 1. Cálculo de totales
        $attended = Report::where('status', 'Terminado')->count();
        $pending  = Report::whereIn('status', ['Revisando', 'Avanzando'])->count();
        $total    = $attended + $pending;

        // 2. Preparar labels y data para front
        $labels = ['Atendidos', 'Pendientes'];
        $data   = [$attended, $pending];

        return response()->json([
            'total_reports' => $total,
            'labels'        => $labels,
            'data'          => $data,
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // 1. Verificar existencia del reporte
        $report = Report::find($id);
        if (! $report) {
            return response()->json([
                'message' => 'El reporte ingresado no existe'
            ], 400);
        }

        // 2. Relaciones base que siempre queremos
        $relations = ['user']; // por ejemplo quién creó el report

        // 3. Añadir relaciones específicas según tipo
        switch ($report->type_report) {
            case 'ADOPCION':
                $relations = array_merge($relations, [
                    'adoptionReport',
                    'adoptionReport.animal',
                    'adoptionReport.animal.type',
                    'adoptionReport.animal.breed',
                ]);
                break;

            case 'MASCOTA_PERDIDA':
                $relations = array_merge($relations, [
                    'lostPetReport',
                    'lostPetReport.type',
                    'lostPetReport.breed',
                ]);
                break;

            case 'MALTRATO':
                $relations = array_merge($relations, [
                    'abuseReport',
                    // otras relaciones internas de abuseReport si existen
                ]);
                break;
        }

        // 4. Eager‐load todas las relaciones
        $report->load($relations);

        // 5. Responder con todo el grafo de datos
        return response()->json([
            'data' => $report
        ], 200);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Report $report)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStatus(Request $request, Report $report)
    {
        $request->validate([
            'status' => 'required|in:Revisando,Avanzando,Terminado',
        ], [
            // Mensajes personalizados
            'status.required' => 'El campo :attribute es obligatorio.',
            'status.in' => 'El campo :attribute debe ser uno de los siguientes: Revisando, Avanzando o Terminado.',
        ], [
            // Traducciones de atributos
            'status' => 'estado del reporte',
        ]);
        $report->update([
            'status' => $request->input('status'), // Asignar el nuevo valor de 'status' desde el request
        ]);

        // Retornar una respuesta JSON indicando que los datos han sido actualizados correctamente
        return response()->json(['message' => 'El status del reporte ha sido actualizado correctamente', 'data' => $report], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        //
    }

    public function getReports(Request $request)
    {
        // Obtener el usuario autenticado
        $user = $request->user();

        // Obtener todos los reportes del usuario autenticado
        $reports = $user->reports;

        // Retornar una respuesta JSON con los reportes
        return response()->json(['data' => $reports], 200);
    }
}
