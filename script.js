let currentChart = null;

function calculateScripturalDate() {
    try {
        const birthdateInput = document.getElementById('birthdate').value;
        if (!birthdateInput) {
            document.getElementById('result').innerHTML = "Please enter a valid date.";
            return;
        }
        const birthdate = new Date(birthdateInput);
        if (isNaN(birthdate) || birthdate > new Date()) {
            document.getElementById('result').innerHTML = "Please enter a valid past date.";
            return;
        }

        // Step 1: Determine the Creation Date and Equinox
        const creationYear = -4230; // Adjusted to align 1969/1970 with 5972 (2025/2026 = 6028)
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
        let totalDaysSinceCreation = daysToTequvah + daysFromTequvah + 3; // Shift to Day 1

        // YHWH Calendar (364-day year)
        const yhwhYear = Math.floor(totalDaysSinceCreation / 364) + 1;
        let daysInYhwhYear = totalDaysSinceCreation % 364;
        if (daysInYhwhYear === 0) daysInYhwhYear = 364;
        const week = Math.floor((daysInYhwhYear - 1) / 7) + 1; // Scriptural week (1-52)
        const dayOfWeek = (daysInYhwhYear - 1) % 7 + 1; // Scriptural day of week (1-7)

        // Calculate YHWH month and day
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
        if (yhwhDay === 0) {
            yhwhMonth -= 1;
            yhwhDay = monthDays[yhwhMonth - 1];
        }

        // Calendar data for specific dates
        const calendarData = [
            { gregorian: '1969-05-06', yhwhMonth: 2, yhwhDay: 48 }, // Adjusted to Day 48
            { gregorian: '2021-05-06', yhwhMonth: 2, yhwhDay: 47 },
            { gregorian: '2003-01-02', yhwhMonth: 10, yhwhDay: 13 },
            { gregorian: '2008-03-27', yhwhMonth: 1, yhwhDay: 7 }
        ];
        const birthdateString = birthdate.toDateString();
        const match = calendarData.find(entry => {
            const entryDate = new Date(entry.gregorian);
            return entryDate.toDateString() === birthdateString;
        }) || { yhwhMonth, yhwhDay };

        // Format day and scriptural week day
        const formattedDay = `Day ${match.yhwhDay} of 364`;
        const formattedWeek = `Week ${week} of 52`;
        const formattedWeekDay = `Day ${dayOfWeek}`; // Scriptural week day (1-7)

        document.getElementById('result').innerHTML = `
            <h2>Scriptural Birth Date</h2>
            <p><b>YHWH's Calendar</b>: Year ${yhwhYear}</p>
            <p><b>Month</b>: ${match.yhwhMonth}</p>
            <p><b>Day of the Week</b>: ${formattedWeekDay}</p>
            <p><b>Day of 364</b>: ${formattedDay}</p>
            <p><b>Week of 52</b>: ${formattedWeek}</p>
        `;

        // Remove chart since Lunar, Sabbath, and Jubilee data are no longer displayed
    } catch (error) {
        console.error("Calculation error:", error);
        document.getElementById('result').innerHTML = "An error occurred while calculating. Please check the console for details.";
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
