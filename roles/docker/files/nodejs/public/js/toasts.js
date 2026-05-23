function create_toast(isalert, id, title){
  var toast = $("<div>").addClass("toast").attr("aria-atomic", "true")
    .attr("role", "alert").attr("aria-live", "assertive").attr("id", id)
    .addClass("text-bg-danger").append(
      $("<div>").addClass("toast-header")
      .append(
        $("<strong>").addClass("me-auto").text(title)
      ).append(
        $("<button>").addClass("btn-close").attr("type", "button").attr("data-bs-dismiss", "toast")
        .attr("aria-label", "Close")
      )
    ).append(
      $("<div>").addClass("toast-body")
    )
  if (!isalert){
    toast.attr("role", "status").attr("aria-live", "polite");
    toast.removeClass("text-bg-danger").addClass("text-bg-success");
  }
  return toast
}

function set_toast_msg_and_state(toast, isalert, message) {
  if (isalert){
    toast.removeClass("text-bg-success").addClass("text-bg-danger")
      .attr("role", "alert").attr("aria-live", "assertive");
  } else {
    toast.removeClass("text-bg-danger").addClass("text-bg-success")
      .attr("role", "status").attr("aria-live", "polite");
  }
  toast.find(".toast-body").text(message);
}

function show_mqtt_status_toast(isconnected) {
  if (isconnected) {
    var msg = "Connected";
  } else {
    var msg = "Disconnected";
  }
  try {
    var toast = bootstrap.Toast.getInstance($("#toast-mqtt"));
    set_toast_msg_and_state($("#toast-mqtt"), !isconnected, msg);
    toast.show()
  } catch (error) {
    if (error instanceof TypeError) {
      $("#toasts").append(create_toast(!isconnected, "toast-mqtt", "MQTT"));
      set_toast_msg_and_state($("#toast-mqtt"), !isconnected, msg)
      bootstrap.Toast.getOrCreateInstance($("#toast-mqtt")).show();
    } else {
      console.log("Can not show mqtt status toast");
    }
  }
}

function show_status_toast(id, isConnected) {
  if (isConnected) {
    var msg = "Connected";
  } else {
    var msg = "Disconnected";
  }
  try {
    var toast = bootstrap.Toast.getInstance($("#toast-" + id));
    set_toast_msg_and_state($("#toast-" + id), !isConnected, msg);
    toast.show();
  } catch (error) {
    if (error instanceof TypeError) {
      $("#toasts").append(
        create_toast(!isConnected, "toast-" + id, "Status: " + id)
      );
      set_toast_msg_and_state($("#toast-" + id), !isConnected, msg);
      bootstrap.Toast.getOrCreateInstance($("#toast-" + id)).show();
    } else {
      console.log("Non recoverable error in toast selection " + error);
    }
  }
}
