function connectmqtt(){
  if (window.mqtt_client && window.mqtt_client.isConnected()){
    window.mqtt_client.disconnect();
  }
  $.ajax({
    method: "GET",
    url: "/api/mqtt"
  }).done(function(data, status, jqXHR) {
    var client = new Paho.Client(data.mqtt.host, Number(data.mqtt.port), data.uuid);
    window.mqtt_client = client;
    window.mqtt_client.onConnectionLost = onConnectionLost;
    window.mqtt_client.onMessageArrived = onMessageArrived;
    window.mqtt_client.connect({onSuccess:onConnect});
  }).fail(function(xhr, status, error) {
    console.log("Error " + error + " while getting mqtt data " + xhr.responseText);
  });
}

function onStatusUpdateToast(message) {
  const data = JSON.parse(message);
  Object.keys(data).forEach(key => {
    show_status_toast(key, data[key]);
  });
}
