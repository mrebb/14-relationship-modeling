'use strict';
import express from 'express';
const router = express.Router();
import modelFinder from '../middleware/models.js';
router.param('model', modelFinder);

router.get('/api/v1/:model/:id', (req,res) => {
  if (req.params.id!==null) {
    req.model.findById(req.params.id)
      .populate('skill')
      .exec()
      .then( data => res.send(data))
      .catch( err => {
        res.status(404);
        res.send(err); 
      });
  }
  else if (req.params.id === undefined) {
    console.log('id', req.params);
    let error = { error:'Bad Request' };
    res.statusCode = 400;
    res.statusMessage = 'Bad Request';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error));
    res.end();
  }
});
router.get('/api/v1/:model', (req,res) => {
  req.model.find()
    .then( data => res.send(data))
    .catch( err => {
      res.status(404);
      res.send(err); 
    }); 
});
router.delete('/api/v1/:model/:id', (req,res) => {
  if ( req.params.id ) {
    req.model.findByIdAndDelete(req.params.id)
      .then( success => {
        let data = {id:req.params.id,deleted:success};
        res.send(data);
      })
      .catch(err => {
        res.status(404);
        res.send(err); 
      });
  }
  else {
    res.status(400);
    res.send('Bad Request: Request body not received');
  }
});
router.delete('/api/v1/:model/', (req,res) => {
  let error = { error:'Bad Request' };
  res.statusCode = 400;
  res.statusMessage = 'Bad Request';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
  
});
router.post('/api/v1/:model/', (req,res) => {
  
  if(Object.keys(req.body).length === 0){
    res.status(400);
    res.send('Bad Request: Request body not received');
  }
  else{
    let record = new req.model(req.body);
    record.save()
      .then(data => res.send(data))
      .catch(err=>console.log(err));
  }
});
router.put('/api/v1/:model/:id', (req,res) => {
  if(Object.keys(req.body).length === 0){
    res.status(400);
    res.send('Bad Request: Request body not received');
  }
  else{
    req.model.findOneAndUpdate({_id:req.params.id},{$set:req.body},{new: true})
      .then(data => res.send(data))
      .catch(err => {
        res.status(404);
        res.send(err);});
  }
});

export default router;