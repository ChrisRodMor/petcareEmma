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
        Schema::create('vaccines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('animal_id');
            $table->string('vaccine_brand');
            $table->string('vaccine_type');
            $table->string('vaccine_batch')->nullable();
            $table->date('application_date');
            $table->string('doctor_name');
            $table->string('doctor_license');

            //llaves foraneas
            $table->foreign('animal_id')->references('id')->on('animals');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vaccines', function(Blueprint $table){
            $table->dropForeign('vaccines_animal_id_foreign');
            $table->dropColumn('animal_id');
        });
        Schema::dropIfExists('vaccines');
    }
};
