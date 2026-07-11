# Sample repository (intentionally buggy)

A small, dependency-free Node.js app used as the target codebase for
the incident-triage system. This is what Agent 2 indexes and searches —
it is not part of the triage system itself.

Run all five bugs and see their real stack traces:

```powershell
node demo.js
```

## Bugs

| # | File | Function | Bug type |
|---|------|----------|----------|
| 1 | `src/services/userService.js` | `getUserProfile` | Undefined object property access |
| 2 | `src/services/productService.js` | `getProductCategory` | Missing null validation (nested property) |
| 3 | `src/services/inventoryService.js` | `isInStock` | Incorrect async handling (missing `await`) |
| 4 | `src/services/orderService.js` | `getMostRecentOrder` | Invalid array access (off-by-one) |
| 5 | `src/config.js` | `connectToDatabase` | Missing environment variable validation |

Use the stack trace printed for bug 1 (or any of the others) as the
"Error Log" when testing the Incident Submission form in later phases.