"use strict";

const express = require('express');
const router = express.Router();

// this is where we will use the functions from dsatahelpers based on which route requires them.
module.exports = (dataHelpers) => {

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get(`/:poll_id/admin/:admin_token`, (req, res) => {
    console.log(req.params.poll_id, req.params.admin_token)
    res.render("admin");
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
          console.log(optionsArr);
          console.log(info.poll_id);
          for (let i = 3; i < optionsArr.length; i++) {
            console.log(optionsArr[i]);
            dataHelpers.saveOptions({
              poll_id: info.poll_id,
              name: optionsArr[i]
            })
          }
          res.redirect(`/${info.poll_id}/admin/${info.admin_token}`);
        })


  })
const router  = express.Router();

module.exports = (dataHelpers) => {

  router.get("/poll/:poll_id/:voter_token", (req, res) => {
    dataHelpers.getOptions(
      function (err, result)
      {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(result);
        }
      }
    );
  });


  router.get("/poll/:poll_id", (req, res) => {
    dataHelpers.getResults(
      function (err, result)
      {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(result);
        }
      }
    );
  });


// admin.ejs   /poll/:polld_id/admin/admin_token
// index.ejs   /poll
// result.ejs  /poll/:poll_id
// vote.ejs    /poll/:poll_id/voter_token



  return router;
}
