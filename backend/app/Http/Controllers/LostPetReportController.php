<?php

namespace App\Http\Controllers;

use App\Models\LostPetReport;
use Illuminate\Http\Request;

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


    public function store(Request $request)
    {
        // Validar los datos del request
        $request->validate([
            'description' => 'required|string',
            'type_id' => 'required|exists:types,id',
            'breed_id' => 'required|exists:breeds,id',
            'date_event' => 'required|date',
            'pet_name' => 'required|string',
            'pet_gender' => 'required|in:Macho,Hembra',
            'pet_color' => 'required|string',
            'animal_picture'=> 'required|file'

        ]);

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

            // Validate that the uploaded file is an image
            $request->validate([
                'animal_picture' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

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
    public function updateStatus(Request $request, LostPetReport $lostPetReport)
    {
        // Verificar si el reporte existe
        if (!$lostPetReport) {
            // Si no existe, retornar un mensaje de error
            return response()->json(['message' => 'El reporte de mascota perdida no existe'], 404);
        }

        // Validar los datos del request
        $request->validate([
            'is_found' => 'boolean|required'
        ]);

        // Actualizar el estado del reporte de mascota perdida
        $lostPetReport->update([
            'is_found' => $request->input('is_found'), // Asignar el nuevo valor de 'status' desde el request
        ]);

        // Retornar una respuesta JSON indicando que los datos han sido actualizados correctamente
        return response()->json(['message' => 'El status del reporte de mascota perdida ha sido actualizado correctamente', 'data' => $lostPetReport->fresh()], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LostPetReport $lostPetReport)
    {
        //
    }
}
