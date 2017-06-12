import settings from '../settings';
import request from 'request';
import Q from 'q';
import qs from 'qs';

const createShortUrl = (req) => {
  const path = settings.host + '/short';

  const deferred = Q.defer();

  request({
    url: path,
    json: true,
    method: 'POST',
    body: req
  }, function(e, r, d) {
    if (e) {
      deferred.reject(e);
      return;
    }

    const success = r.statusCode >= 200 && r.statusCode <= 299;

    if (!success) {
    	deferred.reject(new Error(d.error));
    	return;
    }

    deferred.resolve(d);
  });

  return deferred.promise;
};

export default createShortUrl;