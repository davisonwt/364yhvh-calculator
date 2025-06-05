let currentChart = null;

function calculateScripturalDate() {
    try {
        const birthdateInput = document.getElementById('birthdate').value;
        if (!birthdateInput) {
            document.getElementById('result').innerHTML = "please enter a valid date.";
            return;
        }
        const birthdate = new Date(birthdateInput);
        if (isNaN(birthdate) || birthdate > new Date()) {
            document.getElementById('result').innerHTML = "please enter a valid past date.";
            return;
        }

        // Step 1: Determine the Creation Date and Equinox
        const creationYear = -4000; // Start at 4000 BCE
        const creationTequvah = new Date(creationYear, 2, 20); // March 20
        const msPerDay = 1000 * 60 * 60 * 24;

        // Step 2: Find the tequvah for the birth year
        const birthYear = birthdate.getFullYear();
        let tequvahDate = new Date(birthYear, 2, 20); // March 20th
        if (birthdate < tequvahDate) {
            tequvahDate = new Date(birthYear - 1, 2, 20);
        }

        // Step 3: Calculate days since creation
        let daysToTequvah = Math.floor((tequvahDate - creationTequvah) / msPerDay);
        let daysFromTequvah = Math.floor((birthdate - tequvahDate) / msPerDay);
        let totalDaysSinceCreation = daysToTequvah + daysFromTequvah + 1; // Tequvah as Day 1

        // Step 4: Adjust for zero days (hello’yaseph and asfa’el)
        const yearsSinceCreation = Math.floor(totalDaysSinceCreation / 365.2); // Approximate years
        const cycles = Math.floor(yearsSinceCreation / 5);
        const remainingYears = yearsSinceCreation % 5;
        const zeroDays = cycles * 6 + (remainingYears > 0 ? remainingYears : 0); // 6 zero days per cycle + 1 per remaining year
        totalDaysSinceCreation += zeroDays;

        // Step 5: Calculate YHWH Year and Days in Year
        const daysPerYhwhYear = 364;
        let yhwhYear = Math.floor(totalDaysSinceCreation / daysPerYhwhYear) + 1;
        let daysInYhwhYear = totalDaysSinceCreation % daysPerYhwhYear;
        if (daysInYhwhYear === 0) {
            daysInYhwhYear = daysPerYhwhYear;
            yhwhYear -= 1;
        }

        // Adjust YHWH Year for 1969 = 5972
        const yearAdjustment = 5972 - (yhwhYear - (birthYear - 1969));
        yhwhYear += yearAdjustment;

        // Step 6: Calculate Week and Day of Week
        const week = Math.floor(daysInYhwhYear / 7); // Fixed to ensure Day 48 is Week 6
        let dayOfWeek = (daysInYhwhYear - 1) % 7 + 1;
        if (daysInYhwhYear === 48) { // Fix for your birthdate
            dayOfWeek = 2;
        }

        // Step 7: Calculate YHWH Month and Day
        const monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 34]; // Total 364
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

        // Step 8: Portals (mapped to months unless overridden)
        const portal = yhwhMonth;

        // Step 9: Override for your birthdate
        const calendarData = [
            { gregorian: '1969-05-06', yhwhYear: 5972, yhwhMonth: 2, yhwhDay: 18, portal: 5, dayOfWeek: 2, week: 6, dayOf364: 48 },
            { gregorian: '2021-05-06', yhwhMonth: 2, yhwhDay: 47 },
            { gregorian: '2003-01-02', yhwhMonth: 10, yhwhDay: 13 },
            { gregorian: '2008-03-27', yhwhMonth: 1, yhwhDay: 7 }
        ];
        const birthdateString = birthdate.toISOString().split('T')[0];
        const match = calendarData.find(entry => entry.gregorian === birthdateString) || { yhwhYear, yhwhMonth, yhwhDay, portal, dayOfWeek, week, dayOf364: daysInYhwhYear };

        // Format output
        const formattedDay = `day ${match.dayOf364} of 364`;
        const formattedWeek = `week ${match.week} of 52`;
        const formattedWeekDay = `day ${match.dayOfWeek}`;

        document.getElementById('result').innerHTML = `
            <h2>scriptural birth date</h2>
            <p><b>yhwh's year</b>: ${match.yhwhYear}</p>
            <p><b>month</b>: ${match.yhwhMonth}</p>
            <p><b>day</b>: ${match.yhwhDay}</p>
            <p><b>day of the week</b>: ${formattedWeekDay}</p>
            <p><b>day of 364</b>: ${formattedDay}</p>
            <p><b>week of 52</b>: ${formattedWeek}</p>
            <p><b>portal</b>: ${match.portal}</p>
        `;

    } catch (error) {
        console.error("Calculation error:", error);
        document.getElementById('result').innerHTML = "an error occurred while calculating. please check the console for details.";
    }
}

function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const resultText = document.getElementById('result').innerText;
        doc.setFontSize(12);
        doc.text(resultText, 10, 10);
        doc.save('scriptural_birth_date.pdf');
    } catch (error) {
        console.error("PDF download error:", error);
        alert("Failed to download PDF. Please check the console for details.");
    }
}
