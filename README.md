Whiroth
====================

**Wh**at **i**s w**ro**ng wi**th** me? postfix expression evaluator

Why?
-------------

I'm keep asking this question for 10 years..


Basics
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

Routine calls
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
)
```

result: 20 (because 10 == 10)
stack:
```javascript
[
    true,
    20
]
```

> **Note:** if statement puts read value back after complete. But else won't put back.
> ```
> 10 10 == if (
>   ; stack is empty when execution is in here
> ) ; if statement puts back value "true"
> else (
>   ; now you can do else too because data still there
> ) ; but this time there is no "true"
> ```
> possible bugs
> ```
> 10 10 == if ( )
> 10 20 +
> ; ...
> ; you forget to remove remaining data from if
> ; you must do
> 10 10 == if ( ) @
> ```

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
#a #b == (  ; a == b
  true
)
```

Output
------------------

Whiroth has stdout too but routines won't return output. you have to fetch it from object.

```javascript
var stack = [];
var opts = {};
var result = whiroth(text, stack, opts);
console.log(opts.out);
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
set <prime, 2011>

#prime  ( init i / : [#floor] - 0 == )
#prime -- (+) 2 - 0 ==
: set<if> ( "prime" ) #if ! ( "not prime" ) (pc) clear<if>

clear <prime>
```