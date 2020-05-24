import React from "react";
import "./header.styles.scss";
import {auth} from '../../firebase/firebase.utils';
import CustomButton from "../custom-button/custom-button.component";

const Header = ({currentUser}) => {

    return (
        <div className="header">
            <CustomButton className="option" onClick={() => auth.signOut()}>
                SIGN OUT
            </CustomButton>
        </div>
    )
};


export default Header;
