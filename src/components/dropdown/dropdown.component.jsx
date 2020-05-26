import React from 'react'
import {Dropdown} from 'semantic-ui-react'


const DropdownLocationFilter = ({locations, setLocationFilter}) => {
    const updateLocationFilter = (event) => {
        const tagName = event.target.tagName;
        const text = tagName === 'SPAN' ? event.target.innerText : event.target.querySelector('span').innerText;
        setLocationFilter(text);
    }

    return (
        <Dropdown
            text='Location Filter'
            icon='location arrow'
            floating
            labeled
            button
            className='icon'
        >
            <Dropdown.Menu>
                <Dropdown.Menu scrolling>
                    {locations.map((location, index) => (
                        <Dropdown.Item key={index} text={location} onClick={updateLocationFilter}/>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default DropdownLocationFilter;