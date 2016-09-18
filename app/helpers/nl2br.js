import Ember from 'ember';

const {
  Helper: { helper },
  String: { htmlSafe }
} = Ember;

export function nl2br([content]) {
  var breakTag = '<br />';
  return new htmlSafe((content + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2'));
}

export default Ember.Helper.helper(nl2br);
