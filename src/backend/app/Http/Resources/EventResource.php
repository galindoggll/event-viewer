<?php

namespace App\Http\Resources;

use App\Models\Event;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        /** @var Event $event */
        $event = $this->resource;

        return [
            'id' => $event->getAttribute('id'),
            'name' => $event->getAttribute('name'),
            'dates' => EventDaysResource::collection($event->eventDays),
        ];
    }
}
