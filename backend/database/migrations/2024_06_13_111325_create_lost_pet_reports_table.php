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
        Schema::create('lost_pet_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('report_id');
            $table->unsignedBigInteger('type_id');
            $table->unsignedBigInteger('breed_id');
            $table->date('date_event');
            $table->string('pet_name');
            $table->enum('pet_gender',['Macho','Hembra']);
            $table->string('pet_color');
            $table->string('file_path')->nullable();
            $table->boolean('is_found')->default(false);



            $table->timestamps();
            // Define foreign key constraints
            $table->foreign('report_id')->references('id')->on('reports');
            $table->foreign('type_id')->references('id')->on('types');
            $table->foreign('breed_id')->references('id')->on('breeds');
        });
    }

    public function down(): void
    {
        // Drop foreign key constraints before dropping the table
        Schema::table('lost_pet_reports', function (Blueprint $table) {
            $table->dropForeign(['report_id']);
            $table->dropForeign(['type_id']);
            $table->dropForeign(['breed_id']);
        });

        Schema::dropIfExists('lost_pet_reports');
    }
};
