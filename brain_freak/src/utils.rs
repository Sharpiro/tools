
#![macro_use]
use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(target_arch = "wasm32")]
macro_rules! log {
  ( $( $t:tt )* ) => {
      web_sys::console::log_1(&format!( $( $t )* ).into());
  }
}

#[cfg(not(target_arch = "wasm32"))]
macro_rules! log {
  ( $( $t:tt )* ) => {
      println!("{}", &format!( $( $t )* ));
  }
}

#[wasm_bindgen]
pub fn set_panic_hook() {
  // When the `console_error_panic_hook` feature is enabled, we can call the
  // `set_panic_hook` function at least once during initialization, and then
  // we will get better error messages if our code ever panics.
  //
  // For more details see
  // https://github.com/rustwasm/console_error_panic_hook#readme
 #[cfg(feature = "console_error_panic_hook")]
 console_error_panic_hook::set_once();
}

// #[wasm_bindgen]
// pub fn test_error()-> Result<isize, isize> {
//   // Err("hi")
//    Err(1)
// }
