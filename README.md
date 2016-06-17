# Introduction

`bignum.js` is a Javascript library for doing arbitrary-precision
arithmetic with naturals, integers, rationals, and computable reals.

# How to use

The library gives an interface for `Z`, `Q`, and `R` as a numeric stack, as
in Lisp.  Numbers may be given as Javascript numbers, strings, or
instances of `N`, `Z`, `Q`, and `R`.

It is written as a `node` module.  Simply `var bignum =
require('./bignum.js');'.  In addition to the numeric types, the
module also exposes the following functions:

- `num` is used to construct numbers.  This is generally unnecessary
  as the other library functions will construct numbers for you.
  `num` converts `N` to `Z`.
- `sum(a,b)` and `diff(a,b)` compute the sum and difference of `a` and
  `b`, respectively.
- `negate(a)` returns the negative of `a`.
- `abs(a)` returns the absolute value of `a`.
- `prod(a, b)` returns the product of `a` and `b`.
- `divMod(a, b)` returns an object with the quotient and remainder as
  `div` and `mod`, respectively.  These satisfy the relationship `div * b + mod = a`,
  with `div` being `a/b` rounded toward negative
  infinity.  Both `a` and `b` must be integers.
- `quot(a,b)` computes the quotient of `a` and `b`.  The result is a
  rational or real.
- `recip(a)` returns `quot(1, a)`.
- `gcd(a,b)` returns the GCD of integers `a` and `b`.
- `ipow(a,b)` returns `a` raised to the power of `b`.  `b` must be a
  Javascript integer, and `a` cannot (yet) be a real number.
- `factorial(a)` returns the factorial of `a`.
- `compare(a,b)` returns `sign(a - b)`, with `sign(0)=0`.


# Implementation

In this section we describe the implementation of each type.

## Natural numbers

Natural numbers (`N`) are immutable objects wrapping a `Uint16Array`.
Numbers are represented base-65536.

Products are right now calculated using the grade-school algorithm,
but in the future we will have more efficient algorithms for very
large numbers.

Division uses Algorithm D from 4.3.1 of Volume 2 of *The Art of
Computer Programming*, by Knuth.

Methods:
- `n.toString(base)` returns a string representation of the natural
  number in a given base (defaults to base 10).

Functions:
- `N.choose(a, b)` computes the binomial coefficient of natural
  numbers `a` and `b`.

## Integers

An integer (`Z`) is an immutable object wrapping an `N` and a sign (1
or -1; we use the convention that 0 is positive).

Methods:
- `z.toString(base)` returns a string representation of the integer in
  a given base (defaults to base 10).
- `z.toPrecision(digs)` returns a scientific notation representation
  of the integer with the given number of digits (defaults to 16
  digits).

## Rationals

A rational (`Q`) is an immutable object wrapping a pair of integers,
the numerator and denominator.  We keep the invariant that the
denominator is positive.

Rationals can be created directly from a floating-point number.  We
use a Farey sequence to obtain the rational with least denominator
whose binary expansion matches every bit of the original
floating-point number.

Methods:
- `q.toString(base)` returns a string representation of the rational
  number a given base (defaults to base 10).
- `q.toPrecision(digs)` returns a scientific notation representation
  of the rational number with the given number of digits (defaults to
  16 digits).  The algorithm is base-10 long division.
- `q.toFixed(digs)` is like `toPrecision`, but is given in as a
  fixed-point string representation.

Functions:
- `Q.ifrac(a)` returns the integer and fractional part of `a` as an
  object.  `ipart` is an integer and `fpart` is a rational.
- `Q.cfrac(a)` returns a continued fraction representation of `a` as a
  list of integers.
- `Q.fromCfrac(cfrac)` returns the rational number represented by the
  continued fraction representation `cfrac`.
- `Q.choose(a, b)` computes the binomial coefficient for `a` a
  rational and `b` an integer.

## Reals

A computable real (`R`) is a function which takes a rational number
`r` and produces a rational number `q_r` such that for any rational
`s > r`, `|q_r - q_s| < r`.  This is equivalent to a Cauchy sequence.

As an optimization, a computable real also memoizes its result, so
that the most-accurate result obtained so far will be the one returned
no matter the bound.

The algorithms for sums, products, quotients, and the rest are not
particularly smart, but are generally direct implementations of
textbook epsilon-delta proofs.

There is an algorithm for square roots given in `test_bignum.js`, but
it is very naive.

Beware that computable real numbers cannot be compared, since such an
operation is not computable.  The problem is that, while you can check
numbers digit-by-digit for equality, you have no idea how many digits
you will have to inspect before the numbers diverge.  You can ask
whether two numbers are within some positive rational distance from
each other, however.

Methods:
- `r.toFixed(digs)` returns a fixed-point representation of the real
  number evaluated to the given number of digits past the decimal
  point.
- `r.toString()` calls `r.toFixed(16)`.
