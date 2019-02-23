<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterUserTest extends TestCase
{
    use RefreshDatabase;
    
    /** @test */
    public function a_user_can_create_an_account()
    {
        $this->registerUser()
            ->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => [
                    'id',
                    'name',
                    'nickname',
                    'avatar',
                    'email',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    /** @test */
    public function a_users_name_is_required()
    {

    }

    protected function registerUser(array $body = [])
    {
        $user = factory(User::class)
            ->states('nickname')
            ->make()
            ->makeVisible(['password']);

        return $this->installPassport()
            ->json('POST', '/v1/register', array_merge($user->toArray(), $body));
    }
}