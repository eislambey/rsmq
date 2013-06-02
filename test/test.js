// Generated by CoffeeScript 1.6.2
(function() {
  var RedisSMQ, async, should, _;

  _ = require("underscore");

  should = require("should");

  async = require("async");

  RedisSMQ = require("../index");

  describe('Redis-Simple-Message-Queue Test', function() {
    var q1m1, q1m2, q2m2, q2msgs, queue1, queue2, rsmq;

    rsmq = null;
    queue1 = "test1";
    queue2 = "test2";
    q1m1 = null;
    q1m2 = null;
    q2m2 = null;
    q2msgs = {};
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
    describe('Queues', function() {
      it('Should fail: Create a new queue with invalid characters in name', function(done) {
        rsmq.createQueue({
          qname: "should throw"
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("Invalid qname format");
          done();
        });
      });
      it('Should fail: Create a new queue with name longer 80 chars', function(done) {
        rsmq.createQueue({
          qname: "name01234567890123456789012345678901234567890123456789012345678901234567890123456789"
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("Invalid qname format");
          done();
        });
      });
      it('Should fail: Create a new queue with negative vt', function(done) {
        rsmq.createQueue({
          qname: queue1,
          vt: -20
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("vt must be between 0 and 86400");
          done();
        });
      });
      it('Should fail: Create a new queue with non numeric vt', function(done) {
        rsmq.createQueue({
          qname: queue1,
          vt: "not_a_number"
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("vt must be between 0 and 86400");
          done();
        });
      });
      it('Should fail: Create a new queue with vt too high', function(done) {
        rsmq.createQueue({
          qname: queue1,
          vt: 87000
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("vt must be between 0 and 86400");
          done();
        });
      });
      it('Should fail: Create a new queue with negative delay', function(done) {
        rsmq.createQueue({
          qname: queue1,
          delay: -20
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("delay must be between 0 and 86400");
          done();
        });
      });
      it('Should fail: Create a new queue with non numeric delay', function(done) {
        rsmq.createQueue({
          qname: queue1,
          delay: "not_a_number"
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("delay must be between 0 and 86400");
          done();
        });
      });
      it('Should fail: Create a new queue with delay too high', function(done) {
        rsmq.createQueue({
          qname: queue1,
          delay: 87000
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("delay must be between 0 and 86400");
          done();
        });
      });
      it('Should fail: Create a new queue with negative maxsize', function(done) {
        rsmq.createQueue({
          qname: queue1,
          maxsize: -20
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("maxsize must be between 1024 and 65536");
          done();
        });
      });
      it('Should fail: Create a new queue with non numeric maxsize', function(done) {
        rsmq.createQueue({
          qname: queue1,
          maxsize: "not_a_number"
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("maxsize must be between 1024 and 65536");
          done();
        });
      });
      it('Should fail: Create a new queue with maxsize too high', function(done) {
        rsmq.createQueue({
          qname: queue1,
          maxsize: 66000
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("maxsize must be between 1024 and 65536");
          done();
        });
      });
      it('Should fail: Create a new queue with maxsize too low', function(done) {
        rsmq.createQueue({
          qname: queue1,
          maxsize: 900
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("maxsize must be between 1024 and 65536");
          done();
        });
      });
      it('Create a new queue: queue1', function(done) {
        rsmq.createQueue({
          qname: queue1
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.equal(1);
          done();
        });
      });
      it('Should fail: Create the same queue again', function(done) {
        rsmq.createQueue({
          qname: queue1
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("Queue exists");
          done();
        });
      });
      it('Create a new queue: queue2', function(done) {
        rsmq.createQueue({
          qname: queue2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.equal(1);
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
          should.exist(err);
          err.should.equal("Queue not found");
          done();
        });
      });
      it('Should fail: Send a message without any parameters', function(done) {
        rsmq.sendMessage({}, function(err, resp) {
          should.exist(err);
          err.should.equal("No qname supplied");
          done();
        });
      });
      it('Should fail: Send a message without a message key', function(done) {
        rsmq.sendMessage({
          qname: queue1,
          messXage: "Hello"
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("Message must be a string");
          done();
        });
      });
      it('Should fail: Send a message with message being a number', function(done) {
        rsmq.sendMessage({
          qname: queue1,
          message: 123
        }, function(err, resp) {
          should.exist(err);
          err.should.equal("Message must be a string");
          done();
        });
      });
      it('Send message 1', function(done) {
        rsmq.sendMessage({
          qname: queue1,
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
        var i, pq, _i;

        pq = [];
        for (i = _i = 0; _i < 1000; i = ++_i) {
          pq.push({
            qname: queue2,
            message: "test message number:" + i
          });
        }
        async.map(pq, rsmq.sendMessage, function(err, resp) {
          var e, _j, _len;

          for (_j = 0, _len = resp.length; _j < _len; _j++) {
            e = resp[_j];
            q2msgs[e] = 1;
            e.length.should.equal(42);
          }
          _.keys(q2msgs).length.should.equal(1000);
          done();
        });
      });
      it('Send message 2', function(done) {
        rsmq.sendMessage({
          qname: queue1,
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
        rsmq.receiveMessage({
          qname: queue1
        }, function(err, resp) {
          resp.id.should.equal(q1m1.id);
          done();
        });
      });
      it('Receive a message. Should return message 2', function(done) {
        rsmq.receiveMessage({
          qname: queue1
        }, function(err, resp) {
          resp.id.should.equal(q1m2.id);
          done();
        });
      });
      it('Receive a message. Should return nothing', function(done) {
        rsmq.receiveMessage({
          qname: queue1
        }, function(err, resp) {
          should.not.exist(resp.id);
          done();
        });
      });
      it('Should fail: Delete a message without supplying an id', function(done) {
        rsmq.deleteMessage({
          qname: queue1
        }, function(err, resp) {
          err.should.equal("No id supplied");
          done();
        });
      });
      it('Should fail: Delete a message with invalid id', function(done) {
        rsmq.deleteMessage({
          qname: queue1,
          id: "sdafsdf"
        }, function(err, resp) {
          err.should.equal("Invalid id format");
          done();
        });
      });
      it('Delete message 1. Should return 1', function(done) {
        rsmq.deleteMessage({
          qname: queue1,
          id: q1m1.id
        }, function(err, resp) {
          resp.should.equal(1);
          done();
        });
      });
      it('Delete message 1 again. Should return 0', function(done) {
        rsmq.deleteMessage({
          qname: queue1,
          id: q1m1.id
        }, function(err, resp) {
          resp.should.equal(0);
          done();
        });
      });
      it('Should fail: Send a message that is too long', function(done) {
        var text, _i, _results;

        text = JSON.stringify((function() {
          _results = [];
          for (_i = 0; _i <= 15000; _i++){ _results.push(_i); }
          return _results;
        }).apply(this));
        rsmq.sendMessage({
          qname: queue1,
          message: text
        }, function(err, resp) {
          should.not.exist(resp);
          err.should.equal("Message too long");
          done();
        });
      });
      it('Receive 1000 messages from queue2 and delete 500 (those where number is even)', function(done) {
        var i, pq, _i;

        pq = [];
        for (i = _i = 0; _i < 1000; i = ++_i) {
          pq.push({
            qname: queue2,
            vt: 0
          });
        }
        async.map(pq, rsmq.receiveMessage, function(err, resp) {
          var dq, e, _j, _len;

          dq = [];
          for (_j = 0, _len = resp.length; _j < _len; _j++) {
            e = resp[_j];
            if (!(!(e.message.split(":")[1] % 2))) {
              continue;
            }
            dq.push({
              qname: queue2,
              id: e.id
            });
            delete q2msgs[e.id];
          }
          async.map(dq, rsmq.deleteMessage, function(err, resp) {
            var _k, _len1;

            for (_k = 0, _len1 = resp.length; _k < _len1; _k++) {
              e = resp[_k];
              e.should.equal(1);
            }
            done();
          });
        });
      });
      it('Receive 500 messages from queue2 and delete them', function(done) {
        var i, pq, _i;

        pq = [];
        for (i = _i = 0; _i < 500; i = ++_i) {
          pq.push({
            qname: queue2,
            vt: 0
          });
        }
        async.map(pq, rsmq.receiveMessage, function(err, resp) {
          var dq, e, _j, _len;

          dq = [];
          for (_j = 0, _len = resp.length; _j < _len; _j++) {
            e = resp[_j];
            if (!(e.message.split(":")[1] % 2)) {
              continue;
            }
            dq.push({
              qname: queue2,
              id: e.id
            });
            delete q2msgs[e.id];
          }
          async.map(dq, rsmq.deleteMessage, function(err, resp) {
            var _k, _len1;

            for (_k = 0, _len1 = resp.length; _k < _len1; _k++) {
              e = resp[_k];
              e.should.equal(1);
            }
            done();
            _.keys(q2msgs).length.should.equal(0);
          });
        });
      });
      return it('Receive a message from queue2. Should return {}', function(done) {
        rsmq.receiveMessage({
          qname: queue2
        }, function(err, resp) {
          should.not.exist(resp.id);
          done();
        });
      });
    });
    describe('CLEANUP', function() {
      it('Remove queue1', function(done) {
        rsmq.deleteQueue({
          qname: queue1
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.equal(1);
          done();
        });
      });
      it('Remove queue2', function(done) {
        rsmq.deleteQueue({
          qname: queue2
        }, function(err, resp) {
          should.not.exist(err);
          resp.should.equal(1);
          done();
        });
      });
    });
  });

}).call(this);