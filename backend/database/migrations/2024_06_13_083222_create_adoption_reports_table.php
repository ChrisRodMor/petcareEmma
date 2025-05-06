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
        Schema::create('adoption_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('report_id');
            $table->unsignedBigInteger('animal_id');
            $table->timestamps();

            // Definir las claves foráneas
            $table->foreign('report_id')->references('id')->on('reports');
            $table->foreign('animal_id')->references('id')->on('animals');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('adoption_reports', function (Blueprint $table) {
            // Dropear las llaves foráneas antes de dropear la tabla
            $table->dropForeign(['report_id']);
            $table->dropForeign(['animal_id']);
        });

        Schema::dropIfExists('adoption_reports');
    }
};
