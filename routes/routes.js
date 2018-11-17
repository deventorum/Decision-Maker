"use strict";

const express = require('express');
const router = express.Router();

// this is where we will use the functions from dsatahelpers based on which route requires them.
module.exports = (dataHelpers) => {

  router.get("/", (req, res) => {
    res.render("index");
  });


  router.post("/polls", (req, res) => {

    dataHelpers.saveVoter({
        email: req.body.email
      })
      .then((info) => {
        dataHelpers.savePoll({
            title: req.body.title,
            email: req.body.email,
            description: req.body.description,
            owner_id: info.voter_id
          })
          .then(
            (info) => {
              const optionsArr = Object.values(req.body);
              for (let i = 3; i < optionsArr.length; i++) {
                dataHelpers.saveOptions({
                  poll_id: info.poll_id,
                  name: optionsArr[i]
                })
              }
              return info; // what does this info return ?
            }).then((info) => {
            res.redirect(`/${info.poll_id}/admin/${info.admin_token}`)
          })
      });
  })


  router.get(`/:poll_id/admin/:admin_token`, (req, res) => {
    dataHelpers.getAdminVoterToken(req.params.admin_token, (err, result) => {
      if (err) {
        //res.render('error');
        return
      } else {
        let templateVars = {
          voter_token: result[0].voter_token,
          poll_id: req.params.poll_id
        }
        res.render("admin", templateVars);
      }
    })
  });



  // add voters to the front of the request
  router.post("/:poll_id/admin/:admin_token", (req, res) => {
    dataHelpers.saveVoter({
        poll_id: req.params.poll_id,
        email: req.body.email
      })
      // add something to this?
      .then();
  });

  router.get("/poll/:poll_id/:voter_token", (req, res) => {
    dataHelpers.getOptions(req.params.poll_id, (err, result) => {
      if (err) {
        //res.render('error');
        return
      } else {
        let optionsArr = [];
        result.forEach(function (option) {
          optionsArr.push(option.name);
        })
        let templateVars = {
          voter_token: req.params.poll_id,
          poll_id: req.params.poll_id,
          options: optionsArr
        }
    })
  });

  router.post("/poll/:poll_id/:voter_token", (req, res) => {
    dataHelpers.getOptions(req.params.poll_id, (err, result) => {
      if (err) {
        //res.render('error');
        return
      } else {
        let optionsArr = [];
        result.forEach(function (option) {
          optionsArr.push(option.name);
        })
        return optionsArr;
      }
    })
    .then((optionsArr) => {
      let rates = req.body.rates;
      for (let i = 0; i < rates.length; i++)
        dataHelpers.saveVotes(optionsArr[i], rates[i])
    })
  });



  router.get("/:poll_id", (req, res) => {
    dataHelpers.getResults(req.params.poll_id,
      function (err, result) {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        } else {
          let templateVars = {
          voter_token: req.params.poll_id,
          poll_id: req.params.poll_id,
          options: optionsArr
        }
        res.render("result", templateVars);
        }
      }
    );
  });
  return router;
}
