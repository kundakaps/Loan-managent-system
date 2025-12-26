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
        Schema::create('loan_collaterals', function (Blueprint $table) {
            $table->id();
            $table->string('loan_id');
            $table->string('number_plate');
            $table->string('engine_number');
            $table->string('chassis_number');
            $table->string('mileage');
            $table->string('cv_joints_condition');
            $table->string('shocks_condition');
            $table->string('control_arms_condition');
            $table->string('tires_condition');
            $table->string('body_condition');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_collaterals');
    }
};
