<?php

namespace App\Traits;

use App\Models\User;

trait UserHelperTrait {

    public function getUserType($userId){

        $user = User::findOrFail($userId);

        if($user->client){
            return 'client';
        }else if($user->employee){
            return 'employee';
        }

        return 'user';
    }

}
