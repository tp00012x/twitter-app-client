import React from "react";
import "./sign-in.styles.scss";
import {MDBBtn, MDBIcon} from 'mdbreact';
import {auth, createUserProfileDocument, provider} from "../../firebase/firebase.utils";

const SignIn = () => {
    const signInWithTwitter = async () => {
        const result = await auth.signInWithPopup(provider);
        const userAuth = result.user;
        const userCredentials = {
            twitterToken: result.credential.accessToken,
            twitterSecret: result.credential.secret
        }
        await createUserProfileDocument(userAuth, userCredentials);
    }

    return (
        <div className="sign-in">
            <MDBBtn social="tw" onClick={signInWithTwitter}>
                <MDBIcon fab icon="twitter" className="pr-1"/> Twitter
            </MDBBtn>
        </div>
    );
}

export default SignIn;
