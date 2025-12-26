<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanCollateral extends Model
{
    protected $fillable = [
        'loan_id',
        'number_plate',
        'engine_number',
        'chassis_number',
        'mileage',
        'cv_joints_condition',
        'shocks_condition',
        'control_arms_condition',
        'tires_condition',
        'body_condition',

    ];
}
