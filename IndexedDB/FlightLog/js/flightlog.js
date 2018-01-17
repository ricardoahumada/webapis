$(function () {
            // Check for Indexed DB support
            if ("webkitIndexedDB" in window) {
                window.indexedDB = window.webkitIndexedDB;
            }
            else if ("mozIndexedDB" in window) {
                window.indexedDB = window.mozIndexedDB;
            }

            if (!window.indexedDB) {
                alert("This browser doesn't support Indexed DB");
                return;
            }

            // TEST
            $("#test").click(function (e) {
                // Empty the form fields
                //$("#username").val("");
                //$("#password").val("");

                // Display the login dialog
                $("#dialog").dialog({
                    modal: true,
                    resizable: false,
                    show: "scale",
                    hide: "scale",
                    width: 370,
                    buttons: {
                        Ok: function () {
                            var jet = $("#jet").val();
                            var date = new Date($("#date").val());
                            var location = $("#location").val();
                            var duration = $("#duration").val();
                            var egt = $("#egt").val();
                            var pump = $("#pump").val();

                            insertFlight(jet, date, location, duration, egt, pump);

                            $(this).dialog("close");
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    }
                });

                e.preventDefault();
            });

            /*
                        var request = window.indexedDB.deleteDatabase("FlightDatabase");
                        request.onsuccess = function (event) {
                            return;
                        }
            */
            // Register live event handler for query buttons
            $("#buttons").delegate(":button", "click", function (e) {
                showFlightsForJet(this.value);
            });

            // Open the database
            var request = window.indexedDB.open("FlightDatabase", 1);

            // Seed the database with entries if it doesn't exist
            request.onupgradeneeded = function (e) {
                var db = e.target.result;
                var store = db.createObjectStore("flights", { autoIncrement: true });
                store.createIndex("jet", "jet", { unique: false });

                store.add({ jet: "BobCat", date: new Date("June 1, 2012 12:00:00"), location: "Georgia Jets", duration: 8, maxEGT: 1380, maxPumpVoltage: 3.8 });
                store.add({ jet: "BobCat", date: new Date("June 1, 2012 12:00:00"), location: "Georgia Jets", duration: 7, maxEGT: 1390, maxPumpVoltage: 3.6 });
                store.add({ jet: "Bandit", date: new Date("June 1, 2012 12:00:00"), location: "Georgia Jets", duration: 7, maxEGT: 1400, maxPumpVoltage: 3.5 });
                store.add({ jet: "F-16", date: new Date("June 1, 2012 12:00:00"), location: "Georgia Jets", duration: 6, maxEGT: 1370, maxPumpVoltage: 4.0 });
                store.add({ jet: "F-16", date: new Date("June 1, 2012 12:00:00"), location: "Georgia Jets", duration: 8, maxEGT: 1380, maxPumpVoltage: 3.4 });

                store.add({ jet: "BobCat", date: new Date("June 4, 2012 12:00:00"), location: "House Mountain", duration: 8, maxEGT: 1380, maxPumpVoltage: 3.8 });
                store.add({ jet: "BobCat", date: new Date("June 4, 2012 12:00:00"), location: "House Mountain", duration: 7, maxEGT: 1390, maxPumpVoltage: 3.6 });
                store.add({ jet: "Bandit", date: new Date("June 4, 2012 12:00:00"), location: "House Mountain", duration: 7, maxEGT: 1400, maxPumpVoltage: 3.5 });
                store.add({ jet: "F-16", date: new Date("June 4, 2012 12:00:00"), location: "House Mountain", duration: 6, maxEGT: 1370, maxPumpVoltage: 4.0 });
                store.add({ jet: "F-16", date: new Date("June 4, 2012 12:00:00"), location: "House Mountain", duration: 8, maxEGT: 1380, maxPumpVoltage: 3.4 });
            }

            // Query the database and initialize the UI
            request.onsuccess = function (e) {
                var db = e.target.result;
                showAllFlights(db);
                createButtons(db);
            };
        });

        function showAllFlights(db) {
            var tbody = $("#flights tbody");
            tbody.empty();

            var transaction = db.transaction(["flights"]);
            var store = transaction.objectStore("flights");

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    tbody.append("<tr><td>" + cursor.value.jet +
                        "</td><td>" + cursor.value.date.toDateString() +
                        "</td><td>" + cursor.value.location +
                        "</td><td>" + cursor.value.duration +
                        "</td><td>" + cursor.value.maxEGT +
                        "</td><td>" + cursor.value.maxPumpVoltage +
                        "</td></tr>");
                    cursor.continue();
                }
            };
        }

        function showFlightsForJet(jet) {
            var request = window.indexedDB.open("FlightDatabase", 1);

            request.onsuccess = function (e) {
                // Delete existing table rows
                var tbody = $("#flights tbody");
                tbody.empty();

                // Show flights for a specific jet
                var db = e.target.result;
                var transaction = db.transaction(["flights"], "readonly");
                var store = transaction.objectStore("flights");
                var index = store.index("jet");

                var range = jet === "All" ? null : IDBKeyRange.only(jet);

                index.openCursor(range).onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        tbody.append("<tr><td>" + cursor.value.jet +
                            "</td><td>" + cursor.value.date.toDateString() +
                            "</td><td>" + cursor.value.location +
                            "</td><td>" + cursor.value.duration +
                            "</td><td>" + cursor.value.maxEGT +
                            "</td><td>" + cursor.value.maxPumpVoltage +
                            "</td></tr>");
                        cursor.continue();
                    }
                };
            };
        }

        function insertFlight(jet, date, location, duration, egt, pump) {
            var request = window.indexedDB.open("FlightDatabase", 1);

            request.onsuccess = function (e) {
                var db = e.target.result;
                var transaction = db.transaction(["flights"], "readwrite");
                var store = transaction.objectStore("flights");

                store.add({ jet: jet, date: date, location: location, duration: duration, maxEGT: egt, maxPumpVoltage: pump }).onsuccess = function (e) {
                    showAllFlights(db);
                };
            }
        }

        function createButtons(db) {
            var buttons = $("#buttons");
            var transaction = db.transaction(["flights"]);
            var store = transaction.objectStore("flights");
            var index = store.index("jet");

            index.openCursor(null, "nextunique").onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    buttons.append('<input type="button" value="' + cursor.value.jet + '" class="query" />');
                    cursor.continue();
                }
            };
        }