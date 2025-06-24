const products = [];
let totalAmount = 0;

const productCategorySelect = document.getElementById("productCategory");
const productNameSelect = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productBrandSelect = document.getElementById("productBrand");
const productModelSelect = document.getElementById("productModel");
const productSeriesSelect = document.getElementById("productSeries");
const productColorSelect = document.getElementById("productColor");
const productStorageSelect = document.getElementById("productStorage")
const productQuantityInput = document.getElementById("productQuantity");
const addProductBtn = document.getElementById("addProductBtn");
const billTableBody = document.querySelector("#billTable tbody");
const totalAmountElement = document.getElementById("totalAmount");
const generateBillBtn = document.getElementById("generateBillBtn");
const printBillBtn = document.getElementById("printBillBtn");
const savePdfBtn = document.getElementById("savePdfBtn");
const resetBillBtn = document.getElementById("resetBillBtn");
const customerNameInput = document.getElementById("customerName");
const customerPhoneInput = document.getElementById("customerPhone");
const customerEmailInput = document.getElementById("customerEmail");
const billDateElement = document.getElementById("billDate");
const billTimeElement = document.getElementById("billTime");
const loginForm = document.getElementById('loginForm');

//authentication
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if(user === 'admin' && pass === 'admin123') {
      localStorage.setItem('authenticated', true);
      window.location.href = 'index.html';
    } else {
      alert('Invalid credentials');
    }
  });

// Predefined products
const predefinedProducts = {
  phones: [
    {
      brand: "Apple",
      series: [
        {
          name: "iPhone 15",
          colors: ["Black", "White", "Blue"],
          basePrice: 999,
        },
        {
          name: "iPhone 15 Pro",
          colors: ["Graphite", "Silver", "Gold"],
          basePrice: 1199,
        },
      ],
    },
    {
      brand: "Samsung",
      series: [
        {
          name: "Galaxy S23",
          colors: ["Phantom Black", "Cotton Flower", "Mystic Green"],
          basePrice: 899,
        },
        {
          name: "Galaxy S23 Ultra",
          colors: ["Phantom Black", "Green", "Lavender"],
          basePrice: 1199,
        },
      ],
    },
    // Add other brands and series...
  ],
  airpods: [
    {
      brand: "Apple",
      series: [
        {
          name: "Airpods Pro",
          colors: ["White"],
          basePrice: 249,
        },
        {
          name: "Airpods Max",
          colors: ["Space Gray", "Silver", "Sky Blue"],
          basePrice: 549,
        },
      ],
    },
    {
      brand: "OnePlus",
      series: [
        {
          name: "OnePlus Buds",
          colors: ["White", "Black"],
          basePrice: 199,
        },
      ],
    },
  ],
  watches: [
    {
      brand: "Apple",
      series: [
        {
          name: "Apple Watch Series 9",
          colors: ["Midnight", "Starlight"],
          basePrice: 399,
        },
      ],
    },
    {
      brand: "Samsung",
      series: [
        {
          name: "Galaxy Watch 6",
          colors: ["Graphite", "Silver"],
          basePrice: 299,
        },
      ],
    },
  ],
  services: [
    { name: "Screen Replacement", basePrice: 99 },
    { name: "Battery Replacement", basePrice: 49 },
  ],
};
// Populate Brand Dropdown
productCategorySelect.addEventListener("change", () => {
  const category = productCategorySelect.value;
  productBrandSelect.innerHTML = '<option value="">Select Brand</option>';

  if (category && predefinedProducts[category]) {
    predefinedProducts[category].forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand.brand;
      option.textContent = brand.brand;
      productBrandSelect.appendChild(option);
    });
  }
});

// Populate Series Dropdown
productBrandSelect.addEventListener("change", () => {
  const selectedBrand = productBrandSelect.value;
  productSeriesSelect.innerHTML = '<option value="">Select Series</option>';

  if (selectedBrand) {
    const category = productCategorySelect.value;
    const brand = predefinedProducts[category].find(
      (b) => b.brand === selectedBrand
    );

    if (brand && brand.series) {
      brand.series.forEach((series) => {
        const option = document.createElement("option");
        option.value = series.name;
        option.textContent = series.name;
        productSeriesSelect.appendChild(option);
      });
    }
  }
});

