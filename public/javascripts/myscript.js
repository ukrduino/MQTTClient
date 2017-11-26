$(document ).ready(function () {
    var socket = io.connect('http://192.168.0.112:5000');
    socket.on('connect', function () {
        $("#ON").click(function () {
            socket.emit('publish', {topic: 'test/topic', payload: 'ON'});
            console.log("on");
        });

        $("#OFF").click(function () {
            socket.emit('publish', {topic: 'test/topic', payload: 'OFF'});
            console.log("off");
        });

        socket.on('mqtt', function (msg) {
            console.log(msg.topic, msg.payload);
            $("<p>" + msg.payload + "</p>").appendTo($(".well-sm"));
        });
        socket.on('temperature', function (msg) {
            console.log(msg.temp);
            $(".label-info").html(msg.temp);
        });
    });
});