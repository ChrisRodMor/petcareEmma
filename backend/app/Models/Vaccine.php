<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vaccine extends Model
{
    use HasFactory;

    public function animal():BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
    // Define fillable fields
    protected $fillable = [
        'animal_id',
        'vaccine_brand',
        'vaccine_type',
        'vaccine_batch',
        'application_date',
        'doctor_name',
        'doctor_license'
    ];

    protected $hidden=[
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
