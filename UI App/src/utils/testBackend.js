const app =express ()()
const path = require('path')
const cors = require('cors')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const razorpay = new Razorpay({
    key_id: 'rzp_test_vwFYRANZsk49Qu',
    key_secret: 'A6ILNz2p3csCO0HRXVVSgsdy',

});
app.use(cors())
app.get('/logo.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'logo.svg'))
}
)
 app.post('/razorpay', async (req, res) => {
    const payment_capture = 1
    const amount = 499
    const currency = 'INR'
    const options = {
        amount: amount * 100,
        currency : currency,
        receipt: shortid.generate(),
        payment_capture
    }
    try {
        const response = await razorpay.orders.create(options)
        console.log(response)
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })
    } catch (error) {
        console.log(error)
    }
 
})

app.listen(5000, () => {
    console.log("listening on port 5000")
}
)
