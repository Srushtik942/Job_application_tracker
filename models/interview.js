const {DataTypes} = require("sequelize")
const {sequelize} = require("../db/init")
const JobApplication = require('./JobApplication');
const { FOREIGNKEYS } = require("sequelize/lib/query-types")

const interview = sequelize.define("interview",{
    id :{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    applicationId : {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:JobApplication,
            key : 'id'
        }

    },
    roundNum :{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roundType:{

        type: DataTypes.STRING,
        allowNull: false
    },
    interviewDate:{
        type: DataTypes.DATE,
        allowNull: false
    },
    questions:{
        type: DataTypes.STRING
    },
    roleOffered: {
        type: DataTypes.STRING
    },
    compensationOffered:{
        type:DataTypes.STRING
    }

})

JobApplication.hasMany(interview,{foreignKey:'applicationId'});

interview.belongsTo(JobApplication,{foreignKey:'applicationId'});


module.exports = interview;