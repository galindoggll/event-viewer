<?php

namespace App\Http\Requests\API\Events;

use Illuminate\Foundation\Http\FormRequest;

class SearchEventRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'keyword' => 'nullable',
        ];
    }

    public function getKeyword()
    {
        return $this->input('keyword', '');
    }
}
