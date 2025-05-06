<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use App\Traits\UserHelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use UserHelperTrait;


    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = auth()->user();
        // Excluir los campos específicos para el usuario y manejar la contraseña aparte
        $userData = $request->except(['name', 'birthdate', 'password', 'profile_picture']);

        // Si la contraseña está presente en la solicitud, hashearla antes de actualizar
        if ($request->filled('password') ) {
            $request->validate([
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/^.*(?=.{1,})(?=.*[A-Z])(?=.*[0-9])(?=.*[!$#%*]).*$/'
                ],
            ], [
                'password.required' => 'El campo contraseña es obligatorio.',
                'password.string' => 'El campo contraseña debe ser una cadena de caracteres.',
                'password.min' => 'El campo contraseña debe tener al menos :min caracteres.',
                'password.regex' => 'El campo contraseña debe contener al menos una letra mayúscula, un número y un carácter especial (!, $, #, % o *).',
            ]);

            $user->password = Hash::make($request->input('password'));
        }


        // Si la solicitud contiene una foto de perfil, manejar la carga del archivo
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');

            // Validar que el archivo sea una imagen
            $request->validate([
                'profile_picture' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            // Eliminar la foto de perfil anterior si existe
            if ($user->file_path && file_exists(public_path($user->file_path)) && $user->file_path !== 'profile_pictures/default.jpg') {
                unlink(public_path($user->file_path));
            }

            // Generar un nombre único para la nueva imagen
            $fileName = time() . '.' . $file->getClientOriginalExtension();

            // Guardar la nueva imagen en el almacenamiento (en la carpeta 'profile_pictures')
            $file->move(public_path('profile_pictures'), $fileName);

            // Almacenar la ruta de la nueva imagen en el campo 'file_path'
            $userData['file_path'] = 'profile_pictures/' . $fileName;
        }

        // Actualizar los datos del usuario
        $user->update($userData);

        // Volver a cargar el usuario para asegurarnos de que tenemos los datos más recientes
        $user = User::findOrFail($user->id);

        return response()->json(['message' => 'Los datos han sido actualizados correctamente', 'data' => $user], 200);
    }


    public function profile(Request $request){
        $user = auth()->user();
        $userType = $this->getUserType($user->id);

        switch($userType){
            case 'client':
                $user->load('client');
                break;
            case 'employee':
                $user->load('employee');
                break;
        }

        $user->type = $userType;
        //$user->role = $user->getRoleNames()[0];

        return response()->json(['data' => $user]);
    }
}
