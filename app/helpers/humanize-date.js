import Ember from 'ember';

export function humanizeDate([date]) {
  const now = moment();

  return moment(date).from(now);
}

export default Ember.Helper.helper(humanizeDate);
