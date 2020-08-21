import React from "react";
import pagination from "./pagination";

export const PageNumber = props => {
	let arr = pagination(props.currentPage, props.totalPages);

	let _arr = arr.map(i => {
		return (
			<a
				key={`pageNumber-${i}`}
				className={`${i === props.currentPage ? "active" : ""}`}
				onClick={props.clickPageNumber.bind(this, i)}>
				{i}
			</a>
		);
	});

	return (
		<div className="pagination">
			<a onClick={props.clickPageNumber.bind(this, "lastPage")}>❮</a>
			{_arr}
			<a onClick={props.clickPageNumber.bind(this, "nextPage")}>❯</a>
		</div>
	);
};
