type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

function log(level: LogLevel, context: string, message: string, meta?: object) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        context,
        message,
        meta,
    };
    if (level === "ERROR") {
        console.error(JSON.stringify(entry));
    } else {
        console.log(JSON.stringify(entry));
    }
}

export const logger = {
    log: (level: LogLevel, context: string, message: string, meta?: object) => {
        log(level, context, message, meta);
    },
    info: (context: string, message: string, meta?: object) => log("INFO", context, message, meta),
    warn: (context: string, message: string, meta?: object) => log("WARN", context, message, meta),
    error: (context: string, message: string, meta?: object) => log("ERROR", context, message, meta),
    debug: (context: string, message: string, meta?: object) => log("DEBUG", context, message, meta),
}