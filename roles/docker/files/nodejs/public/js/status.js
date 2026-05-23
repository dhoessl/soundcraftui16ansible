function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
  $("#btn-mqtt").removeClass("btn-success").addClass("btn-danger");
}

function onConnect() {
  window.mqtt_client.subscribe("status_update/" + window.mqtt_client.clientId);
  window.mqtt_client.subscribe("status_update/all");
  window.mqtt_client.subscribe("endpoint_update/" + window.mqtt_client.clientId);
  window.mqtt_client.subscribe("endpoint_update/all");
  console.log("Mqtt Client connected");
  $("#btn-mqtt").removeClass("btn-danger").addClass("btn-success");
  var message = new Paho.Message("");
  message.destinationName = "status_request/" + window.mqtt_client.clientId;
  window.mqtt_client.send(message);
  var message = new Paho.Message("");
  message.destinationName = "endpoint_request/" + window.mqtt_client.clientId;
  window.mqtt_client.send(message);
}

function onMessageArrived(message) {
  if (message.destinationName.startsWith("status")){
    onStatusUpdate(message.payloadString);
  } else if (message.destinationName.startsWith("endpoint")) {
    onEndpointUpdate(message.payloadString);
  } else {
    console.log("Message arrived on topic " + message.destinationName + " with content " + message.payloadString);
  }
}

function onStatusUpdate(message) {
  const data = JSON.parse(message);
  if ("mixer" in data) {
    if (data["mixer"]) {
      $("#btn-mixer").removeClass("btn-danger").addClass("btn-success");
    } else {
      $("#btn-mixer").removeClass("btn-success").addClass("btn-danger");
    }
  }
}

function onEndpointUpdate(message) {
  const data = JSON.parse(message);
  if ("mixer" in data){
    $("#mixer_address").text(data["mixer"]["address"]);
    $("#mixer_port").text(data["mixer"]["port"]);
  }
}

function updateMqtt(host, port) {
  $.ajax({
    method: "POST",
    url: "/api/settings",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      name: "mqtt",
      host: host,
      port: port
    })
  }).done(function(data, status, jqXHR) {
    $("#mqtt_host").text(data.config.mqtt.host);
    $("#mqtt_port").text(data.config.mqtt.port);
    connectmqtt();
  }).fail(function(xhr, status, error) {
    console.log("Error on setting new mqtt host " + error + " " + xhr.responseText);
  });
  $("#mqtt-modal").remove();
}

window.addEventListener("load", function() {
  $("#btn-mqtt").on("click", function() {
    try {
      bootstrap.Modal.getInstance($("#mqtt-modal")).show();
    } catch(error){
      if (error instanceof TypeError) {
        var new_modal = get_modal("mqtt-modal", "Change MQTT Settings");
        create_mqtt_modal(new_modal);
        $("#modals").append(new_modal);
        bootstrap.Modal.getOrCreateInstance($("#mqtt-modal")).show();
      } else {
        console.log("Non recoverable error in modal selection " + error);
        return false;
      }
    }
  });
  connectmqtt();
});
