import app from "./src/app.js";

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
