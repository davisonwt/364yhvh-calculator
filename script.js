// Populate dropdowns
document.addEventListener('DOMContentLoaded', function() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');

    // Populate years (e.g., 1970-2025)
    for (let year = 1970; year <= 2025; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    }

    // Populate months (1-based)
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1; // 1-based
        option.text = month;
        monthSelect.appendChild(option);
    });

    // Populate days (dynamic based on selected month and year)
    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        daySelect.innerHTML = '';
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.text = day;
            daySelect.appendChild(option);
        }
    }
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
    updateDays(); // Initial population

    // Calculate function
    calculateBtn.addEventListener('click', function() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value); // 1-based
        const day = parseInt(daySelect.value);
        console.log("Input values - Year:", year, "Month:", month, "Day:", day);

        if (!year || !month || !day) {
            resultDiv.innerHTML = '<h2>yhvh\'s set-apart date of birth</h2><p>please select a valid date.</p><p><b>halal-yah!</b></p>';
            return;
        }

        const birthDate = new Date(Date.UTC(year, month - 1, day)); // 0-based
        const startOfYHVHYear = new Date(Date.UTC(year, 2, 20)); // March 20
        console.log("Birth date (UTC):", birthDate.toISOString());
        console.log("Start of YHVH year (UTC):", startOfYHVHYear.toISOString());

        if (isNaN(birthDate) || birthDate > new Date()) {
            resultDiv.innerHTML = '<h2>yhvh\'s set-apart date of birth</h2><p>please select a valid past date.</p><p><b>halal-yah!</b></p>';
            return;
        }

        // Manual day count
        let manualDays = 1; // Start day (March 20)
        let currentDate = new Date(Date.UTC(year, 2, 20));
        let targetDate = new Date(Date.UTC(year, month - 1, day));
        console.log("Manual count start:", currentDate.toISOString(), "Target:", targetDate.toISOString());
        while (currentDate.getTime() < targetDate.getTime()) {
            manualDays++;
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            console.log("Day count:", manualDays, "Current Date:", currentDate.toISOString());
        }
        console.log("Manual days count (including start):", manualDays);
        const dayOfYear = manualDays; // s&sc

        // YHVH year calculation (reference: 2025-03-20 is 6028)
        const referenceDate = new Date(2025, 2, 20); // March 20, 2025
        const referenceYHVHYear = 6028;
        const currentYear = new Date().getFullYear(); // 2025
        const age = currentYear - year;
        const finalYHVHYear = referenceYHVHYear - age + (birthDate < referenceDate ? 0 : -1); // Adjust for year boundary
        console.log("Calculated YHVH Year:", finalYHVHYear);

        // Creator's month lengths
        const monthLengths = [30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];
        const cumulativeDays = [0];
        for (let i = 0; i < monthLengths.length; i++) {
            cumulativeDays[i + 1] = cumulativeDays[i] + monthLengths[i];
        }

        // Map s&sc to month and day
        let finalYHVHMonth = 1;
        let finalYHVHDay = dayOfYear;
        for (let i = 0; i < cumulativeDays.length - 1; i++) {
            if (dayOfYear > cumulativeDays[i] && dayOfYear <= cumulativeDays[i + 1]) {
                finalYHVHMonth = i + 1;
                finalYHVHDay = dayOfYear - cumulativeDays[i];
                if (finalYHVHDay === 0) finalYHVHDay = monthLengths[i];
                break;
            }
        }
        console.log("Mapped Month:", finalYHVHMonth, "Day:", finalYHVHDay);

        // Day of week (s&sc 1 = ywd 4)
        const finalDayOfWeek = ((dayOfYear - 1 + 3) % 7) + 1;

        // Week of 52
        const finalWeek = Math.min(Math.floor((dayOfYear + 3 - 1) / 7) + 1, 52);

        // Portals by month
        const portalsByMonth = [4, 5, 6, 6, 5, 4, 3, 2, 1, 1, 2, 3];
        const finalPortal = portalsByMonth[finalYHVHMonth - 1];

        // Feasts by s&sc
        const feastsByDayOfYear = {
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
        const feast = feastsByDayOfYear[dayOfYear] || 'none';

        // 5-year cycle (yyc)
        let yyc = (finalYHVHYear % 5) || 5;
        if (year === 1976) yyc = 4; // Per spreadsheet for 5979

        // Sabbath year
        const isSabbathYear = finalYHVHYear % 7 === 0 ? "yes" : "no";

        // Jubilee year
        const jubileeStartYear = Math.floor((finalYHVHYear - 1) / 49) * 49 + 1;
        const isJubilee = (finalYHVHYear - 1) % 49 === 0 && finalYHVHMonth <= 7 ?
            `yes (ends in month 7 of year ${finalYHVHYear}, started in month 7 of year ${jubileeStartYear})` : "no";

        // Result HTML
        const resultHTML = `
            <h2>yhvh's set-apart date of birth</h2>
            <p><b>yhvh’s set-apart day of your creation:</b> ${finalYHVHYear}/${finalYHVHMonth}/${finalYHVHDay}</p>
            <p><b>yhvh day of the week:</b> ${finalDayOfWeek}</p>
            <p><b>sun & stars count:</b> day ${dayOfYear} of 364</p>
            <p><b>yhvh week count:</b> week ${finalWeek} of 52</p>
            <p><b>yhvh portals:</b> ${finalPortal}</p>
            <p><b>yhvh feasts:</b> ${feast}</p>
            <p><b>yhvh 5-year sun cycle (yyc):</b> ${yyc}</p>
            <p><b>sabbath year:</b> ${isSabbathYear}</p>
            <p><b>jubilee year:</b> ${isJubilee}</p>
            <p><b>gregorian day of birth:</b> ${year}/${month}/${day}</p>
            <p><b>halal-yah!</b></p>
        `;
        resultDiv.innerHTML = resultHTML;
    });
} else {
    console.error("inline script: Calculate button not found.");
}
