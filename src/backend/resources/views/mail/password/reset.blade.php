@component('mail::message')
Hi {{ $user->first_name }},<br/>
<br/>
Your password for has been updated successfully. If you made this change, then we're all set.<br/>

@component('mail::button', ['url' => $url])
Login
@endcomponent

Feel free to reach out with any questions you might have. We're here to help.<br/>

Best Regards,<br/>
{{ config('app.name') }}<br/>
@endcomponent
