const JobApplication =  require('../models/JobApplication')
const interview = require('../models/interview')
const {connectDB} = require('./init')

const seedDB = async()=>{
    await connectDB();
    await JobApplication.sync({force:true});

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
          }

    ]);

    await interview.sync({force:true});

    await interview.bulkCreate([
        {
            applicationId: 2,
            roundNum: 1,
            roundType: 'telephonic',
            interviewDate: '2024-02-10',
            questions: 'What is your experience with React?',
            roleOffered: null,
            compensationOffered: null
          },
          {
            applicationId: 1,
            roundNum: 2,
            roundType: 'technical',
            interviewDate: '2024-02-15',
            questions: 'Explain the event loop in JavaScript.',
            roleOffered: null,
            compensationOffered: null
          },
          {
            applicationId: 3,
            roundNum: 3,
            roundType: 'HR',
            interviewDate: '2024-02-20',
            questions: 'Why do you want to join our company?',
            roleOffered: 'Frontend Developer',
            compensationOffered: '10 LPA'
          },
          {
            applicationId: 3,
            roundNum: 1,
            roundType: 'online assessment',
            interviewDate: '2024-03-01',
            questions: 'Coding round with data structures and algorithms problems.',
            roleOffered: null,
            compensationOffered: null
          },
          {
            applicationId: 4,
            roundNum: 2,
            roundType: 'managerial',
            interviewDate: '2024-03-07',
            questions: 'Describe a challenge you faced in your last project and how you overcame it.',
            roleOffered: 'Software Engineer',
            compensationOffered: '12.5 LPA'
          }
    ])

    console.log("Database Seeded!");
    process.exit(0);

};
seedDB();