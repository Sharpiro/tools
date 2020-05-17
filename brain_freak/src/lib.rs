mod utils;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ProgramIterator {
  program_counter: usize,
  command_index: usize,
  the_pointer: usize,
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
  pub fn get_memory(&self) -> &[u8] {
    &self.memory
  }

  pub fn get_output(&self) -> &[u8] {
    &self.output
  }

  fn parse_to_next_command(&mut self) {
    for &c in &self.commands[self.program_counter..self.commands.len()] {
      self.program_counter += 1;
      self.loop_counter += 1;
      if self.loop_counter > 5_000 {
        panic!("infinite loop ohh boy");
      }
    }
  }

  fn process_next_command(&mut self) -> Option<char> {
    for &c in &self.commands[self.program_counter..self.commands.len()] {
      self.program_counter += 1;
      self.loop_counter += 1;
      if self.loop_counter > 5_000 {
        panic!("infinite loop ohh boy");
      }
      match c {
        '>' => {
          self.command_index = self.program_counter - 1;
          if self.the_pointer + 1 == self.memory.len() {
            panic!("ERROR: memory out of bounds");
          }
          self.the_pointer += 1;
          self.ticks += 1;
          return Some(c);
        }
        '<' => {
          self.command_index = self.program_counter - 1;
          if self.the_pointer == 0 {
            panic!("ERROR: memory out of bounds");
          }
          self.the_pointer -= 1;
          self.ticks += 1;
          return Some(c);
        }
        '+' => {
          self.command_index = self.program_counter - 1;
          self.memory[self.the_pointer] = self.memory[self.the_pointer].wrapping_add(1);
          self.ticks += 1;
          return Some(c);
        }
        '-' => {
          self.command_index = self.program_counter - 1;
          self.memory[self.the_pointer] = self.memory[self.the_pointer].wrapping_sub(1);
          self.ticks += 1;
          return Some(c);
        }
        '.' => {
          self.command_index = self.program_counter - 1;
          if self.output.len() == self.output.capacity() {
            panic!(
              "ERROR: exceeding output capacity {:?}",
              self.output.capacity()
            );
          }
          self.output.push(self.memory[self.the_pointer]);
          self.ticks += 1;
          return Some(c);
        }
        ',' => {
          self.command_index = self.program_counter - 1;
          if self.input.len() == 0 {
            panic!("ERROR: no inputs found");
          }
          self.memory[self.the_pointer] = self.input[0];
          self.input = self.input[1..].to_owned();
          self.ticks += 1;
          return Some(c);
        }
        '[' => {
          self.command_index = self.program_counter - 1;
          self.process_loop_start();
          self.ticks += 1;
          return Some(c);
        }
        ']' => {
          self.command_index = self.program_counter - 1;
          self.process_loop_end();
          self.ticks += 1;
          return Some(c);
        }
        _ => {
          log!("VERBOSE: skipping invalid character");
          ()
        }
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

    if let None = curr_block.end_pointer {
      log!("VERBOSE: assigning current block end pointer");
      curr_block.end_pointer = Some(self.program_counter);
    }
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
      command_index: 0,
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
    self.process_next_command()
  }

  pub fn get_input_len(&self) -> usize {
    self.input.len()
  }

  pub fn get_output_len(&self) -> usize {
    self.output.len()
  }

  pub fn get_memory_ptr(&self) -> *const u8 {
    self.memory.as_ptr()
  }

  pub fn get_input_ptr(&self) -> *const u8 {
    self.input.as_ptr()
  }

  pub fn get_output_ptr(&self) -> *const u8 {
    self.output.as_ptr()
  }

  pub fn get_command_index(&self) -> usize {
    self.command_index
  }

  pub fn get_ticks(&self) -> usize {
    self.ticks
  }

  pub fn get_program_counter(&self) -> usize {
    self.program_counter
  }

  pub fn get_the_pointer(&self) -> usize {
    self.the_pointer
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
