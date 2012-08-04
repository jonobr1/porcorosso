define([
  'jquery',
  'underscore'
], function() {

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
    'chinese Simplified': 'zh-CN',
    'chinese Traditional': 'zh-TW',
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

  var key = 'AIzaSyCI0d6x2G4HPqC0bl1zKwtLdNdrf3rEOuo';
  var url = [
    'https://www.googleapis.com/language/translate/v2?',
    'key=',
    key,
    '&'
    // 'prettyprint=true&'
  ].join('');

  return {

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

});