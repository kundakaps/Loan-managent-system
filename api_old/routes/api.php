<?php


use App\Http\Controllers\ZiamisApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CBSController;
use App\Http\Controllers\ERPController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PacraController;
use App\Http\Controllers\SchoolsController;
use App\Http\Controllers\UtilityController;



Route::options('{any}', function (Request $request) {
    return response()->json([], 200);
})->where('any', '.*');



Route::middleware('auth:api')->group(function () {

Route::get('me', [UserController::class,'me']);


});



Route::post('auth/login', [UserController::class,'login']);
Route::post('auth/adduser', [UserController::class,'createUser']);

