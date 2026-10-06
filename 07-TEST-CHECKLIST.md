# Fast Manual Test Checklist

Test the real problem flow, not only whether the page looks polished. Fill the expected result from the task statement.

| Check | Steps | Expected | Pass? |
|---|---|---|---|
| Main happy path | `[ ]` | `[ ]` | `[ ]` |
| Another required task | `[ ]` | `[ ]` | `[ ]` |
| Empty input / empty data | `[ ]` | Clear helpful state | `[ ]` |
| Invalid input | `[ ]` | Error explains correction | `[ ]` |
| Successful action | `[ ]` | Visible confirmation/result | `[ ]` |
| Bangla mode | Switch language and repeat core flow | Main labels, actions, feedback are Bangla | `[ ]` |
| English mode | Switch language and repeat core flow | Main labels, actions, feedback are English | `[ ]` |
| Refresh/reopen | Refresh after expected app state | App still works; browser storage behaves as intended | `[ ]` |
| Narrow viewport | Resize browser to phone-like width | Main action remains visible and usable | `[ ]` |
| API offline/failure (if used) | Disable network or trigger failure | Core workflow remains useful; clear fallback | `[ ]` |
| Fresh public link | Open deployment in a fresh/private tab | HTTPS, no login, no install, correct app | `[ ]` |

Use only sample data provided by organizers. Do not enter real personal or private company information.
