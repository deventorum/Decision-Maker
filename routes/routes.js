"use strict";

const express = require('express');
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


// // this is where we will use the functions from dsatahelpers based on which route requires them.
// //
// module.exports = (dataHelpers) => {

//   router.get("/", (req, res) => {
//     res.send("hello");
//   });

//   router.post("/polls", (req, res) => {
//     dataHelpers.savePoll({
//         title: req.body.title,
//         email: req.body.email,
//         description: req.body.description,
//         options: req.body.options
//       })
//       .then((id) => {
//         res.redirect('/polls/${id}');
//       })
//   })

//   return router;
// }
