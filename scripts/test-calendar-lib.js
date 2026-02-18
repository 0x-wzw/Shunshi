const { Solar, Lunar } = require('lunar-javascript');

function test(solarYear, solarMonth, solarDay) {
    const solar = Solar.fromYmd(solarYear, solarMonth, solarDay);
    const lunar = solar.getLunar();
    // In 6tail/lunar-javascript, month is positive. If it's a leap month, getMonth() returns the month, but there's no native isLeap() maybe?
    // Actually, looking at docs: lunar.getMonth() is the month.
    // To check if it's a leap month: we need to check if it's the 2nd of two same months.
    // There is getLeapMonth() on the year? No.
    // Let's print all properties.
    console.log(`Solar: ${solarYear}-${solarMonth}-${solarDay}`);
    console.log(`Lunar: ${lunar.getYear()}-${lunar.getMonth()}-${lunar.getDay()}`);
    // console.log("Lunar Keys:", Object.keys(lunar)); // Might be empty if they use getters/prototypes

    // According to some sources, it's lunar.getMonth() > 0 usually.
    // If it's a leap month, lunar.getMonth() reflects the index.
    // Let's try to find if there's a property that tells us.
    // Some versions have lunar.isLeap()? Maybe it was a property?
    // Let's try to find it.
}

console.log("Exploring Lunar properties for 2023-04-01 (should be leap 2nd month if around there):");
test(2023, 4, 1);

function testLunar(year, month, day, isLeap) {
    try {
        // Some libraries use negative month for input
        const lunar = Lunar.fromYmd(year, isLeap ? -month : month, day);
        const solar = lunar.getSolar();
        console.log(`Lunar: ${year}-${month}-${day} (Leap: ${isLeap}) -> Solar: ${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`);
    } catch (e) {
        console.log(`Error testing Lunar ${year}-${month}-${day} Leap: ${isLeap}: ${e.message}`);
    }
}

// Check 2023 March/April which has leap month 2
console.log("\nTesting Leap Input:");
testLunar(2023, 2, 1, false);
testLunar(2023, 2, 1, true); 
