"use strict";

const express = require('express');
const router = express.Router();

var api_key = process.env.MAILGUN_APIKEY;
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

  // This saves the poll, creates a voter for the ADMIN, and emails the ADMIN.
  router.post("/polls", (req, res) => {

    dataHelpers.saveVoter({
        email: req.body.email
      })
      .then((info) => {
        // this allows our email to access the voter token for the ADMIN
        let voterToken = info.voter_token
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
              return info;
            }).then((info) => {

            dataHelpers.getPollInfo(info.poll_id, (err, result) => {
              console.log(result);
              if (err) {
                return console.log('this is the err from routes.getpollInfo: ', err);
              } else {
                let creatorsEmail = result[0].email;
                let pollTitle = result[0].title;
                let pollDescription = result[0].description;

                var data = {
                  from: creatorsEmail,
                  to: creatorsEmail,
                  subject: pollTitle,
                  text: ` You've created the '${pollTitle}' poll. \n \n DESCRIPTION: ` + pollDescription + ` \n \n VOTE ON YOUR POLL: http://localhost:8080/poll/${info.poll_id}/${voterToken} \n \n ADMIN PAGE: http://localhost:8080/${info.poll_id}/admin/${info.admin_token}`
                };
                mailgun.messages().send(data, function (err, body) {
                  if (err) {
                    console.log('this is the err from Mailgun: ', err);
                  }
                  res.redirect(`/${info.poll_id}/admin/${info.admin_token}`)
                });
              }
            })
          })
      });
  })

  // this is the INVITE BUTTON RECEIVER
  router.post(`/:poll_id/admin/:admin_token/invite`, (req, res) => {

    dataHelpers.saveVoter({
        email: req.body.email
      })

      .then((info) => { // info
        // console.log("this is INFO which should be coming from saveVoter (looking for the voter_token ): ", info);
        dataHelpers.getPollInfo(req.params.poll_id, (err, result) => {
          if (err) {
            return console.log('this is the err from routes.getpollInfo: ', err);
          } else {
            let creatorsEmail = result[0].email;
            let pollTitle = result[0].title;
            let pollDescription = result[0].description;
            //console.log('INFO I NEED FOR EMAIL', creatorsEmail, pollTitle, pollDescription);
            var data = {
              from: creatorsEmail,
              to: req.body.email,
              subject: pollTitle,
              text: ` You've been invited to ${creatorsEmail}'s '${pollTitle}' poll. \n \n DESCRIPTION: ` + pollDescription + ` \n \n PLEASE CLICK THIS LINK TO ACCESS THE POLL: ` + `http://localhost:8080/poll/${req.params.poll_id}/${info.voter_token}`
            };
            // console.log('this is my data variable: ', data);
            mailgun.messages().send(data, function (err, body) {
              if (err) {
                console.log('this is the err from Mailgun: ', err);
              }
              // console.log(" this is the console.log body from mailgun: ", body);
            });
            res.status(200).json({
              status: 'Email Sent!'
            })
          }
        })
      });
  })

  router.get(`/:poll_id/admin/:admin_token`, (req, res) => {
    dataHelpers.getPollInfo(req.params.poll_id, (err, result) => {
      if (err) {
        return console.log('this is the err from routes.getpollInfo: ', err);
      } else {
        let poll_title = result[0].title;
        dataHelpers.getAdminVoterToken(req.params.admin_token, (err, result) => {
          if (err) {
            //res.render('error');
            return
          } else {
            let templateVars = {
              voter_token: result[0].voter_token,
              poll_id: req.params.poll_id,
              title: poll_title
            }
            res.render("admin", templateVars);
          }
        })
      }
    })
  });

  router.get("/poll/:poll_id/:voter_token", (req, res) => {
    dataHelpers.getPollInfo(req.params.poll_id, (err, result) => {
      if (err) {
        return console.log('this is the err from routes.getpollInfo: ', err);
      } else {
        let poll_title = result[0].title;
        dataHelpers.hasVoted(req.params.voter_token, (err, result) => {
          if (err) {
            return
          } else{
            if (result[0].has_voted === false) {
            dataHelpers.getOptions(req.params.poll_id, (err, result) => {
              let optionsArr = [];
              if (err) {
                //res.render('error');
                return
              } else {
                result.forEach(function (option) {
                  optionsArr.push(option.name);
                })
                let templateVars = {
                  voter_token: req.params.poll_id,
                  poll_id: req.params.poll_id,
                  options: optionsArr,
                  title: poll_title
                }
                res.render("vote", templateVars);
              }
            })
            } else {
              res.redirect(`/poll/${req.params.poll_id}`);
            }
          }
        })
      }
    })
  });

  router.post("/poll/:poll_id/:voter_token/vote", (req, res) => {
    dataHelpers.getOptions(req.params.poll_id, (err, result) => {

        let optionsArr = [];
        if (err) {
          return
        } else {
          result.forEach(function (option) {
            optionsArr.push(option.name);
          })
          return optionsArr;
        }
      })
      .then((optionsArr) => {
        let rates = req.body.rates;
        for (let i = 0; i < rates.length; i++) {
          console.log(optionsArr[i].name, rates[i]);
          dataHelpers.saveVotes(optionsArr[i].name, rates[i], req.params.poll_id)
        }
        res.redirect(`/poll/${req.params.poll_id}`)
      })
  });

  router.get("/poll/:poll_id", (req, res) => {
    dataHelpers.getPollInfo(req.params.poll_id, (err, result) => {
      if (err) {
        return console.log('this is the err from routes.getpollInfo: ', err);
      } else {
        let poll_title = result[0].title;
        //console.log("help", poll_title);
        dataHelpers.getResults(req.params.poll_id, (err, result) => {
          let optionsArr = [];
          if (err) {
            res.status(500).json({
            error: err.message
            });
          } else {
            result.forEach(function (option_rate) {
              optionsArr.push({
                name: option_rate.name,
                result: option_rate.sum
              });
            })
            let templateVars = {
            options: optionsArr,
            title: poll_title
            }
          //console.log("for d", templateVars);
          res.render("result", templateVars);
          }
        })
      }
    })
  });

  return router;
}
