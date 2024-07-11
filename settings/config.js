

const config = {
    port: 3020,
    expireTime: 60 * 60 * 1000,
   
  
  
    EMAIL_PASSWORD: "2955098Kruger*", // Replace with your actual password
    EMAIL_USER: "jlrodriguez@krugerschool.edu.ec", // Replace with your actual username
    EMAIL_HOST: "smtp.gmail.com", // Ensure this is the correct host
    EMAIL_PORT: 587,
    EMAIL_SECURE: false,
    getDbConnectionString: function () {
      return "";
    },  
    secrets: {
      jwt: process.env.JWT || "mysecret",
    }
  };
  
  module.exports = config; 

module.exports = config;
