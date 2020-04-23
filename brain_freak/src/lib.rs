extern crate web_sys;
mod utils;
use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

macro_rules! log {
  ( $( $t:tt )* ) => {
      web_sys::console::log_1(&format!( $( $t )* ).into());
  }
}

#[wasm_bindgen]
pub struct ProgramIterator {
  pub program_counter: usize,
  pub the_pointer: usize,
  // start_loop_pointer: Option<usize>,
  start_loop_stack: Vec<usize>,
  end_loop_stack: Vec<usize>,
  commands: Vec<char>,
  memory: Vec<u8>,
  output: Vec<u8>,
  input: Vec<u8>,
  loop_counter: usize,
}

impl ProgramIterator {
  fn process_next_command(&mut self) -> Option<char> {
    for &c in self.commands[self.program_counter..self.commands.len()].iter() {
      self.loop_counter += 1;
      if self.loop_counter > 1_000 {
        panic!("infinite loop ohh boy");
      }
      self.program_counter += 1;
      match c {
        '>' => {
          if self.the_pointer + 1 == self.memory.len() {
            log!("ERROR: memory out of bounds");
          }
          self.the_pointer += 1;
          return Some(c);
        }
        '<' => {
          if self.the_pointer == 0 {
            log!("ERROR: memory out of bounds");
          }
          self.the_pointer -= 1;
          return Some(c);
        }
        '+' => {
          self.memory[self.the_pointer] = self.memory[self.the_pointer].wrapping_add(1);
          return Some(c);
        }
        '-' => {
          self.memory[self.the_pointer] = self.memory[self.the_pointer].wrapping_sub(1);
          return Some(c);
        }
        '.' => {
          if self.output.len() == self.output.capacity() {
            log!(
              "ERROR: exceeding output capacity {:?}",
              self.output.capacity()
            );
          }
          self.output.push(self.memory[self.the_pointer]);
          return Some(c);
        }
        ',' => {
          if self.input.len() == 0 {
            log!("ERROR: no inputs found");
          }
          self.memory[self.the_pointer] = self.input[0];
          self.input = self.input[1..].to_owned();
          return Some(c);
        }
        '[' => {
          self.process_loop_start();
          return Some(c);
        }
        ']' => {
          self.process_loop_end();
          return Some(c);
        }
        _ => (),
      };
    }
    None
  }

  fn process_loop_start(&mut self) {
    if self.memory[self.the_pointer] == 0 {
      if let Some(end_loop_pointer) = self.end_loop_stack.pop() {
        self.program_counter = end_loop_pointer;
        if self.start_loop_stack.len() > 0 {
          log!("WARNING: end of inner loop");
        }
      } else {
        // loop block never executed so we need to find corresponding end bracket w/o a pointer
        let mut stack = vec!['['];
        for &v in &self.commands[self.program_counter..self.commands.len()] {
          self.program_counter += 1;
          if v == '[' {
            stack.push(v);
          } else if v == ']' {
            stack.pop();
            if stack.len() == 0 {
              return;
            }
          }
        }

        log!("ERROR: could not find end of loop pointer or skip to matching end of loop bracket");
      }
    } else {
      if self.start_loop_stack.len() > 0 {
        log!("WARNING: start of inner loop");
      }
      self.start_loop_stack.push(self.program_counter - 1);
    }
  }

  fn process_loop_end(&mut self) {
    if let Some(start_loop_pointer) = self.start_loop_stack.pop() {
      self.end_loop_stack.push(self.program_counter);
      self.program_counter = start_loop_pointer;
    } else {
      log!("ERROR: invalid end of loop");
    }
  }
}

#[wasm_bindgen]
impl ProgramIterator {
  pub fn new(
    program: &str,
    memory_size: usize,
    output_capacity: usize,
    input: Vec<u8>,
  ) -> ProgramIterator {
    ProgramIterator {
      program_counter: 0,
      the_pointer: 0,
      commands: program.chars().collect(),
      memory: vec![0; memory_size],
      output: Vec::with_capacity(output_capacity),
      input,
      start_loop_stack: Vec::new(),
      end_loop_stack: Vec::new(),
      loop_counter: 0,
    }
  }

  pub fn next(&mut self) -> Option<char> {
    let result = if self.program_counter < self.commands.len() {
      self.process_next_command()
    } else {
      None
    };
    result
  }

  pub fn get_output(&self) -> Vec<u8> {
    self.output.clone()
  }

  pub fn get_input_len(&self) -> usize {
    // log!("input len: {:?}", self.input.len());
    // log!("input cap: {:?}", self.input.capacity());
    // log!("input ptr: {:?}", self.input.as_ptr());
    self.input.len()
  }

  pub fn get_output_len(&self) -> usize {
    self.output.len()
  }

  pub fn get_memory_ptr(&self) -> *const u8 {
    self.memory.as_ptr()
  }

  pub fn get_input_ptr(&self) -> *const u8 {
    // log!("input len: {:?}", self.input.len());
    // log!("input cap: {:?}", self.input.capacity());
    self.input.as_ptr()
  }

  pub fn get_output_ptr(&self) -> *const u8 {
    // log!("output len: {:?}", self.output.len());
    // log!("output cap: {:?}", self.output.capacity());
    self.output.as_ptr()
  }

  pub fn bump_memory(&mut self) {
    self.memory[0] = self.memory[0] + 1;
    self.program_counter += 1;
  }

  pub fn bump_output(&mut self) {
    self.output.push(self.program_counter as u8);
    self.program_counter += 1;
  }
}

// struct Brackets {
//   start_pointer: usize,
//   end_pointer: Option<usize>,
// }

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn print_input() {
    let expected_memory = [1, 2, 0, 0, 0];
    let expected_output = [1, 2];

    let input = vec![1, 2];
    let program = ",.>,.";
    let mut iterator = ProgramIterator::new(program, 5, 10, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_output, &iterator.output[..]);
    assert_eq!(&expected_memory[..], &iterator.memory[..]);
  }
}
