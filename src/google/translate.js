define([
  'jquery',
  'underscore'
], function() {

  var callbacks = [];
  var ready = false;

  var languages = {
    'afrikaans': 'af',
    'albanian': 'sq',
    'arabic': 'ar',
    'azerbaijani': 'az',
    'basque': 'eu',
    'bengali': 'bn',
    'belarusian': 'be',
    'bulgarian': 'bg',
    'catalan': 'ca',
    'chinese': 'zh-CN',
    'chinese simplified': 'zh-CN',
    'chinese traditional': 'zh-TW',
    'croatian': 'hr',
    'czech': 'cs',
    'danish': 'da',
    'dutch': 'nl',
    'english': 'en',
    'esperanto': 'eo',
    'estonian': 'et',
    'filipino': 'tl',
    'finnish': 'fi',
    'french': 'fr',
    'galician': 'gl',
    'georgian': 'ka',
    'german': 'de',
    'greek': 'el',
    'gujarati': 'gu',
    'haitian Creole': 'ht',
    'hebrew': 'iw',
    'hindi': 'hi',
    'hungarian': 'hu',
    'icelandic': 'is',
    'indonesian': 'id',
    'irish': 'ga',
    'italian': 'it',
    'japanese': 'ja',
    'kannada': 'kn',
    'korean': 'ko',
    'latin': 'la',
    'latvian': 'lv',
    'lithuanian': 'lt',
    'macedonian': 'mk',
    'malay': 'ms',
    'maltese': 'mt',
    'norwegian': 'no',
    'persian': 'fa',
    'polish': 'pl',
    'portuguese': 'pt',
    'romanian': 'ro',
    'russian': 'ru',
    'serbian': 'sr',
    'slovak': 'sk',
    'slovenian': 'sl',
    'spanish': 'es',
    'swahili': 'sw',
    'swedish': 'sv',
    'tamil': 'ta',
    'telugu': 'te',
    'thai': 'th',
    'turkish': 'tr',
    'ukrainian': 'uk',
    'urdu': 'ur',
    'vietnamese': 'vi',
    'welsh': 'cy',
    'yiddish': 'yi'
  };

  var key  = 'AIzaSyCI0d6x2G4HPqC0bl1zKwtLdNdrf3rEOuo';
  var base = 'https://www.googleapis.com/language/translate/v2';
  var url  = [
    base,
    '?key=',
    key,
    '&'
    // 'prettyprint=true&'
  ].join('');

  /**
   * Get the most up-to-date languages
   */
  $.get(base + '/languages?key=' + key, function(resp) {
    translate.available = _.map(resp.data.languages, function(o) {
      return o.language;
    });
    ready = true;
    _.each(callbacks, function(callback) {
      if (_.isFunction(callback)) {
        callback();
      }
    });
    callbacks.length = 0;
  });

  var translate = {

    ready: function(func) {
      if (ready) {
        func();
      } else {
        callbacks.push(func);
      }
      return this;
    },

    available: ['en', 'es', 'jp'],

    languages: languages,

    query: function(text, dest, callback) {

      var target = languages[dest.toLowerCase()];

      if (_.isUndefined(target) || _.isEmpty(text)) {
        callback(text);
        return;
      }

      var q = [
        url,
        'q=',
        encodeURIComponent(text),
        '&target=',
        target
      ].join('');

      $.get(q, function(resp) {
        if (_.isFunction(callback)) {
          callback(resp);
        }
      });

    }

  };

  return translate;

});