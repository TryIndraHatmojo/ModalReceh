function formatRupiah (input) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(input);
}
function formatDateLocal(date){
    return new Date(date).toLocaleString('id-ID',{year:'numeric', month:'2-digit', day:'2-digit',hour:"2-digit",minute:"2-digit"}).replace(".",":"); // dd-mm-yyyy
}

function randomStockPrice(price){
    let profitLossPercent = Math.random() * (2 - (-2) ) + (-2)
    return parseInt(price + (price*profitLossPercent/100))
}

module.exports = { formatRupiah, formatDateLocal, randomStockPrice }