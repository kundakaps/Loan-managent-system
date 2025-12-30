<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\Loans;
use App\Models\Facility;
use App\Models\Customers;
use App\Models\Repayments;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\AssignedRoles;
use App\Models\UserIpBinding;
use App\Models\LoanCollateral;
use Illuminate\Support\Facades\DB;
use App\Models\LoanCollateralFiles;
use function Laravel\Prompts\table;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LoanController extends Controller
{
    public function CreateLoan(Request $request)
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

                $data=DB::table('loans')
                    ->join('customers', 'loans.client_id', '=', 'customers.id')
                    ->join('facilities', 'loans.facility_id', '=', 'facilities.id')
                    ->select(
                        'loans.*',
                        'customers.first_name',
                        'customers.last_name',
                        'facilities.facility_name')
                    ->where('loans.posted_by', $user->id)
                    ->get();
                return response()->json([
                    'success'=>true,
                    'data'=> $data
                ]);


            }elseif($roles->role_id == 1){
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





    }

    public function CreateLoanRepayment(Request $request){
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


            $data = $request->validate([
                'loan_id' => 'required',
                'amount' => 'required',
            ]);

        $loan = Loans::where('id',$data['loan_id'])->first();

        if(!$loan){
            return response()->json([
                'success' => false,
                'message' => 'Loan not found'
                ]);
        }


        $nextRepayment = ($loan->next_payment_date ? Carbon::parse($loan->next_payment_date) : now())->addDays(30);

        //add 30 days to the last repayment date using carbon library to create next repayment date
        $next_repayment = ($loan->next_payment_date ? Carbon::parse($loan->next_payment_date) : now())->addDays(30);
        $loan->next_payment_date = $nextRepayment->format('Y-m-d');
        $loan->balance = $loan->balance - $data['amount'];

           $insert = Repayments::create([
            'loan_id' => $data['loan_id'],
            'posted_by' => $user->id,
            'amount' => $data['amount'],
            'next_payment_date' => $nextRepayment->format('Y-m-d')
        ]);






        if($insert){
            $loan->save();
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

    public function getSingleLoan(Request $request){
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



            $loan_id = $request->loan_id;
            //$loan = Loans::where('id', $loan_id)->first();
            $loan = DB::table('loans')
                    ->join('users', 'loans.posted_by', '=', 'users.id')
                    ->select(
                        'loans.*',
                        'users.name as posted_by_name')
                    ->where('loans.id', $loan_id)
                    ->first();

            if (!$loan) {
                 return response()->json([
                    'success' => false,
                    'message' => 'Loan not found'
                ]);

            }
           $customer = Customers::where('id', $loan->client_id)->first();
           $facility = Facility::where('id', $loan->facility_id)->first();
           $collaterals = LoanCollateral::where('loan_id', $loan->id)->first();
           $collaterals_files = LoanCollateralFiles::where('loan_id', $loan->id)->get();
           $repayments = Repayments::where('loan_id', $loan->id)->get();

           return response()->json([
                'success' => true,
                'data' => [
                    'loan' => $loan,
                    'customer' => $customer,
                    'facility' => $facility,
                    'collaterals' => $collaterals,
                    'collaterals_files' => $collaterals_files,
                    'repayments' => $repayments,
                ]
            ]);


    }

    public function CreateLoanCollateral(Request $request){
            $user = auth()->user();
            // $ip = $request->ip();

            //   if (!$this->isIpAllowedForUser($user->id, $ip)) {
            //     // Log unauthorized IP attempt
            //     Log::channel('daily_user_logs')->warning('Unauthorized IP access attempt', [
            //         'user_id' => $user->id,
            //         'username' => $user->email,
            //         'ip' => $ip,
            //         'action' => 'unauthorized IP attempt on login',
            //     ]);


            //     return response()->json([], 401);
            // }



            $data = $request->validate([
                'loan_id' => 'required',
                'number_plate' => 'required',
                'engine_number' => 'required',
                'chassis_number' => 'required',
                'mileage' => 'required',
                'cv_joints_condition' => 'required',
                'shocks_condition' => 'required',
                'control_arms_condition' => 'required',
                'tires_condition' => 'required',
                'body_condition' => 'required',
            ]);
            $loan = Loans::where('id',$data['loan_id'])->first();
            // if($loan->posted_by == $user->id){
            //     return response()->json([
            //         'success'=>false,
            //         'message'=>'You can not add collateral to a loan you created'
            //     ]);

            // }

            $collaterals = LoanCollateral::create([
                'loan_id' => $data['loan_id'],
                'number_plate' => $data['number_plate'],
                'engine_number' => $data['engine_number'],
                'chassis_number' => $data['chassis_number'],
                'mileage' => $data['mileage'],
                'cv_joints_condition' => $data['cv_joints_condition'],
                'shocks_condition' => $data['shocks_condition'],
                'control_arms_condition' => $data['control_arms_condition'],
                'tires_condition' => $data['tires_condition'],
                'body_condition' => $data['body_condition'],
            ]);

            if($collaterals){
                return response()->json([
                'success'  => true,
                'message'  => 'Loan Collateral created successfully.',
                'customer' => $collaterals
            ], 201);
            }else{
             return response()->json([
                'success'  => false,
                'message'  => 'Failed to Create Loan Collateral',
               // 'customer' => $customer
            ], 201);
            }

    }

    public function CreateLoanCollateralFiles(Request $request)
    {
        // 1. Validate
        $validator = Validator::make($request->all(), [
            'loan_id' => 'required|integer',
            'files'   => 'required|array',
            'files.*' => 'file|mimes:jpeg,png,jpg,pdf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $uploadedFiles = [];

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {

                    // 2. Generate a Custom Unique Name
                    // Format: timestamp_randomstring.extension
                    // Example: 1709123456_65e1234abc.jpg
                    $extension = $file->getClientOriginalExtension();
                    $uniqueName = time() . '_' . uniqid() . '.' . $extension;

                    // 3. Store using 'storeAs' to use our custom name
                    // Stores in: storage/app/public/collaterals/{loan_id}/{uniqueName}
                    $path = $file->storeAs(
                        'collaterals/' . $request->loan_id,
                        $uniqueName,
                        'public'
                    );

                    // 4. Generate URL
                    $fullUrl = asset('storage/' . $path);

                    // 5. Save to DB
                    $collateralFile = new LoanCollateralFiles();
                    $collateralFile->loan_id = $request->loan_id;
                    $collateralFile->file_name = $fullUrl;
                    $collateralFile->save();

                    $uploadedFiles[] = $collateralFile;
                }
            }

            $loan = Loans::where('id', $request->loan_id)->first();
            $loan->status = 'unactivated';
            $loan->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Files uploaded successfully',
                'data' => $uploadedFiles
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public static function isIpAllowedForUser($userId, $ip)
    {
            return UserIpBinding::where('user', $userId)
                ->where('ip', $ip)
                ->exists();
    }

    public function getLoansToBeActivated(Request $request){
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



            $data=DB::table('loans')
                    ->join('customers', 'loans.client_id', '=', 'customers.id')
                    ->join('facilities', 'loans.facility_id', '=', 'facilities.id')
                    ->select(
                        'loans.*',
                        'customers.first_name',
                        'customers.last_name',
                        'facilities.facility_name')
                    ->where('loans.status','unactivated')
                    ->get();

            return response()->json([
                'success'=>true,
                'data'=> $data
            ]);
    }




    public function ActivateLoan(Request $request){
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

            $LoanData = Loans::where('id',$request->loan_id)->first();

            if(!$LoanData){
                return response()->json([
                    'success'=>false,
                    'message'=>'Loan not found'
                ]);
            }

            $LoanData->status = 'active';
            $LoanData->save();

            return response()->json([
                'success'=>true,
                'message'=>'Loan activated successfully'
            ]);




    }


}
