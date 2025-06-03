function hitungTotalPrice() {
    let price = document.getElementsByName("price")[0].value
    let qty = document.getElementById("qty").value
    console.log(price);
    
    let totalprice = Number(price) * 100 * Number(qty)
    console.log(totalprice);
    document.getElementById("totalPrice").value = formatRupiah(totalprice)
    document.getElementsByName("totalPrice")[0].value = totalprice
}
