class Exceptions {
  statusCode;
  type;
  message;
  constructor(statusCode, message) {
    switch (statusCode) {
      case 200:
        this.statusCode = statusCode;
        this.type = "Success Response";
        this.message = message;
        break;
      case 201:
        this.statusCode = statusCode;
        this.type = "Created Successful";
        this.message = message;
        break;
      case 400:
        this.statusCode = 400;
        this.type = "Bad Request Data Error";
        this.message = message;
        break;
      case 401:
        this.statusCode = 401;
        this.type = "UnAuthorized Error";
        this.message = message;
        break;
      case 404:
        this.statusCode = 404;
        this.type = "Not Found Error";
        this.message = message;
        break;
      case 500:
        this.statusCode = statusCode;
        this.type = "Server Or Query DB Error";
        this.message = message;
        break;
      default:
        break;
    }
  }
}

export default Exceptions;

// 401 UnAuthorized ||  unAuthorized type
// 400 Bad Request ||  payload type
// 404 Not Found ||  ========
// 500 Server error query db ||  query type
