<?php

namespace App\Http\Requests\API\Events;

use Illuminate\Foundation\Http\FormRequest;

class CreateEventRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|unique:events,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'days' => 'nullable|array|min:1',
            'days.*' => 'nullable',
        ];
    }

    public function getName()
    {
        return $this->input('name', null);
    }

    public function getStartDate()
    {
        return $this->input('end_date', null);
    }

    public function getEndDate()
    {
        return $this->input('start_date', null);
    }

    public function getDays()
    {
        return $this->input('days.*', null);
    }
}
