# Henriksens Algorithm

This web application visualizes Henriksens Algorithm [henriksen-paper] which is a data structure useful for next-event simulations. The data structure is composed of a doubly linked list that carries a binary tree on top of it which is used as a dynamic index of that list. The list is always sorted by the event times of its elements. The tree is used to insert new events at their correct position in the list with a runtime of O(log n) instead of O(n).

App in Action: [Link to github pages will be here soon...] 

The algorithm was written in Javascript and follows the paper ["Event List Management - A Tutorial"][henriksen-paper] and an [implementation in C][henriksen-c] by [Christopher Copper][https://github.com/ccopper].


## Credits

### Tools
* [SublimeText 2][sublime]
* [Google Chrome][chrome]


### Libraries
* [jQuery][jquery]
* [Bootstrap][bootstrap]
* [sprintf][sprintf]

## Resources
* [Original paper][henriksen-paper]
* [C implementation][henriksen-c]


## License
GNU General Public License v3.0

Copyright &copy; 2016  [Christian Heiden][github]

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.



[jquery]:http://jquery.com/
[sprintf]:http://www.diveintojavascript.com/projects/javascript-sprintf
[henriksen-c]:https://github.com/ccopper/Henriksen-Algo-C
[henriksen-paper]:http://dl.acm.org/citation.cfm?id=801548
[bootstrap]:http://getbootstrap.com/
[github]:https://github.com/BobMcFry
[sublime]:http://www.sublimetext.com/2
[chrome]:https://www.google.com/chrome/
