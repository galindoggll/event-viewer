@component('mail::message')
Hi {{ $user->first_name }},<br/>
<br/>
You have been invited to create an account in {{ config('app.name') }}. Accept the invation by clicking the link below.

@component('mail::button', ['url' => $url])
Accept Invitation
@endcomponent

<br/>
Best Regards,<br/>
{{ config('app.name') }}<br/>
@endcomponent
