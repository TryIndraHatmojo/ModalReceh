const { User, Stock, Transaction, Portfolio, Profile } = require("../models")
const { formatRupiah, formatDateLocal } = require("../helpers/helper")
const easyinvoice = require('easyinvoice');

class TransactionController {

    static async buy(req, res){
        try {
            const { StockId } = req.params
            const { username, balance, role} = req.session
            const stock = await Stock.findByPk(StockId)
            
            const {errors} = req.query
            res.render("transaction-buy", {username, balance, formatRupiah, stock, role, errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async buyPost(req, res){
        try {
            const { StockId } = req.params
            const { UserId } = req.session
            let { price, totalPrice, qty } = req.body
            const type = "Buy"

            const user = await User.reduceBalanceUser(UserId, Number(totalPrice))

            req.session.UserId = user.id
            req.session.role = user.role
            req.session.username = user.username
            req.session.balance = user.balance
            
            await Transaction.create({
                price, totalPrice, qty, UserId, StockId, type
            })

            await Portfolio.createOrUpdatePortfolio(StockId, UserId)

            res.redirect("/transaction/sell/"+StockId)
        } catch (error) {
            if(error.name=== "SequelizeValidationError"){
                const errors = error.errors.map(el=>el.message)

                const { StockId } = req.params
                res.redirect(`/transaction/buy/${StockId}?errors=`+errors)
            }else{
                res.send(error)
            }
        }
    }

    static async sell(req, res){
        try {
            const { StockId } = req.params
            const { username, balance, UserId} = req.session

            const stock = await Stock.findOne({
                include:{
                    model: Transaction,
                    where: {
                        UserId,
                        type: "Buy"
                    }
                },
                where:{
                    id: StockId
                },
                order: [[{ model: Transaction }, 'createdAt', 'DESC']]
            })

            res.render("transaction-sell" , {username, balance, formatRupiah, stock, formatDateLocal})

        } catch (error) {
            res.send(error)
        }
    }

    static async sellPost(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

    static async invoice(req, res){
        try {
            const { id } = req.params
            const { username, balance, UserId} = req.session

            const user = await User.findByPk(UserId,{
                include:{
                    model: Profile
                }
            })
            
            const transaction = await Transaction.findByPk(id,{
                include: {
                    model: Stock
                }
            })

            const data = await TransactionController.invoiceData(user, transaction)
            
            const result = await easyinvoice.createInvoice(data);
            const fileName = `Invoice ${transaction.Stock.code} Stock, ${formatDateLocal(transaction.createdAt)}.pdf`

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.send(Buffer.from(result.pdf, 'base64'));
            
        } catch (error) {
            res.send(error)
        }
    }

    static async invoiceData(user, transaction){
        try {
            
            let client = user.username
            if(user.Profile){
                client = user.Profile.name
            }

            // seharusnya bisa di getter
            const dateBuy = formatDateLocal(transaction.createdAt)
            const date = new Date(transaction.createdAt).toLocaleString('id-ID',{year:'numeric', month:'2-digit', day:'2-digit'}).split("/"); // dd-mm-yyyy
            const [day,month,year] = date
            const code = `${year}-${transaction.id}-${transaction.Stock.code}`

            return {
                // karena gk pakai env api key akan di hapus tgl 9-jun-2025
                apiKey: "Whlk6m70k6DyTXKdwPpxIoLcMQDhaCwf0kvcitgLmiehafUN7HpX0tWyxMbiIx2a",
                mode: "development",
                // "customize": {
                //     "template": "SGVsbG8gd29ybGQh" // Must be base64 encoded html. This example contains 'Hello World!' in base64
                // },
                sender: {
                    company: 'Modal Receh',
                    address: 'Keputih',
                    zip: '60111',
                    city: 'Surabaya',
                    country: 'Indonesia'
                },
                client: {
                    company: "Client Name: "+client,
                },
                information: {
                    number: code,
                    date: dateBuy,
                },
                products: [
                    {
                        quantity: (transaction.qty*100).toString(),
                        description: `${transaction.Stock.code} Stocks`,
                        tax: 0,
                        price: transaction.price
                    },
                ],
                'bottom-notice': '',
                settings: {
                    currency: 'IDR', // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                    "locale": "id-ID", // Defaults to en-US, used for number formatting (see docs)
                    // "margin-top": 25, // Default to 25
                    // "margin-right": 25, // Default to 25
                    // "margin-left": 25, // Default to 25
                    // "margin-bottom": 25, // Default to 25
                    // "format": "Letter", // Defaults to A4,
                    // "height": "1000px", // allowed units: mm, cm, in, px
                        // "width": "500px", // allowed units: mm, cm, in, px
                        // "orientation": "landscape", // portrait or landscape, defaults to portrait
                },
                // Used for translating the headers to your preferred language
                // Defaults to English. Below example is translated to Dutch
                "translate": {
                //     "invoice": "FACTUUR",
                //     "number": "Nummer",
                //     "date": "Datum",
                //     "due-date": "Verloopdatum",
                //     "subtotal": "Subtotaal",
                    "products": "Saham",
                    "quantity": "Jumlah Saham (Lembar)",
                    "price": "Harga",
                //     "product-total": "Totaal",
                //     "total": "Totaal"
                //		 "vat": "btw"
                },
            };
        } catch (error) {
            throw error
        }
    }

}

module.exports = TransactionController