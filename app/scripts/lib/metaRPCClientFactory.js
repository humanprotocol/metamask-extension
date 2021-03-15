import { EventEmitter } from 'events';
import { EthereumRpcError } from 'eth-rpc-errors';
import createRandomId from '../../../shared/modules/random-id';

const metaRPCClientFactory = (connectionStream) => {
  const notificationChannel = new EventEmitter();
  const requests = new Map();

  const handleResponse = (data) => {
    const { id, result, error, method, params } = data;
    const cb = requests.get(id);

    if (method && params && id) {
      // dont handle server-side to client-side requests
      return;
    }
    if (method && params && !id) {
      // handle servier-side to client-side notification
      notificationChannel.emit('notification', data);
      return;
    }
    if (!cb) {
      // not found in request list
      return;
    }

    if (error) {
      const e = new EthereumRpcError(error.code, error.message, error.data);
      // preserve the stack from serializeError
      e.stack = error.stack;
      requests.delete(id);
      cb(e);
      return;
    }

    requests.delete(id);

    cb(null, result);
  };
  const onNotification = (handler) => {
    notificationChannel.addListener('notification', (data) => {
      handler(data);
    });
  };

  const close = () => {
    notificationChannel.removeAllListeners();
  };

  connectionStream.on('data', handleResponse);
  connectionStream.on('end', close);

  const metaRPCClient = {
    onNotification,
    requests,
  };

  return new Proxy(metaRPCClient, {
    get: (object, property) => {
      if (object[property]) {
        return object[property];
      }
      return (...p) => {
        const cb = p[p.length - 1];
        const params = p.slice(0, -1);
        const id = createRandomId();

        requests.set(id, cb);
        connectionStream.write({
          method: property,
          params,
          id,
        });
      };
    },
  });
};

export default metaRPCClientFactory;
