<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * Retrieve all EventDays under this status
     *
     * @return App\Models\EventDays[]
     */
    public function eventDays()
    {
        return $this->hasMany(EventDays::class);
    }

    /**
     * Creates a scope to search all events by the provided keyword.
     *
     * @param Builder $query
     * @param string $keyword
     * @return Builder
     */
    public function scopeSearch($query, $keyword)
    {
        return $query = $query
            ->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', "%{$keyword}%");
            });
    }
}
