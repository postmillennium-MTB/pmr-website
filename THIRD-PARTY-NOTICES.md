# Third-party notices

The Wheel Strength Lab page (`wheel-lab/`) follows Matthew Ford's published Mode Matrix method (PhD thesis, Northwestern University, 2018) and his reference implementation, `bike-wheel-calc` (https://github.com/dashdotrobot/bike-wheel-calc), which is MIT-licensed. Matthew Ford must be credited wherever this work is used.

The PolyForm Noncommercial license in `LICENSE` applies to this repository's own code and text only. It does not relicense Matthew Ford's work. The MIT license text below is reproduced verbatim from the upstream repository's license file (https://github.com/dashdotrobot/bike-wheel-calc/blob/master/LICENSE).

---

The MIT License (MIT)

Copyright (c) 2015 Matthew Ford

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Tiny Lab (`tiny-lab/`): TINY 2.1

The Tiny Lab page (`tiny-lab/index.html`) runs the TINY 2.1 network by WollyMonjac (https://github.com/WollyMonjac/Tiny-2.1). The network weights (`dos/TINY.BIN`, embedded as base64) and the inference code (a JavaScript port of `dos/TINY.C`) are MIT-licensed:

```
MIT License

Copyright (c) 2026 WollyMonjac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The upstream repository states that the network was trained partly on data derived from two public datasets that keep their own licenses, and that "Contains information from mledoze/countries, which is made available under the ODbL, and from Periodic-Table-JSON (CC BY-SA 3.0)":

- mledoze/countries (https://github.com/mledoze/countries): ODC Open Database License 1.0 (https://opendatacommons.org/licenses/odbl/1-0/)
- Bowserinator/Periodic-Table-JSON (https://github.com/Bowserinator/Periodic-Table-JSON): CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)

The PolyForm Noncommercial license in `LICENSE` applies to this repository's own code and text only. It does not relicense TINY 2.1 or the data above. Whether the share-alike terms of the two data licenses reach the trained weights is not settled here; Jon decides how to handle that.

Icons on that page are from Lucide (https://lucide.dev, ISC license).
