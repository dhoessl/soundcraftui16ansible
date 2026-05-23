function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
  show_mqtt_status_toast(false);
}

function onConnect() {
  window.mqtt_client.subscribe("status_update/" + window.mqtt_client.clientId);
  window.mqtt_client.subscribe("status_update/all");
  window.mqtt_client.subscribe("vu");
  show_mqtt_status_toast(true);
  var message = new Paho.Message("");
  message.destinationName = "status_request/" + window.mqtt_client.clientId;
  window.mqtt_client.send(message);
}

function onMessageArrived(message) {
  if (message.destinationName.startsWith("status")) {
    onStatusUpdateToast(message.payloadString);
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
    const input = $("#bar-input-" + block)
    set_bar(input.find(".bar-pre"), values.mix.pre, 240);
    set_bar(input.find(".bar-post"), values.mix.post, 240);
    set_bar(input.find(".bar-real"), values.mix.fader, 240);
    input.find(".channel-level").text(values.mix.fader_formated);
  });
  $.each(data["aux"], function(block, values) {
    const aux = $("#bar-aux-" + block)
    set_bar(aux.find(".bar-post"), values.mix.post, 240);
    set_bar(aux.find(".bar-real"), values.mix.fader, 240);
    aux.find(".channel-level").text(values.mix.fader_formated);
  });
  $.each(data["fx"], function(block, values) {
    const fx = $("#bar-fx-" + block)
    set_bar(fx.find(".bar-post-l"), values.mix.post_left, 240);
    set_bar(fx.find(".bar-post-r"), values.mix.post_right, 240);
    set_bar(fx.find(".bar-real-l"), values.mix.fader_left, 240);
    set_bar(fx.find(".bar-real-r"), values.mix.fader_right, 240);
    fx.find(".channel-level-left").text(values.mix.fader_left_formated);
    fx.find(".channel-level-right").text(values.mix.fader_right_formated);
  });
  const master_left = data["master"]["0"].mix;
  const master_right = data["master"]["1"].mix;
  set_bar($(".bar-master").find(".bar-post-l"), master_left.post, 240);
  set_bar($(".bar-master").find(".bar-post-r"), master_right.post, 240);
  set_bar($(".bar-master").find(".bar-real-l"), master_left.fader, 240);
  set_bar($(".bar-master").find(".bar-real-r"), master_right.fader, 240);
  $(".bar-master").find(".channel-level-left").text(master_left.fader_formated);
  $(".bar-master").find(".channel-level-right").text(master_right.fader_formated);
}

function test_bars() {
  $(".bar").each(function(){
    const newheight = 240 * Math.random();
    set_bar($(this), newheight, 240);
  });
}

function create_settings() {
  $("#settingspanel").find(".list-unstyled").append(
    $("<li>").addClass("mb-1").append(
      $("<button>").addClass("btn").addClass("btn-danger").addClass("btn-sm")
      .attr("type", "button").text("Hide Inputs").on("click", function() {
        if ($(this).hasClass("btn-danger")){
          $(this).removeClass("btn-danger").addClass("btn-success").text("Show Inputs");
          $("#bar-input-0").parent().hide();
        } else {
          $(this).removeClass("btn-success").addClass("btn-danger").text("Hide Inputs");
          $("#bar-input-0").parent().show();
        }
      })
    )
  ).append(
    $("<li>").addClass("mb-1").append(
      $("<button>").addClass("btn").addClass("btn-danger").addClass("btn-sm")
      .attr("type", "button").text("Hide Aux").on("click", function() {
        if ($(this).hasClass("btn-danger")){
          $(this).removeClass("btn-danger").addClass("btn-success").text("Show Show Aux");
          $("[id*='bar-aux-']").each(function(index, element) {
            $(this).hide();
          });
        } else {
          $(this).removeClass("btn-success").addClass("btn-danger").text("Hide Aux");
          $("[id*='bar-aux-']").each(function(index, element) {
            $(this).show();
          });
        }
      })
    )
  ).append(
    $("<li>").addClass("mb-1").append(
      $("<button>").addClass("btn").addClass("btn-danger").addClass("btn-sm")
      .attr("type", "button").text("Hide FX").on("click", function() {
        if ($(this).hasClass("btn-danger")){
          $(this).removeClass("btn-danger").addClass("btn-success").text("Show FX");
          $("[id*='bar-fx-']").each(function(index, element) {
            $(this).hide();
          });
        } else {
          $(this).removeClass("btn-success").addClass("btn-danger").text("Hide FX");
          $("[id*='bar-fx-']").each(function(index, element) {
            $(this).show();
          });
        }
      })
    )
  ).append(
    $("<li>").addClass("mb-1").append(
      $("<button>").addClass("btn").addClass("btn-danger").addClass("btn-sm")
      .attr("type", "button").text("Hide Master").on("click", function() {
        if ($(this).hasClass("btn-danger")){
          $(this).removeClass("btn-danger").addClass("btn-success").text("Show Master");
          $(".bar-master").hide();
        } else {
          $(this).removeClass("btn-success").addClass("btn-danger").text("Hide Master");
          $(".bar-master").show();
        }
      })
    )
  );
}

window.addEventListener("load", function() {
  create_settings();
  connectmqtt();
});
