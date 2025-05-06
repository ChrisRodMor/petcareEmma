<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLostPetReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'description' => 'required|string',
            'type_id' => 'required|exists:types,id',
            'breed_id' => 'required|exists:breeds,id',
            'date_event' => 'required|date',
            'pet_name' => 'required|string|max:255',
            'pet_gender' => 'required|in:Macho,Hembra',
            'pet_color' => 'required|string|max:255',
            'animal_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }

    public function attributes(): array
    {
        return [
            'description' => 'descripción',
            'type_id' => 'tipo de animal',
            'breed_id' => 'raza',
            'date_event' => 'fecha del evento',
            'pet_name' => 'nombre de la mascota',
            'pet_gender' => 'género de la mascota',
            'pet_color' => 'color de la mascota',
            'animal_picture' => 'foto del animal',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'max' => 'El campo :attribute no puede tener más de :max caracteres.',
            'exists' => 'El :attribute seleccionado no existe.',
            'date' => 'El campo :attribute debe ser una fecha válida.',
            'in' => 'El campo :attribute debe ser uno de los siguientes valores: :values.',
            'image' => 'El archivo del campo :attribute debe ser una imagen.',
            'mimes' => 'El campo :attribute debe ser un archivo de tipo: :values.',
            'animal_picture.max' => 'La imagen no debe pesar más de 2MB.',
        ];
    }
}
