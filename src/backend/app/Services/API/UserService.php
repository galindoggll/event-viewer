<?php

namespace App\Services\API;

use DB;
use Mail;
use Hash;
use Exception;
use App\Models\User;
use App\Models\ActivationToken;
use App\Models\UserStatus;
use App\Mail\UserSignUp;
use App\Mail\InviteUser;
use Carbon\Carbon;
use App\Exceptions\UserNotFoundException;
use App\Exceptions\UserNotCreatedException;
use App\Exceptions\UserStatusNotFoundException;
use App\Exceptions\ActivationTokenNotFoundException;
use App\Traits\Uploadable;
use App\Http\Resources\UserResource;
use Illuminate\Http\UploadedFile;

class UserService
{
    use Uploadable;

    /**
     * @var App\Models\User
     */
    protected $user;

    /**
     * UserService constructor.
     *
     * @param App\Models\User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * List users by conditions
     *
     * @param array $conditions
     * @return array $results
     */
    public function search(array $conditions)
    {
        // default to 1 if page not provided
        $page = 1;
        $limit = config('search.results_per_page');

        if (array_key_exists('page', $conditions) === true) {
            $page = $conditions['page'];
        }

        if (array_key_exists('limit', $conditions) === true) {
            $limit = $conditions['limit'];
        }

        $skip = ($page > 1) ? ($page * $limit - $limit) : 0;

        // initialize query
        $query = $this->user;

        // if keyword is provided
        if (array_key_exists('keyword', $conditions)) {
            $query = $query->where('first_name', 'LIKE', "%{$conditions['keyword']}%")
                        ->orWhere('last_name', 'LIKE', "%{$conditions['keyword']}%")
                        ->orWhere('email', 'LIKE', "%{$conditions['keyword']}%");
        }

        // perform user search
        $results = $query->skip($skip)
                        ->orderBy('id', 'DESC')
                        ->paginate($limit);

        $urlParams = ['keyword' => $conditions['keyword'], 'limit' => $limit];

        return paginated($results, UserResource::class, $page, $urlParams);
    }

    /**
     * Creates a new user in the database
     * type = signup  User Signup
     * type = invite  User Added via Dashboard
     *
     * @param array $params
     * @return App\Models\User $user
     */
    public function create(array $params)
    {
        DB::beginTransaction();

        try {
            $params['password'] = Hash::make($params['password']);
            $status = UserStatus::where('name', config('user.statuses.pending'))->first();

            if (!($status instanceof UserStatus)) {
                throw new UserStatusNotFoundException;
            }

            // get create type. set default to invite if not provided
            $type = array_key_exists('type', $params) ? $params['type'] : 'invite';
            unset($params['type']);

            $params['user_status_id'] = $status->id;
            $user = $this->user->create($params);

            if (!($user instanceof User)) {
                throw new UserNotCreatedException;
            }

            $token = Hash::make(time() . uniqid());

            $user->activationTokens()->save(new ActivationToken(['token' => $token]));

            // send email
            $template = ($type === 'signup') ? UserSignUp::class : InviteUser::class;
            Mail::to($user)->send(new $template($user, $token));

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();

            throw $e;
        }

        return $user;
    }

    /**
     * Updates user in the database
     *
     * @param array $params
     * @return App\Models\User $user
     */
    public function update(array $params)
    {
        // retrieve user information
        $user = $this->findById($params['id']);

        if (array_key_exists('password', $params)) {
            // update user password if provided in request or retain the current password
            $params['password'] = strlen($params['password']) > 0 ?
                                    Hash::make($params['password']) :
                                    $user->password;
        }

        // upload avatar if present
        if (array_key_exists('avatar', $params)) {
            $params['avatar'] = ($params['avatar'] instanceof UploadedFile) ?
                                config('app.storage_disk_url') . '/' . $this->uploadOne($params['avatar'], 'avatars') :
                                $user->avatar;
        }

        // perform update
        $user->update($params);

        return $user;
    }

    /**
     * Deletes the user in the database
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id)
    {
        // retrieve user
        $user = $this->findById($id);

        // perform delete
        $user->delete();

        return true;
    }

    /**
     * Service function that activates the user account.
     *
     * @param string $token
     * @param string|null $password  Provided if User is Created Manually in the dashboard instead of signup
     * @return User $user
     */
    public function activateByToken(string $token, string $password = null) : User
    {
        $activationToken = ActivationToken::with('user.status')
                                            ->where('token', $token)
                                            ->where('revoked', false)
                                            ->first();

        if (!($activationToken instanceof ActivationToken)) {
            throw new ActivationTokenNotFoundException;
        }

        $status = UserStatus::where('name', config('user.statuses.active'))->first();

        if (!($status instanceof UserStatus)) {
            throw new UserStatusNotFoundException;
        }

        $user = $activationToken->user;

        // set form data
        $formData = [
            'password' => Hash::make($password),
            'user_status_id' => $status->id,
            'email_verified_at' => Carbon::now(),
        ];

        // exclude password update if not provided
        if (strlen($password) < 1) {
            unset($formData['password']);
        }

        // update user details
        $user->update($formData);

        // retrieve updated user instance
        $user = User::with('status')->find($user->id);

        // revoke the token
        $activationToken->delete();

        return $user;
    }

    /**
     * Retrieves a user by email
     *
     * @param string $email
     * @return User $user
     */
    public function findByEmail(string $email)
    {
        // retrieve the user
        $user = $this->user
                    ->where('email', $email)
                    ->first();

        if (!($user instanceof User)) {
            throw new UserNotFoundException;
        }

        return $user;
    }

    /**
     * Retrieves a user by id
     *
     * @param int $id
     * @return User $user
     */
    public function findById(int $id)
    {
        // retrieve the user
        $user = $this->user->find($id);

        if (!($user instanceof User)) {
            throw new UserNotFoundException;
        }

        return $user;
    }
}
