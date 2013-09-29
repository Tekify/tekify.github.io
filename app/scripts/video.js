/**
 * Author: petar
 * Date: 9/29/13
 */

var Tekify = {};

Tekify.Me = function () {

    var user_id,
        uuid_cookie = 'tek_uuid';

    function init() {

        //It already exists
        if (Tekify.Utils.cookieExists(uuid_cookie)) {
            user_id = Tekify.Utils.getCookie(uuid_cookie);
        }
        else {
            //user doesn't have a uuid so we create a new one for him
            var id = Tekify.Utils.uuid();
            user_id = id;
            Tekify.Utils.setCookie(uuid_cookie, id);
        }
    }

    return {
        init: init
    }
}();

jQuery(document).ready(function () {
    Tekify.Me.init();
});

Tekify.Utils = function () {

    function cookieExists(key) {
        return !!($.cookie(key));
    }

    function setCookie(key, value) {
        if ((typeof key === 'string') && (typeof value === 'string')) {
            $.cookie(key, value);
        }
        else {
            throw 'invalid set cookie usage: please provide a string';
        }
    }

    function getCookie(key) {
        return $.cookie(key);
    }

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    return {
        cookieExists: cookieExists,
        setCookie: setCookie,
        getCookie: getCookie,
        uuid: uuid
    }
}();