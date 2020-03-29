mod brain_freak;

use crate::brain_freak::execute;
use crate::brain_freak::Execution;
use std::env;

fn main() {
  let args: Vec<String> = env::args().collect();
  if args.len() < 3 {
    panic!("invalid args")
  }

  let input = args[1].as_bytes();
  if input.len() < 1 {
    panic!("invalid input")
  }

  let program = &args[2];
  if program.len() < 1 {
    panic!("invalid program")
  }
  println!("{}", program);

  let Execution { output, .. } = execute(program.chars(), &input);
  println!("{:?}", output);
}
