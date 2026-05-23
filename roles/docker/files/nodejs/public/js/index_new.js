function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
  show_mqtt_status_toast(false);
}

function onConnect() {
  window.mqtt_client.subscribe("status_update/" + window.mqtt_client.clientId);
  window.mqtt_client.subscribe("status_update/all");
  window.mqtt_client.subscribe("database_update/" + window.mqtt_client.clientId + "/#");
  window.mqtt_client.subscribe("database_update/all/#");
  window.mqtt_client.subscribe("vu");
  show_mqtt_status_toast(true);
  var message = new Paho.Message("");
  message.destinationName = "status_request/" + window.mqtt_client.clientId;
  window.mqtt_client.send(message);
  for (let c=0; c < 12; c++) {
    for (let f=0; f < 4; f++) {
      var message = new Paho.Message(JSON.stringify({channel: c, fx: f, param: "value"}));
      message.destinationName = "database_request/" + window.mqtt_client.clientId + "/channel_fx";
      window.mqtt_client.send(message);
      var message = new Paho.Message(JSON.stringify({channel: c, fx: f, param: "mute"}));
      message.destinationName = "database_request/" + window.mqtt_client.clientId + "/channel_fx";
      window.mqtt_client.send(message);

    }
  }
  for (let f=0; f < 4; f++) {
    for (let p=1; p < 7; p++) {
      var message = new Paho.Message(JSON.stringify({fx: f, param: "par" + p}));
      message.destinationName = "database_request/" + window.mqtt_client.clientId + "/fx";
      window.mqtt_client.send(message);
    }
    var message = new Paho.Message(JSON.stringify({fx: f, param: "mute"}));
    message.destinationName = "database_request/" + window.mqtt_client.clientId + "/fx";
    window.mqtt_client.send(message);
  }
  var message = new Paho.Message("");
  message.destinationName = "database_request/" + window.mqtt_client.clientId + "/bpm";
  window.mqtt_client.send(message);
}

function onMessageArrived(message) {
  if (message.destinationName.startsWith("status")) {
    onStatusUpdateToast(message.payloadString);
  } else if (message.destinationName.startsWith("database_update")){
    const target = message.destinationName.split("/")[2];
    if (["channel_fx", "fx"].includes(target)){
      onConfigMixerUpdate(target, message.payloadString);
    } else {
      return false;
    }
  } else if (message.destinationName.startsWith("vu")) {
    onVUMeterUpdate(message.payloadString);
  } else {
    console.log(
      "Message arrived on topic " + message.destinationName + " with content "
      + message.payloadString
    );
  }
}

function onVUMeterUpdate(message) {
  const data = JSON.parse(message);
  $.each(data["input"], function(block, values) {
    set_bar($("#input-" + block).find(".z-2"), values.mix.fader, 240);
    set_bar($("#input-" + block).find(".z-1"), values.mix.pre, 240);
    $("#input-" + block).find("#channel-level").text(values.mix.fader_formated);
  });
  set_bar($("#master-l").find(".z-1"), data["master"]["0"].mix.post, 240);
  set_bar($("#master-l").find(".z-2"), data["master"]["0"].mix.fader, 240);
  set_bar($("#master-r").find(".z-1"), data["master"]["1"].mix.post, 240);
  set_bar($("#master-r").find(".z-2"), data["master"]["1"].mix.fader, 240);
  $("#master-r").find("channel-level").text(data["master"]["0"].mix.fader_formated);
  $("#master-l").find("channel-level").text(data["master"]["1"].mix.fader_formated);
}

function onConfigMixerUpdate(target, message) {
  const data = JSON.parse(message);
  if (target == "fx"){
    let fx;
    if (data.fx == "0") {
      fx = "reverb";
    } else if (data.fx == "1") {
      fx = "delay";
    } else if (data.fx == "2") {
      fx = "chorus";
    } else {
      fx = "room";
    }
    if (data.param.startsWith("par")) {
      $("#" + fx + "-" + data.param).find(".bar")
        .stop().animate({height: (data.value * 100) + "%"}, 400, "swing");
      $("#" + fx + "-" + data.param).find(".channel-level").text(data.value_formated);
    } else if (data.param == "mute") {
      let color;
      if (data.value == 0){
        color = "white";
      } else {
        color = "red";
      }
      $("[id^='" + fx + "']").each(function() {
        $(this).find(".channel-level").css("color", color);
      });
    }
  } else if (target == "channel_fx") {
    if (data.param == "mute") {
      if (data.value == 1){
        $($("#fx-channel-" + data.channel).find(".gauge")[data.fx])
          .css("color", "red");
      } else {
        $($("#fx-channel-" + data.channel).find(".gauge")[data.fx])
          .css("color", "white");
      }
    } else {
      animate_gauge($($("#fx-channel-" + data.channel).find(".gauge")[data.fx]), data.value, 1);
      $($("#fx-channel-" + data.channel).find(".gauge")[data.fx]).text(data.value_formated);
    }
  }
}

function toggle_channel_fx_inputs() {
  $("#inputs-16").toggleClass("d-none");
  $("#inputs-712").toggleClass("d-none");
}

function create_settings() {
  $("#settingspanel").find(".list-unstyled").append(
    $("<li>").addClass("mb-1").append(
      $("<button>").addClass("btn").addClass("btn-primary").addClass("btn-sm")
      .attr("type", "button").text("Switch Send Channels").on("click", function(){
        toggle_channel_fx_inputs();
      })
    )
  );
  return false;
}

window.addEventListener("load", function() {
  create_settings();
  connectmqtt();
});
