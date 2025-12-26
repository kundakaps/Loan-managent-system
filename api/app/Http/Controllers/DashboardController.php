<?php

namespace App\Http\Controllers;

use App\Models\Loans;
use App\Models\Customers;
use App\Models\Repayments;
use Illuminate\Http\Request;
use App\Models\UserIpBinding;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DashboardController extends Controller
{
public static function isIpAllowedForUser($userId, $ip)
    {
            return UserIpBinding::where('user', $userId)
                ->where('ip', $ip)
                ->exists();
    }
    public function DashboardData(Request $request)
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



                $today = Carbon::today()->format('Y-m-d');

                // Aggregates
                $totalClients = Customers::count();

                // Expected payments (based on loans with next_payment_date today)
                $totalPaymentsExpectedToday = Loans::whereDate('next_payment_date', $today)->where('status','active')->count();
                $expectedSumForToday        = Loans::whereDate('next_payment_date', $today)->where('status','active')->sum('monthly_repayment');

                // Actual payments (assuming repayments have payment_date)
                // If you don't have payment_date, switch to whereDate('created_at', $today)
                $totalPaymentsToday = Repayments::whereDate('next_payment_date', $today)->count();
                $sumPaidToday       = Repayments::whereDate('next_payment_date', $today)->sum('amount');

                $totalLoans         = Loans::count();
                $totalActiveLoans   = Loans::where('status', 'active')->count();
                $totalInactiveLoans = Loans::where('status', 'closed')->count();
                $totalPendingCollateralLoans = Loans::where('status', 'Pending Collateral')->count();
                $totalRepayments    = Repayments::count();



                return response()->json([
                    'success' => true,
                    'data' => [
                        'total_clients'                  => $totalClients,
                        'total_payments_expected_today'  => $totalPaymentsExpectedToday,
                        'expected_sum_for_today'         => (float) $expectedSumForToday,
                        'total_payments_today'           => $totalPaymentsToday,
                        'sum_paid_today'                 => (float) $sumPaidToday,
                        'total_loans'                    => $totalLoans,
                        'total_active_loans'             => $totalActiveLoans,
                        'total_inactive_loans'           => $totalInactiveLoans,
                        'total_repayments_count'         => $totalRepayments,
                        'total_pending_collateral_loans' => $totalPendingCollateralLoans,
                    ],
                ]);


    }
}
