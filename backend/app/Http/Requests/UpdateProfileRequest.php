<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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

            'email' => [
                'email',
                'max:320',
            ],

            'phone' => ['numeric', 'digits:10'],
            'address' =>['string'],
            //'file_path' => [ 'string']

        ];
    }
    public function attributes() : array
    {
        return [
            'email' => 'correo_electrónico',
            'password' => 'contraseña',
            'phone' => 'teléfono',
            'address' => 'direccion',
            'file_path' => 'file_path'
        ];
    }

    public function messages() : array
    {
        return [
            'unique' => 'Ya existe un registro con ese :attribute.',
            'numeric' => 'El campo :attribute debe ser numérico.',
            'max' => 'El campo :attribute debe contener máximo :max caracteres.',
            'digits' => 'El campo :attribute debe de ser a :digits dígitos.',
            'in' => 'El campo :attribute debe de tener un dato válido.',
            'email' => 'El campo :attribute debe ser una dirección de correo electrónico válido.',
            'regex' => 'El campo :attribute debe ser válido.',
            'password.regex' => 'El campo :attribute debe de tener mínimo 8 caracteres, una mayúscula ,un número, y un caracter especial (!$#%.,*).',
            'string'=> 'El campo :attribute deben ser caracteres',
        ];
    }
}
