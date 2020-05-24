import React from "react";
import "./sign-in.styles.scss";
import CustomButton from "../custom-button/custom-button.component";
import {auth, provider, createUserProfileDocument} from "../../firebase/firebase.utils";

class SignIn extends React.Component {

    signInWithTwitter = async () => {
        const result = await auth.signInWithPopup(provider);
        const userAuth = result.user;
        const userCredentials = {
            twitterToken: result.credential.accessToken,
            twitterSecret: result.credential.secret
        }
        await createUserProfileDocument(userAuth, userCredentials);
    }

    render() {
        return (
            <div className="sign-in">
                <CustomButton onClick={this.signInWithTwitter} isGoogleSignIn>
                    Sign With Twitter
                </CustomButton>
            </div>
        );
    }
}

export default SignIn;
