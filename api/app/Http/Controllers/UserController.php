<?php

namespace App\Http\Controllers;

use App\Models\AssignedRoles;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\UserIpBinding;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function me(){
        return auth()->user();
    }


    public function createUser(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'username' => 'required',
            'password' => 'required|min:6',
        ]);

        // Check if the username (used as email) already exists
        if (User::where('email', $data['username'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Username already exists'
            ], 409); // 409 Conflict is appropriate here
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['username'], // Username is being stored as email
            'password' => Hash::make($data['password']),
        ]);

        Log::channel('daily_user_logs')->info('User created', [
            'created_by' => auth()->check() ? auth()->id() : 'guest',
            'action' => 'Created user',
            'new_user' => [
                'name' => $data['name'],
                'username' => $data['username'],
            ],
        ]);

        return response()->json([
            'success' => (bool) $user,
            'message' => $user ? 'User created successfully' : 'Failed to create user'
        ], $user ? 201 : 500);
    }




 public function login(Request $request)
    {
        $data = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $ip = $request->ip();

        $user = \App\Models\User::where('email', $data['username'])->first();

        if (!$user) {
            return response()->json(['error' => 'Incorrect email or password'], 401);
        }

        // if (!$this->isIpAllowedForUser($user->id, $ip)) {
        //     // Log unauthorized IP attempt
        //     Log::channel('daily_user_logs')->warning('Unauthorized IP access attempt', [
        //         'user_id' => $user->id,
        //         'username' => $user->email,
        //         'ip' => $ip,
        //         'action' => 'unauthorized IP attempt on login',
        //     ]);

        //     return response()->json([], 401);
        // }

        $roles = AssignedRoles::where('user_id', $user->id)->first();



        $credentials = [
            'email' => $data['username'],
            'password' => $data['password'],
        ];

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Incorrect email or password'], 401);
        }

        Log::channel('daily_user_logs')->info('User action logged', [
            'user_id' => auth()->id(),
            'username' => auth()->user()->email,
            'action' => 'logged in',
            'ip' => $ip,
        ]);

        return response()->json([
            'success' => true,
            'token' => $token,
            'role' => $roles->role_id??0,
        ], 200);
    }



     public static function isIpAllowedForUser($userId, $ip)
        {
            return UserIpBinding::where('user', $userId)
                ->where('ip', $ip)
                ->exists();
        }

}
