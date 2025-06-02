function formatRupiah (input) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(input);
}
module.exports = { formatRupiah }