// Generated by CoffeeScript 1.11.1
var RedisInst, RedisSMQ, _, async, redis, should;

_ = require("lodash");

should = require("should");

async = require("async");

RedisSMQ = require("../index");

RedisInst = require("redis");

redis = RedisInst.createClient();

describe('Redis-Simple-Message-Queue Test', function() {
  var looong_string, q1m1, q1m2, q1m3, q2m2, q2msgs, queue1, queue2, rsmq, rsmq2;
  rsmq = null;
  rsmq2 = null;
  queue1 = {
    name: "test1"
  };
  queue2 = {
    name: "test2"
  };
  q1m1 = null;
  q1m2 = null;
  q1m3 = null;
  q2m2 = null;
  q2msgs = {};
  looong_string = function() {
    var o;
    o = "";
    while (o.length < 66000) {
      o = o + 'A very long Message...';
    }
    return o;
  };
  before(function(done) {
    done();
  });
  after(function(done) {
    done();
  });
  it('get a RedisSMQ instance', function(done) {
    rsmq = new RedisSMQ();
    rsmq.should.be.an.instanceOf(RedisSMQ);
    done();
  });
  it('use an existing Redis Client', function(done) {
    rsmq2 = new RedisSMQ({
      client: redis
    });
    rsmq2.should.be.an.instanceOf(RedisSMQ);
    done();
  });
  describe('Queues', function() {
    it('Should fail: Create a new queue with invalid characters in name', function(done) {
      rsmq.createQueue({
        qname: "should throw"
      }, function(err, resp) {
        err.message.should.equal("Invalid qname format");
        done();
      });
    });
    it('Should fail: Create a new queue with name longer 160 chars', function(done) {
      rsmq.createQueue({
        qname: "name01234567890123456789012345678901234567890123456789012345678901234567890123456789name01234567890123456789012345678901234567890123456789012345678901234567890123456789"
      }, function(err, resp) {
        err.message.should.equal("Invalid qname format");
        done();
      });
    });
    it('Should fail: Create a new queue with negative vt', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        vt: -20
      }, function(err, resp) {
        err.message.should.equal("vt must be between 0 and 9999999");
        done();
      });
    });
    it('Should fail: Create a new queue with non numeric vt', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        vt: "not_a_number"
      }, function(err, resp) {
        err.message.should.equal("vt must be between 0 and 9999999");
        done();
      });
    });
    it('Should fail: Create a new queue with vt too high', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        vt: 10000000
      }, function(err, resp) {
        err.message.should.equal("vt must be between 0 and 9999999");
        done();
      });
    });
    it('Should fail: Create a new queue with negative delay', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        delay: -20
      }, function(err, resp) {
        err.message.should.equal("delay must be between 0 and 9999999");
        done();
      });
    });
    it('Should fail: Create a new queue with non numeric delay', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        delay: "not_a_number"
      }, function(err, resp) {
        err.message.should.equal("delay must be between 0 and 9999999");
        done();
      });
    });
    it('Should fail: Create a new queue with delay too high', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        delay: 10000000
      }, function(err, resp) {
        err.message.should.equal("delay must be between 0 and 9999999");
        done();
      });
    });
    it('Should fail: Create a new queue with negative maxsize', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        maxsize: -20
      }, function(err, resp) {
        err.message.should.equal("maxsize must be between 1024 and 65536");
        done();
      });
    });
    it('Should fail: Create a new queue with non numeric maxsize', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        maxsize: "not_a_number"
      }, function(err, resp) {
        err.message.should.equal("maxsize must be between 1024 and 65536");
        done();
      });
    });
    it('Should fail: Create a new queue with maxsize too high', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        maxsize: 66000
      }, function(err, resp) {
        err.message.should.equal("maxsize must be between 1024 and 65536");
        done();
      });
    });
    it('Should fail: Create a new queue with maxsize too low', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        maxsize: 900
      }, function(err, resp) {
        err.message.should.equal("maxsize must be between 1024 and 65536");
        done();
      });
    });
    it('Should fail: Create a new queue with maxsize `-2`', function(done) {
      rsmq.createQueue({
        qname: queue1.name,
        maxsize: -2
      }, function(err, resp) {
        err.message.should.equal("maxsize must be between 1024 and 65536");
        done();
      });
    });
    it('ListQueues: Should return empty array', function(done) {
      rsmq.listQueues(function(err, resp) {
        should.not.exist(err);
        resp.length.should.equal(0);
        done();
      });
    });
    it('Create a new queue: queue1', function(done) {
      rsmq.createQueue({
        qname: queue1.name
      }, function(err, resp) {
        should.not.exist(err);
        resp.should.equal(1);
        done();
      });
    });
    it('Should fail: Create the same queue again', function(done) {
      rsmq.createQueue({
        qname: queue1.name
      }, function(err, resp) {
        err.message.should.equal("Queue exists");
        done();
      });
    });
    it('ListQueues: Should return array with one element', function(done) {
      rsmq.listQueues(function(err, resp) {
        should.not.exist(err);
        resp.length.should.equal(1);
        resp.should.containEql(queue1.name);
        done();
      });
    });
    it('Create a new queue: queue2', function(done) {
      rsmq.createQueue({
        qname: queue2.name,
        maxsize: 2048
      }, function(err, resp) {
        should.not.exist(err);
        resp.should.equal(1);
        done();
      });
    });
    it('ListQueues: Should return array with two elements', function(done) {
      rsmq.listQueues(function(err, resp) {
        should.not.exist(err);
        resp.length.should.equal(2);
        resp.should.containEql(queue1.name);
        resp.should.containEql(queue2.name);
        done();
      });
    });
    it('Should succeed: GetQueueAttributes of queue 1', function(done) {
      rsmq.getQueueAttributes({
        qname: queue1.name
      }, function(err, resp) {
        should.not.exist(err);
        resp.msgs.should.equal(0);
        queue1.modified = resp.modified;
        done();
      });
    });
    it('Should fail: GetQueueAttributes of bogus queue', function(done) {
      rsmq.getQueueAttributes({
        qname: "sdfsdfsdf"
      }, function(err, resp) {
        err.message.should.equal("Queue not found");
        done();
      });
    });
    it('Should fail: setQueueAttributes of bogus queue with no supplied attributes', function(done) {
      rsmq.setQueueAttributes({
        qname: "kjdsfh3h"
      }, function(err, resp) {
        err.message.should.equal("No attribute was supplied");
        done();
      });
    });
    it('Should fail: setQueueAttributes of bogus queue with supplied attributes', function(done) {
      rsmq.setQueueAttributes({
        qname: "kjdsfh3h",
        vt: 1000
      }, function(err, resp) {
        err.message.should.equal("Queue not found");
        done();
      });
    });
    it('setQueueAttributes: Should return the queue with a new vt attribute', function(done) {
      rsmq.setQueueAttributes({
        qname: queue1.name,
        vt: 1234
      }, function(err, resp) {
        resp.vt.should.equal(1234);
        resp.delay.should.equal(0);
        resp.maxsize.should.equal(65536);
        done();
      });
    });
    it('setQueueAttributes: Should return the queue with a new delay attribute', function(done) {
      this.timeout(2000);
      setTimeout(function() {
        rsmq.setQueueAttributes({
          qname: queue1.name,
          delay: 7
        }, function(err, resp) {
          resp.vt.should.equal(1234);
          resp.delay.should.equal(7);
          resp.maxsize.should.equal(65536);
          resp.modified.should.be.above(queue1.modified);
          done();
        });
      }, 1100);
    });
    it('setQueueAttributes: Should return the queue with an umlimited maxsize', function(done) {
      rsmq.setQueueAttributes({
        qname: queue1.name,
        maxsize: -1
      }, function(err, resp) {
        resp.vt.should.equal(1234);
        resp.delay.should.equal(7);
        resp.maxsize.should.equal(-1);
        done();
      });
    });
    it('setQueueAttributes: Should return the queue with a new maxsize attribute', function(done) {
      rsmq.setQueueAttributes({
        qname: queue1.name,
        maxsize: 2048
      }, function(err, resp) {
        resp.vt.should.equal(1234);
        resp.delay.should.equal(7);
        resp.maxsize.should.equal(2048);
        done();
      });
    });
    it('setQueueAttributes: Should return the queue with a new attribute', function(done) {
      rsmq.setQueueAttributes({
        qname: queue1.name,
        maxsize: 65536,
        vt: 30,
        delay: 0
      }, function(err, resp) {
        resp.vt.should.equal(30);
        resp.delay.should.equal(0);
        resp.maxsize.should.equal(65536);
        done();
      });
    });
    it('Should fail:setQueueAttributes: Should not accept too small maxsize', function(done) {
      rsmq.setQueueAttributes({
        qname: queue1.name,
        maxsize: 50
      }, function(err, resp) {
        err.message.should.equal("maxsize must be between 1024 and 65536");
        done();
      });
    });
    it('Should fail:setQueueAttributes: Should not accept negative value', function(done) {
      rsmq.setQueueAttributes({
        qname: queue1.name,
        vt: -5
      }, function(err, resp) {
        err.message.should.equal("vt must be between 0 and 9999999");
        done();
      });
    });
  });
  describe('Messages', function() {
    it('Should fail: Send a message to non-existing queue', function(done) {
      rsmq.sendMessage({
        qname: "rtlbrmpft",
        message: "foo"
      }, function(err, resp) {
        err.message.should.equal("Queue not found");
        done();
      });
    });
    it('Should fail: Send a message without any parameters', function(done) {
      rsmq.sendMessage({}, function(err, resp) {
        err.message.should.equal("No qname supplied");
        done();
      });
    });
    it('Should fail: Send a message without a message key', function(done) {
      rsmq.sendMessage({
        qname: queue1.name,
        messXage: "Hello"
      }, function(err, resp) {
        err.message.should.equal("Message must be a string");
        done();
      });
    });
    it('Should fail: Send a message with message being a number', function(done) {
      rsmq.sendMessage({
        qname: queue1.name,
        message: 123
      }, function(err, resp) {
        err.message.should.equal("Message must be a string");
        done();
      });
    });
    it('Send message 1 with existing Redis instance', function(done) {
      rsmq2.sendMessage({
        qname: queue1.name,
        message: "Hello"
      }, function(err, resp) {
        should.not.exist(err);
        q1m1 = {
          id: resp,
          message: "Hello"
        };
        done();
      });
    });
    it('Send 1000 messages to queue2: succeed', function(done) {
      var i, j, pq;
      pq = [];
      for (i = j = 0; j < 1000; i = ++j) {
        pq.push({
          qname: queue2.name,
          message: "test message number:" + i
        });
      }
      async.map(pq, rsmq.sendMessage, function(err, resp) {
        var e, k, len;
        for (k = 0, len = resp.length; k < len; k++) {
          e = resp[k];
          q2msgs[e] = 1;
          e.length.should.equal(32);
        }
        _.keys(q2msgs).length.should.equal(1000);
        done();
      });
    });
    it('Send message 2', function(done) {
      rsmq.sendMessage({
        qname: queue1.name,
        message: "World"
      }, function(err, resp) {
        should.not.exist(err);
        q1m2 = {
          id: resp,
          message: "World"
        };
        done();
      });
    });
    it('Receive a message. Should return message 1', function(done) {
      rsmq2.receiveMessage({
        qname: queue1.name
      }, function(err, resp) {
        resp.id.should.equal(q1m1.id);
        done();
      });
    });
    it('Receive a message. Should return message 2', function(done) {
      rsmq.receiveMessage({
        qname: queue1.name
      }, function(err, resp) {
        resp.id.should.equal(q1m2.id);
        done();
      });
    });
    it('Check queue properties. Should have 2 msgs', function(done) {
      rsmq.getQueueAttributes({
        qname: queue1.name
      }, function(err, resp) {
        resp.msgs.should.equal(2);
        resp.hiddenmsgs.should.equal(2);
        done();
      });
    });
    it('Send message 3', function(done) {
      rsmq.sendMessage({
        qname: queue1.name,
        message: "Booo!!"
      }, function(err, resp) {
        should.not.exist(err);
        q1m3 = {
          id: resp,
          message: "Booo!!"
        };
        done();
      });
    });
    it('Check queue properties. Should have 3 msgs', function(done) {
      rsmq.getQueueAttributes({
        qname: queue1.name
      }, function(err, resp) {
        resp.msgs.should.equal(3);
        resp.totalrecv.should.equal(2);
        done();
      });
    });
    it('Pop a message. Should return message 3 and delete it', function(done) {
      rsmq.popMessage({
        qname: queue1.name
      }, function(err, resp) {
        resp.id.should.equal(q1m3.id);
        done();
      });
    });
    it('Check queue properties. Should have 2 msgs', function(done) {
      rsmq.getQueueAttributes({
        qname: queue1.name
      }, function(err, resp) {
        resp.msgs.should.equal(2);
        resp.totalrecv.should.equal(3);
        done();
      });
    });
    it('Pop a message. Should not return a message', function(done) {
      rsmq.popMessage({
        qname: queue1.name
      }, function(err, resp) {
        should.not.exist(resp.id);
        done();
      });
    });
    it('Should fail. Set the visibility of a non existing message', function(done) {
      rsmq.changeMessageVisibility({
        qname: queue1.name,
        id: "abcdefghij0123456789abcdefghij01",
        vt: 10
      }, function(err, resp) {
        resp.should.equal(0);
        done();
      });
    });
    it('Set new visibility timeout of message 2 to 10s', function(done) {
      rsmq.changeMessageVisibility({
        qname: queue1.name,
        id: q1m2.id,
        vt: 10
      }, function(err, resp) {
        resp.should.equal(1);
        done();
      });
    });
    it('Receive a message. Should return nothing', function(done) {
      rsmq.receiveMessage({
        qname: queue1.name
      }, function(err, resp) {
        should.not.exist(resp.id);
        done();
      });
    });
    it('Set new visibility timeout of message 2 to 0s', function(done) {
      rsmq.changeMessageVisibility({
        qname: queue1.name,
        id: q1m2.id,
        vt: 0
      }, function(err, resp) {
        resp.should.equal(1);
        done();
      });
    });
    it('Receive a message. Should return message 2', function(done) {
      rsmq.receiveMessage({
        qname: queue1.name
      }, function(err, resp) {
        resp.id.should.equal(q1m2.id);
        done();
      });
    });
    it('Receive a message. Should return nothing', function(done) {
      rsmq.receiveMessage({
        qname: queue1.name
      }, function(err, resp) {
        should.not.exist(resp.id);
        done();
      });
    });
    it('Should fail: Delete a message without supplying an id', function(done) {
      rsmq.deleteMessage({
        qname: queue1.name
      }, function(err, resp) {
        err.message.should.equal("No id supplied");
        done();
      });
    });
    it('Should fail: Delete a message with invalid id', function(done) {
      rsmq.deleteMessage({
        qname: queue1.name,
        id: "sdafsdf"
      }, function(err, resp) {
        err.message.should.equal("Invalid id format");
        done();
      });
    });
    it('Delete message 1. Should return 1', function(done) {
      rsmq.deleteMessage({
        qname: queue1.name,
        id: q1m1.id
      }, function(err, resp) {
        resp.should.equal(1);
        done();
      });
    });
    it('Delete message 1 again. Should return 0', function(done) {
      rsmq.deleteMessage({
        qname: queue1.name,
        id: q1m1.id
      }, function(err, resp) {
        resp.should.equal(0);
        done();
      });
    });
    it('Set new visibility timeout of message 1. Should return 0.', function(done) {
      rsmq.changeMessageVisibility({
        qname: queue1.name,
        id: q1m1.id,
        vt: 10
      }, function(err, resp) {
        resp.should.equal(0);
        done();
      });
    });
    it('Should fail: Send a message that is too long', function(done) {
      var j, results, text;
      text = JSON.stringify((function() {
        results = [];
        for (j = 0; j <= 15000; j++){ results.push(j); }
        return results;
      }).apply(this));
      rsmq.sendMessage({
        qname: queue1.name,
        message: text
      }, function(err, resp) {
        should.not.exist(resp);
        err.message.should.equal("Message too long");
        done();
      });
    });
    it('Receive 1000 messages from queue2 and delete 500 (those where number is even)', function(done) {
      var i, j, pq;
      pq = [];
      for (i = j = 0; j < 1000; i = ++j) {
        pq.push({
          qname: queue2.name,
          vt: 0
        });
      }
      async.map(pq, rsmq.receiveMessage, function(err, resp) {
        var dq, e, k, len;
        dq = [];
        for (k = 0, len = resp.length; k < len; k++) {
          e = resp[k];
          if (!(!(e.message.split(":")[1] % 2))) {
            continue;
          }
          dq.push({
            qname: queue2.name,
            id: e.id
          });
          delete q2msgs[e.id];
        }
        async.map(dq, rsmq.deleteMessage, function(err, resp) {
          var l, len1;
          for (l = 0, len1 = resp.length; l < len1; l++) {
            e = resp[l];
            e.should.equal(1);
          }
          done();
        });
      });
    });
    it('GetQueueAttributes: Should return queue attributes', function(done) {
      rsmq.getQueueAttributes({
        qname: queue2.name
      }, function(err, resp) {
        should.not.exist(err);
        resp.msgs.should.equal(500);
        done();
      });
    });
    it('Receive 500 messages from queue2 and delete them', function(done) {
      var i, j, pq;
      pq = [];
      for (i = j = 0; j < 500; i = ++j) {
        pq.push({
          qname: queue2.name,
          vt: 0
        });
      }
      async.map(pq, rsmq.receiveMessage, function(err, resp) {
        var dq, e, k, len;
        dq = [];
        for (k = 0, len = resp.length; k < len; k++) {
          e = resp[k];
          if (!(e.message.split(":")[1] % 2)) {
            continue;
          }
          dq.push({
            qname: queue2.name,
            id: e.id
          });
          delete q2msgs[e.id];
        }
        async.map(dq, rsmq.deleteMessage, function(err, resp) {
          var l, len1;
          for (l = 0, len1 = resp.length; l < len1; l++) {
            e = resp[l];
            e.should.equal(1);
          }
          done();
          _.keys(q2msgs).length.should.equal(0);
        });
      });
    });
    it('Receive a message from queue2. Should return {}', function(done) {
      rsmq.receiveMessage({
        qname: queue2.name
      }, function(err, resp) {
        should.not.exist(resp.id);
        done();
      });
    });
    it('GetQueueAttributes: Should return queue attributes', function(done) {
      rsmq.getQueueAttributes({
        qname: queue2.name
      }, function(err, resp) {
        should.not.exist(err);
        resp.totalrecv.should.equal(1500);
        resp.totalsent.should.equal(1000);
        resp.msgs.should.equal(0);
        done();
      });
    });
    it('setQueueAttributes: Should return the queue2 with an umlimited maxsize', function(done) {
      rsmq.setQueueAttributes({
        qname: queue2.name,
        delay: 0,
        vt: 30,
        maxsize: -1
      }, function(err, resp) {
        resp.vt.should.equal(30);
        resp.delay.should.equal(0);
        resp.maxsize.should.equal(-1);
        done();
      });
    });
    return it('Send/Recevice a longer than 64k msg to test unlimited functionality', function(done) {
      var longmsg;
      longmsg = looong_string();
      rsmq.sendMessage({
        qname: queue2.name,
        message: longmsg
      }, function(err, resp1) {
        should.not.exist(err);
        rsmq.receiveMessage({
          qname: queue2.name
        }, function(err, resp2) {
          should.not.exist(err);
          resp2.message.should.equal(longmsg);
          resp2.id.should.equal(resp1);
          done();
        });
      });
    });
  });
  describe('CLEANUP', function() {
    it('Remove  queue1.name', function(done) {
      rsmq.deleteQueue({
        qname: queue1.name
      }, function(err, resp) {
        should.not.exist(err);
        resp.should.equal(1);
        done();
      });
    });
    it('Remove queue2', function(done) {
      rsmq.deleteQueue({
        qname: queue2.name
      }, function(err, resp) {
        should.not.exist(err);
        resp.should.equal(1);
        done();
      });
    });
  });
});
