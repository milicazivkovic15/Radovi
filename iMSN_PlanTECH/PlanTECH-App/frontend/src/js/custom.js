function setCalendar(ev, callback, callback2, callback3, callback4, callback5, callback6, callback7, callback8, calback9) {

    $(function () {

        /* initialize the external events
        -----------------------------------------------------------------*/
        function ini_events(ele) {
            ele.each(function () {

                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim($(this).text()) // use the element's text as the event title
                };

                // store the Event Object in the DOM element so we can get to it later
                $(this).data('eventObject', eventObject);

                // make the event draggable using jQuery UI
                $(this).draggable({
                    helper: function () {
                        var tmp = $(this).clone().appendTo('body').css('min-width', '200px').css('max-width', '400px').show();

                        tmp.find("#id1").remove();
                        tmp.find("#id2").remove();

                        return tmp;
                    },
                    zIndex: 1070,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0,  //  original position after the drag
                });

            });
        }
        setTimeout(() => {
            ini_events($('#external-events div.external-event'));
        }, 1000);


        console.log("ASDASDASDAS");
        console.log(ev);

        /* initialize the calendar
        -----------------------------------------------------------------*/
        //Date for the calendar events (dummy data)
        var date = new Date();
        var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();
        $('#calendar').fullCalendar({
            header: {
                left: 'prethodni,sledeci,danas',
                center: 'title',
            },
            buttonText: {
                today: 'danas',
                month: 'mesec',
                week: 'nedelja',
                day: 'dan'
            },
            //Random default events
            events: ev,

            eventDragStart: function (event, jsEvent, ui, view) {
                //console.log(event);

                callback6(event.title, event.start._d);
            },
            eventDragStop: function (event, jsEvent, ui, view) {
                setTimeout(() => {
                    callback7(event.title, event.start._d, event.backgroundColor);
                }, 1000);
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function (date, allDay) { // this function is called when something is dropped
                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');
                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);
                console.log(copiedEventObject.title);
                if (copiedEventObject.title.indexOf("- Pregled") != -1 || copiedEventObject.title.indexOf("- Review") != -1) {
                    copiedEventObject.title = copiedEventObject.title.substring(0, copiedEventObject.title.lastIndexOf("-"));
                    copiedEventObject.title = copiedEventObject.title.substring(0, copiedEventObject.title.lastIndexOf("-"));

                    copiedEventObject.title = copiedEventObject.title.trim();
                }
                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;
                copiedEventObject.backgroundColor = $(this).css("background-color");
                copiedEventObject.borderColor = $(this).css("border-color");
                callback(copiedEventObject.title, copiedEventObject.start._d, copiedEventObject.backgroundColor);

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                    callback4(copiedEventObject.title);
                }


            },
            eventRender: function (event, element) {
                element.append("<span class='closeon'>X</span>");
                element.find(".closeon").click(function () {
                    callback2(element, () => {
                        $('#calendar').fullCalendar('removeEvents', event._id);
                    });
                });

            },
            viewRender: function (view, element) {
                var b = $('#calendar').fullCalendar('getDate');
                callback5();
            },
        });

        /* ADDING EVENTS */
        var currColor = "#3c8dbc"; //Red by default
        //Color chooser button
        var colorChooser = $("#color-chooser-btn");//').css({ "background-color": currColor, "border-color": currColor });

        var addingEv = false;
        $("#add-new-event2").click(function (e) {
            if (addingEv) {
                addingEv = false;
                currColor = $(this).css("background-color");
                pret = $('#add-new-event').css("background-color");
                $('#add-new-event').css({ "background-color": currColor, "border-color": currColor });

                $("#add-new-event2").animate({ bottom: '0px' });
                $("#add-new-event3").animate({ bottom: '0px' }); addingEv = false;
                $('#add-new-event2').css({ "background-color": pret, "border-color": pret });

                e.preventDefault();
                //Save color
                //Add color effect to button
                //Get value and make sure it is not null
                var val = $("#new-event").val();
                if (val.length == 0) {
                    return;
                }
                callback3(val, currColor);
                //Create events
                var event = $("<div />");
                event.css({ "background-color": currColor, "border-color": currColor, "color": "#fff", 'text-align': 'center', 'border-radius': '10px', 'margin-bottom': '3px', 'line-height': '20px', 'padding': '5px 0' }).addClass("external-event");
                var cross = '<button id="id1" style="background: transparent; border:none; float:right; z-index:500; position: relative; left:-10px"><i _ngcontent-rge-61="" aria-hidden="true" class="fa fa-times"></i></button>'
                event.html(val + cross);
                event.find("#id1").click(function () {
                    callback8(val);
                })
                $('#external-events').prepend(event);

                //Add draggable funtionality
                ini_events(event);

                //Remove event from text input
                $("#new-event").val("");

                calback9(false);
            }
            else {
                addingEv = true;

                $("#add-new-event2").animate({ bottom: '60px' });
                $("#add-new-event3").animate({ bottom: '30px' });

                calback9(true);
            }
        });
        $("#add-new-event3").click(function (e) {
            if (addingEv) {
                currColor = $(this).css("background-color");
                pret = $('#add-new-event').css("background-color");
                $('#add-new-event').css({ "background-color": currColor, "border-color": currColor });

                $("#add-new-event2").animate({ bottom: '0px' });
                $("#add-new-event3").animate({ bottom: '0px' });
                $('#add-new-event3').css({ "background-color": pret, "border-color": pret });

                addingEv = false;
                e.preventDefault();
                //Get value and make sure it is not null
                var val = $("#new-event").val();
                if (val.length == 0) {
                    return;
                }
                callback3(val, currColor);
                //Create events
                var event = $("<div />");
                event.css({ "background-color": currColor, "border-color": currColor, "color": "#fff", 'text-align': 'center', 'border-radius': '10px', 'margin-bottom': '3px', 'line-height': '20px', 'padding': '5px 0' }).addClass("external-event");

                var cross = '<button id="id1" style="background: transparent; border:none; float:right; z-index:500; position: relative; left:-10px"><i _ngcontent-rge-61="" aria-hidden="true" class="fa fa-times"></i></button>'

                event.html(val + cross);
                event.find("#id1").click(function () {
                    callback8(val);
                })
                $('#external-events').prepend(event);

                //Add draggable funtionality
                ini_events(event);

                //Remove event from text input
                $("#new-event").val("");

                calback9(false);
                //calback9(ini_events)
            }
            else {
                addingEv = true;

                $("#add-new-event2").animate({ bottom: '60px' });
                $("#add-new-event3").animate({ bottom: '30px' });

                calback9(true);
            }

        });
        $("#add-new-event").click(function (e) {

            if (addingEv) {
                currColor = $(this).css("background-color");
                addingEv = false;

                $("#add-new-event2").animate({ bottom: '0px' });
                $("#add-new-event3").animate({ bottom: '0px' });
                e.preventDefault();
                //Get value and make sure it is not null
                var val = $("#new-event").val();
                if (val.length == 0) {
                    return;
                }
                callback3(val, currColor);
                //Create events
                var event = $("<div />");
                event.css({ "background-color": currColor, "border-color": currColor, "color": "#fff", 'text-align': 'center', 'border-radius': '10px', 'margin-bottom': '3px', 'line-height': '20px', 'padding': '5px 0' }).addClass("external-event");

                var cross = '<button id="id1" style="background: transparent; border:none; float:right; z-index:500; position: relative; left:-10px"><i _ngcontent-rge-61="" aria-hidden="true" class="fa fa-times"></i></button>'

                event.html(val + cross);
                event.find("#id1").click(function () {
                    callback8(val);
                    event.remove();
                });
                $('#external-events').prepend(event);

                //Add draggable funtionality
                ini_events(event);

                //Remove event from text input
                $("#new-event").val("");

                calback9(ini_events)
                calback9(false);
                //calback9(ini_events)
            }
            else {
                addingEv = true;
                $("#add-new-event2").animate({ bottom: '60px' });
                $("#add-new-event3").animate({ bottom: '30px' });
                calback9(true);
            }
        });
        //callback5();

    });

}