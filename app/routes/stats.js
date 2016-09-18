import Ember from 'ember';

export default Ember.Route.extend({

    keen: Ember.inject.service(),

    model() {
        return Ember.RSVP.hash({
            apply_clicks_this_day: this.get('keen').count('click-apply', 'this_1_day'),
            apply_clicks_this_week: this.get('keen').count('click-apply', 'this_1_weeks'),
            apply_clicks_this_month: this.get('keen').count('click-apply', 'this_1_months'),
            apply_clicks_this_year: this.get('keen').count('click-apply', 'this_1_years')
        });
    }

});