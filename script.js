const storageKey = "productInventory";

// ดึงข้อมูลสินค้า
function getProducts() {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
}

// บันทึกข้อมูลสินค้า
function saveProducts(products) {
    localStorage.setItem(storageKey, JSON.stringify(products));
}

// สร้าง ID ไม่ซ้ำ
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// แสดงข้อมูลสินค้าใหม่พร้อมรหัส
function displayProductIdAndName(productId, productName) {
    document.getElementById('productIdDisplay').textContent = `รหัสสินค้า: ${productId} - ชื่อสินค้า: ${productName}`;
}

// เพิ่มสินค้า
function addProduct(productData) {
    let products = getProducts();
    productData.id = generateUniqueId();
    productData.totalSales = 0;
    products.push(productData);
    saveProducts(products);
    displayProductIdAndName(productData.id, productData.name);
    displayAllProducts();
    generateSalesReport();
}

// อัปเดตสต็อกสินค้า
function updateStock(productId, quantity) {
    let products = getProducts();
    let product = products.find(p => p.id === productId);
    if (product) {
        product.inStock += quantity;
        saveProducts(products);
        alert(`เพิ่มจำนวนสินค้า ${product.name} จำนวน ${quantity} ชิ้น`);
    } else {
        alert("ไม่พบสินค้าที่ต้องการเพิ่มจำนวน");
    }
    displayAllProducts();
}

// บันทึกการขายสินค้า
function recordSale(productId, quantity) {
    let products = getProducts();
    let product = products.find(p => p.id === productId);
    if (product && product.inStock >= quantity) {
        product.inStock -= quantity;
        product.totalSales += quantity;
        saveProducts(products);
        alert(`บันทึกการขาย ${quantity} ชิ้น ของสินค้า ${product.name}`);
        displayAllProducts();
    } else {
        alert("จำนวนสินค้าคงเหลือไม่พอสำหรับการขาย");
    }
    generateSalesReport();
}

// ตรวจสอบสินค้าที่ใกล้หมด
function checkLowStock(minStock = 5) {
    let products = getProducts().filter(p => p.inStock < minStock);
    let lowStockDisplay = document.getElementById('lowStockDisplay');
    lowStockDisplay.innerHTML = products.length ? `<ul>${products.map(p => `<li>${p.name} - จำนวนคงเหลือ: ${p.inStock} ชิ้น</li>`).join('')}</ul>` : "ไม่มีสินค้าคงเหลือน้อย";
}

// แสดงสินค้าขายดี
function generateSalesReport() {
    let products = getProducts().sort((a, b) => b.totalSales - a.totalSales);
    document.getElementById('salesReportDisplay').innerHTML = `<ul>${products.slice(0, 5).map(p => `<li>${p.name} - ยอดขาย: ${p.totalSales} ชิ้น</li>`).join('')}</ul>`;
}

// แสดงรายการสินค้าทั้งหมด
function displayAllProducts() {
    let products = getProducts();
    let productListDisplay = document.getElementById('productListDisplay');
    if (products.length) {
        productListDisplay.innerHTML = `<table><thead><tr><th>รหัสสินค้า</th><th>ชื่อสินค้า</th><th>ราคา</th><th>จำนวนคงเหลือ</th><th>ยอดขาย</th></tr></thead><tbody>${products.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>฿${p.price}</td><td>${p.inStock} ชิ้น</td><td>${p.totalSales} ชิ้น</td></tr>`).join('')}</tbody></table>`;
    } else {
        productListDisplay.innerHTML = '<div class="no-data">ยังไม่มีการบันทึกสินค้า</div>';
    }
}

// ตั้งค่าฟอร์ม
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let name = document.getElementById('name').value.trim();
    let price = parseFloat(document.getElementById('price').value);
    let inStock = parseInt(document.getElementById('inStock').value);
    let category = document.getElementById('category').value;
    if (name && price > 0 && inStock >= 0) {
        addProduct({ name, price, inStock, category });
        addProductForm.reset();
    } else {
        alert("กรุณากรอกข้อมูลให้ถูกต้อง");
    }
});

const updateStockForm = document.getElementById('updateStockForm');
updateStockForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let productId = document.getElementById('productIdToUpdate').value.trim();
    let quantity = parseInt(document.getElementById('quantityToAdd').value);
    if (productId && quantity > 0) {
        updateStock(productId, quantity);
        updateStockForm.reset();
    } else {
        alert("กรุณากรอกข้อมูลให้ถูกต้อง");
    }
});

const saleForm = document.getElementById('saleForm');
saleForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let productId = document.getElementById('productIdToSell').value.trim();
    let quantity = parseInt(document.getElementById('quantityToSell').value);
    if (productId && quantity > 0) {
        recordSale(productId, quantity);
        saleForm.reset();
    } else {
        alert("กรุณากรอกข้อมูลให้ถูกต้อง");
    }
});

const checkLowStockForm = document.getElementById('checkLowStockForm');
checkLowStockForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let minStock = parseInt(document.getElementById('minStockToCheck').value);
    if (minStock >= 0) {
        checkLowStock(minStock);
        checkLowStockForm.reset();
    } else {
        alert("กรุณากรอกค่าที่ถูกต้อง");
    }
});

// โหลดข้อมูลเมื่อหน้าเว็บถูกโหลด
window.onload = function() {
    displayAllProducts();
    generateSalesReport();
};
