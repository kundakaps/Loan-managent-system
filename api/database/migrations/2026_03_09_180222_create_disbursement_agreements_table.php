<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('disbursement_agreements', function (Blueprint $table) {
            $table->id();


             // Linking to the previous assessment/loan
            $table->string('loan_id')->nullable();
            $table->string('user_id');

            // Header Info
            $table->string('total_sum')->nullable(); // Gross amount
            $table->string('recipient_name'); // MR/MS/MRS ...

            // Deductions (Booleans to represent the "TICK" column)
            $table->boolean('apply_admin_fee')->default(false);
            $table->string('admin_fee_amount')->nullable();

            $table->boolean('apply_ownership_change_fee')->default(false);
            $table->string('ownership_change_fee_amount')->nullable();

            $table->boolean('apply_caveat_removal_fee')->default(false);
            $table->string('caveat_removal_fee_amount')->nullable();

            // Calculation Results
            $table->string('net_payout_amount')->nullable();

            // Banking & Contact Details
            $table->string('account_no')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_name')->nullable();
            $table->string('phone_no')->nullable();

            // Compliance & Signatures
            $table->string('client_signature_path')->nullable(); // Path to signature image
            $table->date('client_signature_date')->nullable();
            $table->string('acknowledgement_name')->nullable(); // The "I, [Name] acknowledge..." field

            $table->string('staff_witness_signature_path')->nullable();
            $table->date('staff_witness_date')->nullable();



            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disbursement_agreements');
    }
};
