mod utils;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ProgramIterator {
  pub program_counter: usize,
  pub the_pointer: usize,
  blocks: Vec<Block>,
  current_block: Option<Block>,
  commands: Vec<char>,
  memory: Vec<u8>,
  output: Vec<u8>,
  input: Vec<u8>,
  loop_counter: usize,
  ticks: usize,
}

impl ProgramIterator {
  fn process_next_command(&mut self) -> Option<char> {
    for &c in self.commands[self.program_counter..self.commands.len()].iter() {
      self.loop_counter += 1;
      self.ticks += 1;
      if self.loop_counter > 1_000 {
        panic!("infinite loop ohh boy");
      }
      self.program_counter += 1;
      match c {
        '>' => {
          if self.the_pointer + 1 == self.memory.len() {
            panic!("ERROR: memory out of bounds");
          }
          self.the_pointer += 1;
          return Some(c);
        }
        '<' => {
          if self.the_pointer == 0 {
            panic!("ERROR: memory out of bounds");
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
            panic!(
              "ERROR: exceeding output capacity {:?}",
              self.output.capacity()
            );
          }
          self.output.push(self.memory[self.the_pointer]);
          return Some(c);
        }
        ',' => {
          if self.input.len() == 0 {
            panic!("ERROR: no inputs found");
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

  /// if '['
  fn process_loop_start(&mut self) {
    if self.memory[self.the_pointer] == 0 {
      self.skip_loop_block();
    } else {
      self.enter_loop_block();
    }
  }

  fn skip_loop_block(&mut self) {
    // todo: combined if let expressions could make this simpler and more readable
    if let Some(current_block) = &self.current_block {
      if current_block.start_pointer == self.program_counter - 1 {
        log!("VERBOSE: exit current block by end pointer");
        self.program_counter = current_block
          .end_pointer
          .expect("ERROR: always expected end pointer available at this point");
        self.current_block = self.blocks.pop();
      } else {
        log!("VERBOSE: skip inner block and find inner block pointer");
        self.skip_never_ran_block();
      }
    } else {
      log!("VERBOSE: NOT in a block thus we must skip block and find end block pointer");
      self.skip_never_ran_block();
    }
  }

  fn skip_never_ran_block(&mut self) {
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
    panic!("ERROR: could not find end of loop pointer or skip to matching end of loop bracket");
  }

  fn enter_loop_block(&mut self) {
    if let Some(current_block) = self.current_block.as_ref() {
      if current_block.start_pointer == self.program_counter - 1 {
        log!("VERBOSE: continuing loop");
      } else {
        log!("VERBOSE: starting new inner loop");
        let current_block = self.current_block.take().unwrap();
        self.blocks.push(current_block);
        self.current_block = Some(Block::new(self.program_counter - 1));
      }
    } else {
      log!("VERBOSE: starting new loop");
      self.current_block = Some(Block::new(self.program_counter - 1));
    }
  }

  /// if ']'
  fn process_loop_end(&mut self) {
    let curr_block = (self.current_block)
      .as_mut()
      .expect("ERROR: expected current block at end of loop block");
    curr_block.end_pointer = Some(self.program_counter);
    self.program_counter = curr_block.start_pointer;
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
      blocks: Vec::new(),
      current_block: None,
      loop_counter: 0,
      ticks: 0,
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

struct Block {
  start_pointer: usize,
  end_pointer: Option<usize>,
}

impl Block {
  fn new(start_pointer: usize) -> Block {
    Block {
      start_pointer,
      end_pointer: None,
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn print_input() {
    let expected_memory = [1, 2];
    let expected_output = [1, 2];

    let input = vec![1, 2];
    let program = ",.>,.";
    let mut iterator = ProgramIterator::new(program, 2, 2, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_output, &iterator.output[..]);
    assert_eq!(&expected_memory[..], &iterator.memory[..]);
  }

  #[test]
  fn decrement_zero() {
    let expected_memory = [255];

    let program = "-";
    let mut iterator = ProgramIterator::new(program, 1, 0, vec![]);
    while let Some(_) = iterator.next() {}

    assert_eq!(&expected_memory[..], &iterator.memory[..]);
  }

  #[test]
  fn looping() {
    let expected_memory = [0];
    let expected_output = [3, 2, 1];

    let input = vec![3];
    let program = ",[.-]";
    let mut iterator = ProgramIterator::new(program, 1, 3, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_output, &iterator.output[..]);
    assert_eq!(expected_memory, &iterator.memory[..]);
  }

  #[test]
  fn addition() {
    let expected_memory = [0, 5];
    let expected_output = [5];

    let input = vec![3, 2];
    let program = ",>,<[->+<]>.";
    let mut iterator = ProgramIterator::new(program, 2, 1, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_output, &iterator.output[..]);
    assert_eq!(expected_memory, &iterator.memory[..]);
  }

  #[test]
  fn outer_loop_never_runs() {
    let expected_memory = [0];

    let input = vec![];
    let program = "[+[+]]";
    let mut iterator = ProgramIterator::new(program, 1, 0, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_memory, &iterator.memory[..]);
  }

  #[test]
  fn inner_loop_never_runs() {
    let expected_memory = [255];
    let expected_output = [255];

    let input = vec![1];
    let program = ",[-[+.]]-.";
    let mut iterator = ProgramIterator::new(program, 1, 1, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_memory, &iterator.memory[..]);
    assert_eq!(expected_output, &iterator.output[..]);
  }

  #[test]
  fn add_n_numbers() {
    let expected_memory = [0, 0, 3];
    let expected_output = [3];

    let input = vec![3, 0, 1, 2];
    let program = ",[>,[->+<]<-]>>.";
    let mut iterator =
      ProgramIterator::new(program, expected_memory.len(), expected_output.len(), input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_memory, &iterator.memory[..]);
    assert_eq!(expected_output, &iterator.output[..]);
  }

  #[test]
  fn add_n_numbers_two() {
    let expected_memory = [0, 0, 3];
    let expected_output = [3];

    let input = vec![2, 2, 1];
    let program = ",[>,[->+<]<-]>>.";
    let mut iterator =
      ProgramIterator::new(program, expected_memory.len(), expected_output.len(), input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_memory, &iterator.memory[..]);
    assert_eq!(expected_output, &iterator.output[..]);
  }

  #[test]
  fn jump_to_inner_end_loop_pointer() {
    let expected_memory = [0, 0];

    let input = vec![2];
    let program = ",[>[+]<-]";
    let mut iterator = ProgramIterator::new(program, expected_memory.len(), 0, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_memory, &iterator.memory[..]);
    assert_eq!(14, iterator.ticks);
  }

  #[test]
  fn skip_inner_loop_once() {
    let expected_memory = [0, 1];

    let input = vec![2];
    let program = ",[>[-]+<-]";
    let mut iterator = ProgramIterator::new(program, expected_memory.len(), 0, input);
    while let Some(_) = iterator.next() {}

    assert_eq!(expected_memory, &iterator.memory[..]);
    assert_eq!(19, iterator.ticks);
  }
}
