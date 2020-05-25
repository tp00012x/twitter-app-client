import React from "react";
import {Navbar, Button} from 'react-bootstrap';
import {auth} from '../../firebase/firebase.utils';

const Header = ({setCurrentUser, setHomeTimelines}) => {
    const onClickHandle = async () => {
        await auth.signOut()
        setCurrentUser(null);
        setHomeTimelines(null);
        localStorage.removeItem('homeTimelines');
        localStorage.removeItem('cachedTimestamp');
    }

    return (
        <Navbar>
            <Navbar.Brand>Twitter HomeTimelines</Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    <Button variant="dark" onClick={onClickHandle}>
                        Sign out
                    </Button>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    )
};


export default Header;
