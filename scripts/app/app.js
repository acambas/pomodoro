/// <reference path="../../bower_components/soundmanager/script/soundmanager2.js" />
/// <reference path="../../bower_components/angular-toastr/dist/angular-toastr.js" />
/// <reference path="../../bower_components/angular/angular.js" />
/// <reference path="../../bower_components/moment/moment.js" />
/// <reference path="../../bower_components/soundmanager/script/soundmanager2.js" />

(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',
        'toastr',
        //'angularSoundManager'
        // Custom modules 

        // 3rd Party Modules

    ]);

    app.controller('ctrl', ['$scope', '$interval', 'toastr',
        function ($scope, $interval, toastr) {
            var timer = null;
            var alarmSound = null;
            var tickSound = null;
            $scope.isMuteAll = false;
            $scope.isPlaying = false;

            $scope.time = null;
            $scope.type = 'pomodoro';

            $scope.start = start;
            $scope.reset = reset;
            $scope.pause = pause;

            $scope.switchType = function (type) {
                $scope.type = type;
                reset();
            }
            function reset() {
                $scope.isPlaying = false;
                if (angular.isDefined(timer)) {
                    $interval.cancel(timer);
                    timer = undefined;
                }
                if ($scope.type === 'short') {
                    $scope.time = get5minTime();
                } else {
                    $scope.time = get25minTime();
                }
                soundManager.stopAll();
            }
            function start() {

                if ($scope.isPlaying) {
                    return;
                }

                if (angular.isDefined(timer)) {
                    $interval.cancel(timer);
                    timer = undefined;
                }
                timer = $interval(function () {
                    $scope.time.subtract({ seconds: 1 });
                    if ($scope.time.minutes() === 0 && $scope.time.seconds() === 0) {
                        $interval.cancel(timer);
                        tickSound.stop();
                        alarmSound.start();
                    }
                }, 1000);

                tickSound.start({ loop: 999 });
                $scope.isPlaying = true;
            }
            function pause() {

                if (!$scope.isPlaying) {
                    return;
                }

                soundManager.stopAll();
                if (angular.isDefined(timer)) {
                    $interval.cancel(timer);
                    timer = undefined;
                }
                $scope.isPlaying = false;;

            }

            $scope.toggleMute = function () {

                if ($scope.isMuteAll) {
                    soundManager.unmuteAll();
                } else {
                    soundManager.muteAll();
                }
                $scope.isMuteAll = !$scope.isMuteAll;

            }



            //init/////////////////////////////////
            reset();
            soundManager.setup({

                onready: function () {
                    alarmSound = soundManager.createSound({
                        id: 'ring',
                        title: 'ring',
                        url: './img/alarm.mp3'
                    });
                    tickSound = soundManager.createSound({
                        id: 'tick',
                        title: 'tick',
                        url: './img/tick.mp3'
                    });
                },

            });


        }]);

    function get25minTime() {
        return moment({ years: 2010, months: 3, days: 5, hours: 15, minutes: 25, seconds: 0, milliseconds: 123 });
    }

    function get5minTime() {
        return moment({ years: 2010, months: 3, days: 5, hours: 15, minutes: 5, seconds: 0, milliseconds: 123 });
    }

})();