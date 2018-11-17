"use strict";

const express = require('express');
const router = express.Router();

// this is where we will use the functions from dsatahelpers based on which route requires them.
module.exports = (dataHelpers) => {

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get(`/:poll_id/admin/:admin_token`, (req, res) => {

    dataHelpers.getAdminVoterToken(req.params.admin_token, (err, result) => {
      if (err) {
        //res.render('error');
        return
      } else {
        let templateVars = {
          voter_token: result,
          poll_id: req.params.poll_id
        }
        console.log(templateVars)
        res.render("admin", templateVars);
      }
    })
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

  // add polls to the front of the request
  router.post("/:poll_id/admin/:admin_token", (req, res) => {
    dataHelpers.saveVoter({
        poll_id: req.params.poll_id,
        email: req.body.email

      })
      // add something to this?
      .then();
  });

  router.get("/poll/:poll_id/:voter_token", (req, res) => {
    dataHelpers.getOptions(
      function (err, result) {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        } else {
          res.json(result);
        }
      }
    );
  });

  router.get("/poll/:poll_id/:voter_token", (req, res) => {
    dataHelpers.getOptions(req.params.admin_token, (err, result) => {
      if (err) {
        //res.render('error');
        return
      } else {
        let templateVars = {
          voter_token: result,
          poll_id: req.params.poll_id
        }
        console.log(templateVars)
        res.render("vote", templateVars);
      }
    })
    res.render("vote");
    //   function (err, result)
    //   {
    //     if (err) {
    //       res.status(500).json({ error: err.message });
    //     } else {
    //       res.json(result);
    //     }
    //   }
    // );
  });

  router.post("/poll/:poll_id/:voter_token", (req, res) => {
    dataHelpers.saveVotes({
      option: rate
    })

    //   function (err, result)
    //   {
    //     if (err) {
    //       res.status(500).json({ error: err.message });
    //     } else {
    //       res.json(result);
    //     }
    //   }
    // );
  });



  router.get("/:poll_id", (req, res) => {
    dataHelpers.getResults(
      function (err, result) {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        } else {
          res.json(result);
        }
      }
    );
  });

  return router;
}
