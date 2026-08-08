/**
 * Konfigurasi warning yang bisa diubah oleh pengguna.
 * Properti dengan nama `W...` (enable) dan `fno_...` (disable) bekerja sebagai alias.
 *
 * Cara pakai:
 *   import { warning_config } from './warning_flags';
 *   warning_config.fno_missing_args = true;   // mematikan warning
 *   warning_config.Wmissing_args = true;      // mengaktifkan warning (default)
 */

// Objek konfigurasi global (mutable)
export const warning_config = {
    // Warning: missing_args
    get Wmissing_args(): boolean {
        return this._missing_args;
    },
    set Wmissing_args(v: boolean) {
        this._missing_args = v;
    },
    get fno_missing_args(): boolean {
        return !this._missing_args;
    },
    set fno_missing_args(v: boolean) {
        this._missing_args = !v;
    },

    // Warning: unknown_specifier
    get Wunknown_specifier(): boolean {
        return this._unknown_specifier;
    },
    set Wunknown_specifier(v: boolean) {
        this._unknown_specifier = v;
    },
    get fno_unknown_specifier(): boolean {
        return !this._unknown_specifier;
    },
    set fno_unknown_specifier(v: boolean) {
        this._unknown_specifier = !v;
    },

    // Warning: deprecated_specifier
    get Wdeprecated_specifier(): boolean {
        return this._deprecated_specifier;
    },
    set Wdeprecated_specifier(v: boolean) {
        this._deprecated_specifier = v;
    },
    get fno_deprecated_specifier(): boolean {
        return !this._deprecated_specifier;
    },
    set fno_deprecated_specifier(v: boolean) {
        this._deprecated_specifier = !v;
    },

    // Warning: type_coercion
    get Wtype_coercion(): boolean {
        return this._type_coercion;
    },
    set Wtype_coercion(v: boolean) {
        this._type_coercion = v;
    },
    get fno_type_coercion(): boolean {
        return !this._type_coercion;
    },
    set fno_type_coercion(v: boolean) {
        this._type_coercion = !v;
    },

    // Warning: circular_json
    get Wcircular_json(): boolean {
        return this._circular_json;
    },
    set Wcircular_json(v: boolean) {
        this._circular_json = v;
    },
    get fno_circular_json(): boolean {
        return !this._circular_json;
    },
    set fno_circular_json(v: boolean) {
        this._circular_json = !v;
    },

    // Warning: large_string
    get Wlarge_string(): boolean {
        return this._large_string;
    },
    set Wlarge_string(v: boolean) {
        this._large_string = v;
    },
    get fno_large_string(): boolean {
        return !this._large_string;
    },
    set fno_large_string(v: boolean) {
        this._large_string = !v;
    },

    // nilai internal (default: semua aktif)
    _missing_args: true,
    _unknown_specifier: true,
    _deprecated_specifier: true,
    _type_coercion: true,
    _circular_json: true,
    _large_string: true,
} as {
    Wmissing_args: boolean;
    fno_missing_args: boolean;
    Wunknown_specifier: boolean;
    fno_unknown_specifier: boolean;
    Wdeprecated_specifier: boolean;
    fno_deprecated_specifier: boolean;
    Wtype_coercion: boolean;
    fno_type_coercion: boolean;
    Wcircular_json: boolean;
    fno_circular_json: boolean;
    Wlarge_string: boolean;
    fno_large_string: boolean;
    // properti internal ditambahkan biar TS gak ngamuk
    _missing_args: boolean;
    _unknown_specifier: boolean;
    _deprecated_specifier: boolean;
    _type_coercion: boolean;
    _circular_json: boolean;
    _large_string: boolean;
};

// Ekspor juga konstanta string untuk kemudahan (opsional)
export const Wmissing_args = "missing_args";
export const fno_missing_args = "missing_args";
export const Wunknown_specifier = "unknown_specifier";
export const fno_unknown_specifier = "unknown_specifier";
export const Wdeprecated_specifier = "deprecated_specifier";
export const fno_deprecated_specifier = "deprecated_specifier";
export const Wtype_coercion = "type_coercion";
export const fno_type_coercion = "type_coercion";
export const Wcircular_json = "circular_json";
export const fno_circular_json = "circular_json";
export const Wlarge_string = "large_string";
export const fno_large_string = "large_string";
