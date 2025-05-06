<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVaccineRequest extends FormRequest
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
            'animal_id' => 'required|exists:animals,id',
            'vaccine_brand' => 'required|string|max:255',
            'vaccine_type' => 'required|string|max:255',
            'vaccine_batch' => 'nullable|string|max:255',
            'application_date' => 'required|date',
            'doctor_name' => 'required|string|max:255',
            'doctor_license' => 'required|string|max:255',
        ];
    }
    public function attributes(): array
    {
        return [
            'animal_id' => 'animal',
            'vaccine_brand' => 'marca',
            'vaccine_type' => 'tipo',
            'vaccine_batch' => 'lote',
            'application_date' => 'fecha_aplicación',
            'doctor_name' => 'nombre_medico',
            'doctor_license' => 'cedula_profesional',
        ];
    }


    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de caracteres.',
            'max' => 'El campo :attribute no puede tener más de :max caracteres.',
            'exists' => 'El :attribute seleccionado no existe.',
            'date' => 'El campo :attribute debe ser una fecha válida.',
        ];
    }

}
