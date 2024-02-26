const express=require('express');
const app=express();

app.use(express.json());

const products=['LAPTOP','LCD','MOBILE'];
app.get('/',function(req,res){
    res.send('heloo');
});
app.get('/api/products',function(req,res){
    res.send(products);
});
app.get('/api/products/:index',function(req,res){
    if(!products[req.params.index]){
        res.send("No product Found");
    }
    res.send(products[req.params.index]);
});
app.put('/api/products/:index',function(req,res){
    if(!products[req.params.index]){
        res.send("No product Found");
    }
    products[req.params.index]=req.body.name;
    res.send(products[req.params.index]);
});
app.post('/api/products',function(req,res){
    
    products.push(req.body.name);
    res.send(products);
});
app.delete('/api/products/:index',function(req,res){
    if(!products[req.params.index]){
        res.send("No product Found");
    }
    products.splice(req.params.index,1);
    res.send(products);
});

app.listen(3000);