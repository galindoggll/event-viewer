<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Events\CreateEventRequest;
use App\Http\Requests\API\Events\SearchEventRequest;
use App\Http\Resources\EventResource;
use App\Services\API\EventService;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use DateTime;

class EventsController extends Controller
{
    /** @var App\Services\API\EventService */
    protected $eventService;

    /**
     * EventController constructor.
     * @param EventService $eventService
     */
    public function __construct(EventService $eventService)
    {
        parent::__construct();

        $this->eventService = $eventService;

        // enable api middleware
        $this->middleware(['auth:api']);
    }

    /**
     * Retrieves the list of events.
     *
     * @param SearchEventRequest $request
     * @return Response
     */
    public function index(SearchEventRequest $request)
    {
        try {
            $formData = [
                'keyword' => $request->getKeyword(),
            ];

            $results = $this->eventService->search($formData);

            $this->response['data'] = EventResource::collection($results);
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Creates new event. Creator must be authenticated.
     *
     * @param CreateEventRequest $request
     * @return Response
     */
    public function create(CreateEventRequest $request)
    {
        try {
            $begin = new DateTime($request->getStartDate());
            $end = new DateTime($request->getEndDate());
            $begin = $begin->modify( '+1 day' );

            $period = new DatePeriod($end, new DateInterval('P1D'), $begin);
            foreach ($period as $dt) {
                if (in_array("1", $request->getDays()) && $dt->format('l') == 'Monday') {
                    $formData = [
                        'name' => $request->getName(),
                        'date' => $dt,
                    ];
                    $event = $this->eventService->create($formData);
                    $this->response['data'] = new EventResource($event);
                } elseif (in_array("2", $request->getDays()) && $dt->format('l') == 'Tuesday') {
                    $formData = [
                        'name' => $request->getName(),
                        'date' => $dt,
                    ];
                    $event = $this->eventService->create($formData);
                    $this->response['data'] = new EventResource($event);
                } elseif (in_array("3", $request->getDays()) && $dt->format('l') == 'Wednesday') {
                    $formData = [
                        'name' => $request->getName(),
                        'date' => $dt,
                    ];
                    $event = $this->eventService->create($formData);
                    $this->response['data'] = new EventResource($event);
                } elseif (in_array("4", $request->getDays()) && $dt->format('l') == 'Thursday') {
                    $formData = [
                        'name' => $request->getName(),
                        'date' => $dt,
                    ];
                    $event = $this->eventService->create($formData);
                    $this->response['data'] = new EventResource($event);
                } elseif (in_array("5", $request->getDays()) && $dt->format('l') == 'Friday') {
                    $formData = [
                        'name' => $request->getName(),
                        'date' => $dt,
                    ];
                    $event = $this->eventService->create($formData);
                    $this->response['data'] = new EventResource($event);
                } elseif (in_array("6", $request->getDays()) && $dt->format('l') == 'Saturday') {
                    $formData = [
                        'name' => $request->getName(),
                        'date' => $dt,
                    ];
                    $event = $this->eventService->create($formData);
                    $this->response['data'] = new EventResource($event);
                } elseif (in_array("7", $request->getDays()) && $dt->format('l') == 'Sunday') {
                    $formData = [
                        'name' => $request->getName(),
                        'date' => $dt,
                    ];
                    $event = $this->eventService->create($formData);
                    $this->response['data'] = new EventResource($event);
                }

            }
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }
}
