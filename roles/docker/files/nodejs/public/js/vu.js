function set_bar(bar, level, max) {
  const new_level = level / max * 100;
  const warn = 70;
  const clip = 85;
  if (new_level > clip) {
    bar.removeClass("bar-green").removeClass("bar-orange").addClass("bar-red")
  } else if (new_level > warn) {
    bar.removeClass("bar-green").removeClass("bar-red").addClass("bar-orange")
  } else {
    bar.removeClass("bar-orange").removeClass("bar-red").addClass("bar-green")
  }
  bar.stop().animate({height: new_level + "%"}, 400, "swing");
}

function set_bar_value(bar, level, max) {
  const new_level = level / max * 100;
  bar.stop().animate({height: new_level + "%"}, 400, "swing");
}

