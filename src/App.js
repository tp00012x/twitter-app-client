import React, {Fragment} from "react";
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

export default class App extends React.Component {

    state = {
        currentUser: null,
        homeTimelines: null,
        loading: true
    }

    unsubscribeFromAuth = null;

    componentDidMount() {
        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                const userRef = await getUserProfileDocument(userAuth);
                // Keeping up to date the state currentUser
                userRef.onSnapshot(snapshot => {
                    this.setState({
                        currentUser: {
                            authId: snapshot.id,
                            ...snapshot.data()
                        },
                        loading: false
                    });
                });
            } else {
                this.setState({currentUser: userAuth})
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }

    saveHomeTimelines = async (user) => {
        const response = await fetch(`${baseURl}/api/home_timeline`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(user)
        });
        return response.json()
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !!(nextState.currentUser && nextState.currentUser.createdAt) || !nextState.currentUser;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {currentUser} = this.state;
        if (prevState.currentUser !== currentUser && currentUser !== null) {
            this.saveHomeTimelines(currentUser).then((homeTimelines) => {
                this.setState({homeTimelines})
            })
        }
        if (prevState.currentUser !== currentUser && currentUser === null) {
            this.setState({homeStatuses: null})
        }
    }

    render() {
        const {currentUser, homeTimelines, loading} = this.state;
        console.log(homeTimelines);

        return (
            <div>
                {
                    currentUser ? (
                        <Fragment>
                            <Header currentUser={currentUser}/>
                            <Home homeStatuses={homeTimelines}/>
                        </Fragment>

                    ) : (
                        loading ?
                            <PacmanLoader
                                css={override}
                                size={25}
                                color={"black"}
                                loading={loading}
                            /> :
                            <SignIn/>
                    )
                }
            </div>
        );
    }
}

