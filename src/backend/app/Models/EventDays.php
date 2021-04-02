<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventDays extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['event_id', 'date'];

    /**
     * Retrieve Event under this status
     *
     * @return App\Models\Event[]
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
