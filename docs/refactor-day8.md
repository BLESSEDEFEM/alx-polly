 1. Reduced Code Duplication (lines removed)

Before: The same Supabase client setup code appeared in multiple places, meaning every time the file was run, that logic was duplicated in memory and re-parsed by the TypeScript compiler.

After: By centralizing that setup in one function, there’s only one copy of the code, which:

Lowers memory usage (only one function is stored in memory).

Makes runtime execution faster (less code to parse/compile).

Reduces maintenance overhead — you now update the setup in one place, which also lowers the risk of introducing bugs in future edits.

 2. Memory Efficiency (Single Function Instances)

Before: Each inline logic block created its own function context every time it ran, leading to unnecessary memory allocations.

After: The refactor uses one reusable function instance.

This avoids creating multiple copies of the same logic in memory.

Makes garbage collection easier for the JavaScript engine, which can improve performance under high load.

 3. Faster Compilation & Execution

Before: More lines of code = more parsing and type-checking work for TypeScript.

After: Fewer lines of code mean the compiler finishes faster, and execution time is slightly improved at runtime since there’s less code to interpret.

This optimization improved performance in pratice and thus much desire as compared to the earlier. Thus, i would keep this version in production.