<?php

namespace App\Http\Controllers;

use App\Models\AdoptionReport;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Http\Request;

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
    public function store(Request $request)
    {
        // Validar los datos del request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'description' => 'required|string',
            'animal_id' => 'required|exists:animals,id',
        ]);

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
