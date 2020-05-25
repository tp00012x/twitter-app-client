import React, {Fragment, useEffect, useState} from "react";
import "./App.scss";
import Particles from 'react-particles-js';
import {Col, Container, Row} from 'react-bootstrap';
import {MDBIcon} from 'mdbreact';
import SignIn from "./components/sign-in/sign-in.component";
import Home from "./components/home/home.component"
import Header from "./components/header/header.component";
import Search from './components/search/search.component';
import DomainList from "./components/list/list.component";
import CardWrapper from "./components/card/card.component";
import {APIUtils, HashTagUtils, SidebarUtils} from "./utils";
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
    const [hashTagSearch, setHashTagSearch] = useState('');
    const hashTagUtils = new HashTagUtils(homeTimelines, hashTagSearch);

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
            const apiUtils = new APIUtils(homeTimelines);
            if (apiUtils.shouldGetHomeTimelines()) {
                apiUtils.fetchHomeTimelines(currentUser).then((homeTimelines) => {
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
            // Calculate user with the the most links
            const sideBarUtils = new SidebarUtils(homeTimelines);
            const userWithMostLinks = sideBarUtils.getUserWithMostLinks();
            setUserWithMostLinks(userWithMostLinks);

            // Get top domains that have been shared the most
            const topDomains = sideBarUtils.getTopDomains();
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
                            <Header
                                setCurrentUser={setCurrentUser}
                                setHomeTimelines={setHomeTimelines}
                            />
                            <Row className="mt-3">
                                <Col sm={12} md={4} xl={4} className="m-3"/>
                                <Col sm={12} md={7} xl={7} className="m-3 text-center">
                                    <Search
                                        setHashTagSearch={setHashTagSearch}
                                        hashTagSearch={hashTagSearch}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} md={4} xl={4} className="m-3">
                                    <CardWrapper header="Top linker">
                                        <MDBIcon fab icon="twitter" className="pr-1"/> {userWithMostLinks}
                                    </CardWrapper>
                                    <CardWrapper header="Top Domains Shared">
                                        <DomainList topDomains={topDomains}/>
                                    </CardWrapper>
                                </Col>
                                <Col sm={12} md={6} xl={7} className="m-3">
                                    <Home
                                        homeTimelines={hashTagUtils.getFilteredHomeTimeLines()}
                                    />
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