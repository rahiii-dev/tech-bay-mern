const handleResponse = (res, message, extraMessage={}, data={} ) => {
    return res.json({
      type : 'Success',
      message: message,
      extraMessage: {...extraMessage},
      data: {...data}
    });
  };
  
  export default handleResponse;
  