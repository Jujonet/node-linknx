//var callback = require('./callback').callback;
var net = require('net');
var xml2js = require('xml2js')

exports.refresh_linknx = function(HOST,PORT, interval, callback) { 
    var HOST = HOST;
    var PORT = PORT;
    var data_xml = '<read><objects></objects></read>\04';
    setInterval(function(){
      ask_status(HOST,PORT,data_xml, callback)
    }, interval);
  
};

exports.status_all = function(HOST,PORT, callback) { 
    var HOST = HOST;
    var PORT = PORT;
    var data_xml = '<read><objects></objects></read>\04';
    ask_status(HOST,PORT,data_xml, callback)
};

exports.status_multi = function(HOST,PORT,liste_object, callback) { 
    var HOST = HOST;
    var PORT = PORT;
    var data_xml = '<read><objects>';//'<read><objects></objects></read>\04';
    for(var i= 0; i < liste_object.objects.length; i++){
      var id_linknx = liste_object.objects[i].id;
      data_xml = data_xml + '<object id="'+ id_linknx + '"/>';
    }
    data_xml = data_xml + '</objects></read>\04';
    ask_status(HOST,PORT,data_xml, callback)
};

exports.change_state = function(HOST,PORT,object,value,callback) { 
    var HOST = HOST;
    var PORT = PORT;
    var data_xml = '<write><object id="' + object + '" value="' + value + '"/></write>\04';
    write_linknx(HOST,PORT,data_xml, callback)
};

exports.change_state_multi = function(HOST,PORT,Liste_objects_linknx,callback) { 
    var HOST = HOST;
    var PORT = PORT;
    var data_xml = "";
    for(var i= 0; i < Liste_objects_linknx.objects.length; i++){
      var id_linknx = Liste_objects_linknx.objects[i].id;
      var val_linknx = Liste_objects_linknx.objects[i].value;
      var data_xml = '<write><object id="' + id_linknx + '" value="' + val_linknx + '"/></write>\04';
       write_linknx(HOST,PORT,data_xml, callback)
    }
};

/* Changement etat */
var write_linknx = function(HOST,PORT,data_xml, callback) {
  var client = new net.Socket();
  client.connect(PORT, HOST, function() {
      console.log('CONNECTED TO: ' + HOST + ':' + PORT);
      // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
      client.write(data_xml);
  });
  // Add a 'data' event handler for the client socket
  // data is what the server sent to this socket
  var buffer = '';
  var string_json = new Array();
  string_json = '{"reponse":[]}';
  string_json = JSON.parse(string_json);
  client.on('data', function(data) {
    data = data.toString('utf8'); // assuming utf8 data...
      var prev = 0, next;
      data = data.toString('utf8'); // assuming utf8 data...
      while ((next = data.indexOf('\04', prev)) > -1) {
        buffer += data.substring(prev, next);
        var xml = buffer.trim();
        var parser = new xml2js.Parser()
        parser.parseString(xml, function (err, res) {
          if (err) return console.log(err.message)
              var json_temp
              var status_reponse = res.write.$.status;
              if(status_reponse == "success"){
                  json_temp = '{"status":"'+status_reponse+'"}';
              }
              else if(status_reponse == "error"){
                  var erreur = res.write._;
                  json_temp = '{"status":"'+status_reponse+'","error":"'+erreur+'"}';
              }
              else {
                  json_temp = '{"status":"Erreur Inconnue"}';
              }
              string_json.reponse.push(json_temp);
              callback(string_json);
        })
        buffer = '';
        prev = next + 1;
      }
      buffer += data.substring(prev);
  });
}

/* demande etat linknx */
var ask_status = function(HOST,PORT,data_xml, callback) {
  var client = new net.Socket();
  client.connect(PORT, HOST, function() {
      console.log('CONNECTED TO: ' + HOST + ':' + PORT);
      // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
      client.write(data_xml);
  });
  // Add a 'data' event handler for the client socket
  // data is what the server sent to this socket
  var buffer = '';
  var string_json = new Array();
  string_json = '{"objects":[]}';
  string_json = JSON.parse(string_json);
  client.on('data', function(data) {
      //console.log(data)
      var prev = 0, next;
      data = data.toString('utf8'); // assuming utf8 data...

      while ((next = data.indexOf('\n', prev)) > -1) {
        buffer += data.substring(prev, next);
        var json_retour = convertToJson(buffer);

        if(json_retour != null){
          string_json.objects.push(json_retour);
        }
        buffer = '';
        prev = next + 1;
      }
      buffer += data.substring(prev);
      callback(string_json);
  });

  // Add a 'close' event handler for the client socket
  client.on('close', function() {
      console.log('Connection closed');
  });
}


/* Convertion retour xml vers json */
function convertToJson(xml_linknx){
  var json;
  var xml = xml_linknx.trim();
  var rgxp_read_status = /<read status="success">/i
  var match_read_status = rgxp_read_status.test(xml);

  var rgxp_objects = /<objects>/i
  var match_objects = rgxp_objects.test(xml);

  var rgxp_end_objects = /<\/objects>/i
  var match_end_objects = rgxp_end_objects.test(xml);

  var rgxp_end_read = /<\/read>/i
  var match_end_read = rgxp_end_read.test(xml);

  if ( match_read_status == true || match_objects == true || match_end_objects == true || match_end_read == true ){
    return null;
  }
  
  var parser = new xml2js.Parser()
    parser.parseString(xml, function (err, res) {
        if (err) return console.log(err.message)
          if(res.object.$){
            var id_obj = res.object.$.id;
            var val_obj = res.object.$.value;
            json = '{"id":"'+id_obj+'","value":"'+val_obj+'"}';
          }
    })

return json;
}


