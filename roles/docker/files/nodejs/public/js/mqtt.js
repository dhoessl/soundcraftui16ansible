window.addEventListener("load", function(){
  const broker_host = $("#mqtt_data").attr("host");
  const broker_port = $("#mqtt_data").attr("port");
  const uuid = $("#mqtt_data").attr("uuid");
  var client = new Paho.Client(broker_host, Number(broker_port), uuid);
  window.mqtt_client = client;

  // set callback handlers
  window.mqtt_client.onConnectionLost = onConnectionLost;
  window.mqtt_client.onMessageArrived = onMessageArrived;

  // connect the client
  window.mqtt_client.connect({onSuccess:onConnect});
});
