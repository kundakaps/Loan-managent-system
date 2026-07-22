<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\LoanController;

class Recalculations extends Command
{
    protected $signature = 'recalculations';

    protected $description = 'Run monthly loan recalculations';

    public function handle()
    {
        // Resolve the controller from Laravel container
        $controller = app(LoanController::class);

        // Call the method
        $controller->MonthlyCalculations();

        $this->info('Monthly calculations executed successfully.');
    }
}
