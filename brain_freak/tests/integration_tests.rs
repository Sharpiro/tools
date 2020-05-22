use brain_freak::ProgramIterator;

#[test]
fn empty_program() {
  let program = "";
  let mut iterator = ProgramIterator::new(program, 0, 0, vec![], false);
  while let Some(_) = iterator.next() {}

  assert_eq!(0, iterator.get_ticks());
}

#[test]
fn one_command_program() {
  let program = "+";
  let mut iterator = ProgramIterator::new(program, 1, 0, vec![], false);
  while let Some(_) = iterator.next() {}

  assert_eq!(1, iterator.get_ticks());
}

#[test]
fn two_command_program() {
  let program = "+ + ";
  let mut iterator = ProgramIterator::new(program, 1, 0, vec![], false);
  while let Some(_) = iterator.next() {}

  assert_eq!(2, iterator.get_ticks());
}

#[test]
#[should_panic]
fn infinite_loop_test() {
  let input = vec![1];
  let program = ",[]";
  let mut iterator = ProgramIterator::new(program, 1, 1, input, false);
  while let Some(_) = iterator.next() {}
}

#[test]
fn print_input() {
  let expected_memory = [1, 2];
  let expected_output = [1, 2];

  let input = vec![1, 2];
  let program = ",.>,.";
  let mut iterator = ProgramIterator::new(program, 2, 2, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_output, iterator.get_output());
  assert_eq!(&expected_memory[..], iterator.get_memory());
}

#[test]
fn decrement_zero() {
  let expected_memory = [255];

  let program = "-";
  let mut iterator = ProgramIterator::new(program, 1, 0, vec![], false);
  while let Some(_) = iterator.next() {}

  assert_eq!(&expected_memory[..], iterator.get_memory());
}

#[test]
fn looping() {
  let expected_memory = [0];
  let expected_output = [3, 2, 1];

  let input = vec![3];
  let program = ",[.-]";
  let mut iterator = ProgramIterator::new(program, 1, 3, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_output, iterator.get_output());
  assert_eq!(expected_memory, iterator.get_memory());
}

#[test]
fn addition() {
  let expected_memory = [0, 5];
  let expected_output = [5];

  let input = vec![3, 2];
  let program = ",>,<[->+<]>.";
  let mut iterator = ProgramIterator::new(program, 2, 1, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_output, iterator.get_output());
  assert_eq!(expected_memory, iterator.get_memory());
}

#[test]
fn outer_loop_never_runs() {
  let expected_memory = [0];

  let input = vec![];
  let program = "[+[+]]";
  let mut iterator = ProgramIterator::new(program, 1, 0, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
}

#[test]
fn inner_loop_never_runs() {
  let expected_memory = [255];
  let expected_output = [255];

  let input = vec![1];
  let program = ",[-[+.]]-.";
  let mut iterator = ProgramIterator::new(program, 1, 1, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(expected_output, iterator.get_output());
}

#[test]
fn add_n_numbers() {
  let expected_memory = [0, 0, 3];
  let expected_output = [3];

  let input = vec![3, 0, 1, 2];
  let program = ",[>,[->+<]<-]>>.";
  let mut iterator = ProgramIterator::new(
    program,
    expected_memory.len(),
    expected_output.len(),
    input,
    false,
  );
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(expected_output, iterator.get_output());
}

#[test]
fn add_n_numbers_two() {
  let expected_memory = [0, 0, 3];
  let expected_output = [3];

  let input = vec![2, 2, 1];
  let program = ",[>,[->+<]<-]>>.";
  let mut iterator = ProgramIterator::new(
    program,
    expected_memory.len(),
    expected_output.len(),
    input,
    false,
  );
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(expected_output, iterator.get_output());
}

#[test]
fn jump_to_inner_end_loop_pointer() {
  let expected_memory = [0, 0];

  let input = vec![2];
  let program = ",[>[+]<-]";
  let mut iterator = ProgramIterator::new(program, expected_memory.len(), 0, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(14, iterator.get_ticks());
}

#[test]
fn skip_inner_loop_once() {
  let expected_memory = [0, 1];

  let input = vec![2];
  let program = ",[>[-]+<-]";
  let mut iterator = ProgramIterator::new(program, expected_memory.len(), 0, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(19, iterator.get_ticks());
}

#[test]
fn skip_other_characters() {
  let expected_memory = [2];
  let expected_output = [2];

  let input = vec![1];
  let program = "  test , +  // here is a comment .";
  let mut iterator = ProgramIterator::new(program, 1, 1, input, false);
  while let Some(_cmd) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(expected_output, iterator.get_output());
  assert_eq!(3, iterator.get_ticks());
  assert_eq!(34, iterator.get_program_counter());
}

#[test]
fn duplicate_in_place() {
  let expected_memory = [2, 2, 0];

  let input = vec![2];
  let program = ",[>+>+<<-] >> [<<+>>-]";
  let mut iterator = ProgramIterator::new(program, 3, 0, input, false);
  while let Some(_cmd) = iterator.next() {}

  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(39, iterator.get_ticks());
}

#[test]
fn multiplication() {
  let expected_memory = [0, 9, 54, 0];
  let expected_output = [54];

  let input = vec![6, 9];
  let program = ",>,< // read input (x y)
    [> // duplicate y x times
    [>+>+<<-] >> [<<+>>-] << // duplicate y
    <-]
    >>. // print";
  let mut iterator = ProgramIterator::new(program, 4, 1, input, false);
  while let Some(_) = iterator.next() {}

  assert_eq!(expected_output, iterator.get_output());
  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(992, iterator.get_ticks());
}

#[test]
fn command_index_test() {
  let expected_memory = [2];
  let expected_output = [2];

  let input = vec![1];
  let program = ", // read it
  + // increment it
  . // write it";
  let mut iterator = ProgramIterator::new(program, 1, 1, input, false);
  iterator.next();
  assert_eq!(0, iterator.get_command_index());
  assert_eq!(15, iterator.get_program_counter());
  iterator.next();
  assert_eq!(15, iterator.get_command_index());
  assert_eq!(35, iterator.get_program_counter());
  iterator.next();
  assert_eq!(35, iterator.get_command_index());
  assert_eq!(48, iterator.get_program_counter());

  assert_eq!(expected_output, iterator.get_output());
  assert_eq!(expected_memory, iterator.get_memory());
  assert_eq!(3, iterator.get_ticks());
}

#[test]
fn extended_mode_debug() {
  let program = "// ++ ! - - -# //";
  let mut iterator = ProgramIterator::new(program, 1, 1, vec![], true);

  iterator.next();
  assert_eq!(3, iterator.get_command_index());
  assert_eq!(4, iterator.get_program_counter());
  iterator.next();
  assert_eq!(4, iterator.get_command_index());
  assert_eq!(6, iterator.get_program_counter());
  iterator.next();
  assert_eq!(6, iterator.get_command_index());
  assert_eq!(8, iterator.get_program_counter());
  while let Some(_) = iterator.next() {}

  assert_eq!(5, iterator.get_ticks());
}
