import React, {Fragment, useState, useEffect} from "react";
import "./App.scss";
import Particles from 'react-particles-js';
import {Container, Row, Col, InputGroup, FormControl} from 'react-bootstrap';
import SignIn from "./components/sign-in/sign-in.component";
import {auth, getUserProfileDocument} from "./firebase/firebase.utils";
import Home from "./components/home/home.component"
import Header from "./components/header/header.component";

const baseURl = 'http://localhost:3001'

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

    const getHomeTimelines = async (user) => {
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
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            placeholder="Username"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} md={4} xl={4} className="m-3">
                                    Anthony is a Sexy Daddy
                                </Col>
                                <Col sm={12} md={7} xl={7} className="m-3">
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