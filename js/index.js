/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var isSaved = false;
var directory;
var selectedElement = null;
$(document).ready(function () {

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getDirectory("html", {create: true, exclusive: false}, function(dir) {
                directory = dir;
            });
        });
    }
    $("#top .filename").text("Nicht gespeichert");

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");

    responsive();
    window.onresize = function () {
        responsive();
    };

    $(".option1").css({backgroundColor: "black"}).click(function () {
        $(this).css({backgroundColor: "black"});
        $(".option2").css({backgroundColor: "transparent"});
    });
    $(".option2").click(function () {
        $(this).css({backgroundColor: "black"});
        $(".option1").css({backgroundColor: "transparent"});
    });

    $(".menu-icon").click(function () {
        refresh();
        $(".menu-left").animate({left: "0vw"}, 500);
    });

    $(".menu-left .topbar .close").click(function () {
        $(".menu-left").animate({left: "-100vw"}, 500);
    });
    $(".open-tag").click(function () {
        editor.insert("<");
    });
    $(".close-tag").click(function () {
        editor.insert(">");
    });
    $(".open-curly").click(function () {
        editor.insert("{");
    });
    $( ".close-curly").click(function () {
        editor.insert("}");
    });

    $(".sidebar .save").click(function () {
        var text = editor.getValue();
        if (!isSaved) {
            $(".menu-top").animate({top: "0vh"}, 500);
            $(".menu-top input").focus();
        } else save(text);
    });

    $(".menu-top .save").click(function () {
        var filename = $("#filename-input").val() + ".html";
        if(filename.length > 0) {
            directory.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function(evt) {
                        $(".menu-top").animate({top: "-100vh"}, 500);
                        $("#top .filename").text(filename);
                        isSaved = true;
                    };
                    writer.write(editor.getValue());
                    l(editor.getValue());
                }, function(error) {
                    console.log("Error writing file.");
                });
            }, function (error) {
                l("error" + error);
            });
        }
    });

    $(".menu-top .close").click(function () {
        $(".menu-top").animate({top: "-100vh"}, 500);
    });

    $(".menu-left .bottombar .container #open").click(function() {
        if (selectedElement !== null) {
            var name = selectedElement.innerHTML;
            directory.getFile(name, {create: true, exclusive: false}, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        editor.setValue(reader.result);
                        l(evt.target.result);
                        l(evt.result);
                        l(evt.target);
                        $("#top .filename").text(name);
                        $(".menu-left").animate({left: "-100vw"}, 500);
                    };
                    reader.readAsText(file);
                });
            }, function(error) {console.log("Error reading file")});
        }
    });

    $(".menu-left .bottombar .container #delete").click(function() {
        if (selectedElement !== null) {
            var name = selectedElement.innerHTML;
            directory.getFile(name, {create: false}, function(fileEntry) {
                fileEntry.remove(function(file) {
                    console.log("file removed");
                    refresh();
                }, function(error) {
                    console.log("error removing file" + error.code);
                }, function() {
                    console.log("this file does not exist");
                });
            }, function(evt) {
                console.log(evt.target.error.code);
            });
        }
    });
});


function save(text) {

}

function l(text) {
    console.log(text);
}

function responsive() {
    var top = $(document).height() > 800 ? 80 : $(document).height()/10;
    top = top < 60 ? 60 : top;
    $("#editor").css({
        width: "calc(100vw - 50px)",
        height: "calc(100vh - " + top + "px - 50px - 30px)"
    });
}

function refresh() {
    var reader = directory.createReader();
    reader.readEntries(function(entries) {
        var text = "";
        for(var i = 0; i < entries.length; i++) {
            if (!entries[i].name.endsWith(".html")) continue;
            text += "<div class=\"files\" onclick=\"hightlight(this)\">" +
            entries[i].name + "</div><hr>";
        }
        $("#filecontainer").html(text);
    }, function(error) {console.log("error reading entries")});
}

function hightlight(element) {
    for(var i = 0; i < $(".files").length; i++)
        document.getElementsByClassName("files")[i].style.backgroundColor = "lightgray";
    element.style.backgroundColor = "#e62687";
    selectedElement = element;
    $(".menu-left .bottombar .container .options").css({visibility: "visible"});
}





var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};
