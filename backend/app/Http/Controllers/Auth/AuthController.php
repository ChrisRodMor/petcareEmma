<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function authenticate(Request $request): \Illuminate\Http\JsonResponse
    {
        //Valida las credenciales
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            //Se busca el usuario autenticado
            $user = User::where('email', $request->email)->first();

            //Elimina los tokens previamente asignados.
            $user->tokens()->delete();

            //Crea el token para el usuario
            $token = $user->createToken(Str::random(32));
            //$permissions = $user->getAllPermissions()->pluck('name')->toArray();

            //return response()->json(['data' => ['token' => $token->plainTextToken, 'user' => $user, 'permissions' => $permissions, 'role' => $user->getRoleNames()[0] ?? null]], 200);
            return response()->json(['data' => ['token' => $token->plainTextToken, 'user' => $user]], 200);
        }

        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Ha cerrado sesión.'], 200);
    }
}
