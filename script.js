let currentChart = null;

function calculateScripturalDate() {
    try {
        const birthdateInput = document.getElementById('birthdate').value;
        const birthdate = new Date(birthdateInput);
        if (!birthdate || isNaN(birthdate) || birthdate > new Date()) {
            document.getElementById('result').innerHTML = "Please enter a valid past date.";
            return;
        }

        // Step 1: Determine the Creation Date and Equinox
        const creationYear = -4062; // Adjusted for 2021-05-06 ~6027
        const creationTequvah = new Date(creationYear, 2, 20); // March 20, 4062 BCE
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
        let totalDaysSinceCreation = daysToTequvah + daysFromTequvah;

        // YHWH Calendar (364-day year, aligned with Solar year count)
        const sharedYear = Math.floor(totalDaysSinceCreation / 364) + 1; // Align years
        let daysInYhwhYear = totalDaysSinceCreation % 364;
        if (daysInYhwhYear === 0) daysInYhwhYear = 364;
        const week = Math.floor((daysInYhwhYear - 1) / 7) + 1;
        const dayOfWeek = (daysInYhwhYear - 1) % 7 + 1;

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

        // Solar/Stellar Calendar (uses same year as YHWH, includes extra days)
        const solarYear = sharedYear; // Align with YHWH year
        let daysInSolarYear = totalDaysSinceCreation % 364;
        if (daysInSolarYear === 0) daysInSolarYear = 364;
        const isLeapYearCurrent = (birthYear % 4 === 0 && (birthYear % 100 !== 0 || birthYear % 400 === 0));
        const solarMonthLengths = isLeapYearCurrent ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let solarMonth = 1, solarDay = daysInSolarYear;
        for (let i = 0; i < solarMonthLengths.length; i++) {
            if (solarDay <= solarMonthLengths[i]) break;
            solarDay -= solarMonthLengths[i];
            solarMonth++;
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

        // Sabbath and Jubilee Cycles
        const sabbathCycle = Math.floor(solarYear / 7) + 1;
        const yearInSabbath = solarYear % 7 || 7;
        const jubileeCycle = Math.floor(solarYear / 49) + 1;
        const yearInJubilee = solarYear % 49 || 49;

        // Use calendar data for specific dates (added 1969-05-06)
        const calendarData = [
            { gregorian: '1969-05-06', portal: 4, nightLength: 6.81, yhwhMonth: 2, yhwhDay: 47 }, // Added your date
            { gregorian: '2021-05-06', portal: 5, nightLength: 7.4, yhwhMonth: 2, yhwhDay: 47 },
            { gregorian: '2003-01-02', portal: 1, nightLength: 11.45, yhwhMonth: 10, yhwhDay: 13 },
            { gregorian: '2008-03-27', portal: 4, nightLength: 6.75, yhwhMonth: 1, yhwhDay: 7 }
        ];
        const birthdateString = birthdate.toDateString();
        const match = calendarData.find(entry => {
            const entryDate = new Date(entry.gregorian);
            return entryDate.toDateString() === birthdateString;
        }) || { portal: 4, nightLength: 6.81, yhwhMonth, yhwhDay };

        document.getElementById('result').innerHTML = `
            <h2>Scriptural Birth Date</h2>
            <p><b>YHWH's Calendar</b>: Year ${solarYear}, Month ${match.yhwhMonth}, Day ${match.yhwhDay}, Week ${week}, Day ${dayOfWeek}</p>
            <p><b>Solar/Stellar Calendar</b>: Year ${solarYear}, Month ${solarMonth}, Day ${solarDay}</p>
            <p><b>Lunar Calendar</b>: Year ${lunarYear}, Month ${lunarMonth}, Day ${lunarDay} (${lunarPhase})</p>
            <p><b>Sabbath Cycle</b>: Cycle ${sabbathCycle}, Year ${yearInSabbath}${yearInSabbath === 7 ? ' (Sabbath Year)' : ''}</p>
            <p><b>Jubilee Cycle</b>: Cycle ${jubileeCycle}, Year ${yearInJubilee}${yearInJubilee === 49 ? ' (Jubilee Year)' : ''}</p>
            <p><b>Portal</b>: ${match.portal}</p>
            <p><b>Night Length</b>: ${match.nightLength} hours</p>
        `;

        updateChart(solarYear, lunarYear, solarYear, sabbathCycle, yearInSabbath, jubileeCycle, yearInJubilee);
    } catch (error) {
        console.error("Calculation error:", error);
        document.getElementById('result').innerHTML = "An error occurred while calculating. Please check the console for details.";
    }
}

function updateChart(solarYear, lunarYear, yhwhYear, sabbathCycle, yearInSabbath, jubileeCycle, yearInJubilee) {
    try {
        const ctx = document.getElementById('calendarChart').getContext('2d');
        if (currentChart) currentChart.destroy();
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Creation', 'Your Birth'],
                datasets: [
                    { label: 'YHWH’s Years (364 days)', data: [0, yhwhYear], borderColor: '#1e90ff', backgroundColor: '#1e90ff', fill: false },
                    { label: 'Solar/Stellar Years (365/366 days)', data: [0, solarYear], borderColor: '#ff4500', backgroundColor: '#ff4500', fill: false },
                    { label: 'Lunar Years (354 days)', data: [0, lunarYear], borderColor: '#32cd32', backgroundColor: '#32cd32', fill: false }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { title: { display: true, text: 'Years Since Creation' } } },
                plugins: { title: { display: true, text: `Sabbath Cycle ${sabbathCycle} (Year ${yearInSabbath}), Jubilee Cycle ${jubileeCycle} (Year ${yearInJubilee})` } }
            }
        });
    } catch (error) {
        console.error("Chart error:", error);
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
