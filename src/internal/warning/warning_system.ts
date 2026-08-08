import { warning_config } from "./warning_flags";

interface warning_entry {
	flag_name: string;
	message: string;
	count: number;
	max_warnings: number;
}

const warning_registry: Map<string, warning_entry> = new Map();
const warning_history: string[] = [];
const DEFAULT_MAX_WARNINGS = 100;

function _is_warning_enabled(flag_name: string): boolean {
	// Cek melalui objek warning_config dengan nama W...
	const enable_key = "W" + flag_name;
	const disable_key = "fno_" + flag_name;

	// Jika properti fno_... ada dan bernilai true -> disabled
	if (
		disable_key in warning_config &&
		(warning_config as any)[disable_key] === true
	) {
		return false;
	}
	// Jika properti W... ada dan bernilai true -> enabled
	if (
		enable_key in warning_config &&
		(warning_config as any)[enable_key] === true
	) {
		return true;
	}
	// Default: enabled
	return true;
}

export function _register_warning(
	flag_name: string,
	max_warnings?: number,
): void {
	if (!warning_registry.has(flag_name)) {
		warning_registry.set(flag_name, {
			flag_name: flag_name,
			message: "",
			count: 0,
			max_warnings: max_warnings || DEFAULT_MAX_WARNINGS,
		});
	}
}

export function _emit_warning(
	flag_name: string,
	message: string,
	...args: any[]
): void {
	if (!warning_registry.has(flag_name)) {
		_register_warning(flag_name);
	}
	const entry = warning_registry.get(flag_name)!;

	if (!_is_warning_enabled(flag_name)) {
		return;
	}

	if (entry.count >= entry.max_warnings) {
		if (entry.count === entry.max_warnings) {
			const final_msg = `Warning "${flag_name}" has been suppressed after ${entry.max_warnings} occurrences`;
			_write_warning(final_msg);
			entry.count++;
		}
		return;
	}

	let formatted_message = message;
	for (let i = 0; i < args.length; i++) {
		formatted_message = formatted_message.replace(
			"${" + i + "}",
			String(args[i]),
		);
	}

	entry.message = formatted_message;
	entry.count++;
	warning_history.push(`[${flag_name}] ${formatted_message}`);
	_write_warning(`Warning [${flag_name}]: ${formatted_message}`);
}

function _write_warning(message: string): void {
	if (typeof process !== "undefined" && process.stderr) {
		process.stderr.write(message + "\n");
	}
}

export function _get_warning_stats(): {
	[key: string]: { count: number; last_message: string };
} {
	const stats: { [key: string]: { count: number; last_message: string } } = {};
	warning_registry.forEach((entry, key) => {
		stats[key] = { count: entry.count, last_message: entry.message };
	});
	return stats;
}

export function _reset_warnings(): void {
	warning_registry.forEach((entry) => {
		entry.count = 0;
		entry.message = "";
	});
	warning_history.length = 0;
}

export function _get_warning_history(): string[] {
	return warning_history.slice();
}

export function _clear_warning_history(): void {
	warning_history.length = 0;
}
