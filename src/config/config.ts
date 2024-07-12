import AppConfig from "./AppConfig"

const config = {
  local: {
    host: AppConfig.DB_HOST,
    logging: false,
    define: {
      freezeTableName: true
    },
  },
  development: {
    host: AppConfig.DB_HOST,
    logging: false,
    define: {
      freezeTableName: true
    },
  },
  test: {
    host: AppConfig.DB_HOST,
    logging: false,
    define: {
      freezeTableName: true
    }
  },
  production: {
    host: AppConfig.DB_HOST,
    logging: false,
    define: {
      freezeTableName: true
    }
  }
}

export = Object.freeze(config)