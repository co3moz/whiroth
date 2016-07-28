Whiroth
====================

**Wh**at **i**s w**ro**ng wi**th** me? postfix expression evaluator

Why?
-------------

I'm keep asking this question for 10 years..

How?
-------------

Before starting to code, you must learn compiling stuff. If you want to try this out with node.js; type this command to terminal

```
npm install whiroth --save
```

```javascript
var whiroth = require('whiroth'); // es5 syntax
var myExpression = "1 2 + pv";
var compile = whiroth(myExpression);
var result = compile.fn();
console.log(result.out); // 3
```

if you want to enjoy this in browser;

```
bower install whiroth --save
```

```javascript
var myExpression = "1 2 + pv";
var compile = whiroth(myExpression); // make sure you loaded whiroth.js before this code
var result = compile();
console.log(result.out); // 3
```

Basic Api
---------------

Whiroth function compiles your expression then return an function that has this properties: "fn", "fnPure", "compileTime". Basically compileTime how much milliseconds passed during the compilation. fnPure is compiled string function with whiroth. fn is fnPure's real version that means unlike fnPure this one can be executed. **tl;dr** fnPure is String, fn is Function

So you want to execute your expression, don't you. call fn with parenthesis. You can give an array to first parameter. Basically this will manipulates stack from beginning. For ex:

```javascript
var compile = whiroth("+ pv");
var result = compile([4, 6]);
console.log(result.out); // 10
```

As you can see we did not give any number in expression but while we're executing, we give [4, 6] array.

Also execution returns an object too. It gives you "stack", "out", "executionTime". Basically executionTime is stores how long it takes to execute this expression. stack is remaining elements in stack, if you do not use output you can just stack.pop() to get answer. out means stdout. when you call pv and pc operators text data will appended into this stream.

Language Basics
-------------

Expression evaluator basically works with stack. Last result will be your answer

```
1 2 +
```

with this expression you will add 1 and 2 to stack, and make addition. Result will be put back to stack. When expression ends one last time pop will executed. You get the answer 3

```
1 2 + 8
```

this time you get 8. lets examine..

after addition:

```
3 8
```

so after pop you ignore 3 and get 8

```
1 2 + 8 +
```

this time result will be 11.

```
1 2 /
```

result: 0.5

you can use dot for rational numbers.

```
0.5 2 *
```

result: 1

> **Note:** If you ask how i can get this results to yourselfs;
> ```javascript
> console.log(whiroth("1 2 +")())
> ```
> Yeah fn returns an object but it's in superposition. It can also be a number.

Operators
--------------------

| Operator |              Job              |         Stack           |
|:--------:|:-----------------------------:|:-----------------------:|
|     +    |            Addition           |     remove(2) add(1)    |
|     -    |          Subtraction          |     remove(2) add(1)    |
|     *    |         Multiplication        |     remove(2) add(1)    |
|     /    |            Division           |     remove(2) add(1)    |
|    ++    |            Increase           |         modify(1)       |
|    --    |            Decrease           |         modify(1)       |
|     ^    |          Bitwise xor          |     remove(2) add(1)    |
|     %    |           Modulation          |     remove(2) add(1)    |
|    <<    |           Shift left          |     remove(2) add(1)    |
|    >>    |          Shift right          |     remove(2) add(1)    |
|     >    |           Is bigger           |     remove(2) add(1)    |
|    >=    |       Is bigger or equal      |     remove(2) add(1)    |
|     <    |           Is smaller          |     remove(2) add(1)    |
|    <=    |      Is smaller or equal      |     remove(2) add(1)    |
|    ==    |            Is equal           |     remove(2) add(1)    |
|    !=    |          Is not equal         |     remove(2) add(1)    |
|     :    |        Duplicate value        |          add(1)         |
|     @    |    Remove value from stack    |         remove(1)       |
|     u    |  Bring value to end of stack  |      remove(1) add(1)   |
|     d    | Bring value to front of stack |      remove(1) add(1)   |
|     !    |              not              |         modify(1)       |
|     ~    |          bitwise not          |         modify(1)       |
|     r    |         reverse stack         |         modify(all)     |
|   iter   |  for current iteration value  |         add(1)          |
|    i     |         alias of iter         |         add(1)          |
|   init   |    for initialization value   |         add(1)          |
|   break  |           breaks for          |                         |
| continue |         continues for         |                         |
|    pc    |          prints char          |         remove(1)       |
|    pv    |          prints value         |         remove(1)       |
|   swap   |     swaps last two values     |         modify(2)       |

Native javascript function calls
-----------------------

