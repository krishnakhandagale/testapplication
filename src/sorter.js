import {Component} from "react";
import React from "react";
import {sortArrayByProperty} from "./utils/utilities";

class Sorter extends Component {
    constructor(props) {
        super(props);
        this.onChangeSortOption = this.onChangeSortOption.bind(this);
    }

    onChangeSortOption(e) {
        let optionSelected = e.target.value;
        this.setState({
            sortBy: optionSelected
        });
        if (e.target.value) {
            if (this.props.data && this.props.data.length) {
                this.props.onDataSorted(sortArrayByProperty(this.props.data, optionSelected));
            }
        }
    }

    render() {
        return (
            <div className="left-side-text">
                <select className="filter" onChange={(e) => this.onChangeSortOption(e)}>
                    <option value=""> Sort By</option>
                    {
                        this.props.options.map(function (option, index) {
                            return(
                                <option key={index} value={option}>{option}</option>
                            )
                        })
                    }
                </select>
            </div>
        );
    }
}
export  default Sorter;