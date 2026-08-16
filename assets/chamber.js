var Go, zo, Vo, Ho, Wo, qo, Xo, Ko, jo;
var il = "attached";
var Br = 1e3, ai = 1001, Gr = 1002, Et = 1003, Yo = 1004, Jo = 1005, Lt = 1006, $o = 1007, nr = 1008, Ui = 1009, nl = 1010, rl = 1011, Zo = 1012, sl = 1013, Ki = 1014, wn = 1015, ji = 1016, Qo = 1017, ec = 1018, tc = 1020, al = 35902, ol = 35899, cl = 1021, ll = 1022, xn = 1023, Jn = 1026, ic = 1027, nc = 1028, rc = 1029, zr = 1030, sc = 1031, ac = 1033, hl = 33776, dl = 33777, ul = 33778, fl = 33779, pl = 35840, ml = 35841, gl = 35842, vl = 35843, bl = 36196, _l = 37492, Ml = 37496, xl = 37488, Sl = 37489, yl = 37490, El = 37491, Tl = 37808, Al = 37809, wl = 37810, Rl = 37811, Cl = 37812, Pl = 37813, Ll = 37814, Dl = 37815, Il = 37816, Nl = 37817, Ul = 37818, Fl = 37819, Ol = 37820, kl = 37821, Bl = 36492, Gl = 36494, zl = 36495, Vl = 36283, Hl = 36284, Wl = 36285, ql = 36286, $n = 2300, Zn = 2301, ns = 2302, ba = 2303, _a = 2400, Ma = 2401, xa = 2402, Xl = 2500, Kl = 3200;
var vt = "srgb", Zt = "srgb-linear", Vr = "linear", Hr = "srgb", rs = 7680;
var oc = 35044;
var Sn = 2e3;
function jl(e) {
  for (let t = e.length - 1; t >= 0; --t) if (e[t] >= 65535) return !0;
  return !1;
}
function Yl(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Qn(e) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", e);
}
function Jl() {
  const e = Qn("canvas");
  return e.style.display = "block", e;
}
var Sa = {}, yn = null;
function Wr(...e) {
  const t = "THREE." + e.shift();
  yn ? yn("log", t, ...e) : console.log(t, ...e);
}
function cc(e) {
  const t = e[0];
  if (typeof t == "string" && t.startsWith("TSL:")) {
    const i = e[1];
    i && i.isStackTrace ? e[0] += " " + i.getLocation() : e[1] = 'Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.';
  }
  return e;
}
function xe(...e) {
  e = cc(e);
  const t = "THREE." + e.shift();
  if (yn) yn("warn", t, ...e);
  else {
    const i = e[0];
    i && i.isStackTrace ? console.warn(i.getError(t)) : console.warn(t, ...e);
  }
}
function Re(...e) {
  e = cc(e);
  const t = "THREE." + e.shift();
  if (yn) yn("error", t, ...e);
  else {
    const i = e[0];
    i && i.isStackTrace ? console.error(i.getError(t)) : console.error(t, ...e);
  }
}
function bn(...e) {
  const t = e.join(" ");
  t in Sa || (Sa[t] = !0, xe(...e));
}
function $l(e, t, i) {
  return new Promise(function(n, r) {
    function s() {
      switch (e.clientWaitSync(t, e.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case e.WAIT_FAILED:
          r();
          break;
        case e.TIMEOUT_EXPIRED:
          setTimeout(s, i);
          break;
        default:
          n();
      }
    }
    setTimeout(s, i);
  });
}
var Zl = {
  0: 1,
  2: 6,
  4: 7,
  3: 5,
  1: 0,
  6: 2,
  7: 4,
  5: 3
}, Yi = class {
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const i = this._listeners;
    i[e] === void 0 && (i[e] = []), i[e].indexOf(t) === -1 && i[e].push(t);
  }
  hasEventListener(e, t) {
    const i = this._listeners;
    return i === void 0 ? !1 : i[e] !== void 0 && i[e].indexOf(t) !== -1;
  }
  removeEventListener(e, t) {
    const i = this._listeners;
    if (i === void 0) return;
    const n = i[e];
    if (n !== void 0) {
      const r = n.indexOf(t);
      r !== -1 && n.splice(r, 1);
    }
  }
  dispatchEvent(e) {
    const t = this._listeners;
    if (t === void 0) return;
    const i = t[e.type];
    if (i !== void 0) {
      e.target = this;
      const n = i.slice(0);
      for (let r = 0, s = n.length; r < s; r++) n[r].call(this, e);
      e.target = null;
    }
  }
}, xt = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "0a",
  "0b",
  "0c",
  "0d",
  "0e",
  "0f",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "1a",
  "1b",
  "1c",
  "1d",
  "1e",
  "1f",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "2a",
  "2b",
  "2c",
  "2d",
  "2e",
  "2f",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "3a",
  "3b",
  "3c",
  "3d",
  "3e",
  "3f",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "4a",
  "4b",
  "4c",
  "4d",
  "4e",
  "4f",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "5a",
  "5b",
  "5c",
  "5d",
  "5e",
  "5f",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "6a",
  "6b",
  "6c",
  "6d",
  "6e",
  "6f",
  "70",
  "71",
  "72",
  "73",
  "74",
  "75",
  "76",
  "77",
  "78",
  "79",
  "7a",
  "7b",
  "7c",
  "7d",
  "7e",
  "7f",
  "80",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "8a",
  "8b",
  "8c",
  "8d",
  "8e",
  "8f",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
  "9a",
  "9b",
  "9c",
  "9d",
  "9e",
  "9f",
  "a0",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
  "a9",
  "aa",
  "ab",
  "ac",
  "ad",
  "ae",
  "af",
  "b0",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
  "ba",
  "bb",
  "bc",
  "bd",
  "be",
  "bf",
  "c0",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "c9",
  "ca",
  "cb",
  "cc",
  "cd",
  "ce",
  "cf",
  "d0",
  "d1",
  "d2",
  "d3",
  "d4",
  "d5",
  "d6",
  "d7",
  "d8",
  "d9",
  "da",
  "db",
  "dc",
  "dd",
  "de",
  "df",
  "e0",
  "e1",
  "e2",
  "e3",
  "e4",
  "e5",
  "e6",
  "e7",
  "e8",
  "e9",
  "ea",
  "eb",
  "ec",
  "ed",
  "ee",
  "ef",
  "f0",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "fa",
  "fb",
  "fc",
  "fd",
  "fe",
  "ff"
], ya = 1234567, Kn = Math.PI / 180, En = 180 / Math.PI;
function $t() {
  const e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, i = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (xt[e & 255] + xt[e >> 8 & 255] + xt[e >> 16 & 255] + xt[e >> 24 & 255] + "-" + xt[t & 255] + xt[t >> 8 & 255] + "-" + xt[t >> 16 & 15 | 64] + xt[t >> 24 & 255] + "-" + xt[i & 63 | 128] + xt[i >> 8 & 255] + "-" + xt[i >> 16 & 255] + xt[i >> 24 & 255] + xt[n & 255] + xt[n >> 8 & 255] + xt[n >> 16 & 255] + xt[n >> 24 & 255]).toLowerCase();
}
function ze(e, t, i) {
  return Math.max(t, Math.min(i, e));
}
function Qs(e, t) {
  return (e % t + t) % t;
}
function Ql(e, t, i, n, r) {
  return n + (e - t) * (r - n) / (i - t);
}
function eh(e, t, i) {
  return e !== t ? (i - e) / (t - e) : 0;
}
function jn(e, t, i) {
  return (1 - i) * e + i * t;
}
function th(e, t, i, n) {
  return jn(e, t, 1 - Math.exp(-i * n));
}
function ih(e, t = 1) {
  return t - Math.abs(Qs(e, t * 2) - t);
}
function nh(e, t, i) {
  return e <= t ? 0 : e >= i ? 1 : (e = (e - t) / (i - t), e * e * (3 - 2 * e));
}
function rh(e, t, i) {
  return e <= t ? 0 : e >= i ? 1 : (e = (e - t) / (i - t), e * e * e * (e * (e * 6 - 15) + 10));
}
function sh(e, t) {
  return e + Math.floor(Math.random() * (t - e + 1));
}
function ah(e, t) {
  return e + Math.random() * (t - e);
}
function oh(e) {
  return e * (0.5 - Math.random());
}
function ch(e) {
  e !== void 0 && (ya = e);
  let t = ya += 1831565813;
  return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function lh(e) {
  return e * Kn;
}
function hh(e) {
  return e * En;
}
function dh(e) {
  return (e & e - 1) === 0 && e !== 0;
}
function uh(e) {
  return Math.pow(2, Math.ceil(Math.log(e) / Math.LN2));
}
function fh(e) {
  return Math.pow(2, Math.floor(Math.log(e) / Math.LN2));
}
function ph(e, t, i, n, r) {
  const s = Math.cos, a = Math.sin, o = s(i / 2), c = a(i / 2), l = s((t + n) / 2), h = a((t + n) / 2), u = s((t - n) / 2), d = a((t - n) / 2), p = s((n - t) / 2), g = a((n - t) / 2);
  switch (r) {
    case "XYX":
      e.set(o * h, c * u, c * d, o * l);
      break;
    case "YZY":
      e.set(c * d, o * h, c * u, o * l);
      break;
    case "ZXZ":
      e.set(c * u, c * d, o * h, o * l);
      break;
    case "XZX":
      e.set(o * h, c * g, c * p, o * l);
      break;
    case "YXY":
      e.set(c * p, o * h, c * g, o * l);
      break;
    case "ZYZ":
      e.set(c * g, c * p, o * h, o * l);
      break;
    default:
      xe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + r);
  }
}
function Yt(e, t) {
  switch (t.constructor) {
    case Float32Array:
      return e;
    case Uint32Array:
      return e / 4294967295;
    case Uint16Array:
      return e / 65535;
    case Uint8Array:
      return e / 255;
    case Int32Array:
      return Math.max(e / 2147483647, -1);
    case Int16Array:
      return Math.max(e / 32767, -1);
    case Int8Array:
      return Math.max(e / 127, -1);
    default:
      throw new Error("THREE.MathUtils: Invalid component type.");
  }
}
function Ye(e, t) {
  switch (t.constructor) {
    case Float32Array:
      return e;
    case Uint32Array:
      return Math.round(e * 4294967295);
    case Uint16Array:
      return Math.round(e * 65535);
    case Uint8Array:
      return Math.round(e * 255);
    case Int32Array:
      return Math.round(e * 2147483647);
    case Int16Array:
      return Math.round(e * 32767);
    case Int8Array:
      return Math.round(e * 127);
    default:
      throw new Error("THREE.MathUtils: Invalid component type.");
  }
}
var er = {
  DEG2RAD: Kn,
  RAD2DEG: En,
  generateUUID: $t,
  clamp: ze,
  euclideanModulo: Qs,
  mapLinear: Ql,
  inverseLerp: eh,
  lerp: jn,
  damp: th,
  pingpong: ih,
  smoothstep: nh,
  smootherstep: rh,
  randInt: sh,
  randFloat: ah,
  randFloatSpread: oh,
  seededRandom: ch,
  degToRad: lh,
  radToDeg: hh,
  isPowerOfTwo: dh,
  ceilPowerOfTwo: uh,
  floorPowerOfTwo: fh,
  setQuaternionFromProperEuler: ph,
  normalize: Ye,
  denormalize: Yt
};
Xo = Symbol.iterator;
var Fe = class {
  constructor(e = 0, t = 0) {
    this.x = e, this.y = t;
  }
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  set(e, t) {
    return this.x = e, this.y = t, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("THREE.Vector2: index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("THREE.Vector2: index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  applyMatrix3(e) {
    const t = this.x, i = this.y, n = e.elements;
    return this.x = n[0] * t + n[3] * i + n[6], this.y = n[1] * t + n[4] * i + n[7], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }
  clamp(e, t) {
    return this.x = ze(this.x, e.x, t.x), this.y = ze(this.y, e.y, t.y), this;
  }
  clampScalar(e, t) {
    return this.x = ze(this.x, e, t), this.y = ze(this.y, e, t), this;
  }
  clampLength(e, t) {
    const i = this.length();
    return this.divideScalar(i || 1).multiplyScalar(ze(i, e, t));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const i = this.dot(e) / t;
    return Math.acos(ze(i, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, i = this.y - e.y;
    return t * t + i * i;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
  }
  lerpVectors(e, t, i) {
    return this.x = e.x + (t.x - e.x) * i, this.y = e.y + (t.y - e.y) * i, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this;
  }
  rotateAround(e, t) {
    const i = Math.cos(t), n = Math.sin(t), r = this.x - e.x, s = this.y - e.y;
    return this.x = r * i - s * n + e.x, this.y = r * n + s * i + e.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Xo]() {
    yield this.x, yield this.y;
  }
};
Go = Fe;
Go.prototype.isVector2 = !0;
var Ht = class {
  constructor(e = 0, t = 0, i = 0, n = 1) {
    this.isQuaternion = !0, this._x = e, this._y = t, this._z = i, this._w = n;
  }
  static slerpFlat(e, t, i, n, r, s, a) {
    let o = i[n + 0], c = i[n + 1], l = i[n + 2], h = i[n + 3], u = r[s + 0], d = r[s + 1], p = r[s + 2], g = r[s + 3];
    if (h !== g || o !== u || c !== d || l !== p) {
      let _ = o * u + c * d + l * p + h * g;
      _ < 0 && (u = -u, d = -d, p = -p, g = -g, _ = -_);
      let m = 1 - a;
      if (_ < 0.9995) {
        const f = Math.acos(_), T = Math.sin(f);
        m = Math.sin(m * f) / T, a = Math.sin(a * f) / T, o = o * m + u * a, c = c * m + d * a, l = l * m + p * a, h = h * m + g * a;
      } else {
        o = o * m + u * a, c = c * m + d * a, l = l * m + p * a, h = h * m + g * a;
        const f = 1 / Math.sqrt(o * o + c * c + l * l + h * h);
        o *= f, c *= f, l *= f, h *= f;
      }
    }
    e[t] = o, e[t + 1] = c, e[t + 2] = l, e[t + 3] = h;
  }
  static multiplyQuaternionsFlat(e, t, i, n, r, s) {
    const a = i[n], o = i[n + 1], c = i[n + 2], l = i[n + 3], h = r[s], u = r[s + 1], d = r[s + 2], p = r[s + 3];
    return e[t] = a * p + l * h + o * d - c * u, e[t + 1] = o * p + l * u + c * h - a * d, e[t + 2] = c * p + l * d + a * u - o * h, e[t + 3] = l * p - a * h - o * u - c * d, e;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }
  set(e, t, i, n) {
    return this._x = e, this._y = t, this._z = i, this._w = n, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }
  setFromEuler(e, t = !0) {
    const i = e._x, n = e._y, r = e._z, s = e._order, a = Math.cos, o = Math.sin, c = a(i / 2), l = a(n / 2), h = a(r / 2), u = o(i / 2), d = o(n / 2), p = o(r / 2);
    switch (s) {
      case "XYZ":
        this._x = u * l * h + c * d * p, this._y = c * d * h - u * l * p, this._z = c * l * p + u * d * h, this._w = c * l * h - u * d * p;
        break;
      case "YXZ":
        this._x = u * l * h + c * d * p, this._y = c * d * h - u * l * p, this._z = c * l * p - u * d * h, this._w = c * l * h + u * d * p;
        break;
      case "ZXY":
        this._x = u * l * h - c * d * p, this._y = c * d * h + u * l * p, this._z = c * l * p + u * d * h, this._w = c * l * h - u * d * p;
        break;
      case "ZYX":
        this._x = u * l * h - c * d * p, this._y = c * d * h + u * l * p, this._z = c * l * p - u * d * h, this._w = c * l * h + u * d * p;
        break;
      case "YZX":
        this._x = u * l * h + c * d * p, this._y = c * d * h + u * l * p, this._z = c * l * p - u * d * h, this._w = c * l * h - u * d * p;
        break;
      case "XZY":
        this._x = u * l * h - c * d * p, this._y = c * d * h - u * l * p, this._z = c * l * p + u * d * h, this._w = c * l * h + u * d * p;
        break;
      default:
        xe("Quaternion: .setFromEuler() encountered an unknown order: " + s);
    }
    return t === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(e, t) {
    const i = t / 2, n = Math.sin(i);
    return this._x = e.x * n, this._y = e.y * n, this._z = e.z * n, this._w = Math.cos(i), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e) {
    const t = e.elements, i = t[0], n = t[4], r = t[8], s = t[1], a = t[5], o = t[9], c = t[2], l = t[6], h = t[10], u = i + a + h;
    if (u > 0) {
      const d = 0.5 / Math.sqrt(u + 1);
      this._w = 0.25 / d, this._x = (l - o) * d, this._y = (r - c) * d, this._z = (s - n) * d;
    } else if (i > a && i > h) {
      const d = 2 * Math.sqrt(1 + i - a - h);
      this._w = (l - o) / d, this._x = 0.25 * d, this._y = (n + s) / d, this._z = (r + c) / d;
    } else if (a > h) {
      const d = 2 * Math.sqrt(1 + a - i - h);
      this._w = (r - c) / d, this._x = (n + s) / d, this._y = 0.25 * d, this._z = (o + l) / d;
    } else {
      const d = 2 * Math.sqrt(1 + h - i - a);
      this._w = (s - n) / d, this._x = (r + c) / d, this._y = (o + l) / d, this._z = 0.25 * d;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(e, t) {
    let i = e.dot(t) + 1;
    return i < 1e-8 ? (i = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = i) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = i)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = i), this.normalize();
  }
  angleTo(e) {
    return 2 * Math.acos(Math.abs(ze(this.dot(e), -1, 1)));
  }
  rotateTowards(e, t) {
    const i = this.angleTo(e);
    if (i === 0) return this;
    const n = Math.min(1, t / i);
    return this.slerp(e, n), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  multiplyQuaternions(e, t) {
    const i = e._x, n = e._y, r = e._z, s = e._w, a = t._x, o = t._y, c = t._z, l = t._w;
    return this._x = i * l + s * a + n * c - r * o, this._y = n * l + s * o + r * a - i * c, this._z = r * l + s * c + i * o - n * a, this._w = s * l - i * a - n * o - r * c, this._onChangeCallback(), this;
  }
  slerp(e, t) {
    let i = e._x, n = e._y, r = e._z, s = e._w, a = this.dot(e);
    a < 0 && (i = -i, n = -n, r = -r, s = -s, a = -a);
    let o = 1 - t;
    if (a < 0.9995) {
      const c = Math.acos(a), l = Math.sin(c);
      o = Math.sin(o * c) / l, t = Math.sin(t * c) / l, this._x = this._x * o + i * t, this._y = this._y * o + n * t, this._z = this._z * o + r * t, this._w = this._w * o + s * t, this._onChangeCallback();
    } else
      this._x = this._x * o + i * t, this._y = this._y * o + n * t, this._z = this._z * o + r * t, this._w = this._w * o + s * t, this.normalize();
    return this;
  }
  slerpQuaternions(e, t, i) {
    return this.copy(e).slerp(t, i);
  }
  random() {
    const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), i = Math.random(), n = Math.sqrt(1 - i), r = Math.sqrt(i);
    return this.set(n * Math.sin(e), n * Math.cos(e), r * Math.sin(t), r * Math.cos(t));
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  fromArray(e, t = 0) {
    return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
  }
  fromBufferAttribute(e, t) {
    return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
};
Ko = Symbol.iterator;
var U = class {
  constructor(e = 0, t = 0, i = 0) {
    this.x = e, this.y = t, this.z = i;
  }
  set(e, t, i) {
    return i === void 0 && (i = this.z), this.x = e, this.y = t, this.z = i, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("THREE.Vector3: index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("THREE.Vector3: index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }
  multiplyVectors(e, t) {
    return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
  }
  applyEuler(e) {
    return this.applyQuaternion(Ea.setFromEuler(e));
  }
  applyAxisAngle(e, t) {
    return this.applyQuaternion(Ea.setFromAxisAngle(e, t));
  }
  applyMatrix3(e) {
    const t = this.x, i = this.y, n = this.z, r = e.elements;
    return this.x = r[0] * t + r[3] * i + r[6] * n, this.y = r[1] * t + r[4] * i + r[7] * n, this.z = r[2] * t + r[5] * i + r[8] * n, this;
  }
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  applyMatrix4(e) {
    const t = this.x, i = this.y, n = this.z, r = e.elements, s = 1 / (r[3] * t + r[7] * i + r[11] * n + r[15]);
    return this.x = (r[0] * t + r[4] * i + r[8] * n + r[12]) * s, this.y = (r[1] * t + r[5] * i + r[9] * n + r[13]) * s, this.z = (r[2] * t + r[6] * i + r[10] * n + r[14]) * s, this;
  }
  applyQuaternion(e) {
    const t = this.x, i = this.y, n = this.z, r = e.x, s = e.y, a = e.z, o = e.w, c = 2 * (s * n - a * i), l = 2 * (a * t - r * n), h = 2 * (r * i - s * t);
    return this.x = t + o * c + s * h - a * l, this.y = i + o * l + a * c - r * h, this.z = n + o * h + r * l - s * c, this;
  }
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  transformDirection(e) {
    const t = this.x, i = this.y, n = this.z, r = e.elements;
    return this.x = r[0] * t + r[4] * i + r[8] * n, this.y = r[1] * t + r[5] * i + r[9] * n, this.z = r[2] * t + r[6] * i + r[10] * n, this.normalize();
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }
  clamp(e, t) {
    return this.x = ze(this.x, e.x, t.x), this.y = ze(this.y, e.y, t.y), this.z = ze(this.z, e.z, t.z), this;
  }
  clampScalar(e, t) {
    return this.x = ze(this.x, e, t), this.y = ze(this.y, e, t), this.z = ze(this.z, e, t), this;
  }
  clampLength(e, t) {
    const i = this.length();
    return this.divideScalar(i || 1).multiplyScalar(ze(i, e, t));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
  }
  lerpVectors(e, t, i) {
    return this.x = e.x + (t.x - e.x) * i, this.y = e.y + (t.y - e.y) * i, this.z = e.z + (t.z - e.z) * i, this;
  }
  cross(e) {
    return this.crossVectors(this, e);
  }
  crossVectors(e, t) {
    const i = e.x, n = e.y, r = e.z, s = t.x, a = t.y, o = t.z;
    return this.x = n * o - r * a, this.y = r * s - i * o, this.z = i * a - n * s, this;
  }
  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0) return this.set(0, 0, 0);
    const i = e.dot(this) / t;
    return this.copy(e).multiplyScalar(i);
  }
  projectOnPlane(e) {
    return ss.copy(this).projectOnVector(e), this.sub(ss);
  }
  reflect(e) {
    return this.sub(ss.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const i = this.dot(e) / t;
    return Math.acos(ze(i, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, i = this.y - e.y, n = this.z - e.z;
    return t * t + i * i + n * n;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  setFromSphericalCoords(e, t, i) {
    const n = Math.sin(t) * e;
    return this.x = n * Math.sin(i), this.y = Math.cos(t) * e, this.z = n * Math.cos(i), this;
  }
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  setFromCylindricalCoords(e, t, i) {
    return this.x = e * Math.sin(t), this.y = i, this.z = e * Math.cos(t), this;
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this;
  }
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(), i = this.setFromMatrixColumn(e, 1).length(), n = this.setFromMatrixColumn(e, 2).length();
    return this.x = t, this.y = i, this.z = n, this;
  }
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }
  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }
  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, i = Math.sqrt(1 - t * t);
    return this.x = i * Math.cos(e), this.y = t, this.z = i * Math.sin(e), this;
  }
  *[Ko]() {
    yield this.x, yield this.y, yield this.z;
  }
};
zo = U;
zo.prototype.isVector3 = !0;
var ss = /* @__PURE__ */ new U(), Ea = /* @__PURE__ */ new Ht(), Ie = class {
  constructor(e, t, i, n, r, s, a, o, c) {
    this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, i, n, r, s, a, o, c);
  }
  set(e, t, i, n, r, s, a, o, c) {
    const l = this.elements;
    return l[0] = e, l[1] = n, l[2] = a, l[3] = t, l[4] = r, l[5] = o, l[6] = i, l[7] = s, l[8] = c, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
  }
  copy(e) {
    const t = this.elements, i = e.elements;
    return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t[4] = i[4], t[5] = i[5], t[6] = i[6], t[7] = i[7], t[8] = i[8], this;
  }
  extractBasis(e, t, i) {
    return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), i.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(e) {
    const t = e.elements;
    return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const i = e.elements, n = t.elements, r = this.elements, s = i[0], a = i[3], o = i[6], c = i[1], l = i[4], h = i[7], u = i[2], d = i[5], p = i[8], g = n[0], _ = n[3], m = n[6], f = n[1], T = n[4], A = n[7], M = n[2], E = n[5], w = n[8];
    return r[0] = s * g + a * f + o * M, r[3] = s * _ + a * T + o * E, r[6] = s * m + a * A + o * w, r[1] = c * g + l * f + h * M, r[4] = c * _ + l * T + h * E, r[7] = c * m + l * A + h * w, r[2] = u * g + d * f + p * M, r[5] = u * _ + d * T + p * E, r[8] = u * m + d * A + p * w, this;
  }
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
  }
  determinant() {
    const e = this.elements, t = e[0], i = e[1], n = e[2], r = e[3], s = e[4], a = e[5], o = e[6], c = e[7], l = e[8];
    return t * s * l - t * a * c - i * r * l + i * a * o + n * r * c - n * s * o;
  }
  invert() {
    const e = this.elements, t = e[0], i = e[1], n = e[2], r = e[3], s = e[4], a = e[5], o = e[6], c = e[7], l = e[8], h = l * s - a * c, u = a * o - l * r, d = c * r - s * o, p = t * h + i * u + n * d;
    if (p === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const g = 1 / p;
    return e[0] = h * g, e[1] = (n * c - l * i) * g, e[2] = (a * i - n * s) * g, e[3] = u * g, e[4] = (l * t - n * o) * g, e[5] = (n * r - a * t) * g, e[6] = d * g, e[7] = (i * o - c * t) * g, e[8] = (s * t - i * r) * g, this;
  }
  transpose() {
    let e;
    const t = this.elements;
    return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
  }
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }
  transposeIntoArray(e) {
    const t = this.elements;
    return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
  }
  setUvTransform(e, t, i, n, r, s, a) {
    const o = Math.cos(r), c = Math.sin(r);
    return this.set(i * o, i * c, -i * (o * s + c * a) + s + e, -n * c, n * o, -n * (-c * s + o * a) + a + t, 0, 0, 1), this;
  }
  scale(e, t) {
    return bn("Matrix3: .scale() is deprecated. Use .makeScale() instead."), this.premultiply(as.makeScale(e, t)), this;
  }
  rotate(e) {
    return bn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."), this.premultiply(as.makeRotation(-e)), this;
  }
  translate(e, t) {
    return bn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."), this.premultiply(as.makeTranslation(e, t)), this;
  }
  makeTranslation(e, t) {
    return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this;
  }
  makeRotation(e) {
    const t = Math.cos(e), i = Math.sin(e);
    return this.set(t, -i, 0, i, t, 0, 0, 0, 1), this;
  }
  makeScale(e, t) {
    return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
  }
  equals(e) {
    const t = this.elements, i = e.elements;
    for (let n = 0; n < 9; n++) if (t[n] !== i[n]) return !1;
    return !0;
  }
  fromArray(e, t = 0) {
    for (let i = 0; i < 9; i++) this.elements[i] = e[i + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const i = this.elements;
    return e[t] = i[0], e[t + 1] = i[1], e[t + 2] = i[2], e[t + 3] = i[3], e[t + 4] = i[4], e[t + 5] = i[5], e[t + 6] = i[6], e[t + 7] = i[7], e[t + 8] = i[8], e;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
};
Vo = Ie;
Vo.prototype.isMatrix3 = !0;
var as = /* @__PURE__ */ new Ie(), Ta = /* @__PURE__ */ new Ie().set(0.4123908, 0.3575843, 0.1804808, 0.212639, 0.7151687, 0.0721923, 0.0193308, 0.1191948, 0.9505322), Aa = /* @__PURE__ */ new Ie().set(3.2409699, -1.5373832, -0.4986108, -0.9692436, 1.8759675, 0.0415551, 0.0556301, -0.203977, 1.0569715);
function mh() {
  const e = {
    enabled: !0,
    workingColorSpace: Zt,
    spaces: {},
    convert: function(r, s, a) {
      return this.enabled === !1 || s === a || !s || !a || (this.spaces[s].transfer === "srgb" && (r.r = Mi(r.r), r.g = Mi(r.g), r.b = Mi(r.b)), this.spaces[s].primaries !== this.spaces[a].primaries && (r.applyMatrix3(this.spaces[s].toXYZ), r.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === "srgb" && (r.r = _n(r.r), r.g = _n(r.g), r.b = _n(r.b))), r;
    },
    workingToColorSpace: function(r, s) {
      return this.convert(r, this.workingColorSpace, s);
    },
    colorSpaceToWorking: function(r, s) {
      return this.convert(r, s, this.workingColorSpace);
    },
    getPrimaries: function(r) {
      return this.spaces[r].primaries;
    },
    getTransfer: function(r) {
      return r === "" ? Vr : this.spaces[r].transfer;
    },
    getToneMappingMode: function(r) {
      return this.spaces[r].outputColorSpaceConfig.toneMappingMode || "standard";
    },
    getLuminanceCoefficients: function(r, s = this.workingColorSpace) {
      return r.fromArray(this.spaces[s].luminanceCoefficients);
    },
    define: function(r) {
      Object.assign(this.spaces, r);
    },
    _getMatrix: function(r, s, a) {
      return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ);
    },
    _getDrawingBufferColorSpace: function(r) {
      return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace;
    },
    _getUnpackColorSpace: function(r = this.workingColorSpace) {
      return this.spaces[r].workingColorSpaceConfig.unpackColorSpace;
    },
    fromWorkingColorSpace: function(r, s) {
      return bn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), e.workingToColorSpace(r, s);
    },
    toWorkingColorSpace: function(r, s) {
      return bn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), e.colorSpaceToWorking(r, s);
    }
  }, t = [
    0.64,
    0.33,
    0.3,
    0.6,
    0.15,
    0.06
  ], i = [
    0.2126,
    0.7152,
    0.0722
  ], n = [0.3127, 0.329];
  return e.define({
    [Zt]: {
      primaries: t,
      whitePoint: n,
      transfer: Vr,
      toXYZ: Ta,
      fromXYZ: Aa,
      luminanceCoefficients: i,
      workingColorSpaceConfig: { unpackColorSpace: vt },
      outputColorSpaceConfig: { drawingBufferColorSpace: vt }
    },
    [vt]: {
      primaries: t,
      whitePoint: n,
      transfer: Hr,
      toXYZ: Ta,
      fromXYZ: Aa,
      luminanceCoefficients: i,
      outputColorSpaceConfig: { drawingBufferColorSpace: vt }
    }
  }), e;
}
var Ge = /* @__PURE__ */ mh();
function Mi(e) {
  return e < 0.04045 ? e * 0.0773993808 : Math.pow(e * 0.9478672986 + 0.0521327014, 2.4);
}
function _n(e) {
  return e < 31308e-7 ? e * 12.92 : 1.055 * Math.pow(e, 0.41666) - 0.055;
}
var Zi, gh = class {
  static getDataURL(e, t = "image/png") {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
    let i;
    if (e instanceof HTMLCanvasElement) i = e;
    else {
      Zi === void 0 && (Zi = Qn("canvas")), Zi.width = e.width, Zi.height = e.height;
      const n = Zi.getContext("2d");
      e instanceof ImageData ? n.putImageData(e, 0, 0) : n.drawImage(e, 0, 0, e.width, e.height), i = Zi;
    }
    return i.toDataURL(t);
  }
  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const t = Qn("canvas");
      t.width = e.width, t.height = e.height;
      const i = t.getContext("2d");
      i.drawImage(e, 0, 0, e.width, e.height);
      const n = i.getImageData(0, 0, e.width, e.height), r = n.data;
      for (let s = 0; s < r.length; s++) r[s] = Mi(r[s] / 255) * 255;
      return i.putImageData(n, 0, 0), t;
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let i = 0; i < t.length; i++) t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[i] = Math.floor(Mi(t[i] / 255) * 255) : t[i] = Mi(t[i]);
      return {
        data: t,
        width: e.width,
        height: e.height
      };
    } else
      return xe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}, vh = 0, ea = class {
  constructor(e = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: vh++ }), this.uuid = $t(), this.data = e, this.dataReady = !0, this.version = 0;
  }
  getSize(e) {
    const t = this.data;
    return typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : typeof VideoFrame < "u" && t instanceof VideoFrame ? e.set(t.displayWidth, t.displayHeight, 0) : t !== null ? e.set(t.width, t.height, t.depth || 0) : e.set(0, 0, 0), e;
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
    const i = {
      uuid: this.uuid,
      url: ""
    }, n = this.data;
    if (n !== null) {
      let r;
      if (Array.isArray(n)) {
        r = [];
        for (let s = 0, a = n.length; s < a; s++) n[s].isDataTexture ? r.push(os(n[s].image)) : r.push(os(n[s]));
      } else r = os(n);
      i.url = r;
    }
    return t || (e.images[this.uuid] = i), i;
  }
};
function os(e) {
  return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap ? gh.getDataURL(e) : e.data ? {
    data: Array.from(e.data),
    width: e.width,
    height: e.height,
    type: e.data.constructor.name
  } : (xe("Texture: Unable to serialize Texture."), {});
}
var bh = 0, cs = /* @__PURE__ */ new U(), Dt = class Fr extends Yi {
  constructor(t = Fr.DEFAULT_IMAGE, i = Fr.DEFAULT_MAPPING, n = ai, r = ai, s = Lt, a = nr, o = xn, c = Ui, l = Fr.DEFAULT_ANISOTROPY, h = "") {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: bh++ }), this.uuid = $t(), this.name = "", this.source = new ea(t), this.mipmaps = [], this.mapping = i, this.channel = 0, this.wrapS = n, this.wrapT = r, this.magFilter = s, this.minFilter = a, this.anisotropy = l, this.format = o, this.internalFormat = null, this.type = c, this.offset = new Fe(0, 0), this.repeat = new Fe(1, 1), this.center = new Fe(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Ie(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.isArrayTexture = !!(t && t.depth && t.depth > 1), this.pmremVersion = 0, this.normalized = !1;
  }
  get width() {
    return this.source.getSize(cs).x;
  }
  get height() {
    return this.source.getSize(cs).y;
  }
  get depth() {
    return this.source.getSize(cs).z;
  }
  get image() {
    return this.source.data;
  }
  set image(t) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  addUpdateRange(t, i) {
    this.updateRanges.push({
      start: t,
      count: i
    });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.normalized = t.normalized, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.renderTarget = t.renderTarget, this.isRenderTargetTexture = t.isRenderTargetTexture, this.isArrayTexture = t.isArrayTexture, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = !0, this;
  }
  setValues(t) {
    for (const i in t) {
      const n = t[i];
      if (n === void 0) {
        xe(`Texture.setValues(): parameter '${i}' has value of undefined.`);
        continue;
      }
      const r = this[i];
      if (r === void 0) {
        xe(`Texture.setValues(): property '${i}' does not exist.`);
        continue;
      }
      r && n && r.isVector2 && n.isVector2 || r && n && r.isVector3 && n.isVector3 || r && n && r.isMatrix3 && n.isMatrix3 ? r.copy(n) : this[i] = n;
    }
  }
  toJSON(t) {
    const i = t === void 0 || typeof t == "string";
    if (!i && t.textures[this.uuid] !== void 0) return t.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.7,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      normalized: this.normalized,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), i || (t.textures[this.uuid] = n), n;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== 300) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1) switch (this.wrapS) {
      case Br:
        t.x = t.x - Math.floor(t.x);
        break;
      case ai:
        t.x = t.x < 0 ? 0 : 1;
        break;
      case Gr:
        Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
    }
    if (t.y < 0 || t.y > 1) switch (this.wrapT) {
      case Br:
        t.y = t.y - Math.floor(t.y);
        break;
      case ai:
        t.y = t.y < 0 ? 0 : 1;
        break;
      case Gr:
        Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
    }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    t === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  set needsPMREMUpdate(t) {
    t === !0 && this.pmremVersion++;
  }
};
Dt.DEFAULT_IMAGE = null;
Dt.DEFAULT_MAPPING = 300;
Dt.DEFAULT_ANISOTROPY = 1;
jo = Symbol.iterator;
var Ze = class {
  constructor(e = 0, t = 0, i = 0, n = 1) {
    this.x = e, this.y = t, this.z = i, this.w = n;
  }
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  set(e, t, i, n) {
    return this.x = e, this.y = t, this.z = i, this.w = n, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setW(e) {
    return this.w = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("THREE.Vector4: index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("THREE.Vector4: index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }
  applyMatrix4(e) {
    const t = this.x, i = this.y, n = this.z, r = this.w, s = e.elements;
    return this.x = s[0] * t + s[4] * i + s[8] * n + s[12] * r, this.y = s[1] * t + s[5] * i + s[9] * n + s[13] * r, this.z = s[2] * t + s[6] * i + s[10] * n + s[14] * r, this.w = s[3] * t + s[7] * i + s[11] * n + s[15] * r, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
  }
  setAxisAngleFromRotationMatrix(e) {
    let t, i, n, r;
    const o = e.elements, c = o[0], l = o[4], h = o[8], u = o[1], d = o[5], p = o[9], g = o[2], _ = o[6], m = o[10];
    if (Math.abs(l - u) < 0.01 && Math.abs(h - g) < 0.01 && Math.abs(p - _) < 0.01) {
      if (Math.abs(l + u) < 0.1 && Math.abs(h + g) < 0.1 && Math.abs(p + _) < 0.1 && Math.abs(c + d + m - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const T = (c + 1) / 2, A = (d + 1) / 2, M = (m + 1) / 2, E = (l + u) / 4, w = (h + g) / 4, C = (p + _) / 4;
      return T > A && T > M ? T < 0.01 ? (i = 0, n = 0.707106781, r = 0.707106781) : (i = Math.sqrt(T), n = E / i, r = w / i) : A > M ? A < 0.01 ? (i = 0.707106781, n = 0, r = 0.707106781) : (n = Math.sqrt(A), i = E / n, r = C / n) : M < 0.01 ? (i = 0.707106781, n = 0.707106781, r = 0) : (r = Math.sqrt(M), i = w / r, n = C / r), this.set(i, n, r, t), this;
    }
    let f = Math.sqrt((_ - p) * (_ - p) + (h - g) * (h - g) + (u - l) * (u - l));
    return Math.abs(f) < 1e-3 && (f = 1), this.x = (_ - p) / f, this.y = (h - g) / f, this.z = (u - l) / f, this.w = Math.acos((c + d + m - 1) / 2), this;
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }
  clamp(e, t) {
    return this.x = ze(this.x, e.x, t.x), this.y = ze(this.y, e.y, t.y), this.z = ze(this.z, e.z, t.z), this.w = ze(this.w, e.w, t.w), this;
  }
  clampScalar(e, t) {
    return this.x = ze(this.x, e, t), this.y = ze(this.y, e, t), this.z = ze(this.z, e, t), this.w = ze(this.w, e, t), this;
  }
  clampLength(e, t) {
    const i = this.length();
    return this.divideScalar(i || 1).multiplyScalar(ze(i, e, t));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
  }
  lerpVectors(e, t, i) {
    return this.x = e.x + (t.x - e.x) * i, this.y = e.y + (t.y - e.y) * i, this.z = e.z + (t.z - e.z) * i, this.w = e.w + (t.w - e.w) * i, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[jo]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
};
Ho = Ze;
Ho.prototype.isVector4 = !0;
var _h = class extends Yi {
  constructor(e = 1, t = 1, i = {}) {
    super(), i = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: Lt,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1,
      depth: 1,
      multiview: !1,
      useArrayDepthTexture: !1
    }, i), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = i.depth, this.scissor = new Ze(0, 0, e, t), this.scissorTest = !1, this.viewport = new Ze(0, 0, e, t), this.textures = [];
    const n = {
      width: e,
      height: t,
      depth: i.depth
    }, r = new Dt(n), s = i.count;
    for (let a = 0; a < s; a++)
      this.textures[a] = r.clone(), this.textures[a].isRenderTargetTexture = !0, this.textures[a].renderTarget = this;
    this._setTextureOptions(i), this.depthBuffer = i.depthBuffer, this.stencilBuffer = i.stencilBuffer, this.resolveDepthBuffer = i.resolveDepthBuffer, this.resolveStencilBuffer = i.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = i.depthTexture, this.samples = i.samples, this.multiview = i.multiview, this.useArrayDepthTexture = i.useArrayDepthTexture;
  }
  _setTextureOptions(e = {}) {
    const t = {
      minFilter: Lt,
      generateMipmaps: !1,
      flipY: !1,
      internalFormat: null
    };
    e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
    for (let i = 0; i < this.textures.length; i++) this.textures[i].setValues(t);
  }
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  set depthTexture(e) {
    this._depthTexture !== null && (this._depthTexture.renderTarget = null), e !== null && (e.renderTarget = this), this._depthTexture = e;
  }
  get depthTexture() {
    return this._depthTexture;
  }
  setSize(e, t, i = 1) {
    if (this.width !== e || this.height !== t || this.depth !== i) {
      this.width = e, this.height = t, this.depth = i;
      for (let n = 0, r = this.textures.length; n < r; n++)
        this.textures[n].image.width = e, this.textures[n].image.height = t, this.textures[n].image.depth = i, this.textures[n].isData3DTexture !== !0 && (this.textures[n].isArrayTexture = this.textures[n].image.depth > 1);
      this.dispose();
    }
    this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let t = 0, i = e.textures.length; t < i; t++) {
      this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = !0, this.textures[t].renderTarget = this;
      const n = Object.assign({}, e.textures[t].image);
      this.textures[t].source = new ea(n);
    }
    return this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this.multiview = e.multiview, this.useArrayDepthTexture = e.useArrayDepthTexture, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}, oi = class extends _h {
  constructor(e = 1, t = 1, i = {}) {
    super(e, t, i), this.isWebGLRenderTarget = !0;
  }
}, lc = class extends Dt {
  constructor(e = null, t = 1, i = 1, n = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = {
      data: e,
      width: t,
      height: i,
      depth: n
    }, this.magFilter = Et, this.minFilter = Et, this.wrapR = ai, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(e) {
    this.layerUpdates.add(e);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}, Mh = class extends Dt {
  constructor(e = null, t = 1, i = 1, n = 1) {
    super(null), this.isData3DTexture = !0, this.image = {
      data: e,
      width: t,
      height: i,
      depth: n
    }, this.magFilter = Et, this.minFilter = Et, this.wrapR = ai, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}, Ne = class hc {
  constructor(t, i, n, r, s, a, o, c, l, h, u, d, p, g, _, m) {
    this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, i, n, r, s, a, o, c, l, h, u, d, p, g, _, m);
  }
  set(t, i, n, r, s, a, o, c, l, h, u, d, p, g, _, m) {
    const f = this.elements;
    return f[0] = t, f[4] = i, f[8] = n, f[12] = r, f[1] = s, f[5] = a, f[9] = o, f[13] = c, f[2] = l, f[6] = h, f[10] = u, f[14] = d, f[3] = p, f[7] = g, f[11] = _, f[15] = m, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  clone() {
    return new hc().fromArray(this.elements);
  }
  copy(t) {
    const i = this.elements, n = t.elements;
    return i[0] = n[0], i[1] = n[1], i[2] = n[2], i[3] = n[3], i[4] = n[4], i[5] = n[5], i[6] = n[6], i[7] = n[7], i[8] = n[8], i[9] = n[9], i[10] = n[10], i[11] = n[11], i[12] = n[12], i[13] = n[13], i[14] = n[14], i[15] = n[15], this;
  }
  copyPosition(t) {
    const i = this.elements, n = t.elements;
    return i[12] = n[12], i[13] = n[13], i[14] = n[14], this;
  }
  setFromMatrix3(t) {
    const i = t.elements;
    return this.set(i[0], i[3], i[6], 0, i[1], i[4], i[7], 0, i[2], i[5], i[8], 0, 0, 0, 0, 1), this;
  }
  extractBasis(t, i, n) {
    return this.determinantAffine() === 0 ? (t.set(1, 0, 0), i.set(0, 1, 0), n.set(0, 0, 1), this) : (t.setFromMatrixColumn(this, 0), i.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this);
  }
  makeBasis(t, i, n) {
    return this.set(t.x, i.x, n.x, 0, t.y, i.y, n.y, 0, t.z, i.z, n.z, 0, 0, 0, 0, 1), this;
  }
  extractRotation(t) {
    if (t.determinantAffine() === 0) return this.identity();
    const i = this.elements, n = t.elements, r = 1 / Qi.setFromMatrixColumn(t, 0).length(), s = 1 / Qi.setFromMatrixColumn(t, 1).length(), a = 1 / Qi.setFromMatrixColumn(t, 2).length();
    return i[0] = n[0] * r, i[1] = n[1] * r, i[2] = n[2] * r, i[3] = 0, i[4] = n[4] * s, i[5] = n[5] * s, i[6] = n[6] * s, i[7] = 0, i[8] = n[8] * a, i[9] = n[9] * a, i[10] = n[10] * a, i[11] = 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, this;
  }
  makeRotationFromEuler(t) {
    const i = this.elements, n = t.x, r = t.y, s = t.z, a = Math.cos(n), o = Math.sin(n), c = Math.cos(r), l = Math.sin(r), h = Math.cos(s), u = Math.sin(s);
    if (t.order === "XYZ") {
      const d = a * h, p = a * u, g = o * h, _ = o * u;
      i[0] = c * h, i[4] = -c * u, i[8] = l, i[1] = p + g * l, i[5] = d - _ * l, i[9] = -o * c, i[2] = _ - d * l, i[6] = g + p * l, i[10] = a * c;
    } else if (t.order === "YXZ") {
      const d = c * h, p = c * u, g = l * h, _ = l * u;
      i[0] = d + _ * o, i[4] = g * o - p, i[8] = a * l, i[1] = a * u, i[5] = a * h, i[9] = -o, i[2] = p * o - g, i[6] = _ + d * o, i[10] = a * c;
    } else if (t.order === "ZXY") {
      const d = c * h, p = c * u, g = l * h, _ = l * u;
      i[0] = d - _ * o, i[4] = -a * u, i[8] = g + p * o, i[1] = p + g * o, i[5] = a * h, i[9] = _ - d * o, i[2] = -a * l, i[6] = o, i[10] = a * c;
    } else if (t.order === "ZYX") {
      const d = a * h, p = a * u, g = o * h, _ = o * u;
      i[0] = c * h, i[4] = g * l - p, i[8] = d * l + _, i[1] = c * u, i[5] = _ * l + d, i[9] = p * l - g, i[2] = -l, i[6] = o * c, i[10] = a * c;
    } else if (t.order === "YZX") {
      const d = a * c, p = a * l, g = o * c, _ = o * l;
      i[0] = c * h, i[4] = _ - d * u, i[8] = g * u + p, i[1] = u, i[5] = a * h, i[9] = -o * h, i[2] = -l * h, i[6] = p * u + g, i[10] = d - _ * u;
    } else if (t.order === "XZY") {
      const d = a * c, p = a * l, g = o * c, _ = o * l;
      i[0] = c * h, i[4] = -u, i[8] = l * h, i[1] = d * u + _, i[5] = a * h, i[9] = p * u - g, i[2] = g * u - p, i[6] = o * h, i[10] = _ * u + d;
    }
    return i[3] = 0, i[7] = 0, i[11] = 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, this;
  }
  makeRotationFromQuaternion(t) {
    return this.compose(xh, t, Sh);
  }
  lookAt(t, i, n) {
    const r = this.elements;
    return Ft.subVectors(t, i), Ft.lengthSq() === 0 && (Ft.z = 1), Ft.normalize(), Ei.crossVectors(n, Ft), Ei.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Ft.x += 1e-4 : Ft.z += 1e-4, Ft.normalize(), Ei.crossVectors(n, Ft)), Ei.normalize(), or.crossVectors(Ft, Ei), r[0] = Ei.x, r[4] = or.x, r[8] = Ft.x, r[1] = Ei.y, r[5] = or.y, r[9] = Ft.y, r[2] = Ei.z, r[6] = or.z, r[10] = Ft.z, this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, i) {
    const n = t.elements, r = i.elements, s = this.elements, a = n[0], o = n[4], c = n[8], l = n[12], h = n[1], u = n[5], d = n[9], p = n[13], g = n[2], _ = n[6], m = n[10], f = n[14], T = n[3], A = n[7], M = n[11], E = n[15], w = r[0], C = r[4], v = r[8], y = r[12], V = r[1], R = r[5], k = r[9], q = r[13], X = r[2], z = r[6], j = r[10], O = r[14], ee = r[3], te = r[7], ie = r[11], de = r[15];
    return s[0] = a * w + o * V + c * X + l * ee, s[4] = a * C + o * R + c * z + l * te, s[8] = a * v + o * k + c * j + l * ie, s[12] = a * y + o * q + c * O + l * de, s[1] = h * w + u * V + d * X + p * ee, s[5] = h * C + u * R + d * z + p * te, s[9] = h * v + u * k + d * j + p * ie, s[13] = h * y + u * q + d * O + p * de, s[2] = g * w + _ * V + m * X + f * ee, s[6] = g * C + _ * R + m * z + f * te, s[10] = g * v + _ * k + m * j + f * ie, s[14] = g * y + _ * q + m * O + f * de, s[3] = T * w + A * V + M * X + E * ee, s[7] = T * C + A * R + M * z + E * te, s[11] = T * v + A * k + M * j + E * ie, s[15] = T * y + A * q + M * O + E * de, this;
  }
  multiplyScalar(t) {
    const i = this.elements;
    return i[0] *= t, i[4] *= t, i[8] *= t, i[12] *= t, i[1] *= t, i[5] *= t, i[9] *= t, i[13] *= t, i[2] *= t, i[6] *= t, i[10] *= t, i[14] *= t, i[3] *= t, i[7] *= t, i[11] *= t, i[15] *= t, this;
  }
  determinant() {
    const t = this.elements, i = t[0], n = t[4], r = t[8], s = t[12], a = t[1], o = t[5], c = t[9], l = t[13], h = t[2], u = t[6], d = t[10], p = t[14], g = t[3], _ = t[7], m = t[11], f = t[15], T = c * p - l * d, A = o * p - l * u, M = o * d - c * u, E = a * p - l * h, w = a * d - c * h, C = a * u - o * h;
    return i * (_ * T - m * A + f * M) - n * (g * T - m * E + f * w) + r * (g * A - _ * E + f * C) - s * (g * M - _ * w + m * C);
  }
  determinantAffine() {
    const t = this.elements, i = t[0], n = t[4], r = t[8], s = t[1], a = t[5], o = t[9], c = t[2], l = t[6], h = t[10];
    return i * (a * h - o * l) - n * (s * h - o * c) + r * (s * l - a * c);
  }
  transpose() {
    const t = this.elements;
    let i;
    return i = t[1], t[1] = t[4], t[4] = i, i = t[2], t[2] = t[8], t[8] = i, i = t[6], t[6] = t[9], t[9] = i, i = t[3], t[3] = t[12], t[12] = i, i = t[7], t[7] = t[13], t[13] = i, i = t[11], t[11] = t[14], t[14] = i, this;
  }
  setPosition(t, i, n) {
    const r = this.elements;
    return t.isVector3 ? (r[12] = t.x, r[13] = t.y, r[14] = t.z) : (r[12] = t, r[13] = i, r[14] = n), this;
  }
  invert() {
    const t = this.elements, i = t[0], n = t[1], r = t[2], s = t[3], a = t[4], o = t[5], c = t[6], l = t[7], h = t[8], u = t[9], d = t[10], p = t[11], g = t[12], _ = t[13], m = t[14], f = t[15], T = i * o - n * a, A = i * c - r * a, M = i * l - s * a, E = n * c - r * o, w = n * l - s * o, C = r * l - s * c, v = h * _ - u * g, y = h * m - d * g, V = h * f - p * g, R = u * m - d * _, k = u * f - p * _, q = d * f - p * m, X = T * q - A * k + M * R + E * V - w * y + C * v;
    if (X === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const z = 1 / X;
    return t[0] = (o * q - c * k + l * R) * z, t[1] = (r * k - n * q - s * R) * z, t[2] = (_ * C - m * w + f * E) * z, t[3] = (d * w - u * C - p * E) * z, t[4] = (c * V - a * q - l * y) * z, t[5] = (i * q - r * V + s * y) * z, t[6] = (m * M - g * C - f * A) * z, t[7] = (h * C - d * M + p * A) * z, t[8] = (a * k - o * V + l * v) * z, t[9] = (n * V - i * k - s * v) * z, t[10] = (g * w - _ * M + f * T) * z, t[11] = (u * M - h * w - p * T) * z, t[12] = (o * y - a * R - c * v) * z, t[13] = (i * R - n * y + r * v) * z, t[14] = (_ * A - g * E - m * T) * z, t[15] = (h * E - u * A + d * T) * z, this;
  }
  scale(t) {
    const i = this.elements, n = t.x, r = t.y, s = t.z;
    return i[0] *= n, i[4] *= r, i[8] *= s, i[1] *= n, i[5] *= r, i[9] *= s, i[2] *= n, i[6] *= r, i[10] *= s, i[3] *= n, i[7] *= r, i[11] *= s, this;
  }
  getMaxScaleOnAxis() {
    const t = this.elements, i = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], r = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(i, n, r));
  }
  makeTranslation(t, i, n) {
    return t.isVector3 ? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1) : this.set(1, 0, 0, t, 0, 1, 0, i, 0, 0, 1, n, 0, 0, 0, 1), this;
  }
  makeRotationX(t) {
    const i = Math.cos(t), n = Math.sin(t);
    return this.set(1, 0, 0, 0, 0, i, -n, 0, 0, n, i, 0, 0, 0, 0, 1), this;
  }
  makeRotationY(t) {
    const i = Math.cos(t), n = Math.sin(t);
    return this.set(i, 0, n, 0, 0, 1, 0, 0, -n, 0, i, 0, 0, 0, 0, 1), this;
  }
  makeRotationZ(t) {
    const i = Math.cos(t), n = Math.sin(t);
    return this.set(i, -n, 0, 0, n, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  makeRotationAxis(t, i) {
    const n = Math.cos(i), r = Math.sin(i), s = 1 - n, a = t.x, o = t.y, c = t.z, l = s * a, h = s * o;
    return this.set(l * a + n, l * o - r * c, l * c + r * o, 0, l * o + r * c, h * o + n, h * c - r * a, 0, l * c - r * o, h * c + r * a, s * c * c + n, 0, 0, 0, 0, 1), this;
  }
  makeScale(t, i, n) {
    return this.set(t, 0, 0, 0, 0, i, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
  }
  makeShear(t, i, n, r, s, a) {
    return this.set(1, n, s, 0, t, 1, a, 0, i, r, 1, 0, 0, 0, 0, 1), this;
  }
  compose(t, i, n) {
    const r = this.elements, s = i._x, a = i._y, o = i._z, c = i._w, l = s + s, h = a + a, u = o + o, d = s * l, p = s * h, g = s * u, _ = a * h, m = a * u, f = o * u, T = c * l, A = c * h, M = c * u, E = n.x, w = n.y, C = n.z;
    return r[0] = (1 - (_ + f)) * E, r[1] = (p + M) * E, r[2] = (g - A) * E, r[3] = 0, r[4] = (p - M) * w, r[5] = (1 - (d + f)) * w, r[6] = (m + T) * w, r[7] = 0, r[8] = (g + A) * C, r[9] = (m - T) * C, r[10] = (1 - (d + _)) * C, r[11] = 0, r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = 1, this;
  }
  decompose(t, i, n) {
    const r = this.elements;
    t.x = r[12], t.y = r[13], t.z = r[14];
    const s = this.determinantAffine();
    if (s === 0)
      return n.set(1, 1, 1), i.identity(), this;
    let a = Qi.set(r[0], r[1], r[2]).length();
    const o = Qi.set(r[4], r[5], r[6]).length(), c = Qi.set(r[8], r[9], r[10]).length();
    s < 0 && (a = -a), Xt.copy(this);
    const l = 1 / a, h = 1 / o, u = 1 / c;
    return Xt.elements[0] *= l, Xt.elements[1] *= l, Xt.elements[2] *= l, Xt.elements[4] *= h, Xt.elements[5] *= h, Xt.elements[6] *= h, Xt.elements[8] *= u, Xt.elements[9] *= u, Xt.elements[10] *= u, i.setFromRotationMatrix(Xt), n.x = a, n.y = o, n.z = c, this;
  }
  makePerspective(t, i, n, r, s, a, o = Sn, c = !1) {
    const l = this.elements, h = 2 * s / (i - t), u = 2 * s / (n - r), d = (i + t) / (i - t), p = (n + r) / (n - r);
    let g, _;
    if (c)
      g = s / (a - s), _ = a * s / (a - s);
    else if (o === 2e3)
      g = -(a + s) / (a - s), _ = -2 * a * s / (a - s);
    else if (o === 2001)
      g = -a / (a - s), _ = -a * s / (a - s);
    else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return l[0] = h, l[4] = 0, l[8] = d, l[12] = 0, l[1] = 0, l[5] = u, l[9] = p, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = g, l[14] = _, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  makeOrthographic(t, i, n, r, s, a, o = Sn, c = !1) {
    const l = this.elements, h = 2 / (i - t), u = 2 / (n - r), d = -(i + t) / (i - t), p = -(n + r) / (n - r);
    let g, _;
    if (c)
      g = 1 / (a - s), _ = a / (a - s);
    else if (o === 2e3)
      g = -2 / (a - s), _ = -(a + s) / (a - s);
    else if (o === 2001)
      g = -1 / (a - s), _ = -s / (a - s);
    else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return l[0] = h, l[4] = 0, l[8] = 0, l[12] = d, l[1] = 0, l[5] = u, l[9] = 0, l[13] = p, l[2] = 0, l[6] = 0, l[10] = g, l[14] = _, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
  }
  equals(t) {
    const i = this.elements, n = t.elements;
    for (let r = 0; r < 16; r++) if (i[r] !== n[r]) return !1;
    return !0;
  }
  fromArray(t, i = 0) {
    for (let n = 0; n < 16; n++) this.elements[n] = t[n + i];
    return this;
  }
  toArray(t = [], i = 0) {
    const n = this.elements;
    return t[i] = n[0], t[i + 1] = n[1], t[i + 2] = n[2], t[i + 3] = n[3], t[i + 4] = n[4], t[i + 5] = n[5], t[i + 6] = n[6], t[i + 7] = n[7], t[i + 8] = n[8], t[i + 9] = n[9], t[i + 10] = n[10], t[i + 11] = n[11], t[i + 12] = n[12], t[i + 13] = n[13], t[i + 14] = n[14], t[i + 15] = n[15], t;
  }
};
Wo = Ne;
Wo.prototype.isMatrix4 = !0;
var Qi = /* @__PURE__ */ new U(), Xt = /* @__PURE__ */ new Ne(), xh = /* @__PURE__ */ new U(0, 0, 0), Sh = /* @__PURE__ */ new U(1, 1, 1), Ei = /* @__PURE__ */ new U(), or = /* @__PURE__ */ new U(), Ft = /* @__PURE__ */ new U(), wa = /* @__PURE__ */ new Ne(), Ra = /* @__PURE__ */ new Ht(), Fi = class dc {
  constructor(t = 0, i = 0, n = 0, r = dc.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = t, this._y = i, this._z = n, this._order = r;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    this._order = t, this._onChangeCallback();
  }
  set(t, i, n, r = this._order) {
    return this._x = t, this._y = i, this._z = n, this._order = r, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t, i = this._order, n = !0) {
    const r = t.elements, s = r[0], a = r[4], o = r[8], c = r[1], l = r[5], h = r[9], u = r[2], d = r[6], p = r[10];
    switch (i) {
      case "XYZ":
        this._y = Math.asin(ze(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, p), this._z = Math.atan2(-a, s)) : (this._x = Math.atan2(d, l), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-ze(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(c, l)) : (this._y = Math.atan2(-u, s), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(ze(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-u, p), this._z = Math.atan2(-a, l)) : (this._y = 0, this._z = Math.atan2(c, s));
        break;
      case "ZYX":
        this._y = Math.asin(-ze(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(d, p), this._z = Math.atan2(c, s)) : (this._x = 0, this._z = Math.atan2(-a, l));
        break;
      case "YZX":
        this._z = Math.asin(ze(c, -1, 1)), Math.abs(c) < 0.9999999 ? (this._x = Math.atan2(-h, l), this._y = Math.atan2(-u, s)) : (this._x = 0, this._y = Math.atan2(o, p));
        break;
      case "XZY":
        this._z = Math.asin(-ze(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(d, l), this._y = Math.atan2(o, s)) : (this._x = Math.atan2(-h, p), this._y = 0);
        break;
      default:
        xe("Euler: .setFromRotationMatrix() encountered an unknown order: " + i);
    }
    return this._order = i, n === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, i, n) {
    return wa.makeRotationFromQuaternion(t), this.setFromRotationMatrix(wa, i, n);
  }
  setFromVector3(t, i = this._order) {
    return this.set(t.x, t.y, t.z, i);
  }
  reorder(t) {
    return Ra.setFromEuler(this), this.setFromQuaternion(Ra, t);
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
  }
  fromArray(t) {
    return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
  }
  toArray(t = [], i = 0) {
    return t[i] = this._x, t[i + 1] = this._y, t[i + 2] = this._z, t[i + 3] = this._order, t;
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
};
Fi.DEFAULT_ORDER = "XYZ";
var ta = class {
  constructor() {
    this.mask = 1;
  }
  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }
  enable(e) {
    this.mask |= 1 << e | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(e) {
    this.mask ^= 1 << e | 0;
  }
  disable(e) {
    this.mask &= ~(1 << e | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}, yh = 0, Ca = /* @__PURE__ */ new U(), en = /* @__PURE__ */ new Ht(), fi = /* @__PURE__ */ new Ne(), cr = /* @__PURE__ */ new U(), Nn = /* @__PURE__ */ new U(), Eh = /* @__PURE__ */ new U(), Th = /* @__PURE__ */ new Ht(), Pa = /* @__PURE__ */ new U(1, 0, 0), La = /* @__PURE__ */ new U(0, 1, 0), Da = /* @__PURE__ */ new U(0, 0, 1), Ia = { type: "added" }, Ah = { type: "removed" }, tn = {
  type: "childadded",
  child: null
}, ls = {
  type: "childremoved",
  child: null
}, dt = class Or extends Yi {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: yh++ }), this.uuid = $t(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = Or.DEFAULT_UP.clone();
    const t = new U(), i = new Fi(), n = new Ht(), r = new U(1, 1, 1);
    function s() {
      n.setFromEuler(i, !1);
    }
    function a() {
      i.setFromQuaternion(n, void 0, !1);
    }
    i._onChange(s), n._onChange(a), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: i
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: r
      },
      modelViewMatrix: { value: new Ne() },
      normalMatrix: { value: new Ie() }
    }), this.matrix = new Ne(), this.matrixWorld = new Ne(), this.matrixAutoUpdate = Or.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = Or.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new ta(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.static = !1, this.userData = {}, this.pivot = null;
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, i) {
    this.quaternion.setFromAxisAngle(t, i);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, i) {
    return en.setFromAxisAngle(t, i), this.quaternion.multiply(en), this;
  }
  rotateOnWorldAxis(t, i) {
    return en.setFromAxisAngle(t, i), this.quaternion.premultiply(en), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(Pa, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(La, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(Da, t);
  }
  translateOnAxis(t, i) {
    return Ca.copy(t).applyQuaternion(this.quaternion), this.position.add(Ca.multiplyScalar(i)), this;
  }
  translateX(t) {
    return this.translateOnAxis(Pa, t);
  }
  translateY(t) {
    return this.translateOnAxis(La, t);
  }
  translateZ(t) {
    return this.translateOnAxis(Da, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(fi.copy(this.matrixWorld).invert());
  }
  lookAt(t, i, n) {
    t.isVector3 ? cr.copy(t) : cr.set(t, i, n);
    const r = this.parent;
    this.updateWorldMatrix(!0, !1), Nn.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? fi.lookAt(Nn, cr, this.up) : fi.lookAt(cr, Nn, this.up), this.quaternion.setFromRotationMatrix(fi), r && (fi.extractRotation(r.matrixWorld), en.setFromRotationMatrix(fi), this.quaternion.premultiply(en.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) this.add(arguments[i]);
      return this;
    }
    return t === this ? (Re("Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(Ia), tn.child = t, this.dispatchEvent(tn), tn.child = null) : Re("Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
      return this;
    }
    const i = this.children.indexOf(t);
    return i !== -1 && (t.parent = null, this.children.splice(i, 1), t.dispatchEvent(Ah), ls.child = t, this.dispatchEvent(ls), ls.child = null), this;
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return this.updateWorldMatrix(!0, !1), fi.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), fi.multiply(t.parent.matrixWorld)), t.applyMatrix4(fi), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(!1, !0), t.dispatchEvent(Ia), tn.child = t, this.dispatchEvent(tn), tn.child = null, this;
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, i) {
    if (this[t] === i) return this;
    for (let n = 0, r = this.children.length; n < r; n++) {
      const s = this.children[n].getObjectByProperty(t, i);
      if (s !== void 0) return s;
    }
  }
  getObjectsByProperty(t, i, n = []) {
    this[t] === i && n.push(this);
    const r = this.children;
    for (let s = 0, a = r.length; s < a; s++) r[s].getObjectsByProperty(t, i, n);
    return n;
  }
  getWorldPosition(t) {
    return this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Nn, t, Eh), t;
  }
  getWorldScale(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Nn, Th, t), t;
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const i = this.matrixWorld.elements;
    return t.set(i[8], i[9], i[10]).normalize();
  }
  raycast() {
  }
  traverse(t) {
    t(this);
    const i = this.children;
    for (let n = 0, r = i.length; n < r; n++) i[n].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const i = this.children;
    for (let n = 0, r = i.length; n < r; n++) i[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const i = this.parent;
    i !== null && (t(i), i.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    const t = this.pivot;
    if (t !== null) {
      const i = t.x, n = t.y, r = t.z, s = this.matrix.elements;
      s[12] += i - s[0] * i - s[4] * n - s[8] * r, s[13] += n - s[1] * i - s[5] * n - s[9] * r, s[14] += r - s[2] * i - s[6] * n - s[10] * r;
    }
    this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, t = !0);
    const i = this.children;
    for (let n = 0, r = i.length; n < r; n++) i[n].updateMatrixWorld(t);
  }
  updateWorldMatrix(t, i, n = !1) {
    const r = this.parent;
    if (t === !0 && r !== null && r.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || n) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, n = !0), i === !0) {
      const s = this.children;
      for (let a = 0, o = s.length; a < o; a++) s[a].updateWorldMatrix(!1, !0, n);
    }
  }
  toJSON(t) {
    const i = t === void 0 || typeof t == "string", n = {};
    i && (t = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.7,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const r = {};
    r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.castShadow === !0 && (r.castShadow = !0), this.receiveShadow === !0 && (r.receiveShadow = !0), this.visible === !1 && (r.visible = !1), this.frustumCulled === !1 && (r.frustumCulled = !1), this.renderOrder !== 0 && (r.renderOrder = this.renderOrder), this.static !== !1 && (r.static = this.static), Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.pivot !== null && (r.pivot = this.pivot.toArray()), this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1), this.morphTargetDictionary !== void 0 && (r.morphTargetDictionary = Object.assign({}, this.morphTargetDictionary)), this.morphTargetInfluences !== void 0 && (r.morphTargetInfluences = this.morphTargetInfluences.slice()), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.geometryInfo = this._geometryInfo.map((o) => ({
      ...o,
      boundingBox: o.boundingBox ? o.boundingBox.toJSON() : void 0,
      boundingSphere: o.boundingSphere ? o.boundingSphere.toJSON() : void 0
    })), r.instanceInfo = this._instanceInfo.map((o) => ({ ...o })), r.availableInstanceIds = this._availableInstanceIds.slice(), r.availableGeometryIds = this._availableGeometryIds.slice(), r.nextIndexStart = this._nextIndexStart, r.nextVertexStart = this._nextVertexStart, r.geometryCount = this._geometryCount, r.maxInstanceCount = this._maxInstanceCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.matricesTexture = this._matricesTexture.toJSON(t), r.indirectTexture = this._indirectTexture.toJSON(t), this._colorsTexture !== null && (r.colorsTexture = this._colorsTexture.toJSON(t)), this.boundingSphere !== null && (r.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (r.boundingBox = this.boundingBox.toJSON()));
    function s(o, c) {
      return o[c.uuid] === void 0 && (o[c.uuid] = c.toJSON(t)), c.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      r.geometry = s(t.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const c = o.shapes;
        if (Array.isArray(c)) for (let l = 0, h = c.length; l < h; l++) {
          const u = c[l];
          s(t.shapes, u);
        }
        else s(t.shapes, c);
      }
    }
    if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (s(t.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let c = 0, l = this.material.length; c < l; c++) o.push(s(t.materials, this.material[c]));
        r.material = o;
      } else r.material = s(t.materials, this.material);
    if (this.children.length > 0) {
      r.children = [];
      for (let o = 0; o < this.children.length; o++) r.children.push(this.children[o].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      r.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const c = this.animations[o];
        r.animations.push(s(t.animations, c));
      }
    }
    if (i) {
      const o = a(t.geometries), c = a(t.materials), l = a(t.textures), h = a(t.images), u = a(t.shapes), d = a(t.skeletons), p = a(t.animations), g = a(t.nodes);
      o.length > 0 && (n.geometries = o), c.length > 0 && (n.materials = c), l.length > 0 && (n.textures = l), h.length > 0 && (n.images = h), u.length > 0 && (n.shapes = u), d.length > 0 && (n.skeletons = d), p.length > 0 && (n.animations = p), g.length > 0 && (n.nodes = g);
    }
    return n.object = r, n;
    function a(o) {
      const c = [];
      for (const l in o) {
        const h = o[l];
        delete h.metadata, c.push(h);
      }
      return c;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, i = !0) {
    if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.pivot = t.pivot !== null ? t.pivot.clone() : null, this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.static = t.static, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), i === !0) for (let n = 0; n < t.children.length; n++) {
      const r = t.children[n];
      this.add(r.clone());
    }
    return this;
  }
};
dt.DEFAULT_UP = /* @__PURE__ */ new U(0, 1, 0);
dt.DEFAULT_MATRIX_AUTO_UPDATE = !0;
dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
var qi = class extends dt {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}, wh = { type: "move" }, hs = class {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new qi(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new qi(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new U(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new U()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new qi(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new U(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new U(), this._grip.eventsEnabled = !1), this._grip;
  }
  dispatchEvent(e) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
  }
  connect(e) {
    if (e && e.hand) {
      const t = this._hand;
      if (t) for (const i of e.hand.values()) this._getHandJoint(t, i);
    }
    return this.dispatchEvent({
      type: "connected",
      data: e
    }), this;
  }
  disconnect(e) {
    return this.dispatchEvent({
      type: "disconnected",
      data: e
    }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  update(e, t, i) {
    let n = null, r = null, s = null;
    const a = this._targetRay, o = this._grip, c = this._hand;
    if (e && t.session.visibilityState !== "visible-blurred") {
      if (c && e.hand) {
        s = !0;
        for (const d of e.hand.values()) {
          const p = t.getJointPose(d, i), g = this._getHandJoint(c, d);
          p !== null && (g.matrix.fromArray(p.transform.matrix), g.matrix.decompose(g.position, g.rotation, g.scale), g.matrixWorldNeedsUpdate = !0, g.jointRadius = p.radius), g.visible = p !== null;
        }
        const l = c.joints["index-finger-tip"], h = c.joints["thumb-tip"], u = l.position.distanceTo(h.position);
        c.inputState.pinching && u > 0.025 ? (c.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: e.handedness,
          target: this
        })) : !c.inputState.pinching && u <= 0.015 && (c.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: e.handedness,
          target: this
        }));
      } else o !== null && e.gripSpace && (r = t.getPose(e.gripSpace, i), r !== null && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1, o.eventsEnabled && o.dispatchEvent({
        type: "gripUpdated",
        data: e,
        target: this
      })));
      a !== null && (n = t.getPose(e.targetRaySpace, i), n === null && r !== null && (n = r), n !== null && (a.matrix.fromArray(n.transform.matrix), a.matrix.decompose(a.position, a.rotation, a.scale), a.matrixWorldNeedsUpdate = !0, n.linearVelocity ? (a.hasLinearVelocity = !0, a.linearVelocity.copy(n.linearVelocity)) : a.hasLinearVelocity = !1, n.angularVelocity ? (a.hasAngularVelocity = !0, a.angularVelocity.copy(n.angularVelocity)) : a.hasAngularVelocity = !1, this.dispatchEvent(wh)));
    }
    return a !== null && (a.visible = n !== null), o !== null && (o.visible = r !== null), c !== null && (c.visible = s !== null), this;
  }
  _getHandJoint(e, t) {
    if (e.joints[t.jointName] === void 0) {
      const i = new qi();
      i.matrixAutoUpdate = !1, i.visible = !1, e.joints[t.jointName] = i, e.add(i);
    }
    return e.joints[t.jointName];
  }
}, uc = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, Ti = {
  h: 0,
  s: 0,
  l: 0
}, lr = {
  h: 0,
  s: 0,
  l: 0
};
function ds(e, t, i) {
  return i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6 ? e + (t - e) * 6 * i : i < 1 / 2 ? t : i < 2 / 3 ? e + (t - e) * 6 * (2 / 3 - i) : e;
}
var Te = class {
  constructor(e, t, i) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, i);
  }
  set(e, t, i) {
    if (t === void 0 && i === void 0) {
      const n = e;
      n && n.isColor ? this.copy(n) : typeof n == "number" ? this.setHex(n) : typeof n == "string" && this.setStyle(n);
    } else this.setRGB(e, t, i);
    return this;
  }
  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }
  setHex(e, t = vt) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, Ge.colorSpaceToWorking(this, t), this;
  }
  setRGB(e, t, i, n = Ge.workingColorSpace) {
    return this.r = e, this.g = t, this.b = i, Ge.colorSpaceToWorking(this, n), this;
  }
  setHSL(e, t, i, n = Ge.workingColorSpace) {
    if (e = Qs(e, 1), t = ze(t, 0, 1), i = ze(i, 0, 1), t === 0) this.r = this.g = this.b = i;
    else {
      const r = i <= 0.5 ? i * (1 + t) : i + t - i * t, s = 2 * i - r;
      this.r = ds(s, r, e + 1 / 3), this.g = ds(s, r, e), this.b = ds(s, r, e - 1 / 3);
    }
    return Ge.colorSpaceToWorking(this, n), this;
  }
  setStyle(e, t = vt) {
    function i(r) {
      r !== void 0 && parseFloat(r) < 1 && xe("Color: Alpha component of " + e + " will be ignored.");
    }
    let n;
    if (n = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let r;
      const s = n[1], a = n[2];
      switch (s) {
        case "rgb":
        case "rgba":
          if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return i(r[4]), this.setRGB(Math.min(255, parseInt(r[1], 10)) / 255, Math.min(255, parseInt(r[2], 10)) / 255, Math.min(255, parseInt(r[3], 10)) / 255, t);
          if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return i(r[4]), this.setRGB(Math.min(100, parseInt(r[1], 10)) / 100, Math.min(100, parseInt(r[2], 10)) / 100, Math.min(100, parseInt(r[3], 10)) / 100, t);
          break;
        case "hsl":
        case "hsla":
          if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))
            return i(r[4]), this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, t);
          break;
        default:
          xe("Color: Unknown color model " + e);
      }
    } else if (n = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const r = n[1], s = r.length;
      if (s === 3) return this.setRGB(parseInt(r.charAt(0), 16) / 15, parseInt(r.charAt(1), 16) / 15, parseInt(r.charAt(2), 16) / 15, t);
      if (s === 6) return this.setHex(parseInt(r, 16), t);
      xe("Color: Invalid hex color " + e);
    } else if (e && e.length > 0) return this.setColorName(e, t);
    return this;
  }
  setColorName(e, t = vt) {
    const i = uc[e.toLowerCase()];
    return i !== void 0 ? this.setHex(i, t) : xe("Color: Unknown color " + e), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  copySRGBToLinear(e) {
    return this.r = Mi(e.r), this.g = Mi(e.g), this.b = Mi(e.b), this;
  }
  copyLinearToSRGB(e) {
    return this.r = _n(e.r), this.g = _n(e.g), this.b = _n(e.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(e = vt) {
    return Ge.workingToColorSpace(St.copy(this), e), Math.round(ze(St.r * 255, 0, 255)) * 65536 + Math.round(ze(St.g * 255, 0, 255)) * 256 + Math.round(ze(St.b * 255, 0, 255));
  }
  getHexString(e = vt) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  getHSL(e, t = Ge.workingColorSpace) {
    Ge.workingToColorSpace(St.copy(this), t);
    const i = St.r, n = St.g, r = St.b, s = Math.max(i, n, r), a = Math.min(i, n, r);
    let o, c;
    const l = (a + s) / 2;
    if (a === s)
      o = 0, c = 0;
    else {
      const h = s - a;
      switch (c = l <= 0.5 ? h / (s + a) : h / (2 - s - a), s) {
        case i:
          o = (n - r) / h + (n < r ? 6 : 0);
          break;
        case n:
          o = (r - i) / h + 2;
          break;
        case r:
          o = (i - n) / h + 4;
      }
      o /= 6;
    }
    return e.h = o, e.s = c, e.l = l, e;
  }
  getRGB(e, t = Ge.workingColorSpace) {
    return Ge.workingToColorSpace(St.copy(this), t), e.r = St.r, e.g = St.g, e.b = St.b, e;
  }
  getStyle(e = vt) {
    Ge.workingToColorSpace(St.copy(this), e);
    const t = St.r, i = St.g, n = St.b;
    return e !== "srgb" ? `color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(i * 255)},${Math.round(n * 255)})`;
  }
  offsetHSL(e, t, i) {
    return this.getHSL(Ti), this.setHSL(Ti.h + e, Ti.s + t, Ti.l + i);
  }
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  addColors(e, t) {
    return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
  }
  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }
  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  lerp(e, t) {
    return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
  }
  lerpColors(e, t, i) {
    return this.r = e.r + (t.r - e.r) * i, this.g = e.g + (t.g - e.g) * i, this.b = e.b + (t.b - e.b) * i, this;
  }
  lerpHSL(e, t) {
    this.getHSL(Ti), e.getHSL(lr);
    const i = jn(Ti.h, lr.h, t), n = jn(Ti.s, lr.s, t), r = jn(Ti.l, lr.l, t);
    return this.setHSL(i, n, r), this;
  }
  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }
  applyMatrix3(e) {
    const t = this.r, i = this.g, n = this.b, r = e.elements;
    return this.r = r[0] * t + r[3] * i + r[6] * n, this.g = r[1] * t + r[4] * i + r[7] * n, this.b = r[2] * t + r[5] * i + r[8] * n, this;
  }
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  fromArray(e, t = 0) {
    return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
  }
  fromBufferAttribute(e, t) {
    return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}, St = /* @__PURE__ */ new Te();
Te.NAMES = uc;
var Rh = class fc {
  constructor(t, i = 25e-5) {
    this.isFogExp2 = !0, this.name = "", this.color = new Te(t), this.density = i;
  }
  clone() {
    return new fc(this.color, this.density);
  }
  toJSON() {
    return {
      type: "FogExp2",
      name: this.name,
      color: this.color.getHex(),
      density: this.density
    };
  }
}, pc = class extends dt {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new Fi(), this.environmentIntensity = 1, this.environmentRotation = new Fi(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(e, t) {
    return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
  }
}, Kt = /* @__PURE__ */ new U(), pi = /* @__PURE__ */ new U(), us = /* @__PURE__ */ new U(), mi = /* @__PURE__ */ new U(), nn = /* @__PURE__ */ new U(), rn = /* @__PURE__ */ new U(), Na = /* @__PURE__ */ new U(), fs = /* @__PURE__ */ new U(), ps = /* @__PURE__ */ new U(), ms = /* @__PURE__ */ new U(), gs = /* @__PURE__ */ new Ze(), vs = /* @__PURE__ */ new Ze(), bs = /* @__PURE__ */ new Ze(), Un = class mn {
  constructor(t = new U(), i = new U(), n = new U()) {
    this.a = t, this.b = i, this.c = n;
  }
  static getNormal(t, i, n, r) {
    r.subVectors(n, i), Kt.subVectors(t, i), r.cross(Kt);
    const s = r.lengthSq();
    return s > 0 ? r.multiplyScalar(1 / Math.sqrt(s)) : r.set(0, 0, 0);
  }
  static getBarycoord(t, i, n, r, s) {
    Kt.subVectors(r, i), pi.subVectors(n, i), us.subVectors(t, i);
    const a = Kt.dot(Kt), o = Kt.dot(pi), c = Kt.dot(us), l = pi.dot(pi), h = pi.dot(us), u = a * l - o * o;
    if (u === 0)
      return s.set(0, 0, 0), null;
    const d = 1 / u, p = (l * c - o * h) * d, g = (a * h - o * c) * d;
    return s.set(1 - p - g, g, p);
  }
  static containsPoint(t, i, n, r) {
    return this.getBarycoord(t, i, n, r, mi) === null ? !1 : mi.x >= 0 && mi.y >= 0 && mi.x + mi.y <= 1;
  }
  static getInterpolation(t, i, n, r, s, a, o, c) {
    return this.getBarycoord(t, i, n, r, mi) === null ? (c.x = 0, c.y = 0, "z" in c && (c.z = 0), "w" in c && (c.w = 0), null) : (c.setScalar(0), c.addScaledVector(s, mi.x), c.addScaledVector(a, mi.y), c.addScaledVector(o, mi.z), c);
  }
  static getInterpolatedAttribute(t, i, n, r, s, a) {
    return gs.setScalar(0), vs.setScalar(0), bs.setScalar(0), gs.fromBufferAttribute(t, i), vs.fromBufferAttribute(t, n), bs.fromBufferAttribute(t, r), a.setScalar(0), a.addScaledVector(gs, s.x), a.addScaledVector(vs, s.y), a.addScaledVector(bs, s.z), a;
  }
  static isFrontFacing(t, i, n, r) {
    return Kt.subVectors(n, i), pi.subVectors(t, i), Kt.cross(pi).dot(r) < 0;
  }
  set(t, i, n) {
    return this.a.copy(t), this.b.copy(i), this.c.copy(n), this;
  }
  setFromPointsAndIndices(t, i, n, r) {
    return this.a.copy(t[i]), this.b.copy(t[n]), this.c.copy(t[r]), this;
  }
  setFromAttributeAndIndices(t, i, n, r) {
    return this.a.fromBufferAttribute(t, i), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, r), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return Kt.subVectors(this.c, this.b), pi.subVectors(this.a, this.b), Kt.cross(pi).length() * 0.5;
  }
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return mn.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, i) {
    return mn.getBarycoord(t, this.a, this.b, this.c, i);
  }
  getInterpolation(t, i, n, r, s) {
    return mn.getInterpolation(t, this.a, this.b, this.c, i, n, r, s);
  }
  containsPoint(t) {
    return mn.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return mn.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, i) {
    const n = this.a, r = this.b, s = this.c;
    let a, o;
    nn.subVectors(r, n), rn.subVectors(s, n), fs.subVectors(t, n);
    const c = nn.dot(fs), l = rn.dot(fs);
    if (c <= 0 && l <= 0) return i.copy(n);
    ps.subVectors(t, r);
    const h = nn.dot(ps), u = rn.dot(ps);
    if (h >= 0 && u <= h) return i.copy(r);
    const d = c * u - h * l;
    if (d <= 0 && c >= 0 && h <= 0)
      return a = c / (c - h), i.copy(n).addScaledVector(nn, a);
    ms.subVectors(t, s);
    const p = nn.dot(ms), g = rn.dot(ms);
    if (g >= 0 && p <= g) return i.copy(s);
    const _ = p * l - c * g;
    if (_ <= 0 && l >= 0 && g <= 0)
      return o = l / (l - g), i.copy(n).addScaledVector(rn, o);
    const m = h * g - p * u;
    if (m <= 0 && u - h >= 0 && p - g >= 0)
      return Na.subVectors(s, r), o = (u - h) / (u - h + (p - g)), i.copy(r).addScaledVector(Na, o);
    const f = 1 / (m + _ + d);
    return a = _ * f, o = d * f, i.copy(n).addScaledVector(nn, a).addScaledVector(rn, o);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}, xi = class {
  constructor(e = new U(1 / 0, 1 / 0, 1 / 0), t = new U(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = e, this.max = t;
  }
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, i = e.length; t < i; t += 3) this.expandByPoint(jt.fromArray(e, t));
    return this;
  }
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, i = e.count; t < i; t++) this.expandByPoint(jt.fromBufferAttribute(e, t));
    return this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, i = e.length; t < i; t++) this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const i = jt.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(i), this.max.copy(e).add(i), this;
  }
  setFromObject(e, t = !1) {
    return this.makeEmpty(), this.expandByObject(e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  expandByObject(e, t = !1) {
    e.updateWorldMatrix(!1, !1);
    const i = e.geometry;
    if (i !== void 0) {
      const r = i.getAttribute("position");
      if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0) for (let s = 0, a = r.count; s < a; s++)
        e.isMesh === !0 ? e.getVertexPosition(s, jt) : jt.fromBufferAttribute(r, s), jt.applyMatrix4(e.matrixWorld), this.expandByPoint(jt);
      else
        e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), hr.copy(e.boundingBox)) : (i.boundingBox === null && i.computeBoundingBox(), hr.copy(i.boundingBox)), hr.applyMatrix4(e.matrixWorld), this.union(hr);
    }
    const n = e.children;
    for (let r = 0, s = n.length; r < s; r++) this.expandByObject(n[r], t);
    return this;
  }
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }
  getParameter(e, t) {
    return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z));
  }
  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
  }
  intersectsSphere(e) {
    return this.clampPoint(e.center, jt), jt.distanceToSquared(e.center) <= e.radius * e.radius;
  }
  intersectsPlane(e) {
    let t, i;
    return e.normal.x > 0 ? (t = e.normal.x * this.min.x, i = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, i = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, i += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, i += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, i += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, i += e.normal.z * this.min.z), t <= -e.constant && i >= -e.constant;
  }
  intersectsTriangle(e) {
    if (this.isEmpty()) return !1;
    this.getCenter(Fn), dr.subVectors(this.max, Fn), sn.subVectors(e.a, Fn), an.subVectors(e.b, Fn), on.subVectors(e.c, Fn), Ai.subVectors(an, sn), wi.subVectors(on, an), ki.subVectors(sn, on);
    let t = [
      0,
      -Ai.z,
      Ai.y,
      0,
      -wi.z,
      wi.y,
      0,
      -ki.z,
      ki.y,
      Ai.z,
      0,
      -Ai.x,
      wi.z,
      0,
      -wi.x,
      ki.z,
      0,
      -ki.x,
      -Ai.y,
      Ai.x,
      0,
      -wi.y,
      wi.x,
      0,
      -ki.y,
      ki.x,
      0
    ];
    return !_s(t, sn, an, on, dr) || (t = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], !_s(t, sn, an, on, dr)) ? !1 : (ur.crossVectors(Ai, wi), t = [
      ur.x,
      ur.y,
      ur.z
    ], _s(t, sn, an, on, dr));
  }
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  distanceToPoint(e) {
    return this.clampPoint(e, jt).distanceTo(e);
  }
  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(jt).length() * 0.5), e;
  }
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  applyMatrix4(e) {
    return this.isEmpty() ? this : (gi[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), gi[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), gi[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), gi[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), gi[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), gi[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), gi[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), gi[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(gi), this);
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
  toJSON() {
    return {
      min: this.min.toArray(),
      max: this.max.toArray()
    };
  }
  fromJSON(e) {
    return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
  }
}, gi = [
  /* @__PURE__ */ new U(),
  /* @__PURE__ */ new U(),
  /* @__PURE__ */ new U(),
  /* @__PURE__ */ new U(),
  /* @__PURE__ */ new U(),
  /* @__PURE__ */ new U(),
  /* @__PURE__ */ new U(),
  /* @__PURE__ */ new U()
], jt = /* @__PURE__ */ new U(), hr = /* @__PURE__ */ new xi(), sn = /* @__PURE__ */ new U(), an = /* @__PURE__ */ new U(), on = /* @__PURE__ */ new U(), Ai = /* @__PURE__ */ new U(), wi = /* @__PURE__ */ new U(), ki = /* @__PURE__ */ new U(), Fn = /* @__PURE__ */ new U(), dr = /* @__PURE__ */ new U(), ur = /* @__PURE__ */ new U(), Bi = /* @__PURE__ */ new U();
function _s(e, t, i, n, r) {
  for (let s = 0, a = e.length - 3; s <= a; s += 3) {
    Bi.fromArray(e, s);
    const o = r.x * Math.abs(Bi.x) + r.y * Math.abs(Bi.y) + r.z * Math.abs(Bi.z), c = t.dot(Bi), l = i.dot(Bi), h = n.dot(Bi);
    if (Math.max(-Math.max(c, l, h), Math.min(c, l, h)) > o) return !1;
  }
  return !0;
}
var ht = /* @__PURE__ */ new U(), fr = /* @__PURE__ */ new Fe(), Ch = 0, Tt = class extends Yi {
  constructor(e, t, i = !1) {
    if (super(), Array.isArray(e)) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, Object.defineProperty(this, "id", { value: Ch++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = i, this.usage = oc, this.updateRanges = [], this.gpuType = wn, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({
      start: e,
      count: t
    });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }
  copyAt(e, t, i) {
    e *= this.itemSize, i *= t.itemSize;
    for (let n = 0, r = this.itemSize; n < r; n++) this.array[e + n] = t.array[i + n];
    return this;
  }
  copyArray(e) {
    return this.array.set(e), this;
  }
  applyMatrix3(e) {
    if (this.itemSize === 2) for (let t = 0, i = this.count; t < i; t++)
      fr.fromBufferAttribute(this, t), fr.applyMatrix3(e), this.setXY(t, fr.x, fr.y);
    else if (this.itemSize === 3) for (let t = 0, i = this.count; t < i; t++)
      ht.fromBufferAttribute(this, t), ht.applyMatrix3(e), this.setXYZ(t, ht.x, ht.y, ht.z);
    return this;
  }
  applyMatrix4(e) {
    for (let t = 0, i = this.count; t < i; t++)
      ht.fromBufferAttribute(this, t), ht.applyMatrix4(e), this.setXYZ(t, ht.x, ht.y, ht.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, i = this.count; t < i; t++)
      ht.fromBufferAttribute(this, t), ht.applyNormalMatrix(e), this.setXYZ(t, ht.x, ht.y, ht.z);
    return this;
  }
  transformDirection(e) {
    for (let t = 0, i = this.count; t < i; t++)
      ht.fromBufferAttribute(this, t), ht.transformDirection(e), this.setXYZ(t, ht.x, ht.y, ht.z);
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  getComponent(e, t) {
    let i = this.array[e * this.itemSize + t];
    return this.normalized && (i = Yt(i, this.array)), i;
  }
  setComponent(e, t, i) {
    return this.normalized && (i = Ye(i, this.array)), this.array[e * this.itemSize + t] = i, this;
  }
  getX(e) {
    let t = this.array[e * this.itemSize];
    return this.normalized && (t = Yt(t, this.array)), t;
  }
  setX(e, t) {
    return this.normalized && (t = Ye(t, this.array)), this.array[e * this.itemSize] = t, this;
  }
  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return this.normalized && (t = Yt(t, this.array)), t;
  }
  setY(e, t) {
    return this.normalized && (t = Ye(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
  }
  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return this.normalized && (t = Yt(t, this.array)), t;
  }
  setZ(e, t) {
    return this.normalized && (t = Ye(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
  }
  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return this.normalized && (t = Yt(t, this.array)), t;
  }
  setW(e, t) {
    return this.normalized && (t = Ye(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
  }
  setXY(e, t, i) {
    return e *= this.itemSize, this.normalized && (t = Ye(t, this.array), i = Ye(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = i, this;
  }
  setXYZ(e, t, i, n) {
    return e *= this.itemSize, this.normalized && (t = Ye(t, this.array), i = Ye(i, this.array), n = Ye(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = i, this.array[e + 2] = n, this;
  }
  setXYZW(e, t, i, n, r) {
    return e *= this.itemSize, this.normalized && (t = Ye(t, this.array), i = Ye(i, this.array), n = Ye(n, this.array), r = Ye(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = i, this.array[e + 2] = n, this.array[e + 3] = r, this;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (e.name = this.name), this.usage !== 35044 && (e.usage = this.usage), e;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}, mc = class extends Tt {
  constructor(e, t, i) {
    super(new Uint16Array(e), t, i);
  }
}, gc = class extends Tt {
  constructor(e, t, i) {
    super(new Uint32Array(e), t, i);
  }
}, Ut = class extends Tt {
  constructor(e, t, i) {
    super(new Float32Array(e), t, i);
  }
}, Ph = /* @__PURE__ */ new xi(), On = /* @__PURE__ */ new U(), Ms = /* @__PURE__ */ new U(), hi = class {
  constructor(e = new U(), t = -1) {
    this.isSphere = !0, this.center = e, this.radius = t;
  }
  set(e, t) {
    return this.center.copy(e), this.radius = t, this;
  }
  setFromPoints(e, t) {
    const i = this.center;
    t !== void 0 ? i.copy(t) : Ph.setFromPoints(e).getCenter(i);
    let n = 0;
    for (let r = 0, s = e.length; r < s; r++) n = Math.max(n, i.distanceToSquared(e[r]));
    return this.radius = Math.sqrt(n), this;
  }
  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(e, t) {
    const i = this.center.distanceToSquared(e);
    return t.copy(e), i > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
  }
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }
  translate(e) {
    return this.center.add(e), this;
  }
  expandByPoint(e) {
    if (this.isEmpty())
      return this.center.copy(e), this.radius = 0, this;
    On.subVectors(e, this.center);
    const t = On.lengthSq();
    if (t > this.radius * this.radius) {
      const i = Math.sqrt(t), n = (i - this.radius) * 0.5;
      this.center.addScaledVector(On, n / i), this.radius += n;
    }
    return this;
  }
  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (Ms.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(On.copy(e.center).add(Ms)), this.expandByPoint(On.copy(e.center).sub(Ms))), this);
  }
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    return {
      radius: this.radius,
      center: this.center.toArray()
    };
  }
  fromJSON(e) {
    return this.radius = e.radius, this.center.fromArray(e.center), this;
  }
}, Lh = 0, zt = /* @__PURE__ */ new Ne(), xs = /* @__PURE__ */ new dt(), cn = /* @__PURE__ */ new U(), Ot = /* @__PURE__ */ new xi(), kn = /* @__PURE__ */ new xi(), gt = /* @__PURE__ */ new U(), Wt = class vc extends Yi {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Lh++ }), this.uuid = $t(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.indirectOffset = 0, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
      start: 0,
      count: 1 / 0
    }, this.userData = {}, this._transformed = !1;
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (jl(t) ? gc : mc)(t, 1) : this.index = t, this;
  }
  setIndirect(t, i = 0) {
    return this.indirect = t, this.indirectOffset = i, this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, i) {
    return this.attributes[t] = i, this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, i, n = 0) {
    this.groups.push({
      start: t,
      count: i,
      materialIndex: n
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, i) {
    this.drawRange.start = t, this.drawRange.count = i;
  }
  applyMatrix4(t) {
    const i = this.attributes.position;
    i !== void 0 && (i.applyMatrix4(t), i.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const s = new Ie().getNormalMatrix(t);
      n.applyNormalMatrix(s), n.needsUpdate = !0;
    }
    const r = this.attributes.tangent;
    return r !== void 0 && (r.transformDirection(t), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this._transformed = !0, this;
  }
  applyQuaternion(t) {
    return zt.makeRotationFromQuaternion(t), this.applyMatrix4(zt), this;
  }
  rotateX(t) {
    return zt.makeRotationX(t), this.applyMatrix4(zt), this;
  }
  rotateY(t) {
    return zt.makeRotationY(t), this.applyMatrix4(zt), this;
  }
  rotateZ(t) {
    return zt.makeRotationZ(t), this.applyMatrix4(zt), this;
  }
  translate(t, i, n) {
    return zt.makeTranslation(t, i, n), this.applyMatrix4(zt), this;
  }
  scale(t, i, n) {
    return zt.makeScale(t, i, n), this.applyMatrix4(zt), this;
  }
  lookAt(t) {
    return xs.lookAt(t), xs.updateMatrix(), this.applyMatrix4(xs.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(cn).negate(), this.translate(cn.x, cn.y, cn.z), this;
  }
  setFromPoints(t) {
    const i = this.getAttribute("position");
    if (i === void 0) {
      const n = [];
      for (let r = 0, s = t.length; r < s; r++) {
        const a = t[r];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new Ut(n, 3));
    } else {
      const n = Math.min(t.length, i.count);
      for (let r = 0; r < n; r++) {
        const s = t[r];
        i.setXYZ(r, s.x, s.y, s.z || 0);
      }
      t.length > i.count && xe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), i.needsUpdate = !0;
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new xi());
    const t = this.attributes.position, i = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      Re("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new U(-1 / 0, -1 / 0, -1 / 0), new U(1 / 0, 1 / 0, 1 / 0));
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), i) for (let n = 0, r = i.length; n < r; n++) {
        const s = i[n];
        Ot.setFromBufferAttribute(s), this.morphTargetsRelative ? (gt.addVectors(this.boundingBox.min, Ot.min), this.boundingBox.expandByPoint(gt), gt.addVectors(this.boundingBox.max, Ot.max), this.boundingBox.expandByPoint(gt)) : (this.boundingBox.expandByPoint(Ot.min), this.boundingBox.expandByPoint(Ot.max));
      }
    } else this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && Re('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new hi());
    const t = this.attributes.position, i = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      Re("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new U(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if (Ot.setFromBufferAttribute(t), i) for (let s = 0, a = i.length; s < a; s++) {
        const o = i[s];
        kn.setFromBufferAttribute(o), this.morphTargetsRelative ? (gt.addVectors(Ot.min, kn.min), Ot.expandByPoint(gt), gt.addVectors(Ot.max, kn.max), Ot.expandByPoint(gt)) : (Ot.expandByPoint(kn.min), Ot.expandByPoint(kn.max));
      }
      Ot.getCenter(n);
      let r = 0;
      for (let s = 0, a = t.count; s < a; s++)
        gt.fromBufferAttribute(t, s), r = Math.max(r, n.distanceToSquared(gt));
      if (i) for (let s = 0, a = i.length; s < a; s++) {
        const o = i[s], c = this.morphTargetsRelative;
        for (let l = 0, h = o.count; l < h; l++)
          gt.fromBufferAttribute(o, l), c && (cn.fromBufferAttribute(t, l), gt.add(cn)), r = Math.max(r, n.distanceToSquared(gt));
      }
      this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && Re('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const t = this.index, i = this.attributes;
    if (t === null || i.position === void 0 || i.normal === void 0 || i.uv === void 0) {
      Re("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = i.position, r = i.normal, s = i.uv;
    let a = this.getAttribute("tangent");
    (a === void 0 || a.count !== n.count) && (a = new Tt(new Float32Array(4 * n.count), 4), this.setAttribute("tangent", a));
    const o = [], c = [];
    for (let v = 0; v < n.count; v++)
      o[v] = new U(), c[v] = new U();
    const l = new U(), h = new U(), u = new U(), d = new Fe(), p = new Fe(), g = new Fe(), _ = new U(), m = new U();
    function f(v, y, V) {
      l.fromBufferAttribute(n, v), h.fromBufferAttribute(n, y), u.fromBufferAttribute(n, V), d.fromBufferAttribute(s, v), p.fromBufferAttribute(s, y), g.fromBufferAttribute(s, V), h.sub(l), u.sub(l), p.sub(d), g.sub(d);
      const R = 1 / (p.x * g.y - g.x * p.y);
      isFinite(R) && (_.copy(h).multiplyScalar(g.y).addScaledVector(u, -p.y).multiplyScalar(R), m.copy(u).multiplyScalar(p.x).addScaledVector(h, -g.x).multiplyScalar(R), o[v].add(_), o[y].add(_), o[V].add(_), c[v].add(m), c[y].add(m), c[V].add(m));
    }
    let T = this.groups;
    T.length === 0 && (T = [{
      start: 0,
      count: t.count
    }]);
    for (let v = 0, y = T.length; v < y; ++v) {
      const V = T[v], R = V.start, k = V.count;
      for (let q = R, X = R + k; q < X; q += 3) f(t.getX(q + 0), t.getX(q + 1), t.getX(q + 2));
    }
    const A = new U(), M = new U(), E = new U(), w = new U();
    function C(v) {
      E.fromBufferAttribute(r, v), w.copy(E);
      const y = o[v];
      A.copy(y), A.sub(E.multiplyScalar(E.dot(y))).normalize(), M.crossVectors(w, y);
      const V = M.dot(c[v]) < 0 ? -1 : 1;
      a.setXYZW(v, A.x, A.y, A.z, V);
    }
    for (let v = 0, y = T.length; v < y; ++v) {
      const V = T[v], R = V.start, k = V.count;
      for (let q = R, X = R + k; q < X; q += 3)
        C(t.getX(q + 0)), C(t.getX(q + 1)), C(t.getX(q + 2));
    }
    this._transformed = !0;
  }
  computeVertexNormals() {
    const t = this.index, i = this.getAttribute("position");
    if (i !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0 || n.count !== i.count)
        n = new Tt(new Float32Array(i.count * 3), 3), this.setAttribute("normal", n);
      else for (let d = 0, p = n.count; d < p; d++) n.setXYZ(d, 0, 0, 0);
      const r = new U(), s = new U(), a = new U(), o = new U(), c = new U(), l = new U(), h = new U(), u = new U();
      if (t) for (let d = 0, p = t.count; d < p; d += 3) {
        const g = t.getX(d + 0), _ = t.getX(d + 1), m = t.getX(d + 2);
        r.fromBufferAttribute(i, g), s.fromBufferAttribute(i, _), a.fromBufferAttribute(i, m), h.subVectors(a, s), u.subVectors(r, s), h.cross(u), o.fromBufferAttribute(n, g), c.fromBufferAttribute(n, _), l.fromBufferAttribute(n, m), o.add(h), c.add(h), l.add(h), n.setXYZ(g, o.x, o.y, o.z), n.setXYZ(_, c.x, c.y, c.z), n.setXYZ(m, l.x, l.y, l.z);
      }
      else for (let d = 0, p = i.count; d < p; d += 3)
        r.fromBufferAttribute(i, d + 0), s.fromBufferAttribute(i, d + 1), a.fromBufferAttribute(i, d + 2), h.subVectors(a, s), u.subVectors(r, s), h.cross(u), n.setXYZ(d + 0, h.x, h.y, h.z), n.setXYZ(d + 1, h.x, h.y, h.z), n.setXYZ(d + 2, h.x, h.y, h.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let i = 0, n = t.count; i < n; i++)
      gt.fromBufferAttribute(t, i), gt.normalize(), t.setXYZ(i, gt.x, gt.y, gt.z);
  }
  toNonIndexed() {
    function t(o, c) {
      const l = o.array, h = o.itemSize, u = o.normalized, d = new l.constructor(c.length * h);
      let p = 0, g = 0;
      for (let _ = 0, m = c.length; _ < m; _++) {
        o.isInterleavedBufferAttribute ? p = c[_] * o.data.stride + o.offset : p = c[_] * h;
        for (let f = 0; f < h; f++) d[g++] = l[p++];
      }
      return new Tt(d, h, u);
    }
    if (this.index === null)
      return xe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const i = new vc(), n = this.index.array, r = this.attributes;
    for (const o in r) {
      const c = r[o], l = t(c, n);
      i.setAttribute(o, l);
    }
    const s = this.morphAttributes;
    for (const o in s) {
      const c = [], l = s[o];
      for (let h = 0, u = l.length; h < u; h++) {
        const d = l[h], p = t(d, n);
        c.push(p);
      }
      i.morphAttributes[o] = c;
    }
    i.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, c = a.length; o < c; o++) {
      const l = a[o];
      i.addGroup(l.start, l.count, l.materialIndex);
    }
    return i;
  }
  toJSON() {
    const t = { metadata: {
      version: 4.7,
      type: "BufferGeometry",
      generator: "BufferGeometry.toJSON"
    } };
    if (t.uuid = this.uuid, t.type = this.parameters !== void 0 && this._transformed === !0 ? "BufferGeometry" : this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0 && this._transformed !== !0) {
      const c = this.parameters;
      for (const l in c) c[l] !== void 0 && (t[l] = c[l]);
      return t;
    }
    t.data = { attributes: {} };
    const i = this.index;
    i !== null && (t.data.index = {
      type: i.array.constructor.name,
      array: Array.prototype.slice.call(i.array)
    });
    const n = this.attributes;
    for (const c in n) {
      const l = n[c];
      t.data.attributes[c] = l.toJSON(t.data);
    }
    const r = {};
    let s = !1;
    for (const c in this.morphAttributes) {
      const l = this.morphAttributes[c], h = [];
      for (let u = 0, d = l.length; u < d; u++) {
        const p = l[u];
        h.push(p.toJSON(t.data));
      }
      h.length > 0 && (r[c] = h, s = !0);
    }
    s && (t.data.morphAttributes = r, t.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (t.data.boundingSphere = o.toJSON()), t;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const i = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone());
    const r = t.attributes;
    for (const l in r) {
      const h = r[l];
      this.setAttribute(l, h.clone(i));
    }
    const s = t.morphAttributes;
    for (const l in s) {
      const h = [], u = s[l];
      for (let d = 0, p = u.length; d < p; d++) h.push(u[d].clone(i));
      this.morphAttributes[l] = h;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const a = t.groups;
    for (let l = 0, h = a.length; l < h; l++) {
      const u = a[l];
      this.addGroup(u.start, u.count, u.materialIndex);
    }
    const o = t.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const c = t.boundingSphere;
    return c !== null && (this.boundingSphere = c.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this._transformed = t._transformed, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}, Dh = class {
  constructor(e, t) {
    this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = oc, this.updateRanges = [], this.version = 0, this.uuid = $t();
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({
      start: e,
      count: t
    });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
  }
  copyAt(e, t, i) {
    e *= this.stride, i *= t.stride;
    for (let n = 0, r = this.stride; n < r; n++) this.array[e + n] = t.array[i + n];
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  clone(e) {
    e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = $t()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), i = new this.constructor(t, this.stride);
    return i.setUsage(this.usage), i;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  toJSON(e) {
    return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = $t()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
      uuid: this.uuid,
      buffer: this.array.buffer._uuid,
      type: this.array.constructor.name,
      stride: this.stride
    };
  }
}, Rt = /* @__PURE__ */ new U(), Ih = class bc {
  constructor(t, i, n, r = !1) {
    this.isInterleavedBufferAttribute = !0, this.name = "", this.data = t, this.itemSize = i, this.offset = n, this.normalized = r;
  }
  get count() {
    return this.data.count;
  }
  get array() {
    return this.data.array;
  }
  set needsUpdate(t) {
    this.data.needsUpdate = t;
  }
  applyMatrix4(t) {
    for (let i = 0, n = this.data.count; i < n; i++)
      Rt.fromBufferAttribute(this, i), Rt.applyMatrix4(t), this.setXYZ(i, Rt.x, Rt.y, Rt.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let i = 0, n = this.count; i < n; i++)
      Rt.fromBufferAttribute(this, i), Rt.applyNormalMatrix(t), this.setXYZ(i, Rt.x, Rt.y, Rt.z);
    return this;
  }
  transformDirection(t) {
    for (let i = 0, n = this.count; i < n; i++)
      Rt.fromBufferAttribute(this, i), Rt.transformDirection(t), this.setXYZ(i, Rt.x, Rt.y, Rt.z);
    return this;
  }
  getComponent(t, i) {
    let n = this.array[t * this.data.stride + this.offset + i];
    return this.normalized && (n = Yt(n, this.array)), n;
  }
  setComponent(t, i, n) {
    return this.normalized && (n = Ye(n, this.array)), this.data.array[t * this.data.stride + this.offset + i] = n, this;
  }
  setX(t, i) {
    return this.normalized && (i = Ye(i, this.array)), this.data.array[t * this.data.stride + this.offset] = i, this;
  }
  setY(t, i) {
    return this.normalized && (i = Ye(i, this.array)), this.data.array[t * this.data.stride + this.offset + 1] = i, this;
  }
  setZ(t, i) {
    return this.normalized && (i = Ye(i, this.array)), this.data.array[t * this.data.stride + this.offset + 2] = i, this;
  }
  setW(t, i) {
    return this.normalized && (i = Ye(i, this.array)), this.data.array[t * this.data.stride + this.offset + 3] = i, this;
  }
  getX(t) {
    let i = this.data.array[t * this.data.stride + this.offset];
    return this.normalized && (i = Yt(i, this.array)), i;
  }
  getY(t) {
    let i = this.data.array[t * this.data.stride + this.offset + 1];
    return this.normalized && (i = Yt(i, this.array)), i;
  }
  getZ(t) {
    let i = this.data.array[t * this.data.stride + this.offset + 2];
    return this.normalized && (i = Yt(i, this.array)), i;
  }
  getW(t) {
    let i = this.data.array[t * this.data.stride + this.offset + 3];
    return this.normalized && (i = Yt(i, this.array)), i;
  }
  setXY(t, i, n) {
    return t = t * this.data.stride + this.offset, this.normalized && (i = Ye(i, this.array), n = Ye(n, this.array)), this.data.array[t + 0] = i, this.data.array[t + 1] = n, this;
  }
  setXYZ(t, i, n, r) {
    return t = t * this.data.stride + this.offset, this.normalized && (i = Ye(i, this.array), n = Ye(n, this.array), r = Ye(r, this.array)), this.data.array[t + 0] = i, this.data.array[t + 1] = n, this.data.array[t + 2] = r, this;
  }
  setXYZW(t, i, n, r, s) {
    return t = t * this.data.stride + this.offset, this.normalized && (i = Ye(i, this.array), n = Ye(n, this.array), r = Ye(r, this.array), s = Ye(s, this.array)), this.data.array[t + 0] = i, this.data.array[t + 1] = n, this.data.array[t + 2] = r, this.data.array[t + 3] = s, this;
  }
  clone(t) {
    if (t === void 0) {
      Wr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const i = [];
      for (let n = 0; n < this.count; n++) {
        const r = n * this.data.stride + this.offset;
        for (let s = 0; s < this.itemSize; s++) i.push(this.data.array[r + s]);
      }
      return new Tt(new this.array.constructor(i), this.itemSize, this.normalized);
    } else
      return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.clone(t)), new bc(t.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  toJSON(t) {
    if (t === void 0) {
      Wr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const i = [];
      for (let n = 0; n < this.count; n++) {
        const r = n * this.data.stride + this.offset;
        for (let s = 0; s < this.itemSize; s++) i.push(this.data.array[r + s]);
      }
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: i,
        normalized: this.normalized
      };
    } else
      return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.toJSON(t)), {
        isInterleavedBufferAttribute: !0,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
  }
}, Nh = 0, ci = class extends Yi {
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Nh++ }), this.uuid = $t(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Te(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = rs, this.stencilZFail = rs, this.stencilZPass = rs, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.allowOverride = !0, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
  }
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(e) {
    if (e !== void 0)
      for (const t in e) {
        const i = e[t];
        if (i === void 0) {
          xe(`Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const n = this[t];
        if (n === void 0) {
          xe(`Material: '${t}' is not a property of THREE.${this.type}.`);
          continue;
        }
        n && n.isColor ? n.set(i) : n && n.isVector2 && i && i.isVector2 || n && n.isEuler && i && i.isEuler || n && n.isVector3 && i && i.isVector3 ? n.copy(i) : this[t] = i;
      }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    t && (e = {
      textures: {},
      images: {}
    });
    const i = { metadata: {
      version: 4.7,
      type: "Material",
      generator: "Material.toJSON"
    } };
    i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.color && this.color.isColor && (i.color = this.color.getHex()), this.roughness !== void 0 && (i.roughness = this.roughness), this.metalness !== void 0 && (i.metalness = this.metalness), this.sheen !== void 0 && (i.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (i.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (i.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (i.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (i.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (i.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (i.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (i.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (i.shininess = this.shininess), this.clearcoat !== void 0 && (i.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (i.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (i.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (i.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (i.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, i.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (i.sheenColorMap = this.sheenColorMap.toJSON(e).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (i.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid), this.dispersion !== void 0 && (i.dispersion = this.dispersion), this.iridescence !== void 0 && (i.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (i.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (i.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (i.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (i.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (i.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (i.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (i.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (i.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (i.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (i.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (i.lightMap = this.lightMap.toJSON(e).uuid, i.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (i.aoMap = this.aoMap.toJSON(e).uuid, i.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (i.bumpMap = this.bumpMap.toJSON(e).uuid, i.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (i.normalMap = this.normalMap.toJSON(e).uuid, i.normalMapType = this.normalMapType, i.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (i.displacementMap = this.displacementMap.toJSON(e).uuid, i.displacementScale = this.displacementScale, i.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (i.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (i.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (i.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (i.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (i.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (i.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (i.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (i.combine = this.combine)), this.envMapRotation !== void 0 && (i.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (i.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (i.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (i.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (i.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (i.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (i.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (i.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (i.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (i.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (i.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (i.size = this.size), this.shadowSide !== null && (i.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (i.sizeAttenuation = this.sizeAttenuation), this.blending !== 1 && (i.blending = this.blending), this.side !== 0 && (i.side = this.side), this.vertexColors === !0 && (i.vertexColors = !0), this.opacity < 1 && (i.opacity = this.opacity), this.transparent === !0 && (i.transparent = !0), this.blendSrc !== 204 && (i.blendSrc = this.blendSrc), this.blendDst !== 205 && (i.blendDst = this.blendDst), this.blendEquation !== 100 && (i.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (i.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (i.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (i.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (i.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (i.blendAlpha = this.blendAlpha), this.depthFunc !== 3 && (i.depthFunc = this.depthFunc), this.depthTest === !1 && (i.depthTest = this.depthTest), this.depthWrite === !1 && (i.depthWrite = this.depthWrite), this.colorWrite === !1 && (i.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (i.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== 519 && (i.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (i.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (i.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== 7680 && (i.stencilFail = this.stencilFail), this.stencilZFail !== 7680 && (i.stencilZFail = this.stencilZFail), this.stencilZPass !== 7680 && (i.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (i.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (i.rotation = this.rotation), this.polygonOffset === !0 && (i.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (i.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (i.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (i.linewidth = this.linewidth), this.dashSize !== void 0 && (i.dashSize = this.dashSize), this.gapSize !== void 0 && (i.gapSize = this.gapSize), this.scale !== void 0 && (i.scale = this.scale), this.dithering === !0 && (i.dithering = !0), this.alphaTest > 0 && (i.alphaTest = this.alphaTest), this.alphaHash === !0 && (i.alphaHash = !0), this.alphaToCoverage === !0 && (i.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (i.premultipliedAlpha = !0), this.forceSinglePass === !0 && (i.forceSinglePass = !0), this.allowOverride === !1 && (i.allowOverride = !1), this.wireframe === !0 && (i.wireframe = !0), this.wireframeLinewidth > 1 && (i.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (i.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (i.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (i.flatShading = !0), this.visible === !1 && (i.visible = !1), this.toneMapped === !1 && (i.toneMapped = !1), this.fog === !1 && (i.fog = !1), Object.keys(this.userData).length > 0 && (i.userData = this.userData);
    function n(r) {
      const s = [];
      for (const a in r) {
        const o = r[a];
        delete o.metadata, s.push(o);
      }
      return s;
    }
    if (t) {
      const r = n(e.textures), s = n(e.images);
      r.length > 0 && (i.textures = r), s.length > 0 && (i.images = s);
    }
    return i;
  }
  fromJSON(e, t) {
    if (e.uuid !== void 0 && (this.uuid = e.uuid), e.name !== void 0 && (this.name = e.name), e.color !== void 0 && this.color !== void 0 && this.color.setHex(e.color), e.roughness !== void 0 && (this.roughness = e.roughness), e.metalness !== void 0 && (this.metalness = e.metalness), e.sheen !== void 0 && (this.sheen = e.sheen), e.sheenColor !== void 0 && (this.sheenColor = new Te().setHex(e.sheenColor)), e.sheenRoughness !== void 0 && (this.sheenRoughness = e.sheenRoughness), e.emissive !== void 0 && this.emissive !== void 0 && this.emissive.setHex(e.emissive), e.specular !== void 0 && this.specular !== void 0 && this.specular.setHex(e.specular), e.specularIntensity !== void 0 && (this.specularIntensity = e.specularIntensity), e.specularColor !== void 0 && this.specularColor !== void 0 && this.specularColor.setHex(e.specularColor), e.shininess !== void 0 && (this.shininess = e.shininess), e.clearcoat !== void 0 && (this.clearcoat = e.clearcoat), e.clearcoatRoughness !== void 0 && (this.clearcoatRoughness = e.clearcoatRoughness), e.dispersion !== void 0 && (this.dispersion = e.dispersion), e.iridescence !== void 0 && (this.iridescence = e.iridescence), e.iridescenceIOR !== void 0 && (this.iridescenceIOR = e.iridescenceIOR), e.iridescenceThicknessRange !== void 0 && (this.iridescenceThicknessRange = e.iridescenceThicknessRange), e.transmission !== void 0 && (this.transmission = e.transmission), e.thickness !== void 0 && (this.thickness = e.thickness), e.attenuationDistance !== void 0 && (this.attenuationDistance = e.attenuationDistance), e.attenuationColor !== void 0 && this.attenuationColor !== void 0 && this.attenuationColor.setHex(e.attenuationColor), e.anisotropy !== void 0 && (this.anisotropy = e.anisotropy), e.anisotropyRotation !== void 0 && (this.anisotropyRotation = e.anisotropyRotation), e.fog !== void 0 && (this.fog = e.fog), e.flatShading !== void 0 && (this.flatShading = e.flatShading), e.blending !== void 0 && (this.blending = e.blending), e.combine !== void 0 && (this.combine = e.combine), e.side !== void 0 && (this.side = e.side), e.shadowSide !== void 0 && (this.shadowSide = e.shadowSide), e.opacity !== void 0 && (this.opacity = e.opacity), e.transparent !== void 0 && (this.transparent = e.transparent), e.alphaTest !== void 0 && (this.alphaTest = e.alphaTest), e.alphaHash !== void 0 && (this.alphaHash = e.alphaHash), e.depthFunc !== void 0 && (this.depthFunc = e.depthFunc), e.depthTest !== void 0 && (this.depthTest = e.depthTest), e.depthWrite !== void 0 && (this.depthWrite = e.depthWrite), e.colorWrite !== void 0 && (this.colorWrite = e.colorWrite), e.blendSrc !== void 0 && (this.blendSrc = e.blendSrc), e.blendDst !== void 0 && (this.blendDst = e.blendDst), e.blendEquation !== void 0 && (this.blendEquation = e.blendEquation), e.blendSrcAlpha !== void 0 && (this.blendSrcAlpha = e.blendSrcAlpha), e.blendDstAlpha !== void 0 && (this.blendDstAlpha = e.blendDstAlpha), e.blendEquationAlpha !== void 0 && (this.blendEquationAlpha = e.blendEquationAlpha), e.blendColor !== void 0 && this.blendColor !== void 0 && this.blendColor.setHex(e.blendColor), e.blendAlpha !== void 0 && (this.blendAlpha = e.blendAlpha), e.stencilWriteMask !== void 0 && (this.stencilWriteMask = e.stencilWriteMask), e.stencilFunc !== void 0 && (this.stencilFunc = e.stencilFunc), e.stencilRef !== void 0 && (this.stencilRef = e.stencilRef), e.stencilFuncMask !== void 0 && (this.stencilFuncMask = e.stencilFuncMask), e.stencilFail !== void 0 && (this.stencilFail = e.stencilFail), e.stencilZFail !== void 0 && (this.stencilZFail = e.stencilZFail), e.stencilZPass !== void 0 && (this.stencilZPass = e.stencilZPass), e.stencilWrite !== void 0 && (this.stencilWrite = e.stencilWrite), e.wireframe !== void 0 && (this.wireframe = e.wireframe), e.wireframeLinewidth !== void 0 && (this.wireframeLinewidth = e.wireframeLinewidth), e.wireframeLinecap !== void 0 && (this.wireframeLinecap = e.wireframeLinecap), e.wireframeLinejoin !== void 0 && (this.wireframeLinejoin = e.wireframeLinejoin), e.rotation !== void 0 && (this.rotation = e.rotation), e.linewidth !== void 0 && (this.linewidth = e.linewidth), e.dashSize !== void 0 && (this.dashSize = e.dashSize), e.gapSize !== void 0 && (this.gapSize = e.gapSize), e.scale !== void 0 && (this.scale = e.scale), e.polygonOffset !== void 0 && (this.polygonOffset = e.polygonOffset), e.polygonOffsetFactor !== void 0 && (this.polygonOffsetFactor = e.polygonOffsetFactor), e.polygonOffsetUnits !== void 0 && (this.polygonOffsetUnits = e.polygonOffsetUnits), e.dithering !== void 0 && (this.dithering = e.dithering), e.alphaToCoverage !== void 0 && (this.alphaToCoverage = e.alphaToCoverage), e.premultipliedAlpha !== void 0 && (this.premultipliedAlpha = e.premultipliedAlpha), e.forceSinglePass !== void 0 && (this.forceSinglePass = e.forceSinglePass), e.allowOverride !== void 0 && (this.allowOverride = e.allowOverride), e.visible !== void 0 && (this.visible = e.visible), e.toneMapped !== void 0 && (this.toneMapped = e.toneMapped), e.userData !== void 0 && (this.userData = e.userData), e.vertexColors !== void 0 && (typeof e.vertexColors == "number" ? this.vertexColors = e.vertexColors > 0 : this.vertexColors = e.vertexColors), e.size !== void 0 && (this.size = e.size), e.sizeAttenuation !== void 0 && (this.sizeAttenuation = e.sizeAttenuation), e.map !== void 0 && (this.map = t[e.map] || null), e.matcap !== void 0 && (this.matcap = t[e.matcap] || null), e.alphaMap !== void 0 && (this.alphaMap = t[e.alphaMap] || null), e.bumpMap !== void 0 && (this.bumpMap = t[e.bumpMap] || null), e.bumpScale !== void 0 && (this.bumpScale = e.bumpScale), e.normalMap !== void 0 && (this.normalMap = t[e.normalMap] || null), e.normalMapType !== void 0 && (this.normalMapType = e.normalMapType), e.normalScale !== void 0) {
      let i = e.normalScale;
      Array.isArray(i) === !1 && (i = [i, i]), this.normalScale = new Fe().fromArray(i);
    }
    return e.displacementMap !== void 0 && (this.displacementMap = t[e.displacementMap] || null), e.displacementScale !== void 0 && (this.displacementScale = e.displacementScale), e.displacementBias !== void 0 && (this.displacementBias = e.displacementBias), e.roughnessMap !== void 0 && (this.roughnessMap = t[e.roughnessMap] || null), e.metalnessMap !== void 0 && (this.metalnessMap = t[e.metalnessMap] || null), e.emissiveMap !== void 0 && (this.emissiveMap = t[e.emissiveMap] || null), e.emissiveIntensity !== void 0 && (this.emissiveIntensity = e.emissiveIntensity), e.specularMap !== void 0 && (this.specularMap = t[e.specularMap] || null), e.specularIntensityMap !== void 0 && (this.specularIntensityMap = t[e.specularIntensityMap] || null), e.specularColorMap !== void 0 && (this.specularColorMap = t[e.specularColorMap] || null), e.envMap !== void 0 && (this.envMap = t[e.envMap] || null), e.envMapRotation !== void 0 && this.envMapRotation.fromArray(e.envMapRotation), e.envMapIntensity !== void 0 && (this.envMapIntensity = e.envMapIntensity), e.reflectivity !== void 0 && (this.reflectivity = e.reflectivity), e.refractionRatio !== void 0 && (this.refractionRatio = e.refractionRatio), e.lightMap !== void 0 && (this.lightMap = t[e.lightMap] || null), e.lightMapIntensity !== void 0 && (this.lightMapIntensity = e.lightMapIntensity), e.aoMap !== void 0 && (this.aoMap = t[e.aoMap] || null), e.aoMapIntensity !== void 0 && (this.aoMapIntensity = e.aoMapIntensity), e.gradientMap !== void 0 && (this.gradientMap = t[e.gradientMap] || null), e.clearcoatMap !== void 0 && (this.clearcoatMap = t[e.clearcoatMap] || null), e.clearcoatRoughnessMap !== void 0 && (this.clearcoatRoughnessMap = t[e.clearcoatRoughnessMap] || null), e.clearcoatNormalMap !== void 0 && (this.clearcoatNormalMap = t[e.clearcoatNormalMap] || null), e.clearcoatNormalScale !== void 0 && (this.clearcoatNormalScale = new Fe().fromArray(e.clearcoatNormalScale)), e.iridescenceMap !== void 0 && (this.iridescenceMap = t[e.iridescenceMap] || null), e.iridescenceThicknessMap !== void 0 && (this.iridescenceThicknessMap = t[e.iridescenceThicknessMap] || null), e.transmissionMap !== void 0 && (this.transmissionMap = t[e.transmissionMap] || null), e.thicknessMap !== void 0 && (this.thicknessMap = t[e.thicknessMap] || null), e.anisotropyMap !== void 0 && (this.anisotropyMap = t[e.anisotropyMap] || null), e.sheenColorMap !== void 0 && (this.sheenColorMap = t[e.sheenColorMap] || null), e.sheenRoughnessMap !== void 0 && (this.sheenRoughnessMap = t[e.sheenRoughnessMap] || null), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
    const t = e.clippingPlanes;
    let i = null;
    if (t !== null) {
      const n = t.length;
      i = new Array(n);
      for (let r = 0; r !== n; ++r) i[r] = t[r].clone();
    }
    return this.clippingPlanes = i, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.allowOverride = e.allowOverride, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
}, vi = /* @__PURE__ */ new U(), Ss = /* @__PURE__ */ new U(), pr = /* @__PURE__ */ new U(), Ri = /* @__PURE__ */ new U(), ys = /* @__PURE__ */ new U(), mr = /* @__PURE__ */ new U(), Es = /* @__PURE__ */ new U(), rr = class {
  constructor(e = new U(), t = new U(0, 0, -1)) {
    this.origin = e, this.direction = t;
  }
  set(e, t) {
    return this.origin.copy(e), this.direction.copy(t), this;
  }
  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }
  at(e, t) {
    return t.copy(this.origin).addScaledVector(this.direction, e);
  }
  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }
  recast(e) {
    return this.origin.copy(this.at(e, vi)), this;
  }
  closestPointToPoint(e, t) {
    t.subVectors(e, this.origin);
    const i = t.dot(this.direction);
    return i < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, i);
  }
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  distanceSqToPoint(e) {
    const t = vi.subVectors(e, this.origin).dot(this.direction);
    return t < 0 ? this.origin.distanceToSquared(e) : (vi.copy(this.origin).addScaledVector(this.direction, t), vi.distanceToSquared(e));
  }
  distanceSqToSegment(e, t, i, n) {
    Ss.copy(e).add(t).multiplyScalar(0.5), pr.copy(t).sub(e).normalize(), Ri.copy(this.origin).sub(Ss);
    const r = e.distanceTo(t) * 0.5, s = -this.direction.dot(pr), a = Ri.dot(this.direction), o = -Ri.dot(pr), c = Ri.lengthSq(), l = Math.abs(1 - s * s);
    let h, u, d, p;
    if (l > 0)
      if (h = s * o - a, u = s * a - o, p = r * l, h >= 0)
        if (u >= -p)
          if (u <= p) {
            const g = 1 / l;
            h *= g, u *= g, d = h * (h + s * u + 2 * a) + u * (s * h + u + 2 * o) + c;
          } else
            u = r, h = Math.max(0, -(s * u + a)), d = -h * h + u * (u + 2 * o) + c;
        else
          u = -r, h = Math.max(0, -(s * u + a)), d = -h * h + u * (u + 2 * o) + c;
      else u <= -p ? (h = Math.max(0, -(-s * r + a)), u = h > 0 ? -r : Math.min(Math.max(-r, -o), r), d = -h * h + u * (u + 2 * o) + c) : u <= p ? (h = 0, u = Math.min(Math.max(-r, -o), r), d = u * (u + 2 * o) + c) : (h = Math.max(0, -(s * r + a)), u = h > 0 ? r : Math.min(Math.max(-r, -o), r), d = -h * h + u * (u + 2 * o) + c);
    else
      u = s > 0 ? -r : r, h = Math.max(0, -(s * u + a)), d = -h * h + u * (u + 2 * o) + c;
    return i && i.copy(this.origin).addScaledVector(this.direction, h), n && n.copy(Ss).addScaledVector(pr, u), d;
  }
  intersectSphere(e, t) {
    vi.subVectors(e.center, this.origin);
    const i = vi.dot(this.direction), n = vi.dot(vi) - i * i, r = e.radius * e.radius;
    if (n > r) return null;
    const s = Math.sqrt(r - n), a = i - s, o = i + s;
    return o < 0 ? null : a < 0 ? this.at(o, t) : this.at(a, t);
  }
  intersectsSphere(e) {
    return e.radius < 0 ? !1 : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (t === 0)
      return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const i = -(this.origin.dot(e.normal) + e.constant) / t;
    return i >= 0 ? i : null;
  }
  intersectPlane(e, t) {
    const i = this.distanceToPlane(e);
    return i === null ? null : this.at(i, t);
  }
  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return t === 0 || e.normal.dot(this.direction) * t < 0;
  }
  intersectBox(e, t) {
    let i, n, r, s, a, o;
    const c = 1 / this.direction.x, l = 1 / this.direction.y, h = 1 / this.direction.z, u = this.origin;
    return c >= 0 ? (i = (e.min.x - u.x) * c, n = (e.max.x - u.x) * c) : (i = (e.max.x - u.x) * c, n = (e.min.x - u.x) * c), l >= 0 ? (r = (e.min.y - u.y) * l, s = (e.max.y - u.y) * l) : (r = (e.max.y - u.y) * l, s = (e.min.y - u.y) * l), i > s || r > n || ((r > i || isNaN(i)) && (i = r), (s < n || isNaN(n)) && (n = s), h >= 0 ? (a = (e.min.z - u.z) * h, o = (e.max.z - u.z) * h) : (a = (e.max.z - u.z) * h, o = (e.min.z - u.z) * h), i > o || a > n) || ((a > i || i !== i) && (i = a), (o < n || n !== n) && (n = o), n < 0) ? null : this.at(i >= 0 ? i : n, t);
  }
  intersectsBox(e) {
    return this.intersectBox(e, vi) !== null;
  }
  intersectTriangle(e, t, i, n, r) {
    ys.subVectors(t, e), mr.subVectors(i, e), Es.crossVectors(ys, mr);
    let s = this.direction.dot(Es), a;
    if (s > 0) {
      if (n) return null;
      a = 1;
    } else if (s < 0)
      a = -1, s = -s;
    else return null;
    Ri.subVectors(this.origin, e);
    const o = a * this.direction.dot(mr.crossVectors(Ri, mr));
    if (o < 0) return null;
    const c = a * this.direction.dot(ys.cross(Ri));
    if (c < 0 || o + c > s) return null;
    const l = -a * Ri.dot(Es);
    return l < 0 ? null : this.at(l / s, r);
  }
  applyMatrix4(e) {
    return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
  }
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}, Jt = class extends ci {
  constructor(e) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Te(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Fi(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
  }
}, Ua = /* @__PURE__ */ new Ne(), Gi = /* @__PURE__ */ new rr(), gr = /* @__PURE__ */ new hi(), Fa = /* @__PURE__ */ new U(), vr = /* @__PURE__ */ new U(), br = /* @__PURE__ */ new U(), _r = /* @__PURE__ */ new U(), Ts = /* @__PURE__ */ new U(), Mr = /* @__PURE__ */ new U(), Oa = /* @__PURE__ */ new U(), xr = /* @__PURE__ */ new U(), At = class extends dt {
  constructor(e = new Wt(), t = new Jt()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, t = Object.keys(e);
    if (t.length > 0) {
      const i = e[t[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let n = 0, r = i.length; n < r; n++) {
          const s = i[n].name || String(n);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[s] = n;
        }
      }
    }
  }
  getVertexPosition(e, t) {
    const i = this.geometry, n = i.attributes.position, r = i.morphAttributes.position, s = i.morphTargetsRelative;
    t.fromBufferAttribute(n, e);
    const a = this.morphTargetInfluences;
    if (r && a) {
      Mr.set(0, 0, 0);
      for (let o = 0, c = r.length; o < c; o++) {
        const l = a[o], h = r[o];
        l !== 0 && (Ts.fromBufferAttribute(h, e), s ? Mr.addScaledVector(Ts, l) : Mr.addScaledVector(Ts.sub(t), l));
      }
      t.add(Mr);
    }
    return t;
  }
  raycast(e, t) {
    const i = this.geometry, n = this.material, r = this.matrixWorld;
    n !== void 0 && (i.boundingSphere === null && i.computeBoundingSphere(), gr.copy(i.boundingSphere), gr.applyMatrix4(r), Gi.copy(e.ray).recast(e.near), !(gr.containsPoint(Gi.origin) === !1 && (Gi.intersectSphere(gr, Fa) === null || Gi.origin.distanceToSquared(Fa) > (e.far - e.near) ** 2)) && (Ua.copy(r).invert(), Gi.copy(e.ray).applyMatrix4(Ua), !(i.boundingBox !== null && Gi.intersectsBox(i.boundingBox) === !1) && this._computeIntersections(e, t, Gi)));
  }
  _computeIntersections(e, t, i) {
    let n;
    const r = this.geometry, s = this.material, a = r.index, o = r.attributes.position, c = r.attributes.uv, l = r.attributes.uv1, h = r.attributes.normal, u = r.groups, d = r.drawRange;
    if (a !== null)
      if (Array.isArray(s)) for (let p = 0, g = u.length; p < g; p++) {
        const _ = u[p], m = s[_.materialIndex], f = Math.max(_.start, d.start), T = Math.min(a.count, Math.min(_.start + _.count, d.start + d.count));
        for (let A = f, M = T; A < M; A += 3) {
          const E = a.getX(A), w = a.getX(A + 1), C = a.getX(A + 2);
          n = Sr(this, m, e, i, c, l, h, E, w, C), n && (n.faceIndex = Math.floor(A / 3), n.face.materialIndex = _.materialIndex, t.push(n));
        }
      }
      else {
        const p = Math.max(0, d.start), g = Math.min(a.count, d.start + d.count);
        for (let _ = p, m = g; _ < m; _ += 3) {
          const f = a.getX(_), T = a.getX(_ + 1), A = a.getX(_ + 2);
          n = Sr(this, s, e, i, c, l, h, f, T, A), n && (n.faceIndex = Math.floor(_ / 3), t.push(n));
        }
      }
    else if (o !== void 0)
      if (Array.isArray(s)) for (let p = 0, g = u.length; p < g; p++) {
        const _ = u[p], m = s[_.materialIndex], f = Math.max(_.start, d.start), T = Math.min(o.count, Math.min(_.start + _.count, d.start + d.count));
        for (let A = f, M = T; A < M; A += 3) {
          const E = A, w = A + 1, C = A + 2;
          n = Sr(this, m, e, i, c, l, h, E, w, C), n && (n.faceIndex = Math.floor(A / 3), n.face.materialIndex = _.materialIndex, t.push(n));
        }
      }
      else {
        const p = Math.max(0, d.start), g = Math.min(o.count, d.start + d.count);
        for (let _ = p, m = g; _ < m; _ += 3) {
          const f = _, T = _ + 1, A = _ + 2;
          n = Sr(this, s, e, i, c, l, h, f, T, A), n && (n.faceIndex = Math.floor(_ / 3), t.push(n));
        }
      }
  }
};
function Uh(e, t, i, n, r, s, a, o) {
  let c;
  if (t.side === 1 ? c = n.intersectTriangle(a, s, r, !0, o) : c = n.intersectTriangle(r, s, a, t.side === 0, o), c === null) return null;
  xr.copy(o), xr.applyMatrix4(e.matrixWorld);
  const l = i.ray.origin.distanceTo(xr);
  return l < i.near || l > i.far ? null : {
    distance: l,
    point: xr.clone(),
    object: e
  };
}
function Sr(e, t, i, n, r, s, a, o, c, l) {
  e.getVertexPosition(o, vr), e.getVertexPosition(c, br), e.getVertexPosition(l, _r);
  const h = Uh(e, t, i, n, vr, br, _r, Oa);
  if (h) {
    const u = new U();
    Un.getBarycoord(Oa, vr, br, _r, u), r && (h.uv = Un.getInterpolatedAttribute(r, o, c, l, u, new Fe())), s && (h.uv1 = Un.getInterpolatedAttribute(s, o, c, l, u, new Fe())), a && (h.normal = Un.getInterpolatedAttribute(a, o, c, l, u, new U()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const d = {
      a: o,
      b: c,
      c: l,
      normal: new U(),
      materialIndex: 0
    };
    Un.getNormal(vr, br, _r, d.normal), h.face = d, h.barycoord = u;
  }
  return h;
}
var Bn = /* @__PURE__ */ new Ze(), ka = /* @__PURE__ */ new Ze(), Ba = /* @__PURE__ */ new Ze(), Fh = /* @__PURE__ */ new Ze(), Ga = /* @__PURE__ */ new Ne(), yr = /* @__PURE__ */ new U(), As = /* @__PURE__ */ new hi(), za = /* @__PURE__ */ new Ne(), ws = /* @__PURE__ */ new rr(), Oh = class extends At {
  constructor(e, t) {
    super(e, t), this.isSkinnedMesh = !0, this.type = "SkinnedMesh", this.bindMode = il, this.bindMatrix = new Ne(), this.bindMatrixInverse = new Ne(), this.boundingBox = null, this.boundingSphere = null;
  }
  computeBoundingBox() {
    const e = this.geometry;
    this.boundingBox === null && (this.boundingBox = new xi()), this.boundingBox.makeEmpty();
    const t = e.getAttribute("position");
    for (let i = 0; i < t.count; i++)
      this.getVertexPosition(i, yr), this.boundingBox.expandByPoint(yr);
  }
  computeBoundingSphere() {
    const e = this.geometry;
    this.boundingSphere === null && (this.boundingSphere = new hi()), this.boundingSphere.makeEmpty();
    const t = e.getAttribute("position");
    for (let i = 0; i < t.count; i++)
      this.getVertexPosition(i, yr), this.boundingSphere.expandByPoint(yr);
  }
  copy(e, t) {
    return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  raycast(e, t) {
    const i = this.material, n = this.matrixWorld;
    i !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), As.copy(this.boundingSphere), As.applyMatrix4(n), e.ray.intersectsSphere(As) !== !1 && (za.copy(n).invert(), ws.copy(e.ray).applyMatrix4(za), !(this.boundingBox !== null && ws.intersectsBox(this.boundingBox) === !1) && this._computeIntersections(e, t, ws)));
  }
  getVertexPosition(e, t) {
    return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
  }
  bind(e, t) {
    this.skeleton = e, t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
  }
  pose() {
    this.skeleton.pose();
  }
  normalizeSkinWeights() {
    const e = new Ze(), t = this.geometry.attributes.skinWeight;
    for (let i = 0, n = t.count; i < n; i++) {
      e.fromBufferAttribute(t, i);
      const r = 1 / e.manhattanLength();
      r !== 1 / 0 ? e.multiplyScalar(r) : e.set(1, 0, 0, 0), t.setXYZW(i, e.x, e.y, e.z, e.w);
    }
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.bindMode === "attached" ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === "detached" ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : xe("SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
  }
  applyBoneTransform(e, t) {
    const i = this.skeleton, n = this.geometry;
    ka.fromBufferAttribute(n.attributes.skinIndex, e), Ba.fromBufferAttribute(n.attributes.skinWeight, e), t.isVector4 ? (Bn.copy(t), t.set(0, 0, 0, 0)) : (Bn.set(...t, 1), t.set(0, 0, 0)), Bn.applyMatrix4(this.bindMatrix);
    for (let r = 0; r < 4; r++) {
      const s = Ba.getComponent(r);
      if (s !== 0) {
        const a = ka.getComponent(r);
        Ga.multiplyMatrices(i.bones[a].matrixWorld, i.boneInverses[a]), t.addScaledVector(Fh.copy(Bn).applyMatrix4(Ga), s);
      }
    }
    return t.isVector4 && (t.w = Bn.w), t.applyMatrix4(this.bindMatrixInverse);
  }
}, _c = class extends dt {
  constructor() {
    super(), this.isBone = !0, this.type = "Bone";
  }
}, ia = class extends Dt {
  constructor(e = null, t = 1, i = 1, n, r, s, a, o, c = Et, l = Et, h, u) {
    super(null, s, a, o, c, l, n, r, h, u), this.isDataTexture = !0, this.image = {
      data: e,
      width: t,
      height: i
    }, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}, Va = /* @__PURE__ */ new Ne(), kh = /* @__PURE__ */ new Ne(), Bh = class Mc {
  constructor(t = [], i = []) {
    this.uuid = $t(), this.bones = t.slice(0), this.boneInverses = i, this.boneMatrices = null, this.boneTexture = null, this.init();
  }
  init() {
    const t = this.bones, i = this.boneInverses;
    if (this.boneMatrices = new Float32Array(t.length * 16), i.length === 0) this.calculateInverses();
    else if (t.length !== i.length) {
      xe("Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
      for (let n = 0, r = this.bones.length; n < r; n++) this.boneInverses.push(new Ne());
    }
  }
  calculateInverses() {
    this.boneInverses.length = 0;
    for (let t = 0, i = this.bones.length; t < i; t++) {
      const n = new Ne();
      this.bones[t] && n.copy(this.bones[t].matrixWorld).invert(), this.boneInverses.push(n);
    }
  }
  pose() {
    for (let t = 0, i = this.bones.length; t < i; t++) {
      const n = this.bones[t];
      n && n.matrixWorld.copy(this.boneInverses[t]).invert();
    }
    for (let t = 0, i = this.bones.length; t < i; t++) {
      const n = this.bones[t];
      n && (n.parent && n.parent.isBone ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld)) : n.matrix.copy(n.matrixWorld), n.matrix.decompose(n.position, n.quaternion, n.scale));
    }
  }
  update() {
    const t = this.bones, i = this.boneInverses, n = this.boneMatrices, r = this.boneTexture;
    for (let s = 0, a = t.length; s < a; s++) {
      const o = t[s] ? t[s].matrixWorld : kh;
      Va.multiplyMatrices(o, i[s]), Va.toArray(n, s * 16);
    }
    r !== null && (r.needsUpdate = !0);
  }
  clone() {
    return new Mc(this.bones, this.boneInverses);
  }
  computeBoneTexture() {
    let t = Math.sqrt(this.bones.length * 4);
    t = Math.ceil(t / 4) * 4, t = Math.max(t, 4);
    const i = new Float32Array(t * t * 4);
    i.set(this.boneMatrices);
    const n = new ia(i, t, t, xn, wn);
    return n.needsUpdate = !0, this.boneMatrices = i, this.boneTexture = n, this;
  }
  getBoneByName(t) {
    for (let i = 0, n = this.bones.length; i < n; i++) {
      const r = this.bones[i];
      if (r.name === t) return r;
    }
  }
  dispose() {
    this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
  }
  fromJSON(t, i) {
    this.uuid = t.uuid;
    for (let n = 0, r = t.bones.length; n < r; n++) {
      const s = t.bones[n];
      let a = i[s];
      a === void 0 && (xe("Skeleton: No bone found with UUID:", s), a = new _c()), this.bones.push(a), this.boneInverses.push(new Ne().fromArray(t.boneInverses[n]));
    }
    return this.init(), this;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.7,
        type: "Skeleton",
        generator: "Skeleton.toJSON"
      },
      bones: [],
      boneInverses: []
    };
    t.uuid = this.uuid;
    const i = this.bones, n = this.boneInverses;
    for (let r = 0, s = i.length; r < s; r++) {
      const a = i[r];
      t.bones.push(a.uuid);
      const o = n[r];
      t.boneInverses.push(o.toArray());
    }
    return t;
  }
}, qr = class extends Tt {
  constructor(e, t, i, n = 1) {
    super(e, t, i), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = n;
  }
  copy(e) {
    return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
  }
  toJSON() {
    const e = super.toJSON();
    return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
  }
}, ln = /* @__PURE__ */ new Ne(), Ha = /* @__PURE__ */ new Ne(), Er = [], Wa = /* @__PURE__ */ new xi(), Gh = /* @__PURE__ */ new Ne(), Gn = /* @__PURE__ */ new At(), zn = /* @__PURE__ */ new hi(), zh = class extends At {
  constructor(e, t, i) {
    super(e, t), this.isInstancedMesh = !0, this.instanceMatrix = new qr(new Float32Array(i * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = i, this.boundingBox = null, this.boundingSphere = null;
    for (let n = 0; n < i; n++) this.setMatrixAt(n, Gh);
  }
  computeBoundingBox() {
    const e = this.geometry, t = this.count;
    this.boundingBox === null && (this.boundingBox = new xi()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let i = 0; i < t; i++)
      this.getMatrixAt(i, ln), Wa.copy(e.boundingBox).applyMatrix4(ln), this.boundingBox.union(Wa);
  }
  computeBoundingSphere() {
    const e = this.geometry, t = this.count;
    this.boundingSphere === null && (this.boundingSphere = new hi()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let i = 0; i < t; i++)
      this.getMatrixAt(i, ln), zn.copy(e.boundingSphere).applyMatrix4(ln), this.boundingSphere.union(zn);
  }
  copy(e, t) {
    return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  getColorAt(e, t) {
    return this.instanceColor === null ? t.setRGB(1, 1, 1) : t.fromArray(this.instanceColor.array, e * 3);
  }
  getMatrixAt(e, t) {
    return t.fromArray(this.instanceMatrix.array, e * 16);
  }
  getMorphAt(e, t) {
    const i = t.morphTargetInfluences, n = this.morphTexture.source.data.data, r = e * (i.length + 1) + 1;
    for (let s = 0; s < i.length; s++) i[s] = n[r + s];
  }
  raycast(e, t) {
    const i = this.matrixWorld, n = this.count;
    if (Gn.geometry = this.geometry, Gn.material = this.material, Gn.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), zn.copy(this.boundingSphere), zn.applyMatrix4(i), e.ray.intersectsSphere(zn) !== !1))
      for (let r = 0; r < n; r++) {
        this.getMatrixAt(r, ln), Ha.multiplyMatrices(i, ln), Gn.matrixWorld = Ha, Gn.raycast(e, Er);
        for (let s = 0, a = Er.length; s < a; s++) {
          const o = Er[s];
          o.instanceId = r, o.object = this, t.push(o);
        }
        Er.length = 0;
      }
  }
  setColorAt(e, t) {
    return this.instanceColor === null && (this.instanceColor = new qr(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3), this;
  }
  setMatrixAt(e, t) {
    return t.toArray(this.instanceMatrix.array, e * 16), this;
  }
  setMorphAt(e, t) {
    const i = t.morphTargetInfluences, n = i.length + 1;
    this.morphTexture === null && (this.morphTexture = new ia(new Float32Array(n * this.count), n, this.count, nc, wn));
    const r = this.morphTexture.source.data.data;
    let s = 0;
    for (let c = 0; c < i.length; c++) s += i[c];
    const a = this.geometry.morphTargetsRelative ? 1 : 1 - s, o = n * e;
    return r[o] = a, r.set(i, o + 1), this;
  }
  updateMorphTargets() {
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null);
  }
}, Rs = /* @__PURE__ */ new U(), Vh = /* @__PURE__ */ new U(), Hh = /* @__PURE__ */ new Ie(), Wi = class {
  constructor(e = new U(1, 0, 0), t = 0) {
    this.isPlane = !0, this.normal = e, this.constant = t;
  }
  set(e, t) {
    return this.normal.copy(e), this.constant = t, this;
  }
  setComponents(e, t, i, n) {
    return this.normal.set(e, t, i), this.constant = n, this;
  }
  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
  }
  setFromCoplanarPoints(e, t, i) {
    const n = Rs.subVectors(i, t).cross(Vh.subVectors(e, t)).normalize();
    return this.setFromNormalAndCoplanarPoint(n, e), this;
  }
  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  intersectLine(e, t, i = !0) {
    const n = e.delta(Rs), r = this.normal.dot(n);
    if (r === 0)
      return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const s = -(e.start.dot(this.normal) + this.constant) / r;
    return i === !0 && (s < 0 || s > 1) ? null : t.copy(e.start).addScaledVector(n, s);
  }
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start), i = this.distanceToPoint(e.end);
    return t < 0 && i > 0 || i < 0 && t > 0;
  }
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(e, t) {
    const i = t || Hh.getNormalMatrix(e), n = this.coplanarPoint(Rs).applyMatrix4(e), r = this.normal.applyMatrix3(i).normalize();
    return this.constant = -n.dot(r), this;
  }
  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}, zi = /* @__PURE__ */ new hi(), Wh = /* @__PURE__ */ new Fe(0.5, 0.5), Tr = /* @__PURE__ */ new U(), na = class {
  constructor(e = new Wi(), t = new Wi(), i = new Wi(), n = new Wi(), r = new Wi(), s = new Wi()) {
    this.planes = [
      e,
      t,
      i,
      n,
      r,
      s
    ];
  }
  set(e, t, i, n, r, s) {
    const a = this.planes;
    return a[0].copy(e), a[1].copy(t), a[2].copy(i), a[3].copy(n), a[4].copy(r), a[5].copy(s), this;
  }
  copy(e) {
    const t = this.planes;
    for (let i = 0; i < 6; i++) t[i].copy(e.planes[i]);
    return this;
  }
  setFromProjectionMatrix(e, t = Sn, i = !1) {
    const n = this.planes, r = e.elements, s = r[0], a = r[1], o = r[2], c = r[3], l = r[4], h = r[5], u = r[6], d = r[7], p = r[8], g = r[9], _ = r[10], m = r[11], f = r[12], T = r[13], A = r[14], M = r[15];
    if (n[0].setComponents(c - s, d - l, m - p, M - f).normalize(), n[1].setComponents(c + s, d + l, m + p, M + f).normalize(), n[2].setComponents(c + a, d + h, m + g, M + T).normalize(), n[3].setComponents(c - a, d - h, m - g, M - T).normalize(), i)
      n[4].setComponents(o, u, _, A).normalize(), n[5].setComponents(c - o, d - u, m - _, M - A).normalize();
    else if (n[4].setComponents(c - o, d - u, m - _, M - A).normalize(), t === 2e3) n[5].setComponents(c + o, d + u, m + _, M + A).normalize();
    else if (t === 2001) n[5].setComponents(o, u, _, A).normalize();
    else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
    return this;
  }
  intersectsObject(e) {
    if (e.boundingSphere !== void 0)
      e.boundingSphere === null && e.computeBoundingSphere(), zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
    else {
      const t = e.geometry;
      t.boundingSphere === null && t.computeBoundingSphere(), zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
    }
    return this.intersectsSphere(zi);
  }
  intersectsSprite(e) {
    zi.center.set(0, 0, 0);
    const t = Wh.distanceTo(e.center);
    return zi.radius = 0.7071067811865476 + t, zi.applyMatrix4(e.matrixWorld), this.intersectsSphere(zi);
  }
  intersectsSphere(e) {
    const t = this.planes, i = e.center, n = -e.radius;
    for (let r = 0; r < 6; r++) if (t[r].distanceToPoint(i) < n) return !1;
    return !0;
  }
  intersectsBox(e) {
    const t = this.planes;
    for (let i = 0; i < 6; i++) {
      const n = t[i];
      if (Tr.x = n.normal.x > 0 ? e.max.x : e.min.x, Tr.y = n.normal.y > 0 ? e.max.y : e.min.y, Tr.z = n.normal.z > 0 ? e.max.z : e.min.z, n.distanceToPoint(Tr) < 0) return !1;
    }
    return !0;
  }
  containsPoint(e) {
    const t = this.planes;
    for (let i = 0; i < 6; i++) if (t[i].distanceToPoint(e) < 0) return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}, xc = class extends ci {
  constructor(e) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new Te(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
  }
}, Xr = /* @__PURE__ */ new U(), Kr = /* @__PURE__ */ new U(), qa = /* @__PURE__ */ new Ne(), Vn = /* @__PURE__ */ new rr(), Ar = /* @__PURE__ */ new hi(), Cs = /* @__PURE__ */ new U(), Xa = /* @__PURE__ */ new U(), ra = class extends dt {
  constructor(e = new Wt(), t = new xc()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, i = [0];
      for (let n = 1, r = t.count; n < r; n++)
        Xr.fromBufferAttribute(t, n - 1), Kr.fromBufferAttribute(t, n), i[n] = i[n - 1], i[n] += Xr.distanceTo(Kr);
      e.setAttribute("lineDistance", new Ut(i, 1));
    } else xe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(e, t) {
    const i = this.geometry, n = this.matrixWorld, r = e.params.Line.threshold, s = i.drawRange;
    if (i.boundingSphere === null && i.computeBoundingSphere(), Ar.copy(i.boundingSphere), Ar.applyMatrix4(n), Ar.radius += r, e.ray.intersectsSphere(Ar) === !1) return;
    qa.copy(n).invert(), Vn.copy(e.ray).applyMatrix4(qa);
    const a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), o = a * a, c = this.isLineSegments ? 2 : 1, l = i.index, h = i.attributes.position;
    if (l !== null) {
      const u = Math.max(0, s.start), d = Math.min(l.count, s.start + s.count);
      for (let p = u, g = d - 1; p < g; p += c) {
        const _ = l.getX(p), m = l.getX(p + 1), f = wr(this, e, Vn, o, _, m, p);
        f && t.push(f);
      }
      if (this.isLineLoop) {
        const p = l.getX(d - 1), g = l.getX(u), _ = wr(this, e, Vn, o, p, g, d - 1);
        _ && t.push(_);
      }
    } else {
      const u = Math.max(0, s.start), d = Math.min(h.count, s.start + s.count);
      for (let p = u, g = d - 1; p < g; p += c) {
        const _ = wr(this, e, Vn, o, p, p + 1, p);
        _ && t.push(_);
      }
      if (this.isLineLoop) {
        const p = wr(this, e, Vn, o, d - 1, u, d - 1);
        p && t.push(p);
      }
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, t = Object.keys(e);
    if (t.length > 0) {
      const i = e[t[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let n = 0, r = i.length; n < r; n++) {
          const s = i[n].name || String(n);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[s] = n;
        }
      }
    }
  }
};
function wr(e, t, i, n, r, s, a) {
  const o = e.geometry.attributes.position;
  if (Xr.fromBufferAttribute(o, r), Kr.fromBufferAttribute(o, s), i.distanceSqToSegment(Xr, Kr, Cs, Xa) > n) return;
  Cs.applyMatrix4(e.matrixWorld);
  const c = t.ray.origin.distanceTo(Cs);
  if (!(c < t.near || c > t.far))
    return {
      distance: c,
      point: Xa.clone().applyMatrix4(e.matrixWorld),
      index: a,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: e
    };
}
var Ka = /* @__PURE__ */ new U(), ja = /* @__PURE__ */ new U(), qh = class extends ra {
  constructor(e, t) {
    super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, i = [];
      for (let n = 0, r = t.count; n < r; n += 2)
        Ka.fromBufferAttribute(t, n), ja.fromBufferAttribute(t, n + 1), i[n] = n === 0 ? 0 : i[n - 1], i[n + 1] = i[n] + Ka.distanceTo(ja);
      e.setAttribute("lineDistance", new Ut(i, 1));
    } else xe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}, Xh = class extends ra {
  constructor(e, t) {
    super(e, t), this.isLineLoop = !0, this.type = "LineLoop";
  }
}, sa = class extends ci {
  constructor(e) {
    super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new Te(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}, Ya = /* @__PURE__ */ new Ne(), Ws = /* @__PURE__ */ new rr(), Rr = /* @__PURE__ */ new hi(), Cr = /* @__PURE__ */ new U(), Sc = class extends dt {
  constructor(e = new Wt(), t = new sa()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  raycast(e, t) {
    const i = this.geometry, n = this.matrixWorld, r = e.params.Points.threshold, s = i.drawRange;
    if (i.boundingSphere === null && i.computeBoundingSphere(), Rr.copy(i.boundingSphere), Rr.applyMatrix4(n), Rr.radius += r, e.ray.intersectsSphere(Rr) === !1) return;
    Ya.copy(n).invert(), Ws.copy(e.ray).applyMatrix4(Ya);
    const a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), o = a * a, c = i.index, l = i.attributes.position;
    if (c !== null) {
      const h = Math.max(0, s.start), u = Math.min(c.count, s.start + s.count);
      for (let d = h, p = u; d < p; d++) {
        const g = c.getX(d);
        Cr.fromBufferAttribute(l, g), Ja(Cr, g, o, n, e, t, this);
      }
    } else {
      const h = Math.max(0, s.start), u = Math.min(l.count, s.start + s.count);
      for (let d = h, p = u; d < p; d++)
        Cr.fromBufferAttribute(l, d), Ja(Cr, d, o, n, e, t, this);
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, t = Object.keys(e);
    if (t.length > 0) {
      const i = e[t[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let n = 0, r = i.length; n < r; n++) {
          const s = i[n].name || String(n);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[s] = n;
        }
      }
    }
  }
};
function Ja(e, t, i, n, r, s, a) {
  const o = Ws.distanceSqToPoint(e);
  if (o < i) {
    const c = new U();
    Ws.closestPointToPoint(e, c), c.applyMatrix4(n);
    const l = r.ray.origin.distanceTo(c);
    if (l < r.near || l > r.far) return;
    s.push({
      distance: l,
      distanceToRay: Math.sqrt(o),
      point: c,
      index: t,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: a
    });
  }
}
var yc = class extends Dt {
  constructor(e = [], t = 301, i, n, r, s, a, o, c, l) {
    super(e, t, i, n, r, s, a, o, c, l), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}, Tn = class extends Dt {
  constructor(e, t, i = Ki, n, r, s, a = Et, o = Et, c, l = Jn, h = 1) {
    if (l !== 1026 && l !== 1027) throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    super({
      width: e,
      height: t,
      depth: h
    }, n, r, s, a, o, l, i, c), this.isDepthTexture = !0, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.source = new ea(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
  }
}, Kh = class extends Tn {
  constructor(e, t = Ki, i = 301, n, r, s = Et, a = Et, o, c = Jn) {
    const l = {
      width: e,
      height: e,
      depth: 1
    }, h = [
      l,
      l,
      l,
      l,
      l,
      l
    ];
    super(e, e, t, i, n, r, s, a, o, c), this.image = h, this.isCubeDepthTexture = !0, this.isCubeTexture = !0;
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}, Ec = class extends Dt {
  constructor(e = null) {
    super(), this.sourceTexture = e, this.isExternalTexture = !0;
  }
  copy(e) {
    return super.copy(e), this.sourceTexture = e.sourceTexture, this;
  }
}, Yr = class Tc extends Wt {
  constructor(t = 1, i = 1, n = 1, r = 1, s = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: t,
      height: i,
      depth: n,
      widthSegments: r,
      heightSegments: s,
      depthSegments: a
    };
    const o = this;
    r = Math.floor(r), s = Math.floor(s), a = Math.floor(a);
    const c = [], l = [], h = [], u = [];
    let d = 0, p = 0;
    g("z", "y", "x", -1, -1, n, i, t, a, s, 0), g("z", "y", "x", 1, -1, n, i, -t, a, s, 1), g("x", "z", "y", 1, 1, t, n, i, r, a, 2), g("x", "z", "y", 1, -1, t, n, -i, r, a, 3), g("x", "y", "z", 1, -1, t, i, n, r, s, 4), g("x", "y", "z", -1, -1, t, i, -n, r, s, 5), this.setIndex(c), this.setAttribute("position", new Ut(l, 3)), this.setAttribute("normal", new Ut(h, 3)), this.setAttribute("uv", new Ut(u, 2));
    function g(_, m, f, T, A, M, E, w, C, v, y) {
      const V = M / C, R = E / v, k = M / 2, q = E / 2, X = w / 2, z = C + 1, j = v + 1;
      let O = 0, ee = 0;
      const te = new U();
      for (let ie = 0; ie < j; ie++) {
        const de = ie * R - q;
        for (let Se = 0; Se < z; Se++)
          te[_] = (Se * V - k) * T, te[m] = de * A, te[f] = X, l.push(te.x, te.y, te.z), te[_] = 0, te[m] = 0, te[f] = w > 0 ? 1 : -1, h.push(te.x, te.y, te.z), u.push(Se / C), u.push(1 - ie / v), O += 1;
      }
      for (let ie = 0; ie < v; ie++) for (let de = 0; de < C; de++) {
        const Se = d + de + z * ie, Qe = d + de + z * (ie + 1), je = d + (de + 1) + z * (ie + 1), P = d + (de + 1) + z * ie;
        c.push(Se, Qe, P), c.push(Qe, je, P), ee += 6;
      }
      o.addGroup(p, ee, y), p += ee, d += O;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Tc(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
  }
}, jh = class Ac extends Wt {
  constructor(t = 1, i = 1, n = 1, r = 32, s = 1, a = !1, o = 0, c = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: t,
      radiusBottom: i,
      height: n,
      radialSegments: r,
      heightSegments: s,
      openEnded: a,
      thetaStart: o,
      thetaLength: c
    };
    const l = this;
    r = Math.floor(r), s = Math.floor(s);
    const h = [], u = [], d = [], p = [];
    let g = 0;
    const _ = [], m = n / 2;
    let f = 0;
    T(), a === !1 && (t > 0 && A(!0), i > 0 && A(!1)), this.setIndex(h), this.setAttribute("position", new Ut(u, 3)), this.setAttribute("normal", new Ut(d, 3)), this.setAttribute("uv", new Ut(p, 2));
    function T() {
      const M = new U(), E = new U();
      let w = 0;
      const C = (i - t) / n;
      for (let v = 0; v <= s; v++) {
        const y = [], V = v / s, R = V * (i - t) + t;
        for (let k = 0; k <= r; k++) {
          const q = k / r, X = q * c + o, z = Math.sin(X), j = Math.cos(X);
          E.x = R * z, E.y = -V * n + m, E.z = R * j, u.push(E.x, E.y, E.z), M.set(z, C, j).normalize(), d.push(M.x, M.y, M.z), p.push(q, 1 - V), y.push(g++);
        }
        _.push(y);
      }
      for (let v = 0; v < r; v++) for (let y = 0; y < s; y++) {
        const V = _[y][v], R = _[y + 1][v], k = _[y + 1][v + 1], q = _[y][v + 1];
        (t > 0 || y !== 0) && (h.push(V, R, q), w += 3), (i > 0 || y !== s - 1) && (h.push(R, k, q), w += 3);
      }
      l.addGroup(f, w, 0), f += w;
    }
    function A(M) {
      const E = g, w = new Fe(), C = new U();
      let v = 0;
      const y = M === !0 ? t : i, V = M === !0 ? 1 : -1;
      for (let k = 1; k <= r; k++)
        u.push(0, m * V, 0), d.push(0, V, 0), p.push(0.5, 0.5), g++;
      const R = g;
      for (let k = 0; k <= r; k++) {
        const q = k / r * c + o, X = Math.cos(q), z = Math.sin(q);
        C.x = y * z, C.y = m * V, C.z = y * X, u.push(C.x, C.y, C.z), d.push(0, V, 0), w.x = X * 0.5 + 0.5, w.y = z * 0.5 * V + 0.5, p.push(w.x, w.y), g++;
      }
      for (let k = 0; k < r; k++) {
        const q = E + k, X = R + k;
        M === !0 ? h.push(X, X + 1, q) : h.push(X + 1, X, q), v += 3;
      }
      l.addGroup(f, v, M === !0 ? 1 : 2), f += v;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Ac(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}, aa = class wc extends Wt {
  constructor(t = 1, i = 1, n = 1, r = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: t,
      height: i,
      widthSegments: n,
      heightSegments: r
    };
    const s = t / 2, a = i / 2, o = Math.floor(n), c = Math.floor(r), l = o + 1, h = c + 1, u = t / o, d = i / c, p = [], g = [], _ = [], m = [];
    for (let f = 0; f < h; f++) {
      const T = f * d - a;
      for (let A = 0; A < l; A++) {
        const M = A * u - s;
        g.push(M, -T, 0), _.push(0, 0, 1), m.push(A / o), m.push(1 - f / c);
      }
    }
    for (let f = 0; f < c; f++) for (let T = 0; T < o; T++) {
      const A = T + l * f, M = T + l * (f + 1), E = T + 1 + l * (f + 1), w = T + 1 + l * f;
      p.push(A, M, w), p.push(M, E, w);
    }
    this.setIndex(p), this.setAttribute("position", new Ut(g, 3)), this.setAttribute("normal", new Ut(_, 3)), this.setAttribute("uv", new Ut(m, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new wc(t.width, t.height, t.widthSegments, t.heightSegments);
  }
};
function An(e) {
  const t = {};
  for (const i in e) {
    t[i] = {};
    for (const n in e[i]) {
      const r = e[i][n];
      if ($a(r))
        r.isRenderTargetTexture ? (xe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[i][n] = null) : t[i][n] = r.clone();
      else if (Array.isArray(r))
        if ($a(r[0])) {
          const s = [];
          for (let a = 0, o = r.length; a < o; a++) s[a] = r[a].clone();
          t[i][n] = s;
        } else t[i][n] = r.slice();
      else t[i][n] = r;
    }
  }
  return t;
}
function Ct(e) {
  const t = {};
  for (let i = 0; i < e.length; i++) {
    const n = An(e[i]);
    for (const r in n) t[r] = n[r];
  }
  return t;
}
function $a(e) {
  return e && (e.isColor || e.isMatrix3 || e.isMatrix4 || e.isVector2 || e.isVector3 || e.isVector4 || e.isTexture || e.isQuaternion);
}
function Yh(e) {
  const t = [];
  for (let i = 0; i < e.length; i++) t.push(e[i].clone());
  return t;
}
function Rc(e) {
  const t = e.getRenderTarget();
  return t === null ? e.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : Ge.workingColorSpace;
}
var Jh = {
  clone: An,
  merge: Ct
}, $h = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Zh = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`, li = class extends ci {
  constructor(e) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = $h, this.fragmentShader = Zh, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      multiDraw: !1
    }, this.defaultAttributeValues = {
      color: [
        1,
        1,
        1
      ],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = An(e.uniforms), this.uniformsGroups = Yh(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this.defaultAttributeValues = Object.assign({}, e.defaultAttributeValues), this.index0AttributeName = e.index0AttributeName, this.uniformsNeedUpdate = e.uniformsNeedUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    t.glslVersion = this.glslVersion, t.uniforms = {};
    for (const n in this.uniforms) {
      const r = this.uniforms[n].value;
      r && r.isTexture ? t.uniforms[n] = {
        type: "t",
        value: r.toJSON(e).uuid
      } : r && r.isColor ? t.uniforms[n] = {
        type: "c",
        value: r.getHex()
      } : r && r.isVector2 ? t.uniforms[n] = {
        type: "v2",
        value: r.toArray()
      } : r && r.isVector3 ? t.uniforms[n] = {
        type: "v3",
        value: r.toArray()
      } : r && r.isVector4 ? t.uniforms[n] = {
        type: "v4",
        value: r.toArray()
      } : r && r.isMatrix3 ? t.uniforms[n] = {
        type: "m3",
        value: r.toArray()
      } : r && r.isMatrix4 ? t.uniforms[n] = {
        type: "m4",
        value: r.toArray()
      } : t.uniforms[n] = { value: r };
    }
    Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
    const i = {};
    for (const n in this.extensions) this.extensions[n] === !0 && (i[n] = !0);
    return Object.keys(i).length > 0 && (t.extensions = i), t;
  }
  fromJSON(e, t) {
    if (super.fromJSON(e, t), e.uniforms !== void 0) for (const i in e.uniforms) {
      const n = e.uniforms[i];
      switch (this.uniforms[i] = {}, n.type) {
        case "t":
          this.uniforms[i].value = t[n.value] || null;
          break;
        case "c":
          this.uniforms[i].value = new Te().setHex(n.value);
          break;
        case "v2":
          this.uniforms[i].value = new Fe().fromArray(n.value);
          break;
        case "v3":
          this.uniforms[i].value = new U().fromArray(n.value);
          break;
        case "v4":
          this.uniforms[i].value = new Ze().fromArray(n.value);
          break;
        case "m3":
          this.uniforms[i].value = new Ie().fromArray(n.value);
          break;
        case "m4":
          this.uniforms[i].value = new Ne().fromArray(n.value);
          break;
        default:
          this.uniforms[i].value = n.value;
      }
    }
    if (e.defines !== void 0 && (this.defines = e.defines), e.vertexShader !== void 0 && (this.vertexShader = e.vertexShader), e.fragmentShader !== void 0 && (this.fragmentShader = e.fragmentShader), e.glslVersion !== void 0 && (this.glslVersion = e.glslVersion), e.extensions !== void 0) for (const i in e.extensions) this.extensions[i] = e.extensions[i];
    return e.lights !== void 0 && (this.lights = e.lights), e.clipping !== void 0 && (this.clipping = e.clipping), this;
  }
}, Qh = class extends li {
  constructor(e) {
    super(e), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
  }
}, Jr = class extends ci {
  constructor(e) {
    super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new Te(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Te(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new Fe(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Fi(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
  }
}, di = class extends Jr {
  constructor(e) {
    super(), this.isMeshPhysicalMaterial = !0, this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new Fe(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
      get: function() {
        return ze(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
      },
      set: function(t) {
        this.ior = (1 + 0.4 * t) / (1 - 0.4 * t);
      }
    }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new Te(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new Te(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new Te(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
  }
  get anisotropy() {
    return this._anisotropy;
  }
  set anisotropy(e) {
    this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
  }
  get clearcoat() {
    return this._clearcoat;
  }
  set clearcoat(e) {
    this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
  }
  get iridescence() {
    return this._iridescence;
  }
  set iridescence(e) {
    this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
  }
  get dispersion() {
    return this._dispersion;
  }
  set dispersion(e) {
    this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
  }
  get sheen() {
    return this._sheen;
  }
  set sheen(e) {
    this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
  }
  get transmission() {
    return this._transmission;
  }
  set transmission(e) {
    this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
  }
  copy(e) {
    return super.copy(e), this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
  }
}, ed = class extends ci {
  constructor(e) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = Kl, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
  }
}, td = class extends ci {
  constructor(e) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
  }
};
function Pr(e, t) {
  return !e || e.constructor === t ? e : typeof t.BYTES_PER_ELEMENT == "number" ? new t(e) : Array.prototype.slice.call(e);
}
function id(e) {
  function t(r, s) {
    return e[r] - e[s];
  }
  const i = e.length, n = new Array(i);
  for (let r = 0; r !== i; ++r) n[r] = r;
  return n.sort(t), n;
}
function Za(e, t, i) {
  const n = e.length, r = new e.constructor(n);
  for (let s = 0, a = 0; a !== n; ++s) {
    const o = i[s] * t;
    for (let c = 0; c !== t; ++c) r[a++] = e[o + c];
  }
  return r;
}
function nd(e, t, i, n) {
  let r = 1, s = e[0];
  for (; s !== void 0 && s[n] === void 0; ) s = e[r++];
  if (s === void 0) return;
  let a = s[n];
  if (a !== void 0)
    if (Array.isArray(a)) do
      a = s[n], a !== void 0 && (t.push(s.time), i.push(...a)), s = e[r++];
    while (s !== void 0);
    else if (a.toArray !== void 0) do
      a = s[n], a !== void 0 && (t.push(s.time), a.toArray(i, i.length)), s = e[r++];
    while (s !== void 0);
    else do
      a = s[n], a !== void 0 && (t.push(s.time), i.push(a)), s = e[r++];
    while (s !== void 0);
}
var Rn = class {
  constructor(e, t, i, n) {
    this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = n !== void 0 ? n : new t.constructor(i), this.sampleValues = t, this.valueSize = i, this.settings = null, this.DefaultSettings_ = {};
  }
  evaluate(e) {
    const t = this.parameterPositions;
    let i = this._cachedIndex, n = t[i], r = t[i - 1];
    i: {
      e: {
        let s;
        t: {
          n: if (!(e < n)) {
            for (let a = i + 2; ; ) {
              if (n === void 0) {
                if (e < r) break n;
                return i = t.length, this._cachedIndex = i, this.copySampleValue_(i - 1);
              }
              if (i === a) break;
              if (r = n, n = t[++i], e < n) break e;
            }
            s = t.length;
            break t;
          }
          if (!(e >= r)) {
            const a = t[1];
            e < a && (i = 2, r = a);
            for (let o = i - 2; ; ) {
              if (r === void 0)
                return this._cachedIndex = 0, this.copySampleValue_(0);
              if (i === o) break;
              if (n = r, r = t[--i - 1], e >= r) break e;
            }
            s = i, i = 0;
            break t;
          }
          break i;
        }
        for (; i < s; ) {
          const a = i + s >>> 1;
          e < t[a] ? s = a : i = a + 1;
        }
        if (n = t[i], r = t[i - 1], r === void 0)
          return this._cachedIndex = 0, this.copySampleValue_(0);
        if (n === void 0)
          return i = t.length, this._cachedIndex = i, this.copySampleValue_(i - 1);
      }
      this._cachedIndex = i, this.intervalChanged_(i, r, n);
    }
    return this.interpolate_(i, r, e, n);
  }
  getSettings_() {
    return this.settings || this.DefaultSettings_;
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, i = this.sampleValues, n = this.valueSize, r = e * n;
    for (let s = 0; s !== n; ++s) t[s] = i[r + s];
    return t;
  }
  interpolate_() {
    throw new Error("THREE.Interpolant: Call to abstract method.");
  }
  intervalChanged_() {
  }
}, rd = class extends Rn {
  constructor(e, t, i, n) {
    super(e, t, i, n), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
      endingStart: _a,
      endingEnd: _a
    };
  }
  intervalChanged_(e, t, i) {
    const n = this.parameterPositions;
    let r = e - 2, s = e + 1, a = n[r], o = n[s];
    if (a === void 0) switch (this.getSettings_().endingStart) {
      case Ma:
        r = e, a = 2 * t - i;
        break;
      case xa:
        r = n.length - 2, a = t + n[r] - n[r + 1];
        break;
      default:
        r = e, a = i;
    }
    if (o === void 0) switch (this.getSettings_().endingEnd) {
      case Ma:
        s = e, o = 2 * i - t;
        break;
      case xa:
        s = 1, o = i + n[1] - n[0];
        break;
      default:
        s = e - 1, o = t;
    }
    const c = (i - t) * 0.5, l = this.valueSize;
    this._weightPrev = c / (t - a), this._weightNext = c / (o - i), this._offsetPrev = r * l, this._offsetNext = s * l;
  }
  interpolate_(e, t, i, n) {
    const r = this.resultBuffer, s = this.sampleValues, a = this.valueSize, o = e * a, c = o - a, l = this._offsetPrev, h = this._offsetNext, u = this._weightPrev, d = this._weightNext, p = (i - t) / (n - t), g = p * p, _ = g * p, m = -u * _ + 2 * u * g - u * p, f = (1 + u) * _ + (-1.5 - 2 * u) * g + (-0.5 + u) * p + 1, T = (-1 - d) * _ + (1.5 + d) * g + 0.5 * p, A = d * _ - d * g;
    for (let M = 0; M !== a; ++M) r[M] = m * s[l + M] + f * s[c + M] + T * s[o + M] + A * s[h + M];
    return r;
  }
}, sd = class extends Rn {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
  interpolate_(e, t, i, n) {
    const r = this.resultBuffer, s = this.sampleValues, a = this.valueSize, o = e * a, c = o - a, l = (i - t) / (n - t), h = 1 - l;
    for (let u = 0; u !== a; ++u) r[u] = s[c + u] * h + s[o + u] * l;
    return r;
  }
}, ad = class extends Rn {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
  interpolate_(e) {
    return this.copySampleValue_(e - 1);
  }
}, od = class extends Rn {
  interpolate_(e, t, i, n) {
    const r = this.resultBuffer, s = this.sampleValues, a = this.valueSize, o = e * a, c = o - a, l = this.inTangents, h = this.outTangents;
    if (!l || !h) {
      const p = (i - t) / (n - t), g = 1 - p;
      for (let _ = 0; _ !== a; ++_) r[_] = s[c + _] * g + s[o + _] * p;
      return r;
    }
    const u = a * 2, d = e - 1;
    for (let p = 0; p !== a; ++p) {
      const g = s[c + p], _ = s[o + p], m = d * u + p * 2, f = h[m], T = h[m + 1], A = e * u + p * 2, M = l[A], E = l[A + 1];
      let w = (i - t) / (n - t), C, v, y, V, R;
      for (let k = 0; k < 8; k++) {
        C = w * w, v = C * w, y = 1 - w, V = y * y, R = V * y;
        const q = R * t + 3 * V * w * f + 3 * y * C * M + v * n - i;
        if (Math.abs(q) < 1e-10) break;
        const X = 3 * V * (f - t) + 6 * y * w * (M - f) + 3 * C * (n - M);
        if (Math.abs(X) < 1e-10) break;
        w = w - q / X, w = Math.max(0, Math.min(1, w));
      }
      r[p] = R * g + 3 * V * w * T + 3 * y * C * E + v * _;
    }
    return r;
  }
}, Qt = class {
  constructor(e, t, i, n) {
    if (e === void 0) throw new Error("THREE.KeyframeTrack: track name is undefined");
    if (t === void 0 || t.length === 0) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
    this.name = e, this.times = Pr(t, this.TimeBufferType), this.values = Pr(i, this.ValueBufferType), this.setInterpolation(n || this.DefaultInterpolation);
  }
  static toJSON(e) {
    const t = e.constructor;
    let i;
    if (t.toJSON !== this.toJSON) i = t.toJSON(e);
    else {
      i = {
        name: e.name,
        times: Pr(e.times, Array),
        values: Pr(e.values, Array)
      };
      const n = e.getInterpolation();
      n !== e.DefaultInterpolation && (i.interpolation = n);
    }
    return i.type = e.ValueTypeName, i;
  }
  InterpolantFactoryMethodDiscrete(e) {
    return new ad(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodLinear(e) {
    return new sd(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodSmooth(e) {
    return new rd(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodBezier(e) {
    const t = new od(this.times, this.values, this.getValueSize(), e);
    return this.settings && (t.inTangents = this.settings.inTangents, t.outTangents = this.settings.outTangents), t;
  }
  setInterpolation(e) {
    let t;
    switch (e) {
      case $n:
        t = this.InterpolantFactoryMethodDiscrete;
        break;
      case Zn:
        t = this.InterpolantFactoryMethodLinear;
        break;
      case ns:
        t = this.InterpolantFactoryMethodSmooth;
        break;
      case ba:
        t = this.InterpolantFactoryMethodBezier;
    }
    if (t === void 0) {
      const i = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
      if (this.createInterpolant === void 0)
        if (e !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
        else throw new Error(i);
      return xe("KeyframeTrack:", i), this;
    }
    return this.createInterpolant = t, this;
  }
  getInterpolation() {
    switch (this.createInterpolant) {
      case this.InterpolantFactoryMethodDiscrete:
        return $n;
      case this.InterpolantFactoryMethodLinear:
        return Zn;
      case this.InterpolantFactoryMethodSmooth:
        return ns;
      case this.InterpolantFactoryMethodBezier:
        return ba;
    }
  }
  getValueSize() {
    return this.values.length / this.times.length;
  }
  shift(e) {
    if (e !== 0) {
      const t = this.times;
      for (let i = 0, n = t.length; i !== n; ++i) t[i] += e;
    }
    return this;
  }
  scale(e) {
    if (e !== 1) {
      const t = this.times;
      for (let i = 0, n = t.length; i !== n; ++i) t[i] *= e;
    }
    return this;
  }
  trim(e, t) {
    const i = this.times, n = i.length;
    let r = 0, s = n - 1;
    for (; r !== n && i[r] < e; ) ++r;
    for (; s !== -1 && i[s] > t; ) --s;
    if (++s, r !== 0 || s !== n) {
      r >= s && (s = Math.max(s, 1), r = s - 1);
      const a = this.getValueSize();
      this.times = i.slice(r, s), this.values = this.values.slice(r * a, s * a);
    }
    return this;
  }
  validate() {
    let e = !0;
    const t = this.getValueSize();
    t - Math.floor(t) !== 0 && (Re("KeyframeTrack: Invalid value size in track.", this), e = !1);
    const i = this.times, n = this.values, r = i.length;
    r === 0 && (Re("KeyframeTrack: Track is empty.", this), e = !1);
    let s = null;
    for (let a = 0; a !== r; a++) {
      const o = i[a];
      if (typeof o == "number" && isNaN(o)) {
        Re("KeyframeTrack: Time is not a valid number.", this, a, o), e = !1;
        break;
      }
      if (s !== null && s > o) {
        Re("KeyframeTrack: Out of order keys.", this, a, o, s), e = !1;
        break;
      }
      s = o;
    }
    if (n !== void 0 && Yl(n))
      for (let a = 0, o = n.length; a !== o; ++a) {
        const c = n[a];
        if (isNaN(c)) {
          Re("KeyframeTrack: Value is not a valid number.", this, a, c), e = !1;
          break;
        }
      }
    return e;
  }
  optimize() {
    const e = this.times.slice(), t = this.values.slice(), i = this.getValueSize(), n = this.getInterpolation() === ns, r = e.length - 1;
    let s = 1;
    for (let a = 1; a < r; ++a) {
      let o = !1;
      const c = e[a];
      if (c !== e[a + 1] && (a !== 1 || c !== e[0]))
        if (n)
          o = !0;
        else {
          const l = a * i, h = l - i, u = l + i;
          for (let d = 0; d !== i; ++d) {
            const p = t[l + d];
            if (p !== t[h + d] || p !== t[u + d]) {
              o = !0;
              break;
            }
          }
        }
      if (o) {
        if (a !== s) {
          e[s] = e[a];
          const l = a * i, h = s * i;
          for (let u = 0; u !== i; ++u) t[h + u] = t[l + u];
        }
        ++s;
      }
    }
    if (r > 0) {
      e[s] = e[r];
      for (let a = r * i, o = s * i, c = 0; c !== i; ++c) t[o + c] = t[a + c];
      ++s;
    }
    return s !== e.length ? (this.times = e.slice(0, s), this.values = t.slice(0, s * i)) : (this.times = e, this.values = t), this;
  }
  clone() {
    const e = this.times.slice(), t = this.values.slice(), i = this.constructor, n = new i(this.name, e, t);
    return n.createInterpolant = this.createInterpolant, n;
  }
};
Qt.prototype.ValueTypeName = "";
Qt.prototype.TimeBufferType = Float32Array;
Qt.prototype.ValueBufferType = Float32Array;
Qt.prototype.DefaultInterpolation = Zn;
var Cn = class extends Qt {
  constructor(e, t, i) {
    super(e, t, i);
  }
};
Cn.prototype.ValueTypeName = "bool";
Cn.prototype.ValueBufferType = Array;
Cn.prototype.DefaultInterpolation = $n;
Cn.prototype.InterpolantFactoryMethodLinear = void 0;
Cn.prototype.InterpolantFactoryMethodSmooth = void 0;
var Cc = class extends Qt {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
};
Cc.prototype.ValueTypeName = "color";
var tr = class extends Qt {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
};
tr.prototype.ValueTypeName = "number";
var cd = class extends Rn {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
  interpolate_(e, t, i, n) {
    const r = this.resultBuffer, s = this.sampleValues, a = this.valueSize, o = (i - t) / (n - t);
    let c = e * a;
    for (let l = c + a; c !== l; c += 4) Ht.slerpFlat(r, 0, s, c - a, s, c, o);
    return r;
  }
}, ir = class extends Qt {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
  InterpolantFactoryMethodLinear(e) {
    return new cd(this.times, this.values, this.getValueSize(), e);
  }
};
ir.prototype.ValueTypeName = "quaternion";
ir.prototype.InterpolantFactoryMethodSmooth = void 0;
var Pn = class extends Qt {
  constructor(e, t, i) {
    super(e, t, i);
  }
};
Pn.prototype.ValueTypeName = "string";
Pn.prototype.ValueBufferType = Array;
Pn.prototype.DefaultInterpolation = $n;
Pn.prototype.InterpolantFactoryMethodLinear = void 0;
Pn.prototype.InterpolantFactoryMethodSmooth = void 0;
var jr = class extends Qt {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
};
jr.prototype.ValueTypeName = "vector";
var ld = class {
  constructor(e = "", t = -1, i = [], n = Xl) {
    this.name = e, this.tracks = i, this.duration = t, this.blendMode = n, this.uuid = $t(), this.userData = {}, this.duration < 0 && this.resetDuration();
  }
  static parse(e) {
    const t = [], i = e.tracks, n = 1 / (e.fps || 1);
    for (let s = 0, a = i.length; s !== a; ++s) t.push(dd(i[s]).scale(n));
    const r = new this(e.name, e.duration, t, e.blendMode);
    return r.uuid = e.uuid, r.userData = JSON.parse(e.userData || "{}"), r;
  }
  static toJSON(e) {
    const t = [], i = e.tracks, n = {
      name: e.name,
      duration: e.duration,
      tracks: t,
      uuid: e.uuid,
      blendMode: e.blendMode,
      userData: JSON.stringify(e.userData)
    };
    for (let r = 0, s = i.length; r !== s; ++r) t.push(Qt.toJSON(i[r]));
    return n;
  }
  static CreateFromMorphTargetSequence(e, t, i, n) {
    const r = t.length, s = [];
    for (let a = 0; a < r; a++) {
      let o = [], c = [];
      o.push((a + r - 1) % r, a, (a + 1) % r), c.push(0, 1, 0);
      const l = id(o);
      o = Za(o, 1, l), c = Za(c, 1, l), !n && o[0] === 0 && (o.push(r), c.push(c[0])), s.push(new tr(".morphTargetInfluences[" + t[a].name + "]", o, c).scale(1 / i));
    }
    return new this(e, -1, s);
  }
  static findByName(e, t) {
    let i = e;
    if (!Array.isArray(e)) {
      const n = e;
      i = n.geometry && n.geometry.animations || n.animations;
    }
    for (let n = 0; n < i.length; n++) if (i[n].name === t) return i[n];
    return null;
  }
  static CreateClipsFromMorphTargetSequences(e, t, i) {
    const n = {}, r = /^([\w-]*?)([\d]+)$/;
    for (let a = 0, o = e.length; a < o; a++) {
      const c = e[a], l = c.name.match(r);
      if (l && l.length > 1) {
        const h = l[1];
        let u = n[h];
        u || (n[h] = u = []), u.push(c);
      }
    }
    const s = [];
    for (const a in n) s.push(this.CreateFromMorphTargetSequence(a, n[a], t, i));
    return s;
  }
  resetDuration() {
    const e = this.tracks;
    let t = 0;
    for (let i = 0, n = e.length; i !== n; ++i) {
      const r = this.tracks[i];
      t = Math.max(t, r.times[r.times.length - 1]);
    }
    return this.duration = t, this;
  }
  trim() {
    for (let e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
    return this;
  }
  validate() {
    let e = !0;
    for (let t = 0; t < this.tracks.length; t++) e = e && this.tracks[t].validate();
    return e;
  }
  optimize() {
    for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
    return this;
  }
  clone() {
    const e = [];
    for (let i = 0; i < this.tracks.length; i++) e.push(this.tracks[i].clone());
    const t = new this.constructor(this.name, this.duration, e, this.blendMode);
    return t.userData = JSON.parse(JSON.stringify(this.userData)), t;
  }
  toJSON() {
    return this.constructor.toJSON(this);
  }
};
function hd(e) {
  switch (e.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
      return tr;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
      return jr;
    case "color":
      return Cc;
    case "quaternion":
      return ir;
    case "bool":
    case "boolean":
      return Cn;
    case "string":
      return Pn;
  }
  throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + e);
}
function dd(e) {
  if (e.type === void 0) throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
  const t = hd(e.type);
  if (e.times === void 0) {
    const i = [], n = [];
    nd(e.keys, i, n, "value"), e.times = i, e.values = n;
  }
  return t.parse !== void 0 ? t.parse(e) : new t(e.name, e.times, e.values, e.interpolation);
}
var _i = {
  enabled: !1,
  files: {},
  add: function(e, t) {
    this.enabled !== !1 && (Qa(e) || (this.files[e] = t));
  },
  get: function(e) {
    if (this.enabled !== !1 && !Qa(e))
      return this.files[e];
  },
  remove: function(e) {
    delete this.files[e];
  },
  clear: function() {
    this.files = {};
  }
};
function Qa(e) {
  try {
    const t = e.slice(e.indexOf(":") + 1);
    return new URL(t).protocol === "blob:";
  } catch {
    return !1;
  }
}
var Pc = class {
  constructor(e, t, i) {
    const n = this;
    let r = !1, s = 0, a = 0, o;
    const c = [];
    this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = i, this._abortController = null, this.itemStart = function(l) {
      a++, r === !1 && n.onStart !== void 0 && n.onStart(l, s, a), r = !0;
    }, this.itemEnd = function(l) {
      s++, n.onProgress !== void 0 && n.onProgress(l, s, a), s === a && (r = !1, n.onLoad !== void 0 && n.onLoad());
    }, this.itemError = function(l) {
      n.onError !== void 0 && n.onError(l);
    }, this.resolveURL = function(l) {
      return l = l.normalize("NFC"), o ? o(l) : l;
    }, this.setURLModifier = function(l) {
      return o = l, this;
    }, this.addHandler = function(l, h) {
      return c.push(l, h), this;
    }, this.removeHandler = function(l) {
      const h = c.indexOf(l);
      return h !== -1 && c.splice(h, 2), this;
    }, this.getHandler = function(l) {
      for (let h = 0, u = c.length; h < u; h += 2) {
        const d = c[h], p = c[h + 1];
        if (d.global && (d.lastIndex = 0), d.test(l)) return p;
      }
      return null;
    }, this.abort = function() {
      return this.abortController.abort(), this._abortController = null, this;
    };
  }
  get abortController() {
    return this._abortController || (this._abortController = new AbortController()), this._abortController;
  }
}, Lc = /* @__PURE__ */ new Pc(), Ln = class {
  constructor(e) {
    this.manager = e !== void 0 ? e : Lc, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  load() {
  }
  loadAsync(e, t) {
    const i = this;
    return new Promise(function(n, r) {
      i.load(e, n, t, r);
    });
  }
  parse() {
  }
  setCrossOrigin(e) {
    return this.crossOrigin = e, this;
  }
  setWithCredentials(e) {
    return this.withCredentials = e, this;
  }
  setPath(e) {
    return this.path = e, this;
  }
  setResourcePath(e) {
    return this.resourcePath = e, this;
  }
  setRequestHeader(e) {
    return this.requestHeader = e, this;
  }
  abort() {
    return this;
  }
};
Ln.DEFAULT_MATERIAL_NAME = "__DEFAULT";
var bi = {}, ud = class extends Error {
  constructor(e, t) {
    super(e), this.response = t;
  }
}, Dc = class extends Ln {
  constructor(e) {
    super(e), this.mimeType = "", this.responseType = "", this._abortController = new AbortController();
  }
  load(e, t, i, n) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = _i.get(`file:${e}`);
    if (r !== void 0) {
      this.manager.itemStart(e), setTimeout(() => {
        t && t(r), this.manager.itemEnd(e);
      }, 0);
      return;
    }
    if (bi[e] !== void 0) {
      bi[e].push({
        onLoad: t,
        onProgress: i,
        onError: n
      });
      return;
    }
    bi[e] = [], bi[e].push({
      onLoad: t,
      onProgress: i,
      onError: n
    });
    const s = new Request(e, {
      headers: new Headers(this.requestHeader),
      credentials: this.withCredentials ? "include" : "same-origin",
      signal: typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal
    }), a = this.mimeType, o = this.responseType;
    fetch(s).then((c) => {
      if (c.status === 200 || c.status === 0) {
        if (c.status === 0 && xe("FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || c.body === void 0 || c.body.getReader === void 0) return c;
        const l = bi[e], h = c.body.getReader(), u = c.headers.get("X-File-Size") || c.headers.get("Content-Length"), d = u ? parseInt(u) : 0, p = d !== 0;
        let g = 0;
        const _ = new ReadableStream({ start(m) {
          f();
          function f() {
            h.read().then(({ done: T, value: A }) => {
              if (T) m.close();
              else {
                g += A.byteLength;
                const M = new ProgressEvent("progress", {
                  lengthComputable: p,
                  loaded: g,
                  total: d
                });
                for (let E = 0, w = l.length; E < w; E++) {
                  const C = l[E];
                  C.onProgress && C.onProgress(M);
                }
                m.enqueue(A), f();
              }
            }, (T) => {
              m.error(T);
            });
          }
        } });
        return new Response(_);
      } else throw new ud(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`, c);
    }).then((c) => {
      switch (o) {
        case "arraybuffer":
          return c.arrayBuffer();
        case "blob":
          return c.blob();
        case "document":
          return c.text().then((l) => new DOMParser().parseFromString(l, a));
        case "json":
          return c.json();
        default:
          if (a === "") return c.text();
          {
            const l = /charset="?([^;"\s]*)"?/i.exec(a), h = l && l[1] ? l[1].toLowerCase() : void 0, u = new TextDecoder(h);
            return c.arrayBuffer().then((d) => u.decode(d));
          }
      }
    }).then((c) => {
      _i.add(`file:${e}`, c);
      const l = bi[e];
      delete bi[e];
      for (let h = 0, u = l.length; h < u; h++) {
        const d = l[h];
        d.onLoad && d.onLoad(c);
      }
    }).catch((c) => {
      const l = bi[e];
      if (l === void 0)
        throw this.manager.itemError(e), c;
      delete bi[e];
      for (let h = 0, u = l.length; h < u; h++) {
        const d = l[h];
        d.onError && d.onError(c);
      }
      this.manager.itemError(e);
    }).finally(() => {
      this.manager.itemEnd(e);
    }), this.manager.itemStart(e);
  }
  setResponseType(e) {
    return this.responseType = e, this;
  }
  setMimeType(e) {
    return this.mimeType = e, this;
  }
  abort() {
    return this._abortController.abort(), this._abortController = new AbortController(), this;
  }
}, hn = /* @__PURE__ */ new WeakMap(), fd = class extends Ln {
  constructor(e) {
    super(e);
  }
  load(e, t, i, n) {
    this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = this, s = _i.get(`image:${e}`);
    if (s !== void 0) {
      if (s.complete === !0)
        r.manager.itemStart(e), setTimeout(function() {
          t && t(s), r.manager.itemEnd(e);
        }, 0);
      else {
        let h = hn.get(s);
        h === void 0 && (h = [], hn.set(s, h)), h.push({
          onLoad: t,
          onError: n
        });
      }
      return s;
    }
    const a = Qn("img");
    function o() {
      l(), t && t(this);
      const h = hn.get(this) || [];
      for (let u = 0; u < h.length; u++) {
        const d = h[u];
        d.onLoad && d.onLoad(this);
      }
      hn.delete(this), r.manager.itemEnd(e);
    }
    function c(h) {
      l(), n && n(h), _i.remove(`image:${e}`);
      const u = hn.get(this) || [];
      for (let d = 0; d < u.length; d++) {
        const p = u[d];
        p.onError && p.onError(h);
      }
      hn.delete(this), r.manager.itemError(e), r.manager.itemEnd(e);
    }
    function l() {
      a.removeEventListener("load", o, !1), a.removeEventListener("error", c, !1);
    }
    return a.addEventListener("load", o, !1), a.addEventListener("error", c, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (a.crossOrigin = this.crossOrigin), _i.add(`image:${e}`, a), r.manager.itemStart(e), a.src = e, a;
  }
}, pd = class extends Ln {
  constructor(e) {
    super(e);
  }
  load(e, t, i, n) {
    const r = new Dt(), s = new fd(this.manager);
    return s.setCrossOrigin(this.crossOrigin), s.setPath(this.path), s.load(e, function(a) {
      r.image = a, r.needsUpdate = !0, t !== void 0 && t(r);
    }, i, n), r;
  }
}, $r = class extends dt {
  constructor(e, t = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Te(e), this.intensity = t;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  copy(e, t) {
    return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, t;
  }
}, md = class extends $r {
  constructor(e, t, i) {
    super(e, i), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(dt.DEFAULT_UP), this.updateMatrix(), this.groundColor = new Te(t);
  }
  copy(e, t) {
    return super.copy(e, t), this.groundColor.copy(e.groundColor), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.groundColor = this.groundColor.getHex(), t;
  }
}, Ps = /* @__PURE__ */ new Ne(), eo = /* @__PURE__ */ new U(), to = /* @__PURE__ */ new U(), oa = class {
  constructor(e) {
    this.camera = e, this.intensity = 1, this.bias = 0, this.biasNode = null, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Fe(512, 512), this.mapType = Ui, this.map = null, this.mapPass = null, this.matrix = new Ne(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new na(), this._frameExtents = new Fe(1, 1), this._viewportCount = 1, this._viewports = [new Ze(0, 0, 1, 1)];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(e) {
    const t = this.camera, i = this.matrix;
    eo.setFromMatrixPosition(e.matrixWorld), t.position.copy(eo), to.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(to), t.updateMatrixWorld(), Ps.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Ps, t.coordinateSystem, t.reversedDepth), t.coordinateSystem === 2001 || t.reversedDepth ? i.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1) : i.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), i.multiply(Ps);
  }
  getViewport(e) {
    return this._viewports[e];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(e) {
    return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.autoUpdate = e.autoUpdate, this.needsUpdate = e.needsUpdate, this.normalBias = e.normalBias, this.blurSamples = e.blurSamples, this.mapSize.copy(e.mapSize), this.biasNode = e.biasNode, this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const e = {};
    return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
  }
}, Lr = /* @__PURE__ */ new U(), Dr = /* @__PURE__ */ new Ht(), ii = /* @__PURE__ */ new U(), Ic = class extends dt {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Ne(), this.projectionMatrix = new Ne(), this.projectionMatrixInverse = new Ne(), this.coordinateSystem = Sn, this._reversedDepth = !1;
  }
  get reversedDepth() {
    return this._reversedDepth;
  }
  copy(e, t) {
    return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
  }
  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.matrixWorld.decompose(Lr, Dr, ii), ii.x === 1 && ii.y === 1 && ii.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(Lr, Dr, ii.set(1, 1, 1)).invert();
  }
  updateWorldMatrix(e, t, i = !1) {
    super.updateWorldMatrix(e, t, i), this.matrixWorld.decompose(Lr, Dr, ii), ii.x === 1 && ii.y === 1 && ii.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(Lr, Dr, ii.set(1, 1, 1)).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}, Ci = /* @__PURE__ */ new U(), io = /* @__PURE__ */ new Fe(), no = /* @__PURE__ */ new Fe(), Pt = class extends Ic {
  constructor(e = 50, t = 1, i = 0.1, n = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = i, this.far = n, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
  }
  setFocalLength(e) {
    const t = 0.5 * this.getFilmHeight() / e;
    this.fov = En * 2 * Math.atan(t), this.updateProjectionMatrix();
  }
  getFocalLength() {
    const e = Math.tan(Kn * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / e;
  }
  getEffectiveFOV() {
    return En * 2 * Math.atan(Math.tan(Kn * 0.5 * this.fov) / this.zoom);
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  getViewBounds(e, t, i) {
    Ci.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t.set(Ci.x, Ci.y).multiplyScalar(-e / Ci.z), Ci.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), i.set(Ci.x, Ci.y).multiplyScalar(-e / Ci.z);
  }
  getViewSize(e, t) {
    return this.getViewBounds(e, io, no), t.subVectors(no, io);
  }
  setViewOffset(e, t, i, n, r, s) {
    this.aspect = e / t, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = i, this.view.offsetY = n, this.view.width = r, this.view.height = s, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = this.near;
    let t = e * Math.tan(Kn * 0.5 * this.fov) / this.zoom, i = 2 * t, n = this.aspect * i, r = -0.5 * n;
    const s = this.view;
    if (this.view !== null && this.view.enabled) {
      const o = s.fullWidth, c = s.fullHeight;
      r += s.offsetX * n / o, t -= s.offsetY * i / c, n *= s.width / o, i *= s.height / c;
    }
    const a = this.filmOffset;
    a !== 0 && (r += e * a / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + n, t, t - i, e, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
  }
}, gd = class extends oa {
  constructor() {
    super(new Pt(50, 1, 0.5, 500)), this.isSpotLightShadow = !0, this.focus = 1, this.aspect = 1;
  }
  updateMatrices(e) {
    const t = this.camera, i = En * 2 * e.angle * this.focus, n = this.mapSize.width / this.mapSize.height * this.aspect, r = e.distance || t.far;
    (i !== t.fov || n !== t.aspect || r !== t.far) && (t.fov = i, t.aspect = n, t.far = r, t.updateProjectionMatrix()), super.updateMatrices(e);
  }
  copy(e) {
    return super.copy(e), this.focus = e.focus, this;
  }
}, vd = class extends $r {
  constructor(e, t, i = 0, n = Math.PI / 3, r = 0, s = 2) {
    super(e, t), this.isSpotLight = !0, this.type = "SpotLight", this.position.copy(dt.DEFAULT_UP), this.updateMatrix(), this.target = new dt(), this.distance = i, this.angle = n, this.penumbra = r, this.decay = s, this.map = null, this.shadow = new gd();
  }
  get power() {
    return this.intensity * Math.PI;
  }
  set power(e) {
    this.intensity = e / Math.PI;
  }
  dispose() {
    super.dispose(), this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.map = e.map, this.shadow = e.shadow.clone(), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.distance = this.distance, t.object.angle = this.angle, t.object.decay = this.decay, t.object.penumbra = this.penumbra, t.object.target = this.target.uuid, this.map && this.map.isTexture && (t.object.map = this.map.toJSON(e).uuid), t.object.shadow = this.shadow.toJSON(), t;
  }
}, bd = class extends oa {
  constructor() {
    super(new Pt(90, 1, 0.5, 500)), this.isPointLightShadow = !0;
  }
}, qs = class extends $r {
  constructor(e, t, i = 0, n = 2) {
    super(e, t), this.isPointLight = !0, this.type = "PointLight", this.distance = i, this.decay = n, this.shadow = new bd();
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(e) {
    this.intensity = e / (4 * Math.PI);
  }
  dispose() {
    super.dispose(), this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.distance = this.distance, t.object.decay = this.decay, t.object.shadow = this.shadow.toJSON(), t;
  }
}, Zr = class extends Ic {
  constructor(e = -1, t = 1, i = 1, n = -1, r = 0.1, s = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = i, this.bottom = n, this.near = r, this.far = s, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
  }
  setViewOffset(e, t, i, n, r, s) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = i, this.view.offsetY = n, this.view.width = r, this.view.height = s, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), i = (this.right + this.left) / 2, n = (this.top + this.bottom) / 2;
    let r = i - e, s = i + e, a = n + t, o = n - t;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom, l = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      r += c * this.view.offsetX, s = r + c * this.view.width, a -= l * this.view.offsetY, o = a - l * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(r, s, a, o, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
  }
}, _d = class extends oa {
  constructor() {
    super(new Zr(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}, Nc = class extends $r {
  constructor(e, t) {
    super(e, t), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(dt.DEFAULT_UP), this.updateMatrix(), this.target = new dt(), this.shadow = new _d();
  }
  dispose() {
    super.dispose(), this.shadow.dispose();
  }
  copy(e) {
    return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.shadow = this.shadow.toJSON(), t.object.target = this.target.uuid, t;
  }
}, Yn = class {
  static extractUrlBase(e) {
    const t = e.lastIndexOf("/");
    return t === -1 ? "./" : e.slice(0, t + 1);
  }
  static resolveURL(e, t) {
    return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
  }
}, Ls = /* @__PURE__ */ new WeakMap(), Md = class extends Ln {
  constructor(e) {
    super(e), this.isImageBitmapLoader = !0, typeof createImageBitmap > "u" && xe("ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && xe("ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" }, this._abortController = new AbortController();
  }
  setOptions(e) {
    return this.options = e, this;
  }
  load(e, t, i, n) {
    e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const r = this, s = _i.get(`image-bitmap:${e}`);
    if (s !== void 0) {
      if (r.manager.itemStart(e), s.then) {
        s.then((c) => {
          Ls.has(s) === !0 ? (n && n(Ls.get(s)), r.manager.itemError(e), r.manager.itemEnd(e)) : (t && t(c), r.manager.itemEnd(e));
        });
        return;
      }
      setTimeout(function() {
        t && t(s), r.manager.itemEnd(e);
      }, 0);
      return;
    }
    const a = {};
    a.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", a.headers = this.requestHeader, a.signal = typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal;
    const o = fetch(e, a).then(function(c) {
      return c.blob();
    }).then(function(c) {
      return createImageBitmap(c, Object.assign(r.options, { colorSpaceConversion: "none" }));
    }).then(function(c) {
      _i.add(`image-bitmap:${e}`, c), t && t(c), r.manager.itemEnd(e);
    }).catch(function(c) {
      n && n(c), Ls.set(o, c), _i.remove(`image-bitmap:${e}`), r.manager.itemError(e), r.manager.itemEnd(e);
    });
    _i.add(`image-bitmap:${e}`, o), r.manager.itemStart(e);
  }
  abort() {
    return this._abortController.abort(), this._abortController = new AbortController(), this;
  }
}, dn = -90, un = 1, xd = class extends dt {
  constructor(e, t, i) {
    super(), this.type = "CubeCamera", this.renderTarget = i, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const n = new Pt(dn, un, e, t);
    n.layers = this.layers, this.add(n);
    const r = new Pt(dn, un, e, t);
    r.layers = this.layers, this.add(r);
    const s = new Pt(dn, un, e, t);
    s.layers = this.layers, this.add(s);
    const a = new Pt(dn, un, e, t);
    a.layers = this.layers, this.add(a);
    const o = new Pt(dn, un, e, t);
    o.layers = this.layers, this.add(o);
    const c = new Pt(dn, un, e, t);
    c.layers = this.layers, this.add(c);
  }
  updateCoordinateSystem() {
    const e = this.coordinateSystem, t = this.children.concat(), [i, n, r, s, a, o] = t;
    for (const c of t) this.remove(c);
    if (e === 2e3)
      i.up.set(0, 1, 0), i.lookAt(1, 0, 0), n.up.set(0, 1, 0), n.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), s.up.set(0, 0, 1), s.lookAt(0, -1, 0), a.up.set(0, 1, 0), a.lookAt(0, 0, 1), o.up.set(0, 1, 0), o.lookAt(0, 0, -1);
    else if (e === 2001)
      i.up.set(0, -1, 0), i.lookAt(-1, 0, 0), n.up.set(0, -1, 0), n.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), s.up.set(0, 0, -1), s.lookAt(0, -1, 0), a.up.set(0, -1, 0), a.lookAt(0, 0, 1), o.up.set(0, -1, 0), o.lookAt(0, 0, -1);
    else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const c of t)
      this.add(c), c.updateMatrixWorld();
  }
  update(e, t) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: i, activeMipmapLevel: n } = this;
    this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
    const [r, s, a, o, c, l] = this.children, h = e.getRenderTarget(), u = e.getActiveCubeFace(), d = e.getActiveMipmapLevel(), p = e.xr.enabled;
    e.xr.enabled = !1;
    const g = i.texture.generateMipmaps;
    i.texture.generateMipmaps = !1;
    let _ = !1;
    e.isWebGLRenderer === !0 ? _ = e.state.buffers.depth.getReversed() : _ = e.reversedDepthBuffer, e.setRenderTarget(i, 0, n), _ && e.autoClear === !1 && e.clearDepth(), e.render(t, r), e.setRenderTarget(i, 1, n), _ && e.autoClear === !1 && e.clearDepth(), e.render(t, s), e.setRenderTarget(i, 2, n), _ && e.autoClear === !1 && e.clearDepth(), e.render(t, a), e.setRenderTarget(i, 3, n), _ && e.autoClear === !1 && e.clearDepth(), e.render(t, o), e.setRenderTarget(i, 4, n), _ && e.autoClear === !1 && e.clearDepth(), e.render(t, c), i.texture.generateMipmaps = g, e.setRenderTarget(i, 5, n), _ && e.autoClear === !1 && e.clearDepth(), e.render(t, l), e.setRenderTarget(h, u, d), e.xr.enabled = p, i.texture.needsPMREMUpdate = !0;
  }
}, Sd = class extends Pt {
  constructor(e = []) {
    super(), this.isArrayCamera = !0, this.isMultiViewCamera = !1, this.cameras = e;
  }
}, yd = "\\[\\]\\.:\\/", Ed = /* @__PURE__ */ new RegExp("[\\[\\]\\.:\\/]", "g"), ca = "[^\\[\\]\\.:\\/]", Td = "[^" + yd.replace("\\.", "") + "]", Ad = /* @__PURE__ */ /((?:WC+[\/:])*)/.source.replace("WC", ca), wd = /* @__PURE__ */ /(WCOD+)?/.source.replace("WCOD", Td), Rd = /* @__PURE__ */ /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", ca), Cd = /* @__PURE__ */ /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", ca), Pd = new RegExp("^" + Ad + wd + Rd + Cd + "$"), Ld = [
  "material",
  "materials",
  "bones",
  "map"
], Dd = class {
  constructor(e, t, i) {
    const n = i || st.parseTrackName(t);
    this._targetGroup = e, this._bindings = e.subscribe_(t, n);
  }
  getValue(e, t) {
    this.bind();
    const i = this._targetGroup.nCachedObjects_, n = this._bindings[i];
    n !== void 0 && n.getValue(e, t);
  }
  setValue(e, t) {
    const i = this._bindings;
    for (let n = this._targetGroup.nCachedObjects_, r = i.length; n !== r; ++n) i[n].setValue(e, t);
  }
  bind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, i = e.length; t !== i; ++t) e[t].bind();
  }
  unbind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, i = e.length; t !== i; ++t) e[t].unbind();
  }
}, st = class gn {
  constructor(t, i, n) {
    this.path = i, this.parsedPath = n || gn.parseTrackName(i), this.node = gn.findNode(t, this.parsedPath.nodeName), this.rootNode = t, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
  static create(t, i, n) {
    return t && t.isAnimationObjectGroup ? new gn.Composite(t, i, n) : new gn(t, i, n);
  }
  static sanitizeNodeName(t) {
    return t.replace(/\s/g, "_").replace(Ed, "");
  }
  static parseTrackName(t) {
    const i = Pd.exec(t);
    if (i === null) throw new Error("THREE.PropertyBinding: Cannot parse trackName: " + t);
    const n = {
      nodeName: i[2],
      objectName: i[3],
      objectIndex: i[4],
      propertyName: i[5],
      propertyIndex: i[6]
    }, r = n.nodeName && n.nodeName.lastIndexOf(".");
    if (r !== void 0 && r !== -1) {
      const s = n.nodeName.substring(r + 1);
      Ld.indexOf(s) !== -1 && (n.nodeName = n.nodeName.substring(0, r), n.objectName = s);
    }
    if (n.propertyName === null || n.propertyName.length === 0) throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: " + t);
    return n;
  }
  static findNode(t, i) {
    if (i === void 0 || i === "" || i === "." || i === -1 || i === t.name || i === t.uuid) return t;
    if (t.skeleton) {
      const n = t.skeleton.getBoneByName(i);
      if (n !== void 0) return n;
    }
    if (t.children) {
      const n = function(s) {
        for (let a = 0; a < s.length; a++) {
          const o = s[a];
          if (o.name === i || o.uuid === i) return o;
          const c = n(o.children);
          if (c) return c;
        }
        return null;
      }, r = n(t.children);
      if (r) return r;
    }
    return null;
  }
  _getValue_unavailable() {
  }
  _setValue_unavailable() {
  }
  _getValue_direct(t, i) {
    t[i] = this.targetObject[this.propertyName];
  }
  _getValue_array(t, i) {
    const n = this.resolvedProperty;
    for (let r = 0, s = n.length; r !== s; ++r) t[i++] = n[r];
  }
  _getValue_arrayElement(t, i) {
    t[i] = this.resolvedProperty[this.propertyIndex];
  }
  _getValue_toArray(t, i) {
    this.resolvedProperty.toArray(t, i);
  }
  _setValue_direct(t, i) {
    this.targetObject[this.propertyName] = t[i];
  }
  _setValue_direct_setNeedsUpdate(t, i) {
    this.targetObject[this.propertyName] = t[i], this.targetObject.needsUpdate = !0;
  }
  _setValue_direct_setMatrixWorldNeedsUpdate(t, i) {
    this.targetObject[this.propertyName] = t[i], this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  _setValue_array(t, i) {
    const n = this.resolvedProperty;
    for (let r = 0, s = n.length; r !== s; ++r) n[r] = t[i++];
  }
  _setValue_array_setNeedsUpdate(t, i) {
    const n = this.resolvedProperty;
    for (let r = 0, s = n.length; r !== s; ++r) n[r] = t[i++];
    this.targetObject.needsUpdate = !0;
  }
  _setValue_array_setMatrixWorldNeedsUpdate(t, i) {
    const n = this.resolvedProperty;
    for (let r = 0, s = n.length; r !== s; ++r) n[r] = t[i++];
    this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  _setValue_arrayElement(t, i) {
    this.resolvedProperty[this.propertyIndex] = t[i];
  }
  _setValue_arrayElement_setNeedsUpdate(t, i) {
    this.resolvedProperty[this.propertyIndex] = t[i], this.targetObject.needsUpdate = !0;
  }
  _setValue_arrayElement_setMatrixWorldNeedsUpdate(t, i) {
    this.resolvedProperty[this.propertyIndex] = t[i], this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  _setValue_fromArray(t, i) {
    this.resolvedProperty.fromArray(t, i);
  }
  _setValue_fromArray_setNeedsUpdate(t, i) {
    this.resolvedProperty.fromArray(t, i), this.targetObject.needsUpdate = !0;
  }
  _setValue_fromArray_setMatrixWorldNeedsUpdate(t, i) {
    this.resolvedProperty.fromArray(t, i), this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  _getValue_unbound(t, i) {
    this.bind(), this.getValue(t, i);
  }
  _setValue_unbound(t, i) {
    this.bind(), this.setValue(t, i);
  }
  bind() {
    let t = this.node;
    const i = this.parsedPath, n = i.objectName, r = i.propertyName;
    let s = i.propertyIndex;
    if (t || (t = gn.findNode(this.rootNode, i.nodeName), this.node = t), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t) {
      xe("PropertyBinding: No target node found for track: " + this.path + ".");
      return;
    }
    if (n) {
      let l = i.objectIndex;
      switch (n) {
        case "materials":
          if (!t.material) {
            Re("PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!t.material.materials) {
            Re("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
            return;
          }
          t = t.material.materials;
          break;
        case "bones":
          if (!t.skeleton) {
            Re("PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
            return;
          }
          t = t.skeleton.bones;
          for (let h = 0; h < t.length; h++) if (t[h].name === l) {
            l = h;
            break;
          }
          break;
        case "map":
          if ("map" in t) {
            t = t.map;
            break;
          }
          if (!t.material) {
            Re("PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!t.material.map) {
            Re("PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
            return;
          }
          t = t.material.map;
          break;
        default:
          if (t[n] === void 0) {
            Re("PropertyBinding: Can not bind to objectName of node undefined.", this);
            return;
          }
          t = t[n];
      }
      if (l !== void 0) {
        if (t[l] === void 0) {
          Re("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, t);
          return;
        }
        t = t[l];
      }
    }
    const a = t[r];
    if (a === void 0) {
      const l = i.nodeName;
      Re("PropertyBinding: Trying to update property for track: " + l + "." + r + " but it wasn't found.", t);
      return;
    }
    let o = this.Versioning.None;
    this.targetObject = t, t.isMaterial === !0 ? o = this.Versioning.NeedsUpdate : t.isObject3D === !0 && (o = this.Versioning.MatrixWorldNeedsUpdate);
    let c = this.BindingType.Direct;
    if (s !== void 0) {
      if (r === "morphTargetInfluences") {
        if (!t.geometry) {
          Re("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
          return;
        }
        if (!t.geometry.morphAttributes) {
          Re("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
          return;
        }
        t.morphTargetDictionary[s] !== void 0 && (s = t.morphTargetDictionary[s]);
      }
      c = this.BindingType.ArrayElement, this.resolvedProperty = a, this.propertyIndex = s;
    } else a.fromArray !== void 0 && a.toArray !== void 0 ? (c = this.BindingType.HasFromToArray, this.resolvedProperty = a) : Array.isArray(a) ? (c = this.BindingType.EntireArray, this.resolvedProperty = a) : this.propertyName = r;
    this.getValue = this.GetterByBindingType[c], this.setValue = this.SetterByBindingTypeAndVersioning[c][o];
  }
  unbind() {
    this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
};
st.Composite = Dd;
st.prototype.BindingType = {
  Direct: 0,
  EntireArray: 1,
  ArrayElement: 2,
  HasFromToArray: 3
};
st.prototype.Versioning = {
  None: 0,
  NeedsUpdate: 1,
  MatrixWorldNeedsUpdate: 2
};
st.prototype.GetterByBindingType = [
  st.prototype._getValue_direct,
  st.prototype._getValue_array,
  st.prototype._getValue_arrayElement,
  st.prototype._getValue_toArray
];
st.prototype.SetterByBindingTypeAndVersioning = [
  [
    st.prototype._setValue_direct,
    st.prototype._setValue_direct_setNeedsUpdate,
    st.prototype._setValue_direct_setMatrixWorldNeedsUpdate
  ],
  [
    st.prototype._setValue_array,
    st.prototype._setValue_array_setNeedsUpdate,
    st.prototype._setValue_array_setMatrixWorldNeedsUpdate
  ],
  [
    st.prototype._setValue_arrayElement,
    st.prototype._setValue_arrayElement_setNeedsUpdate,
    st.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
  ],
  [
    st.prototype._setValue_fromArray,
    st.prototype._setValue_fromArray_setNeedsUpdate,
    st.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
  ]
];
var ro = /* @__PURE__ */ new Ne(), Id = class {
  constructor(e, t, i = 0, n = 1 / 0) {
    this.ray = new rr(e, t), this.near = i, this.far = n, this.camera = null, this.layers = new ta(), this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      LOD: {},
      Points: { threshold: 1 },
      Sprite: {}
    };
  }
  set(e, t) {
    this.ray.set(e, t);
  }
  setFromCamera(e, t) {
    t.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, 0.5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, t.projectionMatrix.elements[14]).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : Re("Raycaster: Unsupported camera type: " + t.type);
  }
  setFromXRController(e) {
    return ro.identity().extractRotation(e.matrixWorld), this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(ro), this;
  }
  intersectObject(e, t = !0, i = []) {
    return Xs(e, this, i, t), i.sort(so), i;
  }
  intersectObjects(e, t = !0, i = []) {
    for (let n = 0, r = e.length; n < r; n++) Xs(e[n], this, i, t);
    return i.sort(so), i;
  }
};
function so(e, t) {
  return e.distance - t.distance;
}
function Xs(e, t, i, n) {
  let r = !0;
  if (e.layers.test(t.layers) && e.raycast(t, i) === !1 && (r = !1), r === !0 && n === !0) {
    const s = e.children;
    for (let a = 0, o = s.length; a < o; a++) Xs(s[a], t, i, !0);
  }
}
var Nd = class {
  constructor(e = !0) {
    this.autoStart = e, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1, xe("Clock: This module has been deprecated. Please use THREE.Timer instead.");
  }
  start() {
    this.startTime = performance.now(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = !0;
  }
  stop() {
    this.getElapsedTime(), this.running = !1, this.autoStart = !1;
  }
  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }
  getDelta() {
    let e = 0;
    if (this.autoStart && !this.running)
      return this.start(), 0;
    if (this.running) {
      const t = performance.now();
      e = (t - this.oldTime) / 1e3, this.oldTime = t, this.elapsedTime += e;
    }
    return e;
  }
}, Ud = class {
  constructor(e, t, i, n) {
    this.elements = [
      1,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, i, n);
  }
  identity() {
    return this.set(1, 0, 0, 1), this;
  }
  fromArray(e, t = 0) {
    for (let i = 0; i < 4; i++) this.elements[i] = e[i + t];
    return this;
  }
  set(e, t, i, n) {
    const r = this.elements;
    return r[0] = e, r[2] = t, r[1] = i, r[3] = n, this;
  }
};
qo = Ud;
qo.prototype.isMatrix2 = !0;
function ao(e, t, i, n) {
  const r = Fd(n);
  switch (i) {
    case cl:
      return e * t;
    case nc:
      return e * t / r.components * r.byteLength;
    case rc:
      return e * t / r.components * r.byteLength;
    case zr:
      return e * t * 2 / r.components * r.byteLength;
    case sc:
      return e * t * 2 / r.components * r.byteLength;
    case ll:
      return e * t * 3 / r.components * r.byteLength;
    case xn:
      return e * t * 4 / r.components * r.byteLength;
    case ac:
      return e * t * 4 / r.components * r.byteLength;
    case hl:
    case dl:
      return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case ul:
    case fl:
      return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case ml:
    case vl:
      return Math.max(e, 16) * Math.max(t, 8) / 4;
    case pl:
    case gl:
      return Math.max(e, 8) * Math.max(t, 8) / 2;
    case bl:
    case _l:
    case xl:
    case Sl:
      return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case Ml:
    case yl:
    case El:
      return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Tl:
      return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Al:
      return Math.floor((e + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case wl:
      return Math.floor((e + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case Rl:
      return Math.floor((e + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case Cl:
      return Math.floor((e + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case Pl:
      return Math.floor((e + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case Ll:
      return Math.floor((e + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case Dl:
      return Math.floor((e + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case Il:
      return Math.floor((e + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case Nl:
      return Math.floor((e + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case Ul:
      return Math.floor((e + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case Fl:
      return Math.floor((e + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case Ol:
      return Math.floor((e + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case kl:
      return Math.floor((e + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    case Bl:
    case Gl:
    case zl:
      return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
    case Vl:
    case Hl:
      return Math.ceil(e / 4) * Math.ceil(t / 4) * 8;
    case Wl:
    case ql:
      return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${i} format.`);
}
function Fd(e) {
  switch (e) {
    case Ui:
    case nl:
      return {
        byteLength: 1,
        components: 1
      };
    case Zo:
    case rl:
    case ji:
      return {
        byteLength: 2,
        components: 1
      };
    case Qo:
    case ec:
      return {
        byteLength: 2,
        components: 4
      };
    case Ki:
    case sl:
    case wn:
      return {
        byteLength: 4,
        components: 1
      };
    case al:
    case ol:
      return {
        byteLength: 4,
        components: 3
      };
  }
  throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: "185" } }));
typeof window < "u" && (window.__THREE__ ? xe("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = "185");
function Uc() {
  let e = null, t = !1, i = null, n = null;
  function r(s, a) {
    i(s, a), n = e.requestAnimationFrame(r);
  }
  return {
    start: function() {
      t !== !0 && i !== null && e !== null && (n = e.requestAnimationFrame(r), t = !0);
    },
    stop: function() {
      e !== null && e.cancelAnimationFrame(n), t = !1;
    },
    setAnimationLoop: function(s) {
      i = s;
    },
    setContext: function(s) {
      e = s;
    }
  };
}
function Od(e) {
  const t = /* @__PURE__ */ new WeakMap();
  function i(o, c) {
    const l = o.array, h = o.usage, u = l.byteLength, d = e.createBuffer();
    e.bindBuffer(c, d), e.bufferData(c, l, h), o.onUploadCallback();
    let p;
    if (l instanceof Float32Array) p = e.FLOAT;
    else if (typeof Float16Array < "u" && l instanceof Float16Array) p = e.HALF_FLOAT;
    else if (l instanceof Uint16Array)
      o.isFloat16BufferAttribute ? p = e.HALF_FLOAT : p = e.UNSIGNED_SHORT;
    else if (l instanceof Int16Array) p = e.SHORT;
    else if (l instanceof Uint32Array) p = e.UNSIGNED_INT;
    else if (l instanceof Int32Array) p = e.INT;
    else if (l instanceof Int8Array) p = e.BYTE;
    else if (l instanceof Uint8Array) p = e.UNSIGNED_BYTE;
    else if (l instanceof Uint8ClampedArray) p = e.UNSIGNED_BYTE;
    else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + l);
    return {
      buffer: d,
      type: p,
      bytesPerElement: l.BYTES_PER_ELEMENT,
      version: o.version,
      size: u
    };
  }
  function n(o, c, l) {
    const h = c.array, u = c.updateRanges;
    if (e.bindBuffer(l, o), u.length === 0) e.bufferSubData(l, 0, h);
    else {
      u.sort((p, g) => p.start - g.start);
      let d = 0;
      for (let p = 1; p < u.length; p++) {
        const g = u[d], _ = u[p];
        _.start <= g.start + g.count + 1 ? g.count = Math.max(g.count, _.start + _.count - g.start) : (++d, u[d] = _);
      }
      u.length = d + 1;
      for (let p = 0, g = u.length; p < g; p++) {
        const _ = u[p];
        e.bufferSubData(l, _.start * h.BYTES_PER_ELEMENT, h, _.start, _.count);
      }
      c.clearUpdateRanges();
    }
    c.onUploadCallback();
  }
  function r(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), t.get(o);
  }
  function s(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const c = t.get(o);
    c && (e.deleteBuffer(c.buffer), t.delete(o));
  }
  function a(o, c) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const h = t.get(o);
      (!h || h.version < o.version) && t.set(o, {
        buffer: o.buffer,
        type: o.type,
        bytesPerElement: o.elementSize,
        version: o.version
      });
      return;
    }
    const l = t.get(o);
    if (l === void 0) t.set(o, i(o, c));
    else if (l.version < o.version) {
      if (l.size !== o.array.byteLength) throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(l.buffer, o, c), l.version = o.version;
    }
  }
  return {
    get: r,
    remove: s,
    update: a
  };
}
var Ue = {
  alphahash_fragment: `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
  alphahash_pars_fragment: `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
  alphamap_fragment: `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
  alphamap_pars_fragment: `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  alphatest_fragment: `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
  alphatest_pars_fragment: `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
  aomap_fragment: `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
  aomap_pars_fragment: `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
  batching_pars_vertex: `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,
  batching_vertex: `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
  begin_vertex: `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
  beginnormal_vertex: `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
  bsdfs: `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
  iridescence_fragment: `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
  bumpmap_pars_fragment: `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
  clipping_planes_fragment: `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
  clipping_planes_pars_fragment: `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
  clipping_planes_pars_vertex: `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
  clipping_planes_vertex: `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
  color_fragment: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,
  color_pars_fragment: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,
  color_pars_vertex: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,
  color_vertex: `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,
  common: `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
  cube_uv_reflection_fragment: `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
  defaultnormal_vertex: `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,
  displacementmap_pars_vertex: `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
  displacementmap_vertex: `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
  emissivemap_fragment: `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
  emissivemap_pars_fragment: `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
  colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
  colorspace_pars_fragment: `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
  envmap_fragment: `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,
  envmap_common_pars_fragment: `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,
  envmap_pars_fragment: `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
  envmap_pars_vertex: `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
  envmap_physical_pars_fragment: `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,
  envmap_vertex: `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
  fog_vertex: `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
  fog_pars_vertex: `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
  fog_fragment: `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
  fog_pars_fragment: `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
  gradientmap_pars_fragment: `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
  lightmap_pars_fragment: `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
  lights_lambert_fragment: `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
  lights_lambert_pars_fragment: `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
  lights_pars_begin: `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,
  lights_toon_fragment: `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
  lights_toon_pars_fragment: `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
  lights_phong_fragment: `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
  lights_phong_pars_fragment: `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
  lights_physical_fragment: `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
  lights_physical_pars_fragment: `uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN

		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );

		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );

		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );

		irradiance *= sheenEnergyComp;

	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
  lights_fragment_begin: `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
  lights_fragment_maps: `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
  lights_fragment_end: `#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
  lightprobes_pars_fragment: `#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,
  logdepthbuf_fragment: `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
  logdepthbuf_pars_fragment: `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  logdepthbuf_pars_vertex: `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  logdepthbuf_vertex: `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
  map_fragment: `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
  map_pars_fragment: `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
  map_particle_fragment: `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
  map_particle_pars_fragment: `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  metalnessmap_fragment: `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
  metalnessmap_pars_fragment: `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
  morphinstance_vertex: `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
  morphcolor_vertex: `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
  morphnormal_vertex: `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  morphtarget_pars_vertex: `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
  morphtarget_vertex: `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  normal_fragment_begin: `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
  normal_fragment_maps: `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
  normal_pars_fragment: `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  normal_pars_vertex: `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  normal_vertex: `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,
  normalmap_pars_fragment: `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
  clearcoat_normal_fragment_begin: `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
  clearcoat_normal_fragment_maps: `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
  clearcoat_pars_fragment: `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
  iridescence_pars_fragment: `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
  opaque_fragment: `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
  packing: `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER

		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {

	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,
  premultiplied_alpha_fragment: `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
  project_vertex: `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
  dithering_fragment: `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
  dithering_pars_fragment: `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
  roughnessmap_fragment: `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
  roughnessmap_pars_fragment: `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
  shadowmap_pars_fragment: `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif

				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,
  shadowmap_pars_vertex: `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
  shadowmap_vertex: `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
  shadowmask_pars_fragment: `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
  skinbase_vertex: `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
  skinning_pars_vertex: `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
  skinning_vertex: `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
  skinnormal_vertex: `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
  specularmap_fragment: `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
  specularmap_pars_fragment: `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
  tonemapping_fragment: `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
  tonemapping_pars_fragment: `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
  transmission_fragment: `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
  transmission_pars_fragment: `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
  uv_pars_fragment: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  uv_pars_vertex: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  uv_vertex: `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
  worldpos_vertex: `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,
  background_vert: `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
  background_frag: `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  backgroundCube_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  backgroundCube_frag: `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  cube_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  cube_frag: `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  depth_vert: `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
  depth_frag: `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
  distance_vert: `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
  distance_frag: `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,
  equirect_vert: `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
  equirect_frag: `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  linedashed_vert: `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  linedashed_frag: `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  meshbasic_vert: `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
  meshbasic_frag: `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  meshlambert_vert: `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  meshlambert_frag: `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  meshmatcap_vert: `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
  meshmatcap_frag: `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  meshnormal_vert: `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
  meshnormal_frag: `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
  meshphong_vert: `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  meshphong_frag: `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  meshphysical_vert: `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
  meshphysical_frag: `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN

		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;

	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  meshtoon_vert: `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  meshtoon_frag: `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  points_vert: `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
  points_frag: `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  shadow_vert: `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  shadow_frag: `uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  sprite_vert: `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  sprite_frag: `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`
}, ce = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Te(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Ie() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ie() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Ie() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new Ie() },
    reflectivity: { value: 1 },
    ior: { value: 1.5 },
    refractionRatio: { value: 0.98 },
    dfgLUT: { value: null }
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new Ie() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Ie() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Ie() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Ie() },
    normalScale: { value: /* @__PURE__ */ new Fe(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Ie() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Ie() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Ie() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Ie() }
  },
  gradientmap: { gradientMap: { value: null } },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Te(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: {
      value: [],
      properties: {
        direction: {},
        color: {}
      }
    },
    directionalLightShadows: {
      value: [],
      properties: {
        shadowIntensity: 1,
        shadowBias: {},
        shadowNormalBias: {},
        shadowRadius: {},
        shadowMapSize: {}
      }
    },
    directionalShadowMatrix: { value: [] },
    spotLights: {
      value: [],
      properties: {
        color: {},
        position: {},
        direction: {},
        distance: {},
        coneCos: {},
        penumbraCos: {},
        decay: {}
      }
    },
    spotLightShadows: {
      value: [],
      properties: {
        shadowIntensity: 1,
        shadowBias: {},
        shadowNormalBias: {},
        shadowRadius: {},
        shadowMapSize: {}
      }
    },
    spotLightMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: {
      value: [],
      properties: {
        color: {},
        position: {},
        decay: {},
        distance: {}
      }
    },
    pointLightShadows: {
      value: [],
      properties: {
        shadowIntensity: 1,
        shadowBias: {},
        shadowNormalBias: {},
        shadowRadius: {},
        shadowMapSize: {},
        shadowCameraNear: {},
        shadowCameraFar: {}
      }
    },
    pointShadowMatrix: { value: [] },
    hemisphereLights: {
      value: [],
      properties: {
        direction: {},
        skyColor: {},
        groundColor: {}
      }
    },
    rectAreaLights: {
      value: [],
      properties: {
        color: {},
        position: {},
        width: {},
        height: {}
      }
    },
    ltc_1: { value: null },
    ltc_2: { value: null },
    probesSH: { value: null },
    probesMin: { value: /* @__PURE__ */ new U() },
    probesMax: { value: /* @__PURE__ */ new U() },
    probesResolution: { value: /* @__PURE__ */ new U() }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Te(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ie() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Ie() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Te(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new Fe(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Ie() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ie() },
    alphaTest: { value: 0 }
  }
}, si = {
  basic: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.specularmap,
      ce.envmap,
      ce.aomap,
      ce.lightmap,
      ce.fog
    ]),
    vertexShader: Ue.meshbasic_vert,
    fragmentShader: Ue.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.specularmap,
      ce.envmap,
      ce.aomap,
      ce.lightmap,
      ce.emissivemap,
      ce.bumpmap,
      ce.normalmap,
      ce.displacementmap,
      ce.fog,
      ce.lights,
      {
        emissive: { value: /* @__PURE__ */ new Te(0) },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Ue.meshlambert_vert,
    fragmentShader: Ue.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.specularmap,
      ce.envmap,
      ce.aomap,
      ce.lightmap,
      ce.emissivemap,
      ce.bumpmap,
      ce.normalmap,
      ce.displacementmap,
      ce.fog,
      ce.lights,
      {
        emissive: { value: /* @__PURE__ */ new Te(0) },
        specular: { value: /* @__PURE__ */ new Te(1118481) },
        shininess: { value: 30 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Ue.meshphong_vert,
    fragmentShader: Ue.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.envmap,
      ce.aomap,
      ce.lightmap,
      ce.emissivemap,
      ce.bumpmap,
      ce.normalmap,
      ce.displacementmap,
      ce.roughnessmap,
      ce.metalnessmap,
      ce.fog,
      ce.lights,
      {
        emissive: { value: /* @__PURE__ */ new Te(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Ue.meshphysical_vert,
    fragmentShader: Ue.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.aomap,
      ce.lightmap,
      ce.emissivemap,
      ce.bumpmap,
      ce.normalmap,
      ce.displacementmap,
      ce.gradientmap,
      ce.fog,
      ce.lights,
      { emissive: { value: /* @__PURE__ */ new Te(0) } }
    ]),
    vertexShader: Ue.meshtoon_vert,
    fragmentShader: Ue.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.bumpmap,
      ce.normalmap,
      ce.displacementmap,
      ce.fog,
      { matcap: { value: null } }
    ]),
    vertexShader: Ue.meshmatcap_vert,
    fragmentShader: Ue.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ Ct([ce.points, ce.fog]),
    vertexShader: Ue.points_vert,
    fragmentShader: Ue.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Ue.linedashed_vert,
    fragmentShader: Ue.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ Ct([ce.common, ce.displacementmap]),
    vertexShader: Ue.depth_vert,
    fragmentShader: Ue.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.bumpmap,
      ce.normalmap,
      ce.displacementmap,
      { opacity: { value: 1 } }
    ]),
    vertexShader: Ue.meshnormal_vert,
    fragmentShader: Ue.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ Ct([ce.sprite, ce.fog]),
    vertexShader: Ue.sprite_vert,
    fragmentShader: Ue.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Ie() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Ue.background_vert,
    fragmentShader: Ue.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new Ie() }
    },
    vertexShader: Ue.backgroundCube_vert,
    fragmentShader: Ue.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Ue.cube_vert,
    fragmentShader: Ue.cube_frag
  },
  equirect: {
    uniforms: { tEquirect: { value: null } },
    vertexShader: Ue.equirect_vert,
    fragmentShader: Ue.equirect_frag
  },
  distance: {
    uniforms: /* @__PURE__ */ Ct([
      ce.common,
      ce.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new U() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Ue.distance_vert,
    fragmentShader: Ue.distance_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ Ct([
      ce.lights,
      ce.fog,
      {
        color: { value: /* @__PURE__ */ new Te(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ue.shadow_vert,
    fragmentShader: Ue.shadow_frag
  }
};
si.physical = {
  uniforms: /* @__PURE__ */ Ct([si.standard.uniforms, {
    clearcoat: { value: 0 },
    clearcoatMap: { value: null },
    clearcoatMapTransform: { value: /* @__PURE__ */ new Ie() },
    clearcoatNormalMap: { value: null },
    clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Ie() },
    clearcoatNormalScale: { value: /* @__PURE__ */ new Fe(1, 1) },
    clearcoatRoughness: { value: 0 },
    clearcoatRoughnessMap: { value: null },
    clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Ie() },
    dispersion: { value: 0 },
    iridescence: { value: 0 },
    iridescenceMap: { value: null },
    iridescenceMapTransform: { value: /* @__PURE__ */ new Ie() },
    iridescenceIOR: { value: 1.3 },
    iridescenceThicknessMinimum: { value: 100 },
    iridescenceThicknessMaximum: { value: 400 },
    iridescenceThicknessMap: { value: null },
    iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Ie() },
    sheen: { value: 0 },
    sheenColor: { value: /* @__PURE__ */ new Te(0) },
    sheenColorMap: { value: null },
    sheenColorMapTransform: { value: /* @__PURE__ */ new Ie() },
    sheenRoughness: { value: 1 },
    sheenRoughnessMap: { value: null },
    sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Ie() },
    transmission: { value: 0 },
    transmissionMap: { value: null },
    transmissionMapTransform: { value: /* @__PURE__ */ new Ie() },
    transmissionSamplerSize: { value: /* @__PURE__ */ new Fe() },
    transmissionSamplerMap: { value: null },
    thickness: { value: 0 },
    thicknessMap: { value: null },
    thicknessMapTransform: { value: /* @__PURE__ */ new Ie() },
    attenuationDistance: { value: 0 },
    attenuationColor: { value: /* @__PURE__ */ new Te(0) },
    specularColor: { value: /* @__PURE__ */ new Te(1, 1, 1) },
    specularColorMap: { value: null },
    specularColorMapTransform: { value: /* @__PURE__ */ new Ie() },
    specularIntensity: { value: 1 },
    specularIntensityMap: { value: null },
    specularIntensityMapTransform: { value: /* @__PURE__ */ new Ie() },
    anisotropyVector: { value: /* @__PURE__ */ new Fe() },
    anisotropyMap: { value: null },
    anisotropyMapTransform: { value: /* @__PURE__ */ new Ie() }
  }]),
  vertexShader: Ue.meshphysical_vert,
  fragmentShader: Ue.meshphysical_frag
};
var Ir = {
  r: 0,
  b: 0,
  g: 0
}, kd = /* @__PURE__ */ new Ne(), Fc = /* @__PURE__ */ new Ie();
Fc.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function Bd(e, t, i, n, r, s) {
  const a = new Te(0);
  let o = r === !0 ? 0 : 1, c, l, h = null, u = 0, d = null;
  function p(T) {
    let A = T.isScene === !0 ? T.background : null;
    if (A && A.isTexture) {
      const M = T.backgroundBlurriness > 0;
      A = t.get(A, M);
    }
    return A;
  }
  function g(T) {
    let A = !1;
    const M = p(T);
    M === null ? m(a, o) : M && M.isColor && (m(M, 1), A = !0);
    const E = e.xr.getEnvironmentBlendMode();
    E === "additive" ? i.buffers.color.setClear(0, 0, 0, 1, s) : E === "alpha-blend" && i.buffers.color.setClear(0, 0, 0, 0, s), (e.autoClear || A) && (i.buffers.depth.setTest(!0), i.buffers.depth.setMask(!0), i.buffers.color.setMask(!0), e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil));
  }
  function _(T, A) {
    const M = p(A);
    M && (M.isCubeTexture || M.mapping === 306) ? (l === void 0 && (l = new At(new Yr(1, 1, 1), new li({
      name: "BackgroundCubeMaterial",
      uniforms: An(si.backgroundCube.uniforms),
      vertexShader: si.backgroundCube.vertexShader,
      fragmentShader: si.backgroundCube.fragmentShader,
      side: 1,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      allowOverride: !1
    })), l.geometry.deleteAttribute("normal"), l.geometry.deleteAttribute("uv"), l.onBeforeRender = function(E, w, C) {
      this.matrixWorld.copyPosition(C.matrixWorld);
    }, Object.defineProperty(l.material, "envMap", { get: function() {
      return this.uniforms.envMap.value;
    } }), n.update(l)), l.material.uniforms.envMap.value = M, l.material.uniforms.backgroundBlurriness.value = A.backgroundBlurriness, l.material.uniforms.backgroundIntensity.value = A.backgroundIntensity, l.material.uniforms.backgroundRotation.value.setFromMatrix4(kd.makeRotationFromEuler(A.backgroundRotation)).transpose(), M.isCubeTexture && M.isRenderTargetTexture === !1 && l.material.uniforms.backgroundRotation.value.premultiply(Fc), l.material.toneMapped = Ge.getTransfer(M.colorSpace) !== Hr, (h !== M || u !== M.version || d !== e.toneMapping) && (l.material.needsUpdate = !0, h = M, u = M.version, d = e.toneMapping), l.layers.enableAll(), T.unshift(l, l.geometry, l.material, 0, 0, null)) : M && M.isTexture && (c === void 0 && (c = new At(new aa(2, 2), new li({
      name: "BackgroundMaterial",
      uniforms: An(si.background.uniforms),
      vertexShader: si.background.vertexShader,
      fragmentShader: si.background.fragmentShader,
      side: 0,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      allowOverride: !1
    })), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", { get: function() {
      return this.uniforms.t2D.value;
    } }), n.update(c)), c.material.uniforms.t2D.value = M, c.material.uniforms.backgroundIntensity.value = A.backgroundIntensity, c.material.toneMapped = Ge.getTransfer(M.colorSpace) !== Hr, M.matrixAutoUpdate === !0 && M.updateMatrix(), c.material.uniforms.uvTransform.value.copy(M.matrix), (h !== M || u !== M.version || d !== e.toneMapping) && (c.material.needsUpdate = !0, h = M, u = M.version, d = e.toneMapping), c.layers.enableAll(), T.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function m(T, A) {
    T.getRGB(Ir, Rc(e)), i.buffers.color.setClear(Ir.r, Ir.g, Ir.b, A, s);
  }
  function f() {
    l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0), c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0);
  }
  return {
    getClearColor: function() {
      return a;
    },
    setClearColor: function(T, A = 1) {
      a.set(T), o = A, m(a, o);
    },
    getClearAlpha: function() {
      return o;
    },
    setClearAlpha: function(T) {
      o = T, m(a, o);
    },
    render: g,
    addToRenderList: _,
    dispose: f
  };
}
function Gd(e, t) {
  const i = e.getParameter(e.MAX_VERTEX_ATTRIBS), n = {}, r = d(null);
  let s = r, a = !1;
  function o(R, k, q, X, z) {
    let j = !1;
    const O = u(R, X, q, k);
    s !== O && (s = O, l(s.object)), j = p(R, X, q, z), j && g(R, X, q, z), z !== null && t.update(z, e.ELEMENT_ARRAY_BUFFER), (j || a) && (a = !1, M(R, k, q, X), z !== null && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.get(z).buffer));
  }
  function c() {
    return e.createVertexArray();
  }
  function l(R) {
    return e.bindVertexArray(R);
  }
  function h(R) {
    return e.deleteVertexArray(R);
  }
  function u(R, k, q, X) {
    const z = X.wireframe === !0;
    let j = n[k.id];
    j === void 0 && (j = {}, n[k.id] = j);
    const O = R.isInstancedMesh === !0 ? R.id : 0;
    let ee = j[O];
    ee === void 0 && (ee = {}, j[O] = ee);
    let te = ee[q.id];
    te === void 0 && (te = {}, ee[q.id] = te);
    let ie = te[z];
    return ie === void 0 && (ie = d(c()), te[z] = ie), ie;
  }
  function d(R) {
    const k = [], q = [], X = [];
    for (let z = 0; z < i; z++)
      k[z] = 0, q[z] = 0, X[z] = 0;
    return {
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: k,
      enabledAttributes: q,
      attributeDivisors: X,
      object: R,
      attributes: {},
      index: null
    };
  }
  function p(R, k, q, X) {
    const z = s.attributes, j = k.attributes;
    let O = 0;
    const ee = q.getAttributes();
    for (const te in ee) if (ee[te].location >= 0) {
      const ie = z[te];
      let de = j[te];
      if (de === void 0 && (te === "instanceMatrix" && R.instanceMatrix && (de = R.instanceMatrix), te === "instanceColor" && R.instanceColor && (de = R.instanceColor)), ie === void 0 || ie.attribute !== de || de && ie.data !== de.data) return !0;
      O++;
    }
    return s.attributesNum !== O || s.index !== X;
  }
  function g(R, k, q, X) {
    const z = {}, j = k.attributes;
    let O = 0;
    const ee = q.getAttributes();
    for (const te in ee) if (ee[te].location >= 0) {
      let ie = j[te];
      ie === void 0 && (te === "instanceMatrix" && R.instanceMatrix && (ie = R.instanceMatrix), te === "instanceColor" && R.instanceColor && (ie = R.instanceColor));
      const de = {};
      de.attribute = ie, ie && ie.data && (de.data = ie.data), z[te] = de, O++;
    }
    s.attributes = z, s.attributesNum = O, s.index = X;
  }
  function _() {
    const R = s.newAttributes;
    for (let k = 0, q = R.length; k < q; k++) R[k] = 0;
  }
  function m(R) {
    f(R, 0);
  }
  function f(R, k) {
    const q = s.newAttributes, X = s.enabledAttributes, z = s.attributeDivisors;
    q[R] = 1, X[R] === 0 && (e.enableVertexAttribArray(R), X[R] = 1), z[R] !== k && (e.vertexAttribDivisor(R, k), z[R] = k);
  }
  function T() {
    const R = s.newAttributes, k = s.enabledAttributes;
    for (let q = 0, X = k.length; q < X; q++) k[q] !== R[q] && (e.disableVertexAttribArray(q), k[q] = 0);
  }
  function A(R, k, q, X, z, j, O) {
    O === !0 ? e.vertexAttribIPointer(R, k, q, z, j) : e.vertexAttribPointer(R, k, q, X, z, j);
  }
  function M(R, k, q, X) {
    _();
    const z = X.attributes, j = q.getAttributes(), O = k.defaultAttributeValues;
    for (const ee in j) {
      const te = j[ee];
      if (te.location >= 0) {
        let ie = z[ee];
        if (ie === void 0 && (ee === "instanceMatrix" && R.instanceMatrix && (ie = R.instanceMatrix), ee === "instanceColor" && R.instanceColor && (ie = R.instanceColor)), ie !== void 0) {
          const de = ie.normalized, Se = ie.itemSize, Qe = t.get(ie);
          if (Qe === void 0) continue;
          const je = Qe.buffer, P = Qe.type, K = Qe.bytesPerElement, ae = P === e.INT || P === e.UNSIGNED_INT || ie.gpuType === 1013;
          if (ie.isInterleavedBufferAttribute) {
            const ue = ie.data, Ae = ue.stride, Ce = ie.offset;
            if (ue.isInstancedInterleavedBuffer) {
              for (let Le = 0; Le < te.locationSize; Le++) f(te.location + Le, ue.meshPerAttribute);
              R.isInstancedMesh !== !0 && X._maxInstanceCount === void 0 && (X._maxInstanceCount = ue.meshPerAttribute * ue.count);
            } else for (let Le = 0; Le < te.locationSize; Le++) m(te.location + Le);
            e.bindBuffer(e.ARRAY_BUFFER, je);
            for (let Le = 0; Le < te.locationSize; Le++) A(te.location + Le, Se / te.locationSize, P, de, Ae * K, (Ce + Se / te.locationSize * Le) * K, ae);
          } else {
            if (ie.isInstancedBufferAttribute) {
              for (let ue = 0; ue < te.locationSize; ue++) f(te.location + ue, ie.meshPerAttribute);
              R.isInstancedMesh !== !0 && X._maxInstanceCount === void 0 && (X._maxInstanceCount = ie.meshPerAttribute * ie.count);
            } else for (let ue = 0; ue < te.locationSize; ue++) m(te.location + ue);
            e.bindBuffer(e.ARRAY_BUFFER, je);
            for (let ue = 0; ue < te.locationSize; ue++) A(te.location + ue, Se / te.locationSize, P, de, Se * K, Se / te.locationSize * ue * K, ae);
          }
        } else if (O !== void 0) {
          const de = O[ee];
          if (de !== void 0) switch (de.length) {
            case 2:
              e.vertexAttrib2fv(te.location, de);
              break;
            case 3:
              e.vertexAttrib3fv(te.location, de);
              break;
            case 4:
              e.vertexAttrib4fv(te.location, de);
              break;
            default:
              e.vertexAttrib1fv(te.location, de);
          }
        }
      }
    }
    T();
  }
  function E() {
    y();
    for (const R in n) {
      const k = n[R];
      for (const q in k) {
        const X = k[q];
        for (const z in X) {
          const j = X[z];
          for (const O in j)
            h(j[O].object), delete j[O];
          delete X[z];
        }
      }
      delete n[R];
    }
  }
  function w(R) {
    if (n[R.id] === void 0) return;
    const k = n[R.id];
    for (const q in k) {
      const X = k[q];
      for (const z in X) {
        const j = X[z];
        for (const O in j)
          h(j[O].object), delete j[O];
        delete X[z];
      }
    }
    delete n[R.id];
  }
  function C(R) {
    for (const k in n) {
      const q = n[k];
      for (const X in q) {
        const z = q[X];
        if (z[R.id] === void 0) continue;
        const j = z[R.id];
        for (const O in j)
          h(j[O].object), delete j[O];
        delete z[R.id];
      }
    }
  }
  function v(R) {
    for (const k in n) {
      const q = n[k], X = R.isInstancedMesh === !0 ? R.id : 0, z = q[X];
      if (z !== void 0) {
        for (const j in z) {
          const O = z[j];
          for (const ee in O)
            h(O[ee].object), delete O[ee];
          delete z[j];
        }
        delete q[X], Object.keys(q).length === 0 && delete n[k];
      }
    }
  }
  function y() {
    V(), a = !0, s !== r && (s = r, l(s.object));
  }
  function V() {
    r.geometry = null, r.program = null, r.wireframe = !1;
  }
  return {
    setup: o,
    reset: y,
    resetDefaultState: V,
    dispose: E,
    releaseStatesOfGeometry: w,
    releaseStatesOfObject: v,
    releaseStatesOfProgram: C,
    initAttributes: _,
    enableAttribute: m,
    disableUnusedAttributes: T
  };
}
function zd(e, t, i) {
  let n;
  function r(c) {
    n = c;
  }
  function s(c, l) {
    e.drawArrays(n, c, l), i.update(l, n, 1);
  }
  function a(c, l, h) {
    h !== 0 && (e.drawArraysInstanced(n, c, l, h), i.update(l, n, h));
  }
  function o(c, l, h) {
    if (h === 0) return;
    t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, l, 0, h);
    let u = 0;
    for (let d = 0; d < h; d++) u += l[d];
    i.update(u, n, 1);
  }
  this.setMode = r, this.render = s, this.renderInstances = a, this.renderMultiDraw = o;
}
function Vd(e, t, i, n) {
  let r;
  function s() {
    if (r !== void 0) return r;
    if (t.has("EXT_texture_filter_anisotropic") === !0) {
      const C = t.get("EXT_texture_filter_anisotropic");
      r = e.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else r = 0;
    return r;
  }
  function a(C) {
    return !(C !== 1023 && n.convert(C) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(C) {
    const v = C === 1016 && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(C !== 1009 && n.convert(C) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE) && C !== 1015 && !v);
  }
  function c(C) {
    if (C === "highp") {
      if (e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision > 0) return "highp";
      C = "mediump";
    }
    return C === "mediump" && e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let l = i.precision !== void 0 ? i.precision : "highp";
  const h = c(l);
  h !== l && (xe("WebGLRenderer:", l, "not supported, using", h, "instead."), l = h);
  const u = i.logarithmicDepthBuffer === !0, d = i.reversedDepthBuffer === !0 && t.has("EXT_clip_control");
  i.reversedDepthBuffer === !0 && d === !1 && xe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");
  const p = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), g = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _ = e.getParameter(e.MAX_TEXTURE_SIZE), m = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE), f = e.getParameter(e.MAX_VERTEX_ATTRIBS), T = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS), A = e.getParameter(e.MAX_VARYING_VECTORS), M = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS), E = e.getParameter(e.MAX_SAMPLES), w = e.getParameter(e.SAMPLES);
  return {
    isWebGL2: !0,
    getMaxAnisotropy: s,
    getMaxPrecision: c,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: l,
    logarithmicDepthBuffer: u,
    reversedDepthBuffer: d,
    maxTextures: p,
    maxVertexTextures: g,
    maxTextureSize: _,
    maxCubemapSize: m,
    maxAttributes: f,
    maxVertexUniforms: T,
    maxVaryings: A,
    maxFragmentUniforms: M,
    maxSamples: E,
    samples: w
  };
}
function Hd(e) {
  const t = this;
  let i = null, n = 0, r = !1, s = !1;
  const a = new Wi(), o = new Ie(), c = {
    value: null,
    needsUpdate: !1
  };
  this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(u, d) {
    const p = u.length !== 0 || d || n !== 0 || r;
    return r = d, n = u.length, p;
  }, this.beginShadows = function() {
    s = !0, h(null);
  }, this.endShadows = function() {
    s = !1;
  }, this.setGlobalState = function(u, d) {
    i = h(u, d, 0);
  }, this.setState = function(u, d, p) {
    const g = u.clippingPlanes, _ = u.clipIntersection, m = u.clipShadows, f = e.get(u);
    if (!r || g === null || g.length === 0 || s && !m)
      s ? h(null) : l();
    else {
      const T = s ? 0 : n, A = T * 4;
      let M = f.clippingState || null;
      c.value = M, M = h(g, d, A, p);
      for (let E = 0; E !== A; ++E) M[E] = i[E];
      f.clippingState = M, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += T;
    }
  };
  function l() {
    c.value !== i && (c.value = i, c.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
  }
  function h(u, d, p, g) {
    const _ = u !== null ? u.length : 0;
    let m = null;
    if (_ !== 0) {
      if (m = c.value, g !== !0 || m === null) {
        const f = p + _ * 4, T = d.matrixWorldInverse;
        o.getNormalMatrix(T), (m === null || m.length < f) && (m = new Float32Array(f));
        for (let A = 0, M = p; A !== _; ++A, M += 4)
          a.copy(u[A]).applyMatrix4(T, o), a.normal.toArray(m, M), m[M + 3] = a.constant;
      }
      c.value = m, c.needsUpdate = !0;
    }
    return t.numPlanes = _, t.numIntersection = 0, m;
  }
}
var Ni = 4, oo = [
  0.125,
  0.215,
  0.35,
  0.446,
  0.526,
  0.582
], vn = 20, Wd = 256, Hn = /* @__PURE__ */ new Zr(), co = /* @__PURE__ */ new Te(), Ds = null, Is = 0, Ns = 0, Us = !1, qd = /* @__PURE__ */ new U(), Ks = class {
  constructor(e) {
    this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._sizeLods = [], this._sigmas = [], this._lodMeshes = [], this._backgroundBox = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._blurMaterial = null, this._ggxMaterial = null;
  }
  fromScene(e, t = 0, i = 0.1, n = 100, r = {}) {
    const { size: s = 256, position: a = qd } = r;
    Ds = this._renderer.getRenderTarget(), Is = this._renderer.getActiveCubeFace(), Ns = this._renderer.getActiveMipmapLevel(), Us = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(s);
    const o = this._allocateTargets();
    return o.depthBuffer = !0, this._sceneToCubeUV(e, i, n, o, a), t > 0 && this._blur(o, 0, 0, t), this._applyPMREM(o), this._cleanup(o), o;
  }
  fromEquirectangular(e, t = null) {
    return this._fromTexture(e, t);
  }
  fromCubemap(e, t = null) {
    return this._fromTexture(e, t);
  }
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = uo(), this._compileMaterial(this._cubemapMaterial));
  }
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = ho(), this._compileMaterial(this._equirectMaterial));
  }
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose(), this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose());
  }
  _setSize(e) {
    this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._ggxMaterial !== null && this._ggxMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let e = 0; e < this._lodMeshes.length; e++) this._lodMeshes[e].geometry.dispose();
  }
  _cleanup(e) {
    this._renderer.setRenderTarget(Ds, Is, Ns), this._renderer.xr.enabled = Us, e.scissorTest = !1, fn(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e, t) {
    e.mapping === 301 || e.mapping === 302 ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Ds = this._renderer.getRenderTarget(), Is = this._renderer.getActiveCubeFace(), Ns = this._renderer.getActiveMipmapLevel(), Us = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const i = t || this._allocateTargets();
    return this._textureToCubeUV(e, i), this._applyPMREM(i), this._cleanup(i), i;
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, i = {
      magFilter: Lt,
      minFilter: Lt,
      generateMipmaps: !1,
      type: ji,
      format: xn,
      colorSpace: Zt,
      depthBuffer: !1
    }, n = lo(e, t, i);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = lo(e, t, i);
      const { _lodMax: r } = this;
      ({ lodMeshes: this._lodMeshes, sizeLods: this._sizeLods, sigmas: this._sigmas } = Xd(r)), this._blurMaterial = jd(r, e, t), this._ggxMaterial = Kd(r, e, t);
    }
    return n;
  }
  _compileMaterial(e) {
    const t = new At(new Wt(), e);
    this._renderer.compile(t, Hn);
  }
  _sceneToCubeUV(e, t, i, n, r) {
    const s = new Pt(90, 1, t, i), a = [
      1,
      -1,
      1,
      1,
      1,
      1
    ], o = [
      1,
      1,
      1,
      -1,
      -1,
      -1
    ], c = this._renderer, l = c.autoClear, h = c.toneMapping;
    c.getClearColor(co), c.toneMapping = 0, c.autoClear = !1, c.state.buffers.depth.getReversed() && (c.setRenderTarget(n), c.clearDepth(), c.setRenderTarget(null)), this._backgroundBox === null && (this._backgroundBox = new At(new Yr(), new Jt({
      name: "PMREM.Background",
      side: 1,
      depthWrite: !1,
      depthTest: !1
    })));
    const u = this._backgroundBox, d = u.material;
    let p = !1;
    const g = e.background;
    g ? g.isColor && (d.color.copy(g), e.background = null, p = !0) : (d.color.copy(co), p = !0);
    for (let _ = 0; _ < 6; _++) {
      const m = _ % 3;
      m === 0 ? (s.up.set(0, a[_], 0), s.position.set(r.x, r.y, r.z), s.lookAt(r.x + o[_], r.y, r.z)) : m === 1 ? (s.up.set(0, 0, a[_]), s.position.set(r.x, r.y, r.z), s.lookAt(r.x, r.y + o[_], r.z)) : (s.up.set(0, a[_], 0), s.position.set(r.x, r.y, r.z), s.lookAt(r.x, r.y, r.z + o[_]));
      const f = this._cubeSize;
      fn(n, m * f, _ > 2 ? f : 0, f, f), c.setRenderTarget(n), p && c.render(u, s), c.render(e, s);
    }
    c.toneMapping = h, c.autoClear = l, e.background = g;
  }
  _textureToCubeUV(e, t) {
    const i = this._renderer, n = e.mapping === 301 || e.mapping === 302;
    n ? (this._cubemapMaterial === null && (this._cubemapMaterial = uo()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = ho());
    const r = n ? this._cubemapMaterial : this._equirectMaterial, s = this._lodMeshes[0];
    s.material = r;
    const a = r.uniforms;
    a.envMap.value = e;
    const o = this._cubeSize;
    fn(t, 0, 0, 3 * o, 2 * o), i.setRenderTarget(t), i.render(s, Hn);
  }
  _applyPMREM(e) {
    const t = this._renderer, i = t.autoClear;
    t.autoClear = !1;
    const n = this._lodMeshes.length;
    for (let r = 1; r < n; r++) this._applyGGXFilter(e, r - 1, r);
    t.autoClear = i;
  }
  _applyGGXFilter(e, t, i) {
    const n = this._renderer, r = this._pingPongRenderTarget, s = this._ggxMaterial, a = this._lodMeshes[i];
    a.material = s;
    const o = s.uniforms, c = i / (this._lodMeshes.length - 1), l = t / (this._lodMeshes.length - 1), h = Math.sqrt(c * c - l * l) * (0 + c * 1.25), { _lodMax: u } = this, d = this._sizeLods[i], p = 3 * d * (i > u - Ni ? i - u + Ni : 0), g = 4 * (this._cubeSize - d);
    o.envMap.value = e.texture, o.roughness.value = h, o.mipInt.value = u - t, fn(r, p, g, 3 * d, 2 * d), n.setRenderTarget(r), n.render(a, Hn), o.envMap.value = r.texture, o.roughness.value = 0, o.mipInt.value = u - i, fn(e, p, g, 3 * d, 2 * d), n.setRenderTarget(e), n.render(a, Hn);
  }
  _blur(e, t, i, n, r) {
    const s = this._pingPongRenderTarget;
    this._halfBlur(e, s, t, i, n, "latitudinal", r), this._halfBlur(s, e, i, i, n, "longitudinal", r);
  }
  _halfBlur(e, t, i, n, r, s, a) {
    const o = this._renderer, c = this._blurMaterial;
    s !== "latitudinal" && s !== "longitudinal" && Re("blur direction must be either latitudinal or longitudinal!");
    const l = 3, h = this._lodMeshes[n];
    h.material = c;
    const u = c.uniforms, d = this._sizeLods[i] - 1, p = isFinite(r) ? Math.PI / (2 * d) : 2 * Math.PI / 39, g = r / p, _ = isFinite(r) ? 1 + Math.floor(l * g) : vn;
    _ > vn && xe(`sigmaRadians, ${r}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${vn}`);
    const m = [];
    let f = 0;
    for (let M = 0; M < vn; ++M) {
      const E = M / g, w = Math.exp(-E * E / 2);
      m.push(w), M === 0 ? f += w : M < _ && (f += 2 * w);
    }
    for (let M = 0; M < m.length; M++) m[M] = m[M] / f;
    u.envMap.value = e.texture, u.samples.value = _, u.weights.value = m, u.latitudinal.value = s === "latitudinal", a && (u.poleAxis.value = a);
    const { _lodMax: T } = this;
    u.dTheta.value = p, u.mipInt.value = T - i;
    const A = this._sizeLods[n];
    fn(t, 3 * A * (n > T - Ni ? n - T + Ni : 0), 4 * (this._cubeSize - A), 3 * A, 2 * A), o.setRenderTarget(t), o.render(h, Hn);
  }
};
function Xd(e) {
  const t = [], i = [], n = [];
  let r = e;
  const s = e - Ni + 1 + oo.length;
  for (let a = 0; a < s; a++) {
    const o = Math.pow(2, r);
    t.push(o);
    let c = 1 / o;
    a > e - Ni ? c = oo[a - e + Ni - 1] : a === 0 && (c = 0), i.push(c);
    const l = 1 / (o - 2), h = -l, u = 1 + l, d = [
      h,
      h,
      u,
      h,
      u,
      u,
      h,
      h,
      u,
      u,
      h,
      u
    ], p = 6, g = 3, _ = 2, m = 1, f = /* @__PURE__ */ new Float32Array(108), T = /* @__PURE__ */ new Float32Array(72), A = /* @__PURE__ */ new Float32Array(36);
    for (let E = 0; E < p; E++) {
      const w = E % 3 * 2 / 3 - 1, C = E > 2 ? 0 : -1, v = [
        w,
        C,
        0,
        w + 2 / 3,
        C,
        0,
        w + 2 / 3,
        C + 1,
        0,
        w,
        C,
        0,
        w + 2 / 3,
        C + 1,
        0,
        w,
        C + 1,
        0
      ];
      f.set(v, 18 * E), T.set(d, 12 * E);
      const y = [
        E,
        E,
        E,
        E,
        E,
        E
      ];
      A.set(y, 6 * E);
    }
    const M = new Wt();
    M.setAttribute("position", new Tt(f, g)), M.setAttribute("uv", new Tt(T, _)), M.setAttribute("faceIndex", new Tt(A, m)), n.push(new At(M, null)), r > Ni && r--;
  }
  return {
    lodMeshes: n,
    sizeLods: t,
    sigmas: i
  };
}
function lo(e, t, i) {
  const n = new oi(e, t, i);
  return n.texture.mapping = 306, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function fn(e, t, i, n, r) {
  e.viewport.set(t, i, n, r), e.scissor.set(t, i, n, r);
}
function Kd(e, t, i) {
  return new li({
    name: "PMREMGGXConvolution",
    defines: {
      GGX_SAMPLES: Wd,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / i,
      CUBEUV_MAX_MIP: `${e}.0`
    },
    uniforms: {
      envMap: { value: null },
      roughness: { value: 0 },
      mipInt: { value: 0 }
    },
    vertexShader: Qr(),
    fragmentShader: `

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function jd(e, t, i) {
  const n = new Float32Array(vn), r = new U(0, 1, 0);
  return new li({
    name: "SphericalGaussianBlur",
    defines: {
      n: vn,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / i,
      CUBEUV_MAX_MIP: `${e}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: r }
    },
    vertexShader: Qr(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function ho() {
  return new li({
    name: "EquirectangularToCubeUV",
    uniforms: { envMap: { value: null } },
    vertexShader: Qr(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function uo() {
  return new li({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: Qr(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function Qr() {
  return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
var Oc = class extends oi {
  constructor(e = 1, t = {}) {
    super(e, e, t), this.isWebGLCubeRenderTarget = !0;
    const i = {
      width: e,
      height: e,
      depth: 1
    }, n = [
      i,
      i,
      i,
      i,
      i,
      i
    ];
    this.texture = new yc(n), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
  }
  fromEquirectangularTexture(e, t) {
    this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
    const i = {
      uniforms: { tEquirect: { value: null } },
      vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
      fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
    }, n = new Yr(5, 5, 5), r = new li({
      name: "CubemapFromEquirect",
      uniforms: An(i.uniforms),
      vertexShader: i.vertexShader,
      fragmentShader: i.fragmentShader,
      side: 1,
      blending: 0
    });
    r.uniforms.tEquirect.value = t;
    const s = new At(n, r), a = t.minFilter;
    return t.minFilter === 1008 && (t.minFilter = Lt), new xd(1, 10, this).update(e, s), t.minFilter = a, s.geometry.dispose(), s.material.dispose(), this;
  }
  clear(e, t = !0, i = !0, n = !0) {
    const r = e.getRenderTarget();
    for (let s = 0; s < 6; s++)
      e.setRenderTarget(this, s), e.clear(t, i, n);
    e.setRenderTarget(r);
  }
};
function Yd(e) {
  let t = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), n = null;
  function r(d, p = !1) {
    return d == null ? null : p ? a(d) : s(d);
  }
  function s(d) {
    if (d && d.isTexture) {
      const p = d.mapping;
      if (p === 303 || p === 304)
        if (t.has(d)) {
          const g = t.get(d).texture;
          return o(g, d.mapping);
        } else {
          const g = d.image;
          if (g && g.height > 0) {
            const _ = new Oc(g.height);
            return _.fromEquirectangularTexture(e, d), t.set(d, _), d.addEventListener("dispose", l), o(_.texture, d.mapping);
          } else return null;
        }
    }
    return d;
  }
  function a(d) {
    if (d && d.isTexture) {
      const p = d.mapping, g = p === 303 || p === 304, _ = p === 301 || p === 302;
      if (g || _) {
        let m = i.get(d);
        const f = m !== void 0 ? m.texture.pmremVersion : 0;
        if (d.isRenderTargetTexture && d.pmremVersion !== f)
          return n === null && (n = new Ks(e)), m = g ? n.fromEquirectangular(d, m) : n.fromCubemap(d, m), m.texture.pmremVersion = d.pmremVersion, i.set(d, m), m.texture;
        if (m !== void 0) return m.texture;
        {
          const T = d.image;
          return g && T && T.height > 0 || _ && T && c(T) ? (n === null && (n = new Ks(e)), m = g ? n.fromEquirectangular(d) : n.fromCubemap(d), m.texture.pmremVersion = d.pmremVersion, i.set(d, m), d.addEventListener("dispose", h), m.texture) : null;
        }
      }
    }
    return d;
  }
  function o(d, p) {
    return p === 303 ? d.mapping = 301 : p === 304 && (d.mapping = 302), d;
  }
  function c(d) {
    let p = 0;
    const g = 6;
    for (let _ = 0; _ < g; _++) d[_] !== void 0 && p++;
    return p === g;
  }
  function l(d) {
    const p = d.target;
    p.removeEventListener("dispose", l);
    const g = t.get(p);
    g !== void 0 && (t.delete(p), g.dispose());
  }
  function h(d) {
    const p = d.target;
    p.removeEventListener("dispose", h);
    const g = i.get(p);
    g !== void 0 && (i.delete(p), g.dispose());
  }
  function u() {
    t = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), n !== null && (n.dispose(), n = null);
  }
  return {
    get: r,
    dispose: u
  };
}
function Jd(e) {
  const t = {};
  function i(n) {
    if (t[n] !== void 0) return t[n];
    const r = e.getExtension(n);
    return t[n] = r, r;
  }
  return {
    has: function(n) {
      return i(n) !== null;
    },
    init: function() {
      i("EXT_color_buffer_float"), i("WEBGL_clip_cull_distance"), i("OES_texture_float_linear"), i("EXT_color_buffer_half_float"), i("WEBGL_multisampled_render_to_texture"), i("WEBGL_render_shared_exponent");
    },
    get: function(n) {
      const r = i(n);
      return r === null && bn("WebGLRenderer: " + n + " extension not supported."), r;
    }
  };
}
function $d(e, t, i, n) {
  const r = {}, s = /* @__PURE__ */ new WeakMap();
  function a(u) {
    const d = u.target;
    d.index !== null && t.remove(d.index);
    for (const g in d.attributes) t.remove(d.attributes[g]);
    d.removeEventListener("dispose", a), delete r[d.id];
    const p = s.get(d);
    p && (t.remove(p), s.delete(d)), n.releaseStatesOfGeometry(d), d.isInstancedBufferGeometry === !0 && delete d._maxInstanceCount, i.memory.geometries--;
  }
  function o(u, d) {
    return r[d.id] === !0 || (d.addEventListener("dispose", a), r[d.id] = !0, i.memory.geometries++), d;
  }
  function c(u) {
    const d = u.attributes;
    for (const p in d) t.update(d[p], e.ARRAY_BUFFER);
  }
  function l(u) {
    const d = [], p = u.index, g = u.attributes.position;
    let _ = 0;
    if (g === void 0) return;
    if (p !== null) {
      const T = p.array;
      _ = p.version;
      for (let A = 0, M = T.length; A < M; A += 3) {
        const E = T[A + 0], w = T[A + 1], C = T[A + 2];
        d.push(E, w, w, C, C, E);
      }
    } else {
      const T = g.array;
      _ = g.version;
      for (let A = 0, M = T.length / 3 - 1; A < M; A += 3) {
        const E = A + 0, w = A + 1, C = A + 2;
        d.push(E, w, w, C, C, E);
      }
    }
    const m = new (g.count >= 65535 ? gc : mc)(d, 1);
    m.version = _;
    const f = s.get(u);
    f && t.remove(f), s.set(u, m);
  }
  function h(u) {
    const d = s.get(u);
    if (d) {
      const p = u.index;
      p !== null && d.version < p.version && l(u);
    } else l(u);
    return s.get(u);
  }
  return {
    get: o,
    update: c,
    getWireframeAttribute: h
  };
}
function Zd(e, t, i) {
  let n;
  function r(u) {
    n = u;
  }
  let s, a;
  function o(u) {
    s = u.type, a = u.bytesPerElement;
  }
  function c(u, d) {
    e.drawElements(n, d, s, u * a), i.update(d, n, 1);
  }
  function l(u, d, p) {
    p !== 0 && (e.drawElementsInstanced(n, d, s, u * a, p), i.update(d, n, p));
  }
  function h(u, d, p) {
    if (p === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, d, 0, s, u, 0, p);
    let g = 0;
    for (let _ = 0; _ < p; _++) g += d[_];
    i.update(g, n, 1);
  }
  this.setMode = r, this.setIndex = o, this.render = c, this.renderInstances = l, this.renderMultiDraw = h;
}
function Qd(e) {
  const t = {
    geometries: 0,
    textures: 0
  }, i = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(s, a, o) {
    switch (i.calls++, a) {
      case e.TRIANGLES:
        i.triangles += o * (s / 3);
        break;
      case e.LINES:
        i.lines += o * (s / 2);
        break;
      case e.LINE_STRIP:
        i.lines += o * (s - 1);
        break;
      case e.LINE_LOOP:
        i.lines += o * s;
        break;
      case e.POINTS:
        i.points += o * s;
        break;
      default:
        Re("WebGLInfo: Unknown draw mode:", a);
    }
  }
  function r() {
    i.calls = 0, i.triangles = 0, i.points = 0, i.lines = 0;
  }
  return {
    memory: t,
    render: i,
    programs: null,
    autoReset: !0,
    reset: r,
    update: n
  };
}
function eu(e, t, i) {
  const n = /* @__PURE__ */ new WeakMap(), r = new Ze();
  function s(a, o, c) {
    const l = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = h !== void 0 ? h.length : 0;
    let d = n.get(o);
    if (d === void 0 || d.count !== u) {
      let V = function() {
        v.dispose(), n.delete(o), o.removeEventListener("dispose", V);
      };
      var p = V;
      d !== void 0 && d.texture.dispose();
      const g = o.morphAttributes.position !== void 0, _ = o.morphAttributes.normal !== void 0, m = o.morphAttributes.color !== void 0, f = o.morphAttributes.position || [], T = o.morphAttributes.normal || [], A = o.morphAttributes.color || [];
      let M = 0;
      g === !0 && (M = 1), _ === !0 && (M = 2), m === !0 && (M = 3);
      let E = o.attributes.position.count * M, w = 1;
      E > t.maxTextureSize && (w = Math.ceil(E / t.maxTextureSize), E = t.maxTextureSize);
      const C = new Float32Array(E * w * 4 * u), v = new lc(C, E, w, u);
      v.type = wn, v.needsUpdate = !0;
      const y = M * 4;
      for (let R = 0; R < u; R++) {
        const k = f[R], q = T[R], X = A[R], z = E * w * 4 * R;
        for (let j = 0; j < k.count; j++) {
          const O = j * y;
          g === !0 && (r.fromBufferAttribute(k, j), C[z + O + 0] = r.x, C[z + O + 1] = r.y, C[z + O + 2] = r.z, C[z + O + 3] = 0), _ === !0 && (r.fromBufferAttribute(q, j), C[z + O + 4] = r.x, C[z + O + 5] = r.y, C[z + O + 6] = r.z, C[z + O + 7] = 0), m === !0 && (r.fromBufferAttribute(X, j), C[z + O + 8] = r.x, C[z + O + 9] = r.y, C[z + O + 10] = r.z, C[z + O + 11] = X.itemSize === 4 ? r.w : 1);
        }
      }
      d = {
        count: u,
        texture: v,
        size: new Fe(E, w)
      }, n.set(o, d), o.addEventListener("dispose", V);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null) c.getUniforms().setValue(e, "morphTexture", a.morphTexture, i);
    else {
      let g = 0;
      for (let m = 0; m < l.length; m++) g += l[m];
      const _ = o.morphTargetsRelative ? 1 : 1 - g;
      c.getUniforms().setValue(e, "morphTargetBaseInfluence", _), c.getUniforms().setValue(e, "morphTargetInfluences", l);
    }
    c.getUniforms().setValue(e, "morphTargetsTexture", d.texture, i), c.getUniforms().setValue(e, "morphTargetsTextureSize", d.size);
  }
  return { update: s };
}
function tu(e, t, i, n, r) {
  let s = /* @__PURE__ */ new WeakMap();
  function a(l) {
    const h = r.render.frame, u = l.geometry, d = t.get(l, u);
    if (s.get(d) !== h && (t.update(d), s.set(d, h)), l.isInstancedMesh && (l.hasEventListener("dispose", c) === !1 && l.addEventListener("dispose", c), s.get(l) !== h && (i.update(l.instanceMatrix, e.ARRAY_BUFFER), l.instanceColor !== null && i.update(l.instanceColor, e.ARRAY_BUFFER), s.set(l, h))), l.isSkinnedMesh) {
      const p = l.skeleton;
      s.get(p) !== h && (p.update(), s.set(p, h));
    }
    return d;
  }
  function o() {
    s = /* @__PURE__ */ new WeakMap();
  }
  function c(l) {
    const h = l.target;
    h.removeEventListener("dispose", c), n.releaseStatesOfObject(h), i.remove(h.instanceMatrix), h.instanceColor !== null && i.remove(h.instanceColor);
  }
  return {
    update: a,
    dispose: o
  };
}
var iu = {
  1: "LINEAR_TONE_MAPPING",
  2: "REINHARD_TONE_MAPPING",
  3: "CINEON_TONE_MAPPING",
  4: "ACES_FILMIC_TONE_MAPPING",
  6: "AGX_TONE_MAPPING",
  7: "NEUTRAL_TONE_MAPPING",
  5: "CUSTOM_TONE_MAPPING"
};
function nu(e, t, i, n, r, s) {
  const a = new oi(t, i, {
    type: e,
    depthBuffer: r,
    stencilBuffer: s,
    samples: n ? 4 : 0,
    depthTexture: r ? new Tn(t, i) : void 0
  }), o = new oi(t, i, {
    type: ji,
    depthBuffer: !1,
    stencilBuffer: !1
  }), c = new Wt();
  c.setAttribute("position", new Ut([
    -1,
    3,
    0,
    -1,
    -1,
    0,
    3,
    -1,
    0
  ], 3)), c.setAttribute("uv", new Ut([
    0,
    2,
    0,
    0,
    2,
    0
  ], 2));
  const l = new Qh({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: `
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
    fragmentShader: `
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,
    depthTest: !1,
    depthWrite: !1
  }), h = new At(c, l), u = new Zr(-1, 1, 1, -1, 0, 1);
  let d = null, p = null, g = !1, _, m = null, f = [], T = !1;
  this.setSize = function(A, M) {
    a.setSize(A, M), o.setSize(A, M);
    for (let E = 0; E < f.length; E++) {
      const w = f[E];
      w.setSize && w.setSize(A, M);
    }
  }, this.setEffects = function(A) {
    f = A, T = f.length > 0 && f[0].isRenderPass === !0;
    const M = a.width, E = a.height;
    for (let w = 0; w < f.length; w++) {
      const C = f[w];
      C.setSize && C.setSize(M, E);
    }
  }, this.begin = function(A, M) {
    if (g || A.toneMapping === 0 && f.length === 0) return !1;
    if (m = M, M !== null) {
      const E = M.width, w = M.height;
      (a.width !== E || a.height !== w) && this.setSize(E, w);
    }
    return T === !1 && A.setRenderTarget(a), _ = A.toneMapping, A.toneMapping = 0, !0;
  }, this.hasRenderPass = function() {
    return T;
  }, this.end = function(A, M) {
    A.toneMapping = _, g = !0;
    let E = a, w = o;
    for (let C = 0; C < f.length; C++) {
      const v = f[C];
      if (v.enabled !== !1 && (v.render(A, w, E, M), v.needsSwap !== !1)) {
        const y = E;
        E = w, w = y;
      }
    }
    if (d !== A.outputColorSpace || p !== A.toneMapping) {
      d = A.outputColorSpace, p = A.toneMapping, l.defines = {}, Ge.getTransfer(d) === "srgb" && (l.defines.SRGB_TRANSFER = "");
      const C = iu[p];
      C && (l.defines[C] = ""), l.needsUpdate = !0;
    }
    l.uniforms.tDiffuse.value = E.texture, A.setRenderTarget(m), A.render(h, u), m = null, g = !1;
  }, this.isCompositing = function() {
    return g;
  }, this.dispose = function() {
    a.depthTexture && a.depthTexture.dispose(), a.dispose(), o.dispose(), c.dispose(), l.dispose();
  };
}
var kc = /* @__PURE__ */ new Dt(), js = /* @__PURE__ */ new Tn(1, 1), Bc = /* @__PURE__ */ new lc(), Gc = /* @__PURE__ */ new Mh(), zc = /* @__PURE__ */ new yc(), fo = [], po = [], mo = /* @__PURE__ */ new Float32Array(16), go = /* @__PURE__ */ new Float32Array(9), vo = /* @__PURE__ */ new Float32Array(4);
function Dn(e, t, i) {
  const n = e[0];
  if (n <= 0 || n > 0) return e;
  const r = t * i;
  let s = fo[r];
  if (s === void 0 && (s = new Float32Array(r), fo[r] = s), t !== 0) {
    n.toArray(s, 0);
    for (let a = 1, o = 0; a !== t; ++a)
      o += i, e[a].toArray(s, o);
  }
  return s;
}
function ft(e, t) {
  if (e.length !== t.length) return !1;
  for (let i = 0, n = e.length; i < n; i++) if (e[i] !== t[i]) return !1;
  return !0;
}
function pt(e, t) {
  for (let i = 0, n = t.length; i < n; i++) e[i] = t[i];
}
function es(e, t) {
  let i = po[t];
  i === void 0 && (i = new Int32Array(t), po[t] = i);
  for (let n = 0; n !== t; ++n) i[n] = e.allocateTextureUnit();
  return i;
}
function ru(e, t) {
  const i = this.cache;
  i[0] !== t && (e.uniform1f(this.addr, t), i[0] = t);
}
function su(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y) && (e.uniform2f(this.addr, t.x, t.y), i[0] = t.x, i[1] = t.y);
  else {
    if (ft(i, t)) return;
    e.uniform2fv(this.addr, t), pt(i, t);
  }
}
function au(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y || i[2] !== t.z) && (e.uniform3f(this.addr, t.x, t.y, t.z), i[0] = t.x, i[1] = t.y, i[2] = t.z);
  else if (t.r !== void 0)
    (i[0] !== t.r || i[1] !== t.g || i[2] !== t.b) && (e.uniform3f(this.addr, t.r, t.g, t.b), i[0] = t.r, i[1] = t.g, i[2] = t.b);
  else {
    if (ft(i, t)) return;
    e.uniform3fv(this.addr, t), pt(i, t);
  }
}
function ou(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y || i[2] !== t.z || i[3] !== t.w) && (e.uniform4f(this.addr, t.x, t.y, t.z, t.w), i[0] = t.x, i[1] = t.y, i[2] = t.z, i[3] = t.w);
  else {
    if (ft(i, t)) return;
    e.uniform4fv(this.addr, t), pt(i, t);
  }
}
function cu(e, t) {
  const i = this.cache, n = t.elements;
  if (n === void 0) {
    if (ft(i, t)) return;
    e.uniformMatrix2fv(this.addr, !1, t), pt(i, t);
  } else {
    if (ft(i, n)) return;
    vo.set(n), e.uniformMatrix2fv(this.addr, !1, vo), pt(i, n);
  }
}
function lu(e, t) {
  const i = this.cache, n = t.elements;
  if (n === void 0) {
    if (ft(i, t)) return;
    e.uniformMatrix3fv(this.addr, !1, t), pt(i, t);
  } else {
    if (ft(i, n)) return;
    go.set(n), e.uniformMatrix3fv(this.addr, !1, go), pt(i, n);
  }
}
function hu(e, t) {
  const i = this.cache, n = t.elements;
  if (n === void 0) {
    if (ft(i, t)) return;
    e.uniformMatrix4fv(this.addr, !1, t), pt(i, t);
  } else {
    if (ft(i, n)) return;
    mo.set(n), e.uniformMatrix4fv(this.addr, !1, mo), pt(i, n);
  }
}
function du(e, t) {
  const i = this.cache;
  i[0] !== t && (e.uniform1i(this.addr, t), i[0] = t);
}
function uu(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y) && (e.uniform2i(this.addr, t.x, t.y), i[0] = t.x, i[1] = t.y);
  else {
    if (ft(i, t)) return;
    e.uniform2iv(this.addr, t), pt(i, t);
  }
}
function fu(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y || i[2] !== t.z) && (e.uniform3i(this.addr, t.x, t.y, t.z), i[0] = t.x, i[1] = t.y, i[2] = t.z);
  else {
    if (ft(i, t)) return;
    e.uniform3iv(this.addr, t), pt(i, t);
  }
}
function pu(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y || i[2] !== t.z || i[3] !== t.w) && (e.uniform4i(this.addr, t.x, t.y, t.z, t.w), i[0] = t.x, i[1] = t.y, i[2] = t.z, i[3] = t.w);
  else {
    if (ft(i, t)) return;
    e.uniform4iv(this.addr, t), pt(i, t);
  }
}
function mu(e, t) {
  const i = this.cache;
  i[0] !== t && (e.uniform1ui(this.addr, t), i[0] = t);
}
function gu(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y) && (e.uniform2ui(this.addr, t.x, t.y), i[0] = t.x, i[1] = t.y);
  else {
    if (ft(i, t)) return;
    e.uniform2uiv(this.addr, t), pt(i, t);
  }
}
function vu(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y || i[2] !== t.z) && (e.uniform3ui(this.addr, t.x, t.y, t.z), i[0] = t.x, i[1] = t.y, i[2] = t.z);
  else {
    if (ft(i, t)) return;
    e.uniform3uiv(this.addr, t), pt(i, t);
  }
}
function bu(e, t) {
  const i = this.cache;
  if (t.x !== void 0)
    (i[0] !== t.x || i[1] !== t.y || i[2] !== t.z || i[3] !== t.w) && (e.uniform4ui(this.addr, t.x, t.y, t.z, t.w), i[0] = t.x, i[1] = t.y, i[2] = t.z, i[3] = t.w);
  else {
    if (ft(i, t)) return;
    e.uniform4uiv(this.addr, t), pt(i, t);
  }
}
function _u(e, t, i) {
  const n = this.cache, r = i.allocateTextureUnit();
  n[0] !== r && (e.uniform1i(this.addr, r), n[0] = r);
  let s;
  this.type === e.SAMPLER_2D_SHADOW ? (js.compareFunction = i.isReversedDepthBuffer() ? 518 : 515, s = js) : s = kc, i.setTexture2D(t || s, r);
}
function Mu(e, t, i) {
  const n = this.cache, r = i.allocateTextureUnit();
  n[0] !== r && (e.uniform1i(this.addr, r), n[0] = r), i.setTexture3D(t || Gc, r);
}
function xu(e, t, i) {
  const n = this.cache, r = i.allocateTextureUnit();
  n[0] !== r && (e.uniform1i(this.addr, r), n[0] = r), i.setTextureCube(t || zc, r);
}
function Su(e, t, i) {
  const n = this.cache, r = i.allocateTextureUnit();
  n[0] !== r && (e.uniform1i(this.addr, r), n[0] = r), i.setTexture2DArray(t || Bc, r);
}
function yu(e) {
  switch (e) {
    case 5126:
      return ru;
    case 35664:
      return su;
    case 35665:
      return au;
    case 35666:
      return ou;
    case 35674:
      return cu;
    case 35675:
      return lu;
    case 35676:
      return hu;
    case 5124:
    case 35670:
      return du;
    case 35667:
    case 35671:
      return uu;
    case 35668:
    case 35672:
      return fu;
    case 35669:
    case 35673:
      return pu;
    case 5125:
      return mu;
    case 36294:
      return gu;
    case 36295:
      return vu;
    case 36296:
      return bu;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return _u;
    case 35679:
    case 36299:
    case 36307:
      return Mu;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return xu;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Su;
  }
}
function Eu(e, t) {
  e.uniform1fv(this.addr, t);
}
function Tu(e, t) {
  const i = Dn(t, this.size, 2);
  e.uniform2fv(this.addr, i);
}
function Au(e, t) {
  const i = Dn(t, this.size, 3);
  e.uniform3fv(this.addr, i);
}
function wu(e, t) {
  const i = Dn(t, this.size, 4);
  e.uniform4fv(this.addr, i);
}
function Ru(e, t) {
  const i = Dn(t, this.size, 4);
  e.uniformMatrix2fv(this.addr, !1, i);
}
function Cu(e, t) {
  const i = Dn(t, this.size, 9);
  e.uniformMatrix3fv(this.addr, !1, i);
}
function Pu(e, t) {
  const i = Dn(t, this.size, 16);
  e.uniformMatrix4fv(this.addr, !1, i);
}
function Lu(e, t) {
  e.uniform1iv(this.addr, t);
}
function Du(e, t) {
  e.uniform2iv(this.addr, t);
}
function Iu(e, t) {
  e.uniform3iv(this.addr, t);
}
function Nu(e, t) {
  e.uniform4iv(this.addr, t);
}
function Uu(e, t) {
  e.uniform1uiv(this.addr, t);
}
function Fu(e, t) {
  e.uniform2uiv(this.addr, t);
}
function Ou(e, t) {
  e.uniform3uiv(this.addr, t);
}
function ku(e, t) {
  e.uniform4uiv(this.addr, t);
}
function Bu(e, t, i) {
  const n = this.cache, r = t.length, s = es(i, r);
  ft(n, s) || (e.uniform1iv(this.addr, s), pt(n, s));
  let a;
  this.type === e.SAMPLER_2D_SHADOW ? a = js : a = kc;
  for (let o = 0; o !== r; ++o) i.setTexture2D(t[o] || a, s[o]);
}
function Gu(e, t, i) {
  const n = this.cache, r = t.length, s = es(i, r);
  ft(n, s) || (e.uniform1iv(this.addr, s), pt(n, s));
  for (let a = 0; a !== r; ++a) i.setTexture3D(t[a] || Gc, s[a]);
}
function zu(e, t, i) {
  const n = this.cache, r = t.length, s = es(i, r);
  ft(n, s) || (e.uniform1iv(this.addr, s), pt(n, s));
  for (let a = 0; a !== r; ++a) i.setTextureCube(t[a] || zc, s[a]);
}
function Vu(e, t, i) {
  const n = this.cache, r = t.length, s = es(i, r);
  ft(n, s) || (e.uniform1iv(this.addr, s), pt(n, s));
  for (let a = 0; a !== r; ++a) i.setTexture2DArray(t[a] || Bc, s[a]);
}
function Hu(e) {
  switch (e) {
    case 5126:
      return Eu;
    case 35664:
      return Tu;
    case 35665:
      return Au;
    case 35666:
      return wu;
    case 35674:
      return Ru;
    case 35675:
      return Cu;
    case 35676:
      return Pu;
    case 5124:
    case 35670:
      return Lu;
    case 35667:
    case 35671:
      return Du;
    case 35668:
    case 35672:
      return Iu;
    case 35669:
    case 35673:
      return Nu;
    case 5125:
      return Uu;
    case 36294:
      return Fu;
    case 36295:
      return Ou;
    case 36296:
      return ku;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Bu;
    case 35679:
    case 36299:
    case 36307:
      return Gu;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return zu;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Vu;
  }
}
var Wu = class {
  constructor(e, t, i) {
    this.id = e, this.addr = i, this.cache = [], this.type = t.type, this.setValue = yu(t.type);
  }
}, qu = class {
  constructor(e, t, i) {
    this.id = e, this.addr = i, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = Hu(t.type);
  }
}, Xu = class {
  constructor(e) {
    this.id = e, this.seq = [], this.map = {};
  }
  setValue(e, t, i) {
    const n = this.seq;
    for (let r = 0, s = n.length; r !== s; ++r) {
      const a = n[r];
      a.setValue(e, t[a.id], i);
    }
  }
}, Fs = /(\w+)(\])?(\[|\.)?/g;
function bo(e, t) {
  e.seq.push(t), e.map[t.id] = t;
}
function Ku(e, t, i) {
  const n = e.name, r = n.length;
  for (Fs.lastIndex = 0; ; ) {
    const s = Fs.exec(n), a = Fs.lastIndex;
    let o = s[1];
    const c = s[2] === "]", l = s[3];
    if (c && (o = o | 0), l === void 0 || l === "[" && a + 2 === r) {
      bo(i, l === void 0 ? new Wu(o, e, t) : new qu(o, e, t));
      break;
    } else {
      let h = i.map[o];
      h === void 0 && (h = new Xu(o), bo(i, h)), i = h;
    }
  }
}
var kr = class {
  constructor(e, t) {
    this.seq = [], this.map = {};
    const i = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let s = 0; s < i; ++s) {
      const a = e.getActiveUniform(t, s);
      Ku(a, e.getUniformLocation(t, a.name), this);
    }
    const n = [], r = [];
    for (const s of this.seq) s.type === e.SAMPLER_2D_SHADOW || s.type === e.SAMPLER_CUBE_SHADOW || s.type === e.SAMPLER_2D_ARRAY_SHADOW ? n.push(s) : r.push(s);
    n.length > 0 && (this.seq = n.concat(r));
  }
  setValue(e, t, i, n) {
    const r = this.map[t];
    r !== void 0 && r.setValue(e, i, n);
  }
  setOptional(e, t, i) {
    const n = t[i];
    n !== void 0 && this.setValue(e, i, n);
  }
  static upload(e, t, i, n) {
    for (let r = 0, s = t.length; r !== s; ++r) {
      const a = t[r], o = i[a.id];
      o.needsUpdate !== !1 && a.setValue(e, o.value, n);
    }
  }
  static seqWithValue(e, t) {
    const i = [];
    for (let n = 0, r = e.length; n !== r; ++n) {
      const s = e[n];
      s.id in t && i.push(s);
    }
    return i;
  }
};
function _o(e, t, i) {
  const n = e.createShader(t);
  return e.shaderSource(n, i), e.compileShader(n), n;
}
var ju = 37297, Yu = 0;
function Ju(e, t) {
  const i = e.split(`
`), n = [], r = Math.max(t - 6, 0), s = Math.min(t + 6, i.length);
  for (let a = r; a < s; a++) {
    const o = a + 1;
    n.push(`${o === t ? ">" : " "} ${o}: ${i[a]}`);
  }
  return n.join(`
`);
}
var Mo = /* @__PURE__ */ new Ie();
function $u(e) {
  Ge._getMatrix(Mo, Ge.workingColorSpace, e);
  const t = `mat3( ${Mo.elements.map((i) => i.toFixed(4))} )`;
  switch (Ge.getTransfer(e)) {
    case Vr:
      return [t, "LinearTransferOETF"];
    case Hr:
      return [t, "sRGBTransferOETF"];
    default:
      return xe("WebGLProgram: Unsupported color space: ", e), [t, "LinearTransferOETF"];
  }
}
function xo(e, t, i) {
  const n = e.getShaderParameter(t, e.COMPILE_STATUS), r = (e.getShaderInfoLog(t) || "").trim();
  if (n && r === "") return "";
  const s = /ERROR: 0:(\d+)/.exec(r);
  if (s) {
    const a = parseInt(s[1]);
    return i.toUpperCase() + `

` + r + `

` + Ju(e.getShaderSource(t), a);
  } else return r;
}
function Zu(e, t) {
  const i = $u(t);
  return [
    `vec4 ${e}( vec4 value ) {`,
    `	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
var Qu = {
  1: "Linear",
  2: "Reinhard",
  3: "Cineon",
  4: "ACESFilmic",
  6: "AgX",
  7: "Neutral",
  5: "Custom"
};
function ef(e, t) {
  const i = Qu[t];
  return i === void 0 ? (xe("WebGLProgram: Unsupported toneMapping:", t), "vec3 " + e + "( vec3 color ) { return LinearToneMapping( color ); }") : "vec3 " + e + "( vec3 color ) { return " + i + "ToneMapping( color ); }";
}
var Nr = /* @__PURE__ */ new U();
function tf() {
  return Ge.getLuminanceCoefficients(Nr), [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${Nr.x.toFixed(4)}, ${Nr.y.toFixed(4)}, ${Nr.z.toFixed(4)} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function nf(e) {
  return [e.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", e.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(Xn).join(`
`);
}
function rf(e) {
  const t = [];
  for (const i in e) {
    const n = e[i];
    n !== !1 && t.push("#define " + i + " " + n);
  }
  return t.join(`
`);
}
function sf(e, t) {
  const i = {}, n = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
  for (let r = 0; r < n; r++) {
    const s = e.getActiveAttrib(t, r), a = s.name;
    let o = 1;
    s.type === e.FLOAT_MAT2 && (o = 2), s.type === e.FLOAT_MAT3 && (o = 3), s.type === e.FLOAT_MAT4 && (o = 4), i[a] = {
      type: s.type,
      location: e.getAttribLocation(t, a),
      locationSize: o
    };
  }
  return i;
}
function Xn(e) {
  return e !== "";
}
function So(e, t) {
  const i = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return e.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, i).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function yo(e, t) {
  return e.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
var af = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Ys(e) {
  return e.replace(af, cf);
}
var of = /* @__PURE__ */ new Map();
function cf(e, t) {
  let i = Ue[t];
  if (i === void 0) {
    const n = of.get(t);
    if (n !== void 0)
      i = Ue[n], xe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
    else throw new Error("THREE.WebGLProgram: Can not resolve #include <" + t + ">");
  }
  return Ys(i);
}
var lf = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Eo(e) {
  return e.replace(lf, hf);
}
function hf(e, t, i, n) {
  let r = "";
  for (let s = parseInt(t); s < parseInt(i); s++) r += n.replace(/\[\s*i\s*\]/g, "[ " + s + " ]").replace(/UNROLLED_LOOP_INDEX/g, s);
  return r;
}
function To(e) {
  let t = `precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;
  return e.precision === "highp" ? t += `
#define HIGH_PRECISION` : e.precision === "mediump" ? t += `
#define MEDIUM_PRECISION` : e.precision === "lowp" && (t += `
#define LOW_PRECISION`), t;
}
var df = {
  1: "SHADOWMAP_TYPE_PCF",
  3: "SHADOWMAP_TYPE_VSM"
};
function uf(e) {
  return df[e.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
var ff = {
  301: "ENVMAP_TYPE_CUBE",
  302: "ENVMAP_TYPE_CUBE",
  306: "ENVMAP_TYPE_CUBE_UV"
};
function pf(e) {
  return e.envMap === !1 ? "ENVMAP_TYPE_CUBE" : ff[e.envMapMode] || "ENVMAP_TYPE_CUBE";
}
var mf = { 302: "ENVMAP_MODE_REFRACTION" };
function gf(e) {
  return e.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : mf[e.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
var vf = {
  0: "ENVMAP_BLENDING_MULTIPLY",
  1: "ENVMAP_BLENDING_MIX",
  2: "ENVMAP_BLENDING_ADD"
};
function bf(e) {
  return e.envMap === !1 ? "ENVMAP_BLENDING_NONE" : vf[e.combine] || "ENVMAP_BLENDING_NONE";
}
function _f(e) {
  const t = e.envMapCubeUVHeight;
  if (t === null) return null;
  const i = Math.log2(t) - 2, n = 1 / t;
  return {
    texelWidth: 1 / (3 * Math.max(Math.pow(2, i), 112)),
    texelHeight: n,
    maxMip: i
  };
}
function Mf(e, t, i, n) {
  const r = e.getContext(), s = i.defines;
  let a = i.vertexShader, o = i.fragmentShader;
  const c = uf(i), l = pf(i), h = gf(i), u = bf(i), d = _f(i), p = nf(i), g = rf(s), _ = r.createProgram();
  let m, f, T = i.glslVersion ? "#version " + i.glslVersion + `
` : "";
  i.isRawShaderMaterial ? (m = [
    "#define SHADER_TYPE " + i.shaderType,
    "#define SHADER_NAME " + i.shaderName,
    g
  ].filter(Xn).join(`
`), m.length > 0 && (m += `
`), f = [
    "#define SHADER_TYPE " + i.shaderType,
    "#define SHADER_NAME " + i.shaderName,
    g
  ].filter(Xn).join(`
`), f.length > 0 && (f += `
`)) : (m = [
    To(i),
    "#define SHADER_TYPE " + i.shaderType,
    "#define SHADER_NAME " + i.shaderName,
    g,
    i.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    i.batching ? "#define USE_BATCHING" : "",
    i.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    i.instancing ? "#define USE_INSTANCING" : "",
    i.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    i.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    i.useFog && i.fog ? "#define USE_FOG" : "",
    i.useFog && i.fogExp2 ? "#define FOG_EXP2" : "",
    i.map ? "#define USE_MAP" : "",
    i.envMap ? "#define USE_ENVMAP" : "",
    i.envMap ? "#define " + h : "",
    i.lightMap ? "#define USE_LIGHTMAP" : "",
    i.aoMap ? "#define USE_AOMAP" : "",
    i.bumpMap ? "#define USE_BUMPMAP" : "",
    i.normalMap ? "#define USE_NORMALMAP" : "",
    i.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    i.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    i.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    i.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    i.anisotropy ? "#define USE_ANISOTROPY" : "",
    i.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    i.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    i.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    i.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    i.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    i.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    i.specularMap ? "#define USE_SPECULARMAP" : "",
    i.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    i.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    i.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    i.metalnessMap ? "#define USE_METALNESSMAP" : "",
    i.alphaMap ? "#define USE_ALPHAMAP" : "",
    i.alphaHash ? "#define USE_ALPHAHASH" : "",
    i.transmission ? "#define USE_TRANSMISSION" : "",
    i.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    i.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    i.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    i.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    i.mapUv ? "#define MAP_UV " + i.mapUv : "",
    i.alphaMapUv ? "#define ALPHAMAP_UV " + i.alphaMapUv : "",
    i.lightMapUv ? "#define LIGHTMAP_UV " + i.lightMapUv : "",
    i.aoMapUv ? "#define AOMAP_UV " + i.aoMapUv : "",
    i.emissiveMapUv ? "#define EMISSIVEMAP_UV " + i.emissiveMapUv : "",
    i.bumpMapUv ? "#define BUMPMAP_UV " + i.bumpMapUv : "",
    i.normalMapUv ? "#define NORMALMAP_UV " + i.normalMapUv : "",
    i.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + i.displacementMapUv : "",
    i.metalnessMapUv ? "#define METALNESSMAP_UV " + i.metalnessMapUv : "",
    i.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + i.roughnessMapUv : "",
    i.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + i.anisotropyMapUv : "",
    i.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + i.clearcoatMapUv : "",
    i.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + i.clearcoatNormalMapUv : "",
    i.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + i.clearcoatRoughnessMapUv : "",
    i.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + i.iridescenceMapUv : "",
    i.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + i.iridescenceThicknessMapUv : "",
    i.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + i.sheenColorMapUv : "",
    i.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + i.sheenRoughnessMapUv : "",
    i.specularMapUv ? "#define SPECULARMAP_UV " + i.specularMapUv : "",
    i.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + i.specularColorMapUv : "",
    i.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + i.specularIntensityMapUv : "",
    i.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + i.transmissionMapUv : "",
    i.thicknessMapUv ? "#define THICKNESSMAP_UV " + i.thicknessMapUv : "",
    i.vertexTangents && i.flatShading === !1 ? "#define USE_TANGENT" : "",
    i.vertexNormals ? "#define HAS_NORMAL" : "",
    i.vertexColors ? "#define USE_COLOR" : "",
    i.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    i.vertexUv1s ? "#define USE_UV1" : "",
    i.vertexUv2s ? "#define USE_UV2" : "",
    i.vertexUv3s ? "#define USE_UV3" : "",
    i.pointsUvs ? "#define USE_POINTS_UV" : "",
    i.flatShading ? "#define FLAT_SHADED" : "",
    i.skinning ? "#define USE_SKINNING" : "",
    i.morphTargets ? "#define USE_MORPHTARGETS" : "",
    i.morphNormals && i.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    i.morphColors ? "#define USE_MORPHCOLORS" : "",
    i.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + i.morphTextureStride : "",
    i.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + i.morphTargetsCount : "",
    i.doubleSided ? "#define DOUBLE_SIDED" : "",
    i.flipSided ? "#define FLIP_SIDED" : "",
    i.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    i.shadowMapEnabled ? "#define " + c : "",
    i.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    i.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    i.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
    i.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(Xn).join(`
`), f = [
    To(i),
    "#define SHADER_TYPE " + i.shaderType,
    "#define SHADER_NAME " + i.shaderName,
    g,
    i.useFog && i.fog ? "#define USE_FOG" : "",
    i.useFog && i.fogExp2 ? "#define FOG_EXP2" : "",
    i.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    i.map ? "#define USE_MAP" : "",
    i.matcap ? "#define USE_MATCAP" : "",
    i.envMap ? "#define USE_ENVMAP" : "",
    i.envMap ? "#define " + l : "",
    i.envMap ? "#define " + h : "",
    i.envMap ? "#define " + u : "",
    d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "",
    d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "",
    d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "",
    i.lightMap ? "#define USE_LIGHTMAP" : "",
    i.aoMap ? "#define USE_AOMAP" : "",
    i.bumpMap ? "#define USE_BUMPMAP" : "",
    i.normalMap ? "#define USE_NORMALMAP" : "",
    i.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    i.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    i.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
    i.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    i.anisotropy ? "#define USE_ANISOTROPY" : "",
    i.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    i.clearcoat ? "#define USE_CLEARCOAT" : "",
    i.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    i.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    i.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    i.dispersion ? "#define USE_DISPERSION" : "",
    i.iridescence ? "#define USE_IRIDESCENCE" : "",
    i.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    i.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    i.specularMap ? "#define USE_SPECULARMAP" : "",
    i.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    i.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    i.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    i.metalnessMap ? "#define USE_METALNESSMAP" : "",
    i.alphaMap ? "#define USE_ALPHAMAP" : "",
    i.alphaTest ? "#define USE_ALPHATEST" : "",
    i.alphaHash ? "#define USE_ALPHAHASH" : "",
    i.sheen ? "#define USE_SHEEN" : "",
    i.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    i.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    i.transmission ? "#define USE_TRANSMISSION" : "",
    i.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    i.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    i.vertexTangents && i.flatShading === !1 ? "#define USE_TANGENT" : "",
    i.vertexColors || i.instancingColor ? "#define USE_COLOR" : "",
    i.vertexAlphas || i.batchingColor ? "#define USE_COLOR_ALPHA" : "",
    i.vertexUv1s ? "#define USE_UV1" : "",
    i.vertexUv2s ? "#define USE_UV2" : "",
    i.vertexUv3s ? "#define USE_UV3" : "",
    i.pointsUvs ? "#define USE_POINTS_UV" : "",
    i.gradientMap ? "#define USE_GRADIENTMAP" : "",
    i.flatShading ? "#define FLAT_SHADED" : "",
    i.doubleSided ? "#define DOUBLE_SIDED" : "",
    i.flipSided ? "#define FLIP_SIDED" : "",
    i.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    i.shadowMapEnabled ? "#define " + c : "",
    i.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    i.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    i.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
    i.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    i.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
    i.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
    i.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    i.toneMapping !== 0 ? "#define TONE_MAPPING" : "",
    i.toneMapping !== 0 ? Ue.tonemapping_pars_fragment : "",
    i.toneMapping !== 0 ? ef("toneMapping", i.toneMapping) : "",
    i.dithering ? "#define DITHERING" : "",
    i.opaque ? "#define OPAQUE" : "",
    Ue.colorspace_pars_fragment,
    Zu("linearToOutputTexel", i.outputColorSpace),
    tf(),
    i.useDepthPacking ? "#define DEPTH_PACKING " + i.depthPacking : "",
    `
`
  ].filter(Xn).join(`
`)), a = Ys(a), a = So(a, i), a = yo(a, i), o = Ys(o), o = So(o, i), o = yo(o, i), a = Eo(a), o = Eo(o), i.isRawShaderMaterial !== !0 && (T = `#version 300 es
`, m = [
    p,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + m, f = [
    "#define varying in",
    i.glslVersion === "300 es" ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    i.glslVersion === "300 es" ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + f);
  const A = T + m + a, M = T + f + o, E = _o(r, r.VERTEX_SHADER, A), w = _o(r, r.FRAGMENT_SHADER, M);
  r.attachShader(_, E), r.attachShader(_, w), i.index0AttributeName !== void 0 ? r.bindAttribLocation(_, 0, i.index0AttributeName) : i.hasPositionAttribute === !0 && r.bindAttribLocation(_, 0, "position"), r.linkProgram(_);
  function C(R) {
    if (e.debug.checkShaderErrors) {
      const k = r.getProgramInfoLog(_) || "", q = r.getShaderInfoLog(E) || "", X = r.getShaderInfoLog(w) || "", z = k.trim(), j = q.trim(), O = X.trim();
      let ee = !0, te = !0;
      if (r.getProgramParameter(_, r.LINK_STATUS) === !1)
        if (ee = !1, typeof e.debug.onShaderError == "function") e.debug.onShaderError(r, _, E, w);
        else {
          const ie = xo(r, E, "vertex"), de = xo(r, w, "fragment");
          Re("WebGLProgram: Shader Error " + r.getError() + " - VALIDATE_STATUS " + r.getProgramParameter(_, r.VALIDATE_STATUS) + `

Material Name: ` + R.name + `
Material Type: ` + R.type + `

Program Info Log: ` + z + `
` + ie + `
` + de);
        }
      else z !== "" ? xe("WebGLProgram: Program Info Log:", z) : (j === "" || O === "") && (te = !1);
      te && (R.diagnostics = {
        runnable: ee,
        programLog: z,
        vertexShader: {
          log: j,
          prefix: m
        },
        fragmentShader: {
          log: O,
          prefix: f
        }
      });
    }
    r.deleteShader(E), r.deleteShader(w), v = new kr(r, _), y = sf(r, _);
  }
  let v;
  this.getUniforms = function() {
    return v === void 0 && C(this), v;
  };
  let y;
  this.getAttributes = function() {
    return y === void 0 && C(this), y;
  };
  let V = i.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return V === !1 && (V = r.getProgramParameter(_, ju)), V;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), r.deleteProgram(_), this.program = void 0;
  }, this.type = i.shaderType, this.name = i.shaderName, this.id = Yu++, this.cacheKey = t, this.usedTimes = 1, this.program = _, this.vertexShader = E, this.fragmentShader = w, this;
}
var xf = 0, Sf = class {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(e, t, i) {
    const n = this._getShaderCacheForMaterial(e);
    return n.has(t) === !1 && (n.add(t), t.usedTimes++), n.has(i) === !1 && (n.add(i), i.usedTimes++), this;
  }
  remove(e) {
    const t = this.materialCache.get(e);
    for (const i of t)
      i.usedTimes--, i.usedTimes === 0 && this.shaderCache.delete(i.code);
    return this.materialCache.delete(e), this;
  }
  getVertexShaderStage(e) {
    return this._getShaderStage(e.vertexShader);
  }
  getFragmentShaderStage(e) {
    return this._getShaderStage(e.fragmentShader);
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(e) {
    const t = this.materialCache;
    let i = t.get(e);
    return i === void 0 && (i = /* @__PURE__ */ new Set(), t.set(e, i)), i;
  }
  _getShaderStage(e) {
    const t = this.shaderCache;
    let i = t.get(e);
    return i === void 0 && (i = new yf(e), t.set(e, i)), i;
  }
}, yf = class {
  constructor(e) {
    this.id = xf++, this.code = e, this.usedTimes = 0;
  }
};
function Ef(e) {
  return e === 1030 || e === 37490 || e === 36285;
}
function Tf(e, t, i, n, r, s) {
  const a = new ta(), o = new Sf(), c = /* @__PURE__ */ new Set(), l = [], h = /* @__PURE__ */ new Map(), u = n.logarithmicDepthBuffer;
  let d = n.precision;
  const p = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distance",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function g(v) {
    return c.add(v), v === 0 ? "uv" : `uv${v}`;
  }
  function _(v, y, V, R, k, q) {
    const X = R.fog, z = k.geometry, j = v.isMeshStandardMaterial || v.isMeshLambertMaterial || v.isMeshPhongMaterial ? R.environment : null, O = v.isMeshStandardMaterial || v.isMeshLambertMaterial && !v.envMap || v.isMeshPhongMaterial && !v.envMap, ee = t.get(v.envMap || j, O), te = ee && ee.mapping === 306 ? ee.image.height : null, ie = p[v.type];
    v.precision !== null && (d = n.getMaxPrecision(v.precision), d !== v.precision && xe("WebGLProgram.getParameters:", v.precision, "not supported, using", d, "instead."));
    const de = z.morphAttributes.position || z.morphAttributes.normal || z.morphAttributes.color, Se = de !== void 0 ? de.length : 0;
    let Qe = 0;
    z.morphAttributes.position !== void 0 && (Qe = 1), z.morphAttributes.normal !== void 0 && (Qe = 2), z.morphAttributes.color !== void 0 && (Qe = 3);
    let je, P, K, ae;
    if (ie) {
      const we = si[ie];
      je = we.vertexShader, P = we.fragmentShader;
    } else {
      je = v.vertexShader, P = v.fragmentShader;
      const we = o.getVertexShaderStage(v), wt = o.getFragmentShaderStage(v);
      o.update(v, we, wt), K = we.id, ae = wt.id;
    }
    const ue = e.getRenderTarget(), Ae = e.state.buffers.depth.getReversed(), Ce = k.isInstancedMesh === !0, Le = k.isBatchedMesh === !0, Xe = !!v.map, Ve = !!v.matcap, it = !!ee, bt = !!v.aoMap, It = !!v.lightMap, kt = !!v.bumpMap && v.wireframe === !1, nt = !!v.normalMap, _t = !!v.displacementMap, mt = !!v.emissiveMap, ut = !!v.metalnessMap, I = !!v.roughnessMap, Bt = v.anisotropy > 0, Ke = v.clearcoat > 0, rt = v.dispersion > 0, S = v.iridescence > 0, b = v.sheen > 0, L = v.transmission > 0, W = Bt && !!v.anisotropyMap, J = Ke && !!v.clearcoatMap, re = Ke && !!v.clearcoatNormalMap, oe = Ke && !!v.clearcoatRoughnessMap, N = S && !!v.iridescenceMap, ne = S && !!v.iridescenceThicknessMap, pe = b && !!v.sheenColorMap, be = b && !!v.sheenRoughnessMap, Q = !!v.specularMap, Me = !!v.specularColorMap, ye = !!v.specularIntensityMap, De = L && !!v.transmissionMap, He = L && !!v.thicknessMap, D = !!v.gradientMap, Y = !!v.alphaMap, $ = v.alphaTest > 0, fe = !!v.alphaHash, ve = !!v.extensions;
    let Z = 0;
    v.toneMapped && (ue === null || ue.isXRRenderTarget === !0) && (Z = e.toneMapping);
    const le = {
      shaderID: ie,
      shaderType: v.type,
      shaderName: v.name,
      vertexShader: je,
      fragmentShader: P,
      defines: v.defines,
      customVertexShaderID: K,
      customFragmentShaderID: ae,
      isRawShaderMaterial: v.isRawShaderMaterial === !0,
      glslVersion: v.glslVersion,
      precision: d,
      batching: Le,
      batchingColor: Le && k._colorsTexture !== null,
      instancing: Ce,
      instancingColor: Ce && k.instanceColor !== null,
      instancingMorph: Ce && k.morphTexture !== null,
      outputColorSpace: ue === null ? e.outputColorSpace : ue.isXRRenderTarget === !0 ? ue.texture.colorSpace : Ge.workingColorSpace,
      alphaToCoverage: !!v.alphaToCoverage,
      map: Xe,
      matcap: Ve,
      envMap: it,
      envMapMode: it && ee.mapping,
      envMapCubeUVHeight: te,
      aoMap: bt,
      lightMap: It,
      bumpMap: kt,
      normalMap: nt,
      displacementMap: _t,
      emissiveMap: mt,
      normalMapObjectSpace: nt && v.normalMapType === 1,
      normalMapTangentSpace: nt && v.normalMapType === 0,
      packedNormalMap: nt && v.normalMapType === 0 && Ef(v.normalMap.format),
      metalnessMap: ut,
      roughnessMap: I,
      anisotropy: Bt,
      anisotropyMap: W,
      clearcoat: Ke,
      clearcoatMap: J,
      clearcoatNormalMap: re,
      clearcoatRoughnessMap: oe,
      dispersion: rt,
      iridescence: S,
      iridescenceMap: N,
      iridescenceThicknessMap: ne,
      sheen: b,
      sheenColorMap: pe,
      sheenRoughnessMap: be,
      specularMap: Q,
      specularColorMap: Me,
      specularIntensityMap: ye,
      transmission: L,
      transmissionMap: De,
      thicknessMap: He,
      gradientMap: D,
      opaque: v.transparent === !1 && v.blending === 1 && v.alphaToCoverage === !1,
      alphaMap: Y,
      alphaTest: $,
      alphaHash: fe,
      combine: v.combine,
      mapUv: Xe && g(v.map.channel),
      aoMapUv: bt && g(v.aoMap.channel),
      lightMapUv: It && g(v.lightMap.channel),
      bumpMapUv: kt && g(v.bumpMap.channel),
      normalMapUv: nt && g(v.normalMap.channel),
      displacementMapUv: _t && g(v.displacementMap.channel),
      emissiveMapUv: mt && g(v.emissiveMap.channel),
      metalnessMapUv: ut && g(v.metalnessMap.channel),
      roughnessMapUv: I && g(v.roughnessMap.channel),
      anisotropyMapUv: W && g(v.anisotropyMap.channel),
      clearcoatMapUv: J && g(v.clearcoatMap.channel),
      clearcoatNormalMapUv: re && g(v.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: oe && g(v.clearcoatRoughnessMap.channel),
      iridescenceMapUv: N && g(v.iridescenceMap.channel),
      iridescenceThicknessMapUv: ne && g(v.iridescenceThicknessMap.channel),
      sheenColorMapUv: pe && g(v.sheenColorMap.channel),
      sheenRoughnessMapUv: be && g(v.sheenRoughnessMap.channel),
      specularMapUv: Q && g(v.specularMap.channel),
      specularColorMapUv: Me && g(v.specularColorMap.channel),
      specularIntensityMapUv: ye && g(v.specularIntensityMap.channel),
      transmissionMapUv: De && g(v.transmissionMap.channel),
      thicknessMapUv: He && g(v.thicknessMap.channel),
      alphaMapUv: Y && g(v.alphaMap.channel),
      vertexTangents: !!z.attributes.tangent && (nt || Bt),
      vertexNormals: !!z.attributes.normal,
      vertexColors: v.vertexColors,
      vertexAlphas: v.vertexColors === !0 && !!z.attributes.color && z.attributes.color.itemSize === 4,
      pointsUvs: k.isPoints === !0 && !!z.attributes.uv && (Xe || Y),
      fog: !!X,
      useFog: v.fog === !0,
      fogExp2: !!X && X.isFogExp2,
      flatShading: v.wireframe === !1 && (v.flatShading === !0 || z.attributes.normal === void 0 && nt === !1 && (v.isMeshLambertMaterial || v.isMeshPhongMaterial || v.isMeshStandardMaterial || v.isMeshPhysicalMaterial)),
      sizeAttenuation: v.sizeAttenuation === !0,
      logarithmicDepthBuffer: u,
      reversedDepthBuffer: Ae,
      skinning: k.isSkinnedMesh === !0,
      hasPositionAttribute: z.attributes.position !== void 0,
      morphTargets: z.morphAttributes.position !== void 0,
      morphNormals: z.morphAttributes.normal !== void 0,
      morphColors: z.morphAttributes.color !== void 0,
      morphTargetsCount: Se,
      morphTextureStride: Qe,
      numDirLights: y.directional.length,
      numPointLights: y.point.length,
      numSpotLights: y.spot.length,
      numSpotLightMaps: y.spotLightMap.length,
      numRectAreaLights: y.rectArea.length,
      numHemiLights: y.hemi.length,
      numDirLightShadows: y.directionalShadowMap.length,
      numPointLightShadows: y.pointShadowMap.length,
      numSpotLightShadows: y.spotShadowMap.length,
      numSpotLightShadowsWithMaps: y.numSpotLightShadowsWithMaps,
      numLightProbes: y.numLightProbes,
      numLightProbeGrids: q.length,
      numClippingPlanes: s.numPlanes,
      numClipIntersection: s.numIntersection,
      dithering: v.dithering,
      shadowMapEnabled: e.shadowMap.enabled && V.length > 0,
      shadowMapType: e.shadowMap.type,
      toneMapping: Z,
      decodeVideoTexture: Xe && v.map.isVideoTexture === !0 && Ge.getTransfer(v.map.colorSpace) === "srgb",
      decodeVideoTextureEmissive: mt && v.emissiveMap.isVideoTexture === !0 && Ge.getTransfer(v.emissiveMap.colorSpace) === "srgb",
      premultipliedAlpha: v.premultipliedAlpha,
      doubleSided: v.side === 2,
      flipSided: v.side === 1,
      useDepthPacking: v.depthPacking >= 0,
      depthPacking: v.depthPacking || 0,
      index0AttributeName: v.index0AttributeName,
      extensionClipCullDistance: ve && v.extensions.clipCullDistance === !0 && i.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (ve && v.extensions.multiDraw === !0 || Le) && i.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: i.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: v.customProgramCacheKey()
    };
    return le.vertexUv1s = c.has(1), le.vertexUv2s = c.has(2), le.vertexUv3s = c.has(3), c.clear(), le;
  }
  function m(v) {
    const y = [];
    if (v.shaderID ? y.push(v.shaderID) : (y.push(v.customVertexShaderID), y.push(v.customFragmentShaderID)), v.defines !== void 0) for (const V in v.defines)
      y.push(V), y.push(v.defines[V]);
    return v.isRawShaderMaterial === !1 && (f(y, v), T(y, v), y.push(e.outputColorSpace)), y.push(v.customProgramCacheKey), y.join();
  }
  function f(v, y) {
    v.push(y.precision), v.push(y.outputColorSpace), v.push(y.envMapMode), v.push(y.envMapCubeUVHeight), v.push(y.mapUv), v.push(y.alphaMapUv), v.push(y.lightMapUv), v.push(y.aoMapUv), v.push(y.bumpMapUv), v.push(y.normalMapUv), v.push(y.displacementMapUv), v.push(y.emissiveMapUv), v.push(y.metalnessMapUv), v.push(y.roughnessMapUv), v.push(y.anisotropyMapUv), v.push(y.clearcoatMapUv), v.push(y.clearcoatNormalMapUv), v.push(y.clearcoatRoughnessMapUv), v.push(y.iridescenceMapUv), v.push(y.iridescenceThicknessMapUv), v.push(y.sheenColorMapUv), v.push(y.sheenRoughnessMapUv), v.push(y.specularMapUv), v.push(y.specularColorMapUv), v.push(y.specularIntensityMapUv), v.push(y.transmissionMapUv), v.push(y.thicknessMapUv), v.push(y.combine), v.push(y.fogExp2), v.push(y.sizeAttenuation), v.push(y.morphTargetsCount), v.push(y.morphAttributeCount), v.push(y.numDirLights), v.push(y.numPointLights), v.push(y.numSpotLights), v.push(y.numSpotLightMaps), v.push(y.numHemiLights), v.push(y.numRectAreaLights), v.push(y.numDirLightShadows), v.push(y.numPointLightShadows), v.push(y.numSpotLightShadows), v.push(y.numSpotLightShadowsWithMaps), v.push(y.numLightProbes), v.push(y.shadowMapType), v.push(y.toneMapping), v.push(y.numClippingPlanes), v.push(y.numClipIntersection), v.push(y.depthPacking);
  }
  function T(v, y) {
    a.disableAll(), y.instancing && a.enable(0), y.instancingColor && a.enable(1), y.instancingMorph && a.enable(2), y.matcap && a.enable(3), y.envMap && a.enable(4), y.normalMapObjectSpace && a.enable(5), y.normalMapTangentSpace && a.enable(6), y.clearcoat && a.enable(7), y.iridescence && a.enable(8), y.alphaTest && a.enable(9), y.vertexColors && a.enable(10), y.vertexAlphas && a.enable(11), y.vertexUv1s && a.enable(12), y.vertexUv2s && a.enable(13), y.vertexUv3s && a.enable(14), y.vertexTangents && a.enable(15), y.anisotropy && a.enable(16), y.alphaHash && a.enable(17), y.batching && a.enable(18), y.dispersion && a.enable(19), y.batchingColor && a.enable(20), y.gradientMap && a.enable(21), y.packedNormalMap && a.enable(22), y.vertexNormals && a.enable(23), v.push(a.mask), a.disableAll(), y.fog && a.enable(0), y.useFog && a.enable(1), y.flatShading && a.enable(2), y.logarithmicDepthBuffer && a.enable(3), y.reversedDepthBuffer && a.enable(4), y.skinning && a.enable(5), y.morphTargets && a.enable(6), y.morphNormals && a.enable(7), y.morphColors && a.enable(8), y.premultipliedAlpha && a.enable(9), y.shadowMapEnabled && a.enable(10), y.doubleSided && a.enable(11), y.flipSided && a.enable(12), y.useDepthPacking && a.enable(13), y.dithering && a.enable(14), y.transmission && a.enable(15), y.sheen && a.enable(16), y.opaque && a.enable(17), y.pointsUvs && a.enable(18), y.decodeVideoTexture && a.enable(19), y.decodeVideoTextureEmissive && a.enable(20), y.alphaToCoverage && a.enable(21), y.numLightProbeGrids > 0 && a.enable(22), y.hasPositionAttribute && a.enable(23), v.push(a.mask);
  }
  function A(v) {
    const y = p[v.type];
    let V;
    if (y) {
      const R = si[y];
      V = Jh.clone(R.uniforms);
    } else V = v.uniforms;
    return V;
  }
  function M(v, y) {
    let V = h.get(y);
    return V !== void 0 ? ++V.usedTimes : (V = new Mf(e, y, v, r), l.push(V), h.set(y, V)), V;
  }
  function E(v) {
    if (--v.usedTimes === 0) {
      const y = l.indexOf(v);
      l[y] = l[l.length - 1], l.pop(), h.delete(v.cacheKey), v.destroy();
    }
  }
  function w(v) {
    o.remove(v);
  }
  function C() {
    o.dispose();
  }
  return {
    getParameters: _,
    getProgramCacheKey: m,
    getUniforms: A,
    acquireProgram: M,
    releaseProgram: E,
    releaseShaderCache: w,
    programs: l,
    dispose: C
  };
}
function Af() {
  let e = /* @__PURE__ */ new WeakMap();
  function t(a) {
    return e.has(a);
  }
  function i(a) {
    let o = e.get(a);
    return o === void 0 && (o = {}, e.set(a, o)), o;
  }
  function n(a) {
    e.delete(a);
  }
  function r(a, o, c) {
    e.get(a)[o] = c;
  }
  function s() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: t,
    get: i,
    remove: n,
    update: r,
    dispose: s
  };
}
function wf(e, t) {
  return e.groupOrder !== t.groupOrder ? e.groupOrder - t.groupOrder : e.renderOrder !== t.renderOrder ? e.renderOrder - t.renderOrder : e.material.id !== t.material.id ? e.material.id - t.material.id : e.materialVariant !== t.materialVariant ? e.materialVariant - t.materialVariant : e.z !== t.z ? e.z - t.z : e.id - t.id;
}
function Ao(e, t) {
  return e.groupOrder !== t.groupOrder ? e.groupOrder - t.groupOrder : e.renderOrder !== t.renderOrder ? e.renderOrder - t.renderOrder : e.z !== t.z ? t.z - e.z : e.id - t.id;
}
function wo() {
  const e = [];
  let t = 0;
  const i = [], n = [], r = [];
  function s() {
    t = 0, i.length = 0, n.length = 0, r.length = 0;
  }
  function a(d) {
    let p = 0;
    return d.isInstancedMesh && (p += 2), d.isSkinnedMesh && (p += 1), p;
  }
  function o(d, p, g, _, m, f) {
    let T = e[t];
    return T === void 0 ? (T = {
      id: d.id,
      object: d,
      geometry: p,
      material: g,
      materialVariant: a(d),
      groupOrder: _,
      renderOrder: d.renderOrder,
      z: m,
      group: f
    }, e[t] = T) : (T.id = d.id, T.object = d, T.geometry = p, T.material = g, T.materialVariant = a(d), T.groupOrder = _, T.renderOrder = d.renderOrder, T.z = m, T.group = f), t++, T;
  }
  function c(d, p, g, _, m, f) {
    const T = o(d, p, g, _, m, f);
    g.transmission > 0 ? n.push(T) : g.transparent === !0 ? r.push(T) : i.push(T);
  }
  function l(d, p, g, _, m, f) {
    const T = o(d, p, g, _, m, f);
    g.transmission > 0 ? n.unshift(T) : g.transparent === !0 ? r.unshift(T) : i.unshift(T);
  }
  function h(d, p, g) {
    i.length > 1 && i.sort(d || wf), n.length > 1 && n.sort(p || Ao), r.length > 1 && r.sort(p || Ao), g && (i.reverse(), n.reverse(), r.reverse());
  }
  function u() {
    for (let d = t, p = e.length; d < p; d++) {
      const g = e[d];
      if (g.id === null) break;
      g.id = null, g.object = null, g.geometry = null, g.material = null, g.group = null;
    }
  }
  return {
    opaque: i,
    transmissive: n,
    transparent: r,
    init: s,
    push: c,
    unshift: l,
    finish: u,
    sort: h
  };
}
function Rf() {
  let e = /* @__PURE__ */ new WeakMap();
  function t(n, r) {
    const s = e.get(n);
    let a;
    return s === void 0 ? (a = new wo(), e.set(n, [a])) : r >= s.length ? (a = new wo(), s.push(a)) : a = s[r], a;
  }
  function i() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: i
  };
}
function Cf() {
  const e = {};
  return { get: function(t) {
    if (e[t.id] !== void 0) return e[t.id];
    let i;
    switch (t.type) {
      case "DirectionalLight":
        i = {
          direction: new U(),
          color: new Te()
        };
        break;
      case "SpotLight":
        i = {
          position: new U(),
          direction: new U(),
          color: new Te(),
          distance: 0,
          coneCos: 0,
          penumbraCos: 0,
          decay: 0
        };
        break;
      case "PointLight":
        i = {
          position: new U(),
          color: new Te(),
          distance: 0,
          decay: 0
        };
        break;
      case "HemisphereLight":
        i = {
          direction: new U(),
          skyColor: new Te(),
          groundColor: new Te()
        };
        break;
      case "RectAreaLight":
        i = {
          color: new Te(),
          position: new U(),
          halfWidth: new U(),
          halfHeight: new U()
        };
    }
    return e[t.id] = i, i;
  } };
}
function Pf() {
  const e = {};
  return { get: function(t) {
    if (e[t.id] !== void 0) return e[t.id];
    let i;
    switch (t.type) {
      case "DirectionalLight":
        i = {
          shadowIntensity: 1,
          shadowBias: 0,
          shadowNormalBias: 0,
          shadowRadius: 1,
          shadowMapSize: new Fe()
        };
        break;
      case "SpotLight":
        i = {
          shadowIntensity: 1,
          shadowBias: 0,
          shadowNormalBias: 0,
          shadowRadius: 1,
          shadowMapSize: new Fe()
        };
        break;
      case "PointLight":
        i = {
          shadowIntensity: 1,
          shadowBias: 0,
          shadowNormalBias: 0,
          shadowRadius: 1,
          shadowMapSize: new Fe(),
          shadowCameraNear: 1,
          shadowCameraFar: 1e3
        };
    }
    return e[t.id] = i, i;
  } };
}
var Lf = 0;
function Df(e, t) {
  return (t.castShadow ? 2 : 0) - (e.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (e.map ? 1 : 0);
}
function If(e) {
  const t = new Cf(), i = Pf(), n = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [
      0,
      0,
      0
    ],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let l = 0; l < 9; l++) n.probe.push(new U());
  const r = new U(), s = new Ne(), a = new Ne();
  function o(l) {
    let h = 0, u = 0, d = 0;
    for (let y = 0; y < 9; y++) n.probe[y].set(0, 0, 0);
    let p = 0, g = 0, _ = 0, m = 0, f = 0, T = 0, A = 0, M = 0, E = 0, w = 0, C = 0;
    l.sort(Df);
    for (let y = 0, V = l.length; y < V; y++) {
      const R = l[y], k = R.color, q = R.intensity, X = R.distance;
      let z = null;
      if (R.shadow && R.shadow.map && (R.shadow.map.texture.format === 1030 ? z = R.shadow.map.texture : z = R.shadow.map.depthTexture || R.shadow.map.texture), R.isAmbientLight)
        h += k.r * q, u += k.g * q, d += k.b * q;
      else if (R.isLightProbe) {
        for (let j = 0; j < 9; j++) n.probe[j].addScaledVector(R.sh.coefficients[j], q);
        C++;
      } else if (R.isDirectionalLight) {
        const j = t.get(R);
        if (j.color.copy(R.color).multiplyScalar(R.intensity), R.castShadow) {
          const O = R.shadow, ee = i.get(R);
          ee.shadowIntensity = O.intensity, ee.shadowBias = O.bias, ee.shadowNormalBias = O.normalBias, ee.shadowRadius = O.radius, ee.shadowMapSize = O.mapSize, n.directionalShadow[p] = ee, n.directionalShadowMap[p] = z, n.directionalShadowMatrix[p] = R.shadow.matrix, T++;
        }
        n.directional[p] = j, p++;
      } else if (R.isSpotLight) {
        const j = t.get(R);
        j.position.setFromMatrixPosition(R.matrixWorld), j.color.copy(k).multiplyScalar(q), j.distance = X, j.coneCos = Math.cos(R.angle), j.penumbraCos = Math.cos(R.angle * (1 - R.penumbra)), j.decay = R.decay, n.spot[_] = j;
        const O = R.shadow;
        if (R.map && (n.spotLightMap[E] = R.map, E++, O.updateMatrices(R), R.castShadow && w++), n.spotLightMatrix[_] = O.matrix, R.castShadow) {
          const ee = i.get(R);
          ee.shadowIntensity = O.intensity, ee.shadowBias = O.bias, ee.shadowNormalBias = O.normalBias, ee.shadowRadius = O.radius, ee.shadowMapSize = O.mapSize, n.spotShadow[_] = ee, n.spotShadowMap[_] = z, M++;
        }
        _++;
      } else if (R.isRectAreaLight) {
        const j = t.get(R);
        j.color.copy(k).multiplyScalar(q), j.halfWidth.set(R.width * 0.5, 0, 0), j.halfHeight.set(0, R.height * 0.5, 0), n.rectArea[m] = j, m++;
      } else if (R.isPointLight) {
        const j = t.get(R);
        if (j.color.copy(R.color).multiplyScalar(R.intensity), j.distance = R.distance, j.decay = R.decay, R.castShadow) {
          const O = R.shadow, ee = i.get(R);
          ee.shadowIntensity = O.intensity, ee.shadowBias = O.bias, ee.shadowNormalBias = O.normalBias, ee.shadowRadius = O.radius, ee.shadowMapSize = O.mapSize, ee.shadowCameraNear = O.camera.near, ee.shadowCameraFar = O.camera.far, n.pointShadow[g] = ee, n.pointShadowMap[g] = z, n.pointShadowMatrix[g] = R.shadow.matrix, A++;
        }
        n.point[g] = j, g++;
      } else if (R.isHemisphereLight) {
        const j = t.get(R);
        j.skyColor.copy(R.color).multiplyScalar(q), j.groundColor.copy(R.groundColor).multiplyScalar(q), n.hemi[f] = j, f++;
      }
    }
    m > 0 && (e.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = ce.LTC_FLOAT_1, n.rectAreaLTC2 = ce.LTC_FLOAT_2) : (n.rectAreaLTC1 = ce.LTC_HALF_1, n.rectAreaLTC2 = ce.LTC_HALF_2)), n.ambient[0] = h, n.ambient[1] = u, n.ambient[2] = d;
    const v = n.hash;
    (v.directionalLength !== p || v.pointLength !== g || v.spotLength !== _ || v.rectAreaLength !== m || v.hemiLength !== f || v.numDirectionalShadows !== T || v.numPointShadows !== A || v.numSpotShadows !== M || v.numSpotMaps !== E || v.numLightProbes !== C) && (n.directional.length = p, n.spot.length = _, n.rectArea.length = m, n.point.length = g, n.hemi.length = f, n.directionalShadow.length = T, n.directionalShadowMap.length = T, n.pointShadow.length = A, n.pointShadowMap.length = A, n.spotShadow.length = M, n.spotShadowMap.length = M, n.directionalShadowMatrix.length = T, n.pointShadowMatrix.length = A, n.spotLightMatrix.length = M + E - w, n.spotLightMap.length = E, n.numSpotLightShadowsWithMaps = w, n.numLightProbes = C, v.directionalLength = p, v.pointLength = g, v.spotLength = _, v.rectAreaLength = m, v.hemiLength = f, v.numDirectionalShadows = T, v.numPointShadows = A, v.numSpotShadows = M, v.numSpotMaps = E, v.numLightProbes = C, n.version = Lf++);
  }
  function c(l, h) {
    let u = 0, d = 0, p = 0, g = 0, _ = 0;
    const m = h.matrixWorldInverse;
    for (let f = 0, T = l.length; f < T; f++) {
      const A = l[f];
      if (A.isDirectionalLight) {
        const M = n.directional[u];
        M.direction.setFromMatrixPosition(A.matrixWorld), r.setFromMatrixPosition(A.target.matrixWorld), M.direction.sub(r), M.direction.transformDirection(m), u++;
      } else if (A.isSpotLight) {
        const M = n.spot[p];
        M.position.setFromMatrixPosition(A.matrixWorld), M.position.applyMatrix4(m), M.direction.setFromMatrixPosition(A.matrixWorld), r.setFromMatrixPosition(A.target.matrixWorld), M.direction.sub(r), M.direction.transformDirection(m), p++;
      } else if (A.isRectAreaLight) {
        const M = n.rectArea[g];
        M.position.setFromMatrixPosition(A.matrixWorld), M.position.applyMatrix4(m), a.identity(), s.copy(A.matrixWorld), s.premultiply(m), a.extractRotation(s), M.halfWidth.set(A.width * 0.5, 0, 0), M.halfHeight.set(0, A.height * 0.5, 0), M.halfWidth.applyMatrix4(a), M.halfHeight.applyMatrix4(a), g++;
      } else if (A.isPointLight) {
        const M = n.point[d];
        M.position.setFromMatrixPosition(A.matrixWorld), M.position.applyMatrix4(m), d++;
      } else if (A.isHemisphereLight) {
        const M = n.hemi[_];
        M.direction.setFromMatrixPosition(A.matrixWorld), M.direction.transformDirection(m), _++;
      }
    }
  }
  return {
    setup: o,
    setupView: c,
    state: n
  };
}
function Ro(e) {
  const t = new If(e), i = [], n = [], r = [];
  function s(d) {
    u.camera = d, i.length = 0, n.length = 0, r.length = 0;
  }
  function a(d) {
    i.push(d);
  }
  function o(d) {
    n.push(d);
  }
  function c(d) {
    r.push(d);
  }
  function l() {
    t.setup(i);
  }
  function h(d) {
    t.setupView(i, d);
  }
  const u = {
    lightsArray: i,
    shadowsArray: n,
    lightProbeGridArray: r,
    camera: null,
    lights: t,
    transmissionRenderTarget: {},
    textureUnits: 0
  };
  return {
    init: s,
    state: u,
    setupLights: l,
    setupLightsView: h,
    pushLight: a,
    pushShadow: o,
    pushLightProbeGrid: c
  };
}
function Nf(e) {
  let t = /* @__PURE__ */ new WeakMap();
  function i(r, s = 0) {
    const a = t.get(r);
    let o;
    return a === void 0 ? (o = new Ro(e), t.set(r, [o])) : s >= a.length ? (o = new Ro(e), a.push(o)) : o = a[s], o;
  }
  function n() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: i,
    dispose: n
  };
}
var Uf = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, Ff = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`, Of = [
  /* @__PURE__ */ new U(1, 0, 0),
  /* @__PURE__ */ new U(-1, 0, 0),
  /* @__PURE__ */ new U(0, 1, 0),
  /* @__PURE__ */ new U(0, -1, 0),
  /* @__PURE__ */ new U(0, 0, 1),
  /* @__PURE__ */ new U(0, 0, -1)
], kf = [
  /* @__PURE__ */ new U(0, -1, 0),
  /* @__PURE__ */ new U(0, -1, 0),
  /* @__PURE__ */ new U(0, 0, 1),
  /* @__PURE__ */ new U(0, 0, -1),
  /* @__PURE__ */ new U(0, -1, 0),
  /* @__PURE__ */ new U(0, -1, 0)
], Co = /* @__PURE__ */ new Ne(), Wn = /* @__PURE__ */ new U(), Os = /* @__PURE__ */ new U();
function Bf(e, t, i) {
  let n = new na();
  const r = new Fe(), s = new Fe(), a = new Ze(), o = new ed(), c = new td(), l = {}, h = i.maxTextureSize, u = {
    0: 1,
    1: 0,
    2: 2
  }, d = new li({
    defines: { VSM_SAMPLES: 8 },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new Fe() },
      radius: { value: 4 }
    },
    vertexShader: Uf,
    fragmentShader: Ff
  }), p = d.clone();
  p.defines.HORIZONTAL_PASS = 1;
  const g = new Wt();
  g.setAttribute("position", new Tt(new Float32Array([
    -1,
    -1,
    0.5,
    3,
    -1,
    0.5,
    -1,
    3,
    0.5
  ]), 3));
  const _ = new At(g, d), m = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
  let f = this.type;
  this.render = function(w, C, v) {
    if (m.enabled === !1 || m.autoUpdate === !1 && m.needsUpdate === !1 || w.length === 0) return;
    this.type === 2 && (xe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."), this.type = 1);
    const y = e.getRenderTarget(), V = e.getActiveCubeFace(), R = e.getActiveMipmapLevel(), k = e.state;
    k.setBlending(0), k.buffers.depth.getReversed() === !0 ? k.buffers.color.setClear(0, 0, 0, 0) : k.buffers.color.setClear(1, 1, 1, 1), k.buffers.depth.setTest(!0), k.setScissorTest(!1);
    const q = f !== this.type;
    q && C.traverse(function(X) {
      X.material && (Array.isArray(X.material) ? X.material.forEach((z) => z.needsUpdate = !0) : X.material.needsUpdate = !0);
    });
    for (let X = 0, z = w.length; X < z; X++) {
      const j = w[X], O = j.shadow;
      if (O === void 0) {
        xe("WebGLShadowMap:", j, "has no shadow.");
        continue;
      }
      if (O.autoUpdate === !1 && O.needsUpdate === !1) continue;
      r.copy(O.mapSize);
      const ee = O.getFrameExtents();
      r.multiply(ee), s.copy(O.mapSize), (r.x > h || r.y > h) && (r.x > h && (s.x = Math.floor(h / ee.x), r.x = s.x * ee.x, O.mapSize.x = s.x), r.y > h && (s.y = Math.floor(h / ee.y), r.y = s.y * ee.y, O.mapSize.y = s.y));
      const te = e.state.buffers.depth.getReversed();
      if (O.camera._reversedDepth = te, O.map === null || q === !0) {
        if (O.map !== null && (O.map.depthTexture !== null && (O.map.depthTexture.dispose(), O.map.depthTexture = null), O.map.dispose()), this.type === 3) {
          if (j.isPointLight) {
            xe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
            continue;
          }
          O.map = new oi(r.x, r.y, {
            format: zr,
            type: ji,
            minFilter: Lt,
            magFilter: Lt,
            generateMipmaps: !1
          }), O.map.texture.name = j.name + ".shadowMap", O.map.depthTexture = new Tn(r.x, r.y, wn), O.map.depthTexture.name = j.name + ".shadowMapDepth", O.map.depthTexture.format = Jn, O.map.depthTexture.compareFunction = null, O.map.depthTexture.minFilter = Et, O.map.depthTexture.magFilter = Et;
        } else
          j.isPointLight ? (O.map = new Oc(r.x), O.map.depthTexture = new Kh(r.x, Ki)) : (O.map = new oi(r.x, r.y), O.map.depthTexture = new Tn(r.x, r.y, Ki)), O.map.depthTexture.name = j.name + ".shadowMap", O.map.depthTexture.format = Jn, this.type === 1 ? (O.map.depthTexture.compareFunction = te ? 518 : 515, O.map.depthTexture.minFilter = Lt, O.map.depthTexture.magFilter = Lt) : (O.map.depthTexture.compareFunction = null, O.map.depthTexture.minFilter = Et, O.map.depthTexture.magFilter = Et);
        O.camera.updateProjectionMatrix();
      }
      const ie = O.map.isWebGLCubeRenderTarget ? 6 : 1;
      for (let de = 0; de < ie; de++) {
        if (O.map.isWebGLCubeRenderTarget)
          e.setRenderTarget(O.map, de), e.clear();
        else {
          de === 0 && (e.setRenderTarget(O.map), e.clear());
          const Se = O.getViewport(de);
          a.set(s.x * Se.x, s.y * Se.y, s.x * Se.z, s.y * Se.w), k.viewport(a);
        }
        if (j.isPointLight) {
          const Se = O.camera, Qe = O.matrix, je = j.distance || Se.far;
          je !== Se.far && (Se.far = je, Se.updateProjectionMatrix()), Wn.setFromMatrixPosition(j.matrixWorld), Se.position.copy(Wn), Os.copy(Se.position), Os.add(Of[de]), Se.up.copy(kf[de]), Se.lookAt(Os), Se.updateMatrixWorld(), Qe.makeTranslation(-Wn.x, -Wn.y, -Wn.z), Co.multiplyMatrices(Se.projectionMatrix, Se.matrixWorldInverse), O._frustum.setFromProjectionMatrix(Co, Se.coordinateSystem, Se.reversedDepth);
        } else O.updateMatrices(j);
        n = O.getFrustum(), M(C, v, O.camera, j, this.type);
      }
      O.isPointLightShadow !== !0 && this.type === 3 && T(O, v), O.needsUpdate = !1;
    }
    f = this.type, m.needsUpdate = !1, e.setRenderTarget(y, V, R);
  };
  function T(w, C) {
    const v = t.update(_);
    d.defines.VSM_SAMPLES !== w.blurSamples && (d.defines.VSM_SAMPLES = w.blurSamples, p.defines.VSM_SAMPLES = w.blurSamples, d.needsUpdate = !0, p.needsUpdate = !0), w.mapPass === null && (w.mapPass = new oi(r.x, r.y, {
      format: zr,
      type: ji
    })), d.uniforms.shadow_pass.value = w.map.depthTexture, d.uniforms.resolution.value = w.mapSize, d.uniforms.radius.value = w.radius, e.setRenderTarget(w.mapPass), e.clear(), e.renderBufferDirect(C, null, v, d, _, null), p.uniforms.shadow_pass.value = w.mapPass.texture, p.uniforms.resolution.value = w.mapSize, p.uniforms.radius.value = w.radius, e.setRenderTarget(w.map), e.clear(), e.renderBufferDirect(C, null, v, p, _, null);
  }
  function A(w, C, v, y) {
    let V = null;
    const R = v.isPointLight === !0 ? w.customDistanceMaterial : w.customDepthMaterial;
    if (R !== void 0) V = R;
    else if (V = v.isPointLight === !0 ? c : o, e.localClippingEnabled && C.clipShadows === !0 && Array.isArray(C.clippingPlanes) && C.clippingPlanes.length !== 0 || C.displacementMap && C.displacementScale !== 0 || C.alphaMap && C.alphaTest > 0 || C.map && C.alphaTest > 0 || C.alphaToCoverage === !0) {
      const k = V.uuid, q = C.uuid;
      let X = l[k];
      X === void 0 && (X = {}, l[k] = X);
      let z = X[q];
      z === void 0 && (z = V.clone(), X[q] = z, C.addEventListener("dispose", E)), V = z;
    }
    if (V.visible = C.visible, V.wireframe = C.wireframe, y === 3 ? V.side = C.shadowSide !== null ? C.shadowSide : C.side : V.side = C.shadowSide !== null ? C.shadowSide : u[C.side], V.alphaMap = C.alphaMap, V.alphaTest = C.alphaToCoverage === !0 ? 0.5 : C.alphaTest, V.map = C.map, V.clipShadows = C.clipShadows, V.clippingPlanes = C.clippingPlanes, V.clipIntersection = C.clipIntersection, V.displacementMap = C.displacementMap, V.displacementScale = C.displacementScale, V.displacementBias = C.displacementBias, V.wireframeLinewidth = C.wireframeLinewidth, V.linewidth = C.linewidth, v.isPointLight === !0 && V.isMeshDistanceMaterial === !0) {
      const k = e.properties.get(V);
      k.light = v;
    }
    return V;
  }
  function M(w, C, v, y, V) {
    if (w.visible === !1) return;
    if (w.layers.test(C.layers) && (w.isMesh || w.isLine || w.isPoints) && (w.castShadow || w.receiveShadow && V === 3) && (!w.frustumCulled || n.intersectsObject(w))) {
      w.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse, w.matrixWorld);
      const k = t.update(w), q = w.material;
      if (Array.isArray(q)) {
        const X = k.groups;
        for (let z = 0, j = X.length; z < j; z++) {
          const O = X[z], ee = q[O.materialIndex];
          if (ee && ee.visible) {
            const te = A(w, ee, y, V);
            w.onBeforeShadow(e, w, C, v, k, te, O), e.renderBufferDirect(v, null, k, te, w, O), w.onAfterShadow(e, w, C, v, k, te, O);
          }
        }
      } else if (q.visible) {
        const X = A(w, q, y, V);
        w.onBeforeShadow(e, w, C, v, k, X, null), e.renderBufferDirect(v, null, k, X, w, null), w.onAfterShadow(e, w, C, v, k, X, null);
      }
    }
    const R = w.children;
    for (let k = 0, q = R.length; k < q; k++) M(R[k], C, v, y, V);
  }
  function E(w) {
    w.target.removeEventListener("dispose", E);
    for (const C in l) {
      const v = l[C], y = w.target.uuid;
      y in v && (v[y].dispose(), delete v[y]);
    }
  }
}
function Gf(e, t) {
  function i() {
    let D = !1;
    const Y = new Ze();
    let $ = null;
    const fe = new Ze(0, 0, 0, 0);
    return {
      setMask: function(ve) {
        $ !== ve && !D && (e.colorMask(ve, ve, ve, ve), $ = ve);
      },
      setLocked: function(ve) {
        D = ve;
      },
      setClear: function(ve, Z, le, we, wt) {
        wt === !0 && (ve *= we, Z *= we, le *= we), Y.set(ve, Z, le, we), fe.equals(Y) === !1 && (e.clearColor(ve, Z, le, we), fe.copy(Y));
      },
      reset: function() {
        D = !1, $ = null, fe.set(-1, 0, 0, 0);
      }
    };
  }
  function n() {
    let D = !1, Y = !1, $ = null, fe = null, ve = null;
    return {
      setReversed: function(Z) {
        if (Y !== Z) {
          const le = t.get("EXT_clip_control");
          Z ? le.clipControlEXT(le.LOWER_LEFT_EXT, le.ZERO_TO_ONE_EXT) : le.clipControlEXT(le.LOWER_LEFT_EXT, le.NEGATIVE_ONE_TO_ONE_EXT), Y = Z;
          const we = ve;
          ve = null, this.setClear(we);
        }
      },
      getReversed: function() {
        return Y;
      },
      setTest: function(Z) {
        Z ? ue(e.DEPTH_TEST) : Ae(e.DEPTH_TEST);
      },
      setMask: function(Z) {
        $ !== Z && !D && (e.depthMask(Z), $ = Z);
      },
      setFunc: function(Z) {
        if (Y && (Z = Zl[Z]), fe !== Z) {
          switch (Z) {
            case 0:
              e.depthFunc(e.NEVER);
              break;
            case 1:
              e.depthFunc(e.ALWAYS);
              break;
            case 2:
              e.depthFunc(e.LESS);
              break;
            case 3:
              e.depthFunc(e.LEQUAL);
              break;
            case 4:
              e.depthFunc(e.EQUAL);
              break;
            case 5:
              e.depthFunc(e.GEQUAL);
              break;
            case 6:
              e.depthFunc(e.GREATER);
              break;
            case 7:
              e.depthFunc(e.NOTEQUAL);
              break;
            default:
              e.depthFunc(e.LEQUAL);
          }
          fe = Z;
        }
      },
      setLocked: function(Z) {
        D = Z;
      },
      setClear: function(Z) {
        ve !== Z && (ve = Z, Y && (Z = 1 - Z), e.clearDepth(Z));
      },
      reset: function() {
        D = !1, $ = null, fe = null, ve = null, Y = !1;
      }
    };
  }
  function r() {
    let D = !1, Y = null, $ = null, fe = null, ve = null, Z = null, le = null, we = null, wt = null;
    return {
      setTest: function(et) {
        D || (et ? ue(e.STENCIL_TEST) : Ae(e.STENCIL_TEST));
      },
      setMask: function(et) {
        Y !== et && !D && (e.stencilMask(et), Y = et);
      },
      setFunc: function(et, ei, ui) {
        ($ !== et || fe !== ei || ve !== ui) && (e.stencilFunc(et, ei, ui), $ = et, fe = ei, ve = ui);
      },
      setOp: function(et, ei, ui) {
        (Z !== et || le !== ei || we !== ui) && (e.stencilOp(et, ei, ui), Z = et, le = ei, we = ui);
      },
      setLocked: function(et) {
        D = et;
      },
      setClear: function(et) {
        wt !== et && (e.clearStencil(et), wt = et);
      },
      reset: function() {
        D = !1, Y = null, $ = null, fe = null, ve = null, Z = null, le = null, we = null, wt = null;
      }
    };
  }
  const s = new i(), a = new n(), o = new r(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
  let h = {}, u = {}, d = {}, p = /* @__PURE__ */ new WeakMap(), g = [], _ = null, m = !1, f = null, T = null, A = null, M = null, E = null, w = null, C = null, v = new Te(0, 0, 0), y = 0, V = !1, R = null, k = null, q = null, X = null, z = null;
  const j = e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let O = !1, ee = 0;
  const te = e.getParameter(e.VERSION);
  te.indexOf("WebGL") !== -1 ? (ee = parseFloat(/^WebGL (\d)/.exec(te)[1]), O = ee >= 1) : te.indexOf("OpenGL ES") !== -1 && (ee = parseFloat(/^OpenGL ES (\d)/.exec(te)[1]), O = ee >= 2);
  let ie = null, de = {};
  const Se = e.getParameter(e.SCISSOR_BOX), Qe = e.getParameter(e.VIEWPORT), je = new Ze().fromArray(Se), P = new Ze().fromArray(Qe);
  function K(D, Y, $, fe) {
    const ve = /* @__PURE__ */ new Uint8Array(4), Z = e.createTexture();
    e.bindTexture(D, Z), e.texParameteri(D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(D, e.TEXTURE_MAG_FILTER, e.NEAREST);
    for (let le = 0; le < $; le++) D === e.TEXTURE_3D || D === e.TEXTURE_2D_ARRAY ? e.texImage3D(Y, 0, e.RGBA, 1, 1, fe, 0, e.RGBA, e.UNSIGNED_BYTE, ve) : e.texImage2D(Y + le, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, ve);
    return Z;
  }
  const ae = {};
  ae[e.TEXTURE_2D] = K(e.TEXTURE_2D, e.TEXTURE_2D, 1), ae[e.TEXTURE_CUBE_MAP] = K(e.TEXTURE_CUBE_MAP, e.TEXTURE_CUBE_MAP_POSITIVE_X, 6), ae[e.TEXTURE_2D_ARRAY] = K(e.TEXTURE_2D_ARRAY, e.TEXTURE_2D_ARRAY, 1, 1), ae[e.TEXTURE_3D] = K(e.TEXTURE_3D, e.TEXTURE_3D, 1, 1), s.setClear(0, 0, 0, 1), a.setClear(1), o.setClear(0), ue(e.DEPTH_TEST), a.setFunc(3), kt(!1), nt(1), ue(e.CULL_FACE), bt(0);
  function ue(D) {
    h[D] !== !0 && (e.enable(D), h[D] = !0);
  }
  function Ae(D) {
    h[D] !== !1 && (e.disable(D), h[D] = !1);
  }
  function Ce(D, Y) {
    return d[D] !== Y ? (e.bindFramebuffer(D, Y), d[D] = Y, D === e.DRAW_FRAMEBUFFER && (d[e.FRAMEBUFFER] = Y), D === e.FRAMEBUFFER && (d[e.DRAW_FRAMEBUFFER] = Y), !0) : !1;
  }
  function Le(D, Y) {
    let $ = g, fe = !1;
    if (D) {
      $ = p.get(Y), $ === void 0 && ($ = [], p.set(Y, $));
      const ve = D.textures;
      if ($.length !== ve.length || $[0] !== e.COLOR_ATTACHMENT0) {
        for (let Z = 0, le = ve.length; Z < le; Z++) $[Z] = e.COLOR_ATTACHMENT0 + Z;
        $.length = ve.length, fe = !0;
      }
    } else $[0] !== e.BACK && ($[0] = e.BACK, fe = !0);
    fe && e.drawBuffers($);
  }
  function Xe(D) {
    return _ !== D ? (e.useProgram(D), _ = D, !0) : !1;
  }
  const Ve = {
    100: e.FUNC_ADD,
    101: e.FUNC_SUBTRACT,
    102: e.FUNC_REVERSE_SUBTRACT
  };
  Ve[103] = e.MIN, Ve[104] = e.MAX;
  const it = {
    200: e.ZERO,
    201: e.ONE,
    202: e.SRC_COLOR,
    204: e.SRC_ALPHA,
    210: e.SRC_ALPHA_SATURATE,
    208: e.DST_COLOR,
    206: e.DST_ALPHA,
    203: e.ONE_MINUS_SRC_COLOR,
    205: e.ONE_MINUS_SRC_ALPHA,
    209: e.ONE_MINUS_DST_COLOR,
    207: e.ONE_MINUS_DST_ALPHA,
    211: e.CONSTANT_COLOR,
    212: e.ONE_MINUS_CONSTANT_COLOR,
    213: e.CONSTANT_ALPHA,
    214: e.ONE_MINUS_CONSTANT_ALPHA
  };
  function bt(D, Y, $, fe, ve, Z, le, we, wt, et) {
    if (D === 0) {
      m === !0 && (Ae(e.BLEND), m = !1);
      return;
    }
    if (m === !1 && (ue(e.BLEND), m = !0), D !== 5) {
      if (D !== f || et !== V) {
        if ((T !== 100 || E !== 100) && (e.blendEquation(e.FUNC_ADD), T = 100, E = 100), et) switch (D) {
          case 1:
            e.blendFuncSeparate(e.ONE, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
            break;
          case 2:
            e.blendFunc(e.ONE, e.ONE);
            break;
          case 3:
            e.blendFuncSeparate(e.ZERO, e.ONE_MINUS_SRC_COLOR, e.ZERO, e.ONE);
            break;
          case 4:
            e.blendFuncSeparate(e.DST_COLOR, e.ONE_MINUS_SRC_ALPHA, e.ZERO, e.ONE);
            break;
          default:
            Re("WebGLState: Invalid blending: ", D);
        }
        else switch (D) {
          case 1:
            e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
            break;
          case 2:
            e.blendFuncSeparate(e.SRC_ALPHA, e.ONE, e.ONE, e.ONE);
            break;
          case 3:
            Re("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
            break;
          case 4:
            Re("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
            break;
          default:
            Re("WebGLState: Invalid blending: ", D);
        }
        A = null, M = null, w = null, C = null, v.set(0, 0, 0), y = 0, f = D, V = et;
      }
      return;
    }
    ve = ve || Y, Z = Z || $, le = le || fe, (Y !== T || ve !== E) && (e.blendEquationSeparate(Ve[Y], Ve[ve]), T = Y, E = ve), ($ !== A || fe !== M || Z !== w || le !== C) && (e.blendFuncSeparate(it[$], it[fe], it[Z], it[le]), A = $, M = fe, w = Z, C = le), (we.equals(v) === !1 || wt !== y) && (e.blendColor(we.r, we.g, we.b, wt), v.copy(we), y = wt), f = D, V = !1;
  }
  function It(D, Y) {
    D.side === 2 ? Ae(e.CULL_FACE) : ue(e.CULL_FACE);
    let $ = D.side === 1;
    Y && ($ = !$), kt($), D.blending === 1 && D.transparent === !1 ? bt(0) : bt(D.blending, D.blendEquation, D.blendSrc, D.blendDst, D.blendEquationAlpha, D.blendSrcAlpha, D.blendDstAlpha, D.blendColor, D.blendAlpha, D.premultipliedAlpha), a.setFunc(D.depthFunc), a.setTest(D.depthTest), a.setMask(D.depthWrite), s.setMask(D.colorWrite);
    const fe = D.stencilWrite;
    o.setTest(fe), fe && (o.setMask(D.stencilWriteMask), o.setFunc(D.stencilFunc, D.stencilRef, D.stencilFuncMask), o.setOp(D.stencilFail, D.stencilZFail, D.stencilZPass)), mt(D.polygonOffset, D.polygonOffsetFactor, D.polygonOffsetUnits), D.alphaToCoverage === !0 ? ue(e.SAMPLE_ALPHA_TO_COVERAGE) : Ae(e.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function kt(D) {
    R !== D && (D ? e.frontFace(e.CW) : e.frontFace(e.CCW), R = D);
  }
  function nt(D) {
    D !== 0 ? (ue(e.CULL_FACE), D !== k && (D === 1 ? e.cullFace(e.BACK) : D === 2 ? e.cullFace(e.FRONT) : e.cullFace(e.FRONT_AND_BACK))) : Ae(e.CULL_FACE), k = D;
  }
  function _t(D) {
    D !== q && (O && e.lineWidth(D), q = D);
  }
  function mt(D, Y, $) {
    D ? (ue(e.POLYGON_OFFSET_FILL), (X !== Y || z !== $) && (X = Y, z = $, a.getReversed() && (Y = -Y), e.polygonOffset(Y, $))) : Ae(e.POLYGON_OFFSET_FILL);
  }
  function ut(D) {
    D ? ue(e.SCISSOR_TEST) : Ae(e.SCISSOR_TEST);
  }
  function I(D) {
    D === void 0 && (D = e.TEXTURE0 + j - 1), ie !== D && (e.activeTexture(D), ie = D);
  }
  function Bt(D, Y, $) {
    $ === void 0 && (ie === null ? $ = e.TEXTURE0 + j - 1 : $ = ie);
    let fe = de[$];
    fe === void 0 && (fe = {
      type: void 0,
      texture: void 0
    }, de[$] = fe), (fe.type !== D || fe.texture !== Y) && (ie !== $ && (e.activeTexture($), ie = $), e.bindTexture(D, Y || ae[D]), fe.type = D, fe.texture = Y);
  }
  function Ke() {
    const D = de[ie];
    D !== void 0 && D.type !== void 0 && (e.bindTexture(D.type, null), D.type = void 0, D.texture = void 0);
  }
  function rt() {
    try {
      e.compressedTexImage2D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function S() {
    try {
      e.compressedTexImage3D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function b() {
    try {
      e.texSubImage2D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function L() {
    try {
      e.texSubImage3D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function W() {
    try {
      e.compressedTexSubImage2D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function J() {
    try {
      e.compressedTexSubImage3D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function re() {
    try {
      e.texStorage2D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function oe() {
    try {
      e.texStorage3D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function N() {
    try {
      e.texImage2D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function ne() {
    try {
      e.texImage3D(...arguments);
    } catch (D) {
      Re("WebGLState:", D);
    }
  }
  function pe(D) {
    return u[D] !== void 0 ? u[D] : e.getParameter(D);
  }
  function be(D, Y) {
    u[D] !== Y && (e.pixelStorei(D, Y), u[D] = Y);
  }
  function Q(D) {
    je.equals(D) === !1 && (e.scissor(D.x, D.y, D.z, D.w), je.copy(D));
  }
  function Me(D) {
    P.equals(D) === !1 && (e.viewport(D.x, D.y, D.z, D.w), P.copy(D));
  }
  function ye(D, Y) {
    let $ = l.get(Y);
    $ === void 0 && ($ = /* @__PURE__ */ new WeakMap(), l.set(Y, $));
    let fe = $.get(D);
    fe === void 0 && (fe = e.getUniformBlockIndex(Y, D.name), $.set(D, fe));
  }
  function De(D, Y) {
    const $ = l.get(Y).get(D);
    c.get(Y) !== $ && (e.uniformBlockBinding(Y, $, D.__bindingPointIndex), c.set(Y, $));
  }
  function He() {
    e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SCISSOR_TEST), e.disable(e.STENCIL_TEST), e.disable(e.SAMPLE_ALPHA_TO_COVERAGE), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ONE, e.ZERO), e.blendFuncSeparate(e.ONE, e.ZERO, e.ONE, e.ZERO), e.blendColor(0, 0, 0, 0), e.colorMask(!0, !0, !0, !0), e.clearColor(0, 0, 0, 0), e.depthMask(!0), e.depthFunc(e.LESS), a.setReversed(!1), e.clearDepth(1), e.stencilMask(4294967295), e.stencilFunc(e.ALWAYS, 0, 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP), e.clearStencil(0), e.cullFace(e.BACK), e.frontFace(e.CCW), e.polygonOffset(0, 0), e.activeTexture(e.TEXTURE0), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), e.bindFramebuffer(e.READ_FRAMEBUFFER, null), e.useProgram(null), e.lineWidth(1), e.scissor(0, 0, e.canvas.width, e.canvas.height), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.pixelStorei(e.PACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.pixelStorei(e.PACK_ROW_LENGTH, 0), e.pixelStorei(e.PACK_SKIP_PIXELS, 0), e.pixelStorei(e.PACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_ROW_LENGTH, 0), e.pixelStorei(e.UNPACK_IMAGE_HEIGHT, 0), e.pixelStorei(e.UNPACK_SKIP_PIXELS, 0), e.pixelStorei(e.UNPACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_SKIP_IMAGES, 0), h = {}, u = {}, ie = null, de = {}, d = {}, p = /* @__PURE__ */ new WeakMap(), g = [], _ = null, m = !1, f = null, T = null, A = null, M = null, E = null, w = null, C = null, v = new Te(0, 0, 0), y = 0, V = !1, R = null, k = null, q = null, X = null, z = null, je.set(0, 0, e.canvas.width, e.canvas.height), P.set(0, 0, e.canvas.width, e.canvas.height), s.reset(), a.reset(), o.reset();
  }
  return {
    buffers: {
      color: s,
      depth: a,
      stencil: o
    },
    enable: ue,
    disable: Ae,
    bindFramebuffer: Ce,
    drawBuffers: Le,
    useProgram: Xe,
    setBlending: bt,
    setMaterial: It,
    setFlipSided: kt,
    setCullFace: nt,
    setLineWidth: _t,
    setPolygonOffset: mt,
    setScissorTest: ut,
    activeTexture: I,
    bindTexture: Bt,
    unbindTexture: Ke,
    compressedTexImage2D: rt,
    compressedTexImage3D: S,
    texImage2D: N,
    texImage3D: ne,
    pixelStorei: be,
    getParameter: pe,
    updateUBOMapping: ye,
    uniformBlockBinding: De,
    texStorage2D: re,
    texStorage3D: oe,
    texSubImage2D: b,
    texSubImage3D: L,
    compressedTexSubImage2D: W,
    compressedTexSubImage3D: J,
    scissor: Q,
    viewport: Me,
    reset: He
  };
}
function zf(e, t, i, n, r, s, a) {
  const o = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, c = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), l = new Fe(), h = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new Set();
  let d;
  const p = /* @__PURE__ */ new WeakMap();
  let g = !1;
  try {
    g = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function _(S, b) {
    return g ? new OffscreenCanvas(S, b) : Qn("canvas");
  }
  function m(S, b, L) {
    let W = 1;
    const J = rt(S);
    if ((J.width > L || J.height > L) && (W = L / Math.max(J.width, J.height)), W < 1)
      if (typeof HTMLImageElement < "u" && S instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && S instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && S instanceof ImageBitmap || typeof VideoFrame < "u" && S instanceof VideoFrame) {
        const re = Math.floor(W * J.width), oe = Math.floor(W * J.height);
        d === void 0 && (d = _(re, oe));
        const N = b ? _(re, oe) : d;
        return N.width = re, N.height = oe, N.getContext("2d").drawImage(S, 0, 0, re, oe), xe("WebGLRenderer: Texture has been resized from (" + J.width + "x" + J.height + ") to (" + re + "x" + oe + ")."), N;
      } else
        return "data" in S && xe("WebGLRenderer: Image in DataTexture is too big (" + J.width + "x" + J.height + ")."), S;
    return S;
  }
  function f(S) {
    return S.generateMipmaps;
  }
  function T(S) {
    e.generateMipmap(S);
  }
  function A(S) {
    return S.isWebGLCubeRenderTarget ? e.TEXTURE_CUBE_MAP : S.isWebGL3DRenderTarget ? e.TEXTURE_3D : S.isWebGLArrayRenderTarget || S.isCompressedArrayTexture ? e.TEXTURE_2D_ARRAY : e.TEXTURE_2D;
  }
  function M(S, b, L, W, J, re = !1) {
    if (S !== null) {
      if (e[S] !== void 0) return e[S];
      xe("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + S + "'");
    }
    let oe;
    W && (oe = t.get("EXT_texture_norm16"), oe || xe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
    let N = b;
    if (b === e.RED && (L === e.FLOAT && (N = e.R32F), L === e.HALF_FLOAT && (N = e.R16F), L === e.UNSIGNED_BYTE && (N = e.R8), L === e.UNSIGNED_SHORT && oe && (N = oe.R16_EXT), L === e.SHORT && oe && (N = oe.R16_SNORM_EXT)), b === e.RED_INTEGER && (L === e.UNSIGNED_BYTE && (N = e.R8UI), L === e.UNSIGNED_SHORT && (N = e.R16UI), L === e.UNSIGNED_INT && (N = e.R32UI), L === e.BYTE && (N = e.R8I), L === e.SHORT && (N = e.R16I), L === e.INT && (N = e.R32I)), b === e.RG && (L === e.FLOAT && (N = e.RG32F), L === e.HALF_FLOAT && (N = e.RG16F), L === e.UNSIGNED_BYTE && (N = e.RG8), L === e.UNSIGNED_SHORT && oe && (N = oe.RG16_EXT), L === e.SHORT && oe && (N = oe.RG16_SNORM_EXT)), b === e.RG_INTEGER && (L === e.UNSIGNED_BYTE && (N = e.RG8UI), L === e.UNSIGNED_SHORT && (N = e.RG16UI), L === e.UNSIGNED_INT && (N = e.RG32UI), L === e.BYTE && (N = e.RG8I), L === e.SHORT && (N = e.RG16I), L === e.INT && (N = e.RG32I)), b === e.RGB_INTEGER && (L === e.UNSIGNED_BYTE && (N = e.RGB8UI), L === e.UNSIGNED_SHORT && (N = e.RGB16UI), L === e.UNSIGNED_INT && (N = e.RGB32UI), L === e.BYTE && (N = e.RGB8I), L === e.SHORT && (N = e.RGB16I), L === e.INT && (N = e.RGB32I)), b === e.RGBA_INTEGER && (L === e.UNSIGNED_BYTE && (N = e.RGBA8UI), L === e.UNSIGNED_SHORT && (N = e.RGBA16UI), L === e.UNSIGNED_INT && (N = e.RGBA32UI), L === e.BYTE && (N = e.RGBA8I), L === e.SHORT && (N = e.RGBA16I), L === e.INT && (N = e.RGBA32I)), b === e.RGB && (L === e.UNSIGNED_SHORT && oe && (N = oe.RGB16_EXT), L === e.SHORT && oe && (N = oe.RGB16_SNORM_EXT), L === e.UNSIGNED_INT_5_9_9_9_REV && (N = e.RGB9_E5), L === e.UNSIGNED_INT_10F_11F_11F_REV && (N = e.R11F_G11F_B10F)), b === e.RGBA) {
      const ne = re ? Vr : Ge.getTransfer(J);
      L === e.FLOAT && (N = e.RGBA32F), L === e.HALF_FLOAT && (N = e.RGBA16F), L === e.UNSIGNED_BYTE && (N = ne === "srgb" ? e.SRGB8_ALPHA8 : e.RGBA8), L === e.UNSIGNED_SHORT && oe && (N = oe.RGBA16_EXT), L === e.SHORT && oe && (N = oe.RGBA16_SNORM_EXT), L === e.UNSIGNED_SHORT_4_4_4_4 && (N = e.RGBA4), L === e.UNSIGNED_SHORT_5_5_5_1 && (N = e.RGB5_A1);
    }
    return (N === e.R16F || N === e.R32F || N === e.RG16F || N === e.RG32F || N === e.RGBA16F || N === e.RGBA32F) && t.get("EXT_color_buffer_float"), N;
  }
  function E(S, b) {
    let L;
    return S ? b === null || b === 1014 || b === 1020 ? L = e.DEPTH24_STENCIL8 : b === 1015 ? L = e.DEPTH32F_STENCIL8 : b === 1012 && (L = e.DEPTH24_STENCIL8, xe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : b === null || b === 1014 || b === 1020 ? L = e.DEPTH_COMPONENT24 : b === 1015 ? L = e.DEPTH_COMPONENT32F : b === 1012 && (L = e.DEPTH_COMPONENT16), L;
  }
  function w(S, b) {
    return f(S) === !0 || S.isFramebufferTexture && S.minFilter !== 1003 && S.minFilter !== 1006 ? Math.log2(Math.max(b.width, b.height)) + 1 : S.mipmaps !== void 0 && S.mipmaps.length > 0 ? S.mipmaps.length : S.isCompressedTexture && Array.isArray(S.image) ? b.mipmaps.length : 1;
  }
  function C(S) {
    const b = S.target;
    b.removeEventListener("dispose", C), y(b), b.isVideoTexture && h.delete(b), b.isHTMLTexture && u.delete(b);
  }
  function v(S) {
    const b = S.target;
    b.removeEventListener("dispose", v), R(b);
  }
  function y(S) {
    const b = n.get(S);
    if (b.__webglInit === void 0) return;
    const L = S.source, W = p.get(L);
    if (W) {
      const J = W[b.__cacheKey];
      J.usedTimes--, J.usedTimes === 0 && V(S), Object.keys(W).length === 0 && p.delete(L);
    }
    n.remove(S);
  }
  function V(S) {
    const b = n.get(S);
    e.deleteTexture(b.__webglTexture);
    const L = S.source, W = p.get(L);
    delete W[b.__cacheKey], a.memory.textures--;
  }
  function R(S) {
    const b = n.get(S);
    if (S.depthTexture && (S.depthTexture.dispose(), n.remove(S.depthTexture)), S.isWebGLCubeRenderTarget) for (let W = 0; W < 6; W++) {
      if (Array.isArray(b.__webglFramebuffer[W])) for (let J = 0; J < b.__webglFramebuffer[W].length; J++) e.deleteFramebuffer(b.__webglFramebuffer[W][J]);
      else e.deleteFramebuffer(b.__webglFramebuffer[W]);
      b.__webglDepthbuffer && e.deleteRenderbuffer(b.__webglDepthbuffer[W]);
    }
    else {
      if (Array.isArray(b.__webglFramebuffer)) for (let W = 0; W < b.__webglFramebuffer.length; W++) e.deleteFramebuffer(b.__webglFramebuffer[W]);
      else e.deleteFramebuffer(b.__webglFramebuffer);
      if (b.__webglDepthbuffer && e.deleteRenderbuffer(b.__webglDepthbuffer), b.__webglMultisampledFramebuffer && e.deleteFramebuffer(b.__webglMultisampledFramebuffer), b.__webglColorRenderbuffer)
        for (let W = 0; W < b.__webglColorRenderbuffer.length; W++) b.__webglColorRenderbuffer[W] && e.deleteRenderbuffer(b.__webglColorRenderbuffer[W]);
      b.__webglDepthRenderbuffer && e.deleteRenderbuffer(b.__webglDepthRenderbuffer);
    }
    const L = S.textures;
    for (let W = 0, J = L.length; W < J; W++) {
      const re = n.get(L[W]);
      re.__webglTexture && (e.deleteTexture(re.__webglTexture), a.memory.textures--), n.remove(L[W]);
    }
    n.remove(S);
  }
  let k = 0;
  function q() {
    k = 0;
  }
  function X() {
    return k;
  }
  function z(S) {
    k = S;
  }
  function j() {
    const S = k;
    return S >= r.maxTextures && xe("WebGLTextures: Trying to use " + S + " texture units while this GPU supports only " + r.maxTextures), k += 1, S;
  }
  function O(S) {
    const b = [];
    return b.push(S.wrapS), b.push(S.wrapT), b.push(S.wrapR || 0), b.push(S.magFilter), b.push(S.minFilter), b.push(S.anisotropy), b.push(S.internalFormat), b.push(S.format), b.push(S.type), b.push(S.generateMipmaps), b.push(S.premultiplyAlpha), b.push(S.flipY), b.push(S.unpackAlignment), b.push(S.colorSpace), b.join();
  }
  function ee(S, b) {
    const L = n.get(S);
    if (S.isVideoTexture && Bt(S), S.isRenderTargetTexture === !1 && S.isExternalTexture !== !0 && S.version > 0 && L.__version !== S.version) {
      const W = S.image;
      if (W === null) xe("WebGLRenderer: Texture marked for update but no image data found.");
      else if (W.complete === !1) xe("WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Ae(L, S, b);
        return;
      }
    } else S.isExternalTexture && (L.__webglTexture = S.sourceTexture ? S.sourceTexture : null);
    i.bindTexture(e.TEXTURE_2D, L.__webglTexture, e.TEXTURE0 + b);
  }
  function te(S, b) {
    const L = n.get(S);
    if (S.isRenderTargetTexture === !1 && S.version > 0 && L.__version !== S.version) {
      Ae(L, S, b);
      return;
    } else S.isExternalTexture && (L.__webglTexture = S.sourceTexture ? S.sourceTexture : null);
    i.bindTexture(e.TEXTURE_2D_ARRAY, L.__webglTexture, e.TEXTURE0 + b);
  }
  function ie(S, b) {
    const L = n.get(S);
    if (S.isRenderTargetTexture === !1 && S.version > 0 && L.__version !== S.version) {
      Ae(L, S, b);
      return;
    }
    i.bindTexture(e.TEXTURE_3D, L.__webglTexture, e.TEXTURE0 + b);
  }
  function de(S, b) {
    const L = n.get(S);
    if (S.isCubeDepthTexture !== !0 && S.version > 0 && L.__version !== S.version) {
      Ce(L, S, b);
      return;
    }
    i.bindTexture(e.TEXTURE_CUBE_MAP, L.__webglTexture, e.TEXTURE0 + b);
  }
  const Se = {
    [Br]: e.REPEAT,
    [ai]: e.CLAMP_TO_EDGE,
    [Gr]: e.MIRRORED_REPEAT
  }, Qe = {
    [Et]: e.NEAREST,
    [Yo]: e.NEAREST_MIPMAP_NEAREST,
    [Jo]: e.NEAREST_MIPMAP_LINEAR,
    [Lt]: e.LINEAR,
    [$o]: e.LINEAR_MIPMAP_NEAREST,
    [nr]: e.LINEAR_MIPMAP_LINEAR
  }, je = {
    512: e.NEVER,
    519: e.ALWAYS,
    513: e.LESS,
    515: e.LEQUAL,
    514: e.EQUAL,
    518: e.GEQUAL,
    516: e.GREATER,
    517: e.NOTEQUAL
  };
  function P(S, b) {
    if (b.type === 1015 && t.has("OES_texture_float_linear") === !1 && (b.magFilter === 1006 || b.magFilter === 1007 || b.magFilter === 1005 || b.magFilter === 1008 || b.minFilter === 1006 || b.minFilter === 1007 || b.minFilter === 1005 || b.minFilter === 1008) && xe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), e.texParameteri(S, e.TEXTURE_WRAP_S, Se[b.wrapS]), e.texParameteri(S, e.TEXTURE_WRAP_T, Se[b.wrapT]), (S === e.TEXTURE_3D || S === e.TEXTURE_2D_ARRAY) && e.texParameteri(S, e.TEXTURE_WRAP_R, Se[b.wrapR]), e.texParameteri(S, e.TEXTURE_MAG_FILTER, Qe[b.magFilter]), e.texParameteri(S, e.TEXTURE_MIN_FILTER, Qe[b.minFilter]), b.compareFunction && (e.texParameteri(S, e.TEXTURE_COMPARE_MODE, e.COMPARE_REF_TO_TEXTURE), e.texParameteri(S, e.TEXTURE_COMPARE_FUNC, je[b.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
      if (b.magFilter === 1003 || b.minFilter !== 1005 && b.minFilter !== 1008 || b.type === 1015 && t.has("OES_texture_float_linear") === !1) return;
      if (b.anisotropy > 1 || n.get(b).__currentAnisotropy) {
        const L = t.get("EXT_texture_filter_anisotropic");
        e.texParameterf(S, L.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(b.anisotropy, r.getMaxAnisotropy())), n.get(b).__currentAnisotropy = b.anisotropy;
      }
    }
  }
  function K(S, b) {
    let L = !1;
    S.__webglInit === void 0 && (S.__webglInit = !0, b.addEventListener("dispose", C));
    const W = b.source;
    let J = p.get(W);
    J === void 0 && (J = {}, p.set(W, J));
    const re = O(b);
    if (re !== S.__cacheKey) {
      J[re] === void 0 && (J[re] = {
        texture: e.createTexture(),
        usedTimes: 0
      }, a.memory.textures++, L = !0), J[re].usedTimes++;
      const oe = J[S.__cacheKey];
      oe !== void 0 && (J[S.__cacheKey].usedTimes--, oe.usedTimes === 0 && V(b)), S.__cacheKey = re, S.__webglTexture = J[re].texture;
    }
    return L;
  }
  function ae(S, b, L) {
    return Math.floor(Math.floor(S / L) / b);
  }
  function ue(S, b, L, W) {
    const re = S.updateRanges;
    if (re.length === 0) i.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, b.width, b.height, L, W, b.data);
    else {
      re.sort((be, Q) => be.start - Q.start);
      let oe = 0;
      for (let be = 1; be < re.length; be++) {
        const Q = re[oe], Me = re[be], ye = Q.start + Q.count, De = ae(Me.start, b.width, 4), He = ae(Q.start, b.width, 4);
        Me.start <= ye + 1 && De === He && ae(Me.start + Me.count - 1, b.width, 4) === De ? Q.count = Math.max(Q.count, Me.start + Me.count - Q.start) : (++oe, re[oe] = Me);
      }
      re.length = oe + 1;
      const N = i.getParameter(e.UNPACK_ROW_LENGTH), ne = i.getParameter(e.UNPACK_SKIP_PIXELS), pe = i.getParameter(e.UNPACK_SKIP_ROWS);
      i.pixelStorei(e.UNPACK_ROW_LENGTH, b.width);
      for (let be = 0, Q = re.length; be < Q; be++) {
        const Me = re[be], ye = Math.floor(Me.start / 4), De = Math.ceil(Me.count / 4), He = ye % b.width, D = Math.floor(ye / b.width), Y = De, $ = 1;
        i.pixelStorei(e.UNPACK_SKIP_PIXELS, He), i.pixelStorei(e.UNPACK_SKIP_ROWS, D), i.texSubImage2D(e.TEXTURE_2D, 0, He, D, Y, $, L, W, b.data);
      }
      S.clearUpdateRanges(), i.pixelStorei(e.UNPACK_ROW_LENGTH, N), i.pixelStorei(e.UNPACK_SKIP_PIXELS, ne), i.pixelStorei(e.UNPACK_SKIP_ROWS, pe);
    }
  }
  function Ae(S, b, L) {
    let W = e.TEXTURE_2D;
    (b.isDataArrayTexture || b.isCompressedArrayTexture) && (W = e.TEXTURE_2D_ARRAY), b.isData3DTexture && (W = e.TEXTURE_3D);
    const J = K(S, b), re = b.source;
    i.bindTexture(W, S.__webglTexture, e.TEXTURE0 + L);
    const oe = n.get(re);
    if (re.version !== oe.__version || J === !0) {
      if (i.activeTexture(e.TEXTURE0 + L), !(typeof ImageBitmap < "u" && b.image instanceof ImageBitmap)) {
        const Y = Ge.getPrimaries(Ge.workingColorSpace), $ = b.colorSpace === "" ? null : Ge.getPrimaries(b.colorSpace), fe = b.colorSpace === "" || Y === $ ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
        i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, b.flipY), i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, b.premultiplyAlpha), i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, fe);
      }
      i.pixelStorei(e.UNPACK_ALIGNMENT, b.unpackAlignment);
      let N = m(b.image, !1, r.maxTextureSize);
      N = Ke(b, N);
      const ne = s.convert(b.format, b.colorSpace), pe = s.convert(b.type);
      let be = M(b.internalFormat, ne, pe, b.normalized, b.colorSpace, b.isVideoTexture);
      P(W, b);
      let Q;
      const Me = b.mipmaps, ye = b.isVideoTexture !== !0, De = oe.__version === void 0 || J === !0, He = re.dataReady, D = w(b, N);
      if (b.isDepthTexture)
        be = E(b.format === ic, b.type), De && (ye ? i.texStorage2D(e.TEXTURE_2D, 1, be, N.width, N.height) : i.texImage2D(e.TEXTURE_2D, 0, be, N.width, N.height, 0, ne, pe, null));
      else if (b.isDataTexture)
        if (Me.length > 0) {
          ye && De && i.texStorage2D(e.TEXTURE_2D, D, be, Me[0].width, Me[0].height);
          for (let Y = 0, $ = Me.length; Y < $; Y++)
            Q = Me[Y], ye ? He && i.texSubImage2D(e.TEXTURE_2D, Y, 0, 0, Q.width, Q.height, ne, pe, Q.data) : i.texImage2D(e.TEXTURE_2D, Y, be, Q.width, Q.height, 0, ne, pe, Q.data);
          b.generateMipmaps = !1;
        } else ye ? (De && i.texStorage2D(e.TEXTURE_2D, D, be, N.width, N.height), He && ue(b, N, ne, pe)) : i.texImage2D(e.TEXTURE_2D, 0, be, N.width, N.height, 0, ne, pe, N.data);
      else if (b.isCompressedTexture)
        if (b.isCompressedArrayTexture) {
          ye && De && i.texStorage3D(e.TEXTURE_2D_ARRAY, D, be, Me[0].width, Me[0].height, N.depth);
          for (let Y = 0, $ = Me.length; Y < $; Y++)
            if (Q = Me[Y], b.format !== 1023)
              if (ne !== null)
                if (ye) {
                  if (He)
                    if (b.layerUpdates.size > 0) {
                      const fe = ao(Q.width, Q.height, b.format, b.type);
                      for (const ve of b.layerUpdates) {
                        const Z = Q.data.subarray(ve * fe / Q.data.BYTES_PER_ELEMENT, (ve + 1) * fe / Q.data.BYTES_PER_ELEMENT);
                        i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, Y, 0, 0, ve, Q.width, Q.height, 1, ne, Z);
                      }
                      b.clearLayerUpdates();
                    } else i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, Y, 0, 0, 0, Q.width, Q.height, N.depth, ne, Q.data);
                } else i.compressedTexImage3D(e.TEXTURE_2D_ARRAY, Y, be, Q.width, Q.height, N.depth, 0, Q.data, 0, 0);
              else xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else ye ? He && i.texSubImage3D(e.TEXTURE_2D_ARRAY, Y, 0, 0, 0, Q.width, Q.height, N.depth, ne, pe, Q.data) : i.texImage3D(e.TEXTURE_2D_ARRAY, Y, be, Q.width, Q.height, N.depth, 0, ne, pe, Q.data);
        } else {
          ye && De && i.texStorage2D(e.TEXTURE_2D, D, be, Me[0].width, Me[0].height);
          for (let Y = 0, $ = Me.length; Y < $; Y++)
            Q = Me[Y], b.format !== 1023 ? ne !== null ? ye ? He && i.compressedTexSubImage2D(e.TEXTURE_2D, Y, 0, 0, Q.width, Q.height, ne, Q.data) : i.compressedTexImage2D(e.TEXTURE_2D, Y, be, Q.width, Q.height, 0, Q.data) : xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : ye ? He && i.texSubImage2D(e.TEXTURE_2D, Y, 0, 0, Q.width, Q.height, ne, pe, Q.data) : i.texImage2D(e.TEXTURE_2D, Y, be, Q.width, Q.height, 0, ne, pe, Q.data);
        }
      else if (b.isDataArrayTexture)
        if (ye) {
          if (De && i.texStorage3D(e.TEXTURE_2D_ARRAY, D, be, N.width, N.height, N.depth), He)
            if (b.layerUpdates.size > 0) {
              const Y = ao(N.width, N.height, b.format, b.type);
              for (const $ of b.layerUpdates) {
                const fe = N.data.subarray($ * Y / N.data.BYTES_PER_ELEMENT, ($ + 1) * Y / N.data.BYTES_PER_ELEMENT);
                i.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, $, N.width, N.height, 1, ne, pe, fe);
              }
              b.clearLayerUpdates();
            } else i.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, 0, N.width, N.height, N.depth, ne, pe, N.data);
        } else i.texImage3D(e.TEXTURE_2D_ARRAY, 0, be, N.width, N.height, N.depth, 0, ne, pe, N.data);
      else if (b.isData3DTexture)
        ye ? (De && i.texStorage3D(e.TEXTURE_3D, D, be, N.width, N.height, N.depth), He && i.texSubImage3D(e.TEXTURE_3D, 0, 0, 0, 0, N.width, N.height, N.depth, ne, pe, N.data)) : i.texImage3D(e.TEXTURE_3D, 0, be, N.width, N.height, N.depth, 0, ne, pe, N.data);
      else if (b.isFramebufferTexture) {
        if (De)
          if (ye) i.texStorage2D(e.TEXTURE_2D, D, be, N.width, N.height);
          else {
            let Y = N.width, $ = N.height;
            for (let fe = 0; fe < D; fe++)
              i.texImage2D(e.TEXTURE_2D, fe, be, Y, $, 0, ne, pe, null), Y >>= 1, $ >>= 1;
          }
      } else if (b.isHTMLTexture) {
        if ("texElementImage2D" in e) {
          const Y = e.canvas;
          if (Y.hasAttribute("layoutsubtree") || Y.setAttribute("layoutsubtree", "true"), N.parentNode !== Y) {
            Y.appendChild(N), u.add(b), Y.onpaint = ($) => {
              const fe = $.changedElements;
              for (const ve of u) fe.includes(ve.image) && (ve.needsUpdate = !0);
            }, Y.requestPaint();
            return;
          }
          if (e.texElementImage2D.length === 3) e.texElementImage2D(e.TEXTURE_2D, e.RGBA8, N);
          else {
            const fe = e.RGBA, ve = e.RGBA, Z = e.UNSIGNED_BYTE;
            e.texElementImage2D(e.TEXTURE_2D, 0, fe, ve, Z, N);
          }
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
        }
      } else if (Me.length > 0) {
        if (ye && De) {
          const Y = rt(Me[0]);
          i.texStorage2D(e.TEXTURE_2D, D, be, Y.width, Y.height);
        }
        for (let Y = 0, $ = Me.length; Y < $; Y++)
          Q = Me[Y], ye ? He && i.texSubImage2D(e.TEXTURE_2D, Y, 0, 0, ne, pe, Q) : i.texImage2D(e.TEXTURE_2D, Y, be, ne, pe, Q);
        b.generateMipmaps = !1;
      } else if (ye) {
        if (De) {
          const Y = rt(N);
          i.texStorage2D(e.TEXTURE_2D, D, be, Y.width, Y.height);
        }
        He && i.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, ne, pe, N);
      } else i.texImage2D(e.TEXTURE_2D, 0, be, ne, pe, N);
      f(b) && T(W), oe.__version = re.version, b.onUpdate && b.onUpdate(b);
    }
    S.__version = b.version;
  }
  function Ce(S, b, L) {
    if (b.image.length !== 6) return;
    const W = K(S, b), J = b.source;
    i.bindTexture(e.TEXTURE_CUBE_MAP, S.__webglTexture, e.TEXTURE0 + L);
    const re = n.get(J);
    if (J.version !== re.__version || W === !0) {
      i.activeTexture(e.TEXTURE0 + L);
      const oe = Ge.getPrimaries(Ge.workingColorSpace), N = b.colorSpace === "" ? null : Ge.getPrimaries(b.colorSpace), ne = b.colorSpace === "" || oe === N ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, b.flipY), i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, b.premultiplyAlpha), i.pixelStorei(e.UNPACK_ALIGNMENT, b.unpackAlignment), i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, ne);
      const pe = b.isCompressedTexture || b.image[0].isCompressedTexture, be = b.image[0] && b.image[0].isDataTexture, Q = [];
      for (let Z = 0; Z < 6; Z++)
        !pe && !be ? Q[Z] = m(b.image[Z], !0, r.maxCubemapSize) : Q[Z] = be ? b.image[Z].image : b.image[Z], Q[Z] = Ke(b, Q[Z]);
      const Me = Q[0], ye = s.convert(b.format, b.colorSpace), De = s.convert(b.type), He = M(b.internalFormat, ye, De, b.normalized, b.colorSpace), D = b.isVideoTexture !== !0, Y = re.__version === void 0 || W === !0, $ = J.dataReady;
      let fe = w(b, Me);
      P(e.TEXTURE_CUBE_MAP, b);
      let ve;
      if (pe) {
        D && Y && i.texStorage2D(e.TEXTURE_CUBE_MAP, fe, He, Me.width, Me.height);
        for (let Z = 0; Z < 6; Z++) {
          ve = Q[Z].mipmaps;
          for (let le = 0; le < ve.length; le++) {
            const we = ve[le];
            b.format !== 1023 ? ye !== null ? D ? $ && i.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le, 0, 0, we.width, we.height, ye, we.data) : i.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le, He, we.width, we.height, 0, we.data) : xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : D ? $ && i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le, 0, 0, we.width, we.height, ye, De, we.data) : i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le, He, we.width, we.height, 0, ye, De, we.data);
          }
        }
      } else {
        if (ve = b.mipmaps, D && Y) {
          ve.length > 0 && fe++;
          const Z = rt(Q[0]);
          i.texStorage2D(e.TEXTURE_CUBE_MAP, fe, He, Z.width, Z.height);
        }
        for (let Z = 0; Z < 6; Z++) if (be) {
          D ? $ && i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, 0, 0, Q[Z].width, Q[Z].height, ye, De, Q[Z].data) : i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, He, Q[Z].width, Q[Z].height, 0, ye, De, Q[Z].data);
          for (let le = 0; le < ve.length; le++) {
            const we = ve[le].image[Z].image;
            D ? $ && i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le + 1, 0, 0, we.width, we.height, ye, De, we.data) : i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le + 1, He, we.width, we.height, 0, ye, De, we.data);
          }
        } else {
          D ? $ && i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, 0, 0, ye, De, Q[Z]) : i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, 0, He, ye, De, Q[Z]);
          for (let le = 0; le < ve.length; le++) {
            const we = ve[le];
            D ? $ && i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le + 1, 0, 0, ye, De, we.image[Z]) : i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Z, le + 1, He, ye, De, we.image[Z]);
          }
        }
      }
      f(b) && T(e.TEXTURE_CUBE_MAP), re.__version = J.version, b.onUpdate && b.onUpdate(b);
    }
    S.__version = b.version;
  }
  function Le(S, b, L, W, J, re) {
    const oe = s.convert(L.format, L.colorSpace), N = s.convert(L.type), ne = M(L.internalFormat, oe, N, L.normalized, L.colorSpace), pe = n.get(b), be = n.get(L);
    if (be.__renderTarget = b, !pe.__hasExternalTextures) {
      const Q = Math.max(1, b.width >> re), Me = Math.max(1, b.height >> re);
      J === e.TEXTURE_3D || J === e.TEXTURE_2D_ARRAY ? i.texImage3D(J, re, ne, Q, Me, b.depth, 0, oe, N, null) : i.texImage2D(J, re, ne, Q, Me, 0, oe, N, null);
    }
    i.bindFramebuffer(e.FRAMEBUFFER, S), I(b) ? o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, W, J, be.__webglTexture, 0, ut(b)) : (J === e.TEXTURE_2D || J >= e.TEXTURE_CUBE_MAP_POSITIVE_X && J <= e.TEXTURE_CUBE_MAP_NEGATIVE_Z) && e.framebufferTexture2D(e.FRAMEBUFFER, W, J, be.__webglTexture, re), i.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  function Xe(S, b, L) {
    if (e.bindRenderbuffer(e.RENDERBUFFER, S), b.depthBuffer) {
      const W = b.depthTexture, J = W && W.isDepthTexture ? W.type : null, re = E(b.stencilBuffer, J), oe = b.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
      I(b) ? o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, ut(b), re, b.width, b.height) : L ? e.renderbufferStorageMultisample(e.RENDERBUFFER, ut(b), re, b.width, b.height) : e.renderbufferStorage(e.RENDERBUFFER, re, b.width, b.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, oe, e.RENDERBUFFER, S);
    } else {
      const W = b.textures;
      for (let J = 0; J < W.length; J++) {
        const re = W[J], oe = s.convert(re.format, re.colorSpace), N = s.convert(re.type), ne = M(re.internalFormat, oe, N, re.normalized, re.colorSpace);
        I(b) ? o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, ut(b), ne, b.width, b.height) : L ? e.renderbufferStorageMultisample(e.RENDERBUFFER, ut(b), ne, b.width, b.height) : e.renderbufferStorage(e.RENDERBUFFER, ne, b.width, b.height);
      }
    }
    e.bindRenderbuffer(e.RENDERBUFFER, null);
  }
  function Ve(S, b, L) {
    const W = b.isWebGLCubeRenderTarget === !0;
    if (i.bindFramebuffer(e.FRAMEBUFFER, S), !(b.depthTexture && b.depthTexture.isDepthTexture)) throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");
    const J = n.get(b.depthTexture);
    if (J.__renderTarget = b, (!J.__webglTexture || b.depthTexture.image.width !== b.width || b.depthTexture.image.height !== b.height) && (b.depthTexture.image.width = b.width, b.depthTexture.image.height = b.height, b.depthTexture.needsUpdate = !0), W) {
      if (J.__webglInit === void 0 && (J.__webglInit = !0, b.depthTexture.addEventListener("dispose", C)), J.__webglTexture === void 0) {
        J.__webglTexture = e.createTexture(), i.bindTexture(e.TEXTURE_CUBE_MAP, J.__webglTexture), P(e.TEXTURE_CUBE_MAP, b.depthTexture);
        const pe = s.convert(b.depthTexture.format), be = s.convert(b.depthTexture.type);
        let Q;
        b.depthTexture.format === 1026 ? Q = e.DEPTH_COMPONENT24 : b.depthTexture.format === 1027 && (Q = e.DEPTH24_STENCIL8);
        for (let Me = 0; Me < 6; Me++) e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + Me, 0, Q, b.width, b.height, 0, pe, be, null);
      }
    } else ee(b.depthTexture, 0);
    const re = J.__webglTexture, oe = ut(b), N = W ? e.TEXTURE_CUBE_MAP_POSITIVE_X + L : e.TEXTURE_2D, ne = b.depthTexture.format === 1027 ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
    if (b.depthTexture.format === 1026)
      I(b) ? o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, ne, N, re, 0, oe) : e.framebufferTexture2D(e.FRAMEBUFFER, ne, N, re, 0);
    else if (b.depthTexture.format === 1027)
      I(b) ? o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, ne, N, re, 0, oe) : e.framebufferTexture2D(e.FRAMEBUFFER, ne, N, re, 0);
    else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.");
  }
  function it(S) {
    const b = n.get(S), L = S.isWebGLCubeRenderTarget === !0;
    if (b.__boundDepthTexture !== S.depthTexture) {
      const W = S.depthTexture;
      if (b.__depthDisposeCallback && b.__depthDisposeCallback(), W) {
        const J = () => {
          delete b.__boundDepthTexture, delete b.__depthDisposeCallback, W.removeEventListener("dispose", J);
        };
        W.addEventListener("dispose", J), b.__depthDisposeCallback = J;
      }
      b.__boundDepthTexture = W;
    }
    if (S.depthTexture && !b.__autoAllocateDepthBuffer)
      if (L) for (let W = 0; W < 6; W++) Ve(b.__webglFramebuffer[W], S, W);
      else {
        const W = S.texture.mipmaps;
        W && W.length > 0 ? Ve(b.__webglFramebuffer[0], S, 0) : Ve(b.__webglFramebuffer, S, 0);
      }
    else if (L) {
      b.__webglDepthbuffer = [];
      for (let W = 0; W < 6; W++)
        if (i.bindFramebuffer(e.FRAMEBUFFER, b.__webglFramebuffer[W]), b.__webglDepthbuffer[W] === void 0)
          b.__webglDepthbuffer[W] = e.createRenderbuffer(), Xe(b.__webglDepthbuffer[W], S, !1);
        else {
          const J = S.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, re = b.__webglDepthbuffer[W];
          e.bindRenderbuffer(e.RENDERBUFFER, re), e.framebufferRenderbuffer(e.FRAMEBUFFER, J, e.RENDERBUFFER, re);
        }
    } else {
      const W = S.texture.mipmaps;
      if (W && W.length > 0 ? i.bindFramebuffer(e.FRAMEBUFFER, b.__webglFramebuffer[0]) : i.bindFramebuffer(e.FRAMEBUFFER, b.__webglFramebuffer), b.__webglDepthbuffer === void 0)
        b.__webglDepthbuffer = e.createRenderbuffer(), Xe(b.__webglDepthbuffer, S, !1);
      else {
        const J = S.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, re = b.__webglDepthbuffer;
        e.bindRenderbuffer(e.RENDERBUFFER, re), e.framebufferRenderbuffer(e.FRAMEBUFFER, J, e.RENDERBUFFER, re);
      }
    }
    i.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  function bt(S, b, L) {
    const W = n.get(S);
    b !== void 0 && Le(W.__webglFramebuffer, S, S.texture, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, 0), L !== void 0 && it(S);
  }
  function It(S) {
    const b = S.texture, L = n.get(S), W = n.get(b);
    S.addEventListener("dispose", v);
    const J = S.textures, re = S.isWebGLCubeRenderTarget === !0, oe = J.length > 1;
    if (oe || (W.__webglTexture === void 0 && (W.__webglTexture = e.createTexture()), W.__version = b.version, a.memory.textures++), re) {
      L.__webglFramebuffer = [];
      for (let N = 0; N < 6; N++) if (b.mipmaps && b.mipmaps.length > 0) {
        L.__webglFramebuffer[N] = [];
        for (let ne = 0; ne < b.mipmaps.length; ne++) L.__webglFramebuffer[N][ne] = e.createFramebuffer();
      } else L.__webglFramebuffer[N] = e.createFramebuffer();
    } else {
      if (b.mipmaps && b.mipmaps.length > 0) {
        L.__webglFramebuffer = [];
        for (let N = 0; N < b.mipmaps.length; N++) L.__webglFramebuffer[N] = e.createFramebuffer();
      } else L.__webglFramebuffer = e.createFramebuffer();
      if (oe) for (let N = 0, ne = J.length; N < ne; N++) {
        const pe = n.get(J[N]);
        pe.__webglTexture === void 0 && (pe.__webglTexture = e.createTexture(), a.memory.textures++);
      }
      if (S.samples > 0 && I(S) === !1) {
        L.__webglMultisampledFramebuffer = e.createFramebuffer(), L.__webglColorRenderbuffer = [], i.bindFramebuffer(e.FRAMEBUFFER, L.__webglMultisampledFramebuffer);
        for (let N = 0; N < J.length; N++) {
          const ne = J[N];
          L.__webglColorRenderbuffer[N] = e.createRenderbuffer(), e.bindRenderbuffer(e.RENDERBUFFER, L.__webglColorRenderbuffer[N]);
          const pe = s.convert(ne.format, ne.colorSpace), be = s.convert(ne.type), Q = M(ne.internalFormat, pe, be, ne.normalized, ne.colorSpace, S.isXRRenderTarget === !0), Me = ut(S);
          e.renderbufferStorageMultisample(e.RENDERBUFFER, Me, Q, S.width, S.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + N, e.RENDERBUFFER, L.__webglColorRenderbuffer[N]);
        }
        e.bindRenderbuffer(e.RENDERBUFFER, null), S.depthBuffer && (L.__webglDepthRenderbuffer = e.createRenderbuffer(), Xe(L.__webglDepthRenderbuffer, S, !0)), i.bindFramebuffer(e.FRAMEBUFFER, null);
      }
    }
    if (re) {
      i.bindTexture(e.TEXTURE_CUBE_MAP, W.__webglTexture), P(e.TEXTURE_CUBE_MAP, b);
      for (let N = 0; N < 6; N++) if (b.mipmaps && b.mipmaps.length > 0) for (let ne = 0; ne < b.mipmaps.length; ne++) Le(L.__webglFramebuffer[N][ne], S, b, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + N, ne);
      else Le(L.__webglFramebuffer[N], S, b, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + N, 0);
      f(b) && T(e.TEXTURE_CUBE_MAP), i.unbindTexture();
    } else if (oe) {
      for (let N = 0, ne = J.length; N < ne; N++) {
        const pe = J[N], be = n.get(pe);
        let Q = e.TEXTURE_2D;
        (S.isWebGL3DRenderTarget || S.isWebGLArrayRenderTarget) && (Q = S.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), i.bindTexture(Q, be.__webglTexture), P(Q, pe), Le(L.__webglFramebuffer, S, pe, e.COLOR_ATTACHMENT0 + N, Q, 0), f(pe) && T(Q);
      }
      i.unbindTexture();
    } else {
      let N = e.TEXTURE_2D;
      if ((S.isWebGL3DRenderTarget || S.isWebGLArrayRenderTarget) && (N = S.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), i.bindTexture(N, W.__webglTexture), P(N, b), b.mipmaps && b.mipmaps.length > 0) for (let ne = 0; ne < b.mipmaps.length; ne++) Le(L.__webglFramebuffer[ne], S, b, e.COLOR_ATTACHMENT0, N, ne);
      else Le(L.__webglFramebuffer, S, b, e.COLOR_ATTACHMENT0, N, 0);
      f(b) && T(N), i.unbindTexture();
    }
    S.depthBuffer && it(S);
  }
  function kt(S) {
    const b = S.textures;
    for (let L = 0, W = b.length; L < W; L++) {
      const J = b[L];
      if (f(J)) {
        const re = A(S), oe = n.get(J).__webglTexture;
        i.bindTexture(re, oe), T(re), i.unbindTexture();
      }
    }
  }
  const nt = [], _t = [];
  function mt(S) {
    if (S.samples > 0) {
      if (I(S) === !1) {
        const b = S.textures, L = S.width, W = S.height;
        let J = e.COLOR_BUFFER_BIT;
        const re = S.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, oe = n.get(S), N = b.length > 1;
        if (N) for (let pe = 0; pe < b.length; pe++)
          i.bindFramebuffer(e.FRAMEBUFFER, oe.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + pe, e.RENDERBUFFER, null), i.bindFramebuffer(e.FRAMEBUFFER, oe.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + pe, e.TEXTURE_2D, null, 0);
        i.bindFramebuffer(e.READ_FRAMEBUFFER, oe.__webglMultisampledFramebuffer);
        const ne = S.texture.mipmaps;
        ne && ne.length > 0 ? i.bindFramebuffer(e.DRAW_FRAMEBUFFER, oe.__webglFramebuffer[0]) : i.bindFramebuffer(e.DRAW_FRAMEBUFFER, oe.__webglFramebuffer);
        for (let pe = 0; pe < b.length; pe++) {
          if (S.resolveDepthBuffer && (S.depthBuffer && (J |= e.DEPTH_BUFFER_BIT), S.stencilBuffer && S.resolveStencilBuffer && (J |= e.STENCIL_BUFFER_BIT)), N) {
            e.framebufferRenderbuffer(e.READ_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.RENDERBUFFER, oe.__webglColorRenderbuffer[pe]);
            const be = n.get(b[pe]).__webglTexture;
            e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, be, 0);
          }
          e.blitFramebuffer(0, 0, L, W, 0, 0, L, W, J, e.NEAREST), c === !0 && (nt.length = 0, _t.length = 0, nt.push(e.COLOR_ATTACHMENT0 + pe), S.depthBuffer && S.resolveDepthBuffer === !1 && (nt.push(re), _t.push(re), e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, _t)), e.invalidateFramebuffer(e.READ_FRAMEBUFFER, nt));
        }
        if (i.bindFramebuffer(e.READ_FRAMEBUFFER, null), i.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), N) for (let pe = 0; pe < b.length; pe++) {
          i.bindFramebuffer(e.FRAMEBUFFER, oe.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + pe, e.RENDERBUFFER, oe.__webglColorRenderbuffer[pe]);
          const be = n.get(b[pe]).__webglTexture;
          i.bindFramebuffer(e.FRAMEBUFFER, oe.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + pe, e.TEXTURE_2D, be, 0);
        }
        i.bindFramebuffer(e.DRAW_FRAMEBUFFER, oe.__webglMultisampledFramebuffer);
      } else if (S.depthBuffer && S.resolveDepthBuffer === !1 && c) {
        const b = S.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
        e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, [b]);
      }
    }
  }
  function ut(S) {
    return Math.min(r.maxSamples, S.samples);
  }
  function I(S) {
    const b = n.get(S);
    return S.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && b.__useRenderToTexture !== !1;
  }
  function Bt(S) {
    const b = a.render.frame;
    h.get(S) !== b && (h.set(S, b), S.update());
  }
  function Ke(S, b) {
    const L = S.colorSpace, W = S.format, J = S.type;
    return S.isCompressedTexture === !0 || S.isVideoTexture === !0 || L !== "srgb-linear" && L !== "" && (Ge.getTransfer(L) === "srgb" ? (W !== 1023 || J !== 1009) && xe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : Re("WebGLTextures: Unsupported texture color space:", L)), b;
  }
  function rt(S) {
    return typeof HTMLImageElement < "u" && S instanceof HTMLImageElement ? (l.width = S.naturalWidth || S.width, l.height = S.naturalHeight || S.height) : typeof VideoFrame < "u" && S instanceof VideoFrame ? (l.width = S.displayWidth, l.height = S.displayHeight) : (l.width = S.width, l.height = S.height), l;
  }
  this.allocateTextureUnit = j, this.resetTextureUnits = q, this.getTextureUnits = X, this.setTextureUnits = z, this.setTexture2D = ee, this.setTexture2DArray = te, this.setTexture3D = ie, this.setTextureCube = de, this.rebindTextures = bt, this.setupRenderTarget = It, this.updateRenderTargetMipmap = kt, this.updateMultisampleRenderTarget = mt, this.setupDepthRenderbuffer = it, this.setupFrameBufferTexture = Le, this.useMultisampledRTT = I, this.isReversedDepthBuffer = function() {
    return i.buffers.depth.getReversed();
  };
}
function Vf(e, t) {
  function i(n, r = "") {
    let s;
    const a = Ge.getTransfer(r);
    if (n === 1009) return e.UNSIGNED_BYTE;
    if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
    if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
    if (n === 35902) return e.UNSIGNED_INT_5_9_9_9_REV;
    if (n === 35899) return e.UNSIGNED_INT_10F_11F_11F_REV;
    if (n === 1010) return e.BYTE;
    if (n === 1011) return e.SHORT;
    if (n === 1012) return e.UNSIGNED_SHORT;
    if (n === 1013) return e.INT;
    if (n === 1014) return e.UNSIGNED_INT;
    if (n === 1015) return e.FLOAT;
    if (n === 1016) return e.HALF_FLOAT;
    if (n === 1021) return e.ALPHA;
    if (n === 1022) return e.RGB;
    if (n === 1023) return e.RGBA;
    if (n === 1026) return e.DEPTH_COMPONENT;
    if (n === 1027) return e.DEPTH_STENCIL;
    if (n === 1028) return e.RED;
    if (n === 1029) return e.RED_INTEGER;
    if (n === 1030) return e.RG;
    if (n === 1031) return e.RG_INTEGER;
    if (n === 1033) return e.RGBA_INTEGER;
    if (n === 33776 || n === 33777 || n === 33778 || n === 33779)
      if (a === "srgb")
        if (s = t.get("WEBGL_compressed_texture_s3tc_srgb"), s !== null) {
          if (n === 33776) return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === 33777) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === 33778) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === 33779) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else return null;
      else if (s = t.get("WEBGL_compressed_texture_s3tc"), s !== null) {
        if (n === 33776) return s.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === 33777) return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === 33778) return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === 33779) return s.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
    if (n === 35840 || n === 35841 || n === 35842 || n === 35843)
      if (s = t.get("WEBGL_compressed_texture_pvrtc"), s !== null) {
        if (n === 35840) return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === 35841) return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === 35842) return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === 35843) return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
    if (n === 36196 || n === 37492 || n === 37496 || n === 37488 || n === 37489 || n === 37490 || n === 37491)
      if (s = t.get("WEBGL_compressed_texture_etc"), s !== null) {
        if (n === 36196 || n === 37492) return a === "srgb" ? s.COMPRESSED_SRGB8_ETC2 : s.COMPRESSED_RGB8_ETC2;
        if (n === 37496) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : s.COMPRESSED_RGBA8_ETC2_EAC;
        if (n === 37488) return s.COMPRESSED_R11_EAC;
        if (n === 37489) return s.COMPRESSED_SIGNED_R11_EAC;
        if (n === 37490) return s.COMPRESSED_RG11_EAC;
        if (n === 37491) return s.COMPRESSED_SIGNED_RG11_EAC;
      } else return null;
    if (n === 37808 || n === 37809 || n === 37810 || n === 37811 || n === 37812 || n === 37813 || n === 37814 || n === 37815 || n === 37816 || n === 37817 || n === 37818 || n === 37819 || n === 37820 || n === 37821)
      if (s = t.get("WEBGL_compressed_texture_astc"), s !== null) {
        if (n === 37808) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : s.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === 37809) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : s.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === 37810) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : s.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === 37811) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : s.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === 37812) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : s.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === 37813) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : s.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === 37814) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : s.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === 37815) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : s.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === 37816) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : s.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === 37817) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : s.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === 37818) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : s.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === 37819) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : s.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === 37820) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : s.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === 37821) return a === "srgb" ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : s.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
    if (n === 36492 || n === 36494 || n === 36495)
      if (s = t.get("EXT_texture_compression_bptc"), s !== null) {
        if (n === 36492) return a === "srgb" ? s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : s.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === 36494) return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === 36495) return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
    if (n === 36283 || n === 36284 || n === 36285 || n === 36286)
      if (s = t.get("EXT_texture_compression_rgtc"), s !== null) {
        if (n === 36283) return s.COMPRESSED_RED_RGTC1_EXT;
        if (n === 36284) return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === 36285) return s.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === 36286) return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
    return n === 1020 ? e.UNSIGNED_INT_24_8 : e[n] !== void 0 ? e[n] : null;
  }
  return { convert: i };
}
var Hf = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, Wf = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`, qf = class {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(e, t) {
    if (this.texture === null) {
      const i = new Ec(e.texture);
      (e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = i;
    }
  }
  getMesh(e) {
    if (this.texture !== null && this.mesh === null) {
      const t = e.cameras[0].viewport, i = new li({
        vertexShader: Hf,
        fragmentShader: Wf,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: t.z },
          depthHeight: { value: t.w }
        }
      });
      this.mesh = new At(new aa(20, 20), i);
    }
    return this.mesh;
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
  getDepthTexture() {
    return this.texture;
  }
}, Xf = class extends Yi {
  constructor(e, t) {
    super();
    const i = this;
    let n = null, r = 1, s = null, a = "local-floor", o = 1, c = null, l = null, h = null, u = null, d = null, p = null;
    const g = typeof XRWebGLBinding < "u", _ = new qf(), m = {}, f = t.getContextAttributes();
    let T = null, A = null;
    const M = [], E = [], w = new Fe();
    let C = null;
    const v = new Pt();
    v.viewport = new Ze();
    const y = new Pt();
    y.viewport = new Ze();
    const V = [v, y], R = new Sd();
    let k = null, q = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(P) {
      let K = M[P];
      return K === void 0 && (K = new hs(), M[P] = K), K.getTargetRaySpace();
    }, this.getControllerGrip = function(P) {
      let K = M[P];
      return K === void 0 && (K = new hs(), M[P] = K), K.getGripSpace();
    }, this.getHand = function(P) {
      let K = M[P];
      return K === void 0 && (K = new hs(), M[P] = K), K.getHandSpace();
    };
    function X(P) {
      const K = E.indexOf(P.inputSource);
      if (K === -1) return;
      const ae = M[K];
      ae !== void 0 && (ae.update(P.inputSource, P.frame, c || s), ae.dispatchEvent({
        type: P.type,
        data: P.inputSource
      }));
    }
    function z() {
      n.removeEventListener("select", X), n.removeEventListener("selectstart", X), n.removeEventListener("selectend", X), n.removeEventListener("squeeze", X), n.removeEventListener("squeezestart", X), n.removeEventListener("squeezeend", X), n.removeEventListener("end", z), n.removeEventListener("inputsourceschange", j);
      for (let P = 0; P < M.length; P++) {
        const K = E[P];
        K !== null && (E[P] = null, M[P].disconnect(K));
      }
      k = null, q = null, _.reset();
      for (const P in m) delete m[P];
      e.setRenderTarget(T), d = null, u = null, h = null, n = null, A = null, je.stop(), i.isPresenting = !1, e.setPixelRatio(C), e.setSize(w.width, w.height, !1), i.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(P) {
      r = P, i.isPresenting === !0 && xe("WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(P) {
      a = P, i.isPresenting === !0 && xe("WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return c || s;
    }, this.setReferenceSpace = function(P) {
      c = P;
    }, this.getBaseLayer = function() {
      return u !== null ? u : d;
    }, this.getBinding = function() {
      return h === null && g && (h = new XRWebGLBinding(n, t)), h;
    }, this.getFrame = function() {
      return p;
    }, this.getSession = function() {
      return n;
    }, this.setSession = async function(P) {
      if (n = P, n !== null) {
        if (T = e.getRenderTarget(), n.addEventListener("select", X), n.addEventListener("selectstart", X), n.addEventListener("selectend", X), n.addEventListener("squeeze", X), n.addEventListener("squeezestart", X), n.addEventListener("squeezeend", X), n.addEventListener("end", z), n.addEventListener("inputsourceschange", j), f.xrCompatible !== !0 && await t.makeXRCompatible(), C = e.getPixelRatio(), e.getSize(w), g && "createProjectionLayer" in XRWebGLBinding.prototype) {
          let K = null, ae = null, ue = null;
          f.depth && (ue = f.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, K = f.stencil ? ic : Jn, ae = f.stencil ? tc : Ki);
          const Ae = {
            colorFormat: t.RGBA8,
            depthFormat: ue,
            scaleFactor: r
          };
          h = this.getBinding(), u = h.createProjectionLayer(Ae), n.updateRenderState({ layers: [u] }), e.setPixelRatio(1), e.setSize(u.textureWidth, u.textureHeight, !1), A = new oi(u.textureWidth, u.textureHeight, {
            format: xn,
            type: Ui,
            depthTexture: new Tn(u.textureWidth, u.textureHeight, ae, void 0, void 0, void 0, void 0, void 0, void 0, K),
            stencilBuffer: f.stencil,
            colorSpace: e.outputColorSpace,
            samples: f.antialias ? 4 : 0,
            resolveDepthBuffer: u.ignoreDepthValues === !1,
            resolveStencilBuffer: u.ignoreDepthValues === !1
          });
        } else {
          const K = {
            antialias: f.antialias,
            alpha: !0,
            depth: f.depth,
            stencil: f.stencil,
            framebufferScaleFactor: r
          };
          d = new XRWebGLLayer(n, t, K), n.updateRenderState({ baseLayer: d }), e.setPixelRatio(1), e.setSize(d.framebufferWidth, d.framebufferHeight, !1), A = new oi(d.framebufferWidth, d.framebufferHeight, {
            format: xn,
            type: Ui,
            colorSpace: e.outputColorSpace,
            stencilBuffer: f.stencil,
            resolveDepthBuffer: d.ignoreDepthValues === !1,
            resolveStencilBuffer: d.ignoreDepthValues === !1
          });
        }
        A.isXRRenderTarget = !0, this.setFoveation(o), c = null, s = await n.requestReferenceSpace(a), je.setContext(n), je.start(), i.isPresenting = !0, i.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (n !== null) return n.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return _.getDepthTexture();
    };
    function j(P) {
      for (let K = 0; K < P.removed.length; K++) {
        const ae = P.removed[K], ue = E.indexOf(ae);
        ue >= 0 && (E[ue] = null, M[ue].disconnect(ae));
      }
      for (let K = 0; K < P.added.length; K++) {
        const ae = P.added[K];
        let ue = E.indexOf(ae);
        if (ue === -1) {
          for (let Ce = 0; Ce < M.length; Ce++) if (Ce >= E.length) {
            E.push(ae), ue = Ce;
            break;
          } else if (E[Ce] === null) {
            E[Ce] = ae, ue = Ce;
            break;
          }
          if (ue === -1) break;
        }
        const Ae = M[ue];
        Ae && Ae.connect(ae);
      }
    }
    const O = new U(), ee = new U();
    function te(P, K, ae) {
      O.setFromMatrixPosition(K.matrixWorld), ee.setFromMatrixPosition(ae.matrixWorld);
      const ue = O.distanceTo(ee), Ae = K.projectionMatrix.elements, Ce = ae.projectionMatrix.elements, Le = Ae[14] / (Ae[10] - 1), Xe = Ae[14] / (Ae[10] + 1), Ve = (Ae[9] + 1) / Ae[5], it = (Ae[9] - 1) / Ae[5], bt = (Ae[8] - 1) / Ae[0], It = (Ce[8] + 1) / Ce[0], kt = Le * bt, nt = Le * It, _t = ue / (-bt + It), mt = _t * -bt;
      if (K.matrixWorld.decompose(P.position, P.quaternion, P.scale), P.translateX(mt), P.translateZ(_t), P.matrixWorld.compose(P.position, P.quaternion, P.scale), P.matrixWorldInverse.copy(P.matrixWorld).invert(), Ae[10] === -1)
        P.projectionMatrix.copy(K.projectionMatrix), P.projectionMatrixInverse.copy(K.projectionMatrixInverse);
      else {
        const ut = Le + _t, I = Xe + _t, Bt = kt - mt, Ke = nt + (ue - mt), rt = Ve * Xe / I * ut, S = it * Xe / I * ut;
        P.projectionMatrix.makePerspective(Bt, Ke, rt, S, ut, I), P.projectionMatrixInverse.copy(P.projectionMatrix).invert();
      }
    }
    function ie(P, K) {
      K === null ? P.matrixWorld.copy(P.matrix) : P.matrixWorld.multiplyMatrices(K.matrixWorld, P.matrix), P.matrixWorldInverse.copy(P.matrixWorld).invert();
    }
    this.updateCamera = function(P) {
      if (n === null) return;
      let K = P.near, ae = P.far;
      _.texture !== null && (_.depthNear > 0 && (K = _.depthNear), _.depthFar > 0 && (ae = _.depthFar)), R.near = y.near = v.near = K, R.far = y.far = v.far = ae, (k !== R.near || q !== R.far) && (n.updateRenderState({
        depthNear: R.near,
        depthFar: R.far
      }), k = R.near, q = R.far), R.layers.mask = P.layers.mask | 6, v.layers.mask = R.layers.mask & -5, y.layers.mask = R.layers.mask & -3;
      const ue = P.parent, Ae = R.cameras;
      ie(R, ue);
      for (let Ce = 0; Ce < Ae.length; Ce++) ie(Ae[Ce], ue);
      Ae.length === 2 ? te(R, v, y) : R.projectionMatrix.copy(v.projectionMatrix), de(P, R, ue);
    };
    function de(P, K, ae) {
      ae === null ? P.matrix.copy(K.matrixWorld) : (P.matrix.copy(ae.matrixWorld), P.matrix.invert(), P.matrix.multiply(K.matrixWorld)), P.matrix.decompose(P.position, P.quaternion, P.scale), P.updateMatrixWorld(!0), P.projectionMatrix.copy(K.projectionMatrix), P.projectionMatrixInverse.copy(K.projectionMatrixInverse), P.isPerspectiveCamera && (P.fov = En * 2 * Math.atan(1 / P.projectionMatrix.elements[5]), P.zoom = 1);
    }
    this.getCamera = function() {
      return R;
    }, this.getFoveation = function() {
      if (!(u === null && d === null))
        return o;
    }, this.setFoveation = function(P) {
      o = P, u !== null && (u.fixedFoveation = P), d !== null && d.fixedFoveation !== void 0 && (d.fixedFoveation = P);
    }, this.hasDepthSensing = function() {
      return _.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return _.getMesh(R);
    }, this.getCameraTexture = function(P) {
      return m[P];
    };
    let Se = null;
    function Qe(P, K) {
      if (l = K.getViewerPose(c || s), p = K, l !== null) {
        const ae = l.views;
        d !== null && (e.setRenderTargetFramebuffer(A, d.framebuffer), e.setRenderTarget(A));
        let ue = !1;
        ae.length !== R.cameras.length && (R.cameras.length = 0, ue = !0);
        for (let Ce = 0; Ce < ae.length; Ce++) {
          const Le = ae[Ce];
          let Xe = null;
          if (d !== null) Xe = d.getViewport(Le);
          else {
            const it = h.getViewSubImage(u, Le);
            Xe = it.viewport, Ce === 0 && (e.setRenderTargetTextures(A, it.colorTexture, it.depthStencilTexture), e.setRenderTarget(A));
          }
          let Ve = V[Ce];
          Ve === void 0 && (Ve = new Pt(), Ve.layers.enable(Ce), Ve.viewport = new Ze(), V[Ce] = Ve), Ve.matrix.fromArray(Le.transform.matrix), Ve.matrix.decompose(Ve.position, Ve.quaternion, Ve.scale), Ve.projectionMatrix.fromArray(Le.projectionMatrix), Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(), Ve.viewport.set(Xe.x, Xe.y, Xe.width, Xe.height), Ce === 0 && (R.matrix.copy(Ve.matrix), R.matrix.decompose(R.position, R.quaternion, R.scale)), ue === !0 && R.cameras.push(Ve);
        }
        const Ae = n.enabledFeatures;
        if (Ae && Ae.includes("depth-sensing") && n.depthUsage == "gpu-optimized" && g) {
          h = i.getBinding();
          const Ce = h.getDepthInformation(ae[0]);
          Ce && Ce.isValid && Ce.texture && _.init(Ce, n.renderState);
        }
        if (Ae && Ae.includes("camera-access") && g) {
          e.state.unbindTexture(), h = i.getBinding();
          for (let Ce = 0; Ce < ae.length; Ce++) {
            const Le = ae[Ce].camera;
            if (Le) {
              let Xe = m[Le];
              Xe || (Xe = new Ec(), m[Le] = Xe);
              const Ve = h.getCameraImage(Le);
              Xe.sourceTexture = Ve;
            }
          }
        }
      }
      for (let ae = 0; ae < M.length; ae++) {
        const ue = E[ae], Ae = M[ae];
        ue !== null && Ae !== void 0 && Ae.update(ue, K, c || s);
      }
      Se && Se(P, K), K.detectedPlanes && i.dispatchEvent({
        type: "planesdetected",
        data: K
      }), p = null;
    }
    const je = new Uc();
    je.setAnimationLoop(Qe), this.setAnimationLoop = function(P) {
      Se = P;
    }, this.dispose = function() {
    };
  }
}, Kf = /* @__PURE__ */ new Ne(), Vc = /* @__PURE__ */ new Ie();
Vc.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function jf(e, t) {
  function i(m, f) {
    m.matrixAutoUpdate === !0 && m.updateMatrix(), f.value.copy(m.matrix);
  }
  function n(m, f) {
    f.color.getRGB(m.fogColor.value, Rc(e)), f.isFog ? (m.fogNear.value = f.near, m.fogFar.value = f.far) : f.isFogExp2 && (m.fogDensity.value = f.density);
  }
  function r(m, f, T, A, M) {
    f.isNodeMaterial ? f.uniformsNeedUpdate = !1 : f.isMeshBasicMaterial ? s(m, f) : f.isMeshLambertMaterial ? (s(m, f), f.envMap && (m.envMapIntensity.value = f.envMapIntensity)) : f.isMeshToonMaterial ? (s(m, f), u(m, f)) : f.isMeshPhongMaterial ? (s(m, f), h(m, f), f.envMap && (m.envMapIntensity.value = f.envMapIntensity)) : f.isMeshStandardMaterial ? (s(m, f), d(m, f), f.isMeshPhysicalMaterial && p(m, f, M)) : f.isMeshMatcapMaterial ? (s(m, f), g(m, f)) : f.isMeshDepthMaterial ? s(m, f) : f.isMeshDistanceMaterial ? (s(m, f), _(m, f)) : f.isMeshNormalMaterial ? s(m, f) : f.isLineBasicMaterial ? (a(m, f), f.isLineDashedMaterial && o(m, f)) : f.isPointsMaterial ? c(m, f, T, A) : f.isSpriteMaterial ? l(m, f) : f.isShadowMaterial ? (m.color.value.copy(f.color), m.opacity.value = f.opacity) : f.isShaderMaterial && (f.uniformsNeedUpdate = !1);
  }
  function s(m, f) {
    m.opacity.value = f.opacity, f.color && m.diffuse.value.copy(f.color), f.emissive && m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity), f.map && (m.map.value = f.map, i(f.map, m.mapTransform)), f.alphaMap && (m.alphaMap.value = f.alphaMap, i(f.alphaMap, m.alphaMapTransform)), f.bumpMap && (m.bumpMap.value = f.bumpMap, i(f.bumpMap, m.bumpMapTransform), m.bumpScale.value = f.bumpScale, f.side === 1 && (m.bumpScale.value *= -1)), f.normalMap && (m.normalMap.value = f.normalMap, i(f.normalMap, m.normalMapTransform), m.normalScale.value.copy(f.normalScale), f.side === 1 && m.normalScale.value.negate()), f.displacementMap && (m.displacementMap.value = f.displacementMap, i(f.displacementMap, m.displacementMapTransform), m.displacementScale.value = f.displacementScale, m.displacementBias.value = f.displacementBias), f.emissiveMap && (m.emissiveMap.value = f.emissiveMap, i(f.emissiveMap, m.emissiveMapTransform)), f.specularMap && (m.specularMap.value = f.specularMap, i(f.specularMap, m.specularMapTransform)), f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest);
    const T = t.get(f), A = T.envMap, M = T.envMapRotation;
    A && (m.envMap.value = A, m.envMapRotation.value.setFromMatrix4(Kf.makeRotationFromEuler(M)).transpose(), A.isCubeTexture && A.isRenderTargetTexture === !1 && m.envMapRotation.value.premultiply(Vc), m.reflectivity.value = f.reflectivity, m.ior.value = f.ior, m.refractionRatio.value = f.refractionRatio), f.lightMap && (m.lightMap.value = f.lightMap, m.lightMapIntensity.value = f.lightMapIntensity, i(f.lightMap, m.lightMapTransform)), f.aoMap && (m.aoMap.value = f.aoMap, m.aoMapIntensity.value = f.aoMapIntensity, i(f.aoMap, m.aoMapTransform));
  }
  function a(m, f) {
    m.diffuse.value.copy(f.color), m.opacity.value = f.opacity, f.map && (m.map.value = f.map, i(f.map, m.mapTransform));
  }
  function o(m, f) {
    m.dashSize.value = f.dashSize, m.totalSize.value = f.dashSize + f.gapSize, m.scale.value = f.scale;
  }
  function c(m, f, T, A) {
    m.diffuse.value.copy(f.color), m.opacity.value = f.opacity, m.size.value = f.size * T, m.scale.value = A * 0.5, f.map && (m.map.value = f.map, i(f.map, m.uvTransform)), f.alphaMap && (m.alphaMap.value = f.alphaMap, i(f.alphaMap, m.alphaMapTransform)), f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest);
  }
  function l(m, f) {
    m.diffuse.value.copy(f.color), m.opacity.value = f.opacity, m.rotation.value = f.rotation, f.map && (m.map.value = f.map, i(f.map, m.mapTransform)), f.alphaMap && (m.alphaMap.value = f.alphaMap, i(f.alphaMap, m.alphaMapTransform)), f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest);
  }
  function h(m, f) {
    m.specular.value.copy(f.specular), m.shininess.value = Math.max(f.shininess, 1e-4);
  }
  function u(m, f) {
    f.gradientMap && (m.gradientMap.value = f.gradientMap);
  }
  function d(m, f) {
    m.metalness.value = f.metalness, f.metalnessMap && (m.metalnessMap.value = f.metalnessMap, i(f.metalnessMap, m.metalnessMapTransform)), m.roughness.value = f.roughness, f.roughnessMap && (m.roughnessMap.value = f.roughnessMap, i(f.roughnessMap, m.roughnessMapTransform)), f.envMap && (m.envMapIntensity.value = f.envMapIntensity);
  }
  function p(m, f, T) {
    m.ior.value = f.ior, f.sheen > 0 && (m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen), m.sheenRoughness.value = f.sheenRoughness, f.sheenColorMap && (m.sheenColorMap.value = f.sheenColorMap, i(f.sheenColorMap, m.sheenColorMapTransform)), f.sheenRoughnessMap && (m.sheenRoughnessMap.value = f.sheenRoughnessMap, i(f.sheenRoughnessMap, m.sheenRoughnessMapTransform))), f.clearcoat > 0 && (m.clearcoat.value = f.clearcoat, m.clearcoatRoughness.value = f.clearcoatRoughness, f.clearcoatMap && (m.clearcoatMap.value = f.clearcoatMap, i(f.clearcoatMap, m.clearcoatMapTransform)), f.clearcoatRoughnessMap && (m.clearcoatRoughnessMap.value = f.clearcoatRoughnessMap, i(f.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)), f.clearcoatNormalMap && (m.clearcoatNormalMap.value = f.clearcoatNormalMap, i(f.clearcoatNormalMap, m.clearcoatNormalMapTransform), m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale), f.side === 1 && m.clearcoatNormalScale.value.negate())), f.dispersion > 0 && (m.dispersion.value = f.dispersion), f.iridescence > 0 && (m.iridescence.value = f.iridescence, m.iridescenceIOR.value = f.iridescenceIOR, m.iridescenceThicknessMinimum.value = f.iridescenceThicknessRange[0], m.iridescenceThicknessMaximum.value = f.iridescenceThicknessRange[1], f.iridescenceMap && (m.iridescenceMap.value = f.iridescenceMap, i(f.iridescenceMap, m.iridescenceMapTransform)), f.iridescenceThicknessMap && (m.iridescenceThicknessMap.value = f.iridescenceThicknessMap, i(f.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))), f.transmission > 0 && (m.transmission.value = f.transmission, m.transmissionSamplerMap.value = T.texture, m.transmissionSamplerSize.value.set(T.width, T.height), f.transmissionMap && (m.transmissionMap.value = f.transmissionMap, i(f.transmissionMap, m.transmissionMapTransform)), m.thickness.value = f.thickness, f.thicknessMap && (m.thicknessMap.value = f.thicknessMap, i(f.thicknessMap, m.thicknessMapTransform)), m.attenuationDistance.value = f.attenuationDistance, m.attenuationColor.value.copy(f.attenuationColor)), f.anisotropy > 0 && (m.anisotropyVector.value.set(f.anisotropy * Math.cos(f.anisotropyRotation), f.anisotropy * Math.sin(f.anisotropyRotation)), f.anisotropyMap && (m.anisotropyMap.value = f.anisotropyMap, i(f.anisotropyMap, m.anisotropyMapTransform))), m.specularIntensity.value = f.specularIntensity, m.specularColor.value.copy(f.specularColor), f.specularColorMap && (m.specularColorMap.value = f.specularColorMap, i(f.specularColorMap, m.specularColorMapTransform)), f.specularIntensityMap && (m.specularIntensityMap.value = f.specularIntensityMap, i(f.specularIntensityMap, m.specularIntensityMapTransform));
  }
  function g(m, f) {
    f.matcap && (m.matcap.value = f.matcap);
  }
  function _(m, f) {
    const T = t.get(f).light;
    m.referencePosition.value.setFromMatrixPosition(T.matrixWorld), m.nearDistance.value = T.shadow.camera.near, m.farDistance.value = T.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: r
  };
}
function Yf(e, t, i, n) {
  let r = {}, s = {}, a = [];
  const o = e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);
  function c(M, E) {
    const w = E.program;
    n.uniformBlockBinding(M, w);
  }
  function l(M, E) {
    let w = r[M.id];
    w === void 0 && (m(M), w = h(M), r[M.id] = w, M.addEventListener("dispose", T));
    const C = E.program;
    n.updateUBOMapping(M, C);
    const v = t.render.frame;
    s[M.id] !== v && (d(M), s[M.id] = v);
  }
  function h(M) {
    const E = u();
    M.__bindingPointIndex = E;
    const w = e.createBuffer(), C = M.__size, v = M.usage;
    return e.bindBuffer(e.UNIFORM_BUFFER, w), e.bufferData(e.UNIFORM_BUFFER, C, v), e.bindBuffer(e.UNIFORM_BUFFER, null), e.bindBufferBase(e.UNIFORM_BUFFER, E, w), w;
  }
  function u() {
    for (let M = 0; M < o; M++) if (a.indexOf(M) === -1)
      return a.push(M), M;
    return Re("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function d(M) {
    const E = r[M.id], w = M.uniforms, C = M.__cache;
    e.bindBuffer(e.UNIFORM_BUFFER, E);
    for (let v = 0, y = w.length; v < y; v++) {
      const V = w[v];
      if (Array.isArray(V)) for (let R = 0, k = V.length; R < k; R++) p(V[R], v, R, C);
      else p(V, v, 0, C);
    }
    e.bindBuffer(e.UNIFORM_BUFFER, null);
  }
  function p(M, E, w, C) {
    if (_(M, E, w, C) === !0) {
      const v = M.__offset, y = M.value;
      if (Array.isArray(y)) {
        let V = 0;
        for (let R = 0; R < y.length; R++) {
          const k = y[R], q = f(k);
          g(k, M.__data, V), typeof k != "number" && typeof k != "boolean" && !k.isMatrix3 && !ArrayBuffer.isView(k) && (V += q.storage / Float32Array.BYTES_PER_ELEMENT);
        }
      } else g(y, M.__data, 0);
      e.bufferSubData(e.UNIFORM_BUFFER, v, M.__data);
    }
  }
  function g(M, E, w) {
    typeof M == "number" || typeof M == "boolean" ? E[0] = M : M.isMatrix3 ? (E[0] = M.elements[0], E[1] = M.elements[1], E[2] = M.elements[2], E[3] = 0, E[4] = M.elements[3], E[5] = M.elements[4], E[6] = M.elements[5], E[7] = 0, E[8] = M.elements[6], E[9] = M.elements[7], E[10] = M.elements[8], E[11] = 0) : ArrayBuffer.isView(M) ? E.set(new M.constructor(M.buffer, M.byteOffset, E.length)) : M.toArray(E, w);
  }
  function _(M, E, w, C) {
    const v = M.value, y = E + "_" + w;
    if (C[y] === void 0)
      return typeof v == "number" || typeof v == "boolean" ? C[y] = v : ArrayBuffer.isView(v) ? C[y] = v.slice() : C[y] = v.clone(), !0;
    {
      const V = C[y];
      if (typeof v == "number" || typeof v == "boolean") {
        if (V !== v)
          return C[y] = v, !0;
      } else {
        if (ArrayBuffer.isView(v)) return !0;
        if (V.equals(v) === !1)
          return V.copy(v), !0;
      }
    }
    return !1;
  }
  function m(M) {
    const E = M.uniforms;
    let w = 0;
    const C = 16;
    for (let y = 0, V = E.length; y < V; y++) {
      const R = Array.isArray(E[y]) ? E[y] : [E[y]];
      for (let k = 0, q = R.length; k < q; k++) {
        const X = R[k], z = Array.isArray(X.value) ? X.value : [X.value];
        for (let j = 0, O = z.length; j < O; j++) {
          const ee = z[j], te = f(ee), ie = w % C, de = ie % te.boundary, Se = ie + de;
          w += de, Se !== 0 && C - Se < te.storage && (w += C - Se), X.__data = new Float32Array(te.storage / Float32Array.BYTES_PER_ELEMENT), X.__offset = w, w += te.storage;
        }
      }
    }
    const v = w % C;
    return v > 0 && (w += C - v), M.__size = w, M.__cache = {}, this;
  }
  function f(M) {
    const E = {
      boundary: 0,
      storage: 0
    };
    return typeof M == "number" || typeof M == "boolean" ? (E.boundary = 4, E.storage = 4) : M.isVector2 ? (E.boundary = 8, E.storage = 8) : M.isVector3 || M.isColor ? (E.boundary = 16, E.storage = 12) : M.isVector4 ? (E.boundary = 16, E.storage = 16) : M.isMatrix3 ? (E.boundary = 48, E.storage = 48) : M.isMatrix4 ? (E.boundary = 64, E.storage = 64) : M.isTexture ? xe("WebGLRenderer: Texture samplers can not be part of an uniforms group.") : ArrayBuffer.isView(M) ? (E.boundary = 16, E.storage = M.byteLength) : xe("WebGLRenderer: Unsupported uniform value type.", M), E;
  }
  function T(M) {
    const E = M.target;
    E.removeEventListener("dispose", T);
    const w = a.indexOf(E.__bindingPointIndex);
    a.splice(w, 1), e.deleteBuffer(r[E.id]), delete r[E.id], delete s[E.id];
  }
  function A() {
    for (const M in r) e.deleteBuffer(r[M]);
    a = [], r = {}, s = {};
  }
  return {
    bind: c,
    update: l,
    dispose: A
  };
}
var Jf = new Uint16Array([
  12469,
  15057,
  12620,
  14925,
  13266,
  14620,
  13807,
  14376,
  14323,
  13990,
  14545,
  13625,
  14713,
  13328,
  14840,
  12882,
  14931,
  12528,
  14996,
  12233,
  15039,
  11829,
  15066,
  11525,
  15080,
  11295,
  15085,
  10976,
  15082,
  10705,
  15073,
  10495,
  13880,
  14564,
  13898,
  14542,
  13977,
  14430,
  14158,
  14124,
  14393,
  13732,
  14556,
  13410,
  14702,
  12996,
  14814,
  12596,
  14891,
  12291,
  14937,
  11834,
  14957,
  11489,
  14958,
  11194,
  14943,
  10803,
  14921,
  10506,
  14893,
  10278,
  14858,
  9960,
  14484,
  14039,
  14487,
  14025,
  14499,
  13941,
  14524,
  13740,
  14574,
  13468,
  14654,
  13106,
  14743,
  12678,
  14818,
  12344,
  14867,
  11893,
  14889,
  11509,
  14893,
  11180,
  14881,
  10751,
  14852,
  10428,
  14812,
  10128,
  14765,
  9754,
  14712,
  9466,
  14764,
  13480,
  14764,
  13475,
  14766,
  13440,
  14766,
  13347,
  14769,
  13070,
  14786,
  12713,
  14816,
  12387,
  14844,
  11957,
  14860,
  11549,
  14868,
  11215,
  14855,
  10751,
  14825,
  10403,
  14782,
  10044,
  14729,
  9651,
  14666,
  9352,
  14599,
  9029,
  14967,
  12835,
  14966,
  12831,
  14963,
  12804,
  14954,
  12723,
  14936,
  12564,
  14917,
  12347,
  14900,
  11958,
  14886,
  11569,
  14878,
  11247,
  14859,
  10765,
  14828,
  10401,
  14784,
  10011,
  14727,
  9600,
  14660,
  9289,
  14586,
  8893,
  14508,
  8533,
  15111,
  12234,
  15110,
  12234,
  15104,
  12216,
  15092,
  12156,
  15067,
  12010,
  15028,
  11776,
  14981,
  11500,
  14942,
  11205,
  14902,
  10752,
  14861,
  10393,
  14812,
  9991,
  14752,
  9570,
  14682,
  9252,
  14603,
  8808,
  14519,
  8445,
  14431,
  8145,
  15209,
  11449,
  15208,
  11451,
  15202,
  11451,
  15190,
  11438,
  15163,
  11384,
  15117,
  11274,
  15055,
  10979,
  14994,
  10648,
  14932,
  10343,
  14871,
  9936,
  14803,
  9532,
  14729,
  9218,
  14645,
  8742,
  14556,
  8381,
  14461,
  8020,
  14365,
  7603,
  15273,
  10603,
  15272,
  10607,
  15267,
  10619,
  15256,
  10631,
  15231,
  10614,
  15182,
  10535,
  15118,
  10389,
  15042,
  10167,
  14963,
  9787,
  14883,
  9447,
  14800,
  9115,
  14710,
  8665,
  14615,
  8318,
  14514,
  7911,
  14411,
  7507,
  14279,
  7198,
  15314,
  9675,
  15313,
  9683,
  15309,
  9712,
  15298,
  9759,
  15277,
  9797,
  15229,
  9773,
  15166,
  9668,
  15084,
  9487,
  14995,
  9274,
  14898,
  8910,
  14800,
  8539,
  14697,
  8234,
  14590,
  7790,
  14479,
  7409,
  14367,
  7067,
  14178,
  6621,
  15337,
  8619,
  15337,
  8631,
  15333,
  8677,
  15325,
  8769,
  15305,
  8871,
  15264,
  8940,
  15202,
  8909,
  15119,
  8775,
  15022,
  8565,
  14916,
  8328,
  14804,
  8009,
  14688,
  7614,
  14569,
  7287,
  14448,
  6888,
  14321,
  6483,
  14088,
  6171,
  15350,
  7402,
  15350,
  7419,
  15347,
  7480,
  15340,
  7613,
  15322,
  7804,
  15287,
  7973,
  15229,
  8057,
  15148,
  8012,
  15046,
  7846,
  14933,
  7611,
  14810,
  7357,
  14682,
  7069,
  14552,
  6656,
  14421,
  6316,
  14251,
  5948,
  14007,
  5528,
  15356,
  5942,
  15356,
  5977,
  15353,
  6119,
  15348,
  6294,
  15332,
  6551,
  15302,
  6824,
  15249,
  7044,
  15171,
  7122,
  15070,
  7050,
  14949,
  6861,
  14818,
  6611,
  14679,
  6349,
  14538,
  6067,
  14398,
  5651,
  14189,
  5311,
  13935,
  4958,
  15359,
  4123,
  15359,
  4153,
  15356,
  4296,
  15353,
  4646,
  15338,
  5160,
  15311,
  5508,
  15263,
  5829,
  15188,
  6042,
  15088,
  6094,
  14966,
  6001,
  14826,
  5796,
  14678,
  5543,
  14527,
  5287,
  14377,
  4985,
  14133,
  4586,
  13869,
  4257,
  15360,
  1563,
  15360,
  1642,
  15358,
  2076,
  15354,
  2636,
  15341,
  3350,
  15317,
  4019,
  15273,
  4429,
  15203,
  4732,
  15105,
  4911,
  14981,
  4932,
  14836,
  4818,
  14679,
  4621,
  14517,
  4386,
  14359,
  4156,
  14083,
  3795,
  13808,
  3437,
  15360,
  122,
  15360,
  137,
  15358,
  285,
  15355,
  636,
  15344,
  1274,
  15322,
  2177,
  15281,
  2765,
  15215,
  3223,
  15120,
  3451,
  14995,
  3569,
  14846,
  3567,
  14681,
  3466,
  14511,
  3305,
  14344,
  3121,
  14037,
  2800,
  13753,
  2467,
  15360,
  0,
  15360,
  1,
  15359,
  21,
  15355,
  89,
  15346,
  253,
  15325,
  479,
  15287,
  796,
  15225,
  1148,
  15133,
  1492,
  15008,
  1749,
  14856,
  1882,
  14685,
  1886,
  14506,
  1783,
  14324,
  1608,
  13996,
  1398,
  13702,
  1183
]), ni = null;
function $f() {
  return ni === null && (ni = new ia(Jf, 16, 16, zr, ji), ni.name = "DFG_LUT", ni.minFilter = Lt, ni.magFilter = Lt, ni.wrapS = ai, ni.wrapT = ai, ni.generateMipmaps = !1, ni.needsUpdate = !0), ni;
}
var Zf = class {
  constructor(e = {}) {
    const { canvas: t = Jl(), context: i = null, depth: n = !0, stencil: r = !1, alpha: s = !1, antialias: a = !1, premultipliedAlpha: o = !0, preserveDrawingBuffer: c = !1, powerPreference: l = "default", failIfMajorPerformanceCaveat: h = !1, reversedDepthBuffer: u = !1, outputBufferType: d = Ui } = e;
    this.isWebGLRenderer = !0;
    let p;
    if (i !== null) {
      if (typeof WebGLRenderingContext < "u" && i instanceof WebGLRenderingContext) throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      p = i.getContextAttributes().alpha;
    } else p = s;
    const g = d, _ = /* @__PURE__ */ new Set([
      ac,
      sc,
      rc
    ]), m = /* @__PURE__ */ new Set([
      Ui,
      Ki,
      Zo,
      tc,
      Qo,
      ec
    ]), f = /* @__PURE__ */ new Uint32Array(4), T = /* @__PURE__ */ new Int32Array(4), A = new U();
    let M = null, E = null;
    const w = [], C = [];
    let v = null;
    this.domElement = t, this.debug = {
      checkShaderErrors: !0,
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
    const y = this;
    let V = !1, R = null, k = null, q = null, X = null;
    this._outputColorSpace = vt;
    let z = 0, j = 0, O = null, ee = -1, te = null;
    const ie = new Ze(), de = new Ze();
    let Se = null;
    const Qe = new Te(0);
    let je = 0, P = t.width, K = t.height, ae = 1, ue = null, Ae = null;
    const Ce = new Ze(0, 0, P, K), Le = new Ze(0, 0, P, K);
    let Xe = !1;
    const Ve = new na();
    let it = !1, bt = !1;
    const It = new Ne(), kt = new U(), nt = new Ze(), _t = {
      background: null,
      fog: null,
      environment: null,
      overrideMaterial: null,
      isScene: !0
    };
    let mt = !1;
    function ut() {
      return O === null ? ae : 1;
    }
    let I = i;
    function Bt(x, F) {
      return t.getContext(x, F);
    }
    try {
      const x = {
        alpha: !0,
        depth: n,
        stencil: r,
        antialias: a,
        premultipliedAlpha: o,
        preserveDrawingBuffer: c,
        powerPreference: l,
        failIfMajorPerformanceCaveat: h
      };
      if ("setAttribute" in t && t.setAttribute("data-engine", "three.js r185"), t.addEventListener("webglcontextlost", we, !1), t.addEventListener("webglcontextrestored", wt, !1), t.addEventListener("webglcontextcreationerror", et, !1), I === null) {
        const F = "webgl2";
        if (I = Bt(F, x), I === null)
          throw Bt(F) ? new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.") : new Error("THREE.WebGLRenderer: Error creating WebGL context.");
      }
    } catch (x) {
      throw Re("WebGLRenderer: " + x.message), x;
    }
    let Ke, rt, S, b, L, W, J, re, oe, N, ne, pe, be, Q, Me, ye, De, He, D, Y, $, fe, ve;
    function Z() {
      Ke = new Jd(I), Ke.init(), $ = new Vf(I, Ke), rt = new Vd(I, Ke, e, $), S = new Gf(I, Ke), rt.reversedDepthBuffer && u && S.buffers.depth.setReversed(!0), k = I.createFramebuffer(), q = I.createFramebuffer(), X = I.createFramebuffer(), b = new Qd(I), L = new Af(), W = new zf(I, Ke, S, L, rt, $, b), J = new Yd(y), re = new Od(I), fe = new Gd(I, re), oe = new $d(I, re, b, fe), N = new tu(I, oe, re, fe, b), He = new eu(I, rt, W), Me = new Hd(L), ne = new Tf(y, J, Ke, rt, fe, Me), pe = new jf(y, L), be = new Rf(), Q = new Nf(Ke), De = new Bd(y, J, S, N, p, o), ye = new Bf(y, N, rt), ve = new Yf(I, b, rt, S), D = new zd(I, Ke, b), Y = new Zd(I, Ke, b), b.programs = ne.programs, y.capabilities = rt, y.extensions = Ke, y.properties = L, y.renderLists = be, y.shadowMap = ye, y.state = S, y.info = b;
    }
    Z(), g !== 1009 && (v = new nu(g, t.width, t.height, a, n, r));
    const le = new Xf(y, I);
    this.xr = le, this.getContext = function() {
      return I;
    }, this.getContextAttributes = function() {
      return I.getContextAttributes();
    }, this.forceContextLoss = function() {
      const x = Ke.get("WEBGL_lose_context");
      x && x.loseContext();
    }, this.forceContextRestore = function() {
      const x = Ke.get("WEBGL_lose_context");
      x && x.restoreContext();
    }, this.getPixelRatio = function() {
      return ae;
    }, this.setPixelRatio = function(x) {
      x !== void 0 && (ae = x, this.setSize(P, K, !1));
    }, this.getSize = function(x) {
      return x.set(P, K);
    }, this.setSize = function(x, F, H = !0) {
      if (le.isPresenting) {
        xe("WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      P = x, K = F, t.width = Math.floor(x * ae), t.height = Math.floor(F * ae), H === !0 && (t.style.width = x + "px", t.style.height = F + "px"), v !== null && v.setSize(t.width, t.height), this.setViewport(0, 0, x, F);
    }, this.getDrawingBufferSize = function(x) {
      return x.set(P * ae, K * ae).floor();
    }, this.setDrawingBufferSize = function(x, F, H) {
      P = x, K = F, ae = H, t.width = Math.floor(x * H), t.height = Math.floor(F * H), this.setViewport(0, 0, x, F);
    }, this.setEffects = function(x) {
      if (g === 1009) {
        Re("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
        return;
      }
      if (x) {
        for (let F = 0; F < x.length; F++) if (x[F].isOutputPass === !0) {
          xe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");
          break;
        }
      }
      v.setEffects(x || []);
    }, this.getCurrentViewport = function(x) {
      return x.copy(ie);
    }, this.getViewport = function(x) {
      return x.copy(Ce);
    }, this.setViewport = function(x, F, H, G) {
      x.isVector4 ? Ce.set(x.x, x.y, x.z, x.w) : Ce.set(x, F, H, G), S.viewport(ie.copy(Ce).multiplyScalar(ae).round());
    }, this.getScissor = function(x) {
      return x.copy(Le);
    }, this.setScissor = function(x, F, H, G) {
      x.isVector4 ? Le.set(x.x, x.y, x.z, x.w) : Le.set(x, F, H, G), S.scissor(de.copy(Le).multiplyScalar(ae).round());
    }, this.getScissorTest = function() {
      return Xe;
    }, this.setScissorTest = function(x) {
      S.setScissorTest(Xe = x);
    }, this.setOpaqueSort = function(x) {
      ue = x;
    }, this.setTransparentSort = function(x) {
      Ae = x;
    }, this.getClearColor = function(x) {
      return x.copy(De.getClearColor());
    }, this.setClearColor = function() {
      De.setClearColor(...arguments);
    }, this.getClearAlpha = function() {
      return De.getClearAlpha();
    }, this.setClearAlpha = function() {
      De.setClearAlpha(...arguments);
    }, this.clear = function(x = !0, F = !0, H = !0) {
      let G = 0;
      if (x) {
        let B = !1;
        if (O !== null) {
          const se = O.texture.format;
          B = _.has(se);
        }
        if (B) {
          const se = O.texture.type, he = m.has(se), me = De.getClearColor(), ge = De.getClearAlpha(), Pe = me.r, Oe = me.g, Be = me.b;
          he ? (f[0] = Pe, f[1] = Oe, f[2] = Be, f[3] = ge, I.clearBufferuiv(I.COLOR, 0, f)) : (T[0] = Pe, T[1] = Oe, T[2] = Be, T[3] = ge, I.clearBufferiv(I.COLOR, 0, T));
        } else G |= I.COLOR_BUFFER_BIT;
      }
      F && (G |= I.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)), H && (G |= I.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), G !== 0 && I.clear(G);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.setNodesHandler = function(x) {
      x.setRenderer(this), R = x;
    }, this.dispose = function() {
      t.removeEventListener("webglcontextlost", we, !1), t.removeEventListener("webglcontextrestored", wt, !1), t.removeEventListener("webglcontextcreationerror", et, !1), De.dispose(), be.dispose(), Q.dispose(), L.dispose(), J.dispose(), N.dispose(), fe.dispose(), ve.dispose(), ne.dispose(), le.dispose(), le.removeEventListener("sessionstart", ha), le.removeEventListener("sessionend", da), Oi.stop();
    };
    function we(x) {
      x.preventDefault(), Wr("WebGLRenderer: Context Lost."), V = !0;
    }
    function wt() {
      Wr("WebGLRenderer: Context Restored."), V = !1;
      const x = b.autoReset, F = ye.enabled, H = ye.autoUpdate, G = ye.needsUpdate, B = ye.type;
      Z(), b.autoReset = x, ye.enabled = F, ye.autoUpdate = H, ye.needsUpdate = G, ye.type = B;
    }
    function et(x) {
      Re("WebGLRenderer: A WebGL context could not be created. Reason: ", x.statusMessage);
    }
    function ei(x) {
      const F = x.target;
      F.removeEventListener("dispose", ei), ui(F);
    }
    function ui(x) {
      Jc(x), L.remove(x);
    }
    function Jc(x) {
      const F = L.get(x).programs;
      F !== void 0 && (F.forEach(function(H) {
        ne.releaseProgram(H);
      }), x.isShaderMaterial && ne.releaseShaderCache(x));
    }
    this.renderBufferDirect = function(x, F, H, G, B, se) {
      F === null && (F = _t);
      const he = B.isMesh && B.matrixWorld.determinantAffine() < 0, me = Qc(x, F, H, G, B);
      S.setMaterial(G, he);
      let ge = H.index, Pe = 1;
      if (G.wireframe === !0) {
        if (ge = oe.getWireframeAttribute(H), ge === void 0) return;
        Pe = 2;
      }
      const Oe = H.drawRange, Be = H.attributes.position;
      let Ee = Oe.start * Pe, tt = (Oe.start + Oe.count) * Pe;
      se !== null && (Ee = Math.max(Ee, se.start * Pe), tt = Math.min(tt, (se.start + se.count) * Pe)), ge !== null ? (Ee = Math.max(Ee, 0), tt = Math.min(tt, ge.count)) : Be != null && (Ee = Math.max(Ee, 0), tt = Math.min(tt, Be.count));
      const at = tt - Ee;
      if (at < 0 || at === 1 / 0) return;
      fe.setup(B, G, me, H, ge);
      let ot, We = D;
      if (ge !== null && (ot = re.get(ge), We = Y, We.setIndex(ot)), B.isMesh)
        G.wireframe === !0 ? (S.setLineWidth(G.wireframeLinewidth * ut()), We.setMode(I.LINES)) : We.setMode(I.TRIANGLES);
      else if (B.isLine) {
        let Mt = G.linewidth;
        Mt === void 0 && (Mt = 1), S.setLineWidth(Mt * ut()), B.isLineSegments ? We.setMode(I.LINES) : B.isLineLoop ? We.setMode(I.LINE_LOOP) : We.setMode(I.LINE_STRIP);
      } else B.isPoints ? We.setMode(I.POINTS) : B.isSprite && We.setMode(I.TRIANGLES);
      if (B.isBatchedMesh)
        if (Ke.get("WEBGL_multi_draw"))
          We.renderMultiDraw(B._multiDrawStarts, B._multiDrawCounts, B._multiDrawCount);
        else {
          const Mt = B._multiDrawStarts, _e = B._multiDrawCounts, qt = B._multiDrawCount, qe = ge ? re.get(ge).bytesPerElement : 1, Gt = L.get(G).currentProgram.getUniforms();
          for (let ti = 0; ti < qt; ti++)
            Gt.setValue(I, "_gl_DrawID", ti), We.render(Mt[ti] / qe, _e[ti]);
        }
      else if (B.isInstancedMesh) We.renderInstances(Ee, at, B.count);
      else if (H.isInstancedBufferGeometry) {
        const Mt = H._maxInstanceCount !== void 0 ? H._maxInstanceCount : 1 / 0, _e = Math.min(H.instanceCount, Mt);
        We.renderInstances(Ee, at, _e);
      } else We.render(Ee, at);
    };
    function la(x, F, H) {
      x.transparent === !0 && x.side === 2 && x.forceSinglePass === !1 ? (x.side = 1, x.needsUpdate = !0, ar(x, F, H), x.side = 0, x.needsUpdate = !0, ar(x, F, H), x.side = 2) : ar(x, F, H);
    }
    this.compile = function(x, F, H = null) {
      H === null && (H = x), E = Q.get(H), E.init(F), C.push(E), H.traverseVisible(function(B) {
        B.isLight && B.layers.test(F.layers) && (E.pushLight(B), B.castShadow && E.pushShadow(B));
      }), x !== H && x.traverseVisible(function(B) {
        B.isLight && B.layers.test(F.layers) && (E.pushLight(B), B.castShadow && E.pushShadow(B));
      }), E.setupLights();
      const G = /* @__PURE__ */ new Set();
      return x.traverse(function(B) {
        if (!(B.isMesh || B.isPoints || B.isLine || B.isSprite)) return;
        const se = B.material;
        if (se)
          if (Array.isArray(se)) for (let he = 0; he < se.length; he++) {
            const me = se[he];
            la(me, H, B), G.add(me);
          }
          else
            la(se, H, B), G.add(se);
      }), E = C.pop(), G;
    }, this.compileAsync = function(x, F, H = null) {
      const G = this.compile(x, F, H);
      return new Promise((B) => {
        function se() {
          if (G.forEach(function(he) {
            L.get(he).currentProgram.isReady() && G.delete(he);
          }), G.size === 0) {
            B(x);
            return;
          }
          setTimeout(se, 10);
        }
        Ke.get("KHR_parallel_shader_compile") !== null ? se() : setTimeout(se, 10);
      });
    };
    let ts = null;
    function $c(x) {
      ts && ts(x);
    }
    function ha() {
      Oi.stop();
    }
    function da() {
      Oi.start();
    }
    const Oi = new Uc();
    Oi.setAnimationLoop($c), typeof self < "u" && Oi.setContext(self), this.setAnimationLoop = function(x) {
      ts = x, le.setAnimationLoop(x), x === null ? Oi.stop() : Oi.start();
    }, le.addEventListener("sessionstart", ha), le.addEventListener("sessionend", da), this.render = function(x, F) {
      if (F !== void 0 && F.isCamera !== !0) {
        Re("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (V === !0) return;
      R !== null && R.renderStart(x, F);
      const H = le.enabled === !0 && le.isPresenting === !0, G = v !== null && (O === null || H) && v.begin(y, O);
      if (x.matrixWorldAutoUpdate === !0 && x.updateMatrixWorld(), F.parent === null && F.matrixWorldAutoUpdate === !0 && F.updateMatrixWorld(), le.enabled === !0 && le.isPresenting === !0 && (v === null || v.isCompositing() === !1) && (le.cameraAutoUpdate === !0 && le.updateCamera(F), F = le.getCamera()), x.isScene === !0 && x.onBeforeRender(y, x, F, O), E = Q.get(x, C.length), E.init(F), E.state.textureUnits = W.getTextureUnits(), C.push(E), It.multiplyMatrices(F.projectionMatrix, F.matrixWorldInverse), Ve.setFromProjectionMatrix(It, Sn, F.reversedDepth), bt = this.localClippingEnabled, it = Me.init(this.clippingPlanes, bt), M = be.get(x, w.length), M.init(), w.push(M), le.enabled === !0 && le.isPresenting === !0) {
        const se = y.xr.getDepthSensingMesh();
        se !== null && is(se, F, -1 / 0, y.sortObjects);
      }
      is(x, F, 0, y.sortObjects), M.finish(), y.sortObjects === !0 && M.sort(ue, Ae, F.reversedDepth), mt = le.enabled === !1 || le.isPresenting === !1 || le.hasDepthSensing() === !1, mt && De.addToRenderList(M, x), this.info.render.frame++, this.info.autoReset === !0 && this.info.reset(), it === !0 && Me.beginShadows();
      const B = E.state.shadowsArray;
      if (ye.render(B, x, F), it === !0 && Me.endShadows(), (G && v.hasRenderPass()) === !1) {
        const se = M.opaque, he = M.transmissive;
        if (E.setupLights(), F.isArrayCamera) {
          const me = F.cameras;
          if (he.length > 0) for (let ge = 0, Pe = me.length; ge < Pe; ge++) {
            const Oe = me[ge];
            fa(se, he, x, Oe);
          }
          mt && De.render(x);
          for (let ge = 0, Pe = me.length; ge < Pe; ge++) {
            const Oe = me[ge];
            ua(M, x, Oe, Oe.viewport);
          }
        } else
          he.length > 0 && fa(se, he, x, F), mt && De.render(x), ua(M, x, F);
      }
      O !== null && j === 0 && (W.updateMultisampleRenderTarget(O), W.updateRenderTargetMipmap(O)), G && v.end(y), x.isScene === !0 && x.onAfterRender(y, x, F), fe.resetDefaultState(), ee = -1, te = null, C.pop(), C.length > 0 ? (E = C[C.length - 1], W.setTextureUnits(E.state.textureUnits), it === !0 && Me.setGlobalState(y.clippingPlanes, E.state.camera)) : E = null, w.pop(), w.length > 0 ? M = w[w.length - 1] : M = null, R !== null && R.renderEnd();
    };
    function is(x, F, H, G) {
      if (x.visible === !1) return;
      if (x.layers.test(F.layers)) {
        if (x.isGroup) H = x.renderOrder;
        else if (x.isLOD)
          x.autoUpdate === !0 && x.update(F);
        else if (x.isLightProbeGrid) E.pushLightProbeGrid(x);
        else if (x.isLight)
          E.pushLight(x), x.castShadow && E.pushShadow(x);
        else if (x.isSprite) {
          if (!x.frustumCulled || Ve.intersectsSprite(x)) {
            G && nt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(It);
            const se = N.update(x), he = x.material;
            he.visible && M.push(x, se, he, H, nt.z, null);
          }
        } else if ((x.isMesh || x.isLine || x.isPoints) && (!x.frustumCulled || Ve.intersectsObject(x))) {
          const se = N.update(x), he = x.material;
          if (G && (x.boundingSphere !== void 0 ? (x.boundingSphere === null && x.computeBoundingSphere(), nt.copy(x.boundingSphere.center)) : (se.boundingSphere === null && se.computeBoundingSphere(), nt.copy(se.boundingSphere.center)), nt.applyMatrix4(x.matrixWorld).applyMatrix4(It)), Array.isArray(he)) {
            const me = se.groups;
            for (let ge = 0, Pe = me.length; ge < Pe; ge++) {
              const Oe = me[ge], Be = he[Oe.materialIndex];
              Be && Be.visible && M.push(x, se, Be, H, nt.z, Oe);
            }
          } else he.visible && M.push(x, se, he, H, nt.z, null);
        }
      }
      const B = x.children;
      for (let se = 0, he = B.length; se < he; se++) is(B[se], F, H, G);
    }
    function ua(x, F, H, G) {
      const { opaque: B, transmissive: se, transparent: he } = x;
      E.setupLightsView(H), it === !0 && Me.setGlobalState(y.clippingPlanes, H), G && S.viewport(ie.copy(G)), B.length > 0 && sr(B, F, H), se.length > 0 && sr(se, F, H), he.length > 0 && sr(he, F, H), S.buffers.depth.setTest(!0), S.buffers.depth.setMask(!0), S.buffers.color.setMask(!0), S.setPolygonOffset(!1);
    }
    function fa(x, F, H, G) {
      if ((H.isScene === !0 ? H.overrideMaterial : null) !== null) return;
      if (E.state.transmissionRenderTarget[G.id] === void 0) {
        const Be = Ke.has("EXT_color_buffer_half_float") || Ke.has("EXT_color_buffer_float");
        E.state.transmissionRenderTarget[G.id] = new oi(1, 1, {
          generateMipmaps: !0,
          type: Be ? ji : Ui,
          minFilter: nr,
          samples: Math.max(4, rt.samples),
          stencilBuffer: r,
          resolveDepthBuffer: !1,
          resolveStencilBuffer: !1,
          colorSpace: Ge.workingColorSpace
        });
      }
      const B = E.state.transmissionRenderTarget[G.id], se = G.viewport || ie;
      B.setSize(se.z * y.transmissionResolutionScale, se.w * y.transmissionResolutionScale);
      const he = y.getRenderTarget(), me = y.getActiveCubeFace(), ge = y.getActiveMipmapLevel();
      y.setRenderTarget(B), y.getClearColor(Qe), je = y.getClearAlpha(), je < 1 && y.setClearColor(16777215, 0.5), y.clear(), mt && De.render(H);
      const Pe = y.toneMapping;
      y.toneMapping = 0;
      const Oe = G.viewport;
      if (G.viewport !== void 0 && (G.viewport = void 0), E.setupLightsView(G), it === !0 && Me.setGlobalState(y.clippingPlanes, G), sr(x, H, G), W.updateMultisampleRenderTarget(B), W.updateRenderTargetMipmap(B), Ke.has("WEBGL_multisampled_render_to_texture") === !1) {
        let Be = !1;
        for (let Ee = 0, tt = F.length; Ee < tt; Ee++) {
          const { object: at, geometry: ot, material: We, group: Mt } = F[Ee];
          if (We.side === 2 && at.layers.test(G.layers)) {
            const _e = We.side;
            We.side = 1, We.needsUpdate = !0, pa(at, H, G, ot, We, Mt), We.side = _e, We.needsUpdate = !0, Be = !0;
          }
        }
        Be === !0 && (W.updateMultisampleRenderTarget(B), W.updateRenderTargetMipmap(B));
      }
      y.setRenderTarget(he, me, ge), y.setClearColor(Qe, je), Oe !== void 0 && (G.viewport = Oe), y.toneMapping = Pe;
    }
    function sr(x, F, H) {
      const G = F.isScene === !0 ? F.overrideMaterial : null;
      for (let B = 0, se = x.length; B < se; B++) {
        const he = x[B], { object: me, geometry: ge, group: Pe } = he;
        let Oe = he.material;
        Oe.allowOverride === !0 && G !== null && (Oe = G), me.layers.test(H.layers) && pa(me, F, H, ge, Oe, Pe);
      }
    }
    function pa(x, F, H, G, B, se) {
      x.onBeforeRender(y, F, H, G, B, se), x.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse, x.matrixWorld), x.normalMatrix.getNormalMatrix(x.modelViewMatrix), B.onBeforeRender(y, F, H, G, x, se), B.transparent === !0 && B.side === 2 && B.forceSinglePass === !1 ? (B.side = 1, B.needsUpdate = !0, y.renderBufferDirect(H, F, G, B, x, se), B.side = 0, B.needsUpdate = !0, y.renderBufferDirect(H, F, G, B, x, se), B.side = 2) : y.renderBufferDirect(H, F, G, B, x, se), x.onAfterRender(y, F, H, G, B, se);
    }
    function ar(x, F, H) {
      F.isScene !== !0 && (F = _t);
      const G = L.get(x), B = E.state.lights, se = E.state.shadowsArray, he = B.state.version, me = ne.getParameters(x, B.state, se, F, H, E.state.lightProbeGridArray), ge = ne.getProgramCacheKey(me);
      let Pe = G.programs;
      G.environment = x.isMeshStandardMaterial || x.isMeshLambertMaterial || x.isMeshPhongMaterial ? F.environment : null, G.fog = F.fog;
      const Oe = x.isMeshStandardMaterial || x.isMeshLambertMaterial && !x.envMap || x.isMeshPhongMaterial && !x.envMap;
      G.envMap = J.get(x.envMap || G.environment, Oe), G.envMapRotation = G.environment !== null && x.envMap === null ? F.environmentRotation : x.envMapRotation, Pe === void 0 && (x.addEventListener("dispose", ei), Pe = /* @__PURE__ */ new Map(), G.programs = Pe);
      let Be = Pe.get(ge);
      if (Be !== void 0) {
        if (G.currentProgram === Be && G.lightsStateVersion === he)
          return ga(x, me), Be;
      } else
        me.uniforms = ne.getUniforms(x), R !== null && x.isNodeMaterial && R.build(x, H, me), x.onBeforeCompile(me, y), Be = ne.acquireProgram(me, ge), Pe.set(ge, Be), G.uniforms = me.uniforms;
      const Ee = G.uniforms;
      return (!x.isShaderMaterial && !x.isRawShaderMaterial || x.clipping === !0) && (Ee.clippingPlanes = Me.uniform), ga(x, me), G.needsLights = tl(x), G.lightsStateVersion = he, G.needsLights && (Ee.ambientLightColor.value = B.state.ambient, Ee.lightProbe.value = B.state.probe, Ee.directionalLights.value = B.state.directional, Ee.directionalLightShadows.value = B.state.directionalShadow, Ee.spotLights.value = B.state.spot, Ee.spotLightShadows.value = B.state.spotShadow, Ee.rectAreaLights.value = B.state.rectArea, Ee.ltc_1.value = B.state.rectAreaLTC1, Ee.ltc_2.value = B.state.rectAreaLTC2, Ee.pointLights.value = B.state.point, Ee.pointLightShadows.value = B.state.pointShadow, Ee.hemisphereLights.value = B.state.hemi, Ee.directionalShadowMatrix.value = B.state.directionalShadowMatrix, Ee.spotLightMatrix.value = B.state.spotLightMatrix, Ee.spotLightMap.value = B.state.spotLightMap, Ee.pointShadowMatrix.value = B.state.pointShadowMatrix), G.lightProbeGrid = E.state.lightProbeGridArray.length > 0, G.currentProgram = Be, G.uniformsList = null, Be;
    }
    function ma(x) {
      if (x.uniformsList === null) {
        const F = x.currentProgram.getUniforms();
        x.uniformsList = kr.seqWithValue(F.seq, x.uniforms);
      }
      return x.uniformsList;
    }
    function ga(x, F) {
      const H = L.get(x);
      H.outputColorSpace = F.outputColorSpace, H.batching = F.batching, H.batchingColor = F.batchingColor, H.instancing = F.instancing, H.instancingColor = F.instancingColor, H.instancingMorph = F.instancingMorph, H.skinning = F.skinning, H.morphTargets = F.morphTargets, H.morphNormals = F.morphNormals, H.morphColors = F.morphColors, H.morphTargetsCount = F.morphTargetsCount, H.numClippingPlanes = F.numClippingPlanes, H.numIntersection = F.numClipIntersection, H.vertexAlphas = F.vertexAlphas, H.vertexTangents = F.vertexTangents, H.toneMapping = F.toneMapping;
    }
    function Zc(x, F) {
      if (x.length === 0) return null;
      if (x.length === 1) return x[0].texture !== null ? x[0] : null;
      A.setFromMatrixPosition(F.matrixWorld);
      for (let H = 0, G = x.length; H < G; H++) {
        const B = x[H];
        if (B.texture !== null && B.boundingBox.containsPoint(A)) return B;
      }
      return null;
    }
    function Qc(x, F, H, G, B) {
      F.isScene !== !0 && (F = _t), W.resetTextureUnits();
      const se = F.fog, he = G.isMeshStandardMaterial || G.isMeshLambertMaterial || G.isMeshPhongMaterial ? F.environment : null, me = O === null ? y.outputColorSpace : O.isXRRenderTarget === !0 ? O.texture.colorSpace : Ge.workingColorSpace, ge = G.isMeshStandardMaterial || G.isMeshLambertMaterial && !G.envMap || G.isMeshPhongMaterial && !G.envMap, Pe = J.get(G.envMap || he, ge), Oe = G.vertexColors === !0 && !!H.attributes.color && H.attributes.color.itemSize === 4, Be = !!H.attributes.tangent && (!!G.normalMap || G.anisotropy > 0), Ee = !!H.morphAttributes.position, tt = !!H.morphAttributes.normal, at = !!H.morphAttributes.color;
      let ot = 0;
      G.toneMapped && (O === null || O.isXRRenderTarget === !0) && (ot = y.toneMapping);
      const We = H.morphAttributes.position || H.morphAttributes.normal || H.morphAttributes.color, Mt = We !== void 0 ? We.length : 0, _e = L.get(G), qt = E.state.lights;
      if (it === !0 && (bt === !0 || x !== te)) {
        const Je = x === te && G.id === ee;
        Me.setState(G, x, Je);
      }
      let qe = !1;
      G.version === _e.__version ? (_e.needsLights && _e.lightsStateVersion !== qt.state.version || _e.outputColorSpace !== me || B.isBatchedMesh && _e.batching === !1 || !B.isBatchedMesh && _e.batching === !0 || B.isBatchedMesh && _e.batchingColor === !0 && B.colorTexture === null || B.isBatchedMesh && _e.batchingColor === !1 && B.colorTexture !== null || B.isInstancedMesh && _e.instancing === !1 || !B.isInstancedMesh && _e.instancing === !0 || B.isSkinnedMesh && _e.skinning === !1 || !B.isSkinnedMesh && _e.skinning === !0 || B.isInstancedMesh && _e.instancingColor === !0 && B.instanceColor === null || B.isInstancedMesh && _e.instancingColor === !1 && B.instanceColor !== null || B.isInstancedMesh && _e.instancingMorph === !0 && B.morphTexture === null || B.isInstancedMesh && _e.instancingMorph === !1 && B.morphTexture !== null || _e.envMap !== Pe || G.fog === !0 && _e.fog !== se || _e.numClippingPlanes !== void 0 && (_e.numClippingPlanes !== Me.numPlanes || _e.numIntersection !== Me.numIntersection) || _e.vertexAlphas !== Oe || _e.vertexTangents !== Be || _e.morphTargets !== Ee || _e.morphNormals !== tt || _e.morphColors !== at || _e.toneMapping !== ot || _e.morphTargetsCount !== Mt || !!_e.lightProbeGrid != E.state.lightProbeGridArray.length > 0) && (qe = !0) : (qe = !0, _e.__version = G.version);
      let Gt = _e.currentProgram;
      qe === !0 && (Gt = ar(G, F, B), R && G.isNodeMaterial && R.onUpdateProgram(G, Gt, _e));
      let ti = !1, Si = !1, Ji = !1;
      const $e = Gt.getUniforms(), ct = _e.uniforms;
      if (S.useProgram(Gt.program) && (ti = !0, Si = !0, Ji = !0), G.id !== ee && (ee = G.id, Si = !0), _e.needsLights) {
        const Je = Zc(E.state.lightProbeGridArray, B);
        _e.lightProbeGrid !== Je && (_e.lightProbeGrid = Je, Si = !0);
      }
      if (ti || te !== x) {
        S.buffers.depth.getReversed() && x.reversedDepth !== !0 && (x._reversedDepth = !0, x.updateProjectionMatrix()), $e.setValue(I, "projectionMatrix", x.projectionMatrix), $e.setValue(I, "viewMatrix", x.matrixWorldInverse);
        const Je = $e.map.cameraPosition;
        Je !== void 0 && Je.setValue(I, kt.setFromMatrixPosition(x.matrixWorld)), rt.logarithmicDepthBuffer && $e.setValue(I, "logDepthBufFC", 2 / (Math.log(x.far + 1) / Math.LN2)), (G.isMeshPhongMaterial || G.isMeshToonMaterial || G.isMeshLambertMaterial || G.isMeshBasicMaterial || G.isMeshStandardMaterial || G.isShaderMaterial) && $e.setValue(I, "isOrthographic", x.isOrthographicCamera === !0), te !== x && (te = x, Si = !0, Ji = !0);
      }
      if (_e.needsLights && (qt.state.directionalShadowMap.length > 0 && $e.setValue(I, "directionalShadowMap", qt.state.directionalShadowMap, W), qt.state.spotShadowMap.length > 0 && $e.setValue(I, "spotShadowMap", qt.state.spotShadowMap, W), qt.state.pointShadowMap.length > 0 && $e.setValue(I, "pointShadowMap", qt.state.pointShadowMap, W)), B.isSkinnedMesh) {
        $e.setOptional(I, B, "bindMatrix"), $e.setOptional(I, B, "bindMatrixInverse");
        const Je = B.skeleton;
        Je && (Je.boneTexture === null && Je.computeBoneTexture(), $e.setValue(I, "boneTexture", Je.boneTexture, W));
      }
      B.isBatchedMesh && ($e.setOptional(I, B, "batchingTexture"), $e.setValue(I, "batchingTexture", B._matricesTexture, W), $e.setOptional(I, B, "batchingIdTexture"), $e.setValue(I, "batchingIdTexture", B._indirectTexture, W), $e.setOptional(I, B, "batchingColorTexture"), B._colorsTexture !== null && $e.setValue(I, "batchingColorTexture", B._colorsTexture, W));
      const yi = H.morphAttributes;
      if ((yi.position !== void 0 || yi.normal !== void 0 || yi.color !== void 0) && He.update(B, H, Gt), (Si || _e.receiveShadow !== B.receiveShadow) && (_e.receiveShadow = B.receiveShadow, $e.setValue(I, "receiveShadow", B.receiveShadow)), (G.isMeshStandardMaterial || G.isMeshLambertMaterial || G.isMeshPhongMaterial) && G.envMap === null && F.environment !== null && (ct.envMapIntensity.value = F.environmentIntensity), ct.dfgLUT !== void 0 && (ct.dfgLUT.value = $f()), Si) {
        if ($e.setValue(I, "toneMappingExposure", y.toneMappingExposure), _e.needsLights && el(ct, Ji), se && G.fog === !0 && pe.refreshFogUniforms(ct, se), pe.refreshMaterialUniforms(ct, G, ae, K, E.state.transmissionRenderTarget[x.id]), _e.needsLights && _e.lightProbeGrid) {
          const Je = _e.lightProbeGrid;
          ct.probesSH.value = Je.texture, ct.probesMin.value.copy(Je.boundingBox.min), ct.probesMax.value.copy(Je.boundingBox.max), ct.probesResolution.value.copy(Je.resolution);
        }
        kr.upload(I, ma(_e), ct, W);
      }
      if (G.isShaderMaterial && G.uniformsNeedUpdate === !0 && (kr.upload(I, ma(_e), ct, W), G.uniformsNeedUpdate = !1), G.isSpriteMaterial && $e.setValue(I, "center", B.center), $e.setValue(I, "modelViewMatrix", B.modelViewMatrix), $e.setValue(I, "normalMatrix", B.normalMatrix), $e.setValue(I, "modelMatrix", B.matrixWorld), G.uniformsGroups !== void 0) {
        const Je = G.uniformsGroups;
        for (let In = 0, $i = Je.length; In < $i; In++) {
          const va = Je[In];
          ve.update(va, Gt), ve.bind(va, Gt);
        }
      }
      return Gt;
    }
    function el(x, F) {
      x.ambientLightColor.needsUpdate = F, x.lightProbe.needsUpdate = F, x.directionalLights.needsUpdate = F, x.directionalLightShadows.needsUpdate = F, x.pointLights.needsUpdate = F, x.pointLightShadows.needsUpdate = F, x.spotLights.needsUpdate = F, x.spotLightShadows.needsUpdate = F, x.rectAreaLights.needsUpdate = F, x.hemisphereLights.needsUpdate = F;
    }
    function tl(x) {
      return x.isMeshLambertMaterial || x.isMeshToonMaterial || x.isMeshPhongMaterial || x.isMeshStandardMaterial || x.isShadowMaterial || x.isShaderMaterial && x.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return z;
    }, this.getActiveMipmapLevel = function() {
      return j;
    }, this.getRenderTarget = function() {
      return O;
    }, this.setRenderTargetTextures = function(x, F, H) {
      const G = L.get(x);
      G.__autoAllocateDepthBuffer = x.resolveDepthBuffer === !1, G.__autoAllocateDepthBuffer === !1 && (G.__useRenderToTexture = !1), L.get(x.texture).__webglTexture = F, L.get(x.depthTexture).__webglTexture = G.__autoAllocateDepthBuffer ? void 0 : H, G.__hasExternalTextures = !0;
    }, this.setRenderTargetFramebuffer = function(x, F) {
      const H = L.get(x);
      H.__webglFramebuffer = F, H.__useDefaultFramebuffer = F === void 0;
    }, this.setRenderTarget = function(x, F = 0, H = 0) {
      O = x, z = F, j = H;
      let G = null, B = !1, se = !1;
      if (x) {
        const he = L.get(x);
        if (he.__useDefaultFramebuffer !== void 0) {
          S.bindFramebuffer(I.FRAMEBUFFER, he.__webglFramebuffer), ie.copy(x.viewport), de.copy(x.scissor), Se = x.scissorTest, S.viewport(ie), S.scissor(de), S.setScissorTest(Se), ee = -1;
          return;
        } else if (he.__webglFramebuffer === void 0) W.setupRenderTarget(x);
        else if (he.__hasExternalTextures) W.rebindTextures(x, L.get(x.texture).__webglTexture, L.get(x.depthTexture).__webglTexture);
        else if (x.depthBuffer) {
          const Pe = x.depthTexture;
          if (he.__boundDepthTexture !== Pe) {
            if (Pe !== null && L.has(Pe) && (x.width !== Pe.image.width || x.height !== Pe.image.height)) throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");
            W.setupDepthRenderbuffer(x);
          }
        }
        const me = x.texture;
        (me.isData3DTexture || me.isDataArrayTexture || me.isCompressedArrayTexture) && (se = !0);
        const ge = L.get(x).__webglFramebuffer;
        x.isWebGLCubeRenderTarget ? (Array.isArray(ge[F]) ? G = ge[F][H] : G = ge[F], B = !0) : x.samples > 0 && W.useMultisampledRTT(x) === !1 ? G = L.get(x).__webglMultisampledFramebuffer : Array.isArray(ge) ? G = ge[H] : G = ge, ie.copy(x.viewport), de.copy(x.scissor), Se = x.scissorTest;
      } else
        ie.copy(Ce).multiplyScalar(ae).floor(), de.copy(Le).multiplyScalar(ae).floor(), Se = Xe;
      if (H !== 0 && (G = k), S.bindFramebuffer(I.FRAMEBUFFER, G) && S.drawBuffers(x, G), S.viewport(ie), S.scissor(de), S.setScissorTest(Se), B) {
        const he = L.get(x.texture);
        I.framebufferTexture2D(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_CUBE_MAP_POSITIVE_X + F, he.__webglTexture, H);
      } else if (se) {
        const he = F;
        for (let me = 0; me < x.textures.length; me++) {
          const ge = L.get(x.textures[me]);
          I.framebufferTextureLayer(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0 + me, ge.__webglTexture, H, he);
        }
      } else if (x !== null && H !== 0) {
        const he = L.get(x.texture);
        I.framebufferTexture2D(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, he.__webglTexture, H);
      }
      ee = -1;
    }, this.readRenderTargetPixels = function(x, F, H, G, B, se, he, me = 0) {
      if (!(x && x.isWebGLRenderTarget)) {
        Re("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let ge = L.get(x).__webglFramebuffer;
      if (x.isWebGLCubeRenderTarget && he !== void 0 && (ge = ge[he]), ge) {
        S.bindFramebuffer(I.FRAMEBUFFER, ge);
        try {
          const Pe = x.textures[me], Oe = Pe.format, Be = Pe.type;
          if (x.textures.length > 1 && I.readBuffer(I.COLOR_ATTACHMENT0 + me), !rt.textureFormatReadable(Oe)) {
            Re("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!rt.textureTypeReadable(Be)) {
            Re("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          F >= 0 && F <= x.width - G && H >= 0 && H <= x.height - B && I.readPixels(F, H, G, B, $.convert(Oe), $.convert(Be), se);
        } finally {
          const Pe = O !== null ? L.get(O).__webglFramebuffer : null;
          S.bindFramebuffer(I.FRAMEBUFFER, Pe);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(x, F, H, G, B, se, he, me = 0) {
      if (!(x && x.isWebGLRenderTarget)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let ge = L.get(x).__webglFramebuffer;
      if (x.isWebGLCubeRenderTarget && he !== void 0 && (ge = ge[he]), ge)
        if (F >= 0 && F <= x.width - G && H >= 0 && H <= x.height - B) {
          S.bindFramebuffer(I.FRAMEBUFFER, ge);
          const Pe = x.textures[me], Oe = Pe.format, Be = Pe.type;
          if (x.textures.length > 1 && I.readBuffer(I.COLOR_ATTACHMENT0 + me), !rt.textureFormatReadable(Oe)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
          if (!rt.textureTypeReadable(Be)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
          const Ee = I.createBuffer();
          I.bindBuffer(I.PIXEL_PACK_BUFFER, Ee), I.bufferData(I.PIXEL_PACK_BUFFER, se.byteLength, I.STREAM_READ), I.readPixels(F, H, G, B, $.convert(Oe), $.convert(Be), 0);
          const tt = O !== null ? L.get(O).__webglFramebuffer : null;
          S.bindFramebuffer(I.FRAMEBUFFER, tt);
          const at = I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return I.flush(), await $l(I, at, 4), I.bindBuffer(I.PIXEL_PACK_BUFFER, Ee), I.getBufferSubData(I.PIXEL_PACK_BUFFER, 0, se), I.deleteBuffer(Ee), I.deleteSync(at), se;
        } else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
    }, this.copyFramebufferToTexture = function(x, F = null, H = 0) {
      const G = Math.pow(2, -H), B = Math.floor(x.image.width * G), se = Math.floor(x.image.height * G), he = F !== null ? F.x : 0, me = F !== null ? F.y : 0;
      W.setTexture2D(x, 0), I.copyTexSubImage2D(I.TEXTURE_2D, H, 0, 0, he, me, B, se), S.unbindTexture();
    }, this.copyTextureToTexture = function(x, F, H = null, G = null, B = 0, se = 0) {
      let he, me, ge, Pe, Oe, Be, Ee, tt, at;
      const ot = x.isCompressedTexture ? x.mipmaps[se] : x.image;
      if (H !== null)
        he = H.max.x - H.min.x, me = H.max.y - H.min.y, ge = H.isBox3 ? H.max.z - H.min.z : 1, Pe = H.min.x, Oe = H.min.y, Be = H.isBox3 ? H.min.z : 0;
      else {
        const ct = Math.pow(2, -B);
        he = Math.floor(ot.width * ct), me = Math.floor(ot.height * ct), x.isDataArrayTexture ? ge = ot.depth : x.isData3DTexture ? ge = Math.floor(ot.depth * ct) : ge = 1, Pe = 0, Oe = 0, Be = 0;
      }
      G !== null ? (Ee = G.x, tt = G.y, at = G.z) : (Ee = 0, tt = 0, at = 0);
      const We = $.convert(F.format), Mt = $.convert(F.type);
      let _e;
      F.isData3DTexture ? (W.setTexture3D(F, 0), _e = I.TEXTURE_3D) : F.isDataArrayTexture || F.isCompressedArrayTexture ? (W.setTexture2DArray(F, 0), _e = I.TEXTURE_2D_ARRAY) : (W.setTexture2D(F, 0), _e = I.TEXTURE_2D), S.activeTexture(I.TEXTURE0), S.pixelStorei(I.UNPACK_FLIP_Y_WEBGL, F.flipY), S.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL, F.premultiplyAlpha), S.pixelStorei(I.UNPACK_ALIGNMENT, F.unpackAlignment);
      const qt = S.getParameter(I.UNPACK_ROW_LENGTH), qe = S.getParameter(I.UNPACK_IMAGE_HEIGHT), Gt = S.getParameter(I.UNPACK_SKIP_PIXELS), ti = S.getParameter(I.UNPACK_SKIP_ROWS), Si = S.getParameter(I.UNPACK_SKIP_IMAGES);
      S.pixelStorei(I.UNPACK_ROW_LENGTH, ot.width), S.pixelStorei(I.UNPACK_IMAGE_HEIGHT, ot.height), S.pixelStorei(I.UNPACK_SKIP_PIXELS, Pe), S.pixelStorei(I.UNPACK_SKIP_ROWS, Oe), S.pixelStorei(I.UNPACK_SKIP_IMAGES, Be);
      const Ji = x.isDataArrayTexture || x.isData3DTexture, $e = F.isDataArrayTexture || F.isData3DTexture;
      if (x.isDepthTexture) {
        const ct = L.get(x), yi = L.get(F), Je = L.get(ct.__renderTarget), In = L.get(yi.__renderTarget);
        S.bindFramebuffer(I.READ_FRAMEBUFFER, Je.__webglFramebuffer), S.bindFramebuffer(I.DRAW_FRAMEBUFFER, In.__webglFramebuffer);
        for (let $i = 0; $i < ge; $i++)
          Ji && (I.framebufferTextureLayer(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, L.get(x).__webglTexture, B, Be + $i), I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, L.get(F).__webglTexture, se, at + $i)), I.blitFramebuffer(Pe, Oe, he, me, Ee, tt, he, me, I.DEPTH_BUFFER_BIT, I.NEAREST);
        S.bindFramebuffer(I.READ_FRAMEBUFFER, null), S.bindFramebuffer(I.DRAW_FRAMEBUFFER, null);
      } else if (B !== 0 || x.isRenderTargetTexture || L.has(x)) {
        const ct = L.get(x), yi = L.get(F);
        S.bindFramebuffer(I.READ_FRAMEBUFFER, q), S.bindFramebuffer(I.DRAW_FRAMEBUFFER, X);
        for (let Je = 0; Je < ge; Je++)
          Ji ? I.framebufferTextureLayer(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, ct.__webglTexture, B, Be + Je) : I.framebufferTexture2D(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, ct.__webglTexture, B), $e ? I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, yi.__webglTexture, se, at + Je) : I.framebufferTexture2D(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, yi.__webglTexture, se), B !== 0 ? I.blitFramebuffer(Pe, Oe, he, me, Ee, tt, he, me, I.COLOR_BUFFER_BIT, I.NEAREST) : $e ? I.copyTexSubImage3D(_e, se, Ee, tt, at + Je, Pe, Oe, he, me) : I.copyTexSubImage2D(_e, se, Ee, tt, Pe, Oe, he, me);
        S.bindFramebuffer(I.READ_FRAMEBUFFER, null), S.bindFramebuffer(I.DRAW_FRAMEBUFFER, null);
      } else $e ? x.isDataTexture || x.isData3DTexture ? I.texSubImage3D(_e, se, Ee, tt, at, he, me, ge, We, Mt, ot.data) : F.isCompressedArrayTexture ? I.compressedTexSubImage3D(_e, se, Ee, tt, at, he, me, ge, We, ot.data) : I.texSubImage3D(_e, se, Ee, tt, at, he, me, ge, We, Mt, ot) : x.isDataTexture ? I.texSubImage2D(I.TEXTURE_2D, se, Ee, tt, he, me, We, Mt, ot.data) : x.isCompressedTexture ? I.compressedTexSubImage2D(I.TEXTURE_2D, se, Ee, tt, ot.width, ot.height, We, ot.data) : I.texSubImage2D(I.TEXTURE_2D, se, Ee, tt, he, me, We, Mt, ot);
      S.pixelStorei(I.UNPACK_ROW_LENGTH, qt), S.pixelStorei(I.UNPACK_IMAGE_HEIGHT, qe), S.pixelStorei(I.UNPACK_SKIP_PIXELS, Gt), S.pixelStorei(I.UNPACK_SKIP_ROWS, ti), S.pixelStorei(I.UNPACK_SKIP_IMAGES, Si), se === 0 && F.generateMipmaps && I.generateMipmap(_e), S.unbindTexture();
    }, this.initRenderTarget = function(x) {
      L.get(x).__webglFramebuffer === void 0 && W.setupRenderTarget(x);
    }, this.initTexture = function(x) {
      x.isCubeTexture ? W.setTextureCube(x, 0) : x.isData3DTexture ? W.setTexture3D(x, 0) : x.isDataArrayTexture || x.isCompressedArrayTexture ? W.setTexture2DArray(x, 0) : W.setTexture2D(x, 0), S.unbindTexture();
    }, this.resetState = function() {
      z = 0, j = 0, O = null, S.reset(), fe.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return Sn;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const t = this.getContext();
    t.drawingBufferColorSpace = Ge._getDrawingBufferColorSpace(e), t.unpackColorSpace = Ge._getUnpackColorSpace();
  }
};
function Po(e, t) {
  if (t === 0)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
  if (t === 2 || t === 1) {
    let i = e.getIndex();
    if (i === null) {
      const a = [], o = e.getAttribute("position");
      if (o !== void 0) {
        for (let c = 0; c < o.count; c++) a.push(c);
        e.setIndex(a), i = e.getIndex();
      } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
    }
    const n = i.count - 2, r = [];
    if (t === 2) for (let a = 1; a <= n; a++)
      r.push(i.getX(0)), r.push(i.getX(a)), r.push(i.getX(a + 1));
    else for (let a = 0; a < n; a++) a % 2 === 0 ? (r.push(i.getX(a)), r.push(i.getX(a + 1)), r.push(i.getX(a + 2))) : (r.push(i.getX(a + 2)), r.push(i.getX(a + 1)), r.push(i.getX(a)));
    r.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const s = e.clone();
    return s.setIndex(r), s.clearGroups(), s;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
function Qf(e) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), n = e.clone();
  return Hc(e, n, function(r, s) {
    t.set(s, r), i.set(r, s);
  }), n.traverse(function(r) {
    if (!r.isSkinnedMesh) return;
    const s = r, a = t.get(r), o = a.skeleton.bones;
    s.skeleton = a.skeleton.clone(), s.bindMatrix.copy(a.bindMatrix), s.skeleton.bones = o.map(function(c) {
      return i.get(c);
    }), s.bind(s.skeleton, s.bindMatrix);
  }), n;
}
function Hc(e, t, i) {
  i(e, t);
  for (let n = 0; n < e.children.length; n++) Hc(e.children[n], t.children[n], i);
}
var ep = class extends Ln {
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new sp(t);
    }), this.register(function(t) {
      return new ap(t);
    }), this.register(function(t) {
      return new mp(t);
    }), this.register(function(t) {
      return new gp(t);
    }), this.register(function(t) {
      return new vp(t);
    }), this.register(function(t) {
      return new cp(t);
    }), this.register(function(t) {
      return new lp(t);
    }), this.register(function(t) {
      return new hp(t);
    }), this.register(function(t) {
      return new dp(t);
    }), this.register(function(t) {
      return new rp(t);
    }), this.register(function(t) {
      return new up(t);
    }), this.register(function(t) {
      return new op(t);
    }), this.register(function(t) {
      return new pp(t);
    }), this.register(function(t) {
      return new fp(t);
    }), this.register(function(t) {
      return new ip(t);
    }), this.register(function(t) {
      return new Lo(t, ke.EXT_MESHOPT_COMPRESSION);
    }), this.register(function(t) {
      return new Lo(t, ke.KHR_MESHOPT_COMPRESSION);
    }), this.register(function(t) {
      return new bp(t);
    });
  }
  load(e, t, i, n) {
    const r = this;
    let s;
    if (this.resourcePath !== "") s = this.resourcePath;
    else if (this.path !== "") {
      const c = Yn.extractUrlBase(e);
      s = Yn.resolveURL(c, this.path);
    } else s = Yn.extractUrlBase(e);
    this.manager.itemStart(e);
    const a = function(c) {
      n ? n(c) : console.error(c), r.manager.itemError(e), r.manager.itemEnd(e);
    }, o = new Dc(this.manager);
    o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(e, function(c) {
      try {
        r.parse(c, s, function(l) {
          t(l), r.manager.itemEnd(e);
        }, a);
      } catch (l) {
        a(l);
      }
    }, i, a);
  }
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  parse(e, t, i, n) {
    let r;
    const s = {}, a = {}, o = new TextDecoder();
    if (typeof e == "string") r = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (o.decode(new Uint8Array(e, 0, 4)) === Wc) {
        try {
          s[ke.KHR_BINARY_GLTF] = new _p(e);
        } catch (l) {
          n && n(l);
          return;
        }
        r = JSON.parse(s[ke.KHR_BINARY_GLTF].content);
      } else r = JSON.parse(o.decode(e));
    else r = e;
    if (r.asset === void 0 || r.asset.version[0] < 2) {
      n && n(/* @__PURE__ */ new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const c = new Dp(r, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    c.fileLoader.setRequestHeader(this.requestHeader);
    for (let l = 0; l < this.pluginCallbacks.length; l++) {
      const h = this.pluginCallbacks[l](c);
      h.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), a[h.name] = h, s[h.name] = !0;
    }
    if (r.extensionsUsed) for (let l = 0; l < r.extensionsUsed.length; ++l) {
      const h = r.extensionsUsed[l], u = r.extensionsRequired || [];
      switch (h) {
        case ke.KHR_MATERIALS_UNLIT:
          s[h] = new np();
          break;
        case ke.KHR_DRACO_MESH_COMPRESSION:
          s[h] = new Mp(r, this.dracoLoader);
          break;
        case ke.KHR_TEXTURE_TRANSFORM:
          s[h] = new xp();
          break;
        case ke.KHR_MESH_QUANTIZATION:
          s[h] = new Sp();
          break;
        default:
          u.indexOf(h) >= 0 && a[h] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + h + '".');
      }
    }
    c.setExtensions(s), c.setPlugins(a), c.parse(i, n);
  }
  parseAsync(e, t) {
    const i = this;
    return new Promise(function(n, r) {
      i.parse(e, t, n, r);
    });
  }
};
function tp() {
  let e = {};
  return {
    get: function(t) {
      return e[t];
    },
    add: function(t, i) {
      e[t] = i;
    },
    remove: function(t) {
      delete e[t];
    },
    removeAll: function() {
      e = {};
    }
  };
}
function lt(e, t, i) {
  const n = e.json.materials[t];
  return n.extensions && n.extensions[i] ? n.extensions[i] : null;
}
var ke = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
}, ip = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_LIGHTS_PUNCTUAL, this.cache = {
      refs: {},
      uses: {}
    };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let i = 0, n = t.length; i < n; i++) {
      const r = t[i];
      r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, i = "light:" + e;
    let n = t.cache.get(i);
    if (n) return n;
    const r = t.json, s = ((r.extensions && r.extensions[this.name] || {}).lights || [])[e];
    let a;
    const o = new Te(16777215);
    s.color !== void 0 && o.setRGB(s.color[0], s.color[1], s.color[2], Zt);
    const c = s.range !== void 0 ? s.range : 0;
    switch (s.type) {
      case "directional":
        a = new Nc(o), a.target.position.set(0, 0, -1), a.add(a.target);
        break;
      case "point":
        a = new qs(o), a.distance = c;
        break;
      case "spot":
        a = new vd(o), a.distance = c, s.spot = s.spot || {}, s.spot.innerConeAngle = s.spot.innerConeAngle !== void 0 ? s.spot.innerConeAngle : 0, s.spot.outerConeAngle = s.spot.outerConeAngle !== void 0 ? s.spot.outerConeAngle : Math.PI / 4, a.angle = s.spot.outerConeAngle, a.penumbra = 1 - s.spot.innerConeAngle / s.spot.outerConeAngle, a.target.position.set(0, 0, -1), a.add(a.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + s.type);
    }
    return a.position.set(0, 0, 0), ri(a, s), s.intensity !== void 0 && (a.intensity = s.intensity), a.name = t.createUniqueName(s.name || "light_" + e), n = Promise.resolve(a), t.cache.add(i, n), n;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, i = this.parser, n = i.json.nodes[e], r = (n.extensions && n.extensions[this.name] || {}).light;
    return r === void 0 ? null : this._loadLight(r).then(function(s) {
      return i._getNodeRef(t.cache, r, s);
    });
  }
}, np = class {
  constructor() {
    this.name = ke.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return Jt;
  }
  extendParams(e, t, i) {
    const n = [];
    e.color = new Te(1, 1, 1), e.opacity = 1;
    const r = t.pbrMetallicRoughness;
    if (r) {
      if (Array.isArray(r.baseColorFactor)) {
        const s = r.baseColorFactor;
        e.color.setRGB(s[0], s[1], s[2], Zt), e.opacity = s[3];
      }
      r.baseColorTexture !== void 0 && n.push(i.assignTexture(e, "map", r.baseColorTexture, vt));
    }
    return Promise.all(n);
  }
}, rp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    return i === null || i.emissiveStrength !== void 0 && (t.emissiveIntensity = i.emissiveStrength), Promise.resolve();
  }
}, sp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    if (i.clearcoatFactor !== void 0 && (t.clearcoat = i.clearcoatFactor), i.clearcoatTexture !== void 0 && n.push(this.parser.assignTexture(t, "clearcoatMap", i.clearcoatTexture)), i.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = i.clearcoatRoughnessFactor), i.clearcoatRoughnessTexture !== void 0 && n.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", i.clearcoatRoughnessTexture)), i.clearcoatNormalTexture !== void 0 && (n.push(this.parser.assignTexture(t, "clearcoatNormalMap", i.clearcoatNormalTexture)), i.clearcoatNormalTexture.scale !== void 0)) {
      const r = i.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new Fe(r, r);
    }
    return Promise.all(n);
  }
}, ap = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    return i === null || (t.dispersion = i.dispersion !== void 0 ? i.dispersion : 0), Promise.resolve();
  }
}, op = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    return i.iridescenceFactor !== void 0 && (t.iridescence = i.iridescenceFactor), i.iridescenceTexture !== void 0 && n.push(this.parser.assignTexture(t, "iridescenceMap", i.iridescenceTexture)), i.iridescenceIor !== void 0 && (t.iridescenceIOR = i.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), i.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = i.iridescenceThicknessMinimum), i.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = i.iridescenceThicknessMaximum), i.iridescenceThicknessTexture !== void 0 && n.push(this.parser.assignTexture(t, "iridescenceThicknessMap", i.iridescenceThicknessTexture)), Promise.all(n);
  }
}, cp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    if (t.sheenColor = new Te(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, i.sheenColorFactor !== void 0) {
      const r = i.sheenColorFactor;
      t.sheenColor.setRGB(r[0], r[1], r[2], Zt);
    }
    return i.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = i.sheenRoughnessFactor), i.sheenColorTexture !== void 0 && n.push(this.parser.assignTexture(t, "sheenColorMap", i.sheenColorTexture, vt)), i.sheenRoughnessTexture !== void 0 && n.push(this.parser.assignTexture(t, "sheenRoughnessMap", i.sheenRoughnessTexture)), Promise.all(n);
  }
}, lp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    return i.transmissionFactor !== void 0 && (t.transmission = i.transmissionFactor), i.transmissionTexture !== void 0 && n.push(this.parser.assignTexture(t, "transmissionMap", i.transmissionTexture)), Promise.all(n);
  }
}, hp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    t.thickness = i.thicknessFactor !== void 0 ? i.thicknessFactor : 0, i.thicknessTexture !== void 0 && n.push(this.parser.assignTexture(t, "thicknessMap", i.thicknessTexture)), t.attenuationDistance = i.attenuationDistance || 1 / 0;
    const r = i.attenuationColor || [
      1,
      1,
      1
    ];
    return t.attenuationColor = new Te().setRGB(r[0], r[1], r[2], Zt), Promise.all(n);
  }
}, dp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    return i === null || (t.ior = i.ior !== void 0 ? i.ior : 1.5, t.ior === 0 && (t.ior = 1e3)), Promise.resolve();
  }
}, up = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    t.specularIntensity = i.specularFactor !== void 0 ? i.specularFactor : 1, i.specularTexture !== void 0 && n.push(this.parser.assignTexture(t, "specularIntensityMap", i.specularTexture));
    const r = i.specularColorFactor || [
      1,
      1,
      1
    ];
    return t.specularColor = new Te().setRGB(r[0], r[1], r[2], Zt), i.specularColorTexture !== void 0 && n.push(this.parser.assignTexture(t, "specularColorMap", i.specularColorTexture, vt)), Promise.all(n);
  }
}, fp = class {
  constructor(e) {
    this.parser = e, this.name = ke.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    return t.bumpScale = i.bumpFactor !== void 0 ? i.bumpFactor : 1, i.bumpTexture !== void 0 && n.push(this.parser.assignTexture(t, "bumpMap", i.bumpTexture)), Promise.all(n);
  }
}, pp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    return lt(this.parser, e, this.name) !== null ? di : null;
  }
  extendMaterialParams(e, t) {
    const i = lt(this.parser, e, this.name);
    if (i === null) return Promise.resolve();
    const n = [];
    return i.anisotropyStrength !== void 0 && (t.anisotropy = i.anisotropyStrength), i.anisotropyRotation !== void 0 && (t.anisotropyRotation = i.anisotropyRotation), i.anisotropyTexture !== void 0 && n.push(this.parser.assignTexture(t, "anisotropyMap", i.anisotropyTexture)), Promise.all(n);
  }
}, mp = class {
  constructor(e) {
    this.parser = e, this.name = ke.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, i = t.json, n = i.textures[e];
    if (!n.extensions || !n.extensions[this.name]) return null;
    const r = n.extensions[this.name], s = t.options.ktx2Loader;
    if (!s) {
      if (i.extensionsRequired && i.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, r.source, s);
  }
}, gp = class {
  constructor(e) {
    this.parser = e, this.name = ke.EXT_TEXTURE_WEBP;
  }
  loadTexture(e) {
    const t = this.name, i = this.parser, n = i.json, r = n.textures[e];
    if (!r.extensions || !r.extensions[t]) return null;
    const s = r.extensions[t], a = n.images[s.source];
    let o = i.textureLoader;
    if (a.uri) {
      const c = i.options.manager.getHandler(a.uri);
      c !== null && (o = c);
    }
    return i.loadTextureImage(e, s.source, o);
  }
}, vp = class {
  constructor(e) {
    this.parser = e, this.name = ke.EXT_TEXTURE_AVIF;
  }
  loadTexture(e) {
    const t = this.name, i = this.parser, n = i.json, r = n.textures[e];
    if (!r.extensions || !r.extensions[t]) return null;
    const s = r.extensions[t], a = n.images[s.source];
    let o = i.textureLoader;
    if (a.uri) {
      const c = i.options.manager.getHandler(a.uri);
      c !== null && (o = c);
    }
    return i.loadTextureImage(e, s.source, o);
  }
}, Lo = class {
  constructor(e, t) {
    this.name = t, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, i = t.bufferViews[e];
    if (i.extensions && i.extensions[this.name]) {
      const n = i.extensions[this.name], r = this.parser.getDependency("buffer", n.buffer), s = this.parser.options.meshoptDecoder;
      if (!s || !s.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return r.then(function(a) {
        const o = n.byteOffset || 0, c = n.byteLength || 0, l = n.count, h = n.byteStride, u = new Uint8Array(a, o, c);
        return s.decodeGltfBufferAsync ? s.decodeGltfBufferAsync(l, h, u, n.mode, n.filter).then(function(d) {
          return d.buffer;
        }) : s.ready.then(function() {
          const d = new ArrayBuffer(l * h);
          return s.decodeGltfBuffer(new Uint8Array(d), l, h, u, n.mode, n.filter), d;
        });
      });
    } else return null;
  }
}, bp = class {
  constructor(e) {
    this.name = ke.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, i = t.nodes[e];
    if (!i.extensions || !i.extensions[this.name] || i.mesh === void 0) return null;
    const n = t.meshes[i.mesh];
    for (const o of n.primitives) if (o.mode !== Vt.TRIANGLES && o.mode !== Vt.TRIANGLE_STRIP && o.mode !== Vt.TRIANGLE_FAN && o.mode !== void 0) return null;
    const r = i.extensions[this.name].attributes, s = [], a = {};
    for (const o in r) s.push(this.parser.getDependency("accessor", r[o]).then((c) => (a[o] = c, a[o])));
    return s.length < 1 ? null : (s.push(this.parser.createNodeMesh(e)), Promise.all(s).then((o) => {
      const c = o.pop(), l = c.isGroup ? c.children : [c], h = o[0].count, u = [];
      for (const d of l) {
        const p = new Ne(), g = new U(), _ = new Ht(), m = new U(1, 1, 1), f = new zh(d.geometry, d.material, h);
        for (let T = 0; T < h; T++)
          a.TRANSLATION && g.fromBufferAttribute(a.TRANSLATION, T), a.ROTATION && _.fromBufferAttribute(a.ROTATION, T), a.SCALE && m.fromBufferAttribute(a.SCALE, T), f.setMatrixAt(T, p.compose(g, _, m));
        for (const T in a) if (T === "_COLOR_0") {
          const A = a[T];
          f.instanceColor = new qr(A.array, A.itemSize, A.normalized);
        } else T !== "TRANSLATION" && T !== "ROTATION" && T !== "SCALE" && d.geometry.setAttribute(T, a[T]);
        dt.prototype.copy.call(f, d), this.parser.assignFinalMaterial(f), u.push(f);
      }
      return c.isGroup ? (c.clear(), c.add(...u), c) : u[0];
    }));
  }
}, Wc = "glTF", qn = 12, Do = {
  JSON: 1313821514,
  BIN: 5130562
}, _p = class {
  constructor(e) {
    this.name = ke.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, qn), i = new TextDecoder();
    if (this.header = {
      magic: i.decode(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== Wc) throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const n = this.header.length - qn, r = new DataView(e, qn);
    let s = 0;
    for (; s < n; ) {
      const a = r.getUint32(s, !0);
      s += 4;
      const o = r.getUint32(s, !0);
      if (s += 4, o === Do.JSON) {
        const c = new Uint8Array(e, qn + s, a);
        this.content = i.decode(c);
      } else if (o === Do.BIN) {
        const c = qn + s;
        this.body = e.slice(c, c + a);
      }
      s += a;
    }
    if (this.content === null) throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}, Mp = class {
  constructor(e, t) {
    if (!t) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = ke.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const i = this.json, n = this.dracoLoader, r = e.extensions[this.name].bufferView, s = e.extensions[this.name].attributes, a = {}, o = {}, c = {};
    for (const l in s) {
      const h = Js[l] || l.toLowerCase();
      a[h] = s[l];
    }
    for (const l in e.attributes) {
      const h = Js[l] || l.toLowerCase();
      if (s[l] !== void 0) {
        const u = i.accessors[e.attributes[l]];
        c[h] = Mn[u.componentType].name, o[h] = u.normalized === !0;
      }
    }
    return t.getDependency("bufferView", r).then(function(l) {
      return new Promise(function(h, u) {
        n.decodeDracoFile(l, function(d) {
          for (const p in d.attributes) {
            const g = d.attributes[p], _ = o[p];
            _ !== void 0 && (g.normalized = _);
          }
          h(d);
        }, a, c, Zt, u);
      });
    });
  }
}, xp = class {
  constructor() {
    this.name = ke.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}, Sp = class {
  constructor() {
    this.name = ke.KHR_MESH_QUANTIZATION;
  }
}, qc = class extends Rn {
  constructor(e, t, i, n) {
    super(e, t, i, n);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, i = this.sampleValues, n = this.valueSize, r = e * n * 3 + n;
    for (let s = 0; s !== n; s++) t[s] = i[r + s];
    return t;
  }
  interpolate_(e, t, i, n) {
    const r = this.resultBuffer, s = this.sampleValues, a = this.valueSize, o = a * 2, c = a * 3, l = n - t, h = (i - t) / l, u = h * h, d = u * h, p = e * c, g = p - c, _ = -2 * d + 3 * u, m = d - u, f = 1 - _, T = m - u + h;
    for (let A = 0; A !== a; A++) {
      const M = s[g + A + a], E = s[g + A + o] * l, w = s[p + A + a], C = s[p + A] * l;
      r[A] = f * M + T * E + _ * w + m * C;
    }
    return r;
  }
}, yp = new Ht(), Ep = class extends qc {
  interpolate_(e, t, i, n) {
    const r = super.interpolate_(e, t, i, n);
    return yp.fromArray(r).normalize().toArray(r), r;
  }
}, Vt = {
  FLOAT: 5126,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123
}, Mn = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, Io = {
  9728: Et,
  9729: Lt,
  9984: Yo,
  9985: $o,
  9986: Jo,
  9987: nr
}, No = {
  33071: ai,
  33648: Gr,
  10497: Br
}, ks = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, Js = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, Pi = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, Tp = {
  CUBICSPLINE: void 0,
  LINEAR: Zn,
  STEP: $n
}, Bs = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function Ap(e) {
  return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new Jr({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: 0
  })), e.DefaultMaterial;
}
function Vi(e, t, i) {
  for (const n in i.extensions) e[n] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[n] = i.extensions[n]);
}
function ri(e, t) {
  t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function wp(e, t, i) {
  let n = !1, r = !1, s = !1;
  for (let l = 0, h = t.length; l < h; l++) {
    const u = t[l];
    if (u.POSITION !== void 0 && (n = !0), u.NORMAL !== void 0 && (r = !0), u.COLOR_0 !== void 0 && (s = !0), n && r && s) break;
  }
  if (!n && !r && !s) return Promise.resolve(e);
  const a = [], o = [], c = [];
  for (let l = 0, h = t.length; l < h; l++) {
    const u = t[l];
    if (n) {
      const d = u.POSITION !== void 0 ? i.getDependency("accessor", u.POSITION) : e.attributes.position;
      a.push(d);
    }
    if (r) {
      const d = u.NORMAL !== void 0 ? i.getDependency("accessor", u.NORMAL) : e.attributes.normal;
      o.push(d);
    }
    if (s) {
      const d = u.COLOR_0 !== void 0 ? i.getDependency("accessor", u.COLOR_0) : e.attributes.color;
      c.push(d);
    }
  }
  return Promise.all([
    Promise.all(a),
    Promise.all(o),
    Promise.all(c)
  ]).then(function(l) {
    const h = l[0], u = l[1], d = l[2];
    return n && (e.morphAttributes.position = h), r && (e.morphAttributes.normal = u), s && (e.morphAttributes.color = d), e.morphTargetsRelative = !0, e;
  });
}
function Rp(e, t) {
  if (e.updateMorphTargets(), t.weights !== void 0) for (let i = 0, n = t.weights.length; i < n; i++) e.morphTargetInfluences[i] = t.weights[i];
  if (t.extras && Array.isArray(t.extras.targetNames)) {
    const i = t.extras.targetNames;
    if (e.morphTargetInfluences.length === i.length) {
      e.morphTargetDictionary = {};
      for (let n = 0, r = i.length; n < r; n++) e.morphTargetDictionary[i[n]] = n;
    } else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function Cp(e) {
  let t;
  const i = e.extensions && e.extensions[ke.KHR_DRACO_MESH_COMPRESSION];
  if (i ? t = "draco:" + i.bufferView + ":" + i.indices + ":" + Gs(i.attributes) : t = e.indices + ":" + Gs(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + Gs(e.targets[n]);
  return t;
}
function Gs(e) {
  let t = "";
  const i = Object.keys(e).sort();
  for (let n = 0, r = i.length; n < r; n++) t += i[n] + ":" + e[i[n]] + ";";
  return t;
}
function $s(e) {
  switch (e) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function Pp(e) {
  return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var Lp = new Ne(), Dp = class {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new tp(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
      refs: {},
      uses: {}
    }, this.cameraCache = {
      refs: {},
      uses: {}
    }, this.lightCache = {
      refs: {},
      uses: {}
    }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let i = !1, n = -1, r = !1, s = -1;
    if (typeof navigator < "u" && typeof navigator.userAgent < "u") {
      const a = navigator.userAgent;
      i = /^((?!chrome|android).)*safari/i.test(a) === !0;
      const o = a.match(/Version\/(\d+)/);
      n = i && o ? parseInt(o[1], 10) : -1, r = a.indexOf("Firefox") > -1, s = r ? a.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    typeof createImageBitmap > "u" || i && n < 17 || r && s < 98 ? this.textureLoader = new pd(this.options.manager) : this.textureLoader = new Md(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new Dc(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const i = this, n = this.json, r = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(s) {
      return s._markDefs && s._markDefs();
    }), Promise.all(this._invokeAll(function(s) {
      return s.beforeRoot && s.beforeRoot();
    })).then(function() {
      return Promise.all([
        i.getDependencies("scene"),
        i.getDependencies("animation"),
        i.getDependencies("camera")
      ]);
    }).then(function(s) {
      const a = {
        scene: s[0][n.scene || 0],
        scenes: s[0],
        animations: s[1],
        cameras: s[2],
        asset: n.asset,
        parser: i,
        userData: {}
      };
      return Vi(r, a, n), ri(a, n), Promise.all(i._invokeAll(function(o) {
        return o.afterRoot && o.afterRoot(a);
      })).then(function() {
        for (const o of a.scenes) o.updateMatrixWorld();
        e(a);
      });
    }).catch(t);
  }
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], i = this.json.meshes || [];
    for (let n = 0, r = t.length; n < r; n++) {
      const s = t[n].joints;
      for (let a = 0, o = s.length; a < o; a++) e[s[a]].isBone = !0;
    }
    for (let n = 0, r = e.length; n < r; n++) {
      const s = e[n];
      s.mesh !== void 0 && (this._addNodeRef(this.meshCache, s.mesh), s.skin !== void 0 && (i[s.mesh].isSkinnedMesh = !0)), s.camera !== void 0 && this._addNodeRef(this.cameraCache, s.camera);
    }
  }
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  _getNodeRef(e, t, i) {
    if (e.refs[t] <= 1) return i;
    const n = i.clone(), r = (s, a) => {
      const o = this.associations.get(s);
      o != null && this.associations.set(a, o);
      for (const [c, l] of s.children.entries()) r(l, a.children[c]);
    };
    return r(i, n), n.name += "_instance_" + e.uses[t]++, n;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let i = 0; i < t.length; i++) {
      const n = e(t[i]);
      if (n) return n;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const i = [];
    for (let n = 0; n < t.length; n++) {
      const r = e(t[n]);
      r && i.push(r);
    }
    return i;
  }
  getDependency(e, t) {
    const i = e + ":" + t;
    let n = this.cache.get(i);
    if (!n) {
      switch (e) {
        case "scene":
          n = this.loadScene(t);
          break;
        case "node":
          n = this._invokeOne(function(r) {
            return r.loadNode && r.loadNode(t);
          });
          break;
        case "mesh":
          n = this._invokeOne(function(r) {
            return r.loadMesh && r.loadMesh(t);
          });
          break;
        case "accessor":
          n = this.loadAccessor(t);
          break;
        case "bufferView":
          n = this._invokeOne(function(r) {
            return r.loadBufferView && r.loadBufferView(t);
          });
          break;
        case "buffer":
          n = this.loadBuffer(t);
          break;
        case "material":
          n = this._invokeOne(function(r) {
            return r.loadMaterial && r.loadMaterial(t);
          });
          break;
        case "texture":
          n = this._invokeOne(function(r) {
            return r.loadTexture && r.loadTexture(t);
          });
          break;
        case "skin":
          n = this.loadSkin(t);
          break;
        case "animation":
          n = this._invokeOne(function(r) {
            return r.loadAnimation && r.loadAnimation(t);
          });
          break;
        case "camera":
          n = this.loadCamera(t);
          break;
        default:
          if (n = this._invokeOne(function(r) {
            return r != this && r.getDependency && r.getDependency(e, t);
          }), !n) throw new Error("Unknown type: " + e);
      }
      this.cache.add(i, n);
    }
    return n;
  }
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const i = this, n = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(n.map(function(r, s) {
        return i.getDependency(e, s);
      })), this.cache.add(e, t);
    }
    return t;
  }
  loadBuffer(e) {
    const t = this.json.buffers[e], i = this.fileLoader;
    if (t.type && t.type !== "arraybuffer") throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[ke.KHR_BINARY_GLTF].body);
    const n = this.options;
    return new Promise(function(r, s) {
      i.load(Yn.resolveURL(t.uri, n.path), r, void 0, function() {
        s(/* @__PURE__ */ new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(i) {
      const n = t.byteLength || 0, r = t.byteOffset || 0;
      return i.slice(r, r + n);
    });
  }
  loadAccessor(e) {
    const t = this, i = this.json, n = this.json.accessors[e];
    if (n.bufferView === void 0 && n.sparse === void 0) {
      const s = ks[n.type], a = Mn[n.componentType], o = n.normalized === !0, c = new a(n.count * s);
      return Promise.resolve(new Tt(c, s, o));
    }
    const r = [];
    return n.bufferView !== void 0 ? r.push(this.getDependency("bufferView", n.bufferView)) : r.push(null), n.sparse !== void 0 && (r.push(this.getDependency("bufferView", n.sparse.indices.bufferView)), r.push(this.getDependency("bufferView", n.sparse.values.bufferView))), Promise.all(r).then(function(s) {
      const a = s[0], o = ks[n.type], c = Mn[n.componentType], l = c.BYTES_PER_ELEMENT, h = l * o, u = n.byteOffset || 0, d = n.bufferView !== void 0 ? i.bufferViews[n.bufferView].byteStride : void 0, p = n.normalized === !0;
      let g, _;
      if (d && d !== h) {
        const m = Math.floor(u / d), f = "InterleavedBuffer:" + n.bufferView + ":" + n.componentType + ":" + m + ":" + n.count;
        let T = t.cache.get(f);
        T || (g = new c(a, m * d, n.count * d / l), T = new Dh(g, d / l), t.cache.add(f, T)), _ = new Ih(T, o, u % d / l, p);
      } else
        a === null ? g = new c(n.count * o) : g = new c(a, u, n.count * o), _ = new Tt(g, o, p);
      if (n.sparse !== void 0) {
        const m = ks.SCALAR, f = Mn[n.sparse.indices.componentType], T = n.sparse.indices.byteOffset || 0, A = n.sparse.values.byteOffset || 0, M = new f(s[1], T, n.sparse.count * m), E = new c(s[2], A, n.sparse.count * o);
        a !== null && (_ = new Tt(_.array.slice(), _.itemSize, _.normalized)), _.normalized = !1;
        for (let w = 0, C = M.length; w < C; w++) {
          const v = M[w];
          if (_.setX(v, E[w * o]), o >= 2 && _.setY(v, E[w * o + 1]), o >= 3 && _.setZ(v, E[w * o + 2]), o >= 4 && _.setW(v, E[w * o + 3]), o >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        _.normalized = p;
      }
      return _;
    });
  }
  loadTexture(e) {
    const t = this.json, i = this.options, n = t.textures[e].source, r = t.images[n];
    let s = this.textureLoader;
    if (r.uri) {
      const a = i.manager.getHandler(r.uri);
      a !== null && (s = a);
    }
    return this.loadTextureImage(e, n, s);
  }
  loadTextureImage(e, t, i) {
    const n = this, r = this.json, s = r.textures[e], a = r.images[t], o = (a.uri || a.bufferView) + ":" + s.sampler;
    if (this.textureCache[o]) return this.textureCache[o];
    const c = this.loadImageSource(t, i).then(function(l) {
      l.flipY = !1, l.name = s.name || a.name || "", l.name === "" && typeof a.uri == "string" && a.uri.startsWith("data:image/") === !1 && (l.name = a.uri);
      const h = (r.samplers || {})[s.sampler] || {};
      return l.magFilter = Io[h.magFilter] || 1006, l.minFilter = Io[h.minFilter] || 1008, l.wrapS = No[h.wrapS] || 1e3, l.wrapT = No[h.wrapT] || 1e3, l.generateMipmaps = !l.isCompressedTexture && l.minFilter !== 1003 && l.minFilter !== 1006, n.associations.set(l, { textures: e }), l;
    }).catch(function() {
      return null;
    });
    return this.textureCache[o] = c, c;
  }
  loadImageSource(e, t) {
    const i = this, n = this.json, r = this.options;
    if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((h) => h.clone());
    const s = n.images[e], a = self.URL || self.webkitURL;
    let o = s.uri || "", c = !1;
    if (s.bufferView !== void 0) o = i.getDependency("bufferView", s.bufferView).then(function(h) {
      c = !0;
      const u = new Blob([h], { type: s.mimeType });
      return o = a.createObjectURL(u), o;
    });
    else if (s.uri === void 0) throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const l = Promise.resolve(o).then(function(h) {
      return new Promise(function(u, d) {
        let p = u;
        t.isImageBitmapLoader === !0 && (p = function(g) {
          const _ = new Dt(g);
          _.needsUpdate = !0, u(_);
        }), t.load(Yn.resolveURL(h, r.path), p, void 0, d);
      });
    }).then(function(h) {
      return c === !0 && a.revokeObjectURL(o), ri(h, s), h.userData.mimeType = s.mimeType || Pp(s.uri), h;
    }).catch(function(h) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", o), h;
    });
    return this.sourceCache[e] = l, l;
  }
  assignTexture(e, t, i, n) {
    const r = this;
    return this.getDependency("texture", i.index).then(function(s) {
      if (!s) return null;
      if (i.texCoord !== void 0 && i.texCoord > 0 && (s = s.clone(), s.channel = i.texCoord), r.extensions[ke.KHR_TEXTURE_TRANSFORM]) {
        const a = i.extensions !== void 0 ? i.extensions[ke.KHR_TEXTURE_TRANSFORM] : void 0;
        if (a) {
          const o = r.associations.get(s);
          s = r.extensions[ke.KHR_TEXTURE_TRANSFORM].extendTexture(s, a), r.associations.set(s, o);
        }
      }
      return n !== void 0 && (s.colorSpace = n), e[t] = s, s;
    });
  }
  assignFinalMaterial(e) {
    const t = e.geometry;
    let i = e.material;
    const n = t.attributes.tangent === void 0, r = t.attributes.color !== void 0, s = t.attributes.normal === void 0;
    if (e.isPoints) {
      const a = "PointsMaterial:" + i.uuid;
      let o = this.cache.get(a);
      o || (o = new sa(), ci.prototype.copy.call(o, i), o.color.copy(i.color), o.map = i.map, o.sizeAttenuation = !1, this.cache.add(a, o)), i = o;
    } else if (e.isLine) {
      const a = "LineBasicMaterial:" + i.uuid;
      let o = this.cache.get(a);
      o || (o = new xc(), ci.prototype.copy.call(o, i), o.color.copy(i.color), o.map = i.map, this.cache.add(a, o)), i = o;
    }
    if (n || r || s) {
      let a = "ClonedMaterial:" + i.uuid + ":";
      n && (a += "derivative-tangents:"), r && (a += "vertex-colors:"), s && (a += "flat-shading:");
      let o = this.cache.get(a);
      o || (o = i.clone(), r && (o.vertexColors = !0), s && (o.flatShading = !0), n && (o.normalScale && (o.normalScale.y *= -1), o.clearcoatNormalScale && (o.clearcoatNormalScale.y *= -1)), this.cache.add(a, o), this.associations.set(o, this.associations.get(i))), i = o;
    }
    e.material = i;
  }
  getMaterialType() {
    return Jr;
  }
  loadMaterial(e) {
    const t = this, i = this.json, n = this.extensions, r = i.materials[e];
    let s;
    const a = {}, o = r.extensions || {}, c = [];
    if (o[ke.KHR_MATERIALS_UNLIT]) {
      const h = n[ke.KHR_MATERIALS_UNLIT];
      s = h.getMaterialType(), c.push(h.extendParams(a, r, t));
    } else {
      const h = r.pbrMetallicRoughness || {};
      if (a.color = new Te(1, 1, 1), a.opacity = 1, Array.isArray(h.baseColorFactor)) {
        const u = h.baseColorFactor;
        a.color.setRGB(u[0], u[1], u[2], Zt), a.opacity = u[3];
      }
      h.baseColorTexture !== void 0 && c.push(t.assignTexture(a, "map", h.baseColorTexture, vt)), a.metalness = h.metallicFactor !== void 0 ? h.metallicFactor : 1, a.roughness = h.roughnessFactor !== void 0 ? h.roughnessFactor : 1, h.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(a, "metalnessMap", h.metallicRoughnessTexture)), c.push(t.assignTexture(a, "roughnessMap", h.metallicRoughnessTexture))), s = this._invokeOne(function(u) {
        return u.getMaterialType && u.getMaterialType(e);
      }), c.push(Promise.all(this._invokeAll(function(u) {
        return u.extendMaterialParams && u.extendMaterialParams(e, a);
      })));
    }
    r.doubleSided === !0 && (a.side = 2);
    const l = r.alphaMode || Bs.OPAQUE;
    if (l === Bs.BLEND ? (a.transparent = !0, a.depthWrite = !1) : (a.transparent = !1, l === Bs.MASK && (a.alphaTest = r.alphaCutoff !== void 0 ? r.alphaCutoff : 0.5)), r.normalTexture !== void 0 && s !== Jt && (c.push(t.assignTexture(a, "normalMap", r.normalTexture)), a.normalScale = new Fe(1, 1), r.normalTexture.scale !== void 0)) {
      const h = r.normalTexture.scale;
      a.normalScale.set(h, h);
    }
    if (r.occlusionTexture !== void 0 && s !== Jt && (c.push(t.assignTexture(a, "aoMap", r.occlusionTexture)), r.occlusionTexture.strength !== void 0 && (a.aoMapIntensity = r.occlusionTexture.strength)), r.emissiveFactor !== void 0 && s !== Jt) {
      const h = r.emissiveFactor;
      a.emissive = new Te().setRGB(h[0], h[1], h[2], Zt);
    }
    return r.emissiveTexture !== void 0 && s !== Jt && c.push(t.assignTexture(a, "emissiveMap", r.emissiveTexture, vt)), Promise.all(c).then(function() {
      const h = new s(a);
      return r.name && (h.name = r.name), ri(h, r), t.associations.set(h, { materials: e }), r.extensions && Vi(n, h, r), h;
    });
  }
  createUniqueName(e) {
    const t = st.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  loadGeometries(e) {
    const t = this, i = this.extensions, n = this.primitiveCache;
    function r(a) {
      return i[ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a, t).then(function(o) {
        return Uo(o, a, t);
      });
    }
    const s = [];
    for (let a = 0, o = e.length; a < o; a++) {
      const c = e[a], l = Cp(c), h = n[l];
      if (h) s.push(h.promise);
      else {
        let u;
        c.extensions && c.extensions[ke.KHR_DRACO_MESH_COMPRESSION] ? u = r(c) : u = Uo(new Wt(), c, t), n[l] = {
          primitive: c,
          promise: u
        }, s.push(u);
      }
    }
    return Promise.all(s);
  }
  loadMesh(e) {
    const t = this, i = this.json, n = this.extensions, r = i.meshes[e], s = r.primitives, a = [];
    for (let o = 0, c = s.length; o < c; o++) {
      const l = s[o].material === void 0 ? Ap(this.cache) : this.getDependency("material", s[o].material);
      a.push(l);
    }
    return a.push(t.loadGeometries(s)), Promise.all(a).then(function(o) {
      const c = o.slice(0, o.length - 1), l = o[o.length - 1], h = [];
      for (let d = 0, p = l.length; d < p; d++) {
        const g = l[d], _ = s[d];
        let m;
        const f = c[d];
        if (_.mode === Vt.TRIANGLES || _.mode === Vt.TRIANGLE_STRIP || _.mode === Vt.TRIANGLE_FAN || _.mode === void 0)
          m = r.isSkinnedMesh === !0 ? new Oh(g, f) : new At(g, f), m.isSkinnedMesh === !0 && m.normalizeSkinWeights(), _.mode === Vt.TRIANGLE_STRIP ? m.geometry = Po(m.geometry, 1) : _.mode === Vt.TRIANGLE_FAN && (m.geometry = Po(m.geometry, 2));
        else if (_.mode === Vt.LINES) m = new qh(g, f);
        else if (_.mode === Vt.LINE_STRIP) m = new ra(g, f);
        else if (_.mode === Vt.LINE_LOOP) m = new Xh(g, f);
        else if (_.mode === Vt.POINTS) m = new Sc(g, f);
        else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + _.mode);
        Object.keys(m.geometry.morphAttributes).length > 0 && Rp(m, r), m.name = t.createUniqueName(r.name || "mesh_" + e), ri(m, r), _.extensions && Vi(n, m, _), t.assignFinalMaterial(m), h.push(m);
      }
      for (let d = 0, p = h.length; d < p; d++) t.associations.set(h[d], {
        meshes: e,
        primitives: d
      });
      if (h.length === 1)
        return r.extensions && Vi(n, h[0], r), h[0];
      const u = new qi();
      r.extensions && Vi(n, u, r), t.associations.set(u, { meshes: e });
      for (let d = 0, p = h.length; d < p; d++) u.add(h[d]);
      return u;
    });
  }
  loadCamera(e) {
    let t;
    const i = this.json.cameras[e], n = i[i.type];
    if (!n) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return i.type === "perspective" ? t = new Pt(er.radToDeg(n.yfov), n.aspectRatio || 1, n.znear || 1, n.zfar || 2e6) : i.type === "orthographic" && (t = new Zr(-n.xmag, n.xmag, n.ymag, -n.ymag, n.znear, n.zfar)), i.name && (t.name = this.createUniqueName(i.name)), ri(t, i), Promise.resolve(t);
  }
  loadSkin(e) {
    const t = this.json.skins[e], i = [];
    for (let n = 0, r = t.joints.length; n < r; n++) i.push(this._loadNodeShallow(t.joints[n]));
    return t.inverseBindMatrices !== void 0 ? i.push(this.getDependency("accessor", t.inverseBindMatrices)) : i.push(null), Promise.all(i).then(function(n) {
      const r = n.pop(), s = n, a = [], o = [];
      for (let c = 0, l = s.length; c < l; c++) {
        const h = s[c];
        if (h) {
          a.push(h);
          const u = new Ne();
          r !== null && u.fromArray(r.array, c * 16), o.push(u);
        } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new Bh(a, o);
    });
  }
  loadAnimation(e) {
    const t = this.json, i = this, n = t.animations[e], r = n.name ? n.name : "animation_" + e, s = [], a = [], o = [], c = [], l = [];
    for (let h = 0, u = n.channels.length; h < u; h++) {
      const d = n.channels[h], p = n.samplers[d.sampler], g = d.target, _ = g.node, m = n.parameters !== void 0 ? n.parameters[p.input] : p.input, f = n.parameters !== void 0 ? n.parameters[p.output] : p.output;
      g.node !== void 0 && (s.push(this.getDependency("node", _)), a.push(this.getDependency("accessor", m)), o.push(this.getDependency("accessor", f)), c.push(p), l.push(g));
    }
    return Promise.all([
      Promise.all(s),
      Promise.all(a),
      Promise.all(o),
      Promise.all(c),
      Promise.all(l)
    ]).then(function(h) {
      const u = h[0], d = h[1], p = h[2], g = h[3], _ = h[4], m = [];
      for (let T = 0, A = u.length; T < A; T++) {
        const M = u[T], E = d[T], w = p[T], C = g[T], v = _[T];
        if (M === void 0) continue;
        M.updateMatrix && M.updateMatrix();
        const y = i._createAnimationTracks(M, E, w, C, v);
        if (y) for (let V = 0; V < y.length; V++) m.push(y[V]);
      }
      const f = new ld(r, void 0, m);
      return ri(f, n), f;
    });
  }
  createNodeMesh(e) {
    const t = this.json, i = this, n = t.nodes[e];
    return n.mesh === void 0 ? null : i.getDependency("mesh", n.mesh).then(function(r) {
      const s = i._getNodeRef(i.meshCache, n.mesh, r);
      return n.weights !== void 0 && s.traverse(function(a) {
        if (a.isMesh)
          for (let o = 0, c = n.weights.length; o < c; o++) a.morphTargetInfluences[o] = n.weights[o];
      }), s;
    });
  }
  loadNode(e) {
    const t = this.json, i = this, n = t.nodes[e], r = i._loadNodeShallow(e), s = [], a = n.children || [];
    for (let c = 0, l = a.length; c < l; c++) s.push(i.getDependency("node", a[c]));
    const o = n.skin === void 0 ? Promise.resolve(null) : i.getDependency("skin", n.skin);
    return Promise.all([
      r,
      Promise.all(s),
      o
    ]).then(function(c) {
      const l = c[0], h = c[1], u = c[2];
      u !== null && l.traverse(function(d) {
        d.isSkinnedMesh && d.bind(u, Lp);
      });
      for (let d = 0, p = h.length; d < p; d++) l.add(h[d]);
      if (l.userData.pivot !== void 0 && h.length > 0) {
        const d = l.userData.pivot, p = h[0];
        l.pivot = new U().fromArray(d), l.position.x -= d[0], l.position.y -= d[1], l.position.z -= d[2], p.position.set(0, 0, 0), delete l.userData.pivot;
      }
      return l;
    });
  }
  _loadNodeShallow(e) {
    const t = this.json, i = this.extensions, n = this;
    if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
    const r = t.nodes[e], s = r.name ? n.createUniqueName(r.name) : "", a = [], o = n._invokeOne(function(c) {
      return c.createNodeMesh && c.createNodeMesh(e);
    });
    return o && a.push(o), r.camera !== void 0 && a.push(n.getDependency("camera", r.camera).then(function(c) {
      return n._getNodeRef(n.cameraCache, r.camera, c);
    })), n._invokeAll(function(c) {
      return c.createNodeAttachment && c.createNodeAttachment(e);
    }).forEach(function(c) {
      a.push(c);
    }), this.nodeCache[e] = Promise.all(a).then(function(c) {
      let l;
      if (r.isBone === !0 ? l = new _c() : c.length > 1 ? l = new qi() : c.length === 1 ? l = c[0] : l = new dt(), l !== c[0]) for (let h = 0, u = c.length; h < u; h++) l.add(c[h]);
      if (r.name && (l.userData.name = r.name, l.name = s), ri(l, r), r.extensions && Vi(i, l, r), r.matrix !== void 0) {
        const h = new Ne();
        h.fromArray(r.matrix), l.applyMatrix4(h);
      } else
        r.translation !== void 0 && l.position.fromArray(r.translation), r.rotation !== void 0 && l.quaternion.fromArray(r.rotation), r.scale !== void 0 && l.scale.fromArray(r.scale);
      if (!n.associations.has(l)) n.associations.set(l, {});
      else if (r.mesh !== void 0 && n.meshCache.refs[r.mesh] > 1) {
        const h = n.associations.get(l);
        n.associations.set(l, { ...h });
      }
      return n.associations.get(l).nodes = e, l;
    }), this.nodeCache[e];
  }
  loadScene(e) {
    const t = this.extensions, i = this.json.scenes[e], n = this, r = new qi();
    i.name && (r.name = n.createUniqueName(i.name)), ri(r, i), i.extensions && Vi(t, r, i);
    const s = i.nodes || [], a = [];
    for (let o = 0, c = s.length; o < c; o++) a.push(n.getDependency("node", s[o]));
    return Promise.all(a).then(function(o) {
      for (let l = 0, h = o.length; l < h; l++) {
        const u = o[l];
        u.parent !== null ? r.add(Qf(u)) : r.add(u);
      }
      const c = (l) => {
        const h = /* @__PURE__ */ new Map();
        for (const [u, d] of n.associations) (u instanceof ci || u instanceof Dt) && h.set(u, d);
        return l.traverse((u) => {
          const d = n.associations.get(u);
          d != null && h.set(u, d);
        }), h;
      };
      return n.associations = c(r), r;
    });
  }
  _createAnimationTracks(e, t, i, n, r) {
    const s = [], a = e.name ? e.name : e.uuid, o = [];
    function c(d) {
      d.morphTargetInfluences && o.push(d.name ? d.name : d.uuid);
    }
    Pi[r.path] === Pi.weights ? (c(e), e.isGroup && e.children.forEach(c)) : o.push(a);
    let l;
    switch (Pi[r.path]) {
      case Pi.weights:
        l = tr;
        break;
      case Pi.rotation:
        l = ir;
        break;
      case Pi.translation:
      case Pi.scale:
        l = jr;
        break;
      default:
        i.itemSize === 1 ? l = tr : l = jr;
    }
    const h = n.interpolation !== void 0 ? Tp[n.interpolation] : Zn, u = this._getArrayFromAccessor(i);
    for (let d = 0, p = o.length; d < p; d++) {
      const g = new l(o[d] + "." + Pi[r.path], t.array, u, h);
      n.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(g), s.push(g);
    }
    return s;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const i = $s(t.constructor), n = new Float32Array(t.length);
      for (let r = 0, s = t.length; r < s; r++) n[r] = t[r] * i;
      t = n;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(i) {
      return new (this instanceof ir ? Ep : qc)(this.times, this.values, this.getValueSize() / 3, i);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
};
function Ip(e, t, i) {
  const n = t.attributes, r = new xi();
  if (n.POSITION !== void 0) {
    const o = i.json.accessors[n.POSITION], c = o.min, l = o.max;
    if (c !== void 0 && l !== void 0) {
      if (r.set(new U(c[0], c[1], c[2]), new U(l[0], l[1], l[2])), o.normalized) {
        const h = $s(Mn[o.componentType]);
        r.min.multiplyScalar(h), r.max.multiplyScalar(h);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else return;
  const s = t.targets;
  if (s !== void 0) {
    const o = new U(), c = new U();
    for (let l = 0, h = s.length; l < h; l++) {
      const u = s[l];
      if (u.POSITION !== void 0) {
        const d = i.json.accessors[u.POSITION], p = d.min, g = d.max;
        if (p !== void 0 && g !== void 0) {
          if (c.setX(Math.max(Math.abs(p[0]), Math.abs(g[0]))), c.setY(Math.max(Math.abs(p[1]), Math.abs(g[1]))), c.setZ(Math.max(Math.abs(p[2]), Math.abs(g[2]))), d.normalized) {
            const _ = $s(Mn[d.componentType]);
            c.multiplyScalar(_);
          }
          o.max(c);
        } else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    r.expandByVector(o);
  }
  e.boundingBox = r;
  const a = new hi();
  r.getCenter(a.center), a.radius = r.min.distanceTo(r.max) / 2, e.boundingSphere = a;
}
function Uo(e, t, i) {
  const n = t.attributes, r = [];
  function s(a, o) {
    return i.getDependency("accessor", a).then(function(c) {
      e.setAttribute(o, c);
    });
  }
  for (const a in n) {
    const o = Js[a] || a.toLowerCase();
    o in e.attributes || r.push(s(n[a], o));
  }
  if (t.indices !== void 0 && !e.index) {
    const a = i.getDependency("accessor", t.indices).then(function(o) {
      e.setIndex(o);
    });
    r.push(a);
  }
  return Ge.workingColorSpace !== "srgb-linear" && "COLOR_0" in n && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ge.workingColorSpace}" not supported.`), ri(e, t), Ip(e, t, i), Promise.all(r).then(function() {
    return t.targets !== void 0 ? wp(e, t.targets, i) : e;
  });
}
var Np = (function() {
  var e = "b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb", t = "b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb", i = new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    4,
    1,
    96,
    0,
    0,
    3,
    3,
    2,
    0,
    0,
    5,
    3,
    1,
    0,
    1,
    12,
    1,
    0,
    10,
    22,
    2,
    12,
    0,
    65,
    0,
    65,
    0,
    65,
    0,
    252,
    10,
    0,
    0,
    11,
    7,
    0,
    65,
    0,
    253,
    15,
    26,
    11
  ]), n = new Uint8Array([
    32,
    0,
    65,
    2,
    1,
    106,
    34,
    33,
    3,
    128,
    11,
    4,
    13,
    64,
    6,
    253,
    10,
    7,
    15,
    116,
    127,
    5,
    8,
    12,
    40,
    16,
    19,
    54,
    20,
    9,
    27,
    255,
    113,
    17,
    42,
    67,
    24,
    23,
    146,
    148,
    18,
    14,
    22,
    45,
    70,
    69,
    56,
    114,
    101,
    21,
    25,
    63,
    75,
    136,
    108,
    28,
    118,
    29,
    73,
    115
  ]);
  if (typeof WebAssembly != "object") return { supported: !1 };
  var r = WebAssembly.validate(i) ? o(t) : o(e), s, a = WebAssembly.instantiate(r, {}).then(function(f) {
    s = f.instance, s.exports.__wasm_call_ctors();
  });
  function o(f) {
    for (var T = new Uint8Array(f.length), A = 0; A < f.length; ++A) {
      var M = f.charCodeAt(A);
      T[A] = M > 96 ? M - 97 : M > 64 ? M - 39 : M + 4;
    }
    for (var E = 0, A = 0; A < f.length; ++A) T[E++] = T[A] < 60 ? n[T[A]] : (T[A] - 60) * 64 + T[++A];
    return T.buffer.slice(0, E);
  }
  function c(f, T, A, M, E, w, C) {
    var v = f.exports.sbrk, y = M + 3 & -4, V = v(y * E), R = v(w.length), k = new Uint8Array(f.exports.memory.buffer);
    k.set(w, R);
    var q = T(V, M, E, R, w.length);
    if (q == 0 && C && C(V, y, E), A.set(k.subarray(V, V + M * E)), v(V - v(0)), q != 0) throw new Error("Malformed buffer data: " + q);
  }
  var l = {
    NONE: "",
    OCTAHEDRAL: "meshopt_decodeFilterOct",
    QUATERNION: "meshopt_decodeFilterQuat",
    EXPONENTIAL: "meshopt_decodeFilterExp",
    COLOR: "meshopt_decodeFilterColor"
  }, h = {
    ATTRIBUTES: "meshopt_decodeVertexBuffer",
    TRIANGLES: "meshopt_decodeIndexBuffer",
    INDICES: "meshopt_decodeIndexSequence"
  }, u = [], d = 0;
  function p(f) {
    var T = {
      object: new Worker(f),
      pending: 0,
      requests: {}
    };
    return T.object.onmessage = function(A) {
      var M = A.data;
      T.pending -= M.count, T.requests[M.id][M.action](M.value), delete T.requests[M.id];
    }, T;
  }
  function g(f) {
    for (var T = "self.ready = WebAssembly.instantiate(new Uint8Array([" + new Uint8Array(r) + "]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = " + m.name + ";" + c.toString() + m.toString(), A = new Blob([T], { type: "text/javascript" }), M = URL.createObjectURL(A), E = u.length; E < f; ++E) u[E] = p(M);
    for (var E = f; E < u.length; ++E) u[E].object.postMessage({});
    u.length = f, URL.revokeObjectURL(M);
  }
  function _(f, T, A, M, E) {
    for (var w = u[0], C = 1; C < u.length; ++C) u[C].pending < w.pending && (w = u[C]);
    return new Promise(function(v, y) {
      var V = new Uint8Array(A), R = ++d;
      w.pending += f, w.requests[R] = {
        resolve: v,
        reject: y
      }, w.object.postMessage({
        id: R,
        count: f,
        size: T,
        source: V,
        mode: M,
        filter: E
      }, [V.buffer]);
    });
  }
  function m(f) {
    var T = f.data;
    self.ready.then(function(A) {
      if (!T.id) return self.close();
      try {
        var M = new Uint8Array(T.count * T.size);
        c(A, A.exports[T.mode], M, T.count, T.size, T.source, A.exports[T.filter]), self.postMessage({
          id: T.id,
          count: T.count,
          action: "resolve",
          value: M
        }, [M.buffer]);
      } catch (E) {
        self.postMessage({
          id: T.id,
          count: T.count,
          action: "reject",
          value: E
        });
      }
    });
  }
  return {
    ready: a,
    supported: !0,
    useWorkers: function(f) {
      g(f);
    },
    decodeVertexBuffer: function(f, T, A, M, E) {
      c(s, s.exports.meshopt_decodeVertexBuffer, f, T, A, M, s.exports[l[E]]);
    },
    decodeIndexBuffer: function(f, T, A, M) {
      c(s, s.exports.meshopt_decodeIndexBuffer, f, T, A, M);
    },
    decodeIndexSequence: function(f, T, A, M) {
      c(s, s.exports.meshopt_decodeIndexSequence, f, T, A, M);
    },
    decodeGltfBuffer: function(f, T, A, M, E, w) {
      c(s, s.exports[h[E]], f, T, A, M, s.exports[l[w]]);
    },
    decodeGltfBufferAsync: function(f, T, A, M, E) {
      return u.length > 0 ? _(f, T, A, h[M], l[E]) : a.then(function() {
        var w = new Uint8Array(f * T);
        return c(s, s.exports[h[M]], w, f, T, A, s.exports[l[E]]), w;
      });
    }
  };
})(), yt = Object.freeze([
  "control",
  "response",
  "comparison",
  "association",
  "reconstruction",
  "archive"
]), Xc = "(max-width: 767px), (pointer: coarse)", Kc = "(prefers-reduced-motion: reduce)", Up = "(prefers-reduced-data: reduce)", Fo = 4200, Fp = 620, Op = 12e3, kp = 8e3, Bp = 32e5, Gp = 12e5, zp = 0.048, Vp = 0.38, Hp = 0.34, Wp = 0.46, Oo = 12;
new U();
var qp = Object.freeze([
  -2.55,
  -1.15,
  0.15,
  1.35,
  2.55
]), Xp = Object.freeze([
  2,
  3.1,
  1.4,
  4.2,
  2.6
]), jc = Object.freeze([
  Object.freeze([
    0,
    -0.09,
    0.035
  ]),
  Object.freeze([
    0,
    0.07,
    -0.025
  ]),
  Object.freeze([
    0,
    -0.055,
    0.02
  ])
]);
function Kp(e, t) {
  const i = Number(e.r), n = Math.abs(i), r = qp[t], s = Xp[t];
  return {
    start: new U(r, -0.55, s),
    end: new U(r + Math.sign(i) * (0.18 + 0.32 * n), -0.57, Math.min(13.1, s + 5.3 + 2.4 * n)),
    radius: 0.014 + 15e-4 * t
  };
}
function jp(e, t) {
  const i = new Fi(...jc[t]), n = new Ht().setFromEuler(i);
  return e.clone().multiply(n);
}
function Nt(e, t = 0, i = 1) {
  const n = Number(e);
  return Number.isFinite(n) ? Math.min(i, Math.max(t, n)) : t;
}
function Li(e, t, i) {
  const n = Nt((i - e) / Math.max(t - e, 1e-6));
  return n * n * n * (n * (n * 6 - 15) + 10);
}
function Ii(e, t, i, n) {
  return !Number.isFinite(e) || !Number.isFinite(t) || i <= 0 || n <= 0 ? t : er.lerp(e, t, 1 - Math.exp(-n / i));
}
function ko(e, t, i, n) {
  return e.x = Ii(e.x, t.x, i, n), e.y = Ii(e.y, t.y, i, n), e.z = Ii(e.z, t.z, i, n), e;
}
function Xi(e) {
  return new URL(String(e || ""), document.baseURI).href;
}
function pn(e, t) {
  document.dispatchEvent(new CustomEvent(e, { detail: t }));
}
function Yp(e) {
  const t = e.querySelector("#chamber-data");
  if (!t?.textContent) throw new Error("The chamber payload is missing.");
  const i = JSON.parse(t.textContent);
  if (!i?.hero?.levels?.length || !i?.field?.observations?.length) throw new Error("The chamber payload is incomplete.");
  return i;
}
function Jp(e) {
  return new Map((e?.field?.observations || []).map((t) => [t.id, t]));
}
function $p(e, t) {
  const i = (P) => {
    throw new Error(`Exact evidence contract ${P}`);
  }, n = (P) => !!P && typeof P == "object" && !Array.isArray(P), r = (P) => typeof P == "string" && P.trim().length > 0, s = (P, K) => {
    P.some((ae) => !r(ae)) && i(`${K} contains an empty value`), new Set(P).size !== P.length && i(`${K} contains duplicates`);
  }, a = e?.field?.observations;
  (!Array.isArray(a) || a.length === 0) && i("requires field observations");
  const o = a.map((P) => P?.id);
  s(o, "field observation IDs");
  const c = new Set(o), l = (P, K) => {
    (!r(P) || !c.has(P)) && i(`${K} references unknown observation ${String(P)}`);
  }, h = e?.hero?.levels;
  (!Array.isArray(h) || h.length === 0) && i("requires hero levels");
  const u = h.map((P) => P?.requested_level), d = h.map((P) => P?.observation_id);
  s(u, "hero requested levels"), s(d, "hero observation IDs");
  const p = h.map((P) => {
    l(P.observation_id, `hero level ${P.requested_level}`);
    const K = P.observation_id.replace(/^obs_/, "");
    return (!K || K === P.observation_id) && i(`hero observation ${P.observation_id} has an invalid ID`), {
      requestedLevel: P.requested_level,
      observation: P.observation_id,
      bindingName: `OriginPlate_${K}`,
      rootName: `OriginPlate_${K}`,
      evidenceName: `OriginEvidence_${K}`
    };
  }), g = [{
    vectorId: "vec_halation",
    bindingName: "ComparatorEvidenceLow",
    rootName: "ComparatorLeft"
  }, {
    vectorId: "vec_highlight_bloom",
    bindingName: "ComparatorEvidenceHigh",
    rootName: "ComparatorRight"
  }], _ = e?.comparison?.items;
  (!Array.isArray(_) || _.length !== g.length) && i("requires exactly the halation and highlight-bloom comparison items"), s(_.map((P) => P?.vector_id), "comparison vector IDs"), s(_.map((P) => P?.observation_id), "comparison observation IDs");
  const m = new Map(_.map((P) => [P.vector_id, P])), f = g.map((P) => {
    const K = m.get(P.vectorId);
    return K || i(`is missing comparison vector ${P.vectorId}`), l(K.observation_id, `comparison vector ${P.vectorId}`), {
      ...P,
      evidenceName: P.bindingName,
      observation: K.observation_id
    };
  }), T = [{
    anchorId: "anchor_object",
    bindingName: "ReconstructionEvidenceObject"
  }, {
    anchorId: "anchor_landscape",
    bindingName: "ReconstructionEvidenceLandscape"
  }], A = e?.reconstruction?.selected_plates;
  (!Array.isArray(A) || A.length !== T.length) && i("requires exactly the object and landscape reconstruction plates"), s(A.map((P) => P?.anchor_id), "reconstruction anchor IDs"), s(A.map((P) => P?.observation_id), "reconstruction observation IDs");
  const M = new Map(A.map((P) => [P.anchor_id, P])), E = T.map((P) => {
    const K = M.get(P.anchorId);
    return K || i(`is missing reconstruction anchor ${P.anchorId}`), l(K.observation_id, `reconstruction anchor ${P.anchorId}`), {
      ...P,
      evidenceName: P.bindingName,
      rootName: "ReconstructionOutputCarriage",
      observation: K.observation_id
    };
  }), w = [
    ...p,
    ...f,
    ...E
  ], C = w.map((P) => P.bindingName);
  s(C, "binding names");
  const v = t?.evidenceBindings;
  n(v) || i("requires an evidenceBindings object");
  const y = Object.keys(v), V = new Set(C);
  (y.length !== C.length || y.some((P) => !V.has(P))) && i("bindings are missing, stale, or unexpected");
  for (const P of w) {
    const K = v[P.bindingName];
    n(K) || i(`binding ${P.bindingName} is missing`), K.observation !== P.observation && i(`binding ${P.bindingName} does not match ${P.observation}`), (K.exact !== !0 || K.toneMapped !== !1) && i(`binding ${P.bindingName} is not exact and ungraded`);
    const ae = `assets/studies/${P.observation}-1024.webp`;
    K.texture !== ae && i(`binding ${P.bindingName} does not identify ${ae}`);
  }
  const R = e?.field?.atlas, k = t?.archiveBindings;
  (!n(R) || !n(k)) && i("requires atlas metadata and archiveBindings"), n(R.entries) || i("requires an atlas entries object");
  const q = Object.entries(R.entries);
  q.length || i("requires archive atlas entries");
  const X = q.map(([P]) => P);
  s(X, "archive observation IDs"), X.forEach((P) => {
    l(P, "archive atlas");
  });
  const z = q.map(([, P]) => P);
  (z.some((P) => !Number.isInteger(P) || P < 0) || new Set(z).size !== z.length || [...z].sort((P, K) => P - K).some((P, K) => P !== K)) && i("archive atlas slots must be unique contiguous integers from zero");
  const j = R.columns, O = R.rows;
  (!Number.isInteger(j) || j <= 0 || !Number.isInteger(O) || O <= 0 || j * O < q.length) && i("archive atlas grid is invalid or too small"), (k.node !== "ArchiveEvidenceField" || k.count !== q.length || k.columns !== j || k.rows !== O || k.instanceOrder !== "row-major" || k.exact !== !0 || k.toneMapped !== !1) && i("archiveBindings do not match the exact row-major atlas");
  const ee = (P, K) => {
    n(K) || i(`${P} atlas geometry is missing`), ([
      "width",
      "height",
      "cell_size"
    ].some((ae) => !Number.isInteger(K[ae]) || K[ae] <= 0) || [
      "gutter",
      "offset_x",
      "offset_y"
    ].some((ae) => !Number.isInteger(K[ae]) || K[ae] < 0) || K.cell_size - 2 * K.gutter <= 0 || K.offset_x + j * K.cell_size > K.width || K.offset_y + O * K.cell_size > K.height) && i(`${P} atlas geometry is invalid or out of bounds`);
  };
  ee("desktop", R.desktop), ee("mobile", R.mobile), (!r(R.desktop_path) || !r(R.mobile_path)) && i("archive atlas paths are missing");
  const te = {
    node: k.node,
    count: k.count,
    entries: [...q].sort(([, P], [, K]) => P - K)
  }, ie = t?.requiredNodes;
  Array.isArray(ie) || i("requires a requiredNodes array"), s(ie, "manifest required nodes");
  const de = [
    "MonolithRoot",
    "GraphiteCore",
    "ControlShell",
    "ResponseShell",
    "AssociationPivot",
    "AssociationRay",
    "ArchiveOrigin",
    te.node,
    ...p.map((P) => P.rootName),
    ...f.map((P) => P.rootName),
    "ReconstructionOutputCarriage"
  ], Se = [.../* @__PURE__ */ new Set([
    ...de,
    ...p.map((P) => P.evidenceName),
    ...f.map((P) => P.evidenceName),
    ...E.map((P) => P.evidenceName)
  ])], Qe = new Set(ie), je = Se.filter((P) => !Qe.has(P));
  return je.length && i(`required roots or evidence nodes are missing: ${je.join(", ")}`), {
    hero: p,
    comparison: f,
    reconstruction: E,
    archive: te,
    bindings: w,
    manifestRoots: [...new Set(de)],
    manifestNodes: Se,
    worldNodes: Se
  };
}
function Di(e, t) {
  return e?.vectors?.[t]?.name || String(t || "").replace(/^vec_/, "").replaceAll("_", " ");
}
function zs(e, t) {
  return Xi(`assets/studies/${e}-1024.webp`);
}
function Zp() {
  try {
    return !!document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: !1 });
  } catch {
    return !1;
  }
}
function Hi(e) {
  if (!e) return null;
  if (e.isMesh || e.isInstancedMesh) return e;
  let t = null;
  return e.traverse?.((i) => {
    !t && (i.isMesh || i.isInstancedMesh) && (t = i);
  }), t;
}
function Ur(e) {
  const t = e?.geometry?.attributes?.uv;
  if (!t) throw new Error(`${e?.name || "Evidence surface"} has no UV coordinates`);
  let i = 1 / 0, n = 1 / 0, r = -1 / 0, s = -1 / 0;
  for (let h = 0; h < t.count; h += 1)
    i = Math.min(i, t.getX(h)), n = Math.min(n, t.getY(h)), r = Math.max(r, t.getX(h)), s = Math.max(s, t.getY(h));
  const a = r - i, o = s - n;
  if (a <= 1e-6 || o <= 1e-6) throw new Error(`${e.name || "Evidence surface"} has degenerate UV coordinates`);
  if (Math.abs(i) <= 1e-4 && Math.abs(n) <= 1e-4 && Math.abs(a - 1) <= 1e-4 && Math.abs(o - 1) <= 1e-4) return e.geometry;
  const c = e.geometry.clone(), l = c.attributes.uv;
  for (let h = 0; h < l.count; h += 1) l.setXY(h, (l.getX(h) - i) / a, (l.getY(h) - n) / o);
  return l.needsUpdate = !0, e.geometry = c, c;
}
function Bo(e) {
  !e || e.userData.v5BaseTransform || (e.userData.v5BaseTransform = {
    position: e.position.clone(),
    quaternion: e.quaternion.clone(),
    scale: e.scale.clone()
  });
}
function Qp(e, t) {
  const i = e?.userData?.v5BaseTransform;
  i && e.scale.copy(i.scale).multiplyScalar(t);
}
function Yc(e, t = /* @__PURE__ */ new Set()) {
  if (!e || t.has(e) || e.userData?.v5Disposed) return;
  t.add(e);
  const i = new Set([
    e.userData?.v5ImageBitmap,
    e.source?.data,
    e.image
  ].filter(Boolean));
  for (const n of i) n.close?.();
  e.dispose?.(), e.userData || (e.userData = {}), e.userData.v5BitmapClosed = !0, e.userData.v5Disposed = !0;
}
function Zs(e, t = /* @__PURE__ */ new Set()) {
  const i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  e?.traverse?.((s) => {
    s.isLight && s.dispose?.(), s.geometry && !i.has(s.geometry) && (i.add(s.geometry), s.geometry.dispose?.());
    const a = Array.isArray(s.material) ? s.material : [s.material];
    for (const o of a)
      if (!(!o || n.has(o))) {
        n.add(o);
        for (const c of [
          "map",
          "normalMap",
          "roughnessMap",
          "metalnessMap",
          "emissiveMap",
          "alphaMap"
        ]) {
          const l = o[c];
          l && !t.has(l) && Yc(l, r);
        }
        o.dispose?.();
      }
  });
}
function em(e) {
  const t = new pc();
  t.background = new Te(330510);
  const i = new Yr(16, 12, 16), n = new Jt({
    color: 463125,
    side: 1,
    toneMapped: !1
  });
  t.add(new At(i, n));
  const r = ({ color: c, size: l, position: h, rotation: u }) => {
    const d = new aa(l[0], l[1]), p = new Jt({
      color: new Te().setRGB(...c),
      side: 2,
      toneMapped: !1
    }), g = new At(d, p);
    g.position.set(...h), g.rotation.set(...u), t.add(g);
  };
  r({
    color: [
      3.2,
      4.8,
      5.4
    ],
    size: [5.6, 2.4],
    position: [
      -3.7,
      4.5,
      1.2
    ],
    rotation: [
      Math.PI * 0.46,
      Math.PI * 0.08,
      -Math.PI * 0.06
    ]
  }), r({
    color: [
      0.55,
      1.15,
      1.28
    ],
    size: [4.8, 5.8],
    position: [
      5.8,
      0.8,
      -1.6
    ],
    rotation: [
      0,
      -Math.PI * 0.5,
      0
    ]
  }), r({
    color: [
      2.6,
      1.05,
      0.42
    ],
    size: [1.2, 3.8],
    position: [
      -5.6,
      -1.4,
      -2.8
    ],
    rotation: [
      0,
      Math.PI * 0.5,
      Math.PI * 0.08
    ]
  });
  const s = new Ks(e);
  let a = null;
  try {
    a = s.fromScene(t, 0.08, 0.1, 24, { size: 64 });
  } finally {
    s.dispose(), Zs(t), t.clear();
  }
  a.texture.name = "V5_Authored_Emulsion_PMREM", a.texture.userData.v5AuthoredEnvironment = !0;
  let o = !1;
  return {
    texture: a.texture,
    dispose() {
      o || (o = !0, a.dispose());
    }
  };
}
function Vs(e) {
  return new Jt({
    map: e,
    color: 16777215,
    side: 2,
    transparent: !1,
    opacity: 1,
    depthWrite: !0,
    toneMapped: !1,
    fog: !1
  });
}
function tm(e = 1597463007) {
  let t = e >>> 0;
  return () => (t = 1664525 * t + 1013904223 >>> 0, t / 4294967295);
}
function im(e, t, i) {
  return new Promise((n, r) => {
    let s = !1;
    const a = () => {
      s || (s = !0, t.removeEventListener("abort", a), r(new DOMException("Texture load aborted", "AbortError")));
    };
    t.addEventListener("abort", a, { once: !0 }), e.then((o) => {
      if (s) {
        i?.(o);
        return;
      }
      s = !0, t.removeEventListener("abort", a), n(o);
    }, (o) => {
      s || (s = !0, t.removeEventListener("abort", a), r(o));
    }), t.aborted && a();
  });
}
var nm = class {
  constructor(e, t = Lc) {
    this.renderer = e, this.loadingManager = t, this.abortController = new AbortController(), this.destroyed = !1, this.pending = /* @__PURE__ */ new Map(), this.textures = /* @__PURE__ */ new Map();
  }
  async load(e, { exact: t = !0 } = {}) {
    const i = Xi(e);
    if (this.destroyed) throw new DOMException("Texture pool disposed", "AbortError");
    if (this.textures.has(i)) return this.textures.get(i);
    if (this.pending.has(i)) return this.pending.get(i);
    this.loadingManager.itemStart(i);
    const n = this.abortController.signal, r = fetch(i, {
      credentials: "same-origin",
      signal: n
    }).then((s) => {
      if (!s.ok) throw new Error(`Evidence texture ${s.status}`);
      return s.blob();
    }).then(async (s) => {
      if (typeof createImageBitmap != "function") throw new Error("ImageBitmap decoding is unavailable");
      const a = await im(createImageBitmap(s, {
        imageOrientation: "from-image",
        premultiplyAlpha: "none",
        colorSpaceConversion: "none"
      }), n, (c) => c?.close?.());
      if (this.destroyed || n.aborted)
        throw a.close?.(), new DOMException("Texture pool disposed", "AbortError");
      const o = new Dt(a);
      return o.colorSpace = vt, o.flipY = !1, o.generateMipmaps = !0, o.minFilter = nr, o.magFilter = Lt, o.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy()), o.userData.v5ExactEvidence = t, o.userData.v5ImageBitmap = a, o.needsUpdate = !0, this.pending.delete(i), this.textures.set(i, o), this.loadingManager.itemEnd(i), o;
    }).catch((s) => {
      throw this.pending.delete(i), this.loadingManager.itemError(i), this.loadingManager.itemEnd(i), s;
    });
    return this.pending.set(i, r), r;
  }
  dispose() {
    this.destroyed = !0, this.abortController.abort();
    const e = /* @__PURE__ */ new Set();
    for (const t of this.textures.values()) Yc(t, e);
    this.textures.clear(), this.pending.clear();
  }
}, rm = class {
  constructor({ root: e, viewport: t, payload: i, manifest: n, evidenceContract: r, variant: s, renderer: a, environmentMap: o, initialState: c = {}, domActive: l = !0 }) {
    this.root = e, this.viewport = t, this.payload = i, this.manifest = n, this.evidenceContract = r, this.variantName = s, this.variant = n.variants[s], this.renderer = a, this.domActive = l, this.loadingManager = new Pc(), this.texturePool = new nm(a, this.loadingManager), this.scene = new pc(), this.scene.background = new Te(725268), this.scene.environment = o, this.scene.fog = new Rh(725268, s === "mobile" ? 0.012 : 9e-3), this.camera = new Pt(40, 1, this.variant.camera.near, this.variant.camera.far), this.cameraTarget = new U(), this.cameraDesired = new U(), this.targetDesired = new U(), this.fovDesired = 40, this.world = null, this.modelURL = "", this.groups = /* @__PURE__ */ new Map(), this.nodes = /* @__PURE__ */ new Map(), this.duplicateNodeNames = /* @__PURE__ */ new Set(), this.interactiveMeshes = [], this.activeInteractiveMeshes = [], this.raycaster = new Id(), this.pointer = new Fe(4, 4), this.pointerDesired = new Fe(), this.pointerSmoothed = new Fe(), this.hovered = null, this.hoverCounter = 0, this.hoverStrengths = /* @__PURE__ */ new Map(), this.sceneName = "control", this.sceneProgress = 0, this.sceneIndex = 0, this.heroState = c.heroState || "low", this.comparisonState = c.comparisonState || "halation", this.axisId = c.axisId || "vec_optical_softness", this.associationRays = [], this.atlasLoaded = !1, this.atlasPromise = null, this.clock = new Nd(!1), this.elapsed = 0, this.introStart = 0, this.introProgress = 0, this.entered = !1, this.reduced = matchMedia(Kc).matches, this.coarse = matchMedia(Xc).matches, this.destroyed = !1, this.scenePresence = new Map(yt.map((h) => [h, h === "control" ? 1 : 0])), this.dust = null, this.comparisonEvidencePromise = null, this.reconstructionEvidencePromise = null, this.evidenceFailures = /* @__PURE__ */ new Set(), this.baseWorldPosition = new U(), this.lastSceneEvent = "", this.comparatorDrag = null, this.archiveSelection = -1, this.archiveAppliedSelection = -1, this.archiveInstanceField = null, this.archiveInstanceBases = [], this.archiveEntries = [], this.archiveMatrix = new Ne(), this.archivePosition = new U(), this.archiveQuaternion = new Ht(), this.archiveScale = new U(), this.observations = Jp(i), this.heroIds = new Map(r.hero.map((h) => [h.requestedLevel, h.observation]));
  }
  configureLighting() {
    const e = new md(13625838, 1381401, 1.15);
    e.name = "V5_Sky_Fill", this.scene.add(e);
    const t = new Nc(15202559, this.variantName === "mobile" ? 3.4 : 4.1);
    t.position.set(-10, 18, 7), t.target.position.set(0, 3.5, 0), t.castShadow = this.variantName === "desktop", t.castShadow && (t.shadow.mapSize.set(1024, 1024), t.shadow.bias = -4e-4, t.shadow.camera.near = 1, t.shadow.camera.far = 90, t.shadow.camera.left = -22, t.shadow.camera.right = 22, t.shadow.camera.top = 22, t.shadow.camera.bottom = -22, t.shadow.camera.updateProjectionMatrix()), this.scene.add(t, t.target);
    const i = new qs(16757366, 19, 22, 1.8);
    i.name = "V5_Internal_Emulsion_Light", i.position.set(0, 4.2, 1.6), this.scene.add(i), this.internalLight = i;
    const n = new qs(8902883, 11, 28, 2);
    n.name = "V5_Optical_Edge_Light", n.position.set(-7, 7, 3), this.scene.add(n), this.coldLight = n;
  }
  createDust() {
    const e = this.variantName === "mobile" ? 70 : 180, t = tm(684453), i = new Float32Array(e * 3);
    for (let s = 0; s < e; s += 1)
      i[s * 3] = (t() - 0.5) * 38, i[s * 3 + 1] = (t() - 0.25) * 26, i[s * 3 + 2] = 0.4 + t() * 15;
    const n = new Wt();
    n.setAttribute("position", new Tt(i, 3));
    const r = new sa({
      color: 12114395,
      size: this.variantName === "mobile" ? 0.028 : 0.022,
      transparent: !0,
      opacity: 0.23,
      depthWrite: !1,
      blending: 2,
      toneMapped: !1
    });
    this.dust = new Sc(n, r), this.dust.name = "V5_Emulsion_Particulate", this.scene.add(this.dust);
  }
  async load(e = () => {
  }) {
    this.configureLighting(), this.createDust();
    const t = new ep(this.loadingManager);
    t.setMeshoptDecoder(Np), this.modelURL = Xi(this.variant.model.path);
    const i = await new Promise((n, r) => {
      t.load(this.modelURL, n, (s) => {
        s.lengthComputable && s.total > 0 && e(Nt(s.loaded / s.total));
      }, r);
    });
    if (this.destroyed) {
      Zs(i.scene);
      return;
    }
    return this.world = i.scene, this.world.name = "V5_Emulsion_Monolith_World", this.baseWorldPosition.copy(this.world.position), this.scene.add(this.world), this.indexNodes(), this.validateNodes(), this.tuneMaterials(), await this.bindExactEvidence(), this.composeAssociation(this.axisId), this.setScene("control", 0, !0), this.setHeroState(this.heroState, !0), this.setComparison(this.comparisonState, !0), this.setCameraAt("control", !0), this;
  }
  indexNodes() {
    this.nodes.clear(), this.duplicateNodeNames.clear(), this.world.traverse((i) => {
      i.name && (this.nodes.has(i.name) ? this.duplicateNodeNames.add(i.name) : this.nodes.set(i.name, i)), Bo(i), (i.isMesh || i.isInstancedMesh) && (i.castShadow = this.variantName === "desktop" && !i.name.startsWith("Archive"), i.receiveShadow = this.variantName === "desktop");
    });
    const e = {
      control: ["ControlShell", ...[...this.heroIds.values()].map((i) => `OriginPlate_${i.replace(/^obs_/, "")}`)],
      response: ["ResponseShell", ...Array.from({ length: 6 }, (i, n) => `ResponseRail_${String(n + 1).padStart(2, "0")}`)],
      comparison: [
        "ComparatorLeft",
        "ComparatorRight",
        "ComparatorBlade"
      ],
      association: ["AssociationPivot"],
      reconstruction: [
        "ReconstructionRail_01",
        "ReconstructionRail_02",
        "ReconstructionRail_03",
        "ReconstructionOutputCarriage",
        "ResidualFilm"
      ],
      archive: ["ArchiveOrigin"]
    }, t = this.nodes.get("MonolithRoot");
    t && (t.userData.v5Beat = "*", t.userData.v5InteractiveRoot = t, t.traverse((i) => {
      if (i.isMesh || i.isInstancedMesh) {
        var n;
        (n = i.userData).v5InteractiveRoot || (n.v5InteractiveRoot = t), this.interactiveMeshes.push(i);
      }
    }));
    for (const [i, n] of Object.entries(e)) {
      const r = n.map((s) => this.nodes.get(s)).filter(Boolean);
      this.groups.set(i, r);
      for (const s of r)
        s.userData.v5Beat = i, s.userData.v5InteractiveRoot = s, s.traverse((a) => {
          (a.isMesh || a.isInstancedMesh) && (a.userData.v5InteractiveRoot = s, this.interactiveMeshes.push(a));
        });
    }
    this.interactiveMeshes = [...new Set(this.interactiveMeshes)], this.refreshActiveInteractiveMeshes();
  }
  refreshActiveInteractiveMeshes() {
    this.activeInteractiveMeshes = this.interactiveMeshes.filter((e) => {
      const t = e.userData.v5InteractiveRoot?.userData?.v5Beat;
      return t === this.sceneName || t === "*";
    });
  }
  validateNodes() {
    const e = /* @__PURE__ */ new Set([...this.manifest.requiredNodes || [], ...this.evidenceContract.worldNodes]), t = [...e].filter((o) => !this.nodes.has(o));
    if (t.length) throw new Error(`World contract missing nodes: ${t.join(", ")}`);
    const i = [...e].filter((o) => this.duplicateNodeNames.has(o));
    if (i.length) throw new Error(`World contract duplicates nodes: ${i.join(", ")}`);
    if (Hi(this.nodes.get("AssociationRay"))) throw new Error("World contract AssociationRay must remain an empty anchor");
    for (const o of this.evidenceContract.bindings) {
      const c = this.nodes.get(o.rootName), l = this.nodes.get(o.evidenceName);
      let h = l;
      for (; h && h !== c; ) h = h.parent;
      if (h !== c) throw new Error(`World contract ${o.evidenceName} is outside ${o.rootName}`);
      if (!Hi(l)) throw new Error(`World contract ${o.evidenceName} has no mesh`);
    }
    const n = this.nodes.get("ArchiveOrigin"), r = this.nodes.get(this.evidenceContract.archive.node);
    let s = r;
    for (; s && s !== n; ) s = s.parent;
    const a = Hi(r);
    if (s !== n) throw new Error(`World contract ${this.evidenceContract.archive.node} is outside ArchiveOrigin`);
    if (!a?.isInstancedMesh || a.count !== this.evidenceContract.archive.count || !a.geometry?.attributes?.uv) throw new Error(`World contract ${this.evidenceContract.archive.node} must expose ${this.evidenceContract.archive.count} UV-mapped instances`);
    for (let o = 1; o <= 6; o += 1) {
      const c = `ResponseRail_${String(o).padStart(2, "0")}`, l = this.nodes.get(c), h = l?.userData?.atlas_response_offset, u = l?.userData?.atlas_response_rotation_euler;
      if (!Array.isArray(h) || h.length !== 3 || !h.every(Number.isFinite) || !Array.isArray(u) || u.length !== 3 || !u.every(Number.isFinite)) throw new Error(`World contract missing response transform extras on ${c}`);
      l.userData.v5ResponseOffset = new U(...h);
      const d = new Ht().setFromEuler(new Fi(...u));
      l.userData.v5ResponseQuaternion = l.userData.v5BaseTransform.quaternion.clone().multiply(d);
    }
    jc.forEach((o, c) => {
      const l = `ReconstructionRail_${String(c + 1).padStart(2, "0")}`, h = this.nodes.get(l);
      h.userData.v5ReconstructionEntryQuaternion = jp(h.userData.v5BaseTransform.quaternion, c);
    });
  }
  tuneMaterials() {
    const e = /* @__PURE__ */ new Set();
    this.world.traverse((t) => {
      if (!t.isMesh && !t.isInstancedMesh) return;
      const i = Array.isArray(t.material) ? t.material : [t.material];
      for (const n of i)
        !n || e.has(n) || (e.add(n), "envMapIntensity" in n && (n.envMapIntensity = 1.1), /graphite/i.test(n.name) && (n.metalness = Math.max(0.62, n.metalness || 0), n.roughness = Math.min(0.5, n.roughness ?? 0.5)), n.isMeshPhysicalMaterial && n.transmission > 0 && !/residual/i.test(n.name) ? (n.transparent = !1, n.opacity = 1, n.depthWrite = !0, n.side = 0, n.thickness = Nt(n.thickness || 0.16, 0.12, 0.2), n.attenuationColor.setHex(1519929), n.attenuationDistance = Nt(n.attenuationDistance || 1.7, 1.4, 2), n.roughness = Math.max(0.16, n.roughness ?? 0.16)) : n.transparent && (n.depthWrite = !1, n.roughness = Math.max(0.16, n.roughness ?? 0.16), n.side = 2), /^(?:Clay_)?(?:GraphiteEmulsion|EmulsionBacking)(?:\.\d+)?$/i.test(n.name) && (n.transparent = !1, n.opacity = 1, n.depthWrite = !0, n.side = 0), /signal|coldwhite|residual/i.test(n.name) && (n.toneMapped = !0), n.needsUpdate = !0);
    });
  }
  async bindExactEvidence() {
    const e = this.evidenceContract.hero.map(async (t) => {
      const i = await this.texturePool.load(zs(t.observation, this.coarse)), n = Hi(this.nodes.get(t.evidenceName));
      if (!n) throw new Error(`World contract missing ${t.evidenceName}`);
      Ur(n), n.material = Vs(i), n.userData.v5ExactObservation = t.observation;
    });
    await Promise.all(e);
  }
  degradeEvidence(e, t) {
    return this.evidenceFailures.has(e) || (this.evidenceFailures.add(e), console.warn(`${e} exact evidence is unavailable.`, t), this.root.dispatchEvent(new CustomEvent("atlas:evidence-failure", { detail: {
      beat: e,
      error: t,
      world: this
    } }))), null;
  }
  async ensureComparisonEvidence() {
    if (this.comparisonEvidencePromise) return this.comparisonEvidencePromise;
    const e = this.evidenceContract.comparison;
    return this.comparisonEvidencePromise = Promise.all(e.map(async (t) => {
      const i = Hi(this.nodes.get(t.evidenceName));
      if (!i) throw new Error(`World contract missing ${t.evidenceName}`);
      const n = t.observation;
      if (!n) throw new Error(`Comparison evidence ID missing for ${t.evidenceName}`);
      if (i.userData.v5ExactObservation === n) return;
      const r = await this.texturePool.load(zs(n, this.coarse));
      Ur(i), i.material = Vs(r), i.userData.v5ExactObservation = n;
    })).catch((t) => this.degradeEvidence("comparison", t)), this.comparisonEvidencePromise;
  }
  async ensureReconstructionEvidence() {
    if (this.reconstructionEvidencePromise) return this.reconstructionEvidencePromise;
    const e = this.evidenceContract.reconstruction;
    return this.reconstructionEvidencePromise = Promise.all(e.map(async (t) => {
      const i = t.observation, n = Hi(this.nodes.get(t.evidenceName));
      if (!n) throw new Error(`World contract missing ${t.evidenceName}`);
      if (n.userData.v5ExactObservation === i) return;
      const r = await this.texturePool.load(zs(i, this.coarse));
      Ur(n), n.material = Vs(r), n.userData.v5ExactObservation = i;
    })).catch((t) => this.degradeEvidence("reconstruction", t)), this.reconstructionEvidencePromise;
  }
  responseComponents() {
    const e = this.payload.hero.vector_id;
    return ((this.payload.analysis?.responses?.studies || []).find((t) => t.vector_id === e)?.components || []).filter((t) => Math.abs(Number(t[1])) > 1e-12).sort((t, i) => Math.abs(Number(i[1])) - Math.abs(Number(t[1]))).slice(0, 6);
  }
  correlationRows(e) {
    return (this.payload.analysis?.correlations?.pairs || []).flatMap(([t, i, n]) => t === e ? [{
      id: i,
      r: Number(n)
    }] : i === e ? [{
      id: t,
      r: Number(n)
    }] : []).sort((t, i) => Math.abs(i.r) - Math.abs(t.r)).slice(0, 5);
  }
  composeAssociation(e) {
    const t = this.nodes.get("AssociationPivot"), i = this.nodes.get("AssociationRay");
    if (!t || !i) return;
    const n = new Set(this.associationRays);
    this.interactiveMeshes = this.interactiveMeshes.filter((s) => !n.has(s));
    for (const s of this.associationRays)
      s.removeFromParent(), s.geometry?.dispose?.(), s.material?.dispose?.();
    this.associationRays = [];
    const r = this.correlationRows(e);
    r.forEach((s, a) => {
      const { start: o, end: c, radius: l } = Kp(s, a), h = c.clone().sub(o), u = h.length(), d = o.clone().add(c).multiplyScalar(0.5), p = new jh(l, l, u, 8, 1, !0), g = new Jr({
        color: s.r < 0 ? 16746362 : 9233382,
        emissive: s.r < 0 ? 5903633 : 1460815,
        emissiveIntensity: 1.7 - a * 0.2,
        metalness: 0.18,
        roughness: 0.28
      }), _ = new At(p, g);
      _.name = `AssociationLaminaVein_${s.id}`, _.position.copy(d), _.quaternion.setFromUnitVectors(new U(0, 1, 0), h.normalize()), _.userData.v5Correlation = s, _.userData.v5InteractiveRoot = _, _.userData.v5Beat = "association", Bo(_), i.add(_), this.associationRays.push(_), this.interactiveMeshes.push(_);
    }), this.interactiveMeshes = [...new Set(this.interactiveMeshes)], this.refreshActiveInteractiveMeshes(), this.updateAssociationLedger(e, r);
  }
  updateAssociationLedger(e, t = this.correlationRows(e)) {
    if (!this.domActive) return;
    const i = this.root.querySelector('[data-world-ledger="association"]');
    if (!i) return;
    const n = i.querySelector("caption");
    n && (n.textContent = `Strongest recorded relationships to ${Di(this.payload, e)}`);
    const r = i.querySelector("tbody");
    r && r.replaceChildren(...t.map(({ id: s, r: a }) => {
      const o = er.radToDeg(Math.acos(Nt(a, -1, 1))), c = document.createElement("tr");
      c.dataset.vectorId = s, c.dataset.sign = a < 0 ? "negative" : "positive", c.style.setProperty("--angle", `${o.toFixed(1)}deg`);
      const l = document.createElement("th");
      l.scope = "row";
      const h = document.createElement("i");
      h.setAttribute("aria-hidden", "true"), l.append(h, document.createTextNode(Di(this.payload, s)));
      const u = document.createElement("td");
      u.textContent = `${a >= 0 ? "+" : ""}${a.toFixed(2)}`;
      const d = document.createElement("td");
      return d.textContent = `${o.toFixed(0)}°`, c.append(l, u, d), c;
    }));
  }
  async ensureAtlas() {
    if (this.atlasLoaded) return;
    if (this.atlasPromise) return this.atlasPromise;
    const e = this.payload.field?.atlas, t = this.evidenceContract.archive, i = this.variantName === "mobile" ? e?.mobile : e?.desktop, n = this.variantName === "mobile" ? e?.mobile_path : e?.desktop_path, r = this.nodes.get("ArchiveOrigin");
    return !e || !t || !i || !n || !r ? (this.atlasPromise = Promise.resolve(this.degradeEvidence("archive", /* @__PURE__ */ new Error("Archive atlas contract is incomplete"))), this.atlasPromise) : (this.atlasPromise = this.texturePool.load(Xi(n)).then((s) => {
      const a = i.cell_size, o = i.cell_size - 2 * i.gutter, c = t.entries, l = t.count, h = (g) => {
        const _ = g % e.columns, m = Math.floor(g / e.columns), f = i.offset_x + _ * a + i.gutter, T = i.offset_y + m * a + i.gutter, A = (f + 0.5) / i.width, M = (f + o - 0.5) / i.width, E = (T + 0.5) / i.height, w = (T + o - 0.5) / i.height;
        return [
          A,
          E,
          M - A,
          w - E
        ];
      }, u = Hi(this.nodes.get(t.node));
      if (!u?.isInstancedMesh || u.count !== l || !u.geometry?.attributes?.uv) throw new Error(`ArchiveEvidenceField must expose ${l} UV-mapped instances`);
      Ur(u);
      const d = new Float32Array(u.count * 4);
      for (let g = 0; g < u.count; g += 1) d.set(h(c[g][1]), g * 4);
      u.geometry = u.geometry.clone(), u.geometry.setAttribute("atlasRect", new qr(d, 4));
      const p = new Jt({
        map: s,
        color: 16777215,
        side: 2,
        toneMapped: !1,
        fog: !1
      });
      return p.onBeforeCompile = (g) => {
        g.vertexShader = g.vertexShader.replace("#include <uv_pars_vertex>", `#include <uv_pars_vertex>
attribute vec4 atlasRect;`).replace("#include <uv_vertex>", `#include <uv_vertex>
#ifdef USE_MAP
  vMapUv = atlasRect.xy + uv * atlasRect.zw;
#endif`);
      }, p.customProgramCacheKey = () => "atlas-instance-rect-v1", u.material = p, this.archiveInstanceField = u, this.archiveEntries = c.map(([g]) => g), this.archiveInstanceBases = Array.from({ length: u.count }, (g, _) => {
        const m = new Ne();
        return u.getMatrixAt(_, m), m;
      }), r.userData.v5AtlasTexture = s, r.userData.v5AtlasGeometry = i, this.atlasLoaded = !0, this.atlasPromise = null, s;
    }).catch((s) => this.degradeEvidence("archive", s)), this.atlasPromise);
  }
  async prepareSceneEvidence(e) {
    if (e === "comparison" ? await this.ensureComparisonEvidence() : e === "reconstruction" ? await this.ensureReconstructionEvidence() : e === "archive" && await this.ensureAtlas(), this.evidenceFailures.has(e)) throw new Error(`${e} exact evidence could not be prepared`);
  }
  marker(e) {
    const t = this.variant.camera.markers[e] || this.variant.camera.markers.control;
    return {
      position: new U(...t.position),
      target: new U(...t.target),
      fov: Number(t.fov || 40)
    };
  }
  setCameraAt(e, t = !1) {
    const i = this.marker(e);
    this.cameraDesired.copy(i.position), this.targetDesired.copy(i.target), this.fovDesired = i.fov, t && (this.camera.position.copy(i.position), this.cameraTarget.copy(i.target), this.camera.fov = i.fov, this.camera.lookAt(i.target), this.camera.updateProjectionMatrix());
  }
  setCameraJourney(e, t) {
    const i = this.marker(yt[e]), n = Math.min(yt.length - 1, e + 1), r = this.marker(yt[n]), s = n === e ? 0 : Li(0.58, 0.94, t);
    this.cameraDesired.lerpVectors(i.position, r.position, s), this.targetDesired.lerpVectors(i.target, r.target, s), this.fovDesired = er.lerp(i.fov, r.fov, s);
    const a = Math.sin(s * Math.PI) * (this.variantName === "mobile" ? 0.32 : 0.55);
    this.cameraDesired.y -= a * (e % 2 ? 1 : -1), this.cameraDesired.z += a * 0.72;
  }
  groupPresence(e) {
    return this.scenePresence.get(e) || 0;
  }
  setScene(e, t = 0, i = !1) {
    const n = yt.includes(e) ? e : "control", r = n !== this.sceneName, s = this.sceneName, a = this.sceneIndex;
    this.sceneName = n, this.sceneIndex = yt.indexOf(n), this.sceneProgress = Nt(t), this.domActive && (this.root.dataset.chamberActiveScene = n, this.root.dataset.worldActiveBeat = n);
    const o = this.sceneIndex === 0 ? "control" : this.sceneIndex < 4 ? "entanglement" : "residual-atlas";
    if (this.domActive && (this.root.dataset.worldActiveAct = o), r && (this.pointerLeave(), this.refreshActiveInteractiveMeshes(), this.domActive && !i)) {
      const c = `v5:${s}:${n}:${Math.round(performance.now())}`;
      pn("atlas:transition", {
        from: s,
        to: n,
        direction: this.sceneIndex >= a ? 1 : -1,
        phase: "cross",
        transitionId: c
      }), this.announce(`${n} scene`), this.lastSceneEvent = c;
    }
    n === "response" && t >= 0.46 && this.ensureComparisonEvidence(), n === "comparison" && this.ensureComparisonEvidence(), n === "association" && t >= 0.46 && this.ensureReconstructionEvidence(), n === "reconstruction" && this.ensureReconstructionEvidence(), (n === "archive" || n === "reconstruction" && t >= 0.72) && this.ensureAtlas();
    for (const c of yt) i && this.scenePresence.set(c, c === n ? 1 : 0);
    this.domActive && this.syncFallbackFrames(n);
  }
  syncFallbackFrames(e) {
    this.root.querySelectorAll("[data-world-fallback-frame]").forEach((t) => {
      const i = t.dataset.worldFallbackFrame === e;
      t.classList.toggle("is-active", i), t.setAttribute("aria-hidden", String(!i));
    });
  }
  setHeroState(e, t = !1) {
    if (this.heroIds.has(e)) {
      this.heroState = e, this.domActive && (this.root.dataset.chamberState = e, this.root.querySelectorAll("[data-chamber-state]").forEach((i) => {
        const n = i.dataset.chamberState === e;
        i.classList.toggle("is-active", n), i.setAttribute("aria-pressed", String(n));
      }));
      for (const [i, n] of this.heroIds) {
        const r = this.nodes.get(`OriginPlate_${n.replace("obs_", "")}`);
        r && (r.userData.v5Selected = i === e, t && this.hoverStrengths.set(r, i === e ? 0.3 : 0));
      }
      this.domActive && !t && (pn("atlas:interaction", {
        kind: "state-detent",
        value: e,
        pan: e === "low" ? -0.5 : e === "high" ? 0.5 : 0,
        interactionId: `state:${e}:${Math.round(performance.now())}`
      }), this.announce(`${e} requested ${Di(this.payload, this.payload.hero.vector_id).toLowerCase()}, exact ${this.heroIds.get(e)}`));
    }
  }
  setComparison(e, t = !1) {
    ["halation", "bloom"].includes(e) && (this.comparisonState = e, this.domActive && (this.root.dataset.chamberComparison = e, this.root.querySelectorAll("button[data-chamber-compare]").forEach((i) => {
      const n = i.dataset.chamberCompare === e;
      i.classList.toggle("is-active", n), i.setAttribute("aria-pressed", String(n));
    }), this.root.querySelectorAll("[data-chamber-compare-layer]").forEach((i) => {
      const n = i.dataset.chamberCompareLayer === e;
      i.classList.toggle("is-active", n), i.hidden = !n, i.setAttribute("aria-hidden", String(!n));
    })), this.domActive && !t && (pn("atlas:interaction", {
      kind: "comparison-slide",
      value: e,
      pan: e === "halation" ? -0.42 : 0.42,
      interactionId: `compare:${e}:${Math.round(performance.now())}`
    }), this.announce(`${e === "halation" ? "Halation" : "Highlight bloom"} exact output in focus`)));
  }
  setAxis(e, t = !1) {
    this.payload.vectors?.[e] && (this.axisId = e, this.domActive && (this.root.dataset.chamberAxis = e, this.root.querySelectorAll("[data-chamber-axis]").forEach((i) => {
      const n = i.dataset.chamberAxis === e;
      i.classList.toggle("is-active", n), i.setAttribute("aria-pressed", String(n));
    })), this.composeAssociation(e), this.domActive && !t && (pn("atlas:interaction", {
      kind: "axis-collet",
      value: e,
      pan: 0,
      interactionId: `axis:${e}:${Math.round(performance.now())}`
    }), this.announce(`${Di(this.payload, e)} correlation axis`)));
  }
  announce(e) {
    if (!this.domActive) return;
    const t = this.root.querySelector("[data-chamber-status]");
    t && (t.textContent = e);
  }
  setEntered(e = !0, t = !0) {
    this.entered = e, e && (this.introStart = t ? performance.now() : performance.now() - Fo, this.introProgress = this.reduced || !t ? 1 : 0, this.clock.start());
  }
  updateScenePresence(e) {
    for (const t of yt) {
      const i = t === this.sceneName ? 1 : 0, n = this.scenePresence.get(t) || 0;
      this.scenePresence.set(t, this.reduced ? i : Ii(n, i, Wp, e));
    }
    for (const [t, i] of this.groups) {
      const n = this.groupPresence(t);
      for (const r of i)
        r.visible = n > 4e-3, Qp(r, Math.max(1e-3, Li(0, 1, n)));
    }
  }
  updateMechanisms(e) {
    this.responseComponents().forEach((a, o) => {
      const c = this.nodes.get(`ResponseRail_${String(o + 1).padStart(2, "0")}`);
      if (!c) return;
      const l = c.userData.v5BaseTransform, h = c.userData.v5ResponseOffset, u = c.userData.v5ResponseQuaternion, d = this.hoverStrengths.get(c) || 0, p = Li(0.05 + o * 0.045, 0.48 + o * 0.035, this.sceneProgress), g = p + d * 0.08;
      c.position.copy(l.position).addScaledVector(h, g), c.quaternion.slerpQuaternions(l.quaternion, u, p), c.scale.copy(l.scale).multiplyScalar(Math.max(1e-3, this.groupPresence("response")) * (1 + d * 0.025)), c.userData.v5VectorId = a[0], c.userData.v5MeasuredDelta = Number(a[1]);
    });
    for (const [a, o] of this.heroIds) {
      const c = this.nodes.get(`OriginPlate_${o.replace("obs_", "")}`);
      if (!c) continue;
      const l = c.userData.v5BaseTransform, h = a === this.heroState ? 1 : 0, u = this.hoverStrengths.get(c) || 0, d = h * 0.085 + u * 0.12;
      c.position.copy(l.position), c.position.z += d, c.scale.copy(l.scale).multiplyScalar((1 + h * 0.018 + u * 0.025) * Math.max(1e-3, this.groupPresence("control")));
    }
    const t = this.nodes.get("ComparatorBlade");
    if (t) {
      const a = t.userData.v5BaseTransform, o = this.hoverStrengths.get(t) || 0, c = this.comparatorDrag == null ? this.comparisonState === "halation" ? -0.84 : 0.84 : this.comparatorDrag * 1.7;
      t.position.copy(a.position), t.position.x += c, t.scale.copy(a.scale).multiplyScalar((1 + o * 0.09) * Math.max(1e-3, this.groupPresence("comparison")));
    }
    for (const [a, o] of [["ComparatorLeft", "halation"], ["ComparatorRight", "bloom"]]) {
      const c = this.nodes.get(a);
      if (!c) continue;
      const l = c.userData.v5BaseTransform, h = o === this.comparisonState ? 1 : 0, u = this.hoverStrengths.get(c) || 0;
      c.position.copy(l.position), c.position.z += h * 0.11 + u * 0.09, c.scale.copy(l.scale).multiplyScalar((1 + h * 0.015 + u * 0.025) * Math.max(1e-3, this.groupPresence("comparison")));
    }
    this.associationRays.forEach((a) => {
      const o = a.userData.v5BaseTransform, c = this.hoverStrengths.get(a) || 0;
      a.scale.copy(o.scale), a.scale.x *= 1 + c * 0.55, a.scale.z *= 1 + c * 0.55, a.scale.multiplyScalar(Math.max(1e-3, this.groupPresence("association"))), a.material && (a.material.emissiveIntensity = 1.4 + c * 3.2);
    }), (this.payload.reconstruction?.weights || []).slice(0, 3).forEach((a, o) => {
      const c = this.nodes.get(`ReconstructionRail_${String(o + 1).padStart(2, "0")}`);
      if (!c) return;
      const l = c.userData.v5BaseTransform, h = this.hoverStrengths.get(c) || 0, u = Li(0.18 + o * 0.05, 0.65 + o * 0.04, this.sceneProgress), d = c.userData.v5ReconstructionEntryQuaternion;
      c.quaternion.slerpQuaternions(d, l.quaternion, u), c.rotateZ(h * (o - 1) * 0.06), c.position.copy(l.position), c.position.x += (o - 1) * (1 - u) * 1.2, c.scale.copy(l.scale).multiplyScalar(Math.max(1e-3, this.groupPresence("reconstruction"))), c.userData.v5Weight = Number(a.weight);
    });
    const i = this.nodes.get("ReconstructionOutputCarriage");
    if (i) {
      const a = i.userData.v5BaseTransform, o = Li(0.46, 0.74, this.sceneProgress), c = this.hoverStrengths.get(i) || 0;
      i.position.copy(a.position), i.position.z -= (1 - o) * 1.15, i.scale.copy(a.scale).multiplyScalar(Math.max(1e-3, this.groupPresence("reconstruction")) * (0.82 + o * 0.18) * (1 + c * 0.035));
    }
    const n = this.nodes.get("ResidualFilm");
    if (n) {
      const a = n.userData.v5BaseTransform, o = this.hoverStrengths.get(n) || 0, c = Li(0.58, 0.9, this.sceneProgress);
      n.position.copy(a.position), n.position.x += c * 0.55 + o * 0.22, n.quaternion.copy(a.quaternion), n.rotateZ(c * 0.16 + o * 0.08), n.scale.copy(a.scale).multiplyScalar(Math.max(1e-3, this.groupPresence("reconstruction")));
    }
    const r = this.nodes.get("ArchiveOrigin");
    if (r) {
      const a = r.userData.v5BaseTransform, o = this.hoverStrengths.get(r) || 0, c = Li(0.04, 0.66, this.sceneProgress);
      r.position.copy(a.position), r.position.z += (1 - c) * -5 + o * 0.32, r.scale.copy(a.scale).multiplyScalar(Math.max(1e-3, this.groupPresence("archive") * (0.45 + c * 0.55) * (1 + o * 0.025))), this.updateArchiveExtraction(o);
    }
    const s = this.nodes.get("MonolithRoot");
    if (s) {
      const a = s.userData.v5BaseTransform, o = this.hoverStrengths.get(s) || 0;
      s.quaternion.copy(a.quaternion), s.rotateY(o * 0.025), s.scale.copy(a.scale).multiplyScalar(1 + o * 0.012);
    }
  }
  updateHover(e) {
    for (const [t, i] of this.hoverStrengths) {
      const n = t === this.hovered ? 1 : t.userData.v5Selected ? 0.3 : 0, r = n > i ? zp : Vp, s = this.reduced ? n : Ii(i, n, r, e);
      s < 1e-3 && n === 0 ? this.hoverStrengths.delete(t) : this.hoverStrengths.set(t, s);
    }
    this.hovered && !this.hoverStrengths.has(this.hovered) && this.hoverStrengths.set(this.hovered, 0.01);
  }
  updateArchiveExtraction(e) {
    const t = this.archiveInstanceField;
    if (!t || !this.archiveInstanceBases.length) return;
    this.archiveAppliedSelection !== this.archiveSelection && (this.archiveAppliedSelection >= 0 && t.setMatrixAt(this.archiveAppliedSelection, this.archiveInstanceBases[this.archiveAppliedSelection]), this.archiveSelection >= 0 && (this.archiveAppliedSelection = this.archiveSelection));
    const i = this.archiveAppliedSelection;
    if (i < 0) return;
    const n = this.archiveInstanceBases[i];
    if (n) {
      if (this.archiveSelection < 0 && e < 1e-3) {
        t.setMatrixAt(i, n), this.archiveAppliedSelection = -1, t.instanceMatrix.needsUpdate = !0;
        return;
      }
      n.decompose(this.archivePosition, this.archiveQuaternion, this.archiveScale), this.archivePosition.z += e * 0.62, this.archiveScale.multiplyScalar(1 + e * 0.08), this.archiveMatrix.compose(this.archivePosition, this.archiveQuaternion, this.archiveScale), t.setMatrixAt(i, this.archiveMatrix), t.instanceMatrix.needsUpdate = !0;
    }
  }
  updateCamera(e) {
    const t = this.entered ? this.reduced ? 1 : Li(0, 1, (performance.now() - this.introStart) / Fo) : 0;
    this.introProgress = t;
    const i = this.cameraDesired.clone(), n = this.targetDesired.clone();
    if (t < 1) {
      const s = this.marker("control"), a = s.position.clone().add(new U(this.variantName === "mobile" ? 3.2 : 6.5, -2.5, 11));
      i.lerpVectors(a, i, t);
      const o = s.target.clone().add(new U(0, 0, 5));
      n.lerpVectors(o, n, t);
    }
    if (!this.reduced && this.entered) {
      const s = new U(1, 0, 0).applyQuaternion(this.camera.quaternion), a = new U(0, 1, 0).applyQuaternion(this.camera.quaternion);
      i.addScaledVector(s, this.pointerSmoothed.x * (this.variantName === "mobile" ? 0.1 : 0.24)), i.addScaledVector(a, this.pointerSmoothed.y * (this.variantName === "mobile" ? 0.06 : 0.13));
    }
    const r = this.reduced ? 0 : Hp;
    ko(this.camera.position, i, r, e), ko(this.cameraTarget, n, r, e), this.camera.fov = Ii(this.camera.fov, this.fovDesired, r, e), this.camera.lookAt(this.cameraTarget), this.camera.updateProjectionMatrix();
  }
  update(e, t) {
    this.elapsed = t, this.pointerSmoothed.x = Ii(this.pointerSmoothed.x, this.pointerDesired.x, 0.22, e), this.pointerSmoothed.y = Ii(this.pointerSmoothed.y, this.pointerDesired.y, 0.22, e), this.updateScenePresence(e), this.updateHover(e), this.updateMechanisms(e), this.updateCamera(e), this.world && !this.reduced && (this.world.position.copy(this.baseWorldPosition), this.world.position.z += Math.sin(t * 0.31) * 0.025, this.world.rotation.y = Math.sin(t * 0.17) * 25e-4, this.internalLight.intensity = 18.5 + Math.sin(t * 0.57) * 0.55, this.dust.rotation.z = t * 22e-4, this.dust.position.y = Math.sin(t * 0.11) * 0.1);
  }
  resize(e, t) {
    const i = Math.max(1, e * t), n = this.variantName === "mobile" ? Gp : Bp, r = Math.min(this.variant.dprCap || (this.variantName === "mobile" ? 1.25 : 1.5), window.devicePixelRatio || 1, Math.sqrt(n / i));
    this.renderer.setPixelRatio(Math.max(0.1, r)), this.renderer.setSize(e, t, !1), this.camera.aspect = e / Math.max(1, t), this.camera.updateProjectionMatrix();
  }
  pointerMove(e, t) {
    this.pointerDesired.set((e.clientX - t.left) / t.width * 2 - 1, -((e.clientY - t.top) / t.height * 2 - 1)), this.pointer.copy(this.pointerDesired), this.raycaster.setFromCamera(this.pointer, this.camera);
    const i = this.raycaster.intersectObjects(this.activeInteractiveMeshes, !1), n = i.find((o) => o.object.userData.v5InteractiveRoot?.userData?.v5Beat === this.sceneName) || i.find((o) => o.object.userData.v5InteractiveRoot?.userData?.v5Beat === "*"), r = n?.object?.userData?.v5InteractiveRoot || null, s = this.nodes.get("ArchiveOrigin"), a = r === s && Number.isInteger(n?.instanceId) ? n.instanceId : -1;
    r !== this.hovered && this.acquire(r, a < 0), this.setArchiveSelection(r === s ? a : -1), this.comparatorDrag != null && this.sceneName === "comparison" && (this.comparatorDrag = Nt(this.pointer.x, -1, 1), this.setComparison(this.comparatorDrag < 0 ? "halation" : "bloom", !0));
  }
  acquire(e, t = !0) {
    if (this.hovered = e, this.viewport.style.cursor = e ? "pointer" : "", this.root.dataset.probeActive = String(!!e), this.root.dataset.probeSurface = e?.name || "", this.syncProbeLedger(e), !!e) {
      if (this.hoverStrengths.set(e, Math.max(0.02, this.hoverStrengths.get(e) || 0)), e.userData.v5VectorId) {
        const i = Number(e.userData.v5MeasuredDelta || 0);
        this.announce(`${Di(this.payload, e.userData.v5VectorId)} response ${i >= 0 ? "+" : ""}${i.toFixed(2)}`);
      } else if (e.userData.v5Correlation) {
        const { id: i, r: n } = e.userData.v5Correlation;
        this.announce(`${Di(this.payload, i)} correlation ${n >= 0 ? "+" : ""}${n.toFixed(2)}`);
      }
      t && this.emitHover(e.name, e.name);
    }
  }
  syncProbeLedger(e) {
    this.root.querySelectorAll("[data-vector-id].is-probed").forEach((i) => {
      i.classList.remove("is-probed");
    });
    const t = e?.userData?.v5VectorId || e?.userData?.v5Correlation?.id;
    t && this.root.querySelectorAll("[data-vector-id]").forEach((i) => {
      i.dataset.vectorId === t && i.classList.add("is-probed");
    });
  }
  emitHover(e, t) {
    pn("atlas:interaction", {
      kind: "optical-hover",
      id: `${e}:${++this.hoverCounter}`,
      value: t,
      pan: this.pointer.x,
      interactionId: `hover:${e}:${this.hoverCounter}`
    });
  }
  setArchiveSelection(e) {
    const t = Number.isInteger(e) && e >= 0 && e < this.archiveEntries.length ? e : -1;
    if (t === this.archiveSelection) return;
    if (this.archiveSelection = t, t < 0) {
      this.root.dataset.probeSurface = this.nodes.get("ArchiveOrigin")?.name || "";
      return;
    }
    const i = this.archiveEntries[t];
    this.root.dataset.probeSurface = `archive:${i}`, this.emitHover(`archive:${t}`, i), this.announce(`${i} selected in the exact observation field`);
  }
  pointerLeave() {
    this.pointerDesired.set(0, 0), this.pointer.set(4, 4), this.comparatorDrag = null, this.setArchiveSelection(-1), this.acquire(null);
  }
  pointerDown(e, t) {
    this.sceneName === "comparison" && (this.comparatorDrag = Nt((e.clientX - t.left) / t.width * 2 - 1, -1, 1), this.setComparison(this.comparatorDrag < 0 ? "halation" : "bloom"));
  }
  activatePointer(e) {
    if (e?.button !== 0 && e?.button !== 1) return;
    const t = this.nodes.get("ArchiveOrigin");
    if (this.sceneName === "archive" && t && this.hovered === t) {
      const i = this.archiveEntries[this.archiveSelection], n = i ? Xi(`observations/${i}.html`) : this.root.querySelector("[data-world-portal-link]")?.href;
      n && (pn("atlas:interaction", {
        kind: "archive-open",
        value: i || this.hovered.name,
        pan: this.pointer.x,
        interactionId: `archive:${Math.round(performance.now())}`
      }), e?.button === 1 || e?.metaKey || e?.ctrlKey || e?.shiftKey ? window.open(n, "_blank", "noopener") : window.location.assign(n));
    }
  }
  pointerUp() {
    this.comparatorDrag = null;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  destroy() {
    this.destroyed = !0, this.clock.stop(), this.loadingManager.abort?.(), this.texturePool.dispose(), Zs(this.scene, /* @__PURE__ */ new Set()), this.scene.clear();
  }
}, sm = class {
  constructor(e) {
    this.root = e, this.viewport = e.querySelector("[data-chamber-canvas]"), this.entry = e.querySelector("[data-chamber-entry]"), this.enterButton = e.querySelector("[data-enter]"), this.enterLabel = e.querySelector("[data-enter-label]"), this.soundToggle = e.querySelector("[data-sound-toggle]"), this.soundLabel = e.querySelector("[data-sound-label]"), this.loader = e.querySelector("[data-world-loader]"), this.loaderLabel = e.querySelector("[data-world-loader-label]"), this.loaderProgress = e.querySelector("[data-world-load-progress]"), this.beatNodes = yt.map((t) => e.querySelector(`[data-world-beat="${t}"]`)), this.abortController = new AbortController(), this.loadAbortController = new AbortController(), this.compactMedia = matchMedia(Xc), this.reducedMedia = matchMedia(Kc), this.saveData = navigator.connection?.saveData || matchMedia(Up).matches, this.payload = Yp(e), this.manifest = null, this.evidenceContract = null, this.renderer = null, this.environment = null, this.world = null, this.audio = null, this.audioSettled = !1, this.audioReady = !1, this.worldReady = !1, this.fallback = !1, this.entered = !1, this.running = !1, this.destroyed = !1, this.raf = 0, this.lastFrame = 0, this.elapsed = 0, this.activeIndex = 0, this.activeProgress = 0, this.sceneRequestRevision = 0, this.pendingEvidenceScene = null, this.scrollTicking = !1, this.pointerStart = null, this.pointerFrame = 0, this.pendingPointer = null, this.resizeObserver = null, this.variantName = this.compactMedia.matches ? "mobile" : "desktop", this.reloadTimer = 0, this.worldLoadRevision = 0, this.pendingWorlds = /* @__PURE__ */ new Set(), this.focusBeforeEntry = document.activeElement, this.cleanupCallbacks = [], this.entryInertState = /* @__PURE__ */ new Map();
  }
  async boot() {
    if (this.root.dataset.bootTimedOut === "true") {
      this.leaveSemanticEdition("Boot timed out");
      return;
    }
    this.root.dataset.ready = "false", this.root.dataset.failed = "false", this.root.dataset.worldVariant = this.variantName, this.bindCoreEvents(), this.applyEntryLock(), this.updateLoader(0.03, "Loading the world"), this.saveData && (this.audioSettled = !0, this.audioReady = !1);
    const e = this.saveData ? Promise.resolve() : this.loadAudio();
    try {
      if (this.manifest = await this.loadManifest(), this.bootInactive()) throw new Error("Boot was superseded");
      if (this.updateLoader(0.1, "Opening the field"), !Zp() || this.saveData) throw new Error(this.saveData ? "Reduced-data fallback" : "WebGL 2 unavailable");
      if (await this.createRenderer(), this.bootInactive()) throw new Error("Boot was superseded");
      if (this.measureActiveScroll(), !await this.loadWorld(this.variantName)) throw new Error("World load was superseded");
      this.world.update(0, this.elapsed), this.world.render(), this.worldReady = !0, this.root.classList.add("is-chamber-webgl"), this.root.classList.remove("is-chamber-fallback"), this.root.dataset.chamberStatus = "ready", this.updateLoader(1, "World ready"), this.scheduleVariantReload();
    } catch (t) {
      console.warn("The cinematic world yielded to the semantic edition.", t), this.fallback || this.activateFallback(t?.message || "World unavailable");
    }
    this.root.dataset.bootTimedOut === "true" && this.leaveSemanticEdition("Boot timed out"), this.sampleScroll(), this.start(), await e, this.maybeEnableEntry(), this.commitReady();
  }
  async loadManifest() {
    const e = Xi(this.root.dataset.worldManifest), t = await fetch(e, {
      credentials: "same-origin",
      signal: this.loadAbortController.signal
    });
    if (!t.ok) throw new Error(`World manifest ${t.status}`);
    const i = await t.json();
    if (i.format !== "atlas-world/v1" || !i.variants?.desktop || !i.variants?.mobile) throw new Error("Unsupported world manifest");
    const n = (i.chapters || []).map((r) => r.id);
    if (yt.some((r, s) => n[s] !== r)) throw new Error("World chapter order mismatch");
    return this.evidenceContract = $p(this.payload, i), i;
  }
  bootInactive() {
    return this.destroyed || this.fallback || this.root.dataset.bootTimedOut === "true";
  }
  async loadAudio() {
    let e = 0;
    try {
      const t = Xi("assets/chamber-audio.js"), i = new Promise((r, s) => {
        e = window.setTimeout(() => s(/* @__PURE__ */ new Error("Music module timed out")), kp);
      }), n = await Promise.race([import(
        /* @vite-ignore */
        t
      ), i]);
      typeof n.createAtlasAudio == "function" && (this.audio = n.createAtlasAudio(this.root));
    } catch (t) {
      console.warn("Music controls are unavailable.", t);
    } finally {
      window.clearTimeout(e), this.root.dataset.bootTimedOut === "true" && (this.audio?.destroy?.(), this.audio = null), this.audioSettled = !0, this.audioReady = !!this.audio?.available, this.maybeEnableEntry();
    }
  }
  async createRenderer() {
    if (this.bootInactive()) throw new Error("Renderer creation was superseded");
    const e = new Zf({
      antialias: !0,
      alpha: !1,
      depth: !0,
      stencil: !1,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !1
    });
    e.outputColorSpace = vt, e.toneMapping = 6, e.toneMappingExposure = 1.13, e.shadowMap.enabled = !0, e.shadowMap.type = 2, e.domElement.setAttribute("aria-hidden", "true"), e.domElement.dataset.worldCanvas = "true", e.domElement.addEventListener("webglcontextlost", (t) => {
      t.preventDefault(), this.activateFallback("WebGL context lost"), this.stop();
    }, { signal: this.abortController.signal });
    try {
      const t = em(e);
      this.viewport.append(e.domElement), this.renderer = e, this.environment = t;
    } catch (t) {
      throw e.dispose(), t;
    }
  }
  async loadWorld(e = this.variantName) {
    if (this.bootInactive() || !this.renderer) return !1;
    const t = ++this.worldLoadRevision;
    for (const a of this.pendingWorlds) a.destroy();
    this.pendingWorlds.clear();
    const i = this.world ? {
      heroState: this.world.heroState,
      comparisonState: this.world.comparisonState,
      axisId: this.world.axisId
    } : {}, n = new rm({
      root: this.root,
      viewport: this.viewport,
      payload: this.payload,
      manifest: this.manifest,
      evidenceContract: this.evidenceContract,
      variant: e,
      renderer: this.renderer,
      environmentMap: this.environment?.texture || null,
      initialState: i,
      domActive: !this.world
    });
    this.pendingWorlds.add(n);
    const r = () => t !== this.worldLoadRevision || this.destroyed || this.fallback || !this.renderer || this.root.dataset.bootTimedOut === "true";
    try {
      await n.load((a) => {
        t === this.worldLoadRevision && !this.destroyed && this.updateLoader(0.12 + a * 0.82, "Assembling the monolith");
      });
    } catch (a) {
      if (this.pendingWorlds.delete(n), n.destroy(), r()) return !1;
      throw a;
    }
    if (r())
      return this.pendingWorlds.delete(n), n.destroy(), !1;
    try {
      const a = this.viewport.getBoundingClientRect();
      for (n.resize(Math.max(1, a.width), Math.max(1, a.height)), n.reduced = this.reducedMedia.matches, n.coarse = this.compactMedia.matches; ; ) {
        const h = yt[this.activeIndex] || "control";
        if (await n.prepareSceneEvidence(h), r())
          return this.pendingWorlds.delete(n), n.destroy(), !1;
        if (h === (yt[this.activeIndex] || "control")) break;
      }
      const o = this.viewport.getBoundingClientRect();
      if (n.resize(Math.max(1, o.width), Math.max(1, o.height)), n.reduced = this.reducedMedia.matches, n.coarse = this.compactMedia.matches, r())
        return this.pendingWorlds.delete(n), n.destroy(), !1;
      const c = this.world ? {
        heroState: this.world.heroState,
        comparisonState: this.world.comparisonState,
        axisId: this.world.axisId
      } : i;
      n.domActive = !0, n.setHeroState(c.heroState || "low", !0), n.setComparison(c.comparisonState || "halation", !0), n.setAxis(c.axisId || "vec_optical_softness", !0);
      const l = yt[this.activeIndex] || "control";
      n.setScene(l, this.activeProgress, !0), n.setCameraJourney(this.activeIndex, this.activeProgress), n.camera.position.copy(n.cameraDesired), n.cameraTarget.copy(n.targetDesired), n.camera.fov = n.fovDesired, n.camera.lookAt(n.cameraTarget), n.camera.updateProjectionMatrix(), n.setEntered(this.entered, !1);
    } catch (a) {
      if (this.pendingWorlds.delete(n), n.destroy(), r()) return !1;
      throw a;
    }
    this.pendingWorlds.delete(n);
    const s = this.world;
    this.sceneRequestRevision += 1, this.pendingEvidenceScene = null, this.world = n, this.variantName = e, this.root.dataset.worldVariant = e;
    try {
      s?.destroy();
    } catch (a) {
      console.warn("The replaced world could not be fully released.", a);
    }
    return !0;
  }
  releaseRenderer() {
    this.environment?.dispose(), this.environment = null, this.renderer?.domElement?.remove(), this.renderer?.dispose?.(), this.renderer = null;
  }
  activateFallback(e) {
    this.stop(), this.syncMeasuredFallback(yt[this.activeIndex] || "control"), this.invalidateWorldLoads(), this.fallback = !0, this.worldReady = !0, this.root.dataset.failed = "true", this.root.dataset.chamberStatus = "fallback", this.root.dataset.chamberFallback = String(e || "unavailable").toLowerCase().replace(/[^a-z0-9]+/g, "-"), this.root.classList.remove("is-chamber-webgl"), this.root.classList.add("is-chamber-fallback"), this.world?.destroy(), this.world = null, this.releaseRenderer(), this.updateLoader(1, "Static edition ready"), this.maybeEnableEntry();
  }
  leaveSemanticEdition(e) {
    this.invalidateWorldLoads(), this.fallback = !0, this.worldReady = !0, this.root.classList.remove("is-chamber-webgl", "is-chamber-fallback"), this.root.dataset.failed = "false", this.root.dataset.chamberStatus = "semantic", this.root.dataset.chamberFallback = String(e || "unavailable").toLowerCase().replace(/[^a-z0-9]+/g, "-"), this.world?.destroy(), this.world = null, this.releaseRenderer(), this.releaseEntryLock(), this.stop();
  }
  invalidateWorldLoads() {
    this.worldLoadRevision += 1, this.sceneRequestRevision += 1, this.pendingEvidenceScene = null, this.loadAbortController.abort();
    for (const e of this.pendingWorlds) e.destroy();
    this.pendingWorlds.clear();
  }
  updateLoader(e, t) {
    this.loaderProgress && (this.loaderProgress.value = Nt(e), this.loaderProgress.textContent = `${Math.round(Nt(e) * 100)}%`), this.loaderLabel && t && (this.loaderLabel.textContent = t);
  }
  maybeEnableEntry() {
    if (this.root.dataset.bootTimedOut !== "true" && !(!this.audioSettled || !this.worldReady || !this.enterButton)) {
      if (!this.audioReady) {
        if (!this.fallback) {
          this.activateFallback("Music unavailable");
          return;
        }
        this.root.dataset.audioRequest = "unavailable", this.disableSoundControl(), this.entry.dataset.entryState = "dismissed", this.entry.setAttribute("aria-hidden", "true"), this.entered = !0, this.world?.setEntered(!0), this.releaseEntryLock();
        return;
      }
      this.enterButton.disabled = !1, this.enterButton.setAttribute("aria-disabled", "false"), this.enterLabel && (this.enterLabel.textContent = "Enter the atlas");
    }
  }
  disableSoundControl() {
    this.soundToggle && (this.soundToggle.disabled = !0, this.soundToggle.hidden = !0, this.soundToggle.setAttribute("aria-disabled", "true"), this.soundLabel && (this.soundLabel.textContent = "Music unavailable"));
  }
  commitReady() {
    this.root.dataset.bootTimedOut !== "true" && (this.root.dataset.ready = "true", this.entry.dataset.entryState !== "dismissed" && (this.entry.setAttribute("role", "dialog"), this.entry.setAttribute("aria-modal", "true"), this.entry.setAttribute("aria-busy", "false"), this.entry.removeAttribute("aria-live"), requestAnimationFrame(() => this.enterButton?.focus({ preventScroll: !0 }))));
  }
  applyEntryLock() {
    document.documentElement.classList.add("is-entry-open"), document.body?.classList.add("is-entry-open"), this.root.querySelectorAll(".chamber-masthead, [data-world-narrative], [data-world-footer]").forEach((e) => {
      this.entryInertState.has(e) || this.entryInertState.set(e, !!e.inert), e.inert = !0, e.dataset.entryInert = "true";
    });
  }
  releaseEntryLock() {
    document.documentElement.classList.remove("is-entry-open"), document.body?.classList.remove("is-entry-open");
    for (const [e, t] of this.entryInertState)
      e.inert = t, delete e.dataset.entryInert;
    this.entryInertState.clear();
  }
  bindCoreEvents() {
    const e = this.abortController.signal;
    this.root.addEventListener("atlas:evidence-failure", (i) => {
      const n = i.detail?.world;
      if (this.fallback || this.world && n && n !== this.world) return;
      const r = i.detail?.beat || "exact";
      this.activateFallback(`${r} evidence unavailable`), this.announce("Exact evidence could not be loaded. The static edition is now active.");
    }, { signal: e }), this.enterButton?.addEventListener("click", () => this.enter(), { signal: e }), this.entry?.addEventListener("keydown", (i) => {
      (i.key === "Tab" || i.key === "Escape") && (i.preventDefault(), this.enterButton?.focus({ preventScroll: !0 }));
    }, { signal: e }), this.root.querySelectorAll("[data-chamber-state]").forEach((i) => {
      i.addEventListener("click", () => this.setHeroState(i.dataset.chamberState), { signal: e });
    }), this.root.querySelectorAll("button[data-chamber-compare]").forEach((i) => {
      i.addEventListener("click", () => this.setComparison(i.dataset.chamberCompare), { signal: e });
    }), this.root.querySelectorAll("[data-chamber-axis]").forEach((i) => {
      i.addEventListener("click", () => this.setAxis(i.dataset.chamberAxis), { signal: e });
    }), window.addEventListener("scroll", () => {
      this.scrollTicking || (this.scrollTicking = !0, requestAnimationFrame(() => {
        this.scrollTicking = !1, this.sampleScroll();
      }));
    }, {
      passive: !0,
      signal: e
    });
    const t = this.viewport;
    t.addEventListener("pointermove", (i) => {
      if (!(!this.entered || !this.world)) {
        if (this.pointerStart && Math.hypot(i.clientX - this.pointerStart.x, i.clientY - this.pointerStart.y) >= Oo && (this.pointerStart.moved = !0), i.pointerType === "touch") {
          this.pointerStart && this.handleTouchMove(i);
          return;
        }
        this.pendingPointer = {
          clientX: i.clientX,
          clientY: i.clientY
        }, this.pointerFrame || (this.pointerFrame = requestAnimationFrame(() => this.flushPointer()));
      }
    }, {
      passive: !0,
      signal: e
    }), t.addEventListener("pointerleave", () => {
      cancelAnimationFrame(this.pointerFrame), this.pointerFrame = 0, this.pendingPointer = null, this.world?.pointerLeave();
    }, { signal: e }), t.addEventListener("pointerdown", (i) => {
      !this.entered || !this.world || i.button !== 0 && !(i.button === 1 && this.world.sceneName === "archive") || (this.pointerStart = {
        x: i.clientX,
        y: i.clientY,
        id: i.pointerId,
        button: i.button,
        acted: !1,
        moved: !1
      }, i.pointerType !== "touch" && this.world.pointerDown(i, t.getBoundingClientRect()), t.setPointerCapture?.(i.pointerId));
    }, { signal: e }), t.addEventListener("pointerup", (i) => {
      if (!this.pointerStart || this.pointerStart.id !== i.pointerId || this.pointerStart.button !== i.button) return;
      this.flushPointer();
      const n = this.pointerStart;
      n && !n.acted && !n.moved && (i.pointerType === "touch" && this.world?.pointerMove(i, t.getBoundingClientRect()), this.world?.activatePointer(i)), this.world?.pointerUp(), i.pointerType === "touch" && this.world?.pointerLeave(), this.pointerStart = null, t.releasePointerCapture?.(i.pointerId);
    }, { signal: e }), t.addEventListener("pointercancel", () => {
      this.world?.pointerUp(), this.pointerStart = null;
    }, { signal: e }), this.resizeObserver = new ResizeObserver((i) => {
      const n = i[0]?.contentRect;
      n && this.world && this.world.resize(Math.max(1, n.width), Math.max(1, n.height));
    }), this.resizeObserver.observe(this.viewport), this.compactMedia.addEventListener("change", () => this.scheduleVariantReload(), { signal: e }), this.reducedMedia.addEventListener("change", (i) => {
      this.world && (this.world.reduced = i.matches);
    }, { signal: e }), document.addEventListener("visibilitychange", () => {
      document.hidden ? this.stop() : this.destroyed || this.start();
    }, { signal: e }), window.addEventListener("pagehide", (i) => {
      i.persisted ? this.stop() : this.destroy();
    }, { signal: e }), window.addEventListener("pageshow", (i) => {
      i.persisted && !this.destroyed && (this.restoreMeasuredScene(), this.start());
    }, { signal: e });
  }
  handleTouchMove(e) {
    if (!this.pointerStart || this.pointerStart.acted) return;
    const t = e.clientX - this.pointerStart.x, i = e.clientY - this.pointerStart.y;
    if (Math.abs(t) < Oo || Math.abs(t) <= Math.abs(i)) return;
    this.pointerStart.acted = !0;
    const n = t > 0 ? -1 : 1;
    if (this.world.sceneName === "control") {
      const r = [
        "low",
        "medium",
        "high"
      ], s = r.indexOf(this.world.heroState);
      this.setHeroState(r[Nt(s + n, 0, r.length - 1)]);
    } else if (this.world.sceneName === "comparison") this.setComparison(n > 0 ? "bloom" : "halation");
    else if (this.world.sceneName === "association") {
      const r = [...this.root.querySelectorAll("[data-chamber-axis]")].map((a) => a.dataset.chamberAxis), s = r.indexOf(this.world.axisId);
      this.setAxis(r[Nt(s + n, 0, r.length - 1)]);
    }
  }
  flushPointer() {
    cancelAnimationFrame(this.pointerFrame), this.pointerFrame = 0;
    const e = this.pendingPointer;
    this.pendingPointer = null, !(!e || !this.world || !this.entered) && this.world.pointerMove(e, this.viewport.getBoundingClientRect());
  }
  syncPressed(e, t, i) {
    this.root.querySelectorAll(e).forEach((n) => {
      const r = n.dataset[t] === i;
      n.classList.toggle("is-active", r), n.setAttribute("aria-pressed", String(r));
    });
  }
  announce(e) {
    const t = this.root.querySelector("[data-chamber-status]");
    t && (t.textContent = e);
  }
  setHeroState(e, t = !1) {
    if (this.world) {
      this.world.setHeroState(e, t);
      return;
    }
    this.root.dataset.chamberState = e, this.syncPressed("[data-chamber-state]", "chamberState", e);
  }
  setComparison(e, t = !1) {
    if (this.world) {
      this.world.setComparison(e, t);
      return;
    }
    this.root.dataset.chamberComparison = e, this.syncPressed("button[data-chamber-compare]", "chamberCompare", e), this.root.querySelectorAll("[data-chamber-compare-layer]").forEach((i) => {
      const n = i.dataset.chamberCompareLayer === e;
      i.classList.toggle("is-active", n), i.hidden = !n, i.setAttribute("aria-hidden", String(!n));
    });
  }
  setAxis(e, t = !1) {
    if (this.world) {
      this.world.setAxis(e, t);
      return;
    }
    this.root.dataset.chamberAxis = e, this.syncPressed("[data-chamber-axis]", "chamberAxis", e);
    const i = (this.payload.analysis?.correlations?.pairs || []).flatMap(([a, o, c]) => a === e ? [{
      id: o,
      r: Number(c)
    }] : o === e ? [{
      id: a,
      r: Number(c)
    }] : []).sort((a, o) => Math.abs(o.r) - Math.abs(a.r)).slice(0, 5), n = this.root.querySelector('[data-world-ledger="association"]'), r = n?.querySelector("caption");
    r && (r.textContent = `Strongest recorded relationships to ${Di(this.payload, e)}`);
    const s = n?.querySelector("tbody");
    s && s.replaceChildren(...i.map(({ id: a, r: o }) => {
      const c = er.radToDeg(Math.acos(Nt(o, -1, 1))), l = document.createElement("tr");
      l.dataset.vectorId = a, l.dataset.sign = o < 0 ? "negative" : "positive", l.style.setProperty("--angle", `${c.toFixed(1)}deg`);
      const h = document.createElement("th");
      h.scope = "row";
      const u = document.createElement("i");
      u.setAttribute("aria-hidden", "true"), h.append(u, document.createTextNode(Di(this.payload, a)));
      const d = document.createElement("td");
      d.textContent = `${o >= 0 ? "+" : ""}${o.toFixed(2)}`;
      const p = document.createElement("td");
      return p.textContent = `${c.toFixed(0)}°`, l.append(h, d, p), l;
    }));
  }
  async enter() {
    if (this.entered || this.enterButton?.disabled) return;
    this.enterButton.disabled = !0, this.enterButton.setAttribute("aria-disabled", "true"), this.enterLabel && (this.enterLabel.textContent = "Starting the music…"), this.root.dataset.audioRequest = "on";
    let e = !1;
    try {
      const t = Promise.resolve(this.audio?.enable?.({ entryCue: !0 }));
      let i = 0;
      const n = new Promise((r) => {
        i = window.setTimeout(() => r(!1), Op);
      });
      e = !!await Promise.race([t, n]), window.clearTimeout(i);
    } catch (t) {
      console.warn("The licensed score did not start.", t);
    }
    if (!e) {
      this.root.dataset.audioRequest = "off", this.audio?.disable?.({ persist: !1 }), this.audioReady = !1, this.disableSoundControl(), this.activateFallback("Music could not start"), this.announce("Music could not start. The static evidence edition is available."), document.querySelector("main")?.focus?.({ preventScroll: !0 });
      return;
    }
    this.entered = !0, this.entry.dataset.entryState = "dismissing", this.entry.setAttribute("aria-hidden", "true"), this.world?.setEntered(!0), this.world?.ensureComparisonEvidence(), window.setTimeout(() => {
      this.entry.dataset.entryState = "dismissed", this.releaseEntryLock(), document.querySelector("main")?.focus?.({ preventScroll: !0 });
    }, Fp);
  }
  measureActiveScroll() {
    const e = window.innerHeight * 0.5;
    let t = 0, i = 1 / 0;
    const n = this.beatNodes.map((s, a) => {
      if (!s) return {
        index: a,
        top: 0,
        height: 1,
        center: 0
      };
      const o = s.getBoundingClientRect(), c = o.top + o.height * 0.5, l = Math.abs(c - e);
      return l < i && (i = l, t = a), {
        index: a,
        top: o.top,
        height: Math.max(1, o.height),
        center: c
      };
    })[t], r = Nt((e - n.top) / n.height);
    return this.activeIndex = t, this.activeProgress = r, {
      beat: yt[t] || "control",
      index: t,
      progress: r
    };
  }
  commitMeasuredScene(e, t, i = !1) {
    !e || e !== this.world || (e.setScene(t.beat, t.progress, i), e.setCameraJourney(t.index, t.progress), i && (e.camera.position.copy(e.cameraDesired), e.cameraTarget.copy(e.targetDesired), e.camera.fov = e.fovDesired, e.camera.lookAt(e.cameraTarget), e.camera.updateProjectionMatrix()));
  }
  syncMeasuredFallback(e) {
    this.root.dataset.chamberActiveScene = e, this.root.dataset.worldActiveBeat = e, this.root.querySelectorAll("[data-world-fallback-frame]").forEach((t) => {
      const i = t.dataset.worldFallbackFrame === e;
      t.classList.toggle("is-active", i), t.setAttribute("aria-hidden", String(!i));
    });
  }
  requestMeasuredScene(e, t = !1) {
    const i = this.world;
    if (!i) {
      this.syncMeasuredFallback(e.beat);
      return;
    }
    if (!(e.beat === "comparison" || e.beat === "reconstruction" || e.beat === "archive") || e.beat === i.sceneName) {
      this.sceneRequestRevision += 1, this.pendingEvidenceScene = null, this.commitMeasuredScene(i, e, t);
      return;
    }
    if (this.pendingEvidenceScene?.world === i && this.pendingEvidenceScene.beat === e.beat) {
      var n;
      (n = this.pendingEvidenceScene).immediate || (n.immediate = t);
      return;
    }
    const r = {
      world: i,
      beat: e.beat,
      revision: ++this.sceneRequestRevision,
      immediate: t
    };
    this.pendingEvidenceScene = r, i.prepareSceneEvidence(e.beat).then(() => {
      if (this.pendingEvidenceScene !== r || r.revision !== this.sceneRequestRevision || i !== this.world || (yt[this.activeIndex] || "control") !== r.beat) return;
      const s = {
        beat: r.beat,
        index: this.activeIndex,
        progress: this.activeProgress
      };
      this.pendingEvidenceScene = null, this.commitMeasuredScene(i, s, r.immediate);
    }).catch((s) => {
      this.pendingEvidenceScene === r && (this.pendingEvidenceScene = null), !this.fallback && i === this.world && console.warn(`${e.beat} scene remained hidden because exact evidence was unavailable.`, s);
    });
  }
  restoreMeasuredScene() {
    this.requestMeasuredScene(this.measureActiveScroll(), !0);
  }
  sampleScroll() {
    this.requestMeasuredScene(this.measureActiveScroll());
  }
  scheduleVariantReload() {
    const e = this.compactMedia.matches ? "mobile" : "desktop";
    if (clearTimeout(this.reloadTimer), e === this.variantName) {
      if (this.pendingWorlds.size) {
        this.worldLoadRevision += 1;
        for (const t of this.pendingWorlds) t.destroy();
        this.pendingWorlds.clear();
      }
      return;
    }
    !this.manifest || !this.worldReady || this.fallback || (this.reloadTimer = window.setTimeout(async () => {
      const t = this.compactMedia.matches ? "mobile" : "desktop";
      if (t !== e) {
        this.scheduleVariantReload();
        return;
      }
      try {
        if (!await this.loadWorld(t)) return;
        this.sampleScroll(), this.world?.setEntered(this.entered, !1), this.start();
      } catch (i) {
        console.warn(`The ${t} world could not replace the active world.`, i), this.root.dataset.worldVariant = this.variantName;
        const n = this.viewport.getBoundingClientRect();
        this.world?.resize(Math.max(1, n.width), Math.max(1, n.height)), this.announce("The current view remains available."), this.start();
      }
    }, 320));
  }
  start() {
    if (this.running || this.destroyed || document.hidden || !this.world || !this.renderer) return;
    this.running = !0, this.lastFrame = performance.now();
    const e = (t) => {
      if (!this.running || this.destroyed) return;
      const i = Math.min(0.05, Math.max(1e-3, (t - this.lastFrame) / 1e3));
      this.lastFrame = t, this.elapsed += i, this.world && this.renderer && (this.world.update(i, this.elapsed), this.world.render()), this.raf = requestAnimationFrame(e);
    };
    this.raf = requestAnimationFrame(e);
  }
  stop() {
    this.running = !1, cancelAnimationFrame(this.raf), this.raf = 0;
  }
  destroy() {
    if (!this.destroyed) {
      this.destroyed = !0, this.invalidateWorldLoads(), this.stop(), cancelAnimationFrame(this.pointerFrame), clearTimeout(this.reloadTimer), this.abortController.abort(), this.resizeObserver?.disconnect(), this.releaseEntryLock(), this.audio?.destroy?.(), this.world?.destroy(), this.world = null, this.releaseRenderer();
      for (const e of this.cleanupCallbacks) e();
    }
  }
}, Hs = document.querySelector("[data-chamber]");
if (Hs) {
  const e = new sm(Hs);
  e.boot().catch((t) => {
    console.error("The Atlas chamber could not start.", t), e.activateFallback(t?.message || "Boot failed"), e.audioSettled = !0, e.audioReady = !!e.audio?.available, e.commitReady(), e.maybeEnableEntry(), e.start();
  }), Hs.__atlasDirector = e;
}
