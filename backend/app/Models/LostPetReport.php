<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LostPetReport extends Model
{
    use HasFactory;
    protected $fillable = [
        'report_id',
        'type_id',
        'breed_id',
        'date_event',
        'pet_name',
        'pet_gender',
        'pet_color',
        'file_path',
        'is_found',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // Relaciones
    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function breed()
    {
        return $this->belongsTo(Breed::class);
    }
}
