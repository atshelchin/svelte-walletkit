!(function (e) {
	'function' == typeof define && define.amd ? define(e) : e();
})(function () {
	'use strict';
	var e,
		t,
		n,
		o,
		i,
		s,
		r,
		l,
		a,
		c,
		u,
		d,
		f,
		v,
		p,
		g,
		h,
		w,
		m,
		b,
		k,
		x,
		y = Object.defineProperty,
		_ = (e) => {
			throw TypeError(e);
		},
		C = (e, t, n) =>
			((e, t, n) =>
				t in e
					? y(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
					: (e[t] = n))(e, 'symbol' != typeof t ? t + '' : t, n),
		E = (e, t, n) => t.has(e) || _('Cannot ' + n),
		M = (e, t, n) => (E(e, t, 'read from private field'), n ? n.call(e) : t.get(e)),
		S = (e, t, n) =>
			t.has(e)
				? _('Cannot add the same private member more than once')
				: t instanceof WeakSet
					? t.add(e)
					: t.set(e, n),
		W = (e, t, n, o) => (E(e, t, 'write to private field'), o ? o.call(e, n) : t.set(e, n), n),
		A = (e, t, n) => (E(e, t, 'access private method'), n);
	const L = !1;
	var P = Array.isArray,
		z = Array.prototype.indexOf,
		D = Array.from,
		O = Object.defineProperty,
		j = Object.getOwnPropertyDescriptor,
		I = Object.getOwnPropertyDescriptors,
		T = Object.prototype,
		N = Array.prototype,
		B = Object.getPrototypeOf,
		Y = Object.isExtensible;
	const q = 32,
		H = 64,
		R = 256,
		$ = 512,
		V = 1024,
		Z = 2048,
		K = 4096,
		X = 8192,
		F = 16384,
		U = 32768,
		G = 65536,
		J = 1 << 17,
		Q = 1 << 19,
		ee = 1 << 20,
		te = 1 << 21,
		ne = 1 << 22,
		oe = 1 << 23,
		ie = Symbol('$state'),
		se = new (class extends Error {
			constructor() {
				(super(...arguments),
					C(this, 'name', 'StaleReactionError'),
					C(
						this,
						'message',
						'The reaction that called `getAbortSignal()` was re-run or destroyed'
					));
			}
		})();
	const re = Symbol();
	function le(e) {
		return e === this.v;
	}
	let ae = null;
	function ce(e) {
		ae = e;
	}
	function ue(e, t = !1, n) {
		ae = { p: ae, c: null, e: null, s: e, x: null, l: null };
	}
	function de(e) {
		var t = ae,
			n = t.e;
		if (null !== n) for (var o of ((t.e = null), n)) tt(o);
		return (void 0 !== e && (t.x = e), (ae = t.p), e ?? {});
	}
	const fe = new WeakMap();
	function ve(e, t) {
		for (; null !== t; ) {
			if (128 & t.f)
				try {
					return void t.b.error(e);
				} catch (n) {
					e = n;
				}
			t = t.parent;
		}
		throw (e instanceof Error && pe(e), e);
	}
	function pe(e) {
		const t = fe.get(e);
		t && (O(e, 'message', { value: t.message }), O(e, 'stack', { value: t.stack }));
	}
	function ge() {
		for (var e = kt.b; null !== e && !e.has_pending_snippet(); ) e = e.parent;
		return (
			null === e &&
				(function () {
					throw new Error('https://svelte.dev/e/await_outside_boundary');
				})(),
			e
		);
	}
	function he(e) {
		var t = 2050,
			n = null !== wt && 2 & wt.f ? wt : null;
		null === kt || (null !== n && 0 !== (n.f & R)) ? (t |= R) : (kt.f |= Q);
		return {
			ctx: ae,
			deps: null,
			effects: null,
			equals: le,
			f: t,
			fn: e,
			reactions: null,
			rv: 0,
			v: re,
			wv: 0,
			parent: n ?? kt,
			ac: null
		};
	}
	function we(e, t) {
		let n = kt;
		null === n &&
			(function () {
				throw new Error('https://svelte.dev/e/async_derived_orphan');
			})();
		var o = n.b,
			i = void 0,
			s = Te(re),
			r = null,
			l = !wt;
		return (
			(function (e) {
				et(4718592, e, !0);
			})(() => {
				try {
					var t = e();
				} catch (d) {
					t = Promise.reject(d);
				}
				var n = () => t;
				((i = r?.then(n, n) ?? Promise.resolve(t)), (r = i));
				var a = Ce,
					c = o.pending;
				l && (o.update_pending_count(1), c || a.increment());
				const u = (e, t = void 0) => {
					((r = null),
						c || a.activate(),
						t ? t !== se && ((s.f |= oe), Ye(s, t)) : (0 !== (s.f & oe) && (s.f ^= oe), Ye(s, e)),
						l && (o.update_pending_count(-1), c || a.decrement()),
						ye());
				};
				if ((i.then(u, (e) => u(null, e || 'unknown')), a))
					return () => {
						queueMicrotask(() => a.neuter());
					};
			}),
			new Promise((e) => {
				!(function t(n) {
					function o() {
						n === i ? e(s) : t(i);
					}
					n.then(o, o);
				})(i);
			})
		);
	}
	function me(e) {
		var t = e.effects;
		if (null !== t) {
			e.effects = null;
			for (var n = 0; n < t.length; n += 1) lt(t[n]);
		}
	}
	function be(e) {
		var t,
			n = kt;
		xt(
			(function (e) {
				for (var t = e.parent; null !== t; ) {
					if (!(2 & t.f)) return t;
					t = t.parent;
				}
				return null;
			})(e)
		);
		try {
			(me(e), (t = Ot(e)));
		} finally {
			xt(n);
		}
		return t;
	}
	function ke(e) {
		var t = be(e);
		(e.equals(t) || ((e.v = t), (e.wv = Pt())), gt) ||
			(null !== Ee ? Ee.set(e, e.v) : qt(e, (!Lt && 0 === (e.f & R)) || null === e.deps ? V : K));
	}
	function xe(e, t, n) {
		const o = he;
		if (0 !== t.length) {
			var i,
				s,
				r,
				l = Ce,
				a = kt,
				c =
					((i = kt),
					(s = wt),
					(r = ae),
					function () {
						(xt(i), bt(s), ce(r));
					}),
				u = ge();
			Promise.all(t.map((e) => we(e)))
				.then((t) => {
					(l?.activate(), c());
					try {
						n([...e.map(o), ...t]);
					} catch (i) {
						0 === (a.f & F) && ve(i, a);
					}
					(l?.deactivate(), ye());
				})
				.catch((e) => {
					u.error(e);
				});
		} else n(e.map(o));
	}
	function ye() {
		(xt(null), bt(null), ce(null));
	}
	const _e = new Set();
	let Ce = null,
		Ee = null,
		Me = new Set(),
		Se = [];
	function We() {
		const e = Se.shift();
		(Se.length > 0 && queueMicrotask(We), e());
	}
	let Ae = [],
		Le = null,
		Pe = !1;
	((e = new WeakMap()),
		(t = new WeakMap()),
		(n = new WeakMap()),
		(o = new WeakMap()),
		(i = new WeakMap()),
		(s = new WeakMap()),
		(r = new WeakMap()),
		(l = new WeakMap()),
		(a = new WeakMap()),
		(c = new WeakMap()),
		(u = new WeakMap()),
		(d = new WeakMap()),
		(f = new WeakSet()),
		(v = function (e) {
			e.f ^= V;
			for (var t = e.first; null !== t; ) {
				var n = t.f,
					o = !!(96 & n);
				if (
					!((o && 0 !== (n & V)) || 0 !== (n & X) || this.skipped_effects.has(t)) &&
					null !== t.fn
				) {
					if (o) t.f ^= V;
					else if (0 === (n & V))
						if (4 & n) M(this, a).push(t);
						else if (0 !== (n & ne)) {
							(t.b?.pending ? M(this, r) : M(this, s)).push(t);
						} else zt(t) && (16 & t.f && M(this, c).push(t), Tt(t));
					var i = t.first;
					if (null !== i) {
						t = i;
						continue;
					}
				}
				var l = t.parent;
				for (t = t.next; null === t && null !== l; ) ((t = l.next), (l = l.parent));
			}
		}),
		(p = function (e) {
			for (const t of e) {
				((0 !== (t.f & Z) ? M(this, u) : M(this, d)).push(t), qt(t, V));
			}
			e.length = 0;
		}),
		(g = function () {
			if (!M(this, i)) for (const e of M(this, t)) e();
			M(this, t).clear();
		}));
	let ze = class h {
		constructor() {
			(S(this, f),
				C(this, 'current', new Map()),
				S(this, e, new Map()),
				S(this, t, new Set()),
				S(this, n, 0),
				S(this, o, null),
				S(this, i, !1),
				S(this, s, []),
				S(this, r, []),
				S(this, l, []),
				S(this, a, []),
				S(this, c, []),
				S(this, u, []),
				S(this, d, []),
				C(this, 'skipped_effects', new Set()));
		}
		process(t) {
			Ae = [];
			var i = null;
			if (_e.size > 1) {
				((i = new Map()), (Ee = new Map()));
				for (const [e, t] of this.current) (i.set(e, { v: e.v, wv: e.wv }), (e.v = t));
				for (const t of _e)
					if (t !== this)
						for (const [n, o] of M(t, e)) i.has(n) || (i.set(n, { v: n.v, wv: n.wv }), (n.v = o));
			}
			for (const e of t) A(this, f, v).call(this, e);
			if (0 === M(this, s).length && 0 === M(this, n)) {
				A(this, f, g).call(this);
				var u = M(this, l),
					d = M(this, a);
				(W(this, l, []),
					W(this, a, []),
					W(this, c, []),
					(Ce = null),
					Oe(u),
					Oe(d),
					null === Ce ? (Ce = this) : _e.delete(this),
					M(this, o)?.resolve());
			} else
				(A(this, f, p).call(this, M(this, l)),
					A(this, f, p).call(this, M(this, a)),
					A(this, f, p).call(this, M(this, c)));
			if (i) {
				for (const [e, { v: t, wv: n }] of i) e.wv <= n && (e.v = t);
				Ee = null;
			}
			for (const e of M(this, s)) Tt(e);
			for (const e of M(this, r)) Tt(e);
			(W(this, s, []), W(this, r, []));
		}
		capture(t, n) {
			(M(this, e).has(t) || M(this, e).set(t, n), this.current.set(t, t.v));
		}
		activate() {
			Ce = this;
		}
		deactivate() {
			Ce = null;
			for (const e of Me) if ((Me.delete(e), e(), null !== Ce)) break;
		}
		neuter() {
			W(this, i, !0);
		}
		flush() {
			(Ae.length > 0
				? (function () {
						var e = vt;
						Pe = !0;
						try {
							var t = 0;
							for (pt(!0); Ae.length > 0; ) {
								var n = ze.ensure();
								if (t++ > 1e3) (L, De());
								(n.process(Ae), Ie.clear());
							}
						} finally {
							((Pe = !1), pt(e), (Le = null));
						}
					})()
				: A(this, f, g).call(this),
				Ce === this && (0 === M(this, n) && _e.delete(this), this.deactivate()));
		}
		increment() {
			W(this, n, M(this, n) + 1);
		}
		decrement() {
			if ((W(this, n, M(this, n) - 1), 0 === M(this, n))) {
				for (const e of M(this, u)) (qt(e, Z), je(e));
				for (const e of M(this, d)) (qt(e, K), je(e));
				(W(this, l, []), W(this, a, []), this.flush());
			} else this.deactivate();
		}
		add_callback(e) {
			M(this, t).add(e);
		}
		settled() {
			return (
				M(this, o) ??
				W(this, o, {
					promise: new Promise((n, o) => {
						((e = n), (t = o));
					}),
					resolve: e,
					reject: t
				})
			).promise;
			var e, t;
		}
		static ensure() {
			if (null === Ce) {
				const e = (Ce = new h());
				(_e.add(Ce),
					h.enqueue(() => {
						Ce === e && e.flush();
					}));
			}
			return Ce;
		}
		static enqueue(e) {
			(0 === Se.length && queueMicrotask(We), Se.unshift(e));
		}
	};
	function De() {
		try {
			!(function () {
				throw new Error('https://svelte.dev/e/effect_update_depth_exceeded');
			})();
		} catch (e) {
			ve(e, Le);
		}
	}
	function Oe(e) {
		var t = e.length;
		if (0 !== t) {
			for (var n = 0; n < t; ) {
				var o = e[n++];
				if (!(24576 & o.f) && zt(o)) {
					var i = Ce ? Ce.current.size : 0;
					if (
						(Tt(o),
						null === o.deps &&
							null === o.first &&
							null === o.nodes_start &&
							(null === o.teardown && null === o.ac ? at(o) : (o.fn = null)),
						null !== Ce && Ce.current.size > i && 0 !== (o.f & ee))
					)
						break;
				}
			}
			for (; n < t; ) je(e[n++]);
		}
	}
	function je(e) {
		for (var t = (Le = e); null !== t.parent; ) {
			var n = (t = t.parent).f;
			if (Pe && t === kt && 16 & n) return;
			if (96 & n) {
				if (0 === (n & V)) return;
				t.f ^= V;
			}
		}
		Ae.push(t);
	}
	const Ie = new Map();
	function Te(e, t) {
		return { f: 0, v: e, reactions: null, equals: le, rv: 0, wv: 0 };
	}
	function Ne(e, t) {
		const n = Te(e);
		var o;
		return ((o = n), null !== wt && (null === yt ? (yt = [o]) : yt.push(o)), n);
	}
	function Be(e, t, n = !1) {
		return (
			null === wt ||
				(mt && 0 === (wt.f & J)) ||
				!(4325394 & wt.f) ||
				yt?.includes(e) ||
				(function () {
					throw new Error('https://svelte.dev/e/state_unsafe_mutation');
				})(),
			Ye(e, n ? Re(t) : t)
		);
	}
	function Ye(e, t) {
		if (!e.equals(t)) {
			var n = e.v;
			(gt ? Ie.set(e, t) : Ie.set(e, n),
				(e.v = t),
				ze.ensure().capture(e, n),
				2 & e.f && (0 !== (e.f & Z) && be(e), qt(e, 0 === (e.f & R) ? V : K)),
				(e.wv = Pt()),
				He(e, Z),
				null === kt ||
					0 === (kt.f & V) ||
					96 & kt.f ||
					(null === Et
						? (function (e) {
								Et = e;
							})([e])
						: Et.push(e)));
		}
		return t;
	}
	function qe(e) {
		Be(e, e.v + 1);
	}
	function He(e, t) {
		var n = e.reactions;
		if (null !== n)
			for (var o = n.length, i = 0; i < o; i++) {
				var s = n[i],
					r = s.f,
					l = 0 === (r & Z);
				(l && qt(s, t), 2 & r ? He(s, K) : l && je(s));
			}
	}
	function Re(e) {
		if ('object' != typeof e || null === e || ie in e) return e;
		const t = B(e);
		if (t !== T && t !== N) return e;
		var n = new Map(),
			o = P(e),
			i = Ne(0),
			s = Wt,
			r = (e) => {
				if (Wt === s) return e();
				var t = wt,
					n = Wt;
				(bt(null), At(s));
				var o = e();
				return (bt(t), At(n), o);
			};
		return (
			o && n.set('length', Ne(e.length)),
			new Proxy(e, {
				defineProperty(e, t, o) {
					('value' in o && !1 !== o.configurable && !1 !== o.enumerable && !1 !== o.writable) ||
						(function () {
							throw new Error('https://svelte.dev/e/state_descriptors_fixed');
						})();
					var i = n.get(t);
					return (
						void 0 === i
							? (i = r(() => {
									var e = Ne(o.value);
									return (n.set(t, e), e);
								}))
							: Be(i, o.value, !0),
						!0
					);
				},
				deleteProperty(e, t) {
					var o = n.get(t);
					if (void 0 === o) {
						if (t in e) {
							const e = r(() => Ne(re));
							(n.set(t, e), qe(i));
						}
					} else (Be(o, re), qe(i));
					return !0;
				},
				get(t, o, i) {
					if (o === ie) return e;
					var s = n.get(o),
						l = o in t;
					if (
						(void 0 !== s ||
							(l && !j(t, o)?.writable) ||
							((s = r(() => Ne(Re(l ? t[o] : re)))), n.set(o, s)),
						void 0 !== s)
					) {
						var a = Nt(s);
						return a === re ? void 0 : a;
					}
					return Reflect.get(t, o, i);
				},
				getOwnPropertyDescriptor(e, t) {
					var o = Reflect.getOwnPropertyDescriptor(e, t);
					if (o && 'value' in o) {
						var i = n.get(t);
						i && (o.value = Nt(i));
					} else if (void 0 === o) {
						var s = n.get(t),
							r = s?.v;
						if (void 0 !== s && r !== re)
							return { enumerable: !0, configurable: !0, value: r, writable: !0 };
					}
					return o;
				},
				has(e, t) {
					if (t === ie) return !0;
					var o = n.get(t),
						i = (void 0 !== o && o.v !== re) || Reflect.has(e, t);
					if (
						(void 0 !== o || (null !== kt && (!i || j(e, t)?.writable))) &&
						(void 0 === o && ((o = r(() => Ne(i ? Re(e[t]) : re))), n.set(t, o)), Nt(o) === re)
					)
						return !1;
					return i;
				},
				set(e, t, s, l) {
					var a = n.get(t),
						c = t in e;
					if (o && 'length' === t)
						for (var u = s; u < a.v; u += 1) {
							var d = n.get(u + '');
							void 0 !== d ? Be(d, re) : u in e && ((d = r(() => Ne(re))), n.set(u + '', d));
						}
					void 0 === a
						? (c && !j(e, t)?.writable) || (Be((a = r(() => Ne(void 0))), Re(s)), n.set(t, a))
						: ((c = a.v !== re),
							Be(
								a,
								r(() => Re(s))
							));
					var f = Reflect.getOwnPropertyDescriptor(e, t);
					if ((f?.set && f.set.call(l, s), !c)) {
						if (o && 'string' == typeof t) {
							var v = n.get('length'),
								p = Number(t);
							Number.isInteger(p) && p >= v.v && Be(v, p + 1);
						}
						qe(i);
					}
					return !0;
				},
				ownKeys(e) {
					Nt(i);
					var t = Reflect.ownKeys(e).filter((e) => {
						var t = n.get(e);
						return void 0 === t || t.v !== re;
					});
					for (var [o, s] of n) s.v === re || o in e || t.push(o);
					return t;
				},
				setPrototypeOf() {
					!(function () {
						throw new Error('https://svelte.dev/e/state_prototype_fixed');
					})();
				}
			})
		);
	}
	var $e, Ve, Ze, Ke;
	function Xe(e = '') {
		return document.createTextNode(e);
	}
	function Fe(e) {
		return Ze.call(e);
	}
	function Ue(e) {
		return Ke.call(e);
	}
	function Ge(e, t) {
		return Fe(e);
	}
	function Je(e, t = 1, n = !1) {
		let o = e;
		for (; t--; ) o = Ue(o);
		return o;
	}
	function Qe(e) {
		(null === kt &&
			null === wt &&
			(function () {
				throw new Error('https://svelte.dev/e/effect_orphan');
			})(),
			null !== wt &&
				0 !== (wt.f & R) &&
				null === kt &&
				(function () {
					throw new Error('https://svelte.dev/e/effect_in_unowned_derived');
				})(),
			gt &&
				(function () {
					throw new Error('https://svelte.dev/e/effect_in_teardown');
				})());
	}
	function et(e, t, n, o = !0) {
		var i = kt;
		null !== i && 0 !== (i.f & X) && (e |= X);
		var s = {
			ctx: ae,
			deps: null,
			nodes_start: null,
			nodes_end: null,
			f: e | Z,
			first: null,
			fn: t,
			last: null,
			next: null,
			parent: i,
			b: i && i.b,
			prev: null,
			teardown: null,
			transitions: null,
			wv: 0,
			ac: null
		};
		if (n)
			try {
				(Tt(s), (s.f |= U));
			} catch (l) {
				throw (lt(s), l);
			}
		else null !== t && je(s);
		if (
			!(
				n &&
				null === s.deps &&
				null === s.first &&
				null === s.nodes_start &&
				null === s.teardown &&
				0 === (s.f & Q)
			) &&
			o &&
			(null !== i &&
				(function (e, t) {
					var n = t.last;
					null === n ? (t.last = t.first = e) : ((n.next = e), (e.prev = n), (t.last = e));
				})(s, i),
			null !== wt && 2 & wt.f && 0 === (e & H))
		) {
			var r = wt;
			(r.effects ?? (r.effects = [])).push(s);
		}
		return s;
	}
	function tt(e) {
		return et(1048580, e, !1);
	}
	function nt(e) {
		return et(4, e, !1);
	}
	function ot(e, t = [], n = []) {
		xe(t, n, (t) => {
			et(8, () => e(...t.map(Nt)), !0);
		});
	}
	function it(e, t = !0) {
		return et(q, e, !0, t);
	}
	function st(e) {
		var t = e.teardown;
		if (null !== t) {
			const e = gt,
				n = wt;
			(ht(!0), bt(null));
			try {
				t.call(null);
			} finally {
				(ht(e), bt(n));
			}
		}
	}
	function rt(e, t = !1) {
		var n = e.first;
		for (e.first = e.last = null; null !== n; ) {
			n.ac?.abort(se);
			var o = n.next;
			(0 !== (n.f & H) ? (n.parent = null) : lt(n, t), (n = o));
		}
	}
	function lt(e, t = !0) {
		var n = !1;
		((t || 262144 & e.f) &&
			null !== e.nodes_start &&
			null !== e.nodes_end &&
			(!(function (e, t) {
				for (; null !== e; ) {
					var n = e === t ? null : Ue(e);
					(e.remove(), (e = n));
				}
			})(e.nodes_start, e.nodes_end),
			(n = !0)),
			rt(e, t && !n),
			It(e, 0),
			qt(e, F));
		var o = e.transitions;
		if (null !== o) for (const s of o) s.stop();
		st(e);
		var i = e.parent;
		(null !== i && null !== i.first && at(e),
			(e.next =
				e.prev =
				e.teardown =
				e.ctx =
				e.deps =
				e.fn =
				e.nodes_start =
				e.nodes_end =
				e.ac =
					null));
	}
	function at(e) {
		var t = e.parent,
			n = e.prev,
			o = e.next;
		(null !== n && (n.next = o),
			null !== o && (o.prev = n),
			null !== t && (t.first === e && (t.first = o), t.last === e && (t.last = n)));
	}
	function ct(e, t) {
		var n = [];
		(ut(e, n, !0),
			(function (e, t) {
				var n = e.length;
				if (n > 0) {
					var o = () => --n || t();
					for (var i of e) i.out(o);
				} else t();
			})(n, () => {
				(lt(e), t && t());
			}));
	}
	function ut(e, t, n) {
		if (0 === (e.f & X)) {
			if (((e.f ^= X), null !== e.transitions))
				for (const o of e.transitions) (o.is_global || n) && t.push(o);
			for (var o = e.first; null !== o; ) {
				var i = o.next;
				(ut(o, t, !!(0 !== (o.f & G) || 0 !== (o.f & q)) && n), (o = i));
			}
		}
	}
	function dt(e) {
		ft(e, !0);
	}
	function ft(e, t) {
		if (0 !== (e.f & X)) {
			((e.f ^= X), 0 === (e.f & V) && (qt(e, Z), je(e)));
			for (var n = e.first; null !== n; ) {
				var o = n.next;
				(ft(n, !!(0 !== (n.f & G) || 0 !== (n.f & q)) && t), (n = o));
			}
			if (null !== e.transitions) for (const n of e.transitions) (n.is_global || t) && n.in();
		}
	}
	let vt = !1;
	function pt(e) {
		vt = e;
	}
	let gt = !1;
	function ht(e) {
		gt = e;
	}
	let wt = null,
		mt = !1;
	function bt(e) {
		wt = e;
	}
	let kt = null;
	function xt(e) {
		kt = e;
	}
	let yt = null;
	let _t = null,
		Ct = 0,
		Et = null;
	let Mt = 1,
		St = 0,
		Wt = St;
	function At(e) {
		Wt = e;
	}
	let Lt = !1;
	function Pt() {
		return ++Mt;
	}
	function zt(e) {
		var t = e.f;
		if (0 !== (t & Z)) return !0;
		if (0 !== (t & K)) {
			var n = e.deps,
				o = 0 !== (t & R);
			if (null !== n) {
				var i,
					s,
					r = 0 !== (t & $),
					l = o && null !== kt && !Lt,
					a = n.length;
				if ((r || l) && (null === kt || 0 === (kt.f & F))) {
					var c = e,
						u = c.parent;
					for (i = 0; i < a; i++)
						((s = n[i]),
							(!r && s?.reactions?.includes(c)) || (s.reactions ?? (s.reactions = [])).push(c));
					(r && (c.f ^= $), l && null !== u && 0 === (u.f & R) && (c.f ^= R));
				}
				for (i = 0; i < a; i++) if ((zt((s = n[i])) && ke(s), s.wv > e.wv)) return !0;
			}
			(o && (null === kt || Lt)) || qt(e, V);
		}
		return !1;
	}
	function Dt(e, t, n = !0) {
		var o = e.reactions;
		if (null !== o && !yt?.includes(e))
			for (var i = 0; i < o.length; i++) {
				var s = o[i];
				2 & s.f ? Dt(s, t, !1) : t === s && (n ? qt(s, Z) : 0 !== (s.f & V) && qt(s, K), je(s));
			}
	}
	function Ot(e) {
		var t,
			n = _t,
			o = Ct,
			i = Et,
			s = wt,
			r = Lt,
			l = yt,
			a = ae,
			c = mt,
			u = Wt,
			d = e.f;
		((_t = null),
			(Ct = 0),
			(Et = null),
			(Lt = 0 !== (d & R) && (mt || !vt || null === wt)),
			(wt = 96 & d ? null : e),
			(yt = null),
			ce(e.ctx),
			(mt = !1),
			(Wt = ++St),
			null !== e.ac && (e.ac.abort(se), (e.ac = null)));
		try {
			e.f |= te;
			var f = (0, e.fn)(),
				v = e.deps;
			if (null !== _t) {
				var p;
				if ((It(e, Ct), null !== v && Ct > 0))
					for (v.length = Ct + _t.length, p = 0; p < _t.length; p++) v[Ct + p] = _t[p];
				else e.deps = v = _t;
				if (!Lt || (2 & d && null !== e.reactions))
					for (p = Ct; p < v.length; p++) ((t = v[p]).reactions ?? (t.reactions = [])).push(e);
			} else null !== v && Ct < v.length && (It(e, Ct), (v.length = Ct));
			if (!(null === Et || mt || null === v || 6146 & e.f))
				for (p = 0; p < Et.length; p++) Dt(Et[p], e);
			return (
				null !== s && s !== e && (St++, null !== Et && (null === i ? (i = Et) : i.push(...Et))),
				0 !== (e.f & oe) && (e.f ^= oe),
				f
			);
		} catch (g) {
			return (function (e) {
				var t = kt;
				if (null === t) return ((wt.f |= oe), e);
				if (0 === (t.f & U)) {
					if (!(128 & t.f)) throw (!t.parent && e instanceof Error && pe(e), e);
					t.b.error(e);
				} else ve(e, t);
			})(g);
		} finally {
			((e.f ^= te),
				(_t = n),
				(Ct = o),
				(Et = i),
				(wt = s),
				(Lt = r),
				(yt = l),
				ce(a),
				(mt = c),
				(Wt = u));
		}
	}
	function jt(e, t) {
		let n = t.reactions;
		if (null !== n) {
			var o = z.call(n, e);
			if (-1 !== o) {
				var i = n.length - 1;
				0 === i ? (n = t.reactions = null) : ((n[o] = n[i]), n.pop());
			}
		}
		null === n &&
			2 & t.f &&
			(null === _t || !_t.includes(t)) &&
			(qt(t, K), 768 & t.f || (t.f ^= $), me(t), It(t, 0));
	}
	function It(e, t) {
		var n = e.deps;
		if (null !== n) for (var o = t; o < n.length; o++) jt(e, n[o]);
	}
	function Tt(e) {
		var t = e.f;
		if (0 === (t & F)) {
			qt(e, V);
			var n = kt,
				o = vt;
			((kt = e), (vt = !0));
			try {
				(16 & t
					? (function (e) {
							for (var t = e.first; null !== t; ) {
								var n = t.next;
								(0 === (t.f & q) && lt(t), (t = n));
							}
						})(e)
					: rt(e),
					st(e));
				var i = Ot(e);
				((e.teardown = 'function' == typeof i ? i : null), (e.wv = Mt));
			} finally {
				((vt = o), (kt = n));
			}
		}
	}
	function Nt(e) {
		var t = !!(2 & e.f);
		if (null === wt || mt) {
			if (t && null === e.deps && null === e.effects) {
				var n = e,
					o = n.parent;
				null !== o && 0 === (o.f & R) && (n.f ^= R);
			}
		} else if (!(null !== kt && 0 !== (kt.f & F)) && !yt?.includes(e)) {
			var i = wt.deps;
			if (0 !== (wt.f & te))
				e.rv < St &&
					((e.rv = St),
					null === _t && null !== i && i[Ct] === e
						? Ct++
						: null === _t
							? (_t = [e])
							: (Lt && _t.includes(e)) || _t.push(e));
			else {
				(wt.deps ?? (wt.deps = [])).push(e);
				var s = e.reactions;
				null === s ? (e.reactions = [wt]) : s.includes(wt) || s.push(wt);
			}
		}
		if (gt) {
			if (Ie.has(e)) return Ie.get(e);
			if (t) {
				var r = (n = e).v;
				return (
					((0 === (n.f & V) && null !== n.reactions) || Bt(n)) && (r = be(n)),
					Ie.set(n, r),
					r
				);
			}
		} else if (t) {
			if (((n = e), Ee?.has(n))) return Ee.get(n);
			zt(n) && ke(n);
		}
		if (0 !== (e.f & oe)) throw e.v;
		return e.v;
	}
	function Bt(e) {
		if (e.v === re) return !0;
		if (null === e.deps) return !1;
		for (const t of e.deps) {
			if (Ie.has(t)) return !0;
			if (2 & t.f && Bt(t)) return !0;
		}
		return !1;
	}
	const Yt = -7169;
	function qt(e, t) {
		e.f = (e.f & Yt) | t;
	}
	function Ht(e, t = new Set()) {
		if (!('object' != typeof e || null === e || e instanceof EventTarget || t.has(e))) {
			(t.add(e), e instanceof Date && e.getTime());
			for (let i in e)
				try {
					Ht(e[i], t);
				} catch (n) {}
			const o = B(e);
			if (
				o !== Object.prototype &&
				o !== Array.prototype &&
				o !== Map.prototype &&
				o !== Set.prototype &&
				o !== Date.prototype
			) {
				const t = I(o);
				for (let o in t) {
					const i = t[o].get;
					if (i)
						try {
							i.call(e);
						} catch (n) {}
				}
			}
		}
	}
	const Rt = ['touchstart', 'touchmove'];
	function $t(e) {
		return Rt.includes(e);
	}
	const Vt = new Set(),
		Zt = new Set();
	function Kt(e) {
		for (var t = 0; t < e.length; t++) Vt.add(e[t]);
		for (var n of Zt) n(e);
	}
	let Xt = null;
	function Ft(e) {
		var t = this,
			n = t.ownerDocument,
			o = e.type,
			i = e.composedPath?.() || [],
			s = i[0] || e.target;
		Xt = e;
		var r = 0,
			l = Xt === e && e.__root;
		if (l) {
			var a = i.indexOf(l);
			if (-1 !== a && (t === document || t === window)) return void (e.__root = t);
			var c = i.indexOf(t);
			if (-1 === c) return;
			a <= c && (r = a);
		}
		if ((s = i[r] || e.target) !== t) {
			O(e, 'currentTarget', { configurable: !0, get: () => s || n });
			var u = wt,
				d = kt;
			(bt(null), xt(null));
			try {
				for (var f, v = []; null !== s; ) {
					var p = s.assignedSlot || s.parentNode || s.host || null;
					try {
						var g = s['__' + o];
						if (null != g && (!s.disabled || e.target === s))
							if (P(g)) {
								var [h, ...w] = g;
								h.apply(s, [e, ...w]);
							} else g.call(s, e);
					} catch (m) {
						f ? v.push(m) : (f = m);
					}
					if (e.cancelBubble || p === t || null === p) break;
					s = p;
				}
				if (f) {
					for (let e of v)
						queueMicrotask(() => {
							throw e;
						});
					throw f;
				}
			} finally {
				((e.__root = t), delete e.currentTarget, bt(u), xt(d));
			}
		}
	}
	function Ut(e, t) {
		var n = kt;
		null === n.nodes_start && ((n.nodes_start = e), (n.nodes_end = t));
	}
	function Gt(e, t) {
		var n,
			o = !!(1 & t),
			i = !!(2 & t),
			s = !e.startsWith('<!>');
		return () => {
			var t, r;
			void 0 === n &&
				((t = s ? e : '<!>' + e),
				((r = document.createElement('template')).innerHTML = t.replaceAll('<!>', '\x3c!----\x3e')),
				(n = r.content),
				o || (n = Fe(n)));
			var l = i || Ve ? document.importNode(n, !0) : n.cloneNode(!0);
			o ? Ut(Fe(l), l.lastChild) : Ut(l, l);
			return l;
		};
	}
	function Jt(e, t) {
		null !== e && e.before(t);
	}
	function Qt(e, t) {
		var n = null == t ? '' : 'object' == typeof t ? t + '' : t;
		n !== (e.__t ?? (e.__t = e.nodeValue)) && ((e.__t = n), (e.nodeValue = n + ''));
	}
	function en(e, t) {
		return (function (
			e,
			{ target: t, anchor: n, props: o = {}, events: i, context: s, intro: r = !0 }
		) {
			!(function () {
				if (void 0 === $e) {
					(($e = window), (Ve = /Firefox/.test(navigator.userAgent)));
					var e = Element.prototype,
						t = Node.prototype,
						n = Text.prototype;
					((Ze = j(t, 'firstChild').get),
						(Ke = j(t, 'nextSibling').get),
						Y(e) &&
							((e.__click = void 0),
							(e.__className = void 0),
							(e.__attributes = null),
							(e.__style = void 0),
							(e.__e = void 0)),
						Y(n) && (n.__t = void 0));
				}
			})();
			var l = new Set(),
				a = (e) => {
					for (var n = 0; n < e.length; n++) {
						var o = e[n];
						if (!l.has(o)) {
							l.add(o);
							var i = $t(o);
							t.addEventListener(o, Ft, { passive: i });
							var s = tn.get(o);
							void 0 === s
								? (document.addEventListener(o, Ft, { passive: i }), tn.set(o, 1))
								: tn.set(o, s + 1);
						}
					}
				};
			(a(D(Vt)), Zt.add(a));
			var c = void 0,
				u = (function (e) {
					ze.ensure();
					const t = et(H, e, !0);
					return (e = {}) =>
						new Promise((n) => {
							e.outro
								? ct(t, () => {
										(lt(t), n(void 0));
									})
								: (lt(t), n(void 0));
						});
				})(() => {
					var r = n ?? t.appendChild(Xe());
					return (
						it(() => {
							s && (ue({}), (ae.c = s));
							(i && (o.$$events = i), (c = e(r, o) || {}), s && de());
						}),
						() => {
							for (var e of l) {
								t.removeEventListener(e, Ft);
								var o = tn.get(e);
								0 === --o ? (document.removeEventListener(e, Ft), tn.delete(e)) : tn.set(e, o);
							}
							(Zt.delete(a), r !== n && r.parentNode?.removeChild(r));
						}
					);
				});
			return (nn.set(c, u), c);
		})(e, t);
	}
	const tn = new Map();
	let nn = new WeakMap();
	function on(e, t, n = !1) {
		var o = e,
			i = null,
			s = null,
			r = re,
			l = !1;
		const a = (e, t = !0) => {
			((l = !0), d(t, e));
		};
		var c = null;
		function u() {
			null !== c && (c.lastChild.remove(), o.before(c), (c = null));
			var e = r ? i : s,
				t = r ? s : i;
			(e && dt(e),
				t &&
					ct(t, () => {
						r ? (s = null) : (i = null);
					}));
		}
		const d = (e, t) => {
			if (r !== (r = e)) {
				var n = !1,
					l = o;
				(n, r ? (i ?? (i = t && it(() => t(l)))) : (s ?? (s = t && it(() => t(l)))), u());
			}
		};
		!(function (e, t = 0) {
			et(16 | t, e, !0);
		})(
			() => {
				((l = !1), t(a), l || d(null, null));
			},
			n ? G : 0
		);
	}
	function sn(e, t) {
		nt(() => {
			var n = e.getRootNode(),
				o = n.host ? n : (n.head ?? n.ownerDocument.head);
			if (!o.querySelector('#' + t.hash)) {
				const e = document.createElement('style');
				((e.id = t.hash), (e.textContent = t.code), o.appendChild(e));
			}
		});
	}
	function rn(e, t, n) {
		nt(() => {
			var o = (function (e) {
				var t = mt;
				try {
					return ((mt = !0), e());
				} finally {
					mt = t;
				}
			})(() => t(e, n?.()) || {});
			if (n && o?.update) {
				var i = !1,
					s = {};
				(!(function (e, t = 0) {
					et(8 | t, e, !0);
				})(() => {
					var e,
						t,
						r = n();
					(!(function (e) {
						if ('object' == typeof e && e && !(e instanceof EventTarget))
							if (ie in e) Ht(e);
							else if (!Array.isArray(e))
								for (let t in e) {
									const n = e[t];
									'object' == typeof n && n && ie in n && Ht(n);
								}
					})(r),
						i &&
							((t = r),
							(e = s) != e
								? t == t
								: e !== t || (null !== e && 'object' == typeof e) || 'function' == typeof e) &&
							((s = r), o.update(r)));
				}),
					(i = !0));
			}
			if (o?.destroy) return () => o.destroy();
		});
	}
	const ln = [...' \t\n\r\f \v\ufeff'];
	function an(e, t, n, o, i, s) {
		var r = e.__className;
		if (r !== n || void 0 === r) {
			var l = (function (e, t, n) {
				var o = null == e ? '' : '' + e;
				if (n)
					for (var i in n)
						if (n[i]) o = o ? o + ' ' + i : i;
						else if (o.length)
							for (var s = i.length, r = 0; (r = o.indexOf(i, r)) >= 0; ) {
								var l = r + s;
								(0 !== r && !ln.includes(o[r - 1])) || (l !== o.length && !ln.includes(o[l]))
									? (r = l)
									: (o = (0 === r ? '' : o.substring(0, r)) + o.substring(l + 1));
							}
				return '' === o ? null : o;
			})(n, 0, s);
			(null == l ? e.removeAttribute('class') : (e.className = l), (e.__className = n));
		} else if (s && i !== s)
			for (var a in s) {
				var c = !!s[a];
				(null != i && c === !!i[a]) || e.classList.toggle(a, c);
			}
		return s;
	}
	'undefined' != typeof window &&
		((h = window.__svelte ?? (window.__svelte = {})).v ?? (h.v = new Set())).add('5');
	((w = new WeakMap()),
		(m = new WeakMap()),
		(b = new WeakMap()),
		(k = new WeakMap()),
		(x = new WeakMap()));
	const cn = new (class {
		constructor() {
			(S(this, w, Ne(null)),
				S(this, m, Ne(1)),
				S(this, b, Ne(!1)),
				S(this, k, Ne('0.00')),
				S(this, x, Ne(Re({ isActive: !1, plan: null, expiresAt: null }))));
		}
		get address() {
			return Nt(M(this, w));
		}
		set address(e) {
			Be(M(this, w), e, !0);
		}
		get chainId() {
			return Nt(M(this, m));
		}
		set chainId(e) {
			Be(M(this, m), e, !0);
		}
		get isConnecting() {
			return Nt(M(this, b));
		}
		set isConnecting(e) {
			Be(M(this, b), e, !0);
		}
		get balance() {
			return Nt(M(this, k));
		}
		set balance(e) {
			Be(M(this, k), e, !0);
		}
		get subscription() {
			return Nt(M(this, x));
		}
		set subscription(e) {
			Be(M(this, x), e, !0);
		}
		get isConnected() {
			return null !== this.address;
		}
		get displayAddress() {
			return this.address
				? `${this.address.substring(0, 6)}...${this.address.substring(this.address.length - 4)}`
				: '';
		}
		async connect() {
			((this.isConnecting = !0),
				await new Promise((e) => setTimeout(e, 1e3)),
				(this.address = '0x' + Math.random().toString(16).substring(2, 42)),
				(this.chainId = 1),
				(this.balance = (10 * Math.random()).toFixed(2)),
				(this.isConnecting = !1),
				this.emitEvent('connected', { address: this.address, chainId: this.chainId }));
		}
		disconnect() {
			((this.address = null), (this.balance = '0.00'), this.emitEvent('disconnected'));
		}
		async checkSubscription() {
			return this.subscription;
		}
		async purchaseSubscription(e) {
			((this.subscription = {
				isActive: !0,
				plan: '1' === e ? 'Basic' : 'Pro',
				expiresAt: Date.now() + 2592e6
			}),
				this.emitEvent('subscriptionChanged', {
					status: 'active',
					isActive: !0,
					plan: this.subscription.plan
				}));
		}
		emitEvent(e, t) {
			'undefined' != typeof window &&
				window.dispatchEvent(new CustomEvent(`walletkit:${e}`, { detail: t }));
		}
	})();
	async function un() {
		await cn.connect();
	}
	function dn() {
		cn.disconnect();
	}
	var fn = Gt(
			'<div class="wk-not-connected svelte-mouog2"><div class="wk-icon-wallet svelte-mouog2"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor"></path></svg></div> <h4 class="svelte-mouog2">Connect Your Wallet</h4> <p class="svelte-mouog2">Connect your wallet to access all features</p> <button class="wk-connect-btn svelte-mouog2"> </button></div>'
		),
		vn = Gt(
			'<div class="wk-connected svelte-mouog2"><div class="wk-account-info svelte-mouog2"><div class="wk-account-avatar svelte-mouog2"></div> <div class="wk-account-details"><div class="wk-account-address svelte-mouog2"> </div> <div class="wk-account-balance svelte-mouog2"> </div></div></div> <button class="wk-disconnect-btn svelte-mouog2">Disconnect</button></div> <div class="wk-network-section svelte-mouog2"><div class="wk-section-title svelte-mouog2">Network</div> <div class="wk-network-selector svelte-mouog2"><div class="wk-current-network svelte-mouog2"><span class="wk-network-dot svelte-mouog2"></span> <span>Ethereum Mainnet</span></div></div></div>',
			1
		),
		pn = (e, t) => Be(t, !0),
		gn = Gt(
			'<div class="wk-subscription-status svelte-mouog2"><div class="wk-subscription-icon svelte-mouog2">⭐</div> <h4 class="svelte-mouog2">No Active Subscription</h4> <p class="svelte-mouog2">Subscribe to unlock premium features</p> <button class="wk-subscribe-btn svelte-mouog2">View Plans</button></div>'
		),
		hn = Gt(
			'<div class="wk-subscription-active svelte-mouog2"><div class="wk-subscription-badge svelte-mouog2"> </div> <div class="wk-subscription-details svelte-mouog2"><div class="svelte-mouog2"> </div> <button class="wk-manage-btn svelte-mouog2">Manage Subscription</button></div></div>'
		),
		wn = (e, t) => Be(t, !1),
		mn = (e, t) => t('1'),
		bn = (e, t) => t('2'),
		kn = Gt(
			'<div class="wk-plans-modal svelte-mouog2"><button class="wk-back-btn svelte-mouog2">← Back</button> <div class="wk-plans-grid svelte-mouog2"><div class="wk-plan-card svelte-mouog2"><h4 class="svelte-mouog2">Basic</h4> <div class="wk-plan-price svelte-mouog2">0.01 ETH/month</div> <ul class="wk-plan-features svelte-mouog2"><li class="svelte-mouog2">✓ Basic features</li> <li class="svelte-mouog2">✓ 10 API calls/day</li></ul> <button class="wk-plan-select svelte-mouog2">Select Basic</button></div> <div class="wk-plan-card wk-plan-featured svelte-mouog2"><div class="wk-plan-badge svelte-mouog2">POPULAR</div> <h4 class="svelte-mouog2">Pro</h4> <div class="wk-plan-price svelte-mouog2">0.05 ETH/month</div> <ul class="wk-plan-features svelte-mouog2"><li class="svelte-mouog2">✓ All features</li> <li class="svelte-mouog2">✓ Unlimited API calls</li> <li class="svelte-mouog2">✓ Priority support</li></ul> <button class="wk-plan-select svelte-mouog2">Select Pro</button></div></div></div>'
		),
		xn = Gt(
			'<div><div class="wk-panel-header svelte-mouog2"><h3 class="svelte-mouog2">Account Center</h3> <button class="wk-close-btn svelte-mouog2">×</button></div> <div class="wk-panel-body svelte-mouog2"><div class="wk-section svelte-mouog2"><!></div> <div class="wk-section svelte-mouog2"><div class="wk-section-title svelte-mouog2">Subscription</div> <!> <!></div></div></div>'
		);
	const yn = {
		hash: 'svelte-mouog2',
		code: '.wk-panel.svelte-mouog2 {position:absolute;bottom:80px;width:380px;background:white;border-radius:16px;box-shadow:0 20px 60px rgba(0, 0, 0, 0.3);display:flex;flex-direction:column;max-height:600px;\n    animation: svelte-mouog2-slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);}.wk-panel.wk-panel-left.svelte-mouog2 {right:auto;left:0;}.wk-panel.wk-panel-right.svelte-mouog2 {left:auto;right:0;}\n  \n  @keyframes svelte-mouog2-slideIn {\n    from {\n      opacity: 0;\n      transform: translateY(20px);\n    }\n    to {\n      opacity: 1;\n      transform: translateY(0);\n    }\n  }.wk-panel-header.svelte-mouog2 {padding:20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;}.wk-panel-header.svelte-mouog2 h3:where(.svelte-mouog2) {margin:0;font-size:18px;font-weight:600;color:#1f2937;}.wk-close-btn.svelte-mouog2 {background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all 0.2s;}.wk-close-btn.svelte-mouog2:hover {background:#f3f4f6;}.wk-panel-body.svelte-mouog2 {flex:1;overflow-y:auto;padding:20px;}.wk-section.svelte-mouog2 {margin-bottom:24px;}.wk-section.svelte-mouog2:last-child {margin-bottom:0;}.wk-section-title.svelte-mouog2 {font-size:14px;font-weight:600;color:#6b7280;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;}.wk-not-connected.svelte-mouog2 {text-align:center;padding:24px;background:#f9fafb;border-radius:12px;}.wk-icon-wallet.svelte-mouog2 {color:#6366f1;margin-bottom:16px;display:flex;justify-content:center;}.wk-not-connected.svelte-mouog2 h4:where(.svelte-mouog2) {margin:0 0 8px 0;font-size:16px;color:#1f2937;}.wk-not-connected.svelte-mouog2 p:where(.svelte-mouog2) {margin:0 0 16px 0;color:#6b7280;font-size:14px;}.wk-connect-btn.svelte-mouog2, .wk-subscribe-btn.svelte-mouog2, .wk-plan-select.svelte-mouog2 {background:linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);color:white;border:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.3s;}.wk-connect-btn.svelte-mouog2:hover:not(:disabled), \n  .wk-subscribe-btn.svelte-mouog2:hover, \n  .wk-plan-select.svelte-mouog2:hover {transform:translateY(-2px);box-shadow:0 4px 12px rgba(99, 102, 241, 0.3);}.wk-connect-btn.svelte-mouog2:disabled {opacity:0.6;cursor:not-allowed;}.wk-connected.svelte-mouog2 {padding:16px;background:#f9fafb;border-radius:12px;}.wk-account-info.svelte-mouog2 {display:flex;align-items:center;margin-bottom:16px;}.wk-account-avatar.svelte-mouog2 {width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);margin-right:12px;}.wk-account-address.svelte-mouog2 {font-family:monospace;font-size:14px;font-weight:600;color:#1f2937;}.wk-account-balance.svelte-mouog2 {color:#6b7280;font-size:14px;margin-top:4px;}.wk-disconnect-btn.svelte-mouog2, .wk-manage-btn.svelte-mouog2 {background:#e5e7eb;color:#374151;border:none;padding:8px 16px;border-radius:6px;font-size:14px;cursor:pointer;transition:all 0.2s;width:100%;}.wk-disconnect-btn.svelte-mouog2:hover, .wk-manage-btn.svelte-mouog2:hover {background:#d1d5db;}.wk-network-section.svelte-mouog2 {margin-top:16px;}.wk-network-selector.svelte-mouog2 {display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e7eb;border-radius:8px;}.wk-current-network.svelte-mouog2 {flex:1;display:flex;align-items:center;color:#1f2937;}.wk-network-dot.svelte-mouog2 {width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:8px;}.wk-subscription-status.svelte-mouog2 {text-align:center;padding:24px;background:#fef3c7;border-radius:12px;}.wk-subscription-icon.svelte-mouog2 {font-size:48px;margin-bottom:12px;}.wk-subscription-status.svelte-mouog2 h4:where(.svelte-mouog2) {margin:0 0 8px 0;font-size:16px;color:#1f2937;}.wk-subscription-status.svelte-mouog2 p:where(.svelte-mouog2) {margin:0 0 16px 0;color:#92400e;font-size:14px;}.wk-subscription-active.svelte-mouog2 {padding:16px;background:#d1fae5;border-radius:12px;}.wk-subscription-badge.svelte-mouog2 {display:inline-block;background:#059669;color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;margin-bottom:8px;}.wk-subscription-details.svelte-mouog2 {color:#065f46;font-size:14px;}.wk-subscription-details.svelte-mouog2 div:where(.svelte-mouog2) {margin-bottom:8px;}.wk-plans-modal.svelte-mouog2 {position:absolute;top:0;left:0;right:0;bottom:0;background:white;padding:20px;overflow-y:auto;border-radius:16px;}.wk-back-btn.svelte-mouog2 {background:none;border:none;color:#6366f1;font-size:14px;cursor:pointer;padding:8px 0;margin-bottom:16px;}.wk-plans-grid.svelte-mouog2 {display:grid;gap:16px;}.wk-plan-card.svelte-mouog2 {padding:20px;border:2px solid #e5e7eb;border-radius:12px;position:relative;}.wk-plan-featured.svelte-mouog2 {border-color:#6366f1;box-shadow:0 0 0 1px #6366f1;}.wk-plan-badge.svelte-mouog2 {position:absolute;top:-10px;right:20px;background:#6366f1;color:white;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600;}.wk-plan-card.svelte-mouog2 h4:where(.svelte-mouog2) {margin:0 0 8px 0;font-size:18px;color:#1f2937;}.wk-plan-price.svelte-mouog2 {font-size:24px;font-weight:600;color:#6366f1;margin-bottom:16px;}.wk-plan-features.svelte-mouog2 {list-style:none;padding:0;margin:0 0 16px 0;}.wk-plan-features.svelte-mouog2 li:where(.svelte-mouog2) {padding:8px 0;font-size:14px;color:#4b5563;}\n  \n  @media (max-width: 480px) {.wk-panel.svelte-mouog2 {width:calc(100vw - 40px);max-width:380px;}\n  }'
	};
	function _n(e, t) {
		(ue(t, !0), sn(e, yn));
		let n = Ne(!1);
		async function o(e) {
			cn.isConnected
				? (await cn.purchaseSubscription(e), Be(n, !1))
				: alert('Please connect your wallet first');
		}
		var i = xn();
		let s;
		var r = Ge(i);
		Je(Ge(r), 2).__click = function (...e) {
			t.onclose?.apply(this, e);
		};
		var l = Ge(Je(r, 2)),
			a = Ge(l),
			c = (e) => {
				var t = fn(),
					n = Je(Ge(t), 6);
				n.__click = [un];
				var o = Ge(n);
				(ot(() => {
					((n.disabled = cn.isConnecting),
						Qt(o, cn.isConnecting ? 'Connecting...' : 'Connect Wallet'));
				}),
					Jt(e, t));
			},
			u = (e) => {
				var t = vn(),
					n = (function (e) {
						var t = Fe(e);
						return t instanceof Comment && '' === t.data ? Ue(t) : t;
					})(t),
					o = Ge(n),
					i = Je(Ge(o), 2),
					s = Ge(i),
					r = Ge(s),
					l = Ge(Je(s, 2));
				((Je(o, 2).__click = [dn]),
					ot(() => {
						(Qt(r, cn.displayAddress), Qt(l, `${cn.balance ?? ''} ETH`));
					}),
					Jt(e, t));
			};
		on(a, (e) => {
			cn.isConnected ? e(u, !1) : e(c);
		});
		var d = Je(l, 2),
			f = Je(Ge(d), 2),
			v = (e) => {
				var t = gn();
				((Je(Ge(t), 6).__click = [pn, n]), Jt(e, t));
			},
			p = (e) => {
				var t = hn(),
					n = Ge(t),
					o = Ge(n),
					i = Ge(Je(n, 2)),
					s = Ge(i);
				(ot(
					(e) => {
						(Qt(o, cn.subscription.plan), Qt(s, `Active until: ${e ?? ''}`));
					},
					[
						() => {
							return (e = cn.subscription.expiresAt) ? new Date(e).toLocaleDateString() : '-';
							var e;
						}
					]
				),
					Jt(e, t));
			};
		on(f, (e) => {
			cn.subscription.isActive ? e(p, !1) : e(v);
		});
		var g = Je(f, 2),
			h = (e) => {
				var t = kn(),
					i = Ge(t);
				i.__click = [wn, n];
				var s = Ge(Je(i, 2));
				Je(Ge(s), 6).__click = [mn, o];
				var r = Je(s, 2);
				((Je(Ge(r), 8).__click = [bn, o]), Jt(e, t));
			};
		(on(g, (e) => {
			Nt(n) && e(h);
		}),
			ot(
				(e) => (s = an(i, 0, 'wk-panel svelte-mouog2', 0, s, e)),
				[
					() => ({
						'wk-panel-left': 'left' === t.position.side,
						'wk-panel-right': 'right' === t.position.side
					})
				]
			),
			Jt(e, i),
			de());
	}
	Kt(['click']);
	var Cn = Gt(
		'<div id="walletkit-widget-root"><button aria-label="Open wallet assistant"><div class="wk-assistant-icon svelte-19nich9"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-19nich9"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" class="svelte-19nich9"></path><path d="M15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11Z" fill="currentColor" class="svelte-19nich9"></path><path d="M8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11Z" fill="currentColor" class="svelte-19nich9"></path><path d="M12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="currentColor" class="svelte-19nich9"></path></svg></div> <div class="wk-status-indicator svelte-19nich9"></div></button> <!></div>'
	);
	const En = {
		hash: 'svelte-19nich9',
		code: '#walletkit-widget-root.svelte-19nich9 {position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:999999;font-family:system-ui, -apple-system, sans-serif;transition:none;}#walletkit-widget-root.wk-dragging.svelte-19nich9 {transition:none !important;}#walletkit-widget-root.svelte-19nich9 .wk-snapping {transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);}.wk-floating-assistant.svelte-19nich9 {width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);cursor:move;box-shadow:0 4px 24px rgba(99, 102, 241, 0.3);transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);display:flex;align-items:center;justify-content:center;position:relative;\n    animation: svelte-19nich9-float 3s ease-in-out infinite;user-select:none;-webkit-user-select:none;border:none;padding:0;}.wk-floating-assistant.wk-dragging.svelte-19nich9 {\n    animation: none !important;cursor:grabbing;transform:scale(1.1) !important;box-shadow:0 8px 32px rgba(99, 102, 241, 0.5);}\n  \n  @keyframes svelte-19nich9-float {\n    0%, 100% { transform: translateY(0px); }\n    50% { transform: translateY(-10px); }\n  }.wk-floating-assistant.svelte-19nich9:hover:not(.wk-dragging) {transform:scale(1.05);box-shadow:0 6px 32px rgba(99, 102, 241, 0.4);}.wk-floating-assistant.svelte-19nich9:active:not(.wk-dragging) {transform:scale(0.98);}.wk-assistant-icon.svelte-19nich9 {color:white;display:flex;align-items:center;justify-content:center;}.wk-status-indicator.svelte-19nich9 {position:absolute;top:4px;right:4px;width:12px;height:12px;border-radius:50%;background:#ef4444;border:2px solid white;\n    animation: svelte-19nich9-pulse 2s ease-in-out infinite;}\n  \n  @keyframes svelte-19nich9-pulse {\n    0%, 100% { opacity: 1; }\n    50% { opacity: 0.5; }\n  }'
	};
	function Mn(e, t) {
		(ue(t, !0), sn(e, En));
		let n = Ne(!1),
			o = Ne(Re({ side: 'right', y: window.innerHeight / 2 })),
			i = Ne(!1),
			s = 0,
			r = !1;
		function l() {
			((r = !0), Be(i, !0));
		}
		function a(e) {
			(Be(o, e, !0), Be(i, !1));
		}
		!(function (e) {
			Qe();
			var t = kt.f;
			if (wt || 0 === (t & q) || 0 !== (t & U)) return tt(e);
			var n = ae;
			(n.e ?? (n.e = [])).push(e);
		})(() => {
			const e = document.querySelector('.wk-status-indicator');
			e && (e.style.background = cn.isConnected ? '#10b981' : '#ef4444');
		});
		var c = Cn();
		let u;
		var d = Ge(c);
		let f;
		((d.__mousedown = function () {
			((s = Date.now()), (r = !1));
		}),
			(d.__click = function () {
				Date.now() - s < 200 && !r && Be(n, !Nt(n));
			}),
			rn(
				d,
				(e, t) =>
					(function (e, t = {}) {
						let n = 0,
							o = 0,
							i = 0,
							s = 0,
							r = !1;
						const l = e.parentElement;
						function a(e) {
							if (t.disabled) return;
							((n = e.clientX), (o = e.clientY));
							const a = l.getBoundingClientRect();
							((i = a.left),
								(s = a.top),
								(r = !1),
								document.addEventListener('mousemove', c),
								document.addEventListener('mouseup', u),
								e.preventDefault());
						}
						function c(a) {
							if (
								(!r &&
									(Math.abs(a.clientX - n) > 5 || Math.abs(a.clientY - o) > 5) &&
									((r = !0),
									e.classList.add('wk-dragging'),
									l.classList.add('wk-dragging'),
									t.onDragStart?.()),
								r)
							) {
								const e = a.clientX - n,
									t = a.clientY - o,
									r = i + e,
									c = s + t;
								((l.style.left = r + 'px'),
									(l.style.top = c + 'px'),
									(l.style.right = 'auto'),
									(l.style.transform = 'none'));
							}
						}
						function u(t) {
							(document.removeEventListener('mousemove', c),
								document.removeEventListener('mouseup', u),
								r &&
									(p(),
									setTimeout(() => {
										(e.classList.remove('wk-dragging'), l.classList.remove('wk-dragging'));
									}, 50)));
						}
						function d(e) {
							if (t.disabled) return;
							const a = e.touches[0];
							((n = a.clientX), (o = a.clientY));
							const c = l.getBoundingClientRect();
							((i = c.left), (s = c.top), (r = !1));
						}
						function f(a) {
							const c = a.touches[0];
							if (
								(!r &&
									(Math.abs(c.clientX - n) > 5 || Math.abs(c.clientY - o) > 5) &&
									((r = !0),
									e.classList.add('wk-dragging'),
									l.classList.add('wk-dragging'),
									t.onDragStart?.(),
									a.preventDefault()),
								r)
							) {
								const e = c.clientX - n,
									t = c.clientY - o,
									r = i + e,
									a = s + t;
								((l.style.left = r + 'px'),
									(l.style.top = a + 'px'),
									(l.style.right = 'auto'),
									(l.style.transform = 'none'));
							}
						}
						function v(t) {
							r &&
								(p(),
								setTimeout(() => {
									(e.classList.remove('wk-dragging'), l.classList.remove('wk-dragging'));
								}, 50));
						}
						function p() {
							const e = l.getBoundingClientRect(),
								n = window.innerWidth,
								o = window.innerHeight,
								i = e.left + e.width / 2,
								s = e.top + e.height / 2,
								r = i,
								a = n - i;
							l.classList.add('wk-snapping');
							let c = s;
							const u = e.height / 2 + 20,
								d = o - e.height / 2 - 20;
							let f;
							((c = Math.max(u, Math.min(d, c))),
								r < a
									? ((f = 'left'), (l.style.left = '20px'), (l.style.right = 'auto'))
									: ((f = 'right'), (l.style.right = '20px'), (l.style.left = 'auto')),
								(l.style.top = c + 'px'),
								(l.style.transform = 'translateY(-50%)'),
								t.onSnap?.(f, c),
								t.onDragEnd?.({ side: f, y: c }),
								setTimeout(() => {
									l.classList.remove('wk-snapping');
								}, 300));
						}
						return (
							e.addEventListener('mousedown', a),
							e.addEventListener('touchstart', d, { passive: !1 }),
							e.addEventListener('touchmove', f, { passive: !1 }),
							e.addEventListener('touchend', v),
							{
								update(e) {
									t = e;
								},
								destroy() {
									(e.removeEventListener('mousedown', a),
										e.removeEventListener('touchstart', d),
										e.removeEventListener('touchmove', f),
										e.removeEventListener('touchend', v));
								}
							}
						);
					})?.(e, t),
				() => ({ onDragStart: l, onDragEnd: a, disabled: Nt(n) })
			));
		var v = Je(d, 2),
			p = (e) => {
				_n(e, {
					get position() {
						return Nt(o);
					},
					onclose: () => Be(n, !1)
				});
			};
		return (
			on(v, (e) => {
				Nt(n) && e(p);
			}),
			ot(
				(e, t) => {
					((u = an(c, 0, 'svelte-19nich9', 0, u, e)),
						(f = an(d, 0, 'wk-floating-assistant svelte-19nich9', 0, f, t)));
				},
				[() => ({ 'wk-dragging': Nt(i) }), () => ({ 'wk-dragging': Nt(i) })]
			),
			Jt(e, c),
			de({
				open: function () {
					Be(n, !0);
				},
				close: function () {
					Be(n, !1);
				},
				toggle: function () {
					Be(n, !Nt(n));
				}
			})
		);
	}
	(Kt(['mousedown', 'click']),
		(function () {
			if (window.WalletKitWidget)
				return void console.warn('WalletKit Widget is already initialized');
			const e = document.currentScript,
				t = {
					position: e?.getAttribute('data-position') || 'bottom-right',
					theme: e?.getAttribute('data-theme') || 'light',
					subscriptionContract: e?.getAttribute('data-subscription-contract'),
					chainId: parseInt(e?.getAttribute('data-chain-id') || '1')
				},
				n = document.createElement('div');
			((n.id = 'walletkit-widget-container'), document.body.appendChild(n));
			const o = en(Mn, { target: n, props: {} }),
				i = {};
			((window.WalletKitWidget = {
				isConnected: () => cn.isConnected,
				getAccount: () =>
					cn.isConnected ? { address: cn.address, chainId: cn.chainId, balance: cn.balance } : null,
				checkSubscription: (e) => {
					const t = cn.subscription;
					return (e && e(t), t);
				},
				connect: async () => {
					await cn.connect();
				},
				disconnect: () => {
					cn.disconnect();
				},
				promptConnect: () => {
					cn.isConnected || o.open();
				},
				requireSubscription: (e) => {
					const t = cn.subscription.isActive;
					return (t || o.open(), e && e(t), t);
				},
				open: () => o.open(),
				close: () => o.close(),
				toggle: () => o.toggle(),
				show: () => {
					const e = document.getElementById('walletkit-widget-container');
					e && (e.style.display = 'block');
				},
				hide: () => {
					const e = document.getElementById('walletkit-widget-container');
					e && (e.style.display = 'none');
				},
				on: (e, t) => {
					(i[e] || (i[e] = []), i[e].push(t));
					const n = (e) => {
						t(e.detail);
					};
					return (
						window.addEventListener(`walletkit:${e}`, n),
						() => {
							const o = i[e].indexOf(t);
							(o > -1 && i[e].splice(o, 1), window.removeEventListener(`walletkit:${e}`, n));
						}
					);
				},
				destroy: () => {
					o.$destroy();
					const e = document.getElementById('walletkit-widget-container');
					(e && e.remove(), delete window.WalletKitWidget);
				}
			}),
				window.dispatchEvent(new CustomEvent('walletkit:ready')),
				console.log('WalletKit Widget initialized', t));
		})());
}); //# sourceMappingURL=walletkit-widget.umd.cjs.map
