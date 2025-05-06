<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnimalRequest extends FormRequest
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
            'type_id' => 'exists:types,id',
            'breed_id' => 'exists:breeds,id',
            'name' => 'string|max:255',
            'gender' => 'in:Hembra,Macho',
            'sterilized' => 'in:Si,No',
            'birthdate' => 'nullable|date',
            'age' => 'nullable|string|max:255',
            'color' => 'string|max:255',
            'weight' => 'nullable|numeric|min:0',
            'size' => 'in:Pequeño,Mediano,Grande',
            'health' => 'in:Mala,Regular,Buena,Excelente',
            'description' => 'string',
        ];
    }

    public function attributes(): array
    {
        return [
            'type_id' => 'especie',
            'breed_id' => 'raza',
            'name' => 'nombre',
            'gender' => 'genero',
            'sterilized' => 'esterilizado',
            'birthdate' => 'fecha_nacimiento',
            'age' => 'edad',
            'color' => 'color',
            'weight' => 'peso',
            'size' => 'tamano',
            'health' => 'salud',
            'description' => 'descripcion',
        ];
    }


    public function messages() : array
    {
        return [
            'exists' => 'El :attribute seleccionado no existe.',
            'unique' => 'Ya existe un registro con ese :attribute.',
            'required' => 'El campo :attribute es requerido.',
            'numeric' => 'El campo :attribute debe ser numerico.',
            'max' => 'El campo :attribute debe contener maximo :max caracteres.',
            'min'=>'El campo :attribute debe ser de minimo :min kilos.',
            'digits' => 'El campo :attribute debe de ser a :digits digitos.',
            'in' => 'El campo :attribute debe contener un dato válido: :values.',
            'string'=> 'El campo :attribute deben ser caracteres',
            'date' => 'El campo :attribute debe ser una fecha valida.',
        ];
    }
}
