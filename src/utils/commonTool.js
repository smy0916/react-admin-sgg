export const formatTime = (time) => {
	if (!time) return ''
	function addZero(num) {
    return Number(num) < 10 ? `0${num}` : num
	}
	let date = new Date(time)
	return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`
}