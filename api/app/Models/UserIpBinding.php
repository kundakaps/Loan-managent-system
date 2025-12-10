<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserIpBinding extends Model
{
    protected $fillable = [
        'user',
        'ip',
    ];
}
