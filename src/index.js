import "./scss/main.scss";
import { UpsellUtils } from "./app/upsell-utils";

// new UpsellUtils();

//run();
window.addEventListener("load", function() {
  window.UpsellUtils = UpsellUtils;
  if (!window.hasOwnProperty("UpsellOptions")) {
    window.UpsellOptions = {};
  }
  window.upsellUtils = new UpsellUtils(window.UpsellOptions);
});
