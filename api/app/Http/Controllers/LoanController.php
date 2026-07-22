<?php

namespace App\Http\Controllers;
use App\Models\AssignedRoles;
use App\Models\ClientContracts;
use App\Models\Customers;
use App\Models\DisbursementAgreement;
use App\Models\Facility;
use App\Models\LoanCollateral;
use App\Models\LoanCollateralFiles;
use App\Models\LoanRejectionReason;
use App\Models\Loans;
use App\Models\PayoutDetails;
use App\Models\Repayments;
use App\Models\UserIpBinding;
use App\Models\VehicleAssessment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use function Laravel\Prompts\table;

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
                'collateral_id'=>'required'
              //  'next_payment' => 'required',

            ]);

            $tenure_in_months = $data['tenure']/ 30;
            $balance =$data['monthly_repayments'] * $tenure_in_months;


            $next_repayment = now()->addDays(30);
            //$data['next_payment'] = $next_repayment


        $insertLoan = Loans::create([
            'posted_by' => $user->id,
            'client_id' => $data['client_id'],
            'facility_id' => $data['facility_name'],
            'collateral_id'=>$data['collateral_id'],
            'amount' => $data['amount'],
            'tenure' => $data['tenure'],
            'status' => 'Pending Approval',
            'monthly_repayment' => $data['monthly_repayments'],
            'next_payment_date' => $next_repayment,
            'balance' => $balance,
        ]);


        $disbursement_agreement = DisbursementAgreement::create([
            'loan_id' => $insertLoan->id,
            'user_id'=> $data['client_id'],
            'total_sum' => $data['amount'],
            'recipient_name' => $request->recipient_name,
            'apply_admin_fee' => $request->apply_admin,
            'admin_fee_amount' => $request->admin_fee,
            'apply_ownership_change_fee' => $request->apply_ownership,
            'ownership_change_fee_amount' => $request->ownership_fee,
            'apply_caveat_removal_fee' => $request->apply_caveat,
            'caveat_removal_fee_amount' => $request->caveat_fee,
            'net_payout_amount' => $request->net_payout,
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

        if ($roles->role_id == 1 || $roles->role_id == 4) {
            $data = DB::table('loans')
                ->join('customers', 'loans.client_id', '=', 'customers.id')
                ->join('facilities', 'loans.facility_id', '=', 'facilities.id')
                ->select(
                    'loans.*',
                    'customers.first_name',
                    'customers.last_name',
                    'facilities.facility_name'
                )
                ->get();

        } else {
            $data = DB::table('loans')
                ->join('customers', 'loans.client_id', '=', 'customers.id')
                ->join('facilities', 'loans.facility_id', '=', 'facilities.id')
                ->select(
                    'loans.*',
                    'customers.first_name',
                    'customers.last_name',
                    'facilities.facility_name'
                )
                ->where('loans.posted_by', $user->id)
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);





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
      // $loan->next_payment_date = $nextRepayment->format('Y-m-d');
        $loan->balance = $loan->balance - $data['amount'];

           $insert = Repayments::create([
            'loan_id' => $data['loan_id'],
            'posted_by' => $user->id,
            'amount' => $data['amount'],
            'next_payment_date' => $nextRepayment->format('Y-m-d')
        ]);






        if($insert){
            $loan->save();

            $loan_repayment_date = $loan->next_payment_date;
            $current_date = date('Y-m-d');
            //add 7 days to repayment date
            $current_date_plus_seven = date('Y-m-d', strtotime($current_date . ' +7 days'));
            //check if current_date_plus_seven is greater than loan_repayment_date
            if($current_date_plus_seven > $loan_repayment_date){
                $this->repayment_recalculation($loan->id);
            }

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
    private function repayment_recalculation($loan_id){
        $loan = Loans::where('id',$loan_id)->first();
        if($loan->balance >= $loan->amount){
            $loan_repayment_date = $loan->next_payment_date;
            $this->extracted($loan, $loan_repayment_date);
            return;

        }else{
            $loan->amount = $loan->balance;
            $loan->save();
            $loan_repayment_date = $loan->next_payment_date;
            $this->extracted($loan, $loan_repayment_date);

            return;
        }

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
           $collaterals = VehicleAssessment::where('id', $loan->collateral_id)->first();
           $collaterals_files = LoanCollateralFiles::where('collateral_id', $collaterals->id)->get();
           $repayments = Repayments::where('loan_id', $loan->id)->get();
           $payout_details = DisbursementAgreement::where('loan_id', $loan->id)->first();
           $account_details = PayoutDetails::where('user_id', $customer->id)->first();
           $rejected = LoanRejectionReason::where('loan_id', $loan->id)->first();
           $contract = ClientContracts::where('loan_id', $loan->id)->get();




           return response()->json([
                'success' => true,
                'data' => [
                    'loan' => $loan,
                    'customer' => $customer,
                    'facility' => $facility,
                    'collaterals' => $collaterals,
                    'collaterals_files' => $collaterals_files,
                    'repayments' => $repayments,
                    'payout_details' => $payout_details,
                    'account_details' => $account_details,
                    'rejected_loan'=> $rejected,
                    'contract' => $contract,

                ]
            ]);


    }

    public function EditLoan(Request $request)
    {
        $user = auth()->user();

        $roles = AssignedRoles::where('user_id', $user->id)->first();

        if (!$roles || $roles->role_id != 1) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action'
            ]);
        }

        $validated = $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'amount' => 'sometimes|numeric|min:0',
            'balance' => 'sometimes|numeric|min:0',
            'tenure' => 'sometimes|integer|min:1',
            'next_payment_date' => 'sometimes|date',
        ]);

        $loan = Loans::where('id', $validated['loan_id'])->first();

        if (!$loan) {
            return response()->json([
                'success' => false,
                'message' => 'Loan not found'
            ]);
        }

        $editableFields = ['amount', 'balance', 'tenure', 'next_payment_date'];
        $updated = false;

        foreach ($editableFields as $field) {
            if (array_key_exists($field, $validated)) {
                $loan->$field = $validated[$field];
                $updated = true;
            }
        }

        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'No fields provided to update'
            ]);
        }

        $loan->save();

        return response()->json([
            'success' => true,
            'message' => 'Loan details updated successfully',
            'data' => $loan
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
                'loan_id' => 'required|exists:loans,id',
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
                'client_id' => $loan->client_id,
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



public function getClientCollateral(Request $request)
{
    $validated = $request->validate([
        'client_id' => 'required|integer',
    ]);

        $rows = DB::table('vehicle_assessments as c')
        ->leftJoin('loan_collateral_files as f', 'c.id', '=', 'f.collateral_id')
        ->where('c.customer_id', $validated['client_id'])
        ->select('c.*', 'f.file_name')
        ->get();

        $data = $rows->groupBy('id')->map(function ($group) {
            $assessment = $group->first();
            $assessment->files = $group
                ->pluck('file_name')
                ->filter()
                ->values();

            unset($assessment->file_name);

            return $assessment;
        })->values();

    return response()->json($data);
}

public function getClientPayoutDetails(Request $request)
{
    $validated = $request->validate([
        'client_id' => 'required',
    ]);

    $data = PayoutDetails::where('user_id', $validated['client_id'])->first();

    return response()->json($data);

}

    public function LoansPendingCollateral(Request $request)
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

            if($roles->role_id != 2){
                return response()->json([
                    'success'=>false,
                    'message'=>'You are not authorized to view this page'
                ]);
            }

                $loans=DB::table('customers')
                   // ->join('customers', 'loans.client_id', '=', 'customers.id')
                    //->join('facilities', 'loans.facility_id', '=', 'facilities.id')
                    ->select(
                        //'loans.*',
                        'customers.id as client_id',
                        'customers.first_name as customer_first_name',
                        'customers.last_name as customer_last_name',
                       // 'facilities.facility_name'
                       )
                  //  ->where('status','Pending Collateral')
                    ->get();

            return response()->json([
                'success'=>true,
                'data'=> $loans
                ]);



    }



public function storeVehicleAssessment(Request $request)
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

            if($roles->role_id != 2){
                return response()->json([
                    'success'=>false,
                    'message'=>'You are not authorized to view this page'
                ]);
            }

        $validated = $request->validate([
            'customer_id'             => 'required',
           // 'loan_id'                 => 'required|string',
            'details_match_whitebook' => 'boolean',
            'car_make'                => 'required|string',
            'car_model'               => 'required|string',
            'manufacturing_year'      => 'required|string',
            'vehicle_number_plate'    => 'required|string',
            'vehicle_engine_number'   => 'required|string',
            'chassis_number'          => 'required|string',
            'vehicle_mileage'         => 'required|numeric',

            // Enum validation for ratings
            'ball_joints'             => 'nullable|in:V.GOOD,GOOD,FAIR,POOR',
            'cv_joints'               => 'nullable|in:V.GOOD,GOOD,FAIR,POOR',
            'shocks'                  => 'nullable|in:V.GOOD,GOOD,FAIR,POOR',
            'control_arms'            => 'nullable|in:V.GOOD,GOOD,FAIR,POOR',

            'type_of_vehicle_body'    => 'nullable|string',
            'tires_condition'         => 'nullable|string',

            // Booleans for inventory
            'has_extinguisher'        => 'boolean',
            'has_jack'                => 'boolean',
            'has_spare_wheel'         => 'boolean',

            'vehicle_interior'        => 'nullable|string',
            'accident_history'        => 'nullable|string',
            'paint_condition'         => 'nullable|string',
            'engine_condition'        => 'nullable|string',
            'vehicle_compression'     => 'nullable|string',

            'market_value'            => 'nullable|numeric',
            'amount_requested'        => 'nullable|numeric',
            'amount_approved'         => 'nullable|numeric',

        ]);

            $validated['submitter_id'] = $user->id;
            $validated['loan_id'] = "0";


        try {
            $assessment = VehicleAssessment::create($validated);

            // $loadUpdateData = Loans::where('id',$request->loan_id)->first();
            // $loadUpdateData->status ='unpaid';
            // $loadUpdateData->save();


            return response()->json([
                'success'  => true,
                'message' => 'Vehicle assessment saved successfully',
                'data'    => $assessment,
                'assessment'=>$assessment->id,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save assessment',
                'error'   => $e->getMessage()
            ], 500);
        }
    }



    public function CreateLoanCollateralFiles(Request $request)
    {
        // 1. Validate
        $validator = Validator::make($request->all(), [
            'collateral_id' => 'required',
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
                        'collaterals/' . $request->collateral_id,
                        $uniqueName,
                        'public'
                    );

                    // 4. Generate URL
                    $fullUrl = asset('storage/' . $path);

                    // 5. Save to DB
                    $collateralFile = new LoanCollateralFiles();
                    $collateralFile->collateral_id = $request->collateral_id;
                    $collateralFile->file_name = $fullUrl;
                    $collateralFile->save();

                    $uploadedFiles[] = $collateralFile;
                }
            }

            // $loan = Loans::where('id', $request->loan_id)->first();
            // $loan->status = 'unpaid';
            // $loan->save();

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

    public function getLoansToBePaidout(Request $request){
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

            if($roles->role_id != 3){
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
                    ->where('loans.status','approved')
                    ->get();

            return response()->json([
                'success'=>true,
                'data'=> $data
            ]);

    }

    public function rejectLoanLoan(Request $request){
            $user = auth()->user();

            $roles = AssignedRoles::where('user_id', $user->id)->first();

           // return $roles;

            if($roles->role_id != 1){
                return response()->json([
                    'success'=>false,
                    'message'=>'You are not authorized to view this page'
                ]);
            }

            $data = $request->validate([
                'loan_id' => 'required',
                'reason' => 'required',
            ]);

            $loan = Loans::where('id', $data['loan_id'])->first();

            if(!$loan){
                return response()->json([
                    'success'=>false,
                    'message'=>'Loan not found'
                ]);
            }

            $loan->status = 'rejected';
            $loan->save();

            $loan_rejection = LoanRejectionReason::create([
                'loan_id' => $data['loan_id'],
                'reason' => $data['reason'],
                'rejected_by'=> $user->id
            ]);

            return response()->json([
                'success'=>true,
                'message'=>'Loan Rejected Successfully'
            ]);





    }

    public function paidLoans(Request $request){
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

            if($roles->role_id != 3){
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
                    ->where('loans.status','active')
                    ->get();

            return response()->json([
                'success'=>true,
                'data'=> $data
            ]);

    }

public function storeDisbursement(Request $request)
{
       $user = auth()->user();
       $roles = AssignedRoles::where('user_id', $user->id)->first();

           // return $roles;

            if($roles->role_id != 3){
                return response()->json([
                    'success'=>false,
                    'message'=>'You are not authorized to view this page'
                ]);
            }


    $validated = $request->validate([
        'loan_id'              => 'required|exists:loans,id',
        // 'total_sum'            => 'required|numeric',
        // 'recipient_name'       => 'required|string',

        // // Deduction data from frontend
        // 'admin_fee_amount'     => 'nullable|numeric',
        // 'apply_admin_fee'      => 'boolean',
        // 'ownership_fee_amount' => 'nullable|numeric',
        // 'apply_ownership_fee'  => 'boolean',
        // 'caveat_fee_amount'    => 'nullable|numeric',
        // 'apply_caveat_fee'     => 'boolean',

        // // Final Payout from frontend
        // 'net_payout_amount'    => 'required|numeric',

        // // Bank Details
        // 'account_no'           => 'required|string',
        // 'bank_name'            => 'required|string',
        // 'account_name'         => 'required|string',
        // 'phone_no'             => 'required|string',

        // // Signatures (Base64 or Paths)
        // 'client_signature'      => 'nullable|string',
        // 'client_signature_date' => 'required|date',
        // 'acknowledgement_name'  => 'required|string',
        // 'staff_signature'       => 'nullable|string',
        // 'staff_signature_date'  => 'required|date',
    ]);

   // $validated['user_id'] = $user->id;


    try {
        // Create the record with exactly what was sent
    //    $disbursement = DisbursementAgreement::create($validated);
        $loan = Loans::where('id', $request->loan_id)->first();

        $loan->status = 'active';
        $next_repayment = now()->addDays(30);
        $loan->next_payment_date = $next_repayment->format('Y-m-d');
        $loan->save();


        return response()->json([
            'success' => true,
            'message' => 'Disbursement Details veried successfully & Loan Activated',
           // 'data'    => $disbursement
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error'   => 'Failed to save data',
            'details' => $e->getMessage()
        ], 500);
    }
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
                    ->where('loans.status','pending approval')
                    ->get();

            return response()->json([
                'success'=>true,
                'data'=> $data
            ]);
    }




    public function ActivateLoan(Request $request)
    {
        $user = auth()->user();

        // ✅ Check role
        $roles = AssignedRoles::where('user_id', $user->id)->first();

        if (!$roles || $roles->role_id != 1) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action'
            ]);
        }

        // ✅ Validate request
        $validator = Validator::make($request->all(), [
            'loan_id' => 'required|exists:loans,id',
            'contracts' => 'required|array',
            'contracts.*' => 'file|mimes:pdf|max:20480' // 20MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ]);
        }

        // ✅ Get loan
        $loan = Loans::where('id', $request->loan_id)->first();

        if (!$loan) {
            return response()->json([
                'success' => false,
                'message' => 'Loan not found'
            ]);
        }

        // ✅ Store Files
        if ($request->hasFile('contracts')) {

            foreach ($request->file('contracts') as $file) {

                // Generate unique filename
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                // Store file (storage/app/public/contracts)
                $path = $file->storeAs('contracts', $filename, 'public');

                // Save to DB
                ClientContracts::create([
                    'loan_id' => $loan->id,
                    'file_path' => $path
                ]);
            }
        }

        // ✅ Approve Loan
        $loan->status = 'approved';
        $loan->save();

        return response()->json([
            'success' => true,
            'message' => 'Loan approved and contracts uploaded successfully'
        ]);
    }

    public function MonthlyCalculations(){

        $loans =Loans::where('status','active')->get();

        //loop through the loans

        foreach($loans as $loan){
            $loan_repayment_date = $loan->next_payment_date;
            $current_date = date('Y-m-d');
            //add 7 days to repayment date
            $current_date_plus_seven = date('Y-m-d', strtotime($current_date . ' +7 days'));
            //check if current_date_plus_seven is greater than loan_repayment_date
            if($current_date_plus_seven > $loan_repayment_date){
                $this->extracted($loan, $loan_repayment_date);

            }else{
                echo "loan repayment date is not yet due";
                continue;
            }
        }




    }

    private function recalculate($id)
    {
        $loan = Loans::where('id',$id)->first();
        $facility = Facility::where('id',$loan->facility_id)->first();
        $percent = $facility->facility_percentage / 100;
      //  echo  "percentage is : ".$percent."\n";
        $tenure = $loan->tenure/30;
        $amount = $loan->amount;
        $monthly_repayment = ($amount * $percent) / $tenure;
      //  echo "monthly repayment is : ".$monthly_repayment."\n";
        return $monthly_repayment;
    }

    /**
     * @param $loan
     * @param $loan_repayment_date
     * @return void
     */
    private function extracted($loan, $loan_repayment_date): void
    {
        $returned_monthly = $this->recalculate($loan->id);
        $new_balance = $loan->balance + $returned_monthly;
        $new_payment_date = date('Y-m-d', strtotime($loan_repayment_date . ' +30 days'));
      //  echo "new balance is : " . $new_balance . "\n";
     //   echo "new payment date is : " . $new_payment_date . "\n";
        $loan->balance = $new_balance;
        $loan->next_payment_date = $new_payment_date;
        $loan->save();
    }


}
