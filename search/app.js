import data from "./data.js";

export default function Search(formSelector, searchSelector, resultSelector) {
  const formElement = document.querySelector(formSelector);
  const searchElement = document.querySelector(searchSelector);
  const resultElement = document.querySelector(resultSelector);

  if (formElement && searchElement && resultElement) {
    formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const result = search(data, searchElement.value);
      if (!result || result.length <= 0) {
        // return "not found";
        return (resultElement.innerHTML = `Không tìm thấy kết quả phù hợp với "${searchElement.value}"`);
      }

      searchElement.value = "";

      var html = ``;
      result.forEach((item) => {
        html += createCardItem(item);
      });
      resultElement.innerHTML = html;
    });
  }

  // error => return undefined
  // success => return array object
  function search(data, keyword) {
    if (
      typeof data !== "object" ||
      data === null ||
      data === "undefined" ||
      data.length === 0
    )
      return undefined;

    if (!keyword || keyword.trim().length <= 0) return undefined;

    // data.products = []; //
    if (data.products) {
      return data.products.filter((product) => {
        if (product.title) {
          return (
            product.title.trim().toLowerCase() === keyword.trim().toLowerCase()
          );
        }
        return false;
      });
    }
  }

  function createCardItem(item) {
    const OUT_OF_STOCK = "Hết hàng";
    var discountElement;
    var statusProduct;

    if (
      (item.variants[0].compare_at_price &&
        Number(item.variants[0].compare_at_price) !== 0) ||
      Number(item.variants[0].compare_at_price) !==
        Number(item.variants[0].price)
    ) {
      discountElement = `
      <span>${formatPrice(item.variants[0].compare_at_price)}</span>
      <span>
        -${discount(item.variants[0].price, item.variants[0].compare_at_price)}%
      </span>`;
    }

    if (Number(item.variants[0].inventory_quantity) > 0) {
      statusProduct =
        "Còn " + item.variants[0].inventory_quantity + " sản phẩm";
    } else {
      statusProduct = OUT_OF_STOCK;
    }
    return `
        <div class="container">
          <div class="card">
            <img src="${item.image.src}" alt="${item.title}">
            <h3>${item.title}</h3>
            <div class="card__price">
              <span>${formatPrice(item.variants[0].price)}</span>
              ${discountElement ? discountElement : ""}
            </div>
            <div>Trạng thái: <span class="${
              statusProduct === OUT_OF_STOCK ? "card--out-of-stock" : ""
            }">${statusProduct}</span></div>
          </div>
        </div>
    `;
  }

  function discount(priceNew, priceOld) {
    priceNew = Number(priceNew);
    priceOld = Number(priceOld);
    if (priceOld) return Math.floor(100 - priceNew / (priceOld * 0.01));
  }

  function formatPrice(price) {
    if (price.length > 0) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    }
  }
}
