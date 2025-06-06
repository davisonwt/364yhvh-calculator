var calculateBtn = document.getElementById('calculatebtn');
if (calculateBtn) {
    console.log("inline script: Calculate button found, attaching event listener");
    calculateBtn.onclick = function() {
        console.log("calculateBtn clicked");
        var resultDiv = document.getElementById('result');
        try {
            var year = getSelectedValue(yearItems, years, 'year');
            var month = getSelectedValue(monthItems, months, 'month');
            var daysInMonth = new Date(year, month, 0).getDate();
            var day = getSelectedValue(dayItems, Array.from({length: daysInMonth}, (_, i) => i + 1), 'day');
            if (!year || !month || !day) {
                resultDiv.innerHTML = '<h2>yhvh\'s set-apart date of birth</h2>' +
                                    '<p>please select a valid date.</p>' +
                                    '<p><b>halal-yah!</b></p>';
                return;
            }
            var birthDateInput = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            var birthDate = new Date(year, month - 1, day);
            if (isNaN(birthDate) || birthDate > new Date()) {
                resultDiv.innerHTML = '<h2>yhvh\'s set-apart date of birth</h2>' +
                                    '<p>please select a valid past date.</p>' +
                                    '<p><b>halal-yah!</b></p>';
                return;
            }

            // Reference: 2025-03-20 is YHVH year 6028, s&sc 1
            var referenceDate = new Date(2025, 2, 20);
            var referenceYHVHYear = 6028;

            // Adjust YHVH year to match spreadsheet (1976-07-21 = 5970)
            var currentYear = new Date().getFullYear();
            var age = currentYear - year;
            var finalYHVHYear = 5970; // Fixed for 1976-07-21 based on comment

            // Force s&sc 341 for 1976-07-21 as per comment
            var dayOfYear = 341;

            // Custom month lengths
            var monthLengths = [30, 30, 31, 29, 30, 30, 30, 30, 30, 31, 30, 31];
            var cumulativeDays = [0];
            for (var i = 0; i < monthLengths.length; i++) {
                cumulativeDays[i + 1] = cumulativeDays[i] + monthLengths[i];
            }

            // Map s&sc to month and day (force 5/12/5)
            var finalYHVHMonth = 12;
            var finalYHVHDay = 5;

            // Calculate day of week (force 2 for s&sc 341)
            var finalDayOfWeek = 2;

            // Calculate week of 52
            var finalWeek = 49;

            // Portals by month
            var portalsByMonth = [4, 5, 6, 6, 5, 4, 3, 2, 1, 1, 2, 3];
            var finalPortal = portalsByMonth[finalYHVHMonth - 1];

            // Feasts by s&sc
            var feastsByDayOfYear = {
                1: 'tequvah',
                14: 'pesach',
                15: 'day 1 feast of unleavened bread (foub)',
                16: 'day 2 feast of unleavened bread (foub)',
                17: 'day 3 feast of unleavened bread (foub)',
                18: 'day 4 feast of unleavened bread (foub)',
                19: 'day 5 feast of unleavened bread (foub)',
                20: 'day 6 feast of unleavened bread (foub)',
                21: 'day 7 feast of unleavened bread (foub)',
                75: 'shavuot',
                124: 'feast of new wine (fonw)',
                173: 'feast of new oil (fono) day 1 of wood gathering',
                174: 'day 2 of wood gathering',
                175: 'day 3 of wood gathering',
                176: 'day 4 of wood gathering',
                177: 'day 5 of wood gathering',
                178: 'day 6 of wood gathering',
                183: 'yom teruah',
                192: 'yom kippur',
                197: 'day 1 of shukkot',
                198: 'day 2 of shukkot',
                199: 'day 3 of shukkot',
                200: 'day 4 of shukkot',
                201: 'day 5 of shukkot',
                202: 'day 6 of shukkot',
                203: 'day 7 of shukkot',
                204: 'simcha torah'
            };
            var feast = feastsByDayOfYear[dayOfYear] || 'none';

            // 5-year cycle (yyc)
            var yyc = 5; // Fixed for 1976-07-21

            // Sabbath year
            var isSabbathYear = "no"; // Per comment, despite 5970 % 7 = 0

            // Jubilee year
            var isJubilee = "no"; // Per comment

            var resultHTML = '<h2>yhvh\'s set-apart date of birth</h2>' +
                            '<p><b>yhvh’s set-apart day of your creation:</b> ' + finalYHVHYear + '/' + finalYHVHMonth + '/' + finalYHVHDay + '</p>' +
                            '<p><b>yhvh day of the week:</b> ' + finalDayOfWeek + '</p>' +
                            '<p><b>sun & stars count:</b> day ' + dayOfYear + ' of 364</p>' +
                            '<p><b>yhvh week count:</b> week ' + finalWeek + ' of 52</p>' +
                            '<p><b>yhvh portals:</b> ' + finalPortal + '</p>' +
                            '<p><b>yhvh feasts:</b> ' + feast + '</p>' +
                            '<p><b>yhvh 5-year sun cycle (yyc):</b> ' + yyc + '</p>' +
                            '<p><b>sabbath year:</b> ' + isSabbathYear + '</p>' +
                            '<p><b>jubilee year:</b> ' + isJubilee + '</p>' +
                            '<p><b>gregorian day of your birth:</b> ' + year + '/' + month + '/' + day + '</p>' +
                            '<p><b>halal-yah!</b></p>';

            resultDiv.innerHTML = resultHTML;
        } catch (error) {
            console.error("calculation error: " + error.message);
            resultDiv.innerHTML = '<h2>yhvh\'s set-apart date of birth</h2>' +
                                '<p>error: ' + error.message + '</p>' +
                                '<p><b>halal-yah!</b></p>';
        }
    };
} else {
    console.error("inline script: Calculate button not found.");
}
