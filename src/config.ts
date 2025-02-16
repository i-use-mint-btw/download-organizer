import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"

interface ConfigEntry {
    type: string
    dest: string
    extensions: Array<string>
}

export type AppConfig = Array<ConfigEntry>

export function parseConfig(path: string): AppConfig | null {
    let config: AppConfig;

    if (!fs.existsSync(path)) {
        console.error("A configuration file does not exist at the specified path")
        return null
    }

    const json = require(path)
    
    if (!json || Object.keys(json).length < 1) {
        return null
    }

    config = require(path)

    return config
}

export function createDefaultConfig(configPath: string): void {
    const defaultConfig = `
[
    {
        "type": "audio",
        "dest": "$Downloads",
        "extensions": ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma", "mp4", "amr", "au", "aiff", "ape", "ac3", "dts", "dtshd", "eac3", "mka", "mkv", "mp2", "mpc", "ofr", "ofs", "opus", "ra", "ram", "raw", "rm", "rmj", "rmvb", "s3m", "sid", "snd", "tta", "voc", "vqf", "w64", "wavpack", "webm", "wv", "8svx", "cda", "dss", "dvf", "gsm", "iklax", "imf", "it", "m3u", "m4b", "m4p", "mod", "mo3", "mtm", "mx3", "nsf", "nst", "ptf", "s3z", "stm", "ult", "umx", "xm"]
    },
    {
        "type": "videos",
        "dest": "$Downloads",
        "extensions": ["mp4", "avi", "mov", "wmv", "flv", "mkv", "mpg", "mpeg", "m4v", "webm", "ogv", "asf", "rm", "rmvb", "vob", "dv", "dvd", "m2v", "m2ts", "mts", "ts", "tp", "trp", "f4v", "f4p", "3gp", "3g2", "amv", "divx", "xvid", "h264", "h265", "mxf", "roq", "nsv", "swf", "yuv"]
    },
    {
        "type": "images",
        "dest": "$Downloads",
        "extensions": ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "svg", "psd", "ai", "eps", "ico", "cur", "pcx", "pct", "pnm", "ppm", "pgm", "pbm", "xpm", "xbm", "xwd", "yuv", "raw", "cr2", "crw", "dcr", "dng", "erf", "k25", "kdc", "mdc", "mef", "mos", "mrw", "nef", "nrw", "orf", "pef", "raf", "sr2", "srf", "srw", "arw", "bay", "cap", "iiq", "rw2", "rwl", "x3f", "webp"]
    },
    {
        "type": "runnable",
        "dest": "$Downloads",
        "extensions": ["exe", "com", "cmd", "bat", "msi", "apk", "app", "ipa", "deb", "rpm", "pkg", "dmg", "run", "sh", "elf", "bin", "sys", "dll", "drv", "ocx", "scr", "hta", "AppImage"]
    },
    {
        "type": "code",
        "dest": "$Downloads",
        "extensions": ["c", "cpp", "cc", "cxx", "h", "hpp", "hxx", "java", "class", "jar", "py", "pyc", "pyo", "php", "php3", "php4", "php5", "js", "jsx", "ts", "tsx", "vb", "vbs", "bas", "cls", "frm", "cs", "csproj", "vbproj", "sql", "pl", "pm", "tcl", "tk", "sh", "bash", "zsh", "ksh", "csh", "asm", "s", "inc", "inl"]
    },
    {
        "type": "documents",
        "dest": "$Downloads",
        "extensions": ["doc", "docx", "pdf", "odt", "rtf", "txt", "wpd", "wps", "sxw", "stw", "sdw", "xls", "xlsx", "ppt", "pptx", "pps", "ppsx", "odp", "ods", "csv", "tsv", "xml", "html", "xhtml", "mht", "mhtml"]
    },
    {
        "type": "books",
        "dest": "$Downloads",
        "extensions": ["epub", "mobi", "pdf", "azw", "txt", "docx", "fb2", "lit", "pdb", "cb7", "cbr", "djvu", "kf8", "kfx", "prc", "tr3", "html", "xhtml", "xml", "rtf", "odt", "doc", "wpd", "wps", "sxw", "stw", "sdw"]
    },
    {
        "type": "misc",
        "dest": "$Downloads",
        "extensions": ["iso", "qcow", "vsix", "oxt", "backup", "ini", "cfg", "config", "properties", "xml", "json", "yaml", "yml", "toml", "log", "err", "out", "dump", "pid", "sock", "lock", "tmp", "bak", "old", "new", "dat", "sav", "cfg", "set", "theme", "skin", "font", "fnt", "ttf", "otf", "woff", "eot", "cur", "ico", "ani", "icl", "icl8", "icl9"]
    },
    {
        "type": "archives_and_compressed",
        "dest": "$Downloads",
        "extensions": ["zst", "tar.zst", "tar.gz", "rar", "tar.bz", "tar.bz2", "zip", "rar", "7z", "tar", "gz", "bz2", "xz", "lzma", "tgz", "tbz2", "txz", "lz", "lzh", "arj", "cab", "iso", "img", "mdf", "nrg", "vcd", "udf", "dmg", "hfs", "sparseimage", "sparsebundle"]
    }
]
    `
    
    fs.writeFileSync(configPath, defaultConfig)
}

export function getConfigPath(): string | null {
    const HOME = os.homedir()
    let configPath = null;

    if (process.platform === "win32") {
        configPath = path.join(process.env.APPDATA!, "download-organizer.json")
    }
    
    else if (process.platform === "linux") {
        configPath = process.env.XDG_CONFIG_HOME

        if (configPath) {
            configPath = path.join(configPath, "download-organizer.json")
        }
        else {
            // $XDG_CONFIG_HOME not found. falling back to ~/.config
            configPath = path.join(HOME, ".config", "download-organizer.json")
        }
    }

    return configPath
}

export function getDownloadDirectory(): string | null {
    const HOME = os.homedir()
    let download = path.resolve(HOME, "Downloads")
    return download ? download : null
}