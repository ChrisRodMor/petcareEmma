<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use HasFactory;
    //relaciones
    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    protected $fillable = [
        'user_id',
        'rfc',
        'nss',
        'position',
        'curp'
    ];
    protected $hidden=[
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
