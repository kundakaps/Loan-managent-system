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
        Schema::create('vehicle_assessments', function (Blueprint $table) {
            $table->id();

            // Header Info
            $table->string('customer_id');
            $table->string('loan_id');
            $table->boolean('details_match_whitebook')->default(false);

            // Vehicle Details
            $table->string('car_make');
            $table->string('car_model');
            $table->string('manufacturing_year');
            $table->string('vehicle_number_plate');
            $table->string('vehicle_engine_number');
            $table->string('chassis_number');
            $table->unsignedInteger('vehicle_mileage');

            // Suspension & Body (Using Enum for ratings)
            // Ratings: V.GOOD, GOOD, FAIR, POOR
            $table->enum('ball_joints', ['V.GOOD', 'GOOD', 'FAIR', 'POOR'])->nullable();
            $table->enum('cv_joints', ['V.GOOD', 'GOOD', 'FAIR', 'POOR'])->nullable();
            $table->enum('shocks', ['V.GOOD', 'GOOD', 'FAIR', 'POOR'])->nullable();
            $table->enum('control_arms', ['V.GOOD', 'GOOD', 'FAIR', 'POOR'])->nullable();
            $table->string('type_of_vehicle_body')->nullable();
            $table->string('tires_condition')->nullable();

            // Inventory (Tick or Cross)
            $table->boolean('has_extinguisher')->default(false);
            $table->boolean('has_jack')->default(false);
            $table->boolean('has_spare_wheel')->default(false);

            // General Condition
            $table->text('vehicle_interior')->nullable();
            $table->text('accident_history')->nullable();
            $table->string('paint_condition')->nullable();
            $table->text('engine_condition')->nullable();
            $table->string('vehicle_compression')->nullable();

            // Financials (ZMK)
            $table->decimal('market_value', 15, 2)->nullable();
            $table->decimal('amount_requested', 15, 2)->nullable();
            $table->decimal('amount_approved', 15, 2)->nullable();


            $table->string('submitter_id');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_assessments');
    }
};
