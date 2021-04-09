export class UpsellUtils {
  constructor(options) {
    this.options = {
      image: "https://picsum.photos/480/650",
      imagePosition: "left", // left or right
      title:
        "Will you change your gift to just {new-amount} a month to boost your impact?",
      paragraph:
        "Make a monthly pledge today to support critical resources and programs for oncology professionals, patients, and the entire cancer community.",
      yesLabel: "Yes! Process My <br> {new-amount} monthly gift",
      noLabel: "No, thanks. Continue with my <br> {old-amount} one-time gift",
      otherAmount: true, // Use false to hide the "other amount" field
      otherLabel: "Or enter a different monthly amount:",
      amountRange: [
        { max: 10, suggestion: 5 },
        { max: 15, suggestion: 7 },
        { max: 20, suggestion: 8 },
        { max: 25, suggestion: 9 },
        { max: 30, suggestion: 10 },
        { max: 35, suggestion: 11 },
        { max: 40, suggestion: 12 },
        { max: 50, suggestion: 14 },
        { max: 100, suggestion: 15 },
        { max: 200, suggestion: 19 },
        { max: 300, suggestion: 29 },
        { max: 500, suggestion: "Math.ceil((amount / 12)/5)*5" },
      ],
      canClose: true,
      submitOnClose: false,
      debug: false,
    };
    this.options = Object.assign(this.options, options);
    this.enForm = document.querySelector("form.en__component");
    this.debug = this.options.debug;

    if (!this.shouldRun()) {
      if (this.debug) console.log("Upsell script should NOT run");
      // If we're not on a Donation Page, get out
      return false;
    }
    let overlay = document.createElement("div");
    overlay.id = "upsellModal";
    overlay.classList.add("is-hidden");
    overlay.classList.add("image-" + this.options.imagePosition);
    this.overlay = overlay;
    window.enOnSubmit = () => {
      return this.open();
    };
    this.renderLightbox();
  }
  renderLightbox() {
    const title = this.options.title
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const paragraph = this.options.paragraph
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const yes = this.options.yesLabel
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const no = this.options.noLabel
      .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
      .replace("{old-amount}", "<span class='upsell_amount'></span>");
    const markup = `
            <div class="upsellLightboxContainer" id="goMonthly">
              <!-- ideal image size is 480x650 pixels -->
              <div class="background" style="background-image: url('${
                this.options.image
              }');"></div>
              <div class="upsellLightboxContent">
              ${
                this.options.canClose ? `<span id="goMonthlyClose"></span>` : ``
              }
                <h1>
                  ${title}
                </h1>
                ${
                  this.options.otherAmount
                    ? `
                <p>
                  <span>${this.options.otherLabel}</span>
                  <input href="#" id="secondOtherField" name="secondOtherField" size="12" type="number" inputmode="numeric" step="1" value="">
                </p>
                `
                    : ``
                }
                
                <p>
                  ${paragraph}
                </p>
                <!-- YES BUTTON -->
                <div id="upsellYesButton">
                  <a href="#">
                    <div>
                      ${yes}
                    </div>
                  </a>
                </div>
                <!-- NO BUTTON -->
                <div id="upsellNoButton">
                  <button title="Close (Esc)" type="button">
                    <div>${no}</div>
                  </button>
                </div>
              </div>
            </div>
            `;

    this.overlay.innerHTML = markup;
    const closeButton = this.overlay.querySelector("#goMonthlyClose");
    const yesButton = this.overlay.querySelector("#upsellYesButton a");
    const noButton = this.overlay.querySelector("#upsellNoButton button");
    yesButton.addEventListener("click", this.continue.bind(this));
    noButton.addEventListener("click", this.continue.bind(this));
    if (closeButton)
      closeButton.addEventListener("click", this.close.bind(this));
    this.overlay.addEventListener("click", (e) => {
      if (e.target.id == this.overlay.id && this.options.canClose) {
        this.close(e);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape" && closeButton) {
        closeButton.click();
      }
    });
    document.body.appendChild(this.overlay);
    const otherField = document.querySelector("#secondOtherField");
    if (otherField) {
      otherField.addEventListener("keyup", this.popupOtherField.bind(this));
    }
    if (this.debug) console.log("Upsell script rendered");
  }
  // Should we run the script?
  shouldRun() {
    // if it's a first page of a Donation page
    return (
      !!window.pageJson &&
      window.pageJson.pageNumber == 1 &&
      window.pageJson.pageType == "donation"
    );
  }

  popupOtherField() {
    const value = document.querySelector("#secondOtherField").value;
    const live_upsell_amount = document.querySelectorAll(
      "#upsellYesButton .upsell_suggestion"
    );

    if (!isNaN(value) && value > 0) {
      live_upsell_amount.forEach(
        (elem) => (elem.innerHTML = "$" + parseFloat(value).toFixed(2))
      );
    } else {
      live_upsell_amount.forEach(
        (elem) => (elem.innerHTML = "$" + this.getUpsellAmount().toFixed(2))
      );
    }
  }

  liveAmounts() {
    const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
    const live_amount = document.querySelectorAll(".upsell_amount");
    const suggestedAmount = this.getUpsellAmount();

    live_upsell_amount.forEach(
      (elem) => (elem.innerHTML = "$" + suggestedAmount.toFixed(2))
    );
    live_amount.forEach(
      (elem) => (elem.innerHTML = "$" + this.getAmount().toFixed(2))
    );
  }

  getFieldValue(name) {
    return new FormData(this.enForm).getAll(name).join(",");
  }
  setFieldValue(name, value) {
    const element = document.getElementsByName(name);
    if (element) {
      element.forEach((field) => {
        if ("type" in field) {
          switch (field.type) {
            case "select-one":
            case "select-multiple":
              for (const option of field.options) {
                if (option.value == value) {
                  option.selected = true;
                }
              }
              break;
            case "checkbox":
            case "radio":
              if (field.value == value) {
                field.checked = true;
              }
              break;
            case "textarea":
            case "text":
            default:
              field.value = value;
          }
        }
      });
    }
    return;
  }

  // Return the Suggested Upsell Amount
  getUpsellAmount() {
    const amount = this.getAmount();
    const otherAmount = document.getElementById("secondOtherField");
    if (otherAmount && otherAmount.value > 0) {
      return otherAmount.value;
    }
    let upsellAmount = 0;
    this.options.amountRange.forEach((value) => {
      if (upsellAmount == 0 && amount <= value.max) {
        upsellAmount = value.suggestion;
        if (isNaN(value.suggestion)) {
          upsellAmount = eval(value.suggestion.replace("amount", amount));
        }
      }
    });
    return upsellAmount;
  }
  getAmount() {
    return parseFloat(this.getFieldValue("transaction.donationAmt"));
  }

  open() {
    if (this.debug) console.log("Upsell Script Triggered");
    const freq = this.getFieldValue("transaction.recurrpay");
    const upsellAmount = this.getUpsellAmount();
    // If frequency is already monthly or
    // the modal is already opened or
    // there's no suggestion for this donation amount,
    // send the donation form
    if (
      freq == "Y" ||
      !this.overlay.classList.contains("is-hidden") ||
      !upsellAmount
    )
      return true;
    if (this.debug) {
      console.log("Upsell Frequency", freq);
      console.log("Upsell Amount", this.getAmount());
      console.log("Upsell Suggested Amount", upsellAmount);
    }

    this.liveAmounts();
    this.overlay.classList.remove("is-hidden");
    return false;
  }
  // Proceed to the next page (upsold or not)
  continue(e) {
    e.preventDefault();
    if (document.querySelector("#upsellYesButton").contains(e.target)) {
      if (this.debug) console.log("Upsold");
      this.setFieldValue("transaction.donationAmt", this.getUpsellAmount());
      this.setFieldValue("transaction.recurrpay", "Y");
    }
    this.enForm.submit();
  }
  // Close the lightbox (no cookies)
  close(e) {
    e.preventDefault();
    if (this.options.submitOnClose) {
      this.enForm.submit();
    }
    this.overlay.classList.add("is-hidden");
  }
}
