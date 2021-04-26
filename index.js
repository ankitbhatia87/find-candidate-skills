"use strict";

const express = require("express");
const { request } = require("express");
const app = express();
app.use(express.json());

// Your code starts here. Placeholders for .get and .post are provided for
//  your convenience.

let cachedData = [];

app.post("/candidates", function (req, res) {
  if (Object.keys(req.body).length > 0) {
    cachedData.push(req.body);
    res.send("data added successfully" + cachedData);
  } else {
    res.status(400).send("Bad Request");
  }
});

app.get("/candidates/search", function (req, res) {
  if (cachedData.length === 0) {
    res.status(404).send("No Data Found");
  } else {
    if (Object.keys(req.query).length > 0) {
      let requestedSkills = req.query.skills.split(","),
        candidatesAccumulator = [],
        maxMatchedSkillsCount = 0;
      for (var i = 0; i < cachedData.length; i++) {
        let matchedSkillsCount = 0;
        for (var j = 0; j < requestedSkills.length; j++) {
          let skill = requestedSkills[j];
          console.log("skill: " + skill);
          console.log(cachedData[i].skills);
          if (cachedData[i].skills.includes(skill)) {
            console.log("inside match");
            matchedSkillsCount += 1;
            maxMatchedSkillsCount =
              matchedSkillsCount >= maxMatchedSkillsCount
                ? matchedSkillsCount
                : maxMatchedSkillsCount;
          }
        }
        if (matchedSkillsCount !== 0) {
          cachedData[i]["matchedSkillsCount"] = matchedSkillsCount;
          candidatesAccumulator.push(cachedData[i]);
        }
      }
      console.log(candidatesAccumulator);
      let ourCandidate = candidatesAccumulator.reduce((acc, candidate) => {
        let skillsLength = requestedSkills.length;
        // if(acc.length === 0) {
        if (candidate.matchedSkillsCount == maxMatchedSkillsCount) {
          acc.push(candidate);
        }
        // }
        return acc;
      }, []);
      
      if (ourCandidate.length === 0) {
        res.status(404).send("Candidate Not Found");
      } else {
        res.send(ourCandidate.slice(0, 1));
      }
    } else {
      res.status(400).send("Bad Request");
    }
  }
});

app.listen(process.env.HTTP_PORT || 3000);
