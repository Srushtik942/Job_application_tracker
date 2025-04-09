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

afterAll(async()=>{
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
        console.log(res.body);
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


})