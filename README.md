# Introduction

`bignum.js` is a Javascript library for doing arbitrary-precision
arithmetic with naturals, integers, rationals, and computable reals.

# How to use

The library gives an interface for `Z`, `Q`, and `R` as a numeric stack, as
in Lisp.  Numbers may be given as Javascript numbers, strings, or
instances of `N`, `Z`, `Q`, and `R`.

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

## Integers

An integer (`Z`) is an immutable object wrapping an `N` and a sign (1
or -1; we use the convention that 0 is positive).

## Rationals

A rational (`Q`) is an immutable object wrapping a pair of integers,
the numerator and denominator.  We keep the invariant that the
denominator is positive.

Rationals can be created directly from a floating-point number.  We
use a Farey sequence to obtain the rational with least denominator
whose binary expansion matches every bit of the original
floating-point number.

## Reals

A computable real (`R`) is a function which takes a rational number
`r` and produces a rational number `q_r` such that for any rational `s
> r`, `|q_r - q_s| < r`.  This is equivalent to a Cauchy sequence.

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