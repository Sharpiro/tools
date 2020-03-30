extern crate web_sys;
mod brain_freak;
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
  program_counter: usize,
  the_pointer: usize,
  commands: Vec<char>,
  output: Vec<u8>,
  memory: Vec<u8>,
}

impl ProgramIterator {
  fn process_next_command(&mut self) -> Option<char> {
    for &c in self.commands[self.program_counter..self.commands.len()].iter() {
      self.program_counter += 1;
      match c {
        '>' => {
          self.the_pointer += 1;
          return Some(c);
        }
        '<' => {
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
          self.output.push(self.memory[self.the_pointer]);
          return Some(c);
        }
        _ => (),
      };
    }
    None
  }
}

#[wasm_bindgen]
impl ProgramIterator {
  pub fn new(program: String, memory_size: usize) -> ProgramIterator {
    ProgramIterator {
      program_counter: 0,
      the_pointer: 0,
      commands: program.chars().collect(),
      output: Vec::with_capacity(1),
      memory: vec![0; memory_size],
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

  pub fn get_memory_ptr(&self) -> *const u8 {
    self.memory.as_ptr()
  }

  pub fn get_output_ptr(&self) -> *const u8 {
    log!("output len: {:?}", self.output.len());
    log!("output cap: {:?}", self.output.capacity());
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
