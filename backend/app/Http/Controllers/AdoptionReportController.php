<?php

namespace App\Http\Controllers;

use App\Models\AdoptionReport;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreAdoptionReportRequest;
use Illuminate\Support\Facades\DB;

class AdoptionReportController extends Controller
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
    public function store(StoreAdoptionReportRequest $request)
    {
        // Obtener el usuario de la base de datos usando el ID proporcionado en el request
        $user = User::findOrFail($request->input('user_id'));

        $animal= Animal::findOrFail($request->input('animal_id'));
        // Verificar si el animal ya está adoptado
        if ($animal->is_adopted) {
            return response()->json(['message' => 'El animal ya ha sido adoptado'], 400);
        }
        //actualiza el valor de 'is_adopted' de animal a true
        $animal->is_adopted = true;
        $animal->save();

        // Crear un nuevo reporte
        $report = $user->reports()->create([
            'type_report' => 'ADOPCION',
            'description' => $request->input('description'),
            'status' => 'Terminado',
        ]);

        // Crear un nuevo reporte de adopción relacionado
        $adoptionReport = $report->adoptionReport()->create([
            'animal_id' => $request->input('animal_id'),
        ]);

        // Retornar una respuesta JSON
        return response()->json(['message' => 'El reporte de adopción se ha registrado correctamente', 'data' => $adoptionReport], 200);
    }

    public function adoptionsSummary(Request $request)
    {
        // Mapa de meses en español
        $meses = [
            1  => 'Enero', 2  => 'Febrero', 3  => 'Marzo',
            4  => 'Abril', 5  => 'Mayo',    6  => 'Junio',
            7  => 'Julio',  8  => 'Agosto',  9  => 'Septiembre',
            10 => 'Octubre',11 => 'Noviembre',12 => 'Diciembre',
        ];

        // Total de adopciones
        $totalAdoptions = AdoptionReport::count();

        // Consulta agrupada por año y mes
        $rows = AdoptionReport::select(
                DB::raw('YEAR(created_at)  AS year'),
                DB::raw('MONTH(created_at) AS month'),
                DB::raw('COUNT(*)         AS total')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Estructurar por año para gráficas
        $byYear = [];
        foreach ($rows as $row) {
            $y = $row->year;
            $m = $meses[$row->month] ?? $row->month;
            $t = $row->total;

            if (! isset($byYear[$y])) {
                $byYear[$y] = ['labels' => [], 'data' => []];
            }

            $byYear[$y]['labels'][] = $m;
            $byYear[$y]['data'][]   = $t;
        }

        // Convertir a array indexado
        $datasets = [];
        foreach ($byYear as $year => $series) {
            $datasets[] = [
                'year'   => $year,
                'labels' => $series['labels'],
                'data'   => $series['data'],
            ];
        }

        return response()->json([
            'total_adoptions' => $totalAdoptions,
            'datasets'        => $datasets,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(AdoptionReport $adoptionReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AdoptionReport $adoptionReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AdoptionReport $adoptionReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdoptionReport $adoptionReport)
    {
        //
    }
}
