window.addEventListener("load", function() {
  $("#settingsbtn").on("click", function() {
    $("#settingspanel").collapse("toggle");
    $(this).toggleClass("rotate-45");
  });
});
