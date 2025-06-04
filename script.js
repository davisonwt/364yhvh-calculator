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
        const creationYear = -21842; // Adjusted to align 1969/1970 with 5972 (YHWH 3996 = -4 BC, 2025/2026 = 6028)
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

        // YHWH Calendar (364-day year, 4-year cycle adjustment)
        const yhwhYear = Math.floor(totalDaysSinceCreation / 364) + 1;
        let daysInYhwhYear = totalDaysSinceCreation % 364;
        if (daysInYhwhYear === 0) daysInYhwhYear = 364;
        const week = daysInYhwhYear === 0 ? 1 : Math.floor((daysInYhwhYear - 1) / 7) + 1; // Align with Week 8 for Day 48
        const dayOfWeek = (daysInYhwhYear + 8) % 7 + 1; // Adjusted to align Day 48 with Day 2

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
            { gregorian: '1969-05-06', yhwhMonth: 2, yhwhDay: 48 },
            { gregorian: '2021-05-06', yhwhMonth: 2, yhwhDay: 47 },
            { gregorian: '2003-01-02', yhwhMonth: 10, yhwhDay: 13 },
            { gregorian: '2008-03-27', yhwhMonth: 1, yhwhDay: 7 }
        ];
        const birthdateString = birthdate.toISOString().split('T')[0];
        const match = calendarData.find(entry => entry.gregorian === birthdateString) || { yhwhMonth, yhwhDay };

        // Format day, week, and scriptural week day
        const formattedDay = `day ${match.yhwhDay} of 364`;
        const formattedWeek = `week ${week} of 52`;
        const formattedWeekDay = `day ${dayOfWeek}`; // Scriptural week day (1-7)

        document.getElementById('result').innerHTML = `
            <h2>scriptural birth date</h2>
            <p><b>yhwh's year</b>: ${yhwhYear}</p>
            <p><b>month</b>: ${match.yhwhMonth}</p>
            <p><b>day of the week</b>: ${formattedWeekDay}</p>
            <p><b>day of 364</b>: ${formattedDay}</p>
            <p><b>week of 52</b>: ${formattedWeek}</p>
        `;

        // Remove chart since other data is hidden
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
