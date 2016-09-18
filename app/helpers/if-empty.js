import Ember from 'ember';

export function ifEmpty(params) {
  const content = params[0];
  const replacement = params[1] || 'N/A';

  if (Ember.isEmpty(content)) {
    return replacement;
  } else {
    return content;
  }
}

export default Ember.Helper.helper(ifEmpty);
