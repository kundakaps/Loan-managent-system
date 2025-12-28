<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\AssignedRoles;
use App\Models\UserIpBinding;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

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

    public function AddUser(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'username' => 'required',
           // 'password' => 'required|min:6',
        ]);

        // Check if the username (used as email) already exists
        if (User::where('email', $data['username'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'email already exists'
            ],); // 409 Conflict is appropriate here
        }

        $randomPassword = uniqid();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['username'], // Username is being stored as email
            'password' => Hash::make($randomPassword),
        ]);

        Log::channel('daily_user_logs')->info('User created', [
            'created_by' => auth()->check() ? auth()->id() : 'guest',
            'action' => 'Created user',
            'new_user' => [
                'name' => $data['name'],
                'username' => $data['username'],
            ],
        ]);

        $this->sendSimulateEmail($data['username'], $randomPassword);


        return response()->json([
            'success' => (bool) $user,
            'message' => $user ? 'User created successfully' : 'Failed to create user'
        ], $user ? 201 : 500);
    }



private function sendSimulateEmail($to_email, $password)
    {
        // Define variables for the template
        $loginUrl = "https://muzanga.bytewavetechnologieszm.com/#/home";
        $currentYear = date('Y');

        try {
            // HTML email template
            $html = <<<HTML
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Account Access Details</title>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { padding: 20px; background-color: #f9f9f9; border-left: 1px solid #ddd; border-right: 1px solid #ddd; }
                    .credential-box { background-color: #eef2f7; border: 1px solid #3498db; padding: 15px; margin: 20px 0; border-radius: 5px; }
                    .button-container { text-align: center; margin: 25px 0; }
                    .button { background-color: #3498db; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
                    .footer { padding: 15px; text-align: center; font-size: 12px; color: #777; background-color: #f2f2f2; border-radius: 0 0 5px 5px; border: 1px solid #ddd; border-top: none; }
                    .note { font-size: 13px; color: #e67e22; font-style: italic; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Welcome to Muzanga</h2>
                </div>

                <div class="content">
                    <p>Hello,</p>
                    <p>An account has been created for you. Please use the credentials below to log in to the system:</p>

                    <div class="credential-box">
                        <strong>Email:</strong> {$to_email}<br>
                        <strong>Temporary Password:</strong> <code style="background: #fff; padding: 2px 5px; border-radius: 3px;">{$password}</code>
                    </div>

                    <div class="button-container">
                        <a href="{$loginUrl}" class="button">Log In to Your Account</a>
                    </div>

                    <p class="note"><strong>Security Note:</strong> We recommend changing your password immediately after your first login.</p>

                    <p>Best regards,<br>
                    The Bytewave Technologies Team</p>
                </div>

                <div class="footer">
                    <p>&copy; {$currentYear} Mzanga Financial Services. All rights reserved.</p>
                </div>
            </body>
            </html>
            HTML;

            // Plain text fallback
            $text = "Welcome to Muzanga!\nYour login email: {$to_email}\nYour password: {$password}\nLogin here: {$loginUrl}";

            // Send the mail
            Mail::send([], [], function ($message) use ($to_email, $html, $text) {
                $message->to($to_email)
                        ->subject('Your Account Access Details')
                        ->html($html)
                        ->text($text)
                        ->from(env('MAIL_FROM_ADDRESS'), 'Muzanga Support');
            });

            Log::channel('daily_custom')->info("Login credentials email sent to " . $to_email);
            return true;

        } catch (\Exception $e) {
            Log::channel('daily_custom')->error('Failed to send login email: ' . $e->getMessage());
            return false;
        }
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

    public function getAllUsers(Request $request)
    {
                    $user = auth()->user();
            // $ip = $request->ip();

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

           // return $roles;

            if($roles->role_id != 1){
                return response()->json([
                    'success'=>false,
                    'message'=>'You are not authorized to view this page'
                ]);
            }
            $users = DB::table('users')
            ->leftjoin('assigned_roles', 'users.id', '=', 'assigned_roles.user_id')
            ->leftjoin('roles', 'assigned_roles.role_id', '=', 'roles.role_code')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                //'assigned_roles.role_id',
                'roles.role_name'
            )
            ->get();


            return response()->json([
                'success'=>true,
                'data'=> $users
            ]);
    }



     public static function isIpAllowedForUser($userId, $ip)
        {
            return UserIpBinding::where('user', $userId)
                ->where('ip', $ip)
                ->exists();
        }

}
