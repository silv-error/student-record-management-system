export const formatPostDate = (createdAt) => {
	const currentDate = new Date();
	const createdAtDate = new Date(createdAt);

	const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	if (timeDifferenceInDays > 1) {
		return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	} else if (timeDifferenceInDays === 1) {
		return "1d";
	} else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours}h`;
	} else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes}m`;
	} else {
		return "Just now";
	}
};

export const formattedBirthDate = (createdAt) => {
	const date = new Date(createdAt);
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
  const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	return `${month} ${day}, ${year}`;
};

export const formattedTime = (time) => {

	const date = new Date(time);
	const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
	const minute = date.getMinutes();
	const amOrPm = date.getHours() >= 12 ? "PM" : "AM";
	return hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0") + " " + amOrPm;
}

export const formattedTime1 = (time) => {

	const date = new Date(time);
	const hour = date.getHours();
	const minute = date.getMinutes();
	return hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0");
}