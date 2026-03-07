<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'nrc',
        'phone_number',
        'occupation',
        'residential_address',
        'contact_number',
        'work_address',
        'referral_name',
        'referral_phone',
       //'referral_id',
        'next_of_kin_name',
        'next_of_kin_phone',
        'next_of_kin_email',
        'next_of_kin_address',
        'created_by'

    ];
}
