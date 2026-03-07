<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'loan_id',
        'details_match_whitebook',
        'car_make',
        'car_model',
        'manufacturing_year',
        'vehicle_number_plate',
        'vehicle_engine_number',
        'chassis_number',
        'vehicle_mileage',
        'ball_joints',
        'cv_joints',
        'shocks',
        'control_arms',
        'type_of_vehicle_body',
        'tires_condition',
        'has_extinguisher',
        'has_jack',
        'has_spare_wheel',
        'vehicle_interior',
        'accident_history',
        'paint_condition',
        'engine_condition',
        'vehicle_compression',
        'market_value',
        'amount_requested',
        'amount_approved',
        'submitter_id',
    ];

    protected $casts = [
        'details_match_whitebook' => 'boolean',
        'has_extinguisher' => 'boolean',
        'has_jack' => 'boolean',
        'has_spare_wheel' => 'boolean',
        'market_value' => 'decimal:2',
        'amount_requested' => 'decimal:2',
        'amount_approved' => 'decimal:2',
    ];
}
