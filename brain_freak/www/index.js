import { ProgramIterator } from "brain_freak";

const iterator = ProgramIterator.new(">123>", 12);

for (let v; v = iterator.next();) {
  console.log(v);
}
