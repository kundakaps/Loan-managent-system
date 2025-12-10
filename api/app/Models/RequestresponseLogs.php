<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestresponseLogs extends Model
{
   protected $fillable = [
        'user_id',
        'request_method',
        'headers',
        'url',
        'request_body',
        'response_body',
        'response_status_code',
        'source_ip_address',
    ];

}
