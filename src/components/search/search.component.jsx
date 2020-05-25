import React from "react";
import {FormControl, InputGroup} from "react-bootstrap";

const Search = () => {
    return (
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                placeholder="Hashtag"
                aria-label="Hashtag"
                aria-describedby="basic-addon1"
            />
        </InputGroup>
    )
};


export default Search;
