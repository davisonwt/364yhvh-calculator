let currentChart = null;

function calculateScripturalDate() {
    try {
        const birthdateInput = document.getElementById('birthdate').value;
        const birthdate = new Date(birthdateInput);
        if (!birthdateInput || isNaN(birthdate) || birthdate > new Date()) {
            document.getElementById('result').innerHTML = "Please enter a valid past date.";
            return;
        }

        // Step 1: Determine the Creation Date and Equinox
        const creationYear = -4106; // Adjusted to align 2025/2026 with 6028, 1969/1970 with 5972
        const creationTequvah = new Date(creationYear, 2, 20); // March 20
        const msPerDay = 1000 * 60 * 60 * 24;

        // Step 2: Find the tequvah (March equinox) for the birth year
        const birthYear = birthdate.getFullYear();
        let tequvahDate = new Date(birthYear, 2, 20); // March 20th
        if (birthdate < tequvahDate) {
            tequvahDate = new Date(birthYear - 1, 2, 20);
        }

        // Step 3: Calculate days since creation to tequvah of birth year
        let daysToTequvah = Math.floor((tequvahDate - creationTequvah) / msPerDay);

        // Step 4: Calculate days from tequvah to birthdate
        let daysFromTequvah = Math.floor((birthdate - tequvahDate) / msPerDay);

        // Step 5: Calculate total days since creation
        let totalDaysSinceCreation = daysToTequvah + daysFromTequvah + 3; // Shift to Day 1 (tequvah is Day 4)

        // YHWH Calendar (364-day year)
        const yhwhYear = Math.floor(totalDaysSinceCreation / 364) + 1;
        let daysInYhwhYear = totalDaysSinceCreation % 364;
        if (daysInYhwhYear === 0) daysInYhwhYear = 364;
        const week = Math.floor((daysInYhwhYear - 1) / 7) + 1; // Week in YHWH year
        const dayOfWeek = (daysInYhwhYear - 1) % 7 + 1; // Day of the week (1-7, 1=Sunday)

        // Calculate YHWH month and day (numeric months 1-12)
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

        // Lunar Calendar (354-day year)
        const lunarYear = Math.floor(totalDaysSinceCreation / 354) + 1;
        let daysInLunarYear = totalDaysSinceCreation % 354;
        if (daysInLunarYear === 0) daysInLunarYear = 354;
        let lunarMonth = Math.floor((daysInLunarYear - 1) / 29.5) + 1;
        let lunarDay = (daysInLunarYear - 1) % 29.5 + 1;
        let lunarPhase = lunarDay <= 2 ? 'Full Moon' : lunarDay <= 8 ? 'Waning Gibbous' :
                         lunarDay <= 14 ? 'Last Quarter' : lunarDay <= 16 ? 'New Moon' :
                         lunarDay <= 22 ? 'Waxing Crescent' : lunarDay <= 28 ? 'First Quarter' : 'Waxing Gibbous';

        // Sabbath and Jubilee Cycles (based on YHWH years)
        const sabbathCycle = Math.floor(yhwhYear / 7) + 1;
        const yearInSabbath = yhwhYear % 7 || 7;
        const jubileeCycle = Math.floor(yhwhYear / 49) + 1;
        const yearInJubilee = yhwhYear % 49 || 49;

        // Use calendar data for specific dates
        const calendarData = [
            { gregorian: '1969-05-06', portal: 4, nightLength: 6.81, yhwhMonth: 2, yhwhDay: 47 },
            { gregorian: '2021-05-06', portal: 5, nightLength: 7
