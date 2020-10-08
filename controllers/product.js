const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs")

exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err)
        {
            return res.status(400).json({
                error:"Product not found"
            })
        }

        req.product = product;
        next();
    })

}


exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })

        }
            //destructure the fields
            const {name,description,price,category,stock} = fields;

            if(!name||!description||!price||!category||!stock)
            {
                return res.status(400).json({
                    error:"Please include all fields"
                })
            }
        let product = new Product(fields);

        //handle file here

        if(file.photo)
        {
            if(file.photo.size>3000000)
            {
                return res.status(400).json({
                    error:"File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

        }
        //save to DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Saving Tshirt in DB Failed"
                })

               
            }
            res.json(product)
        })

    });

}


exports.getProduct = (req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product)
}


exports.photo = (req,res,next)=>{
    
    if(req.product.photo.data)
    {
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.deleteProduct = (req,res)=>{
let product = req.product;
product.remove((err,deleteProduct)=>{
    if(err)
    {
return res.json(400).json({
    error:"Failed to delete the product"
})
    }
    res.json({
        message:"Deletion was successful",
        deleteProduct
    })
})
}

exports.updateProduct = (req,res)=>{

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })

        }
          
        let product = req.product;
        product = _.extend(product,fields);

        //handle file here

        if(file.photo)
        {
            if(file.photo.size>3000000)
            {
                return res.status(400).json({
                    error:"File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

        }
        //save to DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Updation of product DB Failed"
                })

               
            }
            res.json(product)
        })

    });


}


exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) :12
    let sortBy = req.query.sortBy? req.query.sortBy: "_id"
    Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy,"asc"]])
    .exec((err,products)=>{
        if(err){
            
            return res.status(400).json({
                error:"No Products Found"
            })
        }
        
        res.json(products)
    })
}


exports.updateStock = (req, res, next) => {
     req.body.order.products.forEach(prod => {

        Product.findById(prod._id)
        .select("-photo")
        .exec((err,product)=>{
            if(err)
            {
                return res.status(400).json({
                    error:"Product not found"
                })
            }
            
            var stock =   product.stock -1;
            var sold = product.sold+1;
            var updatedProduct = {
                ...prod,
                stock,
                sold
            }
           
            Product.findOneAndUpdate({_id: updatedProduct._id}, {updatedProduct}, {new: true}, (err, product) => {
                if (err) {
                    console.log("Failed to update the stock and sold");
                }
            
                console.log(product);
            });
        })

      next();
    });
  };
  


exports.getAllUniqueCategories = (req,res) =>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"No Category found"
            })
        }
        res.json(category)
    })
}