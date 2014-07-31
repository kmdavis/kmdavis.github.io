define(

[
  'vendor/underscore',
  'vendor/jquery',
  'vendor/when',
  'vendor/handlebars'
],

function (_, $, when, handlebars) {
  'use strict';

  var BROWSERS = [
    {
      regex: /firefox\/(\d+\.\d+)/i,
      minVersion: 31
    },
    {
      regex: /chrome\/(\d+\.\d+)/i,
      minVersion: 24
    },
    {
      regex: /opr\/(\d+\.\d+)/i,
      minVersion: 15
    },
    {
      regex: /applewebkit\/(\d+\.\d+)/i,
      minVersion: 537.38
    }
  ];

  /**
   * Detects support for the %c console logging token, via a combination of
   * feature detection (for firebug) and userAgent sniffing.
   *
   * @private
   * @method  browserSupportsColorizedLogging
   *
   * @return  {Boolean}
   */
  function browserSupportsColorizedLogging () {
    return (
      // Firebug:
      (window.console && console.log.toString().indexOf('apply') !== -1) ||

      // Native:
      _.any(BROWSERS, function (browser) {
        var match = navigator.userAgent.match(browser.regex);
        if (match) {
          return (parseFloat(match[1]) >= browser.minVersion);
        }
      })
    );
  }

  /**
   * Prints a pretty red banner in the console (if the browser supports such.)
   *
   * @private
   * @method  banner
   */
  function banner () {
    if (window.console) {
      if (console.clear) {
        console.clear();
      }

      // wait a tick, since console.clear isn't synchronous in all browsers
      setTimeout(function () {
        if (browserSupportsColorizedLogging()) {
          var
            OBSERVED_WIDTH_IN_CHROME_36 = 719,// 756,
            margins = (window.innerWidth - (OBSERVED_WIDTH_IN_CHROME_36) - 15) / 2,
            styles = [
              'line-height: 140px; font-family: serif; color: #000; background-color: #d64546;',
              // NOTE: these paddings/margins are optimized for Chrome only; I make no guarantees about other browsers/firebug.
              'font-size: 20px; padding: 68px 5px 55px ' + margins + 'px; margin-left: -24px;',
              'font-size: 40px; padding: 50px 5px; font-weight: bold;',
              'font-style: italic;',
              'font-size: 20px; padding: 68px ' + margins + 'px 55px 5px; margin-right: -22px;',
            ];

          console.log(
            '%cHi! My name is %cKevan%c"Dizzle"%cDavis%c, and this is my Résumé',
            styles[0] + styles[1],
            styles[0] + styles[2],
            styles[0] + styles[2] + styles[3],
            styles[0] + styles[2],
            styles[0] + styles[4]
          );
        } else {
          console.log('Hi! My name is Kevan "Dizzle" Davis, and this is my Résumé');
        }
      });
    }
  }

  function renderAll () {
    when.join(
      $.getJSON('data/resume.json'),
      $.get('templates/resume-experiences.hbs'),
      $.get('templates/resume-skills.hbs'),
      $.get('templates/resume-portfolio.hbs')
    ).then(function (results) {
      var
        data = results[0],
        experiences = handlebars.compile(results[1]),
        skills = handlebars.compile(results[2]),
        portfolio = handlebars.compile(results[3]);

      $('.experiences').html(experiences({ header: 'Experience', organizations: data.experiences }));
      //$('.schools').html(experiences({ header: 'Education', organizations: data.schools }));
      $('.skills').html(skills(data));
      $('.portfolio').html(portfolio(data));
    }).otherwise(function (err) {
      console.error(err);
    });
  }

  /**
   * Inits the Résumé.
   *
   * @public
   * @method init
   */
  function init () {
    banner();
    renderAll();
  }

  return {
    init: _.once(init)
  };
});
