// const mongoose = require("mongoose");
// const BASE_URL = "mongodb://localhost:27017/";


// // const BASE_URL = "mongodb+srv://gurunathganesh6:hlcV5lp07enKifuW@hallbookingdb.qqzxzcm.mongodb.net/HallBookings?retryWrites=true&w=majority";
// const DATABASE_NAME = "HallBookings";

// //mongodb+srv://gurunathganesh6:hlcV5lp07enKifuW@hallbookingdb.qqzxzcm.mongodb.net/?retryWrites=true&w=majority

// mongoose
// .connect(`${BASE_URL}${DATABASE_NAME}`)

//   // .connect(`${BASE_URL}`)
//   .then((response) => {
//     if (response) {
//       console.log("DATABASE CONNECTION SUCCESSFULL");
//     } else {
//       console.log("SOMETHING WENT WRONG");
//     }
//   })
//   .catch((err) => {
//     if (err) {
//       console.log("ERROR CONNECT DATABASE", err);
//     } else {
//       console.log("SOMETHING WENT WRONG");
//     }
//   });



const mongoose = require("mongoose");

const BASE_URL =
  process.env.NODE_ENVIRONMENT === "development"
    ? `mongodb://localhost:27017/${process.env.DEVELOPMENT_MONGO_DB_NAME}`
    : `mongodb+srv://${process.env.PRODUCTION_MONGO_DB_USER_NAME}:${process.env.PRODUCTION_MONGO_DB_PASSWORD}@mentorstudent.pnfm8uy.mongodb.net/${process.env.PRODUCTION_MONGO_DB_NAME}`;



mongoose
  .connect(BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4, // Force to use IPv4
  })
  .then(() => {
    console.log("DATABASE CONNECTION SUCCESSFULLY");
  })
  .catch((err) => {
    console.error("ERROR CONNECTING TO DATABASE:", err.message);
  });
