;; Lispy Script宏定义

(var $$__flow (require "bright-flow"))

;; #fn代替function
(macro #fn (rest...)
  (function ~rest...))

(macro #if (cond...)
  ($$__flow.if ~cond...))

(macro #then (rest...)
  (.then ~rest...))

(macro #else-if (rest...)
  (.elseif ~rest...))

(macro #elseif (rest...)
  (.elseif ~rest...))

(macro #else (rest...)
  (.else ~rest...))

(macro #end (rest...)
  (.end ~rest...))

(macro #for (cond...)
  ($$__flow.for (#fn () ~cond...)))

(macro #do (rest...)
  (.do ~rest...))

(macro #each (cond...)
  ($$__flow.each (#fn () ~cond...)))

(macro #parallel () ($$__flow.parallel))

(macro #series ($$__flow.series))

(macro #timeout (rest...)
  (.timeout ~rest...))

(macro #done () (this.done))

(macro #break () (this.break))
