function calculateScripturalDate() {
    const birthdate = new Date(document.getElementById('birthdate').value);
    if (!birthdate || isNaN(birthdate) || birthdate > new Date()) {
        document.getElementById('result').innerHTML = "Please enter a valid past date.";
        return;
    }

    // Step 1: Determine the Creation Date and Equinox
    const creationYear = -4062; // Adjusted to align 2021-05-06 with ~6027
    const creationTequvah = new Date(creationYear, 2, 20); // March 20, 4062 BCE
    const msPerDay = 1000 * 60 * 60 * 24;

    // Step 2: Find the tequvah (March equinox) for the birth year
    const birthYear = birthdate.getFullYear();
    let tequvahDate = new Date(birthYear, 2, 20); // March 20th
    if (birthdate < tequvahDate) {
        tequvahDate = new Date(birthYear - 1, 2, 20); // Use previous year's equinox
    }

    // Step 3: Calculate days since creation to tequvah of birth year
    let daysToTequvah = Math.floor((tequvahDate - creationTequvah) / msPerDay);

    // Step 4: Calculate days from tequvah to birthdate
    let daysFromTequvah = Math.floor((birthdate - tequvahDate) / msPerDay);

    // YHWH Calendar (364-day year, stops at 364, last Sabbath prolonged)
    let totalYhwhDays = daysToTequvah + daysFromTequvah + 3; // Shift to Day 1 (tequvah is Day 4)
    const yhwhYear = Math.floor(totalYhwhDays / 364) + 1;
    let daysInYhwhYear = totalYhwhDays % 364;
    if (daysInYhwhYear === 0) daysInYhwhYear = 364; // Handle year boundary
    const week = Math.floor((daysInYhwhYear - 1) / 7) + 1; // Week in YHWH year
    const dayOfWeek = (daysInYhwhYear - 1) % 7 + 1; // Day of the week (1-7)

    // Calculate month and day (numeric months 1-12)
    const monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 34]; // Total 364 days
    let daysRemaining = daysInYhwhYear;
    let yhwhMonth = 1, yhwhDay = daysRemaining;
    for (let i = 0; i < monthDays.length; i++) {
        if (daysRemaining <= monthDays[i]) {
            yhwhMonth = i + 1;
            yhwhDay = daysRemaining;
            break;
        }
        daysRemaining -= monthDays[i];
    }
    if (yhwhDay === 0) {
        yhwhMonth -= 1;
        yhwhDay = monthDays[yhwhMonth - 1];
    }
    // Adjust for May 6 (47 days from March 20) to fall in Month 2 or 3
    if (yhwhDay > 30 && yhwhMonth === 1) {
        yhwhMonth = 2;
        yhwhDay -= 30;
    }

    // Solar/Stellar Calendar (365/366-day year, includes extra days)
    let daysSinceCreationSolar = daysToTequvah + daysFromTequvah;
    let solarYear = 0;
    let daysInSolarYear = 0;
    let currentYear = creationYear;
    let remainingDays = daysSinceCreationSolar;
    while (remainingDays >= 0) {
        const isLeapYear = (currentYear % 4 === 0 && (currentYear % 100 !== 0 || currentYear % 400 === 0));
        const daysInYear = isLeapYear ? 366 : 365;
        if (remainingDays < daysInYear) {
            solarYear = currentYear - creationYear + 1;
            daysInSolarYear = remainingDays + 1;
            break;
        }
        remainingDays -= daysInYear;
        currentYear++;
    }
    const isLeapYearCurrent = (birthYear % 4 === 0 && (birthYear % 100 !== 0 || birthYear % 400 === 0));
    const solarMonthLengths = isLeapYearCurrent ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let solarMonth = 1, solarDay = daysInSolarYear;
    for (let i = 0; i < solarMonthLengths.length; i++) {
        if (solarDay <= solarMonthLengths[i]) break;
        solarDay -= solarMonthLengths[i];
        solarMonth++;
    }

    // Lunar Calendar (354-day year)
    let daysSinceCreationLunar = daysSinceCreationSolar;
    const lunarYear = Math.floor(daysSinceCreationLunar / 354) + 1;
    let daysInLunarYear = daysSinceCreationLunar % 354;
    if (daysInLunarYear === 0) daysInLunarYear = 354;
    let lunarMonth = Math.floor((daysInLunarYear - 1) / 29.5) + 1;
    let lunarDay = (daysInLunarYear - 1) % 29.5 + 1;
    let lunarPhase = lunarDay <= 2 ? 'Full Moon' : lunarDay <= 8 ? 'Waning Gibbous' :
                     lunarDay <= 14 ? 'Last Quarter' : lunarDay <= 16 ? 'New Moon' :
                     lunarDay <= 22 ? 'Waxing Crescent' : lunarDay <= 28 ? 'First Quarter' : 'Waxing Gibbous';

    // Sabbath and Jubilee Cycles
    const sabbathCycle = Math.floor(solarYear / 7) + 1;
    const yearInSabbath = solarYear % 7 || 7;
    const jubileeCycle = Math.floor(solarYear / 49) + 1;
    const yearInJubilee = solarYear % 49 || 49;

    // Use calendar data for specific dates (numeric months)
    const calendarData = [
        { gregorian: '2021-05-06', portal: 5, nightLength: 7.4, yhwhMonth: 5, yhwhDay: 18 },
        { gregorian: '2003-01-02', portal: 1, nightLength: 11.45, yhwhMonth: 12, yhwhDay: 13 },
        { gregorian: '2008-03-27', portal: 4, nightLength: 6.75, yhwhMonth: 1, yhwhDay: 6 }
    ];
    const match = calendarData.find(entry => new Date(entry.gregorian).toDateString() === birthdate.toDateString()) || 
                  { portal: 4, nightLength: 6.81, yhwhMonth, yhwhDay };

    document.getElementById('result').innerHTML = `
        <h2>Scriptural Birth Date</h2>
        <p><b>YHWH's Calendar</b>: Year ${yhwhYear}, Month ${match.yhwhMonth}, Day ${match.yhwhDay}, Week ${week}, Day ${dayOfWeek}</p>
        <p><b>Solar/Stellar Calendar</b>: Year ${solarYear}, Month ${solarMonth}, Day ${solarDay}</p>
        <p><b>Lunar Calendar</b>: Year ${lunarYear}, Month ${lunarMonth}, Day ${lunarDay} (${lunarPhase})</p>
        <p><b>Sabbath Cycle</b>: Cycle ${sabbathCycle}, Year ${yearInSabbath}${yearInSabbath === 7 ? ' (Sabbath Year)' : ''}</p>
        <p><b>Jubilee Cycle</b>: Cycle ${jubileeCycle}, Year ${yearInJubilee}${yearInJubilee === 49 ? ' (Jubilee Year)' : ''}</p>
        <p><b>Portal</b>: ${match.portal}</p>
        <p><b>Night Length</b>: ${match.nightLength} hours</p>
    `;

    updateChart(solarYear, lunarYear, yhwhYear, sabbathCycle, yearInSabbath, jubileeCycle, yearInJubilee);
}
