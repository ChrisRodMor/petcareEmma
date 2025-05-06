<?php

use App\Http\Controllers\AbuseReportController;
use App\Http\Controllers\AdoptionReportController;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\LostPetReportController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VaccineController;
use App\Models\LostPetReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Autenticación
Route::post('/register', [ClientController::class, 'store']);
Route::post('/login', [AuthController::class, 'authenticate']);

//      publicas
//Especies
Route::get('/types', [TypeController::class, 'index']);

//Razas
Route::get('/breeds/{type}', [TypeController::class, 'getBreeds']);

//Animals
Route::get('/animals',[AnimalController::class, 'index']);
Route::post('/search-animals', [AnimalController::class, 'searchAnimals']);
Route::get('/animals/{animal}', [AnimalController::class, 'show']);
Route::get('/vaccines/{animal}', [VaccineController::class, 'getVaccines']);
Route::post('/store-vaccine', [VaccineController::class, 'store']);

//Grupo de rutas con el middleware de autenticación con Sanctum (si no está logueado el usuario, no puede acceder)
Route::middleware(['auth:sanctum'])->group(function () {
    //cuenta
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/update-profile', [UserController::class, 'updateProfile']);
    Route::get('/profile', [UserController::class, 'profile']);

    //clientes
    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{client}', [ClientController::class, 'show']);
    Route::post('/clients-search',[ClientController::class,'search']);

    //animales
    Route::post('/store-animals', [AnimalController::class, 'store']);
    Route::post('/update-animals/{animal}', [AnimalController::class, 'update']);

    //reportes
    Route::post('/report-update-status/{report}',[ReportController::class, 'updateStatus']);
    Route::get('/user-reports', [ReportController::class, 'getReports']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/report/{report}', [ReportController::class, 'show']);

    Route::post('/store-abuse-report',[AbuseReportController::class,'store']);

    Route::post('/store-adoption-report',[AdoptionReportController::class,'store']);

    Route::post('/store-lost-pet',[LostPetReportController::class,'store']);
    Route::get('/lost-pets',[LostPetReportController::class,'index']);
    Route::post('/lost-pet-status/{lostPetReport}',[LostPetReportController::class,'updateStatus']);

});
