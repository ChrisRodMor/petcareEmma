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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('type_report',['ADOPCION','MASCOTA_PERDIDA','MALTRATO']);
            $table->longText('description');
            $table->enum('status',['Revisando','Avanzando','Terminado']);
            $table->timestamps();

            //llaves foraneas
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function(Blueprint $table){
            $table->dropForeign('reports_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::dropIfExists('reports');
    }
};
