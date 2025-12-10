<?php

namespace App\Http\Controllers;

use PDO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{

    public function testConection(){

        //select * from dezb_upload_detail
        //select * from dezb_upload_master


            $sql = <<<SQL
                   SELECT * FROM dezb_upload_detail



               SQL;

                 try {

                $results = DB::connection('flex14')->select($sql);
                 return $results;




            } catch (\Exception $e) {
                // Log the error for debugging purposes.
                \Log::error('Failed to get other bank details from Oracle: ' . $e->getMessage());

                // Return an empty array to prevent breaking the calling code.
                return [];
            }
    }
public function getIndoJV1()
{
    // return hash('sha256', 'password');
    $path = 'C:\\DBs\\Dbase_GP.Mdb';

    try {
        $pdo = new \PDO(
            "odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=$path;Uid=;Pwd=;"
        );

        // Fetch all data
        $stmt = $pdo->query("SELECT * FROM IZBNetPay");
        $allData1 = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // ** SOLUTION: Convert the character encoding to UTF-8 **
        // The array_map function iterates over every row and applies the encoding conversion
        // to each value within that row.
        $encodedData = array_map(function ($row) {
            return array_map(function ($value) {
                // We only convert strings. Numbers, nulls, etc., are left alone.
                // 'Windows-1252' is the most likely source encoding for MS Access.
                return is_string($value) ? mb_convert_encoding($value, 'UTF-8', 'Windows-1252') : $value;
            }, $row);
        }, $allData1);

        //return $encodedData;
        $allData = $encodedData;

        $finalMaster =[
        "USER_ID"=>"MICAH1062",
        "BRANCH_CODE"=>$allData[0]['BRANCH_CODE'],
        "BATCH_NO"=>$allData[0]['BATCH_NO'],
        "BATCH_DESC"=>'INDO JV UPLOAD',
        "BALANCING"=> "Y",
        "UPLOAD_STAT"=> "U",
        "AUTH_STAT"=> "A",
        "RECORD_STAT"=> "O",
        "ONCE_AUTH"=> "Y",
        "SOURCE_CODE"=> trim($allData[0]['SOURCE_CODE']),
        ];

        //return $finalMaster;

        // Define the keys you want to keep in the final output
        $desiredKeys = [
            'CCY_CD', 'AMOUNT', 'ACCOUNT', 'ACCOUNT_BRANCH', 'DR_CR', 'LCY_EQUIVALENT',
            'EXCH_RATE', 'VALUE_DATE', 'INSTRUMENT_NO', 'TXN_CODE', 'FIN_CYCLE',
            'ADDL_TEXT', 'CURR_NO', 'BATCH_NO', 'SOURCE_CODE', 'INITIATION_DATE',
            'BRANCH_CODE', 'UPLOAD_STAT', 'PERIOD_CODE'
        ];

        // An array to hold the filtered data
        $filteredData = [];

        foreach ($allData as $row) {
            $newRow = [];
            // Build a new row with only the desired keys
            foreach ($desiredKeys as $key) {
                // Trim the value if it exists, otherwise keep it (e.g., null)
                $newRow[$key] = isset($row[$key]) ? trim($row[$key]) : null;
            }
            $filteredData[] = $newRow;
        }

       // return $filteredData;



            DB::connection('flex14')->beginTransaction();
            DB::connection('flex14')->table('dezb_upload_master')->insert($finalMaster);
            // Use efficient multi-row insert
            DB::connection('flex14')->table('dezb_upload_detail')->insert($filteredData);

            DB::connection('flex14')->commit();

        return response()->json([
            'success' => true,
            'message' => 'Data inserted successfully.'
        ], 200);

    } catch (\PDOException $e) {
        // It's good practice to catch potential connection errors
        // Log the error and return a proper error response
        \Log::error("Database connection failed: " . $e->getMessage());
        return response()->json(['error' => 'Could not connect to the database.'], 500);
    }
}

public function getIndoJV()
{

    // return hash('sha256', 'password');
    $path = 'C:\\DBs\\Dbase_GP.Mdb';

    $pdo = new \PDO(
        "odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=$path;Uid=;Pwd=;"
    );

    // Fetch all data
    $stmt = $pdo->query("SELECT * FROM IZBNetPay");
    $allData = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    return $allData;



$finalMaster =[
    "USER_ID"=>"MICAH1062",
    "BRANCH_CODE"=>trim($allData[0]['BRANCH_CODE']), // Good practice to trim this too
    "BATCH_NO"=>trim($allData[0]['BATCH_NO']),      // <<< THE FIX IS HERE
    "BATCH_DESC"=>'INDO JV UPLOAD',
    "BALANCING"=> "Y",
    "UPLOAD_STAT"=> "U",
    "AUTH_STAT"=> "A",
    "RECORD_STAT"=> "O",
    "ONCE_AUTH"=> "Y",
    "SOURCE_CODE"=> trim($allData[0]['SOURCE_CODE']), // You were already doing this correctly
];

    //return $finalMaster;

    // Define the keys you want to keep in the final output
    $desiredKeys = [
        'CCY_CD', 'AMOUNT', 'ACCOUNT', 'ACCOUNT_BRANCH', 'DR_CR', 'LCY_EQUIVALENT',
        'EXCH_RATE', 'VALUE_DATE', 'INSTRUMENT_NO', 'TXN_CODE', 'FIN_CYCLE',
        'ADDL_TEXT', 'CURR_NO', 'BATCH_NO', 'SOURCE_CODE', 'INITIATION_DATE',
        'BRANCH_CODE', 'UPLOAD_STAT', 'PERIOD_CODE'
    ];

    // An array to hold the filtered data
    $filteredData = [];

    foreach ($allData as $row) {
        $newRow = [];
        // Build a new row with only the desired keys
        foreach ($desiredKeys as $key) {
            // Trim the value if it exists, otherwise keep it (e.g., null)
            $newRow[$key] = isset($row[$key]) ? trim($row[$key]) : null;
        }
        $filteredData[] = $newRow;
    }

     return $filteredData;



        DB::connection('oracle')->beginTransaction();
        DB::connection('oracle')->table('detb_upload_master')->insert($finalMaster);
        // Use efficient multi-row insert
        DB::connection('oracle')->table('detb_upload_detail')->insert($filteredData);

        DB::connection('oracle')->commit();

    return $filteredData;
 }

}
