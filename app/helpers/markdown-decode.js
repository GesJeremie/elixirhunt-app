import Ember from 'ember';

export function markdownDecode([content]) {

  const breakTag = '<br/>';

  content = markdown.toHTML(content);

  return (content + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

export default Ember.Helper.helper(markdownDecode);
