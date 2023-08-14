let dateUtils = {
	/**
	 * 是否为闫年
	 * @return {Boolse} true|false
	 */
	isLeapYear: function(y) {
		return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
	},

	/**
	 * 返回星期数
	 * @return {Number}
	 */
	getWhatDay: function(year, month, day) {
		let date = new Date(year + '/' + month + '/' + day);
		let index = date.getDay();
		let dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
		return dayNames[index];
	},

	/**
	 * 返回星期数
	 * @return {Number}
	 */
	getMonthPreDay: function(year, month) {
		let date = new Date(year + '/' + month + '/01');
		let day = date.getDay();
		if (day == 0) {
			day = 7;
		}
		return day;
	},

	/**
	 * 返回月份天数
	 * @return {Number}
	 */
	getMonthDays: function(year, month) {
		if (/^0/.test(month)) {
			month = month.split('')[1];
		}
		return [0, 31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	},

	/**
	 * 补齐数字位数
	 * @return {string}
	 */
	getNumTwoBit: function(n) {
		n = Number(n);
		return (n > 9 ? '' : '0') + n;
	},

	/**
	 * 日期对象转成字符串
	 * @return {string}
	 */
	date2Str: function(date, split) {
		if (typeof date == 'string') return date;
		split = split || '-';
		let y = date.getFullYear();
		let m = this.getNumTwoBit(date.getMonth() + 1);
		let d = this.getNumTwoBit(date.getDate());
		return [y, m, d].join(split);
	},
	/**
	 * 日期对象转成字符串
	 * @return {string}
	 */
	date2Str1: function(date, split = '-', hms = false) {
		if (typeof date == 'string') return date;
		let y = date.getFullYear();
		let m = this.getNumTwoBit(date.getMonth() + 1);
		let d = this.getNumTwoBit(date.getDate());
		return [y, m, d].join(split) + (hms ? ' 00:00:00' : '');
	},
	/**
	 * 日期对象转成字符串
	 * @return {string}
	 */
	date2Str2: function(date) {
		if (typeof date == 'string') return date;
		let y = date.getFullYear();
		let m = this.getNumTwoBit(date.getMonth() + 1);
		let d = this.getNumTwoBit(date.getDate());
		return `${y}年${m}月${d}日`;
	},
	formatDateStr:function(dateStr){
		if(!dateStr) return '';
		
		let date = new Date(dateStr);
		let m = this.getNumTwoBit(date.getMonth() + 1);
		let d = this.getNumTwoBit(date.getDate());
		let hh = this.getNumTwoBit(date.getHours());
		let mm = this.getNumTwoBit(date.getMinutes());
		return `${m}/${d} ${hh}:${mm}`;
	},
	/**
	 * 返回日期格式字符串
	 * @param {Number} 0返回今天的日期、1返回明天的日期，2返回后天得日期，依次类推
	 * @return {string} '2014-12-31'
	 */
	getDay: function(i) {
		i = i || 0;
		let date = new Date();
		let diff = i * (1000 * 60 * 60 * 24);
		date = new Date(date.getTime() + diff);
		return this.date2Str(date);
	},

	/**
	 * 时间戳转换为日期格式
	 * @return {String}
	 */
	timestampToDate: function(timestamp, hm = false, type = false, isYear = true) {
		let date = timestamp ? new Date(timestamp) : new Date();
		let hh = this.getNumTwoBit(date.getHours());
		let mm = this.getNumTwoBit(date.getMinutes());
		let _hm = hm ? ' ' + hh + ':' + mm : '';
		let _divider = type ? '' : '-';
		let year = isYear ? date.getFullYear() + _divider : '';
		return year + this.getNumTwoBit((date.getMonth() + 1)) + _divider + this.getNumTwoBit(date.getDate()) +
			_hm;
	},

	/**
	 * 时间比较
	 * @return {Boolean}
	 */
	compareDate: function(date1, date2) {
		let startTime = new Date(date1.replace('-', '/').replace('-', '/'));
		let endTime = new Date(date2.replace('-', '/').replace('-', '/'));
		if (startTime >= endTime) {
			return false;
		}
		return true;
	},
	/**
	 * 时间是否相等
	 * @return {Boolean}
	 */
	isEqual: function(date1, date2) {
		let startTime = new Date(date1).getTime();
		let endTime = new Date(date2).getTime();
		if (startTime == endTime) {
			return true;
		}
		return false;
	},
	nowZeroTime: function() {
		return new Date(new Date(new Date().getTime()).setHours(0, 0, 0, 0))
	},
	plusMonth: function(date, count) {
		let result = new Date(date)
		result.setMonth(date.getMonth() + count)
		return result
	},
	plusDay: function(date,count){
		let result = new Date(date)
		result.setDate(date.getDate() + count)
		return result
	},
	secondFormat(second) {
		let hours = parseInt(second / 3600)
		let mins = parseInt((second - (hours * 3600)) / 60)
		let seconds = second - (hours * 3600) - (mins * 60)
		return this.getNumTwoBit(hours) + "时" +
			this.getNumTwoBit(mins) + "分" +
			this.getNumTwoBit(seconds) + "秒"
	}
};

export default dateUtils;
