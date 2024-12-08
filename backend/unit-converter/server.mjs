import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const converters = {
  length: (value, from, to) => {
    const units = {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34,
    };
    return (value * units[from]) / units[to];
  },
  weight: (value, from, to) => {
    const units = { mg: 0.001, g: 1, kg: 1000, ounce: 28.3495, pound: 453.592 };
    return (value * units[from]) / units[to];
  },
  temperature: (value, from, to) => {
    if (from === to) return value;
    if (from === "C" && to === "F") return (value * 9) / 5 + 32;
    if (from === "F" && to === "C") return ((value - 32) * 5) / 9;
    if (from === "C" && to === "K") return value + 273.15;
    if (from === "K" && to === "C") return value - 273.15;
    if (from === "F" && to === "K") return ((value - 32) * 5) / 9 + 273.15;
    if (from === "K" && to === "F") return ((value - 273.15) * 9) / 5 + 32;
  },
};

app.get("/", (req, res) => res.render("index"));
app
  .route("/length")
  .get((req, res) => res.render("length", { result: null }))
  .post((req, res) => {
    const { value, from, to } = req.body;
    const result = converters.length(parseFloat(value), from, to);
    res.render("length", { result });
  });
app
  .route("/weight")
  .get((req, res) => res.render("weight", { result: null }))
  .post((req, res) => {
    const { value, from, to } = req.body;
    const result = converters.weight(parseFloat(value), from, to);
    res.render("weight", { result });
  });
app
  .route("/temperature")
  .get((req, res) => res.render("temperature", { result: null }))
  .post((req, res) => {
    const { value, from, to } = req.body;
    const result = converters.temperature(parseFloat(value), from, to);
    res.render("temperature", { result });
  });
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
