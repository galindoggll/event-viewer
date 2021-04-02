<?php

namespace App\Services\API;

use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\EventDays;
use DB;
use Mail;
use Hash;
use Exception;
use App\Traits\Uploadable;
use App\Http\Resources\UserResource;

class EventService
{
    use Uploadable;

    /**
     * @var App\Models\Event
     */
    protected $event;

    /**
     * EventService constructor.
     *
     * @param Event $event
     */
    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    /**
     * List events by conditions
     *
     * @param array $conditions
     * @return array $results
     */
    public function search(array $conditions)
    {
        // initialize query
        $query = $this->event;

        // if keyword is provided
        if (array_key_exists('keyword', $conditions)) {
            $query = $query->where('name', 'LIKE', "%{$conditions['keyword']}%");
        }

        // perform user search
        $results = $query->orderBy('id', 'DESC')
                        ->with('eventDays')
                        ->get();


        return $results;
    }

    /**
     * Creates a new event in the database
     * @param array $params
     * @return App\Models\Event $event
     * @throws Exception
     */
    public function create(array $params)
    {
        DB::beginTransaction();

        try {
            $event = Event::where('name', $params['name'])->first();
            if (!isset($event)) {
                /** @var Event $event */
                $event = Event::create($params);
            }
            $params['event_id'] = $event->getAttribute('id');

            EventDays::create($params);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();

            throw $e;
        }

        return $event;
    }
}
