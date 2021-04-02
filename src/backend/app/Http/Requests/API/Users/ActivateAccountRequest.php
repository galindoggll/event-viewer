<?php

namespace App\Http\Requests\API\Users;

use App\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class ActivateAccountRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'token' => 'required',
            'password' => ['sometimes', new Password, 'confirmed'],
        ];
    }

    public function getToken()
    {
        return $this->input('token', null);
    }

    public function getPassword()
    {
        return $this->input('password', null);
    }
}
