var express = require('express');
var router = express.Router();

var sentimentsController = require('../controllers/sentiments');

router.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "GET", "POST", "DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', sentimentsController.index);
router.get('/:id', sentimentsController.show);
router.post('/', sentimentsController.callAylien);
router.delete('/:id', sentimentsController.deleteOne);

module.exports = router;
