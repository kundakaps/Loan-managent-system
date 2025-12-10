<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loans extends Model
{
    protected $fillable = [
        'posted_by',
        'client_id',
        'facility_id',
        'amount',
        'tenure',
        'monthly_repayment',
        'next_payment_date',
        'status',
        'balance'
    ];
}
