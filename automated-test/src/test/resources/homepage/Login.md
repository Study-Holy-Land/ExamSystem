# Login

As a normal user, I want login the twars

### [Example 1](-)

I can login with the account [test@163.com] (- "#account") and password [12345678] (- "#password") [successfully](- "c:assert-true=login(#account, #password)")

### [Example 2](-)

I can login with the account [test@163.com] (- "#account") and password [1234567890] (- "#password") [failed](- "c:assert-false=login(#account, #password)")
