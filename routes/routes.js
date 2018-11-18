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

  router.get("/poll/:poll_id/:voter_token", (req, res) => {

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
          options: optionsArr
        }
        console.log(optionsArr);
        res.render('vote', templateVars);
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
      console.log("test" , rates);
      for (let i = 0; i < rates.length; i++){
        dataHelpers.saveVotes(optionsArr[i].name, rates[i], req.params.poll_id)
      }
    })
    .then(() => {res.redirect(`/poll/${req.params.poll_id}`)})
  });

//   router.get("/poll/:poll_id", (req, res) => {
//     dataHelpers.getResults(


  
  // CREATED TO TEST RESULT PAGE (DENIS) START
  
  /* router.get("/poll/:poll_id", (req, res) => {
    let templateVars = {
      options:[{
        name: 'OMG!!!!!',
        result: 25
      },
      {
        name: 'Oh Poll Daddy!!!',
        result: 23
      },
      {
        name: 'Oh terrific!',
        result: 12
      },
      {
        name: 'Poll Daddy?! What kind of name is that???',
        result: 32
      }]
    }
    res.render("result", templateVars);
  }); */

  router.get("/poll/:poll_id", (req, res) => {
    dataHelpers.getResults(req.params.poll_id,
      function (err, result) {
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
          options: optionsArr
          }
        res.render("result", templateVars);
        }
      }
    );
  });


  // CREATED TO TEST RESULT PAGE (DENIS) END
  return router;
}
