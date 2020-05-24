import React, {Fragment} from "react";
import {Feed} from 'semantic-ui-react'
import "./home.styles.scss";

const Home = ({homeStatuses}) => {

    return (
        <Fragment>
            {homeStatuses ?
                homeStatuses.map(({text, createdAt, user}, index) => {
                    return (
                        <Feed key={index}>
                            <Feed.Event>
                                <Feed.Label>
                                    <img src={user.profile_image_url} alt={user.name}/>
                                </Feed.Label>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <Feed.User>{user.screen_name}</Feed.User> tweeted
                                        <Feed.Date>{new Date(createdAt).toLocaleString()}</Feed.Date>
                                    </Feed.Summary>
                                    <Feed.Extra text>
                                        {text}
                                    </Feed.Extra>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>)
                })
                : null
            }
        </Fragment>
    )
};

export default Home;