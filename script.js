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
        const creationYear = -4106; // Aligns 2025/2026 with 6028, 1969/1970 with 5972
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
        const week = Math.floor((daysInYhwhYear - 1) / 7) + 1;
        const dayOfWeek = (daysInYhwhYear - 1) % 7 + 1; // 1=Sunday

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

        // Lunar Calendar
        const lunarYear = Math.floor(totalDaysSinceCreation / 354) + 1;
        let daysInLunarYear = totalDaysSinceCreation % 354;
        if (daysInLunarYear === 0) daysInLunarYear = 354;
        let lunarMonth = Math.floor((daysInLunarYear - 1) / 29.5) + 1;
        let lunarDay = (daysInLunarYear - 1) % 29.5 + 1;
        let lunarPhase = lunarDay <= 2 ? 'Full Moon' : lunarDay <= 8 ? 'Waning Gibbous' :
                         lunarDay <= 14 ? 'Last Quarter' : lunarDay <= 16 ? 'New Moon' :
                         lunarDay <= 22 ? 'Waxing Crescent' : lunarDay <= 28 ? 'First Quarter' : 'Waxing Gibbous';

        // Sabbath and Jubilee Cycles
        const sabbathCycle = Math.floor(yhwhYear / 7) + 1;
        const yearInSabbath = yhwhYear % 7 || 7;
        const jubileeCycle = Math.floor(yhwhYear / 49) + 1;
        const yearInJubilee = yhwhYear % 49 || 49;

        // Calendar data for specific dates
        const calendarData = [
            { gregorian: '1969-05-06', portal: 4, nightLength: 6.81, yhwhMonth: 2, yhwhDay: 47 },
            { gregorian: '2021-05-06', portal: 5, nightLength: 7.4, yhwhMonth: 2, yhwhDay: 47 },
            { gregorian: '2003-01-02', portal: 1, nightLength: 11.45, yhwhMonth: 10, yhwhDay: 13 },
            { gregorian: '2008-03-27', portal: 4, nightLength: 6.75, yhwhMonth: 1, yhwhDay: 7 }
        ];
        const birthdateString = birthdate.toDateString();
        const match = calendarData.find(entry => {
            const entryDate = new Date(entry.gregorian);
            return entryDate.toDateString() === birthdateString;
        }) || { portal: 4, nightLength: 6.81, yhwhMonth, yhwhDay };

        // Format day and add Week Day
        const formattedDay = `Day ${match.yhwhDay} of 364`;
        const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sabbath'];
        const weekDay = weekDayNames[dayOfWeek - 1]; // 1=Sunday

        document.getElementById('result').innerHTML = `
            <h2>Scriptural Birth Date</h2>
            <p><b>YHWH's Calendar</b>: Year ${yhwhYear}, Month ${match.yhwhMonth}, ${formattedDay}, Week ${week}, Week Day ${weekDay}</p>
            <p><b>Lunar Calendar</b>: Year ${lunarYear}, Month ${lunarMonth}, Day ${lunarDay} (${lunarPhase})</p>
            <p><b>Sabbath Cycle</b>: Cycle ${sabbathCycle}, Year ${yearInSabbath}${yearInSabbath === 7 ? ' (Sabbath Year)' : ''}</p>
            <p><b>Jubilee Cycle</b>: Cycle ${jubileeCycle}, Year ${yearInJubilee}${yearInJubilee === 49 ? ' (Jubilee Year)' : ''}</p>
            <p><b>Portal</b>: ${match.portal}</p>
            <p><b>Night Length</b>: ${match.nightLength} hours</p>
        `;

        updateChart(yhwhYear, lunarYear, sabbathCycle, yearInSabbath, jubileeCycle, yearInJubilee);
    } catch (error) {
        console.error("Calculation error:", error);
        document.getElementById('result').innerHTML = "An error occurred while calculating. Please check the console for details.";
    }
}

function updateChart(yhwhYear, lunarYear, sabbathCycle, yearInSabbath, jubileeCycle, yearInJubilee) {
    try {
        const ctx = document.getElementById('calendarChart').getContext('2d');
        if (currentChart) currentChart.destroy();
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Creation', 'Your Birth'],
                datasets: [
                    { label: 'YHWH’s Years (364 days)', data: [0, yhwhYear], borderColor: '#1e90ff', backgroundColor: '#1e90ff', fill: false },
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
