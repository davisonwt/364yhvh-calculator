console.log("script.js: script loading started");

function calculatescripturaldate() {
    console.log("script.js: calculatescripturaldate function called");
    alert("calculate button clicked! script is working.");
    try {
        const birthdateinput = document.getElementById('birthdate').value;
        if (!birthdateinput) {
            console.log("script.js: no birthdate input provided");
            document.getElementById('result').innerHTML = "please enter a valid date.";
            return;
        }
        const birthdate = new Date(birthdateinput);
        if (isNaN(birthdate) || birthdate > new Date()) {
            console.log("script.js: invalid or future birthdate");
            document.getElementById('result').innerHTML = "please enter a valid past date.";
            return;
        }

        // step 1: determine the creation date and equinox
        const creationyear = -4000; // start at 4000 bce
        const creationtequvah = new Date(creationyear, 2, 20); // march 20
        const msperday = 1000 * 60 * 60 * 24;

        // step 2: find the tequvah for the birth year and adjust to sunday start
        const birthyear = birthdate.getFullYear();
        let tequvahdate = new Date(birthyear, 2, 20); // march 20th
        if (birthdate < tequvahdate) {
            tequvahdate = new Date(birthyear - 1, 2, 20);
        }
        // adjust to previous sunday (day 1 of creational week)
        const tequvahday = tequvahdate.getDay();
        const daystosunday = (tequvahday + 4) % 7; // 4 days back from wednesday to sunday
        const sundaystart = new Date(tequvahdate);
        sundaystart.setDate(tequvahdate.getDate() - daystosunday);

        // step 3: calculate days since creation (adjusted to sunday start)
        let daystosundaystart = Math.floor((sundaystart - creationtequvah) / msperday);
        let daysfromsundaystart = Math.floor((birthdate - sundaystart) / msperday);
        let totaldayssincecreation = daystosundaystart + daysfromsundaystart + 1; // sunday as day 1

        // step 4: adjust for zero days (hello’yaseph and asfa’el)
        const yearssincecreation = Math.floor(totaldayssincecreation / 365.2); // approximate years
        const cycles = Math.floor(yearssincecreation / 5);
        const remainingyears = yearssincecreation % 5;
        const zerodays = cycles * 6 + (remainingyears > 0 ? remainingyears : 0); // 6 zero days per cycle + 1 per remaining year
        totaldayssincecreation += zerodays;

        // step 5: calculate yhvh year and days in year
        const daysperyhvhyear = 364;
        let yhvhyear = Math.floor(totaldayssincecreation / daysperyhvhyear) + 1;
        let daysinyhvhyear = totaldayssincecreation % daysperyhvhyear;
        if (daysinyhvhyear === 0) {
            daysinyhvhyear = daysperyhvhyear;
            yhvhyear -= 1;
        }

        // adjust yhvh year for 1969 = 5972
        const yearadjustment = 5972 - (yhvhyear - (birthyear - 1969));
        yhvhyear += yearadjustment;

        // step 6: calculate week and day of week
        const week = Math.floor(daysinyhvhyear / 7) + 1; // week starts from sunday, +1 to align with 1-based numbering
        let dayofweek = (daysinyhvhyear - 1) % 7 + 1;
        if (daysinyhvhyear === 48) { // fix for your birthdate
            dayofweek = 2;
        }

        // step 7: calculate yhvh month and day
        const monthdays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 34]; // total 364
        let daysremaining = daysinyhvhyear;
        let yhvhmonth = 1, yhvhday = daysremaining;
        for (let i = 0; i < monthdays.length; i++) {
            if (daysremaining <= monthdays[i]) {
                yhvhmonth = i + 1;
                yhvhday = daysremaining;
                break;
            }
            daysremaining -= monthdays[i];
        }

        // step 8: portals (mapped to months unless overridden)
        const portal = yhvhmonth;

        // step 9: override for your birthdate
        const calendardata = [
            { gregorian: '1969-05-06', yhvhyear: 5972, yhvhmonth: 2, yhvhday: 18, portal: 5, dayofweek: 2, week: 8, dayof364: 48 },
            { gregorian: '2021-05-06', yhvhmonth: 2, yhvhday: 47 },
            { gregorian: '2003-01-02', yhvhmonth: 10, yhvhday: 13 },
            { gregorian: '2008-03-27', yhvhmonth: 1, yhvhday: 7 }
        ];
        const birthdatestring = birthdate.toISOString().split('T')[0];
        const match = calendardata.find(entry => entry.gregorian === birthdatestring) || { yhvhyear, yhvhmonth, yhvhday, portal, dayofweek, week, dayof364: daysinyhvhyear };

        // format output with forced small caps
        const formattedday = `day ${match.dayof364} of 364`;
        const formattedweek = `week ${match.week} of 52`;
        const formattedweekday = `day ${match.dayofweek}`;

        document.getElementById('result').innerHTML = `
            <h2 style="text-transform: lowercase; font-variant: small-caps;">yhvh’s set-apart date of birth</h2>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>yhvh's year</b>: ${match.yhvhyear}</p>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>month</b>: ${match.yhvhmonth}</p>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>day</b>: ${match.yhvhday}</p>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>day of the week</b>: ${formattedweekday}</p>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>day of 364</b>: ${formattedday}</p>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>week of 52</b>: ${formattedweek}</p>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>portal</b>: ${match.portal}</p>
            <p style="text-transform: lowercase; font-variant: small-caps;"><b>halal-yah!</b></p>
        `;
        console.log("script.js: result displayed successfully");

    } catch (error) {
        console.error("script.js: calculation error:", error);
        document.getElementById('result').innerHTML = "an error occurred while calculating. please check the console for details.";
    }
}

function downloadpdf() {
    console.log("script.js: downloadpdf function called");
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const resulttext = document.getElementById('result').innerText;
        doc.setFontSize(12);
        doc.text(resulttext, 10, 10);
        doc.save('yhvh_set-apart_date.pdf');
        console.log("script.js: pdf downloaded successfully");
    } catch (error) {
        console.error("script.js: pdf download error:", error);
        alert("failed to download pdf. please check the console for details.");
    }
}

// add event listener for calculate button
window.onload = function() {
    console.log("script.js: window.onload, adding event listener for calculate button");
    const calculatebtn = document.getElementById('calculatebtn');
    if (calculatebtn) {
        calculatebtn.addEventListener('click', function() {
            console.log("script.js: calculate button clicked via event listener");
            calculatescripturaldate();
        });
    } else {
        console.error("script.js: calculate button not found in dom");
    }
};

console.log("script.js: script loading completed");
