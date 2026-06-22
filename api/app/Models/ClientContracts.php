<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientContracts extends Model
{
    protected $fillable = ['loan_id', 'file_path'];
}
