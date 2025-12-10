<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PacraController extends Controller
{
    private $base_url ='https://int.pacra.org.zm:8088';



    public function InstitutionLookUp(Request $request){

            $ip = $request->ip();
            $user = auth()->user();


            $userController = new UserController();
            if (!$userController->isIpAllowedForUser($user->id, $ip)) {
                // Log unauthorized IP attempt
                Log::channel('daily_user_logs')->warning('Unauthorized IP access attempt', [
                    'user_id' => $user->id,
                    'username' => $user->email,
                    'ip' => $ip,
                    'action' => 'unauthorized IP attempt on login',
                ]);

                $errorResponse = [];

                // Log the request/response
                $loggingController = new LoggingController();
                $loggingController->logRequestResponse($request, $errorResponse, 403);

                return response()->json($errorResponse, 401);
            }



            $data = $request->validate([
                'entityNumber' => ['required', 'string', 'size:12'],
            ]);

         $body=[
            "entityNumber"=>$data['entityNumber']
         ];


         $response = Http::withHeaders([
                'Apikey' => '446db7ef-6ee3-4f30-b874-72fa51092bf2',
            ])
            ->withoutVerifying()
            ->post($this->base_url . '/openapi/getEntity', $body);



            // Initialize logging controller
            $loggingController = new LoggingController();
            // Check if the response is successful
            if ($response->successful()) {
                $successResponse = [
                    'success' => true,
                    'data' => $response->json()
                ];
                // Log the request/response
                $loggingController->logRequestResponse($request, $successResponse, 200);
             // Return the JSON response
             return response()->json([
                 'success'=>true,
                 'data'=>$response->json()
             ]);
         } else {

             $failedResponse = [
                    'success' => false,
                    'data' => $response->body()
                ];
                // Log the request/response
                $loggingController->logRequestResponse($request, $failedResponse, $response->status());

             // Return an error response if the request fails
             return response()->json([
                 'error' => 'Unable to fetch entity.',
                 'message' => $response->body(),
             ], $response->status());
         }
     }


    public function InstitutionWatchList(Request $request){

            $ip = $request->ip();
            $user = auth()->user();


            $userController = new UserController();
            if (!$userController->isIpAllowedForUser($user->id, $ip)) {
                // Log unauthorized IP attempt
                Log::channel('daily_user_logs')->warning('Unauthorized IP access attempt', [
                    'user_id' => $user->id,
                    'username' => $user->email,
                    'ip' => $ip,
                    'action' => 'unauthorized IP attempt on login',
                ]);

                $errorResponse = [];

                // Log the request/response
                $loggingController = new LoggingController();
                $loggingController->logRequestResponse($request, $errorResponse, 403);

                return response()->json($errorResponse, 401);
            }



            $data = $request->validate([
                'entityNumber' => ['required', 'string', 'size:12'],
                'action' => ['required','size:1'],
            ]);

         $body=[
            "entityNumber"=>$data['entityNumber'],
            "action"=>$data['action'],
         ];


         $response = Http::withHeaders([
                'Apikey' => '446db7ef-6ee3-4f30-b874-72fa51092bf2',
            ])
            ->withoutVerifying()
            ->post($this->base_url . '/openapi/watchlist', $body);



            // Initialize logging controller
            $loggingController = new LoggingController();
            // Check if the response is successful
            if ($response->successful()) {
                $successResponse = [
                    'success' => true,
                    'data' => $response->json()
                ];
                // Log the request/response
                $loggingController->logRequestResponse($request, $successResponse, 200);
             // Return the JSON response
             return response()->json([
                 'success'=>true,
                 'data'=>$response->json()
             ]);
         } else {

             $failedResponse = [
                    'success' => false,
                    'data' => $response->body()
                ];
                // Log the request/response
                $loggingController->logRequestResponse($request, $failedResponse, $response->status());

             // Return an error response if the request fails
             return response()->json([
                 'error' => 'Unable to fetch entity.',
                 'message' => $response->body(),
             ], $response->status());
         }
     }

}
