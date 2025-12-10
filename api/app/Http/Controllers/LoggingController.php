<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RequestresponseLogs;
use Illuminate\Http\Client\Response as HttpResponse;

class LoggingController extends Controller
{
    /**
     * Log request and response data to the database
     *
     * @param Request $request - The incoming HTTP request to your function
     * @param mixed $responseData - The response data your function will return
     * @param int $statusCode - The HTTP status code your function will return
     * @return void
     */
    public function logRequestResponse(
        Request $request,
        $responseData,
        int $statusCode = 200
    ): void {
        try {
            // Get request body based on method
            $requestBody = null;
            if (in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
                $requestBody = $request->all();
            }

            $logData = [
                'user_id' => auth()->id() ?? 0,
                'request_method' => $request->method(),
                'headers' => json_encode($request->headers->all()),
                'url' => $request->fullUrl(),
                'request_body' => $requestBody ? json_encode($requestBody) : null,
                'response_body' => json_encode($responseData),
                'response_status_code' => $statusCode,
                'source_ip_address' => $request->ip(),
            ];

            RequestresponseLogs::create($logData);

        } catch (\Exception $e) {
            // Log the error but don't throw it to avoid breaking the main flow
            \Log::error('Failed to log request/response data: ' . $e->getMessage());
        }
    }
}
