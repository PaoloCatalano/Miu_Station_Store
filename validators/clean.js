import Profane from "bad-words";

const allowed = ["fanny", "wang", "willy"];
const not_allowed = [
  "dio",
  "dios",
  "allah",
  "Gesù",
  "cristo",
  "christ",
  "Jesus",
];

const profaneList = new Profane();

profaneList.removeWords(...allowed);
profaneList.addWords(...not_allowed);

export default function (word) {
  return profaneList.isProfane(word);
}
