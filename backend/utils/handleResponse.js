const handleResponse = (res, message, data={}, extraMessage={}, ) => {
    return res.json({
      type : 'Success',
      message: message,
      extraMessage: {...extraMessage},
      data: {...data}
    });
  };
  
  export default handleResponse;
  