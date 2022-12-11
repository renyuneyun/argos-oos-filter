// ==UserScript==
// @name        Argos out-of-stock filter
// @name:zh           Argos無貨過濾器
// @name:zh-CN        Argos无货过滤器
// @description       Filter products that are out-of-stock on Argos, by dimming them
// @description:zh    過濾Argos上無貨的產品，將其變暗
// @description:zh-CN    过滤Argos上无货的产品，将其变暗
// @namespace   https://github.com/renyuneyun
// @match       https://www.argos.co.uk/*
// @grant       none
// @version     0.1
// @author      renyuneyun (Rui Zhao)
// @description 2022/12/9 20:50:25
// ==/UserScript==

// TODO: easier change of behaviour (remove vs dim)

const MEASURE = true;

async function checkProductTextAndRemove(elem) {
  const promises = Array.from(elem.querySelectorAll("[data-test='component-product-card-availabilityLabel']")).map(e => {
    (e.innerText == "Out of stock") &&
      // elem.remove() // Use this to remove the element
      elem.style.setProperty("opacity", 0.1);  // Or use this to dim the elemet
  });
  if (MEASURE)
    await Promise.all(promises);
}

async function findAndRemove() {
  const promises = Array.from(document.querySelectorAll("[itemtype='http://schema.org/Product']")).map(async elem => {
    const res = checkProductTextAndRemove(elem);
    if (MEASURE)
      await res;
    else
      res;
  });
  if (MEASURE)
    await Promise.all(promises);
}

async function main() {
  if (MEASURE) {
    const start = Date.now();
    await findAndRemove();
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
  } else {
    findAndRemove();
  }
}

var observer = new MutationObserver(function(mutations) {
  main();
});

observer.observe(document.body, {
  characterData: true,
});
