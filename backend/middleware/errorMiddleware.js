import handleErrorResponse from '../utils/handleErrorResponse.js';

const notFoundHandler = (req, res, next) => {
    return handleErrorResponse(res, 404,"Requested URL Not Found", {
        title: "Not Found",
        description: "Requested URL Not Found"
    },'Server')
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    if(statusCode < 500){
        return handleErrorResponse(res, statusCode, err.message);
    }
    
    return handleErrorResponse(res, statusCode, err.message, {
        stack : process.env.NODE_ENV === 'production' ? null : err.stack
    }, 'Server')
};

export {notFoundHandler, errorHandler};