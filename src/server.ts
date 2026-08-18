import { app } from "./app.js";

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
