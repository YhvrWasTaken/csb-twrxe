function exponentialFormat(num, precision) {
	let e = num.exponent;
	let m = num.mantissa;
	if (Number(new Decimal(m).toStringWithDecimalPlaces(precision)) == 10) {
		m = 1;
		e++;
	}
	e =
		e >= 1000
			? commaFormat(new Decimal(e), 0)
			: new Decimal(e).toStringWithDecimalPlaces(0);
	return new Decimal(m).toStringWithDecimalPlaces(precision) + "e" + e;
}

function commaFormat(num, precision) {
	if (num === null || num === undefined) return "NaN";
	if (num.mag < 0.001) return (0).toFixed(precision);
	return num
		.toStringWithDecimalPlaces(precision)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function regularFormat(num, precision) {
	if (num === null || num === undefined) return "NaN";
	if (num.mag < 0.001) return (0).toFixed(precision);
	return num.toStringWithDecimalPlaces(precision);
}

function fixValue(x, y = 0) {
	return x || new Decimal(y);
}

function sumValues(x) {
	x = Object.values(x);
	if (!x[0]) return new Decimal(0);
	return x.reduce((a, b) => Decimal.add(a, b));
}

function format(decimal, precision = 2, whole = false) {
	decimal = new Decimal(decimal);
	if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
		alert("NaN >:(")
		return "NaN";
	}
	if (decimal.sign < 0) return "-" + format(decimal.neg(), precision);
	if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity";
	if (decimal.eq(0)) return "0";
	if (decimal.gte("eeee1000")) {
		var slog = decimal.slog();
		if (slog.gte(1e3)) return "10^^" + formatWhole(slog);
		else return "10^^" + regularFormat(slog, 3);
	} else if (decimal.gte("eee100000"))
		return "eee" + format(decimal.log10().log10().log10(), 3);
	else if (decimal.gte("ee100000"))
		return "ee" + format(decimal.log10().log10(), 3);
	else if (decimal.gte("1e100000")) return "e" + format(decimal.log10(), 3);
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0);
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision);
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0);
	else if (decimal.gte(Decimal.pow(0.1, precision)) || whole)
		return regularFormat(decimal, precision);
	else if (decimal.gt("1e-100000"))
		return exponentialFormat(
			decimal,
			decimal.gte("1e-1000") ? precision : 0
		);
	else return "1/(" + format(decimal.pow(-1), precision) + ")";
}

function formatWhole(decimal, reallyWhole = false) {
	decimal = new Decimal(decimal);
	if (decimal.gte(1e9)) return format(decimal, 2);
	if (decimal.lte(0.95) && !decimal.eq(0) && !reallyWhole)
		return format(decimal, 2);
	else return format(decimal, 0, true);
}

function formatTime(s) {
	s = new Decimal(s);
	if (s.gte(1 / 0)) return "Forever";
	else if (s.lt(60)) return format(s) + "s";
	else if (s.lt(3600))
		return (
			formatWhole(s.div(60).floor()) +
			"m " +
			format(s.toNumber() % 60) +
			"s"
		);
	else if (s.lt(86400))
		return (
			formatWhole(s.div(3600).floor()) +
			"h " +
			format(s.div(60).floor().toNumber() % 60) +
			"m"
		);
	else if (s.lt(31536000))
		return (
			formatWhole(s.div(84600).floor()) +
			"d " +
			formatWhole(s.div(3600).floor().toNumber() % 24) +
			"h"
		);
	else if (s.lt(31536000000))
		return (
			formatWhole(s.div(31536000).floor()) +
			"y " +
			formatWhole(s.div(84600).floor().toNumber() % 365) +
			"d"
		);
	else return formatWhole(s.div(31536000).floor()) + "y";
}

function toPlaces(x, precision, maxAccepted) {
	x = new Decimal(x);
	let result = x.toStringWithDecimalPlaces(precision);
	if (new Decimal(result).gte(maxAccepted)) {
		result = new Decimal(
			maxAccepted - Math.pow(0.1, precision)
		).toStringWithDecimalPlaces(precision);
	}
	return result;
}
