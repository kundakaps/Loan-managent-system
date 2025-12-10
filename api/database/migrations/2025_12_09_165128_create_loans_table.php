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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->string('posted_by');
            $table->string('client_id');
            $table->string('facility_id');
            $table->string('amount');
            $table->string('tenure');
            $table->string('monthly_repayment');
            $table->string('next_payment_date');
            $table->string('status')->default('active');
            $table->string('balance');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
