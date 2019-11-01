(module
 (import "console" "log" (func $log (param i32 i32)))
  (import "js" "memory" (memory 1))
  (data (i32.const 0) "Hi")
  ;; (table 3 funcref)
  (import "js" "table" (table 3 funcref))
   (func (export "writeHi")
    i32.const 0
    i32.const 2
    call $log)
    (func $shared0func (result i32)
   i32.const 0
   i32.load)
  (func $f1 (result i32)
    i32.const 42)
  (func $f2 (result i32)
    i32.const 13)
  (elem (i32.const 0) $f1 $f2 $shared0func)
  (type $return_i32 (func (result i32)))
  (func (export "callByIndex") (param $i i32) (result i32)
    local.get $i
    call_indirect (type $return_i32))
)
