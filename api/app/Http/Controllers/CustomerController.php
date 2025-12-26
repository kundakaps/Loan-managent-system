<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\UserIpBinding;


class CustomerController extends Controller
{


public function CreateCustomer(Request $request)
    {

        $user = auth()->user();
        $ip = $request->ip();



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
        // 1) Validate input
        $validated = $request->validate([
            'first_name'           => ['required', 'string', ],
            'last_name'            => ['required', 'string', ],
            'nrc'                  => ['required', 'string', 'unique:customers,nrc'],
            'occupation'           => ['nullable', 'string', ],
            'residential_address'  => ['nullable', 'string', ],
            'contact_number'       => ['required', 'string', ],
            'work_address'         => ['nullable', 'string', ],
            'referral_id'          => ['nullable', 'string', 'exists:customers,id'],
            'next_of_kin_name'     => ['nullable', 'string', ],
            'next_of_kin_phone'    => ['nullable', 'string', ],
            'next_of_kin_email'    => ['nullable', 'email', ],
            'next_of_kin_address'  => ['nullable', 'string', ],
        ]);



        $data = $request->all();


        // 2) Create the record (mass assignment uses $fillable)
        $customer = Customers::create([
            'first_name'           => $validated['first_name'],
            'last_name'            => $validated['last_name'],
            'nrc'                  => $validated['nrc'],
            'occupation'           => $validated['occupation'],
            'residential_address'  => $validated['residential_address'],
            'contact_number'       => $validated['contact_number'],
            'work_address'         => $validated['work_address'],
            //'referral_id'          => $validated['created_by'],
            'next_of_kin_name'     => $validated['next_of_kin_name'],
            'next_of_kin_phone'    => $validated['next_of_kin_phone'],
            'next_of_kin_email'    => $validated['next_of_kin_email'],
            'next_of_kin_address'  => $validated['next_of_kin_address'],
            'created_by'  =>$user->id,
        ]);

        // 3) Return appropriate response
        // If you're building an API:
        if($customer){
            return response()->json([
            'success'  => true,
            'message'  => 'Customer created successfully.',
            'customer' => $customer
        ], 201);
        }else{
            return response()->json([
            'success'  => false,
            'message'  => 'Failed to Create Customer',
           // 'customer' => $customer
        ], 201);
        }

        // Or, if this is a web app form submission, you could:
        // return redirect()->route('customers.show', $customer->id)
        //                  ->with('success', 'Customer created successfully.');
    }

    public function GetAllCustomers(Request $request){
        $user = auth()->user();
        $ip = $request->ip();

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

        $data =Customers::all();

        return response()->json([
            'success'=>true,
            'data'=> $data
        ]);
    }


public static function isIpAllowedForUser($userId, $ip)
    {
            return UserIpBinding::where('user', $userId)
                ->where('ip', $ip)
                ->exists();
    }

public function CreateFacility(Request $request)
    {

        $user = auth()->user();
        $ip = $request->ip();



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
        // 1) Validate input
        $validated = $request->validate([
            'facility_name'           => ['required', 'string', ],
            'facility_percentage'            => ['required', 'string', ],

        ]);



        $data = $request->all();


        // 2) Create the record (mass assignment uses $fillable)
        $customer = Facility::create([
            'facility_name'           => $validated['facility_name'],
            'facility_percentage'     => $validated['facility_percentage'],

        ]);

        // 3) Return appropriate response
        // If you're building an API:
        if($customer){
            return response()->json([
            'success'  => true,
            'message'  => 'Facility created successfully.',
            'customer' => $customer
        ], 201);
        }else{
            return response()->json([
            'success'  => false,
            'message'  => 'Failed to Create Facility',
           // 'customer' => $customer
        ], 201);
        }

        // Or, if this is a web app form submission, you could:
        // return redirect()->route('customers.show', $customer->id)
        //                  ->with('success', 'Customer created successfully.');
    }

public function GetAllFacilities(Request $request){
        $user = auth()->user();
        $ip = $request->ip();

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

        $data =Facility::all();

        return response()->json([
            'success'=>true,
            'data'=> $data
        ]);
    }


}
