<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\AnimalDeletion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class AnimalDeletionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $reports=AnimalDeletion::all();
        return response()->json(['data' => $reports], 200);
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
   public function store(Request $request, $animalId)
    {
        // 0. Verificar que el animal exista    
        $animal = Animal::find($animalId);
        if (! $animal) {
            return response()->json([
                'message' => 'El animal especificado no existe en la base de datos.'
            ], 404);
        }

        // 1. Validar sólo el motivo
        $data = $request->validate([
            'reason' => [
                'required',
                'in:Reubicación,Fallecimiento,Error de registro,Escape o desaparición,Caso especial (otros)',
            ],
        ], [
            'reason.required' => 'El motivo es obligatorio.',
            'reason.in'       => 'El motivo seleccionado no es válido, debe ser uno de los siguientes: Reubicación, Fallecimiento, Error de registro, Escape o desaparición, Caso especial (otros).',
        ]);

        // 2. Crear el registro de baja
        AnimalDeletion::create([
            'animal_id' => $animal->id,
            'reason'    => $data['reason'],
        ]);

        // 3. Soft-delete del animal
        $animal->delete();

        // 4. Respuesta
        return response()->json([
            'message' => 'Baja registrada y animal eliminado correctamente.'
        ], 200);
    }
    public function summary()
    {
        // 1. Conteo por motivo
        $counts = AnimalDeletion::select('reason', DB::raw('COUNT(*) as total'))
            ->groupBy('reason')
            ->get();

        // 2. Total de bajas
        $totalDeletions = $counts->sum('total');

        // 3. Preparar arrays para gráficas
        $labels = $counts->pluck('reason')->all();
        $data   = $counts->pluck('total')->all();

        return response()->json([
            'total_deletions' => $totalDeletions,
            'labels'          => $labels,
            'data'            => $data,
        ], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(AnimalDeletion $animalDeletion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AnimalDeletion $animalDeletion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AnimalDeletion $animalDeletion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AnimalDeletion $animalDeletion)
    {
        //
    }
}
