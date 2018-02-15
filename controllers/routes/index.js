var express         = require("express"),
    router          = express.Router();

// THIS IS TO SHORT CIRCUIT AN ANNOYING BUS WHERE EXPRESS TRIES TO REDIRECT TO /favicon/ico
router.get('/favicon.ico', function(req, res) {
    res.status(204);
});


module.exports = router; 

