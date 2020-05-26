import {parseDomain, fromUrl} from "parse-domain";

const baseURl = 'http://localhost:3001'

export class APIUtils {
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

export class SidebarUtils {
    constructor(homeTimelines) {
        this.homeTimelines = homeTimelines;
    }

    getUserWithMostLinks() {
        const counter = {};
        for (let homeTimeline of this.homeTimelines) {
            const screenName = homeTimeline.user.screen_name;
            if (counter.hasOwnProperty(screenName)) {
                counter[screenName] += 1;
            } else {
                counter[screenName] = 1;
            }
        }
        return Object.keys(counter).reduce((a, b) => counter[a] > counter[b] ? a : b);
    }

    getTopDomains() {
        const domainCounter = {};
        const allUrls = this._getAllUrls();
        for (let url of allUrls) {
            const domain = parseDomain(fromUrl(url)).hostname;
            if (domainCounter.hasOwnProperty(domain)) {
                domainCounter[domain] += 1;
            } else {
                domainCounter[domain] = 1;
            }
        }
        return this._sortDomains(domainCounter)
    }

    getLocations() {
        const locations = this.homeTimelines.map((homeTimeline) => {
            return homeTimeline.place?.name;
        }).filter((place) => place !== undefined);

        locations.unshift('-');
        return locations;
    }

    _sortDomains(domains) {
        return Object.keys(domains).sort((a, b) => {
            return domains[b] - domains[a]
        });
    }

    _getAllUrls() {
        const allUrls = [];
        for (let homeTimeline of this.homeTimelines) {
            const urls = homeTimeline.entities.urls;
            for (let url of urls) {
                allUrls.push(url.display_url);
            }
        }
        return allUrls;
    }
}

export class FilterUtils {
    constructor(homeTimelines, hashTagSearch, locationFilter) {
        this.homeTimelines = homeTimelines;
        this.hashTagSearch = hashTagSearch;
        this.locationFilter = locationFilter;
    }

    getFilteredHomeTimeLines() {
        return this.homeTimelines.filter((homeTimeline) => {
            if (this.hashTagSearch !== '') {
                for (let hashtag of homeTimeline.entities.hashtags) {
                    return hashtag.text.toLowerCase().includes(this.hashTagSearch);
                }
            } else {
                return true;
            }
        }).filter((homeTimeline) => {
            if (this.locationFilter !== '' && this.locationFilter !== '-') {
                return homeTimeline.place?.name === this.locationFilter;
            } else {
                return true
            }
        })
    }
}