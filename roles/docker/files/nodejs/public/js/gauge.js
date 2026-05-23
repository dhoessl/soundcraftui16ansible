function animate_gauge(element, target, max) {
  if (element.hasOwnProperty("gauge_animation")) {
    element.gauge_animation.stop();
  }
  let current = element.css("--value") * 100;
  element.gauge_animation = $({ value: current }).animate(
    { value: target / max * 100 },
    {
      duration: 800,
      easing: "swing",
      step: function() {
        element.css("--value", this.value / 100);
      }
    }
  );
}
