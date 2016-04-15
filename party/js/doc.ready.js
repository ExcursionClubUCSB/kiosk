var T_GRACE_PERIOD = 60*60*24*7;

var log_access = function(user) {
	$.ajax({
		url: './welcome/fall-2013/'+JSON.stringify(user),
		dataType: 'json',
		success: function(json) {
			console.log(json);
		},
	});
};

$(document).ready(function() {
	Quip.good('ready');

	new RfidScanner(
		function(rfid) {

			if(!/^[0-9]{10}$/.test(rfid)) return Quip.warn('Whoops! Try that again');

			DB.get('rfid@(rfid=?)', rfid)
			.ready(function(entries) {

				if(!entries.length) return Quip.error('Tag was not found in the system');

				var entry = entries[0];
				switch(entry.table) {

					// user scans their rfid tag
					case 'user':
						DB.get('user@m_id,fullname,email,phone,status,type,date_expires,date_joined(m_id=?)', entry.t_id)
							.ready(function(userResults) {
								if(!userResults.length) return Quip.error('Missing user record - user does not exist');
								
								var user = userResults[0];
								if(user.type == 'staff') {
									if(user.status == 'active') {
										log_access(user);
										return Quip.good('Staffer is good to go');
									}
									else {
										return Quip.error('Staffer is '+user.status);
									}
								}
								else {
									if(user.status == 'active') {
										var now = new Date().getTime();
										var expires = user.date_expires*1000;
										if(expires < (now - T_GRACE_PERIOD)) {
											return Quip.error(user.fullname+'\'s membership expired '+(new Date(expires)).toLocaleDateString());
										}
										else {
											SDB.get('access_log@(use=?,info=?)', 'fall-2013', JSON.stringify(user))
											.ready(function(accessResults) {
												if(accessResults.length) {
													var access_time = accessResults[0].date*1000;
													return Quip.error('This tag was already used to get in @ '+(new Date(access_time).toLocaleTimeString()));
												}
												else {
													log_access(user);
													return Quip.good('Welcome '+user.fullname+'.');
												}
											});
										}

									}
									else {
										return Quip.error(user.fullname+' is '+user.status);
									}
								}
							});
						break;

					case 'gear':
						return Quip.error('That tag belongs to a piece of gear! Not a member!');
						break;

					default:
						return Quip.error('That tag is for '+entry.table);
						break;
				}
			});
		}
	);
});