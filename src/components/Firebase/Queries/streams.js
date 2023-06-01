import axios from 'axios';

export const getWeekStreamsQuery = async () => {
  return await axios
    .post('/api/stream/week-streams')
    .then(function (response) {
      return {
        status: response.status,
        weekStreams: response.data,
        message: 'ok',
      };
    })
    .catch(function (error) {
      console.log('Error while fetching week-streams', error);
      return {
        status: 500,
        weekStreams: null,
        error,
        message: 'Error while fetching week-streams',
      };
    });
};

export const getMonthStreamsQuery = async () => {
  return await axios
    .post('/api/stream/month-streams')
    .then(function (response) {
      return {
        status: response.status,
        monthStreams: response.data,
        message: 'ok',
      };
    })
    .catch(function (error) {
      console.log('Error while fetching week-streams', error);
      return {
        status: 500,
        monthStreams: null,
        error,
        message: 'Error while fetching week-streams',
      };
    });
};

export const getUserEnterStreamAvailable = async (userId, stream) => {
  const userStreamsLeftResponse = await fetch(
    '/api/firebase/check-streamsLeft?user=' +
      userId +
      '&stream=' +
      stream.streamId,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  ).then(async (query) => {
    const queryResponse = await query.json();
    return queryResponse.response;
  });
  return userStreamsLeftResponse;
};

export const userEnterClassQuery = async (userId, streamId) => {
  const enterClassResponse = await fetch(
    '/api/firebase/enter-class?user=' + userId + '&stream=' + streamId,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  ).then(async (query) => {
    const queryResponse = await query.json();
    return queryResponse;
  });
  return enterClassResponse;
};
