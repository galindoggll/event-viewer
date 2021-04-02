<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Default API Homepage
Route::get('/', 'API\HomeController');

// Profile
Route::get('/profile', 'API\ProfileController@index');
Route::put('/profile', 'API\ProfileController@update');

// user logout
Route::delete('oauth/token', 'API\Auth\TokenController@delete')->middleware('auth:api');

// user signup
Route::post('register', 'API\UserController@register');

// activate via email confirmation
Route::post('activate', 'API\UserController@activate');

// Routes for Forget and Reset Password
Route::post('password/forgot', 'API\Auth\PasswordController@forgot');
Route::post('password/reset', 'API\Auth\PasswordController@reset');

// Routes for event
Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/events/', 'API\EventsController@index');
    Route::post('/events/', 'API\EventsController@create');
});
// users route
Route::prefix('users')
    ->group(function () {
        Route::get('/', 'API\UserController@index');
        Route::post('/', 'API\UserController@create');
        Route::get('{id}', 'API\UserController@read');
        Route::put('{id}', 'API\UserController@update');
        Route::delete('{id}', 'API\UserController@delete');
    });
