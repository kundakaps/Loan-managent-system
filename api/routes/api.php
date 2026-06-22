<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ERPController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PacraController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\SchoolsController;
use App\Http\Controllers\UtilityController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Models\User;

Route::options('{any}', function (Request $request) {
    return response()->json([], 200);
})->where('any', '.*');



Route::middleware('auth:api')->group(function () {

    Route::get('me', [UserController::class,'me']);

    Route::get('dashboarddata', [DashboardController::class,'DashboardData']);



    Route::post('addcustomer',[CustomerController::class, 'CreateCustomer']);
    Route::get('customers',[CustomerController::class, 'GetAllCustomers']);
    Route::get('customer/{id}',[CustomerController::class, 'getSingleCustomer']);

    Route::post('addfacility',[CustomerController::class, 'CreateFacility']);
    Route::get('allfacilities',[CustomerController::class, 'GetAllFacilities']);

    Route::post('addloan',[LoanController::class, 'CreateLoan']);
    Route::get('allloans',[LoanController::class, 'GetAllLoans']);
    Route::get('unactivatedloans',[LoanController::class, 'getLoansToBeActivated']);
    Route::get('unpaidloans',[LoanController::class, 'getLoansToBePaidout']);
    Route::get('paidloans',[LoanController::class, 'paidLoans']);
    Route::post('reject-loan',[LoanController::class, 'rejectLoanLoan']);
    Route::post('disbursement',[LoanController::class, 'storeDisbursement']);
    Route::post('activateloan',[LoanController::class, 'ActivateLoan']);
    Route::post('singleloan',[LoanController::class, 'getSingleLoan']);
    Route::post('loans/edit',[LoanController::class, 'EditLoan']);
    Route::post('makerepayment',[LoanController::class, 'CreateLoanRepayment']);
    Route::get('pendingcollaterals',[LoanController::class, 'LoansPendingCollateral']);
    Route::post('loan-collaterals',[LoanController::class, 'CreateLoanCollateral']);
    Route::post('vehicle-assessment',[LoanController::class, 'storeVehicleAssessment']);
    Route::post('loan-collateral-files',[LoanController::class, 'CreateLoanCollateralFiles']);
    Route::post('client-collateral',[LoanController::class, 'getClientCollateral']);
    Route::post('client-payout-details',[LoanController::class, 'getClientPayoutDetails']);
    Route::post('assignrole',[UserController::class, 'assignRoles']);
    Route::get('roles',[UserController::class, 'getRoles']);



    Route::get('users',[UserController::class, 'getAllUsers']);
    Route::post('adduser',[UserController::class, 'AddUser']);
    Route::post('updateuser',[UserController::class, 'updateUser']);









    //pacra endpoints
    Route::post('/pacra/entitydetails', [PacraController::class,'InstitutionLookUp']);
    Route::post('/pacra/watchlist', [PacraController::class,'InstitutionWatchList']);














});

Route::get('/getdata', [PayrollController::class,'getIndoJV1']);
Route::get('/testconection', [PayrollController::class,'testConection']);

Route::post('auth/login', [UserController::class,'login']);
Route::post('auth/adduser', [UserController::class,'createUser']);

