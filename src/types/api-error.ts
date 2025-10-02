export type ApiError = {
  response: {
    data: {
      message: string;
      statusCode: string;
    };
  };
};
