define([
  'third-party/requestAnimationFrame',
  'third-party/Tween',
  'underscore',
  'jquery'
], function(raf) {

  var loops = [];
  var TWO_PI = Math.PI * 2.0;

  var Cursor = function(width, height, flipped) {

    var _this = this;

    this.domElement = document.createElement('canvas');
    this.ctx = this.domElement.getContext('2d');

    this.width = this.domElement.width = width;
    this.height = this.domElement.height = height;

    this.flipped = !!flipped;

    this.reset();

    /**
     * Setup tweens
     */

    this.tweens = [];

    var complete = _.after(3, function() {
      _this.__animating = false;
    });

    this.tweens.push(
      pingPong(
        new TWEEN.Tween(this.body),
        { x: this.body.x },
        { x: this.width / 2 },
        100,
        complete
      )
    );

    this.tweens.push(
      pingPong(
        new TWEEN.Tween(this.ear.tip),
        { x: this.ear.tip.x, y: this.ear.tip.y },
        { x: Math.round(this.ear.radius * Math.cos(Math.PI * 1.5) + this.eye.x),
          y: Math.round(this.ear.radius * Math.sin(Math.PI * 1.5) + this.eye.y)
        },
        200,
        complete
      )
    );

    var x1 = this.width - this.eye.radius - this.nose.width / 2;
    var x2 = this.width - this.eye.radius;

    if (this.flipped) {
      x1 = this.eye.radius + this.nose.width / 2;
      x2 = this.eye.radius;
    }

    this.tweens.push(
      pingPong(
        new TWEEN.Tween(this.eye),
        { x: x1 },
        { x: x2 },
        150,
        complete
      )
    );

    this.render();

    loops.push(this);

  };

  _.extend(Cursor.prototype, {

    /**
     * Fire tweens
     */
    animate: function(callback) {

      var _this = this;

      // if (this.__animating) {
      //   return this;
      // }

      this.__animating = true;

      _.each(this.tweens, function(tween) {
        tween.stop().start();
      }, this);

      return this;

    },

    reset: function() {

      this.center = {
        x: this.width / 2,
        y: this.height / 2
      };

      var facingRight = this.flipped;

      var tenthWidth = this.width / 10;

      var w = tenthWidth;
      var h = tenthWidth;
      var x = this.width - tenthWidth;
      var y = this.height - this.height / 3 - tenthWidth / 2;

      if (facingRight) {
        x = 0;
      }

      this.nose = {
        width: w,
        height: h,
        x: x,
        y: y
      }

      var r = this.height * .4;
      x = this.height / 2;
      y = this.height - r;

      if (facingRight) {
        x = this.width - this.height / 2;
      }

      this.body = {
        radius: r,
        x: x,
        y: y
      };

      r = this.height / 3;
      x = this.width - r - this.nose.width / 2;
      y = this.height - r;

      if (facingRight) {
        x = r + this.nose.width / 2;
      }

      this.eye = {
        radius: r,
        x: x,
        y: y
      };

      r = this.height / 2;
      var a = Math.PI * 1.4;

      if (facingRight) {
        var a = Math.PI * 1.6;
      }

      this.ear = {
        radius: r,
        base: this.eye,
        tip: {
          x: Math.round(r * Math.cos(a) + this.eye.x),
          y: Math.round(r * Math.sin(a) + this.eye.y)
        }
      };

    },

    render: function() {

      var ctx = this.ctx;

      ctx.clearRect(0, 0, this.width, this.height);

      /**
       * Draw Abdomen
       */

      var body = this.body;
      var eye = this.eye;
      var ear = this.ear;
      var nose = this.nose;

      ctx.fillStyle = ctx.strokeStyle = '#6cb845';
      ctx.lineWidth = this.height / 6;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius, 0, TWO_PI, false);
      ctx.fill();

      var a = eye.x - eye.radius;
      var b = eye.y - eye.radius;
      var c = body.x + body.radius;
      var d = body.y - body.radius;

      if (this.flipped) {
        a = eye.x + eye.radius;
        c = body.x - body.radius;
      }

      ctx.beginPath();
      ctx.moveTo(body.x, this.height);
      ctx.lineTo(eye.x, this.height);
      ctx.lineTo(eye.x, eye.y - eye.radius);
      ctx.bezierCurveTo(a, b, c, d, body.x, body.y - body.radius);
      ctx.fill();

      /**
       * Draw the ear
       */

      ctx.beginPath();
      ctx.moveTo(ear.base.x, ear.base.y);
      ctx.lineTo(ear.tip.x, ear.tip.y);
      ctx.stroke();

      /**
       * Draw the nose
       */

      ctx.fillStyle = '#facbcd';
      // ctx.fillRect(nose.x, nose.y, nose.width, nose.height);
      fillRect(ctx, nose.x, nose.y, nose.width, nose.height, 5);

      /**
       * Draw the eye
       */

      ctx.fillStyle = '#efefef';

      ctx.beginPath();
      ctx.arc(eye.x, eye.y, eye.radius, 0, TWO_PI, false);
      ctx.fill();

      ctx.fillStyle = '#333';

      ctx.beginPath();
      ctx.arc(eye.x, eye.y, eye.radius / 2, 0, TWO_PI, false);
      ctx.fill();

    }

  });

  function pingPong(tween, begin, end, duration, callback) {

    tween
      .to(end, duration || 350)
      .easing(TWEEN.Easing.Circular.InOut)
      .onComplete(function() {
        tween
          .to(begin, duration || 350)
          .easing(TWEEN.Easing.Circular.InOut)
          .onComplete(function() {
            if (_.isFunction(callback)) {
              callback();
            }
            pingPong(tween, begin, end, duration, callback);
          })
          .start();
      });

    return tween;

  }

  function fillRect(ctx, x, y, w, h, r) {

    var r = r || 0;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + w);
    ctx.lineTo(x + r, y + w);
    ctx.quadraticCurveTo(x, y + w, x, y + w - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();

  }

  function animate() {
    TWEEN.update();
    _.each(loops, function(cursor) {
      cursor.render();
    })
    raf(animate);
  }

  animate();

  return Cursor;

});
