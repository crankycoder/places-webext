/*
    The datastructure that represents the suggestions as a list of suggestions
    across all days and hours of the week.  That's a list that is 168 items long.

    The visibilityFilter denotes which day and hour we are currently concerned with.

     { suggestions: [
                 {day: 0, hour: 0, url: "http://someurl.com", rank: 0},
                 {day: 0, hour: 1, url: "http://someurl.com", rank: 1},
                 {day: 1, hour: 2, url: "http://someurl.com", rank: 1}],
       visibilityFilter: {day: 0, hour: 1}
     }

 */
function suggestions(state = {}, action) {
    var day = action.day;
    var hour = action.hour;
    var url = action.url;
    switch (action.type) {
        case 'UI_ADD_LINK':
            let count = action.count;

            if (!(day in state)) {
                state[day] = {};
            }
            if (!(hour in state[day])) {
                state[day][hour] = {};
            }

            if (!(url in state[day][hour])) {
                state[day][hour][url] = count;
            }

            if (!('titles' in state)) {
                state['titles'] = {};
            }
            state['titles'][url] = action.title;

            return state;
            break;
        case 'ADD_LINK':
            if (!(day in state)) {
                state[day] = {};
            }
            if (!(hour in state[day])) {
                state[day][hour] = {};
            }

            if (!(url in state[day][hour])) {
                state[day][hour][url] = 1;
            } else {
                state[day][hour][url] += 1;
            }

            if (!('titles' in state)) {
                state['titles'] = {};
            }
            state['titles'][url] = action.title;

            return state;
            break;
        case 'PRECOMPUTE':
            browser.runtime.sendMessage({'type': 'PRECOMPUTE', 'action': action});
            break;
        default:
            return state;
    }
};

function visibilityFilter(state={}, action) {
    if (action.type === 'SET_VISIBILITY_FILTER') {
        return action.filter;
    } else {
        return state;
    }
}

function heatmapApp(state={}, action) {
    return {suggestions: suggestions(state.suggestions, action),
            visibilityFilter: visibilityFilter(state.visibilityFilter, action)};
};
