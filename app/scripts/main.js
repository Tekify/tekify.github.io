var Tekify = {};

Tekify.Me = function() {

    var $accordian;

    function init() {
        $accordian = $('.panel');
        bindEvents();
    }

    function bindEvents() {
        $accordian.on('click', function() {
            //$(this).collapse('toggle');
        });
    }

    return {
        init: init
    }
}();

jQuery(document).ready(function() {
    Tekify.Me.init();
});