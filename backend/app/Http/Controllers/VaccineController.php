<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnimalRequest;
use App\Http\Requests\StoreVaccineRequest;
use App\Models\Animal;
use App\Models\Vaccine;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class VaccineController extends Controller
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
    //crear vacuna
    public function store(StoreVaccineRequest $request)
    {
        $vaccine_data = $request->all();

        $vaccine = Vaccine::create($vaccine_data);
        return response()->json(['message' => 'Se ha creado el registro de la vacuna.', 'data' => $vaccine], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vaccine $vaccine)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vaccine $vaccine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vaccine $vaccine)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vaccine $vaccine)
    {
        //
    }


    public function getVaccines(Animal $animal)
    {
        try {
            $animal = Animal::findOrFail($animal->id);
            $vaccines = $animal->vaccines()->get();

            if ($vaccines->isEmpty()) {
                return response()->json(['message' => 'El animal no tiene vacunas registradas.']);
            }

            return response()->json(['data' => $vaccines]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Animal no encontrado.'], 404);
        }
    }

}
