require('dotenv').config();
  const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  };
  
  module.exports = {
    development: {
      ...config,
      logging: false,
      define: {
        createdAt: "createdat",
        updatedAt: "updatedat"
      },
      dialect: 'mysql',
    test: {
      ...config,
      define: {
        createdAt: "createdat",
        updatedAt: "updatedat"
      },
      dialect: 'mysql',
    },
    production: {
      ...config,
      define: {
        createdAt: "createdat",
        updatedAt: "updatedat"
      },
      dialect: 'mysql',
    }
  }
}
