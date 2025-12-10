<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repayments extends Model
{
    protected $fillable = [
        'loan_id',
        'posted_by',
        'amount',
        'next_payment_date'
    ];
}
