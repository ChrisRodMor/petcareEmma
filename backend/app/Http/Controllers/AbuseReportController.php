<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAbuseReportRequest;
use App\Models\AbuseReport;
use App\Models\Report;
use Illuminate\Http\Request;

class AbuseReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreAbuseReportRequest $request)
    {
        // Obtener el usuario autenticado
        $user = auth()->user();

        // Crear un nuevo reporte
        $report = $user->reports()->create([
            'type_report' => 'MALTRATO',
            'description' => $request->input('description'),
            'status' => 'Revisando',
        ]);

        // Crear un nuevo reporte de abuso relacionado
        $reportAbuse = $report->abuseReport()->create([
            'direction_event' => $request->input('direction_event'),
            'date_event' => $request->input('date_event'),
            'hour_event' => $request->input('hour_event'),
        ]);


        // Retornar una respuesta JSON
        return response()->json(['message' => 'El reporte de maltrato se ha registrado correctamente', 'data' => $reportAbuse], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(AbuseReport $abuseReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AbuseReport $abuseReport)
    {


    }

    /**
     * Update the specified resource in storage.
     */


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AbuseReport $abuseReport)
    {
        //
    }
}
