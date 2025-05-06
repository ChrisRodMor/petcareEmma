<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdoptionReportRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'description' => 'required|string',
            'animal_id' => 'required|exists:animals,id',
        ];
    }

    public function attributes(): array
    {
        return [
            'user_id' => 'usuario',
            'description' => 'descripción',
            'animal_id' => 'animal',
        ];
    }

    
    
    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'exists' => 'El :attribute seleccionado no existe.',
        ];
    }
}
