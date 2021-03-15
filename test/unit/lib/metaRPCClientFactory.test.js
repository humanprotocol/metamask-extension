import assert from 'assert';
import { obj as createThoughStream } from 'through2';
import metaRPCClientFactory from '../../../app/scripts/lib/metaRPCClientFactory';

describe('metaRPCClientFactory', function () {
  it('should be able to make an rpc request with the method', function (done) {
    const streamTest = createThoughStream((chunk) => {
      assert.strictEqual(chunk.method, 'foo');
      done();
    });
    const metaRPCClient = metaRPCClientFactory(streamTest);
    metaRPCClient.foo();
  });
  it('should be able to make an rpc request/response with the method and params and node-style callback', function (done) {
    const streamTest = createThoughStream();
    const metaRPCClient = metaRPCClientFactory(streamTest);

    // make a "foo" method call
    metaRPCClient.foo('bar', (_, result) => {
      assert.strictEqual(result, 'foobarbaz');
      done();
    });

    // fake a response
    metaRPCClient.requests.forEach((_, key) => {
      streamTest.write({
        id: key,
        result: 'foobarbaz',
      });
    });
  });
  it('should be able to make an rpc request/error with the method and params and node-style callback', function (done) {
    const streamTest = createThoughStream();
    const metaRPCClient = metaRPCClientFactory(streamTest);

    // make a "foo" method call
    metaRPCClient.foo('bar', (err) => {
      assert.strictEqual(err.message, 'foo-message');
      assert.strictEqual(err.code, 1);
      done();
    });

    metaRPCClient.requests.forEach((_, key) => {
      streamTest.write({
        id: key,
        error: {
          code: 1,
          message: 'foo-message',
        },
      });
    });
  });
});
