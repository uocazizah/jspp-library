import * as util from "util";
import {
	_emit_warning,
	_register_warning,
} from "../internal/warning/warning_system";

// Daftarkan warning yang digunakan
_register_warning("missing_args");
_register_warning("unknown_specifier");
_register_warning("deprecated_specifier");
_register_warning("type_coercion");
_register_warning("circular_json");
_register_warning("large_string");

export function sprintf(format: string, ...args: any[]): string {
	let result = "";
	let argIndex = 0;
	let i = 0;

	if (format.length > 10000) {
		_emit_warning(
			"large_string",
			"Format string is very large (${0} characters), this may impact performance",
			format.length,
		);
	}

	while (i < format.length) {
		if (format[i] === "%") {
			if (i + 1 < format.length && format[i + 1] === "%") {
				result += "%";
				i += 2;
				continue;
			}

			const specifier = format[i + 1];
			if (!specifier) {
				_emit_warning(
					"unknown_specifier",
					"Incomplete format specifier at position ${0}",
					i,
				);
				result += "%";
				i++;
				continue;
			}

			if (argIndex >= args.length) {
				_emit_warning(
					"missing_args",
					'Not enough arguments for format specifier "%${0}" at position ${1}',
					specifier,
					i,
				);
				result += "%" + specifier;
				i += 2;
				continue;
			}

			const arg = args[argIndex++];
			let replacement: string;

			switch (specifier) {
				case "s":
					replacement = String(arg);
					break;
				case "d":
				case "i": {
					const intVal = parseInt(arg, 10);
					if (isNaN(intVal)) {
						_emit_warning(
							"type_coercion",
							'Failed to convert "${0}" to integer for %${1} specifier',
							String(arg),
							specifier,
						);
					}
					replacement = String(intVal);
					break;
				}
				case "f": {
					const floatVal = parseFloat(arg);
					if (isNaN(floatVal)) {
						_emit_warning(
							"type_coercion",
							'Failed to convert "${0}" to float for %f specifier',
							String(arg),
						);
					}
					replacement = String(floatVal);
					break;
				}
				case "o":
				case "O":
					replacement = util.inspect(arg, {
						showHidden: false,
						depth: null,
						colors: false,
					});
					break;
				case "j":
					try {
						replacement = JSON.stringify(arg);
					} catch (_) {
						_emit_warning(
							"circular_json",
							'Cannot stringify circular structure to JSON, using "[Circular]" instead',
						);
						replacement = "[Circular]";
					}
					break;
				case "b":
					replacement = arg ? "true" : "false";
					break;
				default:
					_emit_warning(
						"unknown_specifier",
						'Unknown format specifier "%${0}" at position ${1}',
						specifier,
						i,
					);
					argIndex--;
					replacement = "%" + specifier;
					break;
			}

			result += replacement;
			i += 2;
		} else {
			result += format[i];
			i++;
		}
	}

	if (argIndex < args.length) {
		_emit_warning(
			"missing_args",
			"${0} unused argument(s) provided to format string",
			args.length - argIndex,
		);
	}

	return result;
}

export function printf(format: string, ...args: any[]): void {
	const output = sprintf(format, ...args);
	process.stdout.write(output);
}
