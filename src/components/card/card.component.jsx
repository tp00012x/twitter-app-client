import React from "react";
import {Card, Feed} from 'semantic-ui-react'

const CardWrapper = ({children, header}) => {
    return (
        <Card style={{background: 'linear-gradient(150deg, #5858ac 0%, #77fffa 300%)'}}>
            <Card.Content>
                <Card.Header>{header}</Card.Header>
            </Card.Content>
            <Card.Content>
                <Feed>
                    <Feed.Event>
                        <Feed.Content>
                            <Feed.Summary>
                                {children}
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                </Feed>
            </Card.Content>
        </Card>
    )
};

export default CardWrapper;
