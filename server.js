const app = require("./src/app");

const connectDB = require("./src/db/db");

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

connectDB();
