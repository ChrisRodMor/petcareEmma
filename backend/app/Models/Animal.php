<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Animal extends Model
{
    use HasFactory, SoftDeletes;

    // Relaciones
    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function breed()
    {
        return $this->belongsTo(Breed::class);
    }
    public function vaccines():HasMany{
        return $this->hasMany(Vaccine::class);
    }
    public function adoptionReport():HasOne{
        return $this->hasOne(AdoptionReport::class);
    }

    public function animalDeletion(): HasOne
    {
        return $this->hasOne(AnimalDeletion::class);
    }
    // Campos asignables de forma masiva
    protected $fillable = [
        'type_id',
        'breed_id',
        'name',
        'gender',
        'is_adopted',
        'sterilized',
        'birthdate',
        'age',
        'color',
        'weight',
        'size',
        'health',
        'description',
        'file_path',
    ];

    // Campos ocultos
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];


}
