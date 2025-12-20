export const formatRelativeTime = (dateInput: string | number | Date | null | undefined): string => {
	if (!dateInput) return ''

	const createdDate = new Date(dateInput)
	if (Number.isNaN(createdDate.getTime())) return ''

	const now = new Date()
	const diff = now.getTime() - createdDate.getTime()

	const minute = 1000 * 60
	const hour = minute * 60
	const day = hour * 24
	const month = day * 30
	const year = day * 365

	if (diff < minute) return '방금 전'
	if (diff < hour) return `${Math.floor(diff / minute)}분 전`
	if (diff < day) return `${Math.floor(diff / hour)}시간 전`
	if (diff < month) return `${Math.floor(diff / day)}일 전`
	if (diff < year) return `${Math.floor(diff / month)}달 전`
	return `${Math.floor(diff / year)}년 전`
}

