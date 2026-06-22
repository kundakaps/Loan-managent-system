<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanCollateralFiles extends Model
{
    protected $fillable = [
        'collateral_id',
        'file_name'
    ];
}
