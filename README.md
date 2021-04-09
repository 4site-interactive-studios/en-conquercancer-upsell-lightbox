# Engaging Networks Upsell Lightbox Script

## Setup

1 - First, create a script with the options:

```html
<script>
  window.UpsellOptions = {
    image: "https://picsum.photos/480/650",
    imagePosition: "left", // left or right
    title:
      "Will you change your gift to just {new-amount} a month to boost your impact?",
    paragraph:
      "Make a monthly pledge today to support critical resources and programs for oncology professionals, patients, and the entire cancer community.",
    yesLabel: "Yes! Process My <br> {new-amount} monthly gift",
    noLabel: "No, thanks. Continue with my <br> {old-amount} one-time gift",
    otherAmount: true, // use false to hide the "other amount" field
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
    canClose: false,
    submitOnClose: false,
    debug: true, // false to disable console debug information
  };
</script>
```

<div style="page-break-after: always;"></div>

2 - Then add the upsell lightbox file:

```html
<script
  async
  type="text/javascript"
  src="/dist/4site-upsell-lightbox.js"
></script>
```

3 - You're done!

## Options

**image** - Image URL to load on the Upsell Lightbox.  
**imagePosition** - You can set "left" or "right" to choose the position of the image.  
**title** - Title of the Upsell Lightbox. Variables allowed (see below).  
**paragraph** - Sub-title of the Upsell Lightbox. Variables allowed (see below).  
**yesLabel** - Label used on the "Yes" button. Variables allowed (see below).  
**noLabel** - Label used on the "No" button. Variables allowed (see below).  
**otherAmount** - Set it to `true` if you want to show the "other amount" field on the Upsell Lightbox. `false` otherwise.  
**otherLabel** - Label used on the "other amount" field.  
**amountRange** - Array with the amount suggestions range. It follows this format:

```js
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
```

The donation amount is compared to each `max` property and, when it's lower or equal, we'll return the equivalent `suggestion` value.  
As you can see on the example above, you can also use javascript code as the "suggestion" property. When using javascript code (inside quotes) to calculate your suggestion, use the special word `amount`. That word will get replaced by the dynamic one-time amount.  
**canClose** - `true` or `false` to enable/disable the close functions/button.  
**submitOnClose** - `true` or `false` to enable/disable the form submission when closing the lightbox. It only works if **canClose** is `true`.  
**debug** - `true` or `false` to enable/disable console notifications.

You can ommit any option that you don't need to change the default value.

## Variables

Some options allows variables, that will get replaced by dynamic values:

**{new-amount}** - Will get replaced by the current suggested upsell amount based on the `amountRange` option.  
**{old-amount}** - Will get replaced by the current one-time amount this user is trying to give.

## Features

- It only runs if you're on the **first page** of a **donation page**. If you add the script to other pages, you'll not get any output errors.
- It works alongside the `enOnSubmit`, so it's future proof.
- To improve performance, it will not render anything to the page if you're not on the first step of a Donation Page.
- If **canClose** is `true`, you can close the lightbox by clicking on the close button (top right), by pressing the ESC key, or by clicking anywhere outside the lightbox.
- When you change the "different amount" field, it will update the YES button at the same time, so the user will not have doubt about the amount.
- You don't need to worry about any HTML or CSS.
- It has no external dependency.

## Development

1. `npm install`

## Deploy

1. `npm run build`

It's going to create a `dist` folder, where you can get the files and publish it.
