<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Breed extends Model
{
    use HasFactory;

    public function type():BelongsTo
    {
        return $this->belongsTo(Type::class);
    }

    public function animals():HasMany{
        return $this->hasMany(Animal::class);
    }

    public function lostPetReports()
    {
        return $this->hasMany(LostPetReport::class);
    }

    protected $fillable = [
        'name',
        'type_id'
    ];
    public $timestamps = false;
}