// Populate Colors Dropdown
productSeriesSelect.addEventListener("change", () => {
  const selectedSeries = productSeriesSelect.value;
  productColorSelect.innerHTML = '<option value="">Select Color</option>';

  if (selectedSeries) {
    const category = productCategorySelect.value;
    const brand = predefinedProducts[category].find(
      (b) => b.brand === productBrandSelect.value
    );
    const series = brand.series.find((s) => s.name === selectedSeries);

    if (series && series.colors) {
      // Populate colors
      series.colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        productColorSelect.appendChild(option);
      });
    }
  }
});

// Add product to the bill
addProductBtn.addEventListener("click", () => {
  const brand = productBrandSelect.value;
  const series = productSeriesSelect.value;
  const color = productColorSelect.value;
  const quantity = parseInt(productQuantityInput.value);
  const price = parseFloat(productPriceInput.value); // Manual price entry

  if (brand && series && color && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price > 0) {
    const category = productCategorySelect.value;
    const selectedBrand = predefinedProducts[category].find(
      (b) => b.brand === brand
    );
    const selectedSeries = selectedBrand.series.find((s) => s.name === series);

    const total = price * quantity;
    products.push({ brand, series, color, quantity, price, total });

    // Add row to the table
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${brand} ${series} (${color})</td>
      <td>$${price.toFixed(2)}</td>
      <td>${quantity}</td>
      <td>$${total.toFixed(2)}</td>
      <td><button onclick="removeProduct(${products.length - 1})">Remove</button></td>
    `;
    billTableBody.appendChild(row);

    // Update total amount
    totalAmount += total;
    totalAmountElement.textContent = totalAmount.toFixed(2);

    // Clear inputs
    productBrandSelect.value = "";
    productSeriesSelect.innerHTML = '<option value="">Select Series</option>';
    productColorSelect.innerHTML = '<option value="">Select Color</option>';
    productQuantityInput.value = "";
    productPriceInput.value = ""; // Clear manual price input
  } else {
    alert("Please enter valid product details.");
  }
});
// Set current date and time
function updateDateTime() {
  const now = new Date();
  billDateElement.textContent = now.toLocaleDateString();
  billTimeElement.textContent = now.toLocaleTimeString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Populate products based on category
productCategorySelect.addEventListener("change", () => {
  const category = productCategorySelect.value;
  productNameSelect.innerHTML = '<option value="">Select Product</option>';

  if (category && predefinedProducts[category]) {
    predefinedProducts[category].forEach((product) => {
      const option = document.createElement("option");
      option.value = product.name;
      option.textContent = `${product.name} - $${product.price}`;
      productNameSelect.appendChild(option);
    });
  }
});

// Add product to the bill
addProductBtn.addEventListener("click", () => {
  const name = productNameSelect.value.trim();
  const price = parseFloat(productPriceInput.value);
  const quantity = parseInt(productQuantityInput.value);

  if (name && !isNaN(price) && !isNaN(quantity) && price > 0 && quantity > 0) {
    const total = price * quantity;
    products.push({ name, price, quantity, total });

    // Add row to the table
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${price.toFixed(2)}</td>
      <td>${quantity}</td>
      <td>${total.toFixed(2)}</td>
      <td><button onclick="removeProduct(${products.length - 1})">Remove</button></td>
    `;
    billTableBody.appendChild(row);

    // Update total amount
    totalAmount += total;
    totalAmountElement.textContent = totalAmount.toFixed(2);

    // Clear inputs
    productNameSelect.value = "";
    productPriceInput.value = "";
    productQuantityInput.value = "";
  } else {
    alert("Please enter valid product details.");
  }
});

