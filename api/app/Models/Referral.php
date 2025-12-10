<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'address',
        'phone_number',
    ];
}
