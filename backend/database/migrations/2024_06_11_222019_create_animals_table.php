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
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('type_id');
            $table->unsignedBigInteger('breed_id');
            $table->string('name');
            $table->enum('gender', ['Hembra', 'Macho']);
            $table->boolean('is_adopted')->default(false);
            $table->enum('sterilized',['Si','No'])->default('NO');
            $table->date('birthdate')->nullable();
            $table->string('age')->nullable();
            $table->string('color');
            $table->float('weight')->nullable();
            $table->enum('size',['Pequeño','Mediano','Grande']);
            $table->enum('health',['Mala','Regular','Buena','Excelente'])->default('Buena');
            $table->longText('description');
            $table->string('file_path')->nullable()->default('animals_picture/default.jpg');

            //llaves foraneas
            $table->foreign('type_id')->references('id')->on('types');
            $table->foreign('breed_id')->references('id')->on('breeds');

            //marcas de tiempo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
