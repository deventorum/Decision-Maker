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
        console.log("saving poll")
        console.log(info)
        dataHelpers.savePoll({
          title: req.body.title,
          email: req.body.email,
          description: req.body.description,
          owner_id: info.voter_id
        })
        .then(
        (info) => {
          console.log(info)
          const optionsArr = Object.values(req.body);
          for (let i = 3; i < optionsArr.length; i++) {
            dataHelpers.saveOptions({
              poll_id: info.poll_id,
              name: optionsArr[i]
            })
          }
          return info;
        }).then((info) => {
        res.redirect(`/${info.poll_id}/admin/${info.admin_token}`)
      })
      })

  });



  router.get(`/:poll_id/admin/:admin_token`, (req, res) => {
    console.log(req.params.poll_id, req.params.admin_token)
    res.render("admin");
  });


  router.get("/poll/:poll_id/:voter_token", (req, res) => {
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
        option : rate
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
