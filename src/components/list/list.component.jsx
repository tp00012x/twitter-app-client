import React from "react";
import {List} from 'semantic-ui-react'

const DomainList = ({topDomains}) => {
    return (
        <List as='ol'>
            {topDomains.map((domain, index) => {
                return <List.Item as='li' key={index}>{domain}</List.Item>
            })}
        </List>
    )
};

export default DomainList;
