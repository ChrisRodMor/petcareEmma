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
            'email' => 'correo_electronico',
            'password' => 'contrasena',
            'phone' => 'telefono',
            'birthdate' => 'fecha_nacimiento',
            'address' => 'direccion',

        ];
    }

    public function messages() : array
    {
        return [
            'unique' => 'Ya existe un registro con ese :attribute.',
            'required' => 'El campo :attribute es requerido.',
            'numeric' => 'El campo :attribute debe ser numerico.',
            'max' => 'El campo :attribute debe contener maximo :max caracteres.',
            'digits' => 'El campo :attribute debe de ser a :digits digitos.',
            'in' => 'El campo :attribute debe de tener un dato valido.',
            'email' => 'El campo :attribute debe ser una direccion de correo electronico valido.',
            'regex' => 'El campo :attribute debe ser valido.',
            'password.regex' => 'El campo :attribute debe de tener minimo 8 caracteres, una mayuscula ,un numero, y un caracter especial (!$#%.,*).',
            'confirmed' => 'El campo :attribute no coincide.',
            'string'=> 'El campo :attribute deben ser caracteres',
            'before' => 'Debes ser mayor de edad para poder registrarte.',
            'date' => 'El campo :attribute debe ser una fecha valida.',
            'after' => 'El campo :attribute debe ser una fecha posterior a :date.',
        ];
    }
}
