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

| Operator |              Job              |  Stack  |
|:--------:|:-----------------------------:|:-------:|
|     +    |            Addition           |    2    |
|     -    |          Subtraction          |    2    |
|     *    |         Multiplication        |    2    |
|     /    |            Division           |    2    |
|    ++    |            Increase           |    1    |
|    --    |            Decrease           |    1    |
|     ^    |          Bitwise xor          |    2    |
|     %    |           Modulation          |    2    |
|    <<    |           Shift left          |    2    |
|    >>    |          Shift right          |    2    |
|     >    |           Is bigger           |    2    |
|    >=    |       Is bigger or equal      |    2    |
|     <    |           Is smaller          |    2    |
|    <=    |      Is smaller or equal      |    2    |
|    ==    |            Is equal           |    2    |
|    !=    |          Is not equal         |    2    |
|     :    |        Duplicate value        |    1    |
|     @    |    Remove value from stack    |    1    |
|     u    |  Bring value to end of stack  |    1    |
|     d    | Bring value to front of stack |    1    |
|     !    |              not              |    1    |
|     ~    |          bitwise not          |    1    |

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

Conditional Routines
--------------------

use parenthesis for logical things.

```
10 10 == (
    20
)
```

result: 20 (because 10 == 10)

```
10 (
    20
)
```

result: 20 (but there is 10 different value "20")

so basically with parenthesis we can do both loops and branch.


Example complex calculations
---------------------

### 1
Generate a thousand random values into stack. Add all of them into one value. Divide it by a thousand and find average random value.

```
1000 :: ([=#random]) d -- (+) d /
```


