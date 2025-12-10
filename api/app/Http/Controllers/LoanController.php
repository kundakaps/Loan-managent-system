<?php

namespace App\Http\Controllers;
use App\Models\Loans;
use App\Models\Repayments;
use Illuminate\Http\Request;
use App\Models\UserIpBinding;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LoanController extends Controller
{
    public function CreateLoan(Request $request)
    {

            $user = auth()->user();
            $ip = $request->ip();

            if (!$this->isIpAllowedForUser($user->id, $ip)) {
                // Log unauthorized IP attempt
                Log::channel('daily_user_logs')->warning('Unauthorized IP access attempt', [
                    'user_id' => $user->id,
                    'username' => $user->email,
                    'ip' => $ip,
                    'action' => 'unauthorized IP attempt on login',
                ]);


                return response()->json([], 401);
            }

            $data = $request->validate([
                'client_id' => 'required',
                'facility_name' => 'required',
                'amount' => 'required',
                'tenure' => 'required',
                'monthly_repayments' => 'required',
                'next_payment' => 'required',

            ]);

        $insertLoan = Loans::create([
            'posted_by' => $user->id,
            'client_id' => $data['client_id'],
            'facility_id' => $data['facility_name'],
            'amount' => $data['amount'],
            'tenure' => $data['tenure'],
            'status' => 'Pending Collateral',
            'monthly_repayment' => $data['monthly_repayments'],
            'next_payment_date' => $data['next_payment'],
            'balance' => $data['amount'],
        ]);

        if($insertLoan){
            return response()->json([
            'success'  => true,
            'message'  => 'Loan created successfully.',
            'customer' => $insertLoan
        ], 201);
        }else{
            return response()->json([
            'success'  => false,
            'message'  => 'Failed to Create Loan',
           // 'customer' => $customer
        ], 201);
        }

    }

    public function GetAllLoans(Request $request)
    {

            $user = auth()->user();
            $ip = $request->ip();

            if (!$this->isIpAllowedForUser($user->id, $ip)) {
                // Log unauthorized IP attempt
                Log::channel('daily_user_logs')->warning('Unauthorized IP access attempt', [
                    'user_id' => $user->id,
                    'username' => $user->email,
                    'ip' => $ip,
                    'action' => 'unauthorized IP attempt on login',
                ]);


                return response()->json([], 401);
            }

            $data=DB::table('loans')
                    ->join('customers', 'loans.client_id', '=', 'customers.id')
                    ->join('facilities', 'loans.facility_id', '=', 'facilities.id')
                    ->select(
                        'loans.*',
                        'customers.first_name',
                        'customers.last_name',
                        'facilities.facility_name')
                    ->get();

            return response()->json([
                'success'=>true,
                'data'=> $data
            ]);

    }

    public function CreateLoanRepayment(Request $request){
            $user = auth()->user();
            $ip = $request->ip();

            if (!$this->isIpAllowedForUser($user->id, $ip)) {
                // Log unauthorized IP attempt
                Log::channel('daily_user_logs')->warning('Unauthorized IP access attempt', [
                    'user_id' => $user->id,
                    'username' => $user->email,
                    'ip' => $ip,
                    'action' => 'unauthorized IP attempt on login',
                ]);


                return response()->json([], 401);
            }


            $data = validator([
                'loan_id' => 'required',
                'amount' => 'required',
            ]);

        $loan = Loans::find($data['loan_id']);

        if(!$loan){
            return response()->json([
                'success' => false,
                'message' => 'Loan not found'
                ]);
        }

        $last_repayment = $loan->next_payment_date;
        //add 30 days to the last repayment date using carbon library to create next repayment date
        $next_repayment = $last_repayment->add('days', 30);
        $loan->next_payment_date = $next_repayment;
        $loan->balance = $loan->balance - $data['amount'];
        $loan->save();


        $insert = Repayments::create([
            'loan_id' => $data['loan_id'],
            'posted_by' => $user->id,
            'amount' => $data['amount'],
            'date' => $next_repayment
        ]);


        if($insert){
            return response()->json([
                'success' => true,
                'message' => 'Loan repayment created successfully'
                ]);
        }

        return response()->json([
                'success' => false,
                'message' => 'Failed to create loan repayment'
                ]);


    }



    public static function isIpAllowedForUser($userId, $ip)
    {
            return UserIpBinding::where('user', $userId)
                ->where('ip', $ip)
                ->exists();
    }
}
