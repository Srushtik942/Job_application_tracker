const express = require('express');
const JobApplication = require("../models/JobApplication");
const interview = require("../models/interview");
const {Op} = require("sequelize");
const { route } = require('../app');
const router = express.Router();

// 2.1 POST /applications
// Create a new job application

router.post("/",async(req,res)=>{
    try{
    let {role , company, jdUrl, appliedAt} = req.body;

    if(!role || !company  ){
        return res.status(400).json("Role and company are required");
    }

    const newJobApplication = await JobApplication.create({role , company, jdUrl, appliedAt});
    res.status(200).json({message:"Job application created successfully!",newJobApplication});
}
catch(error){
    res.status(500).json({message:"Internal Server error",error:error.message});
}
})
// 2.2 GET /applications
// Retrieve all job applications.

router.get("/",async(req,res)=>{
    try{
        let result = await JobApplication.findAll();

        if(result.length === 0){
            res.status(404).json("Not able to load applications!")
        }

        res.status(200).json({message:"Applications fetched successfully!",result});

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// - company: Filter by company name (e.g., ?company=Tech Corp).
router.get("/filter/", async (req, res) => {
    try {
      const company = req.query.company;

      if (!company) {
        return res.status(400).json({ message: "Company query param is required!" });
      }

      const results = await JobApplication.findAll({
        where: { company : company}
      });
    //  console.log({"results":results});

      if (results.length === 0) {
        return res.status(404).json({ message: "No job applications found for this company!" });
      }

      res.status(200).json({ message: "Applications fetched successfully!", result: results });
    } catch (error) {
      res.status(500).json({ message: "Internal server error!", error: error.message });
    }
  });

//   - status: Filter by application status (e.g., ?status=interview).
router.get("/filter/app/",async(req,res)=>{
    try{
    let status = req.query.status;
    if(!status){
        res.status(400).json("Check your query!");
    }
    let result = await JobApplication.findAll({
        where: {status : status}
    });
    res.status(200).json({message:"Application fetched successfully by status",result: result});
}catch(error){
    res.status(500).json({message:"Internal Server Error!", error:error.message});
}
});

// - appliedAt: Filter applications made within a date range (e.g., ?from=2024-01-01&to=2024-01-31).

router.get("/filter/date/",async(req,res)=>{
    try {
        const from = new Date(req.query.from);
        const to = new Date(req.query.to);

        const result = await JobApplication.findAll({
            where: {
              appliedAt: {
                [Op.between]: [from, to]
              }
            }
          });
        console.log(result);
        res.status(200).json({message:"Application successfully retrived!",result});

    } catch (error) {
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// 2.3 GET /applications/:id
router.get("/:id",async(req,res)=>{
    try {
        let id = parseInt(req.params.id);
        let result = await JobApplication.findByPk({
            where:{id}
        });
        if (!result){
            res.status(404).json("No application found for id!");
        }
        res.status(200).json({message:"Successfully fetched application",result});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
})

// 2.4 PUT /applications/:id
router.put('/:id',async(req,res)=>{
    try {
        let id = parseInt(req.params.id);
        let {status, interviewRounds} = req.body;
        if(!status || !interviewRounds){
            res.status(400).json("Check your body again!");
        }

        let result = await JobApplication.findByPk(id);

        if (status) result.status = status;
        if (interviewRounds) result.interviewRounds = interviewRounds;

         await result.save();

        res.status(200).json({message:"Successfully fetched application!",result});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// 2.5 DELETE /applications/:id

router.delete('/:id',async(req,res)=>{
    try {
        let id = parseInt(req.params.id);
        let result = await JobApplication.findByPk(id);
        if(!result){
            res.status(400).json({message:'Application not found'})
        }

        result.destroy();

        res.status(200).json("Successfully deleted application!");
    } catch (error) {
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
})

// 2.6 POST /applications/:id/interview

router.post('/:id/interview',async(req,res)=>{
    try {
        let id = parseInt(req.params.id);
        let { roundNum,roundType,interviewDate, questions, roleOffered, compensationOffered } = req.body;

        if(!roundNum || !roundType || !interviewDate){
            res.status(400).json("Interview round number, type, and date are required.");
        }
        const job = await JobApplication.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: "Job Application not found!" });
        }

        let result = await interview.create(

        {
            applicationId: id,
             roundNum,
             roundType,
             interviewDate,
             questions,
             roleOffered,
             compensationOffered
         }

        );
        res.status(200).json({message:"Interview created successfully!",result});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})


// 2.7 GET /applications/:id/interview

router.get('/:id/interview',async(req,res)=>{
    try {
        let id = parseInt(req.params.id);

        if(!id){
            res.status(400).json("check your request body");
        }
        let result = await interview.findByPk(id);

        res.status(200).json({message:"Successfully fetched application by id",result})

    } catch (error) {
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
})


// - GET /reports/applications

// - Return the total number of applications by status (e.g., how many interviews, selected, or rejected).

router.get("/interviews/report/",async(req,res)=>{
    try {
        let status = req.query.status;

        if(!status){
            return res.status(400).json("Status is required!");
        }
        let result = await JobApplication.findAll({
           where:{status}
        })
        console.log(result);

        if(!result){
            res.status(404).json("No result found!");
        }

        res.status(200).json({message:"Successfully fetched the interviews application by status",result});

    } catch (error) {
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
})

module.exports = router;