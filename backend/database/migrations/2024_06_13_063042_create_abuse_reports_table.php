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
        Schema::create('abuse_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('report_id');
            $table->longText('direction_event');
            $table->date('date_event');
            $table->time('hour_event');
            $table->timestamps();
            // Agregar la clave foránea
            $table->foreign('report_id')->references('id')->on('reports');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('abuse_reports', function (Blueprint $table) {
            // Eliminar la clave foránea antes de eliminar la tabla
            $table->dropForeign(['report_id']);
        });

        Schema::dropIfExists('abuse_reports');
    }
};
