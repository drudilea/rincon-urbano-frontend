import axios from 'axios';

export const getTeachersQuery = async () => {
  return await axios
    .post('/api/user/get-teachers')
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log('ERROR POST TEACHERS QUERY', error);
      return {
        status: 500,
        data: null,
        error,
        message: 'Error while getting teachers',
      };
    });
};

export const getUserInfo = async (userId) => {
  return await axios
    .post('/api/user/user-info?user=' + userId)
    .then(function (response) {
      return response;
    })
    .catch((error) => {
      console.log('Error while getting user info', error);
      return {
        status: 500,
        data: null,
        error,
        message: 'Error while getting user info',
      };
    });
};

export const getUserInfoFromEmail = async (email) => {
  return await axios
    .post('/api/user/user-info-email', { email })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: 500,
        data: null,
        error,
        message: 'Error while getting user info from email',
      };
    });
};

export const getUsersForAdmin = async (offset, perPage) => {
  return await axios
    .post('/api/user/all-users')
    .then(function (usersListResponse) {
      if (usersListResponse.status === 200) {
        const usersListResponseData = usersListResponse.data;
        const usersListResponseDataSliced = usersListResponseData.slice(
          offset,
          offset + perPage
        );
        return {
          usersListResponseDataSliced,
          pageCount: Math.ceil(usersListResponseData.length / perPage),
          error: null,
        };
      }
    })
    .catch(function (error) {
      console.log(error);
      return {
        usersListResponseDataSliced: null,
        pageCount: null,
        error: 'Failed get-users-form-admin endpoint',
      };
    });
};

export const getTeachersForAdmin = async (offset, perPage) => {
  return await axios
    .post('/api/user/get-teachers')
    .then(function (usersListResponse) {
      if (usersListResponse.status === 200) {
        const usersListResponseData = usersListResponse.data;
        const usersListResponseDataSliced = usersListResponseData.slice(
          offset,
          offset + perPage
        );
        return {
          usersListResponseDataSliced,
          pageCount: Math.ceil(usersListResponseData.length / perPage),
          error: null,
        };
      }
    })
    .catch(function (error) {
      console.log(error);
      return {
        usersListResponseDataSliced: null,
        pageCount: null,
        error: 'Failed Get-teachers-for-admin endpoint',
      };
    });
};
