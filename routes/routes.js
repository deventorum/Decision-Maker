"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (dataHelpers) => {

  router.get("/", (req, res) => {
    res.send("hello");
  });

  return router;
}