// Remove product from the bill
function removeProduct(index) {
  const product = products[index];
  totalAmount -= product.total;
  totalAmountElement.textContent = totalAmount.toFixed(2);
  products.splice(index, 1);
  billTableBody.innerHTML = "";
  products.forEach((product, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>${product.total.toFixed(2)}</td>
      <td><button onclick="removeProduct(${i})">Remove</button></td>
    `;
    billTableBody.appendChild(row);
  });
}

// Generate bill
generateBillBtn.addEventListener("click", () => {
    if (!customerNameInput.value || !customerPhoneInput.value || products.length === 0) {
      alert("Incomplete data");
      return;
    }
    db.collection("bills").add({
      customerName: customerNameInput.value,
      customerPhone: customerPhoneInput.value,
      customerEmail: customerEmailInput.value,
      products,
      totalAmount,
      date: new Date().toISOString()
    }).then(() => alert("Bill saved to cloud"));
  });

// Print bill
printBillBtn.addEventListener("click", () => {
  if (products.length === 0) {
    alert("Please add products to print the bill.");
    return;
  }
  window.print();
});
//save as pdf
savePdfBtn.addEventListener("click", () => {
  if (products.length === 0) {
    alert("Please add products to save the bill as PDF.");
    return;
  }

  try {
    // Create a new PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4 size

    // Add title
    doc.setFontSize(22);
    doc.text("MaloMobiles - Bill Receipt", 50, 20);

    // Add customer details
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerNameInput.value}`, 10, 50);
    doc.text(`Phone Number: ${customerPhoneInput.value}`, 10, 60);
    doc.text(`Email: ${customerEmailInput.value || "N/A"}`, 10, 70);

    // Add bill details
    doc.setFontSize(14);
    doc.text("Bill Details", 10, 90);

    // Add table headers
    doc.setFontSize(12);
    doc.text("Product Name", 10, 100);
    doc.text("Price", 70, 100);
    doc.text("Quantity", 120, 100);
    doc.text("Total", 160, 100);

    // Add product rows
    let y = 110; // Starting Y position for product rows
    products.forEach((product) => {
      doc.text(`${product.brand} ${product.series} (${product.color})`, 10, y);
      doc.text(`$${product.price.toFixed(2)}`, 70, y);
      doc.text(product.quantity.toString(), 120, y);
      doc.text(`$${product.total.toFixed(2)}`, 160, y);
      y += 10; // Move to the next row
    });

    // Add total amount
    doc.setFontSize(14);
    doc.text(`Total Amount:{totalAmount.toFixed(2)}`, 10, y + 10);

    // Add GST (CGST and SGST)
    const gstRate = 0.18; // 18% GST
    const gstAmount = totalAmount * gstRate;
    doc.text(`CGST (9%): $${(gstAmount / 2).toFixed(2)}`, 10, y + 20);
    doc.text(`SGST (9%): $${(gstAmount / 2).toFixed(2)}`, 10, y + 30);
    doc.text(`Grand Total: $${(totalAmount + gstAmount).toFixed(2)}`, 10, y + 40);

    // Add date and time
    const now = new Date();
    doc.setFontSize(10);
    doc.text(`Date: ${now.toLocaleDateString()}`, 10, y + 50);
    doc.text(`Time: ${now.toLocaleTimeString()}`, 10, y + 55);

    // Add shop details in footer
    doc.setFontSize(10);
    doc.text("MaloMobiles Shop", 10, 280);
    doc.text("No:321, N Block, Anna Nagar", 10, 285);
    doc.text("Phone: 9840716036", 10, 290);
    doc.text("Thank you for your purchase!", 10, 295);

    // Save the PDF
    doc.save("MaloMobiles_Bill.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please check the console for details.");
  }
});

// Reset bill
resetBillBtn.addEventListener("click", () => {
  products.length = 0;
  totalAmount = 0;
  totalAmountElement.textContent = "0";
  billTableBody.innerHTML = "";
  customerNameInput.value = "";
  customerPhoneInput.value = "";
  customerEmailInput.value = "";
});
/* Toggle Button */
<button id="toggleTheme">Dark Mode</button>
  document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
 //Store History Fetch from Firebase and show in history.html
 db.collection("bills").orderBy("date", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log("Bill:", data);
    });
  });
