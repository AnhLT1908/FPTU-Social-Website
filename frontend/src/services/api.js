import { message } from "antd";

import axios from 'axios';
export const BASE_URL = 'http://localhost:9999/api/v1';
const token = localStorage.getItem('token');

const HEADERS_NOT_AUTHORIZATION = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};
export function getHeaderToTest() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Authorization': 'Bearer ' + token,
    };
}

export function getHeaderMultiple() {
    return {
        'Content-Type': 'multipart/form-data; boundary=something',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    };
}

export function getHeader() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    };
}

axios.interceptors.response.use(
    (success) => {
        if (success.data.errors) {
            message.error(success.data.errors.message || 'An error occurred, please try again later.');
            return Promise.reject(success);
        }
        return success;
    },
    (fail) => {
        let msg = fail.response.data.message && !Array.isArray(fail.response.data.message) ? fail.response.data.message : 'An error occurred, please try again later.';
        message.error(msg === 'Forbidden resource' ? 'You do not have permission or data does not exist' : msg);
        if (msg === 'Forbidden resource' &&  fail.response.status === 403) {
        }

        return Promise.reject(fail);
    }
);

const api = {
    postLogin: async (endpoint, params) => {
        try {
            const response = await axios.post(endpoint, params, {
                headers: HEADERS_NOT_AUTHORIZATION
            });
            
            return response.data;
        } catch (err) {
            if (err.response) {
                console.error('API Error:', err.response.data);
                console.error('Status:', err.response.status);
                console.error('Headers:', err.response.headers);
                return err.response.data; // This indicates some error from backend, examine what it is.
            } else {
                console.error('Error:', err.message);
                throw err;
            }
        }
    }
,    
    post: (endpoint, params) => {
        return axios.default
            .post(endpoint, params, {
                headers: getHeader()
            })
            .then(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            )
            .catch(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            );
    },

    postMultiplePart: (endpoint, params) => {
        return axios.default
            .post(endpoint, params, {
                headers: getHeaderMultiple(),
            })
            .then(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            )
            .catch(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            );
    },

    get: (endpoint, params = {}) => {
        return axios.default
            .get(endpoint, {
                params: params,
                headers: getHeaderToTest()
            })
            .then(
                (response) => {
                    return response;
                },
                (err) => {
                    return err.response || err;
                }
            )
            .catch(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            );
    },

    put: (endpoint, params) => {
        return axios.default
            .put(endpoint, params, {
                headers: getHeader(),
            })
            .then(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            )
            .catch(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            );
    },

    delete: (endpoint, params) => {
        return axios.default
            .delete(endpoint, {
                params: params,
                headers: getHeader()
            })
            .then(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            )
            .catch(
                (response) => {
                    return response.data;
                },
                (err) => {
                    return err.response || err;
                }
            );
    },

    doGet: (endpoint, callback, errorCallBack) => {
        axios.default.get(
            endpoint, { headers: getHeader() }
        ).then(
            (success) => {
                if (typeof callback === 'function') {
                    callback(success);
                }
            },
            (err) => {
                if (typeof errorCallBack === 'function') {
                    errorCallBack(err);
                }
            }
        ).catch(error => {
            if (typeof errorCallBack === 'function') {
                errorCallBack(error);
            }
        })
    },
    doPost: (endpoint, body, callback, errorCallBack) => {
        console.log("axios", axios);
        axios.default.post(
            endpoint, body, { headers: getHeader() }
        ).then(
            (success) => {
                if (typeof callback === 'function') {
                    callback(success);
                }
            },
            (err) => {
                if (typeof errorCallBack === 'function') {
                    errorCallBack(err);
                }
            }
        ).catch(error => {
            if (typeof errorCallBack === 'function') {
                errorCallBack(error);
            }
        })
    },
    doPut: (endpoint, body, callback, errorCallBack) => {
        axios.default.put(endpoint, body, {
            headers: getHeader()
        }).then(response => {
            if (typeof callback === 'function') {
                callback(response);
            }
        }, (err) => {
            if (typeof errorCallBack === 'function') {
                errorCallBack(err);
            }
        }).catch(error => {
            if (typeof errorCallBack === 'function') {
                errorCallBack(error);
            }
        })
    },
    doDelete: (endpoint, params, callback, errorCallBack) => {
        axios.default.delete(endpoint, {
            params: params,
            headers: getHeader()
        }).then(response => {
            if (typeof callback === 'function') {
                callback(response);
            }
        }, (err) => {
            if (typeof errorCallBack === 'function') {
                errorCallBack(err);
            }
        }).catch(error => {
            if (typeof errorCallBack === 'function') {
                errorCallBack(error);
            }
        })
    },
};

export { api }
