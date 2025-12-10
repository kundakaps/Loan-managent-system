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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('created_by');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('nrc');
            $table->string('occupation');
            $table->text('residential_address');
            $table->string('contact_number');
            $table->text('work_address');
            $table->string('referral_name')->nullable();
            $table->string('referral_phone')->nullable();
            $table->string('next_of_kin_name');
            $table->string('next_of_kin_phone');
            $table->string('next_of_kin_email');
             $table->string('next_of_kin_address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
