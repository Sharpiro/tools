// pub struct Execution {
//   pub output: Vec<u8>,
//   pub memory: [u8; 5],
// }

// pub fn execute(commands: std::str::Chars, input: &[u8]) -> Execution {
//   let mut input_index = 0;
//   let mut the_pointer = 0;
//   let mut memory = [0u8; 5];
//   let mut output = Vec::new();

//   for (i, v) in commands.enumerate() {
//     match v {
//       '>' => the_pointer += 1,
//       '<' => the_pointer -= 1,
//       '+' => memory[the_pointer] = memory[the_pointer].wrapping_add(1),
//       '-' => memory[the_pointer] = memory[the_pointer].wrapping_sub(1),
//       '.' => output.push(memory[the_pointer]),
//       ',' => {
//         memory[the_pointer] = input[input_index];
//         input_index += 1;
//       }
//       ' ' => (),
//       _ => panic!("invalid symbol @ {}", i),
//     }
//   }
//   Execution { output, memory }
// }

// #[cfg(test)]
// mod tests {
//   use crate::brain_freak::{execute, Execution};

//   #[test]
//   fn print_input() {
//     let expected_memory = [1, 2, 0, 0, 0];
//     let expected_output = [1, 2];

//     let input = [1, 2];
//     let program = ",.>,.";
//     let Execution { output, memory } = execute(program.chars(), &input);

//     assert_eq!(expected_output, &output[..]);
//     assert_eq!(expected_memory, memory);
//   }

//   #[test]
//   fn decrement_zero() {
//     let expected_memory = [255, 0, 0, 0, 0];

//     let program = "-";
//     let Execution { output: _, memory } = execute(program.chars(), &[]);

//     assert_eq!(expected_memory, memory);
//   }

//   // #[test]
//   // fn addition() {
//   //   let expected_memory = [0, 0, 5, 0, 0];
//   //   let expected_output = [5];

//   //   let input = [3, 2];
//   //   let program = ",.>,.";
//   //   let Execution { output, memory } = execute(program.chars(), &input);

//   //   assert_eq!(expected_output, &output[..]);
//   //   assert_eq!(expected_memory, memory);
//   // }
// }
