import * as util from 'util';

/**
 * Memformat string dengan specifier dasar.
 * Specifier yang didukung:
 *   %s  - String
 *   %d, %i - Integer (parseInt)
 *   %f  - Float (parseFloat)
 *   %o, %O - Object (menggunakan util.inspect)
 *   %j  - JSON stringify
 *   %b  - Boolean (true/false)
 *   %%  - Karakter persen literal
 *
 * @param format  String format
 * @param args    Argumen untuk menggantikan specifier
 * @returns       String hasil format
 */
export function sprintf(format: string, ...args: any[]): string {
    let result = '';
    let argIndex = 0;
    let i = 0;

    while (i < format.length) {
        if (format[i] === '%') {
            // Cek apakah escape '%%'
            if (i + 1 < format.length && format[i + 1] === '%') {
                result += '%';
                i += 2;
                continue;
            }

            // Ambil specifier (hanya satu karakter)
            const specifier = format[i + 1];
            if (!specifier) {
                // Akhir string tidak valid
                result += '%';
                i++;
                continue;
            }

            // Jika tidak ada argumen yang cukup, tampilkan placeholder
            if (argIndex >= args.length) {
                result += '%' + specifier;
                i += 2;
                continue;
            }

            const arg = args[argIndex++];
            let replacement: string;

            switch (specifier) {
                case 's':
                    replacement = String(arg);
                    break;
                case 'd':
                case 'i':
                    replacement = String(parseInt(arg, 10));
                    break;
                case 'f':
                    replacement = String(parseFloat(arg));
                    break;
                case 'o':
                case 'O':
                    replacement = util.inspect(arg, { showHidden: false, depth: null, colors: false });
                    break;
                case 'j':
                    try {
                        replacement = JSON.stringify(arg);
                    } catch (_) {
                        replacement = '[Circular]';
                    }
                    break;
                case 'b':
                    replacement = arg ? 'true' : 'false';
                    break;
                default:
                    // Specifier tidak dikenal: tampilkan apa adanya tanpa konsumsi argumen
                    argIndex--;
                    replacement = '%' + specifier;
                    break;
            }

            result += replacement;
            i += 2;
        } else {
            result += format[i];
            i++;
        }
    }

    return result;
}

/**
 * Mencetak string terformat ke stdout (tanpa console.log).
 * @param format  String format
 * @param args    Argumen untuk menggantikan specifier
 */
export function printf(format: string, ...args: any[]): void {
    const output = sprintf(format, ...args);
    process.stdout.write(output);
}
