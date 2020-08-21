export default (currentPage, totalPages) => {
	let pairs = 2,
		range = [1];

	if (totalPages <= 1) return range;

	let range_of_head = currentPage - pairs;
	let range_of_tail = currentPage + pairs;
	for (let i = range_of_head; i <= range_of_tail; i++) {
		if (i < totalPages && i > 1) range.push(i);
	}
	range.push(totalPages);

	let tmp,
		rangeWithDots = [];
	for (let i of range) {
		if (tmp) {
			if (i - tmp === 2) {
				rangeWithDots.push(tmp + 1);
			} else if (i - tmp !== 1) {
				rangeWithDots.push("...");
			}
		}
		rangeWithDots.push(i);
		tmp = i;
	}

	return rangeWithDots;
};
