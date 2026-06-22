<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutDetails extends Model
{
    protected $fillable = [
        'user_id',
        'account_number',
        'branch_name',
        'sort_code',
        'swift_code',
        'bank_name',
        'mobile_money_number',
        'mobile_money_name'
    ];
}
