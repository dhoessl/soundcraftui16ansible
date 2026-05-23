function get_modal(id, title) {
  const modal = $("<div>")
    .addClass("modal").addClass("fade")
    .attr("tabindex", "-1").attr("aria-hidden", "true")
    .attr("aria-labelledby", "modal-label-" + id)
    .attr("id", id).attr("data-bs-theme", "dark")
    .append(
      $("<div>").addClass("modal-dialog").append(
        $("<div>").addClass("modal-content").append(
          $("<div>").addClass("modal-header").append(
            $("<h1>").addClass("modal-title").attr("id", "modal-label-" + id)
            .text(title)
          ).append(
            $("<button>").addClass("btn-close").attr("type", "button")
            .attr("data-bs-dismiss", "modal").attr("aria-label", "Close")
          )
        ).append(
          $("<div>").addClass("modal-body")
        ).append(
          $("<div>").addClass("modal-footer").addClass("d-flex")
          .addClass("justify-content-end").append(
            $("<div>").addClass("btn").addClass("btn-secondary")
            .attr("data-bs-dismiss", "modal").text("Close")
          )
        )
      )
    )
  return modal
}

function create_mqtt_modal(modal) {
  modal.find(".modal-body").append(
    $("<div>").addClass("mb-3").addClass("mt-3").append(
      $("<label>").addClass("form-label").attr("for", "new-mqtt-host")
      .text("New Host")
    ).append(
      $("<input>").addClass("form-control").attr("id", "new-mqtt-host")
      .attr("placeholder", $("#mqtt_host").text()).val($("#mqtt_host").text())
    )
  ).append(
    $("<div>").addClass("mb-3").append(
      $("<label>").addClass("form-label").attr("for", "new-mqtt-port")
      .text("New Port")
    ).append(
      $("<input>").addClass("form-control").attr("id", "new-mqtt-port")
      .attr("placeholder", $("#mqtt_port").text()).val($("#mqtt_port").text())
    )
  );
  modal.find(".modal-footer").prepend(
    $("<button>").addClass("btn").addClass("btn-warning").attr("type", "submit")
    .text("Submit").on("click", function(){
      bootstrap.Modal.getInstance($("#mqtt-modal")).hide();
      updateMqtt($("#new-mqtt-host").val(), $("#new-mqtt-port").val());
    })
  );
}
