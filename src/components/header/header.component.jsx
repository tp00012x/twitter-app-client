import React from "react";
import "./header.styles.scss";
import {auth} from '../../firebase/firebase.utils';
import CustomButton from "../custom-button/custom-button.component";

const Header = ({setCurrentUser, setHomeTimelines}) => {
    const onClickHandle = async () => {
        await auth.signOut()
        setCurrentUser(null);
        setHomeTimelines(null);
        localStorage.removeItem('homeTimelines');
        localStorage.removeItem('cachedTimestamp');
    }

    return (
        <div className="header">
            <CustomButton className="option" onClick={onClickHandle}>
                SIGN OUT
            </CustomButton>
        </div>
    )
};


export default Header;
