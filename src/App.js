import React, {Fragment, useState, useEffect} from "react";
import "./App.css";
import SignIn from "./components/sign-in/sign-in.component";
import {auth, getUserProfileDocument} from "./firebase/firebase.utils";
import Home from "./components/home/home.component"
import Header from "./components/header/header.component";
import {css} from "@emotion/core";
import PacmanLoader from "react-spinners/PacmanLoader";

const override = css`
  display: block;
  margin: 22.5% auto;
  border-color: black;
`;

const baseURl = 'http://localhost:3001'

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [homeTimelines, setHomeTimelines] = useState(JSON.parse(localStorage.getItem('homeTimelines')));
    const [isSignIn, setIsSignIn] = useState(false);

    useEffect(() => {
        console.log('component did mount')
        const unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                const userRef = await getUserProfileDocument(userAuth);
                // Keeping up to date the state currentUser
                console.log('updating user')
                userRef.onSnapshot(snapshot => {
                    setCurrentUser({
                            authId: snapshot.id,
                            ...snapshot.data()
                        }
                    );
                });
            } else {
                setCurrentUser(userAuth)
            }
        });

        return () => {
            unsubscribeFromAuth();
        }
    }, [])

    const getHomeTimelines = async (user) => {
        console.log('Getting home timelines')

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
        console.log('Got HomeTimelines')
        return response.json()
    };

    const shouldRefreshHomeTimelines = () => {
        // Refresh Timeline every 5 minutes
        const lastCachedTimeStamp = new Date(JSON.parse(localStorage.getItem('cachedTimestamp')));
        const tenMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isCacheExpired = lastCachedTimeStamp < tenMinutesAgo

        // Refresh homeTimeline if not cached
        const homeTimelinesExists = homeTimelines?.length > 0

        return isCacheExpired || !homeTimelinesExists;
    }

    useEffect(() => {
        if (currentUser !== null) {
            console.log('user updated')

            if (shouldRefreshHomeTimelines()) {
                getHomeTimelines(currentUser).then((homeTimelines) => {
                    setHomeTimelines(homeTimelines)
                    console.log('saving to local storage', homeTimelines)
                    localStorage.setItem('homeTimelines', JSON.stringify(homeTimelines));
                    localStorage.setItem('cachedTimestamp', JSON.stringify(new Date()));
                });
            }
        }
    }, [currentUser])

    return (
        <Fragment>
            {
                homeTimelines ? (
                    <Fragment>
                        <Header setCurrentUser={setCurrentUser} setHomeTimelines={setHomeTimelines}/>
                        <Home homeTimelines={homeTimelines}/>
                    </Fragment>
                ) : (
                    <SignIn/>
                )
            }
        </Fragment>
    )
}

export default App;