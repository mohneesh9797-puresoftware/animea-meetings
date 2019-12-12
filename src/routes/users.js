const express = require('express');
const router = express.Router();

router.get('/:userId/meetings', (req, res, next) => {
    res.status(200).json({
        message: 'Users meetings were fetched',
        id: req.params.userId
    });
});

module.exports = router;