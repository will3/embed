import settings from '../settings';
import request from 'request';
import Q from 'q';
import qs from 'qs';

const embed = (req) => {
  const query = qs.stringify(req);
  const path = settings.host + '/embed?' + query;

  const deferred = Q.defer();

  request({
    url: path,
    json: true
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

export default embed;