const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "n53d6q699rh5t4pw",
  publicKey: "shfvhscswt96xz4z",
  privateKey: "993338c876c1f721930b78efc63613e6"
});

exports.getToken = (req,res) =>{
    gateway.clientToken.generate({
      }, (err, response) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response)
        }
      });
}


exports.processPayment = (req,res) =>{

    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount 

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              res.status(500).json(err)
          }
          else{
              res.json(result)
          }
      }); 
}