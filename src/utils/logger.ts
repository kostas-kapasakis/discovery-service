import winston, {format, Logger} from "winston";

const {combine, timestamp, prettyPrint} = format;


export let logger: Logger;

export const initializeLogger = (): void => {
    logger = winston.createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            prettyPrint()
        ),
        transports: [
            new winston.transports.File({filename: 'error.log', level: 'error'}),
            new winston.transports.File({filename: 'combined.log'})
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }
}





