// var bleno = require('../..');
// var bleno = require('bleno');
var bleno = require('bleno-mac');

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic');

var service_uuid = 'c019';
var isAdvertising = false;
var bluetooth_name = 'NISTCO19';

console.log('bleno - exposure notification');

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising(bluetooth_name, [service_uuid]);
        isAdvertising = true;

    } else {
        bleno.stopAdvertising();
        isAdvertising = false;
    }
});
// code ideas from https://medium.com/@luigi.saetta/bluetooth-low-energy-93284319bfaa
// ACCEPT:
// Accepted a connection from a central device
bleno.on ('accept', function (clientAddress) {
    console.log ("Connection ACCEPTED from address:" + clientAddress);
    // Stop advertising
    bleno.stopAdvertising ();
    isAdvertising = false;
    console.log ( 'Stop advertising …');
});


// DISCONNECT:
// Disconnected from a client
bleno.on ('disconnect', function (clientAddress) {
    console.log ( "Disconnected from address:" + clientAddress);
    // restart advertising …
    bleno.startAdvertising ();
    isAdvertising = true;
    console.log ( 'Start advertising …');
});

// In our case we decided to implement the rule that when a connection is established with a Device Central, 
// our device stops sending the Advertising Package (thus, it is no longer discoverable).
// STOP ADVERTISING:
bleno.on ('advertisingStop', function (error) {
    console.log ( 'Advertising Stopped …');
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    if (!error) {
        bleno.setServices([
            new BlenoPrimaryService({
                uuid: service_uuid,
                characteristics: [
                    new EchoCharacteristic()
                ]
            })
        ]);
    }
});
