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
        Schema::create('animal_deletions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('animal_id');
             $table->enum('reason', [
            'Reubicación',
            'Fallecimiento',
            'Error de registro',
            'Escape o desaparición',
            'Caso especial (otros)'
            ]);
            $table->timestamps();

            $table->foreign('animal_id')->references('id')->on('animals');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('animal_deletions', function (Blueprint $table) {
        // Primero suelta la restricción FK
        $table->dropForeign(['animal_id']);
        });
        Schema::dropIfExists('animal_deletions');
    }
};
