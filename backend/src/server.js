import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();  // MUST be

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running perfectly! 🔥");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
