const mongoose = require('mongoose')
function Dbconnect(){

    const DB_URL = process.env.DB_URL
    
mongoose.connect(DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      console.log("database started");
    }
)

}

module.exports = Dbconnect