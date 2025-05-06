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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('rfc')->unique();
            $table->string('nss')->unique();
            $table->string('position');
            $table->string('curp')->unique();
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
        Schema::table('employees', function(Blueprint $table){
            $table->dropForeign('employees_user_id_foreign');
            $table->dropColumn('user_id');
        });
        Schema::dropIfExists('employees');
    }
};
