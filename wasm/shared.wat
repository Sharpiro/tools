(module
  (import "js" "memory" (memory 1))
  (import "js" "table" (table 1 funcref))
  (type $void_to_i32 (func (result i32)))
  (func (export "doIt") (result i32)
   i32.const 0
   i32.const 100
   i32.store  ;; store 100 at address 0
   i32.const 2
   call_indirect (type $void_to_i32)
   i32.const 100
   i32.add
   )
)