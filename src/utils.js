const baseURl = 'http://localhost:3001'

export default class HomeTimelinesUtils {
    constructor(homeTimelines) {
        this.homeTimelines = homeTimelines
    }

    shouldGetHomeTimelines() {
        // Refresh Timeline every minute
        const lastCachedTimeStamp = new Date(JSON.parse(localStorage.getItem('cachedTimestamp')));
        const tenMinutesAgo = new Date(Date.now() - 60 * 1000);
        const isCacheExpired = lastCachedTimeStamp < tenMinutesAgo;

        // Refresh homeTimeline if not cached
        const homeTimelinesExists = this.homeTimelines?.length > 0;

        return isCacheExpired || !homeTimelinesExists;
    }

    async fetchHomeTimelines(user) {
        const response = await fetch(`${baseURl}/api/home_timeline`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(user)
        });
        return response.json();
    };
}
