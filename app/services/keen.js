import Ember from 'ember';
import ENV from "elixirhunt/config/environment";

export default Ember.Service.extend({

    projectId: ENV.KEEN_PROJECT_ID,
    writeKey: ENV.KEEN_WRITE_KEY,
    readKey: ENV.KEEN_READ_KEY,

    baseUrl() {
        return `https://api.keen.io/3.0/projects/${this.get('projectId')}`;
    },

    count(collection, timeframe) {

        const url = this.baseUrl() + '/queries/count';

        return $.get(url, {
            event_collection: collection,
            timeframe: timeframe,
            api_key: this.get('readKey')
        });

    },

    send(event, attributes) {
        const url = this.baseUrl() + '/events/' + event;

        return Ember.$.ajax({
            type: 'POST',
            headers: {
                Authorization: this.get('writeKey')
            },
            url: url,
            contentType: 'application/json',
            crossDomain: true,
            xhrFields: {
                withCredentials: false
            },
            data: JSON.stringify(attributes),
            dataType: 'json'
        });
    }

});