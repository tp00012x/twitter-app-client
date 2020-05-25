import React from "react";
import {FormControl, InputGroup} from "react-bootstrap";

const Search = ({hashTagSearch, setHashTagSearch}) => {

    const onChangeHandler = (event) => {
        setHashTagSearch(event.target.value)
    };

    return (
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                placeholder="hashtag"
                aria-label="hashtag"
                aria-describedby="basic-addon1"
                value={hashTagSearch}
                onChange={onChangeHandler}
            />
        </InputGroup>
    )
};


export default Search;
