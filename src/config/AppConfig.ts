import dotenv from 'dotenv'

dotenv.config()

const AppConfig = {
    API_PREFIX: process.env.API_PREFIX,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || '',
    JWT_EXPIRES: process.env.JWT_EXPIRES,
    DB_HOST: process.env.DB_HOST,
    STORAGE_HOST: process.env.STORAGE_HOST,
    FB_CREDENTIAL: process.env.FB_CREDENTIAL || '',
}

export default Object.freeze(AppConfig)