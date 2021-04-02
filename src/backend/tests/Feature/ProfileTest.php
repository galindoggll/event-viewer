<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class ProfileTest extends TestCase
{
    /** @var App\Models\User */
    private static $USER;

    /** @var array */
    protected $fields = [
        'id',
        'full_name',
        'first_name',
        'last_name',
        'email',
        'avatar',
    ];

    /**
     * ProfileTest constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->createApplication();
    }

    public static function setUpBeforeClass() : void
    {
        parent::setUpBeforeClass();

        // user to be tested
        self::$USER = User::findOrFail(1);
    }

    public static function tearDownAfterClass() : void
    {
        // restore original data
        self::$USER->update([
            'first_name' => self::$USER->first_name,
            'last_name' => self::$USER->last_name,
        ]);
    }

    public function testGetProfile()
    {
        // acting as to replace bearer token declaration
        $response = $this->actingAs(self::$USER, 'api')
                        ->json('GET', '/v1/profile');

        $response->assertStatus(200);
        $result = json_decode((string) $response->getContent());
        $user = $result->data;

        foreach ($this->fields as $field) {
            // verify the profile matches the user token data values
            $this->assertEquals(self::$USER->{$field}, $user->{$field});
        }
    }

    public function testUpdateProfile()
    {
        $params = [
            'first_name' => 'Johnny',
            'last_name' => 'Doey',
            'email' => self::$USER->email,
        ];

        // acting as to replace bearer token declaration
        $response = $this->actingAs(self::$USER, 'api')
                        ->json('PUT', '/v1/profile', $params);

        $response->assertStatus(200);
        $result = json_decode((string) $response->getContent());
        $user = $result->data;

        // verify updated fields
        $this->assertEquals($params['first_name'], $user->first_name);
        $this->assertEquals($params['last_name'], $user->last_name);
    }
}
