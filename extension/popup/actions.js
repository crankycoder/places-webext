const ADD_LINK = 'ADD_LINK';
const REMOVE_LINK = 'REMOVE_LINK';

const WEEKDAY = {SUNDAY: 0,
                        MONDAY: 1,
                        TUESDAY: 2,
                        WEDNESDAY: 3,
                        THURSDAY: 4,
                        FRIDAY: 5,
                        SATURDAY: 6};

const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

function setVisibility(dayOfWeek, hourOfDay) {
    return {type: SET_VISIBILITY_FILTER, day: dayOfWeek, hour: hourOfDay};
}

/*
 * Add a url to the day of the week, hour of day and an integer rank.
 * Higher integers are better
 */
function addLink(dayOfWeek, hourOfDay, url, rank) {
    return {type: ADD_LINK, day: dayOfWeek, hour: hourOfDay, url: url, rank: rank};
}

function removeLink(dayOfWeek, hourOfDay, url) {
    return {type: REMOVE_LINK, day: dayOfWeek, hour: hourOfDay, url: url};
}