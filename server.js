const app = require('./app');
const {connectDB} = require('./db/init');

const PORT = process.env.PORT || 3000;

connectDB();
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})