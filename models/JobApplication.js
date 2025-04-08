const {DataTypes} = require("sequelize")
const {sequelize} = require("../db/init")

const JobApplication = sequelize.define("JobApplication",{
    role:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    company:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    jdUrl:{
        type : DataTypes.STRING
    },
    status:{
        type: DataTypes.ENUM('no reply', 'rejected', 'interview', 'selected', 'accepted'),
        defaultValue: 'no reply',
        allowNull: false
    },
    interviewRounds:{
        type: DataTypes.INTEGER,
        defaultValue : 0
    }

})

module.exports = JobApplication;