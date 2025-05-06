<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientRequest extends FormRequest
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
            'name' => 'required',
            'email' => [
                'required',
                'email',
                'max:320',
                Rule::unique('users','email')
            ],
            'password' => ['required',
                'regex:/^.*(?=.{1,})(?=.*[A-Z])(?=.*[0-9])(?=.*[!$#%*]).*$/',
                'confirmed',
                'min:8'],

            'phone' => ['required', 'numeric', 'digits:10'],
            'birthdate' => ['required', 'date', 'before:-17 years','after:1900-01-01'],
            'address' =>['required', 'string'],
           
        ];
    }
    public function attributes() : array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
            'phone' => 'teléfono',
            'birthdate' => 'fecha de nacimiento',
            'address' => 'dirección',

        ];
    }

    public function messages() : array
    {
        return [
            'unique' => 'Ya existe un registro con ese :attribute.',
            'required' => 'El campo :attribute es requerido.',
            'numeric' => 'El campo :attribute debe ser numérico.',
            'max' => 'El campo :attribute debe contener máximo :max caracteres.',
            'digits' => 'El campo :attribute debe de ser a :digits digitos.',
            'in' => 'El campo :attribute debe de tener un dato válido.',
            'email' => 'El campo :attribute debe ser una dirección de correo electrónico válido.',
            'regex' => 'El campo :attribute debe ser válido.',
            'password.regex' => 'El campo :attribute debe de tener mínimo 8 caracteres, una mayúscula ,un número, y un carácter especial (!$#%.,*).',
            'confirmed' => 'El campo :attribute no coincide.',
            'string'=> 'El campo :attribute deben una cadena de texto.',
            'before' => 'Debes ser mayor de edad para poder registrarte.',
            'date' => 'El campo :attribute debe ser una fecha válida.',
            'after' => 'El campo :attribute debe ser una fecha posterior a :date.',
        ];
    }
}
