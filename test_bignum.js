var bignum = require("./bignum.js");
var Nbuf = bignum.Nbuf,
    N = bignum.N,
    Z = bignum.Z,
    Q = bignum.Q,
    R = bignum.R;

var b, c;
b = Nbuf.fromNum(12312312);
console.log(b);
console.log(Nbuf.toString(b));

b = Nbuf.fromString("123123123123");
c = Nbuf.fromString("123123");
console.log(b);
console.log(Nbuf.toString(b));
console.log(Nbuf.smalldiv(b, b, 3, b.length));
console.log(b);
console.log(Nbuf.toString(b));

b = N.create("123123123123");
c = N.create("123123");
console.log(N.prod(b, c));

console.log(N.choose(100,50));

function test1(t, m, n) {
  t = N.create(t);
  m = 0|m;
  n = 0|n;
  var v1 = N.prod(N.diff(N.ipow(t, m), N.create(1)),
                  N.diff(N.ipow(t, n), N.create(1)));
  var v2 = N.sum(N.diff(N.diff(N.ipow(t, m+n),
                               N.ipow(t, n)),
                        N.ipow(t, m)),
                 N.create(1));
  if (N.compare(v1, v2) != 0) {
    throw new Error("test1 failed");
  }
  return "OK";
}

test1(N.create(100), 5, 6);
test1(N.create(10), 3, 8);
test1(N.create(5), 10, 20);
test1(N.create(70000), 3, 5);
test1(N.create(123123123), 100, 200);

function test2(a, b) {
  a = N.create(a);
  b = N.create(b);
  var qr = N.divMod(a, b);
  var a2 = N.sum(N.prod(b, qr.div), qr.mod);
  if (N.compare(a, a2) != 0) {
    throw new Error("test2 failed");
  }
  return "OK";
}

test2(100, 3);
test2(10000, 3);
test2(1000000, 3);
test2(N.create("100000"), N.create("90000"));
test2(N.create("123123123"), N.create("321321"));
test2(N.factorial(29), N.factorial(10));
test2(N.factorial(50), N.factorial(25));
test2(N.factorial(100), N.ipow(N.create(17), 20));


function test_divMod(a, b) {
  var dm = Z.divMod(a, b);
  var a2 = Z.sum(Z.prod(dm.div, b), dm.mod);
  if (Z.compare(a2, Z.create(a)) != 0) {
    console.error(a, b);
    throw new Error("divMod failure");
  }
}
test_divMod(5, 3);
test_divMod(-5, 3);
test_divMod(5, -3);
test_divMod(-5, -3);
test_divMod(3, 5);
test_divMod(3, -5);
test_divMod(-3, 5);
test_divMod(-3, -5);
test_divMod(1000000, 333333);
test_divMod(1000000, -333333);
test_divMod(-1000000, 333333);
test_divMod(-1000000, -333333);
test_divMod(333333, 1000000);
test_divMod(333333, -1000000);
test_divMod(-333333, 1000000);
test_divMod(-333333, -1000000);

console.log(bignum.factorial(50));

console.log(Q.choose(1000,500).toPrecision(6));

console.log(Q.create(Math.PI));


function computeE_Z(ndigs, maxn) {
  // using only integers
  var one = bignum.ipow("10", ndigs);
  var e = one;
  for (var i = maxn; i >= 1; i--) {
    e = bignum.divMod(bignum.sum(one, e), i).div;
  }
  return bignum.sum(one, e);
}
console.log(computeE_Z(100, 1000));

function computeE_Q(N) {
  var e = bignum.num(1);
  for (; N >= 1; N--) {
    e = bignum.quot(bignum.sum(1, e), N);
  }
  return bignum.sum(1, e);
}
console.log(computeE_Q(70).toFixed(100));

var sillyZero = new R(function (r) {
  return bignum.quot(r, 2);
});

console.log(sillyZero.toString());

var sillyOne = new R(function (r) {
  return bignum.diff(1, bignum.quot(r, 2));
});

console.log(sillyOne.toString());

var sqrt2 = new R(function (r) {
  var one = Q.create(1);
  function s(t) {
    if (bignum.compare(t, r) <= 0) {
      return one;
    } else {
      var sn = s(bignum.prod(t, t));
      var sn2 = bignum.sum(bignum.quot(sn, 2),
                           bignum.recip(sn));
      return sn2;
    }
  }
  var sn = s(bignum.num("1/2"));
  return sn;
});

console.log(sqrt2.toFixed(50));

function sqrtq(q) {
  var g1 = bignum.quot(q, 2);
  return new R(function (r) {
    var guess = g1;
    while (true) {
      var guess2 = bignum.quot(bignum.sum(guess, bignum.quot(q, guess)), 2);
      if (bignum.compare(bignum.abs(bignum.diff(guess2, guess)), r) < 0) {
        return guess2;
      }
      guess = guess2;
    }
  });
}
function sqrt(x) {
  x = R.create(x);
  var sqxlb = R.lower(R.min(x, R.create(1)));
  return new R(function (r) {
    var r2 = bignum.quot(r, 2);
    var lb = sqxlb.ev(r2);
    r = Q.min(r, lb);
    var delta = bignum.prod(r, bignum.diff(bignum.prod(2, lb), r));
    return sqrtq(x.ev(delta)).ev(r2);
  });
}

console.log(sqrt(2).toFixed(50));

var phi = bignum.sum(1/2, sqrt(5/4));
console.log(phi.toFixed(50));

console.log(Q.cfrac(phi.ev(bignum.ipow(10,-10))).slice(0,10));

// fibonacci generating function f(1/10)
console.log(bignum.quot(100,9899).toFixed(20));
