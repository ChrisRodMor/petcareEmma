<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAbuseReportRequest extends FormRequest
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
            'direction_event' => 'required|string',
            'date_event' => 'required|date|before_or_equal:today',
            'hour_event' => 'required|date_format:H:i:s',
        ];
    }

    /**
     * Custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'description' => 'descripción',
            'direction_event' => 'dirección del evento',
            'date_event' => 'fecha del evento',
            'hour_event' => 'hora del evento',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es requerido.',
            'string' => 'El campo :attribute debe ser una cadena de texto.',
            'date' => 'El campo :attribute debe ser una fecha válida.',
            'date_format' => 'El campo :attribute debe tener el formato correcto (HH:MM:SS).',
            'date_event.before_or_equal'=> 'La fecha de :attribute no puede ser posterior a hoy.',

        ];
    }

}