| Call type                                   | Syntax         | Stack change | Notes                             |
|---------------------------------------------|----------------|--------------|-----------------------------------|
| Double parameter call                       | {Math.min}     | -1           | Parameters replaced by one answer |
| Shortcut for double parameter call for Math | {#min}         | -1           | Parameters replaced by one answer |
| One parameter call                          | [Math.sin]     | 0            | Parameter replaced by answer      |
| Shortcut for one parameter call for Math    | [#sin]         | 0            | Parameter replaced by answer      |
| Zero parameter call                         | [=Math.random] | 1            | Stack now has new item            |
| Shortcut for zero parameter call for Math   | [=#random]     | 1            | Stack now has new item            |

```
10 12 {#min}
```

result: 10

```
10 12 : : {#min}
```

result: 10 (but your previous 10 and 12 values still waiting)

Comments
--------------

you can use `;` character for comments.

example:
```
10 20 + ; 30
````

Conditional Routines
--------------------

use parenthesis for logical things.

```
10 10 == if (
    20
) else ( )
```

result: 20 (because 10 == 10)

stack:

```javascript
[
    true,
    20
]
```


-------

You want to do some loops?

```
2 (
    20
)
```

result: 20

stack:

```javascript
[
    20,
    20
]
```

As you can see value 20 added twice into stack. Basically just parenthesis makes while loop. While loop has 2 alias more.

```
2 (
    20
)

2 while (
    20
)

2 w (
    20
)

; all same
```

> **Note:** While and for loops are mostly same. Difference comes with iteration direction. While always go downwards. For always go upwards.

You can use iter and init operators with while and for loops

```
5 while (
    iter
)
```

stack:
```javascript
[
    5,
    4,
    3,
    2,
    1
]
```

```
5 for (
    iter
)
```
stack:
```javascript
[
    1,
    2,
    3,
    4,
    5
]
```

> **Note:** `iter` has alias that named `i` you can use this too.

so basically with parenthesis we can do both loops and branch.

Heap zone
--------------------

You can still use heap zone. Simply pop's from stack and set value to wanted variable.

syntax:
```
10 set<val>

set<val, 10>  ; exacly same as 10 set<val>

#val
```

example:
```
set<a, 10>  ; a = 10
#a set<b>   ; b = a
#a #b == if (  ; a == b
  "equal" (pc)
)
```

Output
------------------

Whiroth function returns an object. You can fetch out data from it.

```javascript
var result = whiroth(text)();
console.log(result.out);
```

How can i use output? easy
```
"Hello world!" ; basically writes hello world! text reverse and puts length too
( ; there is length and for each length
  pc ; put char to output
)
```
If you want to put value use `pv`

example:
```
set<a, 10>
set<b, 20>

#a pv " + " (pc) #b pv " = " (pc) #a #b + pv
```

result: `10 + 20 = 30`


Routines
--------------------

You can create own routines with `routine name ( code )` syntax. And execute them with `name<>`
examples:

```
routine add (+)
1 2 add<>
```

result: 3

```
routine square (
  : : *
)

5 square<> square<>
```

result: 625

stack:

```javascript
[
    5,
    25,
    625
]
```

Self Calling Routines
-----------------------

There is no control between other routines and themselfs. So you can call anytime any where..

Factorial routine example:

```
routine factorial (
  : 1 == if (
    1 *
  ) else (
    : -- factorial<> *
  )
)

6 factorial<>
```

result: 720

> **But remember!** routines won't work fast right know.

Self redefining routines and overriding
----------------------------

Normally you can't redefine a routine. it gives you an error, it thought that you are probably making mistake. But if you know what you are doing then, you can tell compiler that nothing is wrong just keep go..

Use hashtag `#` after routine name.

Let me show you a crazy infinite routine thing..

```
routine start (
 routine crazy # (
  routine crazy # (
   routine crazy # (
    routine crazy # (
     "last" (pc) 13 pc
     start <>
    )
    "third" (pc) 13 pc
   )
   "second" (pc) 13 pc
  )
  "first" (pc) 13 pc
 )
) start <>

crazy<> ; first
crazy<> ; second
crazy<> ; third
crazy<> ; last
crazy<> ; first
crazy<> ; second
; ...
```


Example complex calculations
---------------------

### 1 Random generation
Generate a thousand random values into stack. Add all of them into one value. Divide it by a thousand and find average random value.

```
1000 :: ([=#random]) d -- (+) d /
```

result: ~ 0.5

### 2 Fibonacci number 15
```
1 1 15 2 - ( r u : d + uu ) d @
```

result: 610 ( 1 1 **15** .. this 15 can be changed what ever you like )


### 3 Fibonacci number (all)
```
20 (
    "fibonacci(" (pc) i pv ") = " (pc)
    1 1 i 2 -
    (
        r u : d + uu
    )

    d @ pv 13 pc
)
```

result:
```
fibonacci(20) = 6765
fibonacci(19) = 4181
fibonacci(18) = 2584
fibonacci(17) = 1597
fibonacci(16) = 987
fibonacci(15) = 610
fibonacci(14) = 377
fibonacci(13) = 233
fibonacci(12) = 144
fibonacci(11) = 89
fibonacci(10) = 55
fibonacci(9) = 34
fibonacci(8) = 21
fibonacci(7) = 13
fibonacci(6) = 8
fibonacci(5) = 5
fibonacci(4) = 3
fibonacci(3) = 2
fibonacci(2) = 1
fibonacci(1) = 1
```

### 4 Prime finder
```
set <prime, 23>

#prime  ( init i / : [#floor] - 0 == )
#prime -- (+) 2 - 0 ==
if ( "prime" ) else ( "not prime" ) (pc)

clear <prime>
```

### 5 factorial without routines
```
1 6 (i *) ; legendary version of factorial but it needs 1 value before loop

6 (i) 5 (*) ; simplest form of factorial. must change both 6 and 5 for numeric changes

; we want dynamic value.. just change first and it should work

6 (i : 1 == if(init)) -- (*) ; no set no move. works always

; or

6 set<f> #f (i) #f -- (*) clear<f> ; uses set. but works always

; or

6 : (i) d -- (*) ; no set. works if stack was empty before calculations
```