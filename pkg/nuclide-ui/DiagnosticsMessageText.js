'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiagnosticsMessageText = undefined;
exports.separateUrls = separateUrls;

var _react = _interopRequireDefault(require('react'));

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Exported for testing.
function separateUrls(message) {
  // Don't match periods at the end of URLs, because those are usually just to
  // end the sentence and not actually part of the URL.
  const urlRegex = /https?:\/\/[a-zA-Z0-9/._-]*[a-zA-Z0-9/_-]/g;

  const urls = message.match(urlRegex);
  const nonUrls = message.split(urlRegex);

  const parts = [{
    isUrl: false,
    text: nonUrls[0]
  }];
  for (let i = 1; i < nonUrls.length; i++) {
    if (!(urls != null)) {
      throw new Error('Invariant violation: "urls != null"');
    }

    parts.push({
      isUrl: true,
      url: urls[i - 1]
    });
    parts.push({
      isUrl: false,
      text: nonUrls[i]
    });
  }
  return parts;
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   * @format
   */

const LEADING_WHITESPACE_RE = /^\s+/;
const NBSP = '\xa0';
function renderRowWithLinks(message, rowIndex) {
  const messageWithWhitespace = message.replace(LEADING_WHITESPACE_RE, whitespace => NBSP.repeat(whitespace.length));
  const parts = separateUrls(messageWithWhitespace).map((part, index) => {
    if (!part.isUrl) {
      return part.text;
    } else {
      const openUrl = () => {
        _electron.shell.openExternal(part.url);
      };
      return _react.default.createElement(
        'a',
        { href: '#', key: index, onClick: openUrl },
        part.url
      );
    }
  });

  return _react.default.createElement(
    'div',
    { key: rowIndex },
    parts
  );
}

const DiagnosticsMessageText = exports.DiagnosticsMessageText = props => {
  const { message } = props;
  if (message.html != null) {
    return _react.default.createElement('span', { dangerouslySetInnerHTML: { __html: message.html } });
  } else if (message.text != null) {
    return _react.default.createElement(
      'span',
      null,
      message.text.split('\n').map(renderRowWithLinks)
    );
  } else {
    return _react.default.createElement(
      'span',
      null,
      'Diagnostic lacks message.'
    );
  }
};