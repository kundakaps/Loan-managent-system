<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanRejectionReason extends Model
{
    protected $fillable = [
        'loan_id',
        'reason',
        'rejected_by'
    ];
}
