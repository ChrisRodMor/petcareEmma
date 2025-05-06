<?php

namespace App\Http;


use App\Http\Middleware\Authenticate;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

class AppMiddleware
{
    public function __invoke(Middleware $middleware)
    {
        // Añadir middleware global
        $middleware->append([
            EnsureFrontendRequestsAreStateful::class,
            // Agrega otros middlewares globales aquí
        ]);

        // Opcional: Añadir middleware específico a grupos
        $middleware->appendToGroup('api', \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class);
        //$middleware->appendToGroup('api', \Illuminate\Routing\Middleware\ThrottleRequests::class.':api');
        $middleware->appendToGroup('api' ,\Illuminate\Routing\Middleware\SubstituteBindings::class);

    }
}
