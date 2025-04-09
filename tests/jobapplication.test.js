const request = require("supertest")
const app = require("../app")
const {sequelize} = require("../db/init")
const interview = require("../models/interview")
const JobApplication = require("../models/JobApplication")


beforeAll(async()=>{
    await sequelize.sync({force: true})
    await JobApplication.bulkCreate([
        {
            id: 1,
            role: 'Software Engineer',
            company: 'Tech Corp',
            jdUrl: 'https://techcorp.com/jobs/se',
            appliedAt: '2024-02-01',
            status: 'no reply',
            interviewRounds: 0
          },
          {
            id: 2,
            role: 'Frontend Developer',
            company: 'Pixel Studio',
            jdUrl: 'https://pixelstudio.dev/careers/frontend',
            appliedAt: '2024-02-10',
            status: 'interview',
            interviewRounds: 2
          },
          {
            id: 3,
            role: 'Backend Engineer',
            company: 'DataWorks',
            jdUrl: 'https://dataworks.com/jobs/backend',
            appliedAt: '2024-03-05',
            status: 'rejected',
            interviewRounds: 1
          },
          {
            id: 4,
            role: 'Full Stack Developer',
            company: 'CodeSmiths',
            jdUrl: 'https://codesmiths.io/careers/fsd',
            appliedAt: '2024-03-15',
            status: 'selected',
            interviewRounds: 3
          },
          {
            id: 5,
            role: 'DevOps Engineer',
            company: 'CloudNova',
            jdUrl: 'https://cloudnova.tech/jobs/devops',
            appliedAt: '2024-04-01',
            status: 'accepted',
            interviewRounds: 4
          },
    ]);
});
afterAll(async () => {
    await sequelize.close();
});


describe("Job application app api test",()=>{
    it("should return 200 if the job is created",async()=>{
        const res = await request(app).post("/applications").send({
            role: 'Software Engineer',
            company: 'Tech Corp',
            jdUrl: 'https://techcorp.com/jobs/se',
            appliedAt: '2024-02-01',
        });
        expect(res.statusCode).toEqual(200);
        // console.log(res.body);
        expect(res.body).toEqual({
            message: "Job application created successfully!",
})
    });

    // Return 400 if required fields are missing
    it("should return 400 if required field are missing",async()=>{
       const res = await request(app).post('/applications').send({
        jdUrl: 'https://techcorp.com/jobs/se',
        appliedAt: '2024-02-01',
       });
       expect(res.statusCode).toEqual(400);
       expect(res.body).toEqual("Role and company are required");
    })

    // Retrieve all job applications

    it("Should retrive 200 if all job applications are present",async()=>{
        const res = await request(app).get("/applications");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({message:"Applications fetched successfully!"});
    })

    // Retrieve a specific job application successfully
    it("Should return specific job by id",async()=>{
        const res = await request(app).get("/applications/2");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({message:"Successfully fetched application"});
    })
    // Return 404 if job application is not found

    it("Should return 404 if application not found by id",async()=>{
        const res = await request(app).get("/applications/10");
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual("No application found for id!");
    })

    // Write Tests for PUT /applications/:id (Update a Job Application)

    // Update a job application successfully

    it("should return 200 if the update job application",async()=>{
        const res = await request(app).put("/applications/1").send(
            {
                'status': 'interview',
                'interviewRounds': 1
            }
        )
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            message:"Successfully fetched application!",

        });
    })
    // Return 404 if job application is not found for update
    it("Should return 404 if the application not found!",async()=>{
        const res = await request(app).put("/applications/10").send({
            'status': 'interview',
            'interviewRounds': 1
        })
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual("Application not found!");
    })
    // Return 400 if invalid data is provided
    it("should return 400 if invalid data is present",async()=>{
        const res = await request(app).put("/applications/1").send({
            'status': 'interview'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual("Check your body again!");
    })
    // Write Tests for DELETE /applications/:id (Delete a Job Application)

    // Delete a job application successfully

    // it("Should return 200 if job application deleted successfully!",async()=>{
    //     const res = await request(app).delete("/applications/1");
    //     expect(res.statusCode).toEqual(200);
    // expect(res.body).toEqual("Successfully deleted application!")
    // })

    // Return 404 if job application is not found for deletion
    it("Should return 404 if application not found",async()=>{
        const res = await request(app).delete("/applications/10");
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({message:'Application not found'})
    })

    // Write Tests for POST /applications/:id/interview (Add an Interview Round)

    it("should return 200 if successfully add interview Round",async()=>{
        const res = await request(app).post("/applications/1/interview").send({
            'roundNum': 1,
            'roundType': 'telephonic',
            'interviewDate': '2024-02-10',
            'questions': 'What is your experience with React?'
        });
        console.log(res)
        expect(res.status).toBe(200);
        expect(res.body).toEqual({message:"Interview created successfully!"})
    })
    // Return 400 if required fields are missing

    it("Should return 400 if required fields are missing!",async()=>{
        const res = await request(app).post("/applications/1/interview").send({
             'questions': 'What is your experience with React?'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual("Interview round number, type, and date are required.");
    })
    // Return 404 if job application is not found for adding an interview
    it("Should return 404 if not job application found",async()=>{
        const res = await request(app).post("/applications/10/interview").send({
            'roundNum': 1,
            'roundType': 'telephonic',
            'interviewDate': '2024-02-10',
            'questions': 'What is your experience with React?'
        });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Job Application not found!" });
    })

    // Write Tests for GET /applications/:id/interview (Retrieve All Interviews for an Application)

    // Retrieve all interview rounds for a job application
    it("Should return 200 if retrives application by id",async()=>{
        const res = await request(app).get("/applications/1/interview");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "message": "Successfully fetched application by id",
    })

    })
    // Return 404 if job application is not found
    it("Should return 404 if job application is not found",async()=>{
        const res = await request(app).get("/applications/100/interview");
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual("Application not found.");
    })
    // Write Tests for Filtering and Sorting GET /applications

    // Filter job applications by status

    it("Should return  200 if it retrives application by status",async()=>{
        const res = await request(app).get("/applications/interviews/report?status=selected");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message:"Successfully fetched the interviews application by status"})

    })
    // Filter job applications by company
    it("Should return application by company",async()=>{
        const res = await request(app).get("/applications/filter?company=Tech Corp");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Applications fetched successfully!"});
    })

    // Generate a report of total applications in a time period

    it("Should return  total applications in a time period",async()=>{
        const res = await request(app).get("/applications/filter/date?from=2024-03-05&to=2024-04-01");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({message:"Application successfully retrived!"})
    })

    // Generate a report of applications grouped by status

    it("Should return 200 if the application by status retrived",async()=>{
        const res = await request(app).get("/applications/filter/app?status=interview");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message:"Application fetched successfully by status"});
    })


})