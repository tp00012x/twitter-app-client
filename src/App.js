import React, {Fragment, useEffect, useState} from "react";
import "./App.scss";
import Particles from 'react-particles-js';
import {Col, Container, Row} from 'react-bootstrap';
import HomeTimelinesUtils from "./utils";
import SignIn from "./components/sign-in/sign-in.component";
import Home from "./components/home/home.component"
import Header from "./components/header/header.component";
import Search from './components/search/search.component';
import DomainList from "./components/list/list.component";
import CardWrapper from "./components/card/card.component";
import {auth, getUserProfileDocument} from "./firebase/firebase.utils";

const particlesOptions = {
    particles: {
        number: {
            value: 40,
            density: {
                enable: true,
                value_area: 1000
            }
        }
    }
}

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userWithMostLinks, setUserWithMostLinks] = useState(null);
    const [topDomains, setTopDomains] = useState([]);
    const [homeTimelines, setHomeTimelines] = useState(JSON.parse(localStorage.getItem('homeTimelines')));

    useEffect(() => {
        const unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                const userRef = await getUserProfileDocument(userAuth);

                // Keeping up to date the state currentUser
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

    useEffect(() => {
        if (currentUser !== null) {
            const homeTimelinesUtils = new HomeTimelinesUtils(homeTimelines);
            if (homeTimelinesUtils.shouldGetHomeTimelines()) {
                homeTimelinesUtils.fetchHomeTimelines(currentUser).then((homeTimelines) => {
                    setHomeTimelines(homeTimelines);
                    // Don't update local storage if the back-end returned an empty response.
                    // This could happen if we exceed Twitter's rate limit for /statuses/home_timeline
                    if (homeTimelines.length !== 0) {
                        console.log('saving to local storage', homeTimelines);
                        localStorage.setItem('homeTimelines', JSON.stringify(homeTimelines));
                        localStorage.setItem('cachedTimestamp', JSON.stringify(new Date()));
                    }
                });
            }
        }
    }, [currentUser])

    useEffect(() => {
        if (homeTimelines !== null) {
            const homeTimelinesUtils = new HomeTimelinesUtils(homeTimelines);
            // Calculate user with the the most links
            const userWithMostLinks = homeTimelinesUtils.getUserWithMostLinks();
            setUserWithMostLinks(userWithMostLinks);

            // Get top domains that have been shared the most
            const topDomains = homeTimelinesUtils.getTopDomains();
            setTopDomains(topDomains);
        }

    }, [homeTimelines])

    return (
        <div className="App">
            <Container>
                <Particles className='particles' params={particlesOptions}/>
                {
                    homeTimelines ? (
                        <Fragment>
                            <Header setCurrentUser={setCurrentUser} setHomeTimelines={setHomeTimelines}/>
                            <Row className="mt-3">
                                <Col sm={12} md={4} xl={4} className="m-3"/>
                                <Col sm={12} md={7} xl={7} className="m-3 text-center">
                                    <Search/>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} md={4} xl={4} className="m-3">
                                    <CardWrapper header="Top linker">
                                        {userWithMostLinks}
                                    </CardWrapper>
                                    <CardWrapper header="Top Domains Shared">
                                        <DomainList topDomains={topDomains}/>
                                    </CardWrapper>
                                </Col>
                                <Col sm={12} md={6} xl={7} className="m-3">
                                    <Home homeTimelines={homeTimelines}/>
                                </Col>
                            </Row>
                        </Fragment>
                    ) : (
                        <SignIn/>
                    )
                }
            </Container>
        </div>
    )
}

export default App;