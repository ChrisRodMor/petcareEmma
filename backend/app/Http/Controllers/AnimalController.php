<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnimalRequest;
use App\Http\Requests\UpdateAnimalRequest;
use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Iniciar la consulta de animales
        $query = Animal::where('is_adopted', false);

        // Obtener los animales
        $animals = $query->get();

        // Verificar si se encontraron animales
        if ($animals->isEmpty()) {
            // No se encontraron resultados, retornar una respuesta 404 Not Found
            return response()->json(['message' => 'No se encontraron animales no adoptados.'], 404);
        }

        // Retornar los datos y el estado HTTP correspondiente
        return response()->json(['data' => $animals], 200);
    }
    public function searchAnimals(Request $request)
    {
        // Obtener los parámetros de filtrado
        $name = $request->input('name');
        $type_id = $request->input('type_id');
        $breed_id = $request->input('breed_id');

        // Iniciar la consulta de animales
        $query = Animal::query();

        // Aplicar filtro por nombre si se proporciona
        if ($name) {
            $query->where('name', 'LIKE', "%{$name}%");
        }

        // Aplicar filtro por especie si se proporciona type_id
        if ($type_id) {
            $query->where('type_id', $type_id);
        }

        // Aplicar filtro por raza si se proporciona breed_id
        if ($breed_id) {
            $query->where('breed_id', $breed_id);
        }

        // Aplicar filtro para seleccionar solo los animales no adoptados
        $query->where('is_adopted', false);

        // Obtener los animales según los filtros aplicados
        $animals = $query->get();

        // Verificar si se encontraron animales
        if ($animals->isEmpty()) {
            // No se encontraron resultados, retornar una respuesta 404 Not Found
            return response()->json(['message' => 'No se encontraron animales no adoptados con los filtros proporcionados.'], 404);
        }

        // Retornar los datos y el estado HTTP correspondiente
        return response()->json(['data' => $animals], 200);
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
    public function store(StoreAnimalRequest $request)
    {
        $animal_data = $request->all();

        // Check if the request contains a file upload
        if ($request->hasFile('animal_picture')) {
            $file = $request->file('animal_picture');

            // Validate that the uploaded file is an image
            $request->validate([
                'animal_picture' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            // Generate a unique name for the image
            $fileName = time() . '.' . $file->getClientOriginalExtension();

            // Save the image in the 'animals_pictures' folder
            $file->move(public_path('animals_picture'), $fileName);

            // Store the file path in the animal_data array
            $animal_data['file_path'] = 'animals_picture/' . $fileName;

        }
        // Create the animal record
        $animal = Animal::create($animal_data);
        return response()->json(['message' => 'Se ha creado el registro del animal.', 'data' => $animal], 200);

    }


    /**
     * Display the specified resource.
     */
    public function show(Animal $animal)
    {
        // Convertir el objeto $animal en un array
        $animalArray = $animal->toArray();
        $animalArray['breed_name'] = $animal->breed->name ?? null;
        $animalArray['type_name'] = $animal->type->name ?? null;

        // Retornar la respuesta en formato JSON
        return response()->json(['data' => $animalArray], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Animal $animal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnimalRequest $request, Animal $animal)
    {
        $animalData = $request->all();

        // Check if the request contains a file upload
        if ($request->hasFile('animal_picture')) {
            $file = $request->file('animal_picture');

            // Validate that the uploaded file is an image
            $request->validate([
                'animal_picture' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            // Check if the animal already has a picture and delete the old one
            if ($animal->file_path && $animal->file_path !== 'animals_picture/default.jpg') {
                $oldFilePath = public_path($animal->file_path);
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }

            // Generate a unique name for the new image
            $fileName = time() . '.' . $file->getClientOriginalExtension();

            // Save the new image in the 'animals_pictures' folder
            $file->move(public_path('animals_picture'), $fileName);

            // Store the file path in the animalData array
            $animalData['file_path'] = 'animals_picture/' . $fileName;
        }

        // Update the animal with the new data
        $animal->update($animalData);

        // Reload the animal to ensure we have the most recent data
        $animal = Animal::findOrFail($animal->id);

        return response()->json(['message' => 'Los datos han sido actualizados correctamente', 'data' => $animal], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Animal $animal)
    {
        //
    }
}
