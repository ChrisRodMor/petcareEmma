<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class AnimalDeletion extends Model
{
   use HasFactory;


    public function animal():BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
   

    protected $fillable = ['animal_id', 'reason'];

    protected $hidden=[
        'created_at',
        'updated_at'
    ];
}
