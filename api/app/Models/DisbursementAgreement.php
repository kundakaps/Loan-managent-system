<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisbursementAgreement extends Model
{
    protected $fillable = [
        'loan_id',
        'user_id',
        'total_sum',
        'recipient_name',
        'apply_admin_fee',
        'admin_fee_amount',
        'apply_ownership_change_fee',
        'ownership_change_fee_amount',
        'apply_caveat_removal_fee',
        'caveat_removal_fee_amount',
        'net_payout_amount',
        'account_no',
        'bank_name',
        'account_name',
        'phone_no',
        'client_signature_path',
        'client_signature_date',
        'acknowledgement_name',
        'staff_witness_signature_path',
        'staff_witness_date',
    ];

    protected $casts = [
        'apply_admin_fee' => 'boolean',
        'apply_ownership_change_fee' => 'boolean',
        'apply_caveat_removal_fee' => 'boolean',
        'total_sum' => 'decimal:2',
        'net_payout_amount' => 'decimal:2',
        'client_signature_date' => 'date',
        'staff_witness_date' => 'date',
    ];

    /**
     * Relationship back to the Loan
     */
    // public function loan(): BelongsTo
    // {
    //     return $this->belongsTo(Loan::class);
    // }
}
