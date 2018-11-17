"use strict";

const express = require('express');
const router = express.Router();

var api_key = MAILGUN_APIKEY;
var domain = 'sandbox0ca95c4132c24acd937d7da152dcd16b.mailgun.org';
var mailgun = require('mailgun-js')({
  apiKey: api_key,
  domain: domain
});

// this is where we will use the functions from datahelpers based on which route requires them.
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


    router.post(`/:poll_id/admin/:admin_token/invite`, (req, res) => {
          // this is the INVITE BUTTON RECEIVER
          dataHelpers.saveVoter({
              email: req.body.email
            })
            .then()
          // more function to get creators email
          dataHelpers.getPollInfo(req.params.poll_id, (err, result) => {
            if (err) {
              //res.render('error');
              return
            } else {
              console.log(result);
              // this will  spit out the data as variables ??
            }
            // find the poll title 
            // and description 
            var data = {
              //  Insert the email creators email in between <>
              from: 'Excited User <me@samples.mailgun.org>',
              to: req.body.email,
              // Insert the poll title here 
              subject: 'Hello',
              // insert the poll description here 
              text: 'Testing some Mailgun awesomeness!'
            };

            mailgun.messages().send(data, function (err, body) {
              if (err) {
                console.log(err);
              }
              console.log(body);
            });
            res.status(200).json({
              status: 'Email Sent!'
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



          router.get("/poll/:poll_id", (req, res) => {
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
