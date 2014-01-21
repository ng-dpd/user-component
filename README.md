# user-component

An AngularJS component for deployd user login/logout/<strike>register</strike>
optimized for Bootstrap 3. Checks for a logged-in user, and shows either a login
form or the user's username with a logout link.

## Status: In-Development

## Usage

`$ bower install ng-dpd-user-component`

```javascript
var app = angular.module('myApp', ['dpdUser']);
```

```html
<script src="bower_components/ng-dpd-user-component/user-component.js"></script>
<dpd-user></dpd-user>
```

## Additional Providers

### `dpdUserStore` service

Service used to maintain state of logged-in user.
Used by this directive, but can be used anywhere else in the app as well.

 * properties:
    * `id` is one of: **`id`** of the logged-in user returned from deployd,
      **`undefined`** if not yet set,
      **`null`** if `clear` method has been called
    * `username` is one of:
      **`username`** of the logged-in user returned from deployd,
      **`undefined`** if not yet set,
      **`null`** if `clear` method has been called
 * method:
    * `set(username, id)` pass-through setter
    * `clear()` sets properties to null


## Todo

 * Add registration form
