"use strict";

const express = require('express');
const router = express.Router();

// this is where we will use the functions from dsatahelpers based on which route requires them.
module.exports = (dataHelpers) => {

  router.get("/", (req, res) => {
    res.send("hello");
  });

  router.get(`/:poll_id/admin/:admin_token`, (req, res) => {
    console.log(req.params.poll_id, req.params.admin_token)
    res.send("hello");
  });

  router.post("/polls", (req, res) => {
    // console.log(req.body);
    dataHelpers.savePoll({
        title: req.body.title,
        email: req.body.email,
        description: req.body.description
      })
      .then(
        (info) => {
          // console.log(info)
          const optionsArr = Object.values(req.body);
          for (let i = 3; i < optionsArr.length; i++) {
            dataHelpers.saveOptions({
              poll_id: info.poll_id,
              name: optionsArr[i]
            })
          }
          res.redirect(`/${info.poll_id}/admin/${info.admin_token}`);
        })


  })


  return router;
}
