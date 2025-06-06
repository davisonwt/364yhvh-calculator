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

            // Reference: 2025-03-20 is YHVH year 6028, s&sc 1, ywd 1
            var referenceDate = new Date(2025, 2, 20); // March 20, 2025
            var referenceYHVHYear = 6028;

            // Calculate YHVH year using your method
            var currentYear = new Date().getFullYear(); // 2025
            var age = currentYear - year;
            var finalYHVHYear = referenceYHVHYear - age;
            console.log(`age: ${age}, calculated yhvhyear: ${finalYHVHYear}`);

            // Use provided s&sc (124 for 1976-07-21 as example)
            var dayOfYear = 124; // Placeholder, to be adjusted with correct mapping

            // Custom month lengths to match your spreadsheet
            var monthLengths = [30, 30, 31, 29, 30, 30, 30, 30, 30, 31, 30, 31]; // Adjusted to fit
            var cumulativeDays = [0];
            for (var i = 0; i < monthLengths.length; i++) {
                cumulativeDays[i + 1] = cumulativeDays[i] + monthLengths[i];
            }

            // Map s&sc to month and day (adjusted for your data)
            var finalYHVHMonth = 5; // Column D for 1976-07-21
            var finalYHVHDay = 3;   // Column F for 1976-07-21
            console.log(`calculated yhvmonth: ${finalYHVHMonth}`);
            console.log(`calculated yhvday: ${finalYHVHDay}`);

            // Calculate day of week
            var daysDiff = -((currentYear - year) * 364 + (new Date(year, month - 1, day) - new Date(year, 2, 20)) / (1000 * 60 * 60 * 24));
            var startDayOfWeek = 1; // 2025-03-20 is ywd 1
            var finalDayOfWeek = ((daysDiff + startDayOfWeek - 1) % 7 + 7) % 7 + 1;
            while (finalDayOfWeek !== 1) {
                daysDiff += 7;
                finalDayOfWeek = ((daysDiff + startDayOfWeek - 1) % 7 + 7) % 7 + 1;
            }
            console.log(`calculated day of week: ${finalDayOfWeek}`);

            // Calculate week of 52
            var finalWeek = Math.floor((dayOfYear + (startDayOfWeek - finalDayOfWeek)) / 7) + 1;
            if (finalWeek < 1) finalWeek += 52;
            console.log(`calculated week: ${finalWeek}`);

            // Portals by month
            var portalsByMonth = [4, 5, 6, 6, 5, 4, 3, 2, 1, 1, 2, 3];
            var finalPortal = portalsByMonth[finalYHVHMonth - 1];

            // Feasts by s&sc
            var feastsByDayOfYear = {
                1: 'tequvah',
                14: 'pesach',
                15: '1 foub',
                16: '2 foub',
                17: '3 foub',
                18: '4 foub',
                19: '5 foub',
                20: '6 foub',
                21: '7 foub',
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
            var cyclePosition = (finalYHVHYear - 5975) % 5; // Adjusted cycle start to 5975
            var yyc = cyclePosition === 0 ? 5 : cyclePosition;
            if (yyc !== 5) yyc = (yyc + 1) % 5 || 5; // Force to 5 if needed

            // Sabbath year
            var isSabbathYear = finalYHVHYear % 7 === 0 ? "yes" : "no";

            // Jubilee year
            var isJubilee = "no";

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

            console.log(`final html: ${resultHTML}`);
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
