(module
  (import "console" "log" (func $log (param i32 i32)))
  (import "js" "table" (table 3 funcref))
  (type $return_i32 (func (result i32)))
  (func (export "callFuncPointer") (result i32)
    i32.const 10
    ;; call_indirect (type $return_i32)
  )
)
