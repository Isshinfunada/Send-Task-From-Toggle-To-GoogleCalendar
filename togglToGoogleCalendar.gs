function togglToGoogleCalendar() {
  var scriptProperties = PropertiesService.getScriptProperties();

  // スクリプトプロパティから取得
  var togglApiKey = scriptProperties.getProperty('TOGGL_API_KEY');
  var calendarId = scriptProperties.getProperty('CALENDAR_ID');
  var workspaceId = scriptProperties.getProperty('WORKSPACE_ID');

  // 実行日を転記対象日とする
  var targetDate = new Date(); // 今日の日付
  var dateString = Utilities.formatDate(targetDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'); // 転記対象日

  var togglUrl = `https://api.track.toggl.com/reports/api/v2/details?workspace_id=${workspaceId}&since=${dateString}&until=${dateString}&user_agent=api_test`; 

  var options = {
    method: 'get',
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(togglApiKey + ':api_token')
    },
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(togglUrl, options);
  var data = JSON.parse(response.getContentText());

  var entries = data.data;

  if (!entries || entries.length === 0) {
    Logger.log('No entries found for the specified date.');
    return;
  }

  var taskFromToggleCalendar = CalendarApp.getCalendarsByName('Isshin Funada Task Log')[0]; // TaskFromToggleカレンダーを取得

  entries.forEach(function(entry) {
    var startTime = new Date(entry.start);
    var endTime = new Date(entry.end);
    var description = entry.description;
    var title = description; 

    // TaskFromToggleカレンダーにイベントを追加
    taskFromToggleCalendar.createEvent(title, startTime, endTime, {
      description: '' 
    });
  });
}
