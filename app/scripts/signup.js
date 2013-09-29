/**
 * Author: petar
 * Date: 9/28/13
 */

var Tekify = {};

Tekify.Signup = function () {

    var user_id,
        uuid_cookie = 'tek_uuid',
        $submit,
        $numberInput;

    function init() {

        $submit = jQuery('.submit-number');
        $numberInput = jQuery('.input-number');

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

        bindEvents();
    }

    function bindEvents() {
        $submit.on('click', function () {
            var number = $numberInput.val();
            console.log(number);
            Tekify.Utils.submitPhoneNumber(number);
        });
    }

    return {
        init: init
    }
}();

jQuery(document).ready(function () {
    Tekify.Signup.init();
});

Tekify.Utils = function () {

    var url = 'http://localhost:8080/users/',
        uuid_cookie = 'tek_uuid';

    function getWidth(){
        return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
    }

    function getHeight(){
        return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
    }

    function submitPhoneNumber(number) {

        //remove all non number characters from phone number - http://stackoverflow.com/a/2555077
        number = number.replace(/[^0-9\.]+/g, '');

        var id = getCookie(uuid_cookie),
            width = Tekify.Utils.getWidth(),
            height = Tekify.Utils.getHeight();

        if (!id) {
            id = Tekify.Utils.uuid();
            Tekify.Utils.setCookie(uuid_cookie, id);
        }

        var userSchema = {
            uuid: id,
            phoneNumber: number,
            device: {
                width: width,
                height: height,
                os: BrowserDetect.OS ? BrowserDetect.OS : '',
                browser: BrowserDetect.browser ? BrowserDetect.browser : '',
                version: BrowserDetect.version ? BrowserDetect.version : ''
            },
            language: window.navigator.language || window.navigator.userLanguage,
            ip: window.userIp
        };

        jQuery.ajax({
            type: 'POST',
            cache: false,
            data: userSchema,
            dataType: 'json',
            url: url,
            success: function (response) {
                console.log('succesfully created new user ', response);
            },
            error: function (error) {
                console.log('AJAX error ', error);
            }
        });
    }

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
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    return {
        submitPhoneNumber: submitPhoneNumber,
        cookieExists: cookieExists,
        setCookie: setCookie,
        getCookie: getCookie,
        uuid: uuid,
        getHeight: getHeight,
        getWidth: getWidth
    }
}();

var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++)	{
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        { 	string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {		// for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        { 		// for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]

};
BrowserDetect.init();